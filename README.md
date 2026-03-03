# select-csv

The fastest, simplest, and most powerful CSV parser for Node.js.
Optimized for high performance and extreme memory efficiency when
handling massive datasets (100M+ rows).

`select-csv` converts `.csv` files into arrays, JSON objects, or raw
lines. It provides two main entry points: `parseCsv` (for local files)
and `parseText` (for raw strings), both sharing the same
high-performance methods.

------------------------------------------------------------------------

## 🌟 Key Features

-   **Ultra-Lightweight:** Minimal package size with zero dependencies.\
-   **Fast Mode:** Synchronous execution for maximum speed and zero
    overhead.\
-   **Memory Efficient:** Streams large files using chunks instead of
    loading everything into RAM.\
-   **Smart Tracking:** Remembers its position in the file for seamless
    sequential reading.\
-   **Flexible Options:** Highly customizable (headers, json mapping,
    custom delimiters).

------------------------------------------------------------------------

## Install

``` bash
npm install select-csv
```

------------------------------------------------------------------------

## API Reference & Detailed Examples

### 1. Initialization Functions

#### `parseCsv(file_path, [options])`

-   **file_path** (Required - String): The path to your CSV file.\
-   **options** (Optional - Object): Configuration for parsing.

#### `parseText(text, [options])`

-   **text** (Required - String): The raw CSV content.\
-   **options** (Optional - Object): Configuration for parsing.

------------------------------------------------------------------------

## ⚙️ The `options` Object (All Optional)

| Property    | Type    | Default | Description |
|-------------|---------|---------|-------------|
| header      | Boolean | true    | Treat the first line as column titles. |
| delimiter   | String  | ","     | Character that separates values. Set to false for raw lines. |
| linebreak   | String  | "\r\n"  | The character(s) used for line endings. |
| json        | Boolean | false   | If true, returns rows as Objects instead of Arrays. |
| bufferSize  | Number  | 1MB     | (File only) Chunk size in bytes read from disk. |

------------------------------------------------------------------------

## 🔍 Detailed Method Examples

### A. `.get()` - Fetch Everything

Returns all rows from the current position to the end of the file.

``` javascript
const { parseCsv } = require("select-csv");
const parser = parseCsv('data.csv');

const result = parser.get();
console.log(result.rows); 
// Output: [ ["1", "John"], ["2", "Jane"] ]
```

------------------------------------------------------------------------

### B. `.chunk(size)` - Batch Processing

Reads a specific number of rows and updates the internal cursor. This is
the best way to handle huge files.

-   **size** (Required - Integer): Number of rows to fetch.

``` javascript
const parser = parseCsv('huge.csv');

const batch1 = parser.chunk(2); // Gets rows 1 and 2
const batch2 = parser.chunk(2); // Gets rows 3 and 4
console.log(batch2.row_count); // 2
```

------------------------------------------------------------------------

### C. `.rowOffset(from, [to])` - Range Selection

Fetches a range of rows without moving the internal cursor.

-   **from** (Required - Integer): Starting row index (starts at 0).\
-   **to** (Optional - Integer): Ending row index.

``` javascript
const parser = parseCsv('data.csv');

// Get rows from index 10 to 15 only
const specificRows = parser.rowOffset(10, 15);
```

------------------------------------------------------------------------

### D. `json: true` - Object Mapping

When enabled, each row becomes a JavaScript object using the header as
keys.

``` javascript
const parser = parseCsv('users.csv', { header: true, json: true });
const result = parser.chunk(1);

/* Result: 
{ 
  rows: [ { "id": "1", "name": "Sara", "age": "25" } ] 
}
*/
```

------------------------------------------------------------------------

### E. `delimiter: false` - Raw Line Reading

If you want to read lines as full strings without splitting them into
columns.

``` javascript
const parser = parseCsv('logs.txt', { delimiter: false });
const result = parser.get();
// result.rows -> [ "2023-10-01 ERROR: System crash", "2023-10-01 INFO: Rebooting" ]
```

------------------------------------------------------------------------

### F. `.getInfo()` - Tracking State

Returns the current internal state of the parser.

``` javascript

const info = parse.getInfo();
console.log(info);

/* Console Output:
{
  "offset": 1240,     // Current byte position in file
  "rowOffset": 10,    // Current row index
  "option": { ... }   // All active settings
}
*/
```
------------------------------------------------------------------------

## 🚀 High-Performance Example (100M+ Rows)

This library shines when you need to process millions of rows with
minimal RAM usage:

``` javascript
const { parseCsv } = require("select-csv");

const parser = parseCsv('massive_dataset.csv', {
    header: true,
    bufferSize: 2 * 1024 * 1024 // 2MB Buffer
});

let batch;
while (true) {
    batch = parser.chunk(100000); // Process 100k rows per loop
    if (batch.rows.length === 0) break;
    
    // Memory stays low (~50MB) even for 10GB files!
    console.log(`Processing batch... Time taken: ${batch.time}`);
}
```

------------------------------------------------------------------------

## License

MIT License - Created with speed in mind.
