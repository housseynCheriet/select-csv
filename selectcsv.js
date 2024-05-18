const fs = require("fs");

function Err(msg) {
    try {
        throw Error("");
    } catch (e) {
        console.log("    Error:", msg)
        let es = e.stack
        let i = es.indexOf('\n', (es.indexOf('\n') + 1));
        console.log(es.slice(i))
        process.exit()
    }
}

function getData(fd, bufferSize, offs) {
    let bytesRead, buffer = Buffer.alloc(bufferSize);
    if ((bytesRead = fs.readSync(fd, buffer, 0, bufferSize, offs)) !== 0) {
        return [bytesRead, String(buffer)]
    } else return [0, '']
}

function getRowsChunk(data, chunk, info, offs_n) {
    let {
        header,
        linebreak,
        quote,
        col,
        d,
        csv,
        oJson
    } = info
    let lLbr = linebreak.length,
        offsFd,
        xs, x0
    let fd, bSize, bytesRead, data2
    if (csv) {
        [fd, bSize] = csv
        offsFd = xs = offs_n[0]
        x0 = 0;
        [bytesRead, data2] = getData(fd, bSize, offsFd)
        offsFd += bytesRead
        data = data2
    } else {
        xs = 0
        x0 = offs_n[0]
    }
    x1 = data.indexOf(linebreak, x0)
    let m = 2,
        n = 0;
    let sbstr = sbstr2 = "",
        rows = [],
        cols = []
    let q0, q1;
    while (m) {
        if (col) {
            let lDlm = d.length;
            if (oJson) {
                let j;
                cols = {}
                if (quote) {
                    while (x1 != -1) {
                        sbstr = data.slice(x0, x1)
                        q1 = sbstr.indexOf('"');
                        j = 0
                        if (q1 != -1) {
                            y0 = 0, y1 = sbstr.indexOf(d);
                            while (y1 != -1) {
                                sbstr2 = sbstr.slice(y0, y1)
                                if (y1 < q1) {
                                    cols[oJson[j]] = sbstr2
                                    y0 = y1 + lDlm
                                    y1 = sbstr.indexOf(d, y0);
                                } else {
                                    z = y0;
                                    q0 = q1 + lDlm
                                    q1 = sbstr.indexOf('"', q0);
                                    if (q1 != -1) {
                                        y1 = sbstr.indexOf(d, q1 + lDlm);
                                        q1 = sbstr.indexOf('"', y1 + lDlm);
                                        if (q1 == -1) q1 = sbstr.length
                                    } else {
                                        y1 = sbstr.indexOf(d, q0);
                                    }
                                }
                                j++;
                            }
                        } else {
                            y0 = 0, y1 = sbstr.indexOf(d);
                            while (y1 != -1) {
                                sbstr2 = sbstr.slice(y0, y1)
                                cols[oJson[j]] = sbstr2
                                y0 = y1 + lDlm
                                y1 = sbstr.indexOf(d, y0);
                                j++;
                            }
                        }
                        if (y0) {
                            cols[oJson[j]] = sbstr.slice(y0)
                            rows.push(cols)
                        }
                        cols = {}
                        n++;
                        if (n >= chunk) break
                        x0 = x1 + lLbr
                        x1 = data.indexOf(linebreak, x0);
                    }
                } else {
                    while (x1 != -1) {
                        sbstr = data.slice(x0, x1)
                        y0 = 0, y1 = sbstr.indexOf(d);
                        j = 0
                        while (y1 != -1) {
                            sbstr2 = sbstr.slice(y0, y1)
                            cols[oJson[j]] = sbstr2
                            y0 = y1 + lDlm
                            y1 = sbstr.indexOf(d, y0);
                            j++;
                        }
                        if (y0) {
                            cols[oJson[j]] = sbstr.slice(y0)
                            rows.push(cols)
                        }
                        cols = {}
                        n++;
                        if (n >= chunk) break
                        x0 = x1 + lLbr
                        x1 = data.indexOf(linebreak, x0);
                    }
                }
            } else {
                if (quote) {
                    while (x1 != -1) {
                        sbstr = data.slice(x0, x1)
                        q1 = sbstr.indexOf('"');
                        if (q1 != -1) {
                            y0 = 0, y1 = sbstr.indexOf(d);
                            while (y1 != -1) {
                                sbstr2 = sbstr.slice(y0, y1)
                                if (y1 < q1) {
                                    cols.push(sbstr2)
                                    y0 = y1 + lDlm
                                    y1 = sbstr.indexOf(d, y0);
                                } else {
                                    z = y0;
                                    q0 = q1 + lDlm
                                    q1 = sbstr.indexOf('"', q0);
                                    if (q1 != -1) {
                                        y1 = sbstr.indexOf(d, q1 + lDlm);
                                        q1 = sbstr.indexOf('"', y1 + lDlm);
                                        if (q1 == -1) q1 = sbstr.length
                                    } else {
                                        y1 = sbstr.indexOf(d, q0);
                                    }
                                }
                            }
                        } else {
                            y0 = 0, y1 = sbstr.indexOf(d);
                            while (y1 != -1) {
                                sbstr2 = sbstr.slice(y0, y1)
                                cols.push(sbstr2)
                                y0 = y1 + lDlm
                                y1 = sbstr.indexOf(d, y0);
                            }
                        }
                        if (y0) {
                            cols.push(sbstr.slice(y0))
                            rows.push(cols)
                        }
                        cols = []
                        n++;
                        if (n >= chunk) break
                        x0 = x1 + lLbr
                        x1 = data.indexOf(linebreak, x0);
                    }
                } else {
                    while (x1 != -1) {
                        sbstr = data.slice(x0, x1)
                        y0 = 0, y1 = sbstr.indexOf(d);
                        while (y1 != -1) {
                            sbstr2 = sbstr.slice(y0, y1)
                            cols.push(sbstr2)
                            y0 = y1 + lDlm
                            y1 = sbstr.indexOf(d, y0);
                        }
                        if (y0) {
                            cols.push(sbstr.slice(y0))
                            rows.push(cols)
                        }
                        cols = []
                        n++;
                        if (n >= chunk) break
                        x0 = x1 + lLbr
                        x1 = data.indexOf(linebreak, x0);
                    }
                }
            }
        } else {
            while (x1 != -1) {
                cols.push(data.slice(x0, x1))
                rows.push(cols)
                cols = []
                n++;
                if (n >= chunk) break
                x0 = x1 + lLbr
                x1 = data.indexOf(linebreak, x0);
            }
        }
        if (n >= chunk) {
            x0 = x1 + lLbr
            break
        }
        m--;
        if (x1 == -1) {
            if (m) {
                if (csv) {
                    bytesRead = 1;
                    data = data.slice(x0)
                    xs += x0;
                    x0 = 0
                    while (bytesRead && x1 == -1) {
                        [bytesRead, data2] = getData(fd, bSize, offsFd)
                        offsFd += bytesRead;
                        data += data2;
                        x1 = data.indexOf(linebreak)
                    }
                    if (x1 == -1) x1 = data.length;
                    if (bytesRead) m++;
                } else x1 = data.length;
            } else x0 = x1 = data.length;
        }
    }
    return {
        get: {
            rows: rows,
            row_count: n
        },
        offs: [xs + x0, n + offs_n[1]],
        row_count: n
    };
}

function getAllRows(data, info, sO_R) {
    let {
        header,
        linebreak,
        quote,
        col,
        d,
        csv,
        oJson
    } = info
    let lLbr = linebreak.length,
        offsFd,
        xs = x0 = sO_R,
        x1;
    let fd, bSize, bytesRead,
        data2
    if (csv) {
        [fd, bSize] = csv
        offsFd = data.length
        bytesRead = 1
    }
    x1 = data.indexOf(linebreak, x0)
    let m = 2,
        n = 0;
    let sbstr = sbstr2 = "",
        rows = [],
        cols = []
    let q0, q1;
    while (m) {
        if (col) {
            let lDlm = d.length;
            if (oJson) {
                let j;
                cols = {}
                if (quote) {
                    while (x1 != -1) {
                        sbstr = data.slice(x0, x1)
                        q1 = sbstr.indexOf('"');
                        if (q1 != -1) {
                            y0 = 0, y1 = sbstr.indexOf(d);
                            j = 0
                            while (y1 != -1) {
                                sbstr2 = sbstr.slice(y0, y1)
                                if (y1 < q1) {
                                    cols[oJson[j]] = sbstr2
                                    y0 = y1 + lDlm
                                    y1 = sbstr.indexOf(d, y0);
                                } else {
                                    z = y0;
                                    q0 = q1 + lDlm
                                    q1 = sbstr.indexOf('"', q0);
                                    if (q1 != -1) {
                                        y1 = sbstr.indexOf(d, q1 + lDlm);
                                        q1 = sbstr.indexOf('"', y1 + lDlm);
                                        if (q1 == -1) q1 = sbstr.length
                                    } else {
                                        y1 = sbstr.indexOf(d, q0);
                                    }
                                }
                                j++;
                            }
                        } else {
                            y0 = 0, y1 = sbstr.indexOf(d);
                            j = 0
                            while (y1 != -1) {
                                sbstr2 = sbstr.slice(y0, y1)
                                cols[oJson[j]] = sbstr2
                                y0 = y1 + lDlm
                                y1 = sbstr.indexOf(d, y0);
                                j++;
                            }
                        }
                        if (y0) {
                            cols[oJson[j]] = sbstr.slice(y0)
                            rows.push(cols)
                        }
                        cols = {}
                        x0 = x1 + lLbr
                        x1 = data.indexOf(linebreak, x0);
                        n++;
                    }
                } else {
                    while (x1 != -1) {
                        sbstr = data.slice(x0, x1)
                        y0 = 0, y1 = sbstr.indexOf(d);
                        j = 0
                        while (y1 != -1) {
                            sbstr2 = sbstr.slice(y0, y1)
                            cols[oJson[j]] = sbstr2
                            y0 = y1 + lDlm
                            y1 = sbstr.indexOf(d, y0);
                            j++;
                        }
                        if (y0) {
                            cols[oJson[j]] = sbstr.slice(y0)
                            rows.push(cols)
                        }
                        cols = {}
                        x0 = x1 + lLbr
                        x1 = data.indexOf(linebreak, x0);
                        n++;
                    }
                }
            } else {
                if (quote) {
                    while (x1 != -1) {
                        sbstr = data.slice(x0, x1)
                        q1 = sbstr.indexOf('"');
                        if (q1 != -1) {
                            y0 = 0, y1 = sbstr.indexOf(d);
                            while (y1 != -1) {
                                sbstr2 = sbstr.slice(y0, y1)
                                if (y1 < q1) {
                                    cols.push(sbstr2)
                                    y0 = y1 + lDlm
                                    y1 = sbstr.indexOf(d, y0);
                                } else {
                                    z = y0;
                                    q0 = q1 + lDlm
                                    q1 = sbstr.indexOf('"', q0);
                                    if (q1 != -1) {
                                        y1 = sbstr.indexOf(d, q1 + lDlm);
                                        q1 = sbstr.indexOf('"', y1 + lDlm);
                                        if (q1 == -1) q1 = sbstr.length
                                    } else {
                                        y1 = sbstr.indexOf(d, q0);
                                    }
                                }
                            }
                        } else {
                            y0 = 0, y1 = sbstr.indexOf(d);
                            while (y1 != -1) {
                                sbstr2 = sbstr.slice(y0, y1)
                                cols.push(sbstr2)
                                y0 = y1 + lDlm
                                y1 = sbstr.indexOf(d, y0);
                            }
                        }
                        if (y0) {
                            cols.push(sbstr.slice(y0))
                            rows.push(cols)
                        }
                        cols = []
                        x0 = x1 + lLbr
                        x1 = data.indexOf(linebreak, x0);
                        n++;
                    }
                } else {
                    while (x1 != -1) {
                        sbstr = data.slice(x0, x1)
                        y0 = 0, y1 = sbstr.indexOf(d);
                        while (y1 != -1) {
                            sbstr2 = sbstr.slice(y0, y1)
                            cols.push(sbstr2)
                            y0 = y1 + lDlm
                            y1 = sbstr.indexOf(d, y0);
                        }
                        if (y0) {
                            cols.push(sbstr.slice(y0))
                            rows.push(cols)
                        }
                        cols = []
                        x0 = x1 + lLbr
                        x1 = data.indexOf(linebreak, x0);
                        n++;
                    }
                }
            }
        } else {
            while (x1 != -1) {
                cols.push(data.slice(x0, x1))
                rows.push(cols)
                cols = []
                x0 = x1 + lLbr
                x1 = data.indexOf(linebreak, x0);
                n++;
            }
        }
        m--;
        if (x1 == -1) {
            if (m) {
                if (csv) {
                    bytesRead = 1;
                    data = data.slice(x0)
                    xs += x0;
                    x0 = 0
                    while (bytesRead && x1 == -1) {
                        [bytesRead, data2] = getData(fd, bSize, offsFd)
                        offsFd += bytesRead;
                        data += data2;
                        x1 = data.indexOf(linebreak)
                    }
                    if (x1 == -1) x1 = data.length;
                    if (bytesRead) m++;
                } else x1 = data.length;
            } else x0 = x1 = data.length;
        }
    }
    return {
        get: {
            rows: rows,
            row_count: n
        },
        offs: [xs + x0, n],
        row_count: n
    };
}

function getRowsOffsFT(data, from, to, info, sO_R) {
    let {
        header,
        linebreak,
        quote,
        col,
        d,
        csv,
        oJson
    } = info
    let lLbr = linebreak.length,
        offsFd,
        xs = x0 = sO_R,
        x1;
    let fd, bSize, bytesRead,
        data2
    if (csv) {
        [fd, bSize] = csv
        offsFd = data.length
        bytesRead = 1
    }
    x1 = data.indexOf(linebreak, x0)
    let m = 2,
        n = 0,
        c = 0;
    let sbstr = sbstr2 = "",
        rows = [],
        cols = []
    let q0, q1;
    while (m) {
        if (col) {
            let lDlm = d.length;
            if (oJson) {
                let j;
                cols = {}
                if (quote) {
                    while (x1 != -1) {
                        if (n >= from) {
                            if (n < to) {
                                sbstr = data.slice(x0, x1)
                                q1 = sbstr.indexOf('"');
                                if (q1 != -1) {
                                    y0 = 0, y1 = sbstr.indexOf(d);
                                    j = 0;
                                    while (y1 != -1) {
                                        sbstr2 = sbstr.slice(y0, y1)
                                        if (y1 < q1) {
                                            cols[oJson[j]] = sbstr2
                                            y0 = y1 + lDlm
                                            y1 = sbstr.indexOf(d, y0);
                                        } else {
                                            z = y0;
                                            q0 = q1 + lDlm
                                            q1 = sbstr.indexOf('"', q0);
                                            if (q1 != -1) {
                                                y1 = sbstr.indexOf(d, q1 + lDlm);
                                                q1 = sbstr.indexOf('"', y1 + lDlm);
                                                if (q1 == -1) q1 = sbstr.length
                                            } else {
                                                y1 = sbstr.indexOf(d, q0);
                                            }
                                        }
                                        j++;
                                    }
                                } else {
                                    y0 = 0, y1 = sbstr.indexOf(d);
                                    j = 0;
                                    while (y1 != -1) {
                                        sbstr2 = sbstr.slice(y0, y1)
                                        cols[oJson[j]] = sbstr2
                                        y0 = y1 + lDlm
                                        y1 = sbstr.indexOf(d, y0);
                                        j++;
                                    }
                                }
                                if (y0) {
                                    cols[oJson[j]] = sbstr.slice(y0)
                                    rows.push(cols)
                                }
                                cols = {}
                                c++;
                            } else {
                                n++;
                                break
                            }
                        }
                        x0 = x1 + lLbr
                        x1 = data.indexOf(linebreak, x0);
                        n++;
                    }
                } else {
                    while (x1 != -1) {
                        if (n < to) {
                            if (n >= from) {
                                sbstr = data.slice(x0, x1)
                                y0 = 0, y1 = sbstr.indexOf(d);
                                j = 0;
                                while (y1 != -1) {
                                    sbstr2 = sbstr.slice(y0, y1)
                                    cols[oJson[j]] = sbstr2
                                    y0 = y1 + lDlm
                                    y1 = sbstr.indexOf(d, y0);
                                    j++;
                                }
                                if (y0) {
                                    cols[oJson[j]] = sbstr.slice(y0)
                                    rows.push(cols)
                                }
                                cols = {}
                                c++;
                            }
                        } else {
                            n++;
                            break
                        }
                        x0 = x1 + lLbr
                        x1 = data.indexOf(linebreak, x0);
                        n++;
                    }
                }
            } else {
                if (quote) {
                    while (x1 != -1) {
                        if (n >= from) {
                            if (n < to) {
                                sbstr = data.slice(x0, x1)
                                q1 = sbstr.indexOf('"');
                                if (q1 != -1) {
                                    y0 = 0, y1 = sbstr.indexOf(d);
                                    while (y1 != -1) {
                                        sbstr2 = sbstr.slice(y0, y1)
                                        if (y1 < q1) {
                                            cols.push(sbstr2)
                                            y0 = y1 + lDlm
                                            y1 = sbstr.indexOf(d, y0);
                                        } else {
                                            z = y0;
                                            q0 = q1 + lDlm
                                            q1 = sbstr.indexOf('"', q0);
                                            if (q1 != -1) {
                                                y1 = sbstr.indexOf(d, q1 + lDlm);
                                                q1 = sbstr.indexOf('"', y1 + lDlm);
                                                if (q1 == -1) q1 = sbstr.length
                                            } else {
                                                y1 = sbstr.indexOf(d, q0);
                                            }
                                        }
                                    }
                                } else {
                                    y0 = 0, y1 = sbstr.indexOf(d);
                                    while (y1 != -1) {
                                        sbstr2 = sbstr.slice(y0, y1)
                                        cols.push(sbstr2)
                                        y0 = y1 + lDlm
                                        y1 = sbstr.indexOf(d, y0);
                                    }
                                }
                                if (y0) {
                                    cols.push(sbstr.slice(y0))
                                    rows.push(cols)
                                }
                                cols = []
                                c++;
                            } else {
                                n++;
                                break
                            }
                        }
                        x0 = x1 + lLbr
                        x1 = data.indexOf(linebreak, x0);
                        n++;
                    }
                } else {
                    while (x1 != -1) {
                        if (n < to) {
                            if (n >= from) {
                                sbstr = data.slice(x0, x1)
                                y0 = 0, y1 = sbstr.indexOf(d);
                                while (y1 != -1) {
                                    sbstr2 = sbstr.slice(y0, y1)
                                    cols.push(sbstr2)
                                    y0 = y1 + lDlm
                                    y1 = sbstr.indexOf(d, y0);
                                }
                                if (y0) {
                                    cols.push(sbstr.slice(y0))
                                    rows.push(cols)
                                }
                                cols = []
                                c++;
                            }
                        } else {
                            n++;
                            break
                        }
                        x0 = x1 + lLbr
                        x1 = data.indexOf(linebreak, x0);
                        n++;
                    }
                }
            }
        } else {
            while (x1 != -1) {
                if (n < to) {
                    if (n >= from) {
                        cols.push(data.slice(x0, x1))
                        rows.push(cols)
                        cols = []
                        c++;
                    }
                } else {
                    n++;
                    break
                }
                x0 = x1 + lLbr
                x1 = data.indexOf(linebreak, x0);
                n++;
            }
        }
        if (n >= to) {
            break
        }
        m--;
        if (x1 == -1) {
            if (m) {
                if (csv) {
                    bytesRead = 1
                    data = data.slice(x0)
                    xs += x0;
                    x0 = 0
                    while (bytesRead && x1 == -1) {
                        [bytesRead, data2] = getData(fd, bSize, offsFd)
                        offsFd += bytesRead;
                        data += data2;
                        x1 = data.indexOf(linebreak)
                    }
                    if (x1 == -1) x1 = data.length;
                    if (bytesRead) m++;
                } else x1 = data.length;
            } else x0 = x1 = data.length;
        }
    }
    return {
        get: {
            rows: rows,
            row_count: c
        },
        offs: [xs + x0, n],
        row_count: c
    };
}

function getRowsOffsF(data, from, info, sO_R) {
    let {
        header,
        linebreak,
        quote,
        col,
        d,
        csv,
        oJson
    } = info
    let lLbr = linebreak.length,
        offsFd,
        xs = x0 = sO_R,
        x1;
    let fd, bSize, bytesRead,
        data2
    if (csv) {
        [fd, bSize] = csv
        offsFd = data.length
        bytesRead = 1
    }
    x1 = data.indexOf(linebreak, x0)
    let m = 2,
        n = 0,
        c = 0;
    let sbstr = sbstr2 = "",
        rows = [],
        cols = []
    let q0, q1;
    while (m) {
        if (col) {
            let lDlm = d.length;
            if (oJson) {
                let j;
                cols = {}
                if (quote) {
                    while (x1 != -1) {
                        if (n >= from) {
                            sbstr = data.slice(x0, x1)
                            q1 = sbstr.indexOf('"');
                            if (q1 != -1) {
                                y0 = 0, y1 = sbstr.indexOf(d);
                                j = 0;
                                while (y1 != -1) {
                                    sbstr2 = sbstr.slice(y0, y1)
                                    if (y1 < q1) {
                                        cols[oJson[j]] = sbstr2
                                        y0 = y1 + lDlm
                                        y1 = sbstr.indexOf(d, y0);
                                    } else {
                                        z = y0;
                                        q0 = q1 + lDlm
                                        q1 = sbstr.indexOf('"', q0);
                                        if (q1 != -1) {
                                            y1 = sbstr.indexOf(d, q1 + lDlm);
                                            q1 = sbstr.indexOf('"', y1 + lDlm);
                                            if (q1 == -1) q1 = sbstr.length
                                        } else {
                                            y1 = sbstr.indexOf(d, q0);
                                        }
                                    }
                                    j++;
                                }
                            } else {
                                y0 = 0, y1 = sbstr.indexOf(d);
                                j = 0;
                                while (y1 != -1) {
                                    sbstr2 = sbstr.slice(y0, y1)
                                    cols[oJson[j]] = sbstr2
                                    y0 = y1 + lDlm
                                    y1 = sbstr.indexOf(d, y0);
                                    j++;
                                }
                            }
                            if (y0) {
                                cols[oJson[j]] = sbstr.slice(y0)
                                rows.push(cols)
                            }
                            cols = {}
                            c++;
                        }
                        x0 = x1 + lLbr
                        x1 = data.indexOf(linebreak, x0);
                        n++;
                    }
                } else {
                    while (x1 != -1) {
                        if (n >= from) {
                            sbstr = data.slice(x0, x1)
                            y0 = 0, y1 = sbstr.indexOf(d);
                            j = 0;
                            while (y1 != -1) {
                                sbstr2 = sbstr.slice(y0, y1)
                                cols[oJson[j]] = sbstr2
                                y0 = y1 + lDlm
                                y1 = sbstr.indexOf(d, y0);
                                j++;
                            }
                            if (y0) {
                                cols[oJson[j]] = sbstr.slice(y0)
                                rows.push(cols)
                            }
                            cols = {}
                            c++;
                        }
                        x0 = x1 + lLbr
                        x1 = data.indexOf(linebreak, x0);
                        n++;
                    }
                }
            } else {
                if (quote) {
                    while (x1 != -1) {
                        if (n >= from) {
                            sbstr = data.slice(x0, x1)
                            q1 = sbstr.indexOf('"');
                            if (q1 != -1) {
                                y0 = 0, y1 = sbstr.indexOf(d);
                                while (y1 != -1) {
                                    sbstr2 = sbstr.slice(y0, y1)
                                    if (y1 < q1) {
                                        cols.push(sbstr2)
                                        y0 = y1 + lDlm
                                        y1 = sbstr.indexOf(d, y0);
                                    } else {
                                        z = y0;
                                        q0 = q1 + lDlm
                                        q1 = sbstr.indexOf('"', q0);
                                        if (q1 != -1) {
                                            y1 = sbstr.indexOf(d, q1 + lDlm);
                                            q1 = sbstr.indexOf('"', y1 + lDlm);
                                            if (q1 == -1) q1 = sbstr.length
                                        } else {
                                            y1 = sbstr.indexOf(d, q0);
                                        }
                                    }
                                }
                            } else {
                                y0 = 0, y1 = sbstr.indexOf(d);
                                while (y1 != -1) {
                                    sbstr2 = sbstr.slice(y0, y1)
                                    cols.push(sbstr2)
                                    y0 = y1 + lDlm
                                    y1 = sbstr.indexOf(d, y0);
                                }
                            }
                            if (y0) {
                                cols.push(sbstr.slice(y0))
                                rows.push(cols)
                            }
                            cols = []
                            c++;
                        }
                        x0 = x1 + lLbr
                        x1 = data.indexOf(linebreak, x0);
                        n++;
                    }
                } else {
                    while (x1 != -1) {
                        if (n >= from) {
                            sbstr = data.slice(x0, x1)
                            y0 = 0, y1 = sbstr.indexOf(d);
                            while (y1 != -1) {
                                sbstr2 = sbstr.slice(y0, y1)
                                cols.push(sbstr2)
                                y0 = y1 + lDlm
                                y1 = sbstr.indexOf(d, y0);
                            }
                            if (y0) {
                                cols.push(sbstr.slice(y0))
                                rows.push(cols)
                            }
                            cols = []
                            c++;
                        }
                        x0 = x1 + lLbr
                        x1 = data.indexOf(linebreak, x0);
                        n++;
                    }
                }
            }
        } else {
            while (x1 != -1) {
                if (n >= from) {
                    cols.push(data.slice(x0, x1))
                    rows.push(cols)
                    cols = []
                    c++;
                }
                x0 = x1 + lLbr
                x1 = data.indexOf(linebreak, x0);
                n++;
            }
        }
        m--;
        if (x1 == -1) {
            if (m) {
                if (csv) {
                    bytesRead = 1;
                    data = data.slice(x0)
                    xs += x0;
                    x0 = 0
                    while (bytesRead && x1 == -1) {
                        [bytesRead, data2] = getData(fd, bSize, offsFd)
                        offsFd += bytesRead;
                        data += data2;
                        x1 = data.indexOf(linebreak)
                    }
                    if (x1 == -1) x1 = data.length;
                    if (bytesRead) m++;
                } else x1 = data.length;
            } else x0 = x1 = data.length;
        }
    }
    return {
        get: {
            rows: rows,
            row_count: c
        },
        offs: [xs + x0, n],
        row_count: c
    };
}

function get() {
    let t = Date.now()
    let obj;
    obj = getAllRows(this.data, this.info, this.starOffsRow)
    return {
        time: Date.now() - t + ' ms',
        header: this.option.header ? this.hdr : this.option.header,
        ...obj.get
    }
}

function chunk(chunk) {
    let t = Date.now()
    let obj;
    if (chunk && Number.isInteger(chunk)) {
        if (chunk >= 1) obj = getRowsChunk(this.data, chunk, this.info, this.offs_n)
        else Err("The 'chunk' parameter must be greater than or equal to 1")
    } else Err("The 'chunk' parameter must be an integer")
    this.offs_n = obj.offs
    return {
        time: Date.now() - t + ' ms',
        header: this.option.header ? this.hdr : this.option.header,
        ...obj.get
    }
}

function rowOffset(from, to) {
    let t = Date.now()
    let obj;
    if (Number.isInteger(from)) {
        if (from >= 0) {
            if (to == undefined) {
                obj = getRowsOffsF(this.data, from, this.info, this.starOffsRow)
            } else {
                if (Number.isInteger(to)) {
                    if (to > 0) obj = getRowsOffsFT(this.data, from, to, this.info, this.starOffsRow)
                    else Err("The second parameter must be greater than or equal to 1")
                } else Err("The second parameter must be an integer")
            }
        } else Err("The first parameter must be greater than or equal to zero")
    } else Err("The first parameter must be an integer")
    if (obj.row_count) this.offs_n = obj.offs
    return {
        time: Date.now() - t + ' ms',
        header: this.option.header ? this.hdr : this.option.header,
        ...obj.get
    }
}

function setRowOffset(rowOffs) {
    if (rowOffs != undefined) {
        if (Number.isInteger(rowOffs)) {
            if (rowOffs >= 0) {
                let lLbr = this.info[1].length
                n = 0,
                    x0 = 0
                x1 = this.data.indexOf(this.info[1])
                let offs = this.data.length
                while (x1 != -1) {
                    if (n == rowOffs) {
                        if (this.option.header) {
                            offs = x1 + lLbr
                        } else offs = x0
                        this.offs_n = [offs, n]
                        return [offs, n]
                    }
                    x0 = x1 + lLbr
                    x1 = this.data.indexOf(this.info[1], x0)
                    n++;
                }
            } else Err("The 'rowOffs' parameter must be greater than or equal to zero")
        } else Err("The 'rowOffs' parameter must be an integer")
    }
    return false
}

function resetOption(opt) {
    let option = {
        'header': true,
        'quote': false,
        'linebreak': '\r\n',
        'delimiter': ",",
        'json': false,
        "bufferSize": 1024 * 1024
    };
    if (opt != undefined) {
        if (typeof opt == 'object') {
            if ('header' in opt)
                if (typeof opt.header === "boolean") {
                    this.option.header = opt.header;
                } else Err("The 'header' key in The second parameter must be 'boolean'")
            if ('quote' in opt)
                if (typeof opt.quote === "boolean") {
                    this.option.quote = opt.quote;
                } else Err("The 'quote' key in The second parameter must be 'boolean'")
            if ('linebreak' in opt)
                if (typeof opt.linebreak === "string") {
                    this.option.linebreak = opt.linebreak;
                } else Err("The 'linebreak' key in The second parameter must be 'string'")
            if ('delimiter' in opt)
                if (typeof opt.delimiter === "string" || (typeof opt.delimiter === "boolean" && !opt.delimiter)) {
                    this.option.delimiter = opt.delimiter;
                    if (opt.delimiter === "boolean") {
                        this.column = false;
                    }
                } else Err("The 'delimiter' key in The second parameter must be 'string' or false 'boolean'")
            if ('json' in opt)
                if (typeof opt.json === "boolean") {
                    option.json = opt.json;
                } else Err("The 'json' key in The second parameter must be 'boolean'")
            if ('bufferSize' in opt) {
                if (Number.isInteger(opt.bufferSize)) {
                    if (opt.bufferSize >= 1024) option.bufferSize = opt.bufferSize;
                    else Err("The 'bufferSize' parameter must be greater than or equal to 1024")
                } else Err("The 'rowOffs' parameter must be an integer")
            }
        } else Err("The second parameter must be an object")
    } else this.option = option;
    let gc;
    if (this.fd) gc = getColumns(this.data, this.option, this.csv)
    else gc = getColumns(this.data, this.option)
    this.hdr = gc[0]
    this.starOffsRow = gc[1]
    this.offs_n = [this.starOffsRow, 0]
    this.oJson = (this.option.header && this.option.json) ? this.hdr : false;
    this.info = {
        header: this.option.header,
        linebreak: this.option.linebreak,
        quote: this.option.quote,
        col: this.column,
        d: this.option.delimiter,
        csv: this.csv,
        oJson: this.oJson
    }
}

function getInfo() {
    return {
        offset: this.offs_n[0],
        rowOffset: this.offs_n[1],
        option: this.option
    }
}

function offs_nRowwwwwwww(data, option, csv) {
    let n = 0,
        offs = 0,
        x0 = 0,
        x1;
    if (option.header) {
        if (csv) {
            let [fd, bSize] = csv
            let offsFd = 0
            let bytesRead = 1,
                data2;
            x1 = data.indexOf(option.linebreak)
            while (bytesRead && x1 == -1) {
                [bytesRead, data2] = getData(fd, bSize, offsFd)
                offsFd += bytesRead;
                data += data2;
                x1 = data.indexOf(option.linebreak)
            }
        } else x1 = data.indexOf(option.linebreak)
        if (x1 == -1) x0 = x1 = data.length;
        else x0 = x1 + option.linebreak.length
    }
    return [x0, n];
}

function getColumns(data, option, csv) {
    let cols = false,
        x0 = 0
    if (option.header) {
        cols = []
        let lDlm = option.delimiter.length,
            x1;
        if (csv) {
            let [fd, bSize] = csv
            let offsFd = 0
            let bytesRead = 1,
                data2
            x1 = data.indexOf(option.linebreak)
            while (bytesRead && x1 == -1) {
                [bytesRead, data2] = getData(fd, bSize, offsFd)
                offsFd += bytesRead;
                data += data2;
                x1 = data.indexOf(option.linebreak)
            }
        } else x1 = data.indexOf(option.linebreak)
        if (x1 != -1) {
            let sbstr2, sbstr = data.slice(x0, x1)
            let y0 = 0,
                y1 = sbstr.indexOf(option.delimiter);
            while (y1 != -1) {
                sbstr2 = sbstr.slice(y0, y1)
                cols.push(sbstr2)
                y0 = y1 + lDlm
                y1 = sbstr.indexOf(option.delimiter, y0);
            }
            if (y0)
                cols.push(sbstr.slice(y0))
        }
        if (x1 == -1) x0 = x1 = data.length;
        else x0 = x1 + option.linebreak.length
    }
    return [cols, x0];
}

function parseCsv(file_path, opt) {
    let data, fd, column = true,
        option = {
            'header': true,
            'quote': false,
            'linebreak': '\r\n',
            'delimiter': ",",
            'json': false,
            "bufferSize": 1024 * 1024
        };
    if (file_path != undefined) {
        if (fs.existsSync(file_path)) {
            fd = fs.openSync(file_path, 'r');
            let [bytesRead, data2] = getData(fd, option.bufferSize, 0)
            data = data2
        } else Err(`File "${file_path}" does not exists`);
    } else Err("The first parameter 'file_path' must be string")
    if (opt != undefined) {
        if (typeof opt == 'object') {
            if ('header' in opt)
                if (typeof opt.header === "boolean") {
                    option.header = opt.header;
                } else Err("The 'header' key in The second parameter must be 'boolean'")
            if ('quote' in opt)
                if (typeof opt.quote === "boolean") {
                    option.quote = opt.quote;
                } else Err("The 'quote' key in The second parameter must be 'boolean'")
            if ('linebreak' in opt)
                if (typeof opt.linebreak === "string") {
                    option.linebreak = opt.linebreak;
                } else Err("The 'linebreak' key in The second parameter must be 'string'")
            if ('delimiter' in opt)
                if (typeof opt.delimiter === "string" || (typeof opt.delimiter === "boolean" && !opt.delimiter)) {
                    option.delimiter = opt.delimiter;
                    if (opt.delimiter === "boolean") {
                        column = false;
                    }
                } else Err("The 'delimiter' key in The second parameter must be 'string' or false 'boolean'")
            if ('json' in opt)
                if (typeof opt.json === "boolean") {
                    option.json = opt.json;
                } else Err("The 'json' key in The second parameter must be 'boolean'")
            if ('bufferSize' in opt) {
                if (Number.isInteger(opt.bufferSize)) {
                    if (opt.bufferSize >= 1024) option.bufferSize = opt.bufferSize;
                    else Err("The 'bufferSize' parameter must be greater than or equal to 1024")
                } else Err("The 'rowOffs' parameter must be an integer")
            }
        } else Err("The second parameter must be an object")
    }
    return new class {
        constructor() {
            let gc;
            this.option = option
            this.data = data;
            this.column = column;
            this.csv = [fd, option.bufferSize];
            gc = getColumns(this.data, this.option, this.csv)
            this.hdr = gc[0]
            this.starOffsRow = gc[1]
            this.offs_n = [this.starOffsRow, 0]
            this.oJson = (this.option.header && this.option.json) ? this.hdr : false;
            this.info = {
                header: this.option.header,
                linebreak: this.option.linebreak,
                quote: this.option.quote,
                col: this.column,
                d: this.option.delimiter,
                csv: this.csv,
                oJson: this.oJson
            }
        }
        get = get
        chunk = chunk
        setRowOffset = setRowOffset
        rowOffset = rowOffset
        getInfo = getInfo
        header = () => this.hdr;
    };
}

function parseText(text, opt) {
    let data, column = true,
        option = {
            'header': true,
            'quote': false,
            'linebreak': '\r\n',
            'delimiter': ",",
            'json': false
        };

    if (text != undefined || typeof text != 'string') {
        data = text
    } else Err("The first parameter must be a file path string")
    if (opt != undefined) {
        if (typeof opt == 'object') {
            if ('header' in opt)
                if (typeof opt.header === "boolean") {
                    option.header = opt.header;
                } else Err("The 'header' key in The second parameter must be 'boolean'")
            if ('quote' in opt)
                if (typeof opt.quote === "boolean") {
                    option.quote = opt.quote;
                } else Err("The 'quote' key in The second parameter must be 'boolean'")
            if ('linebreak' in opt)
                if (typeof opt.linebreak === "string") {
                    option.linebreak = opt.linebreak;
                } else Err("The 'linebreak' key in The second parameter must be 'string'")
            if ('delimiter' in opt)
                if (typeof opt.delimiter === "string" || (typeof opt.delimiter === "boolean" && !opt.delimiter)) {
                    option.delimiter = opt.delimiter;
                    if (opt.delimiter === "boolean") {
                        this.column = false;
                    }
                } else Err("The 'delimiter' key in The second parameter must be 'string' or false 'boolean'")
            if ('json' in opt)
                if (typeof opt.json === "boolean") {
                    option.json = opt.json;
                } else Err("The 'json' key in The second parameter must be 'boolean'")
        } else Err("The second parameter must be an object")
    }
    return new class {
        constructor() {
            let gc;
            this.option = option
            this.data = data;
            this.column = column;
            this.csv = false;
            gc = getColumns(this.data, this.option)
            this.hdr = gc[0]
            this.starOffsRow = gc[1]
            this.offs_n = [this.starOffsRow, 0]
            this.oJson = (this.option.header && this.option.json) ? this.hdr : false;
            this.info = {
                header: this.option.header,
                linebreak: this.option.linebreak,
                quote: this.option.quote,
                col: this.column,
                d: this.option.delimiter,
                oJson: this.oJson
            }
        }
        get = get
        chunk = chunk
        setRowOffset = setRowOffset
        rowOffset = rowOffset
        resetOption = resetOption
        getInfo = getInfo
        header = () => this.hdr;
    };
}
module.exports = {
    parseText,
    parseCsv
}
