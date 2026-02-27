const fs = require("fs");

/**
 * Custom Error Handler
 */
function throwErr(msg) {
    console.error(`[select-csv Error]: ${msg}`);
    const err = new Error("");
    const stack = err.stack.split('\n').slice(2).join('\n');
    console.error(stack);
    process.exit(1);
}

class CsvParser {
    constructor(data, option, isCsv, column, fd = null) {
        this.data = data;
        this.option = option;
        this.isCsv = isCsv; // Boolean: true if file, false if text
        this.column = column;
        this.fd = fd;
        this.bufferSize = option.bufferSize || 1024 * 1024;

        // Initialize Header and Offsets
        const gc = this._getColumns();
        this.hdr = gc.columns;
        this.startOffsRow = gc.offset;
        
        // Internal state: [byteOffset, rowNumber]
        this.currentPos = [this.startOffsRow, 0];
        
        // JSON mapping
        this.jsonKeys = (this.option.header && this.option.json) ? this.hdr : null;
    }

    /**
     * Reads a chunk from file
     */
    _readSync(offs) {
        const buffer = Buffer.alloc(this.bufferSize);
        const bytesRead = fs.readSync(this.fd, buffer, 0, this.bufferSize, offs);
        return bytesRead > 0 ? [bytesRead, buffer.toString()] : [0, ''];
    }

    /**
     * Internal method to extract columns/header
     */
    _getColumns() {
        let columns = this.option.header ? [] : false;
        let offset = 0;
        let workingData = this.data;

        if (this.option.header) {
            let lineBreakPos = workingData.indexOf(this.option.linebreak);
            
            // If file and linebreak not in initial buffer, read more
            if (this.isCsv && lineBreakPos === -1) {
                let fileOffs = 0;
                let bytesRead = 1;
                while (bytesRead > 0 && lineBreakPos === -1) {
                    const [read, moreData] = this._readSync(fileOffs);
                    bytesRead = read;
                    fileOffs += bytesRead;
                    workingData += moreData;
                    lineBreakPos = workingData.indexOf(this.option.linebreak);
                }
            }

            if (lineBreakPos !== -1) {
                const headerLine = workingData.slice(0, lineBreakPos);
                if (this.option.delimiter) {
                    columns = headerLine.split(this.option.delimiter);
                } else {
                    columns = [headerLine];
                }
                offset = lineBreakPos + this.option.linebreak.length;
            } else {
                offset = workingData.length;
            }
        }
        return { columns, offset };
    }

    /**
     * Main Parsing Logic
     */
    _parseRows(chunkSize, fromRow = null, toRow = null) {
        let rows = [];
        let count = 0;
        let currentIdx = 0; // Local index in current data string
        let byteOffset = this.isCsv ? this.currentPos[0] : 0;
        let rowTracker = this.isCsv ? this.currentPos[1] : 0;
        
        let workingData = "";

        // Setup initial data
        if (this.isCsv) {
            const [read, d] = this._readSync(byteOffset);
            workingData = d;
        } else {
            workingData = this.data;
            currentIdx = fromRow !== null ? 0 : this.currentPos[0];
        }

        const { linebreak, delimiter, quote } = this.option;
        const lbLen = linebreak.length;

        // Target range logic
        const isTargeted = fromRow !== null;
        let n = isTargeted ? 0 : rowTracker;

        while (true) {
            let lbIdx = workingData.indexOf(linebreak, currentIdx);

            // Handle file streaming if linebreak not found
            if (lbIdx === -1 && this.isCsv) {
                let [read, more] = this._readSync(byteOffset + workingData.length);
                if (read > 0) {
                    workingData += more;
                    continue;
                } else {
                    lbIdx = workingData.length; // End of file
                }
            }

            if (lbIdx === -1) break;

            // Check if we should process this row
            const shouldProcess = isTargeted ? (n >= fromRow && n < (toRow || Infinity)) : true;

            if (shouldProcess) {
                let line = workingData.slice(currentIdx, lbIdx);
                let rowData;

                if (delimiter) {
                    // Basic split or logic can be expanded here for complex quotes
                    rowData = line.split(delimiter);
                    
                    // JSON Transform
                    if (this.jsonKeys) {
                        let obj = {};
                        this.jsonKeys.forEach((key, i) => obj[key] = rowData[i] || "");
                        rowData = obj;
                    }
                } else {
                    rowData = [line];
                }

                rows.push(rowData);
                count++;
            }

            currentIdx = lbIdx + lbLen;
            n++;

            // Break conditions
            if (chunkSize && count >= chunkSize) break;
            if (toRow && n >= toRow) break;
            if (lbIdx === workingData.length) break;
        }

        // Update state
        if (!isTargeted) {
            this.currentPos = [byteOffset + currentIdx, n];
        }

        return { rows, row_count: count };
    }

    get() {
        const t = Date.now();
        const result = this._parseRows(null, 0);
        return {
            time: `${Date.now() - t} ms`,
            header: this.option.header ? this.hdr : false,
            ...result
        };
    }

    chunk(size) {
        if (!Number.isInteger(size) || size < 1) throwErr("Chunk size must be an integer >= 1");
        const t = Date.now();
        const result = this._parseRows(size);
        return {
            time: `${Date.now() - t} ms`,
            header: this.option.header ? this.hdr : false,
            ...result
        };
    }

    rowOffset(from, to) {
        if (!Number.isInteger(from) || from < 0) throwErr("Offset 'from' must be integer >= 0");
        const t = Date.now();
        const result = this._parseRows(null, from, to);
        return {
            time: `${Date.now() - t} ms`,
            header: this.option.header ? this.hdr : false,
            ...result
        };
    }

    getInfo() {
        return {
            offset: this.currentPos[0],
            rowOffset: this.currentPos[1],
            option: this.option
        };
    }

    header() {
        return this.hdr;
    }
}

/**
 * Factory functions
 */
function parseCsv(file_path, opt = {}) {
    if (!file_path || typeof file_path !== 'string') throwErr("File path must be a string");
    if (!fs.existsSync(file_path)) throwErr(`File "${file_path}" not found`);

    const defaultOpt = {
        header: true,
        quote: false,
        linebreak: '\r\n',
        delimiter: ",",
        json: false,
        bufferSize: 1024 * 1024
    };
    const finalOpt = { ...defaultOpt, ...opt };
    const fd = fs.openSync(file_path, 'r');
    
    // Initial read for header
    const buffer = Buffer.alloc(finalOpt.bufferSize);
    fs.readSync(fd, buffer, 0, finalOpt.bufferSize, 0);

    return new CsvParser(buffer.toString(), finalOpt, true, !!finalOpt.delimiter, fd);
}

function parseText(text, opt = {}) {
    if (typeof text !== 'string') throwErr("Input text must be a string");

    const defaultOpt = {
        header: true,
        quote: false,
        linebreak: '\r\n',
        delimiter: ",",
        json: false
    };
    const finalOpt = { ...defaultOpt, ...opt };

    return new CsvParser(text, finalOpt, false, !!finalOpt.delimiter);
}

module.exports = { parseCsv, parseText };