Parse CSV with JavaScript
========================================

It is the fastest, simplest and most powerful package of all existing libraries in npmjs. It converts .csv files into an array and even into lines. It contains two important functions parseCsv that handles a csv file, you only need a link to the file. And parseText deals with text, and they both have the same roles and and methods, and it comes with these features:

- Package with small content (< 30 KB)
- Easy to use
- Parse CSV files directly (local)
- Fast mode
- Stream large files
- It is a synchronous package
- Uses chunks
- Uses row offset (get rows from line x to line x+n)
- Returns rows (with columns) or lines (without columns)
- No external dependencies
- Flexible with lots of options (header, quote, line break, delimiter)
- One of the only parsers that correctly handles line-breaks and quotations

select-csv has **no dependencies** .

Install:
-------

select-csv is available on [npm](https://www.npmjs.com/package/select-csv). It
can be installed with the following command:

    npm install select-csv



Usage:
-------

Here there are clearly different examples


```js
const {parseCsv,parseText} = require("select-csv");

var parse;

// First create object from .csv file
parse = parseCsv('file_path.csv');

// Or if you just want create object from text
parse = parseText(
`Index,User Id,First Name,Last Name,Sex
1,5f10e9D33fC5f2b,Sara,Mcguire,Female
2,751cD1cbF77e005,Alisha,Hebert,Male
3,DcEFDB2D2e62bF9,Gwendolyn,Sheppard,Male
4,C88661E02EEDA9e,Kristine,Mccann,Female
5,fafF1aBDebaB2a6,Bobby,Pittman,Female
6,BdDb6C8Af309202,Calvin,Ramsey,Female
7,FCdfFf08196f633,Collin,Allison,Male
8,356279dAa0F7CbD,Nicholas,Branch,Male
9,F563CcbFBfEcf5a,Emma,Robinson,Female
10,f2dceFc00F62542,Pedro,Cordova,Male`
);


```

* If you want to get all rows :
```js
const result = parse.get(); //Return all rows
/*
	{
	time:1,
	header:["Index","User Id","First Name","Last Name","Sex"],
	rows:[
		["1","5f10e9D33fC5f2b","Sara","Mcguire","Female"],
		["2","751cD1cbF77e005","Alisha","Hebert","Male"],
		["3","DcEFDB2D2e62bF9","Gwendolyn","Sheppard","Male"],
		["4","C88661E02EEDA9e","Kristine","Mccann","Female"],
		["5","fafF1aBDebaB2a6","Bobby","Pittman","Female"],
		["6","BdDb6C8Af309202","Calvin","Ramsey","Female"],
		["7","FCdfFf08196f633","Collin","Allison","Male"],
		["8","356279dAa0F7CbD","Nicholas","Branch","Male"],
		["9","F563CcbFBfEcf5a","Emma","Robinson","Female"],
		["10","f2dceFc00F62542","Pedro","Cordova","Male"]
		],
	row_count:10
	}
*/

```

* If you want to get a chunks of rows :

```js
var result;
result = parse.chunk(c) 
//The 'c' parameter must be an integer and greater than or equal to 1

//Examples:
result = parse.chunk(2) //Return row 0 and 1 
/*
{
  "Time": 0,
  "Header": [ "Index", "User Id", "First Name", "Last Name", "Sex" ],
  "Rows": [
    [ "1", "5f10e9D33fC5f2b", "Sara", "Mcguire", "Female" ],
    [ "2", "751cD1cbF77e005", "Alisha", "Hebert", "Male" ]
  ],
  "row_count:": 2
}
*/

result = parse.chunk(3) //Return row 2,3 and 4 (Get rows from last offset saved)
/*
{
  "Time": 0,
  "Header": [ "Index", "User Id", "First Name", "Last Name", "Sex" ],
  "Rows": [
    [ "3", "DcEFDB2D2e62bF9", "Gwendolyn", "Sheppard", "Male" ],
    [ "4", "C88661E02EEDA9e", "Kristine", "Mccann", "Female" ],
    [ "5", "fafF1aBDebaB2a6", "Bobby", "Pittman", "Female" ]
  ],
  "row_count:": 3
}
*/

result = parse.chunk(1) //Return row 5 (Get rows from last offset saved)
/*
{
  "Time": 0,
  "Header": [ "Index", "User Id", "First Name", "Last Name", "Sex" ],
  "Rows": [
    [ "6", "BdDb6C8Af309202", "Calvin", "Ramsey", "Female" ]
  ],
  "row_count:": 1
}
*/


```

* If you want to get specific rows :

```js
var result
result = parse.rowOffset(from) 
// The 'from' parameter must be an integer and greater than or equal to 0

// Or
result = parse.rowOffset(from,to)
// The 'to' parameter must be an integer and greater than or equal to 1

//Examples:
result = parse.rowOffset(6) //Returns all rows from the sixth row to the last row
/*
{
  "Time": 0,
  "Header": [ "Index", "User Id", "First Name", "Last Name", "Sex" ],
  "Rows": [
    [ "7", "FCdfFf08196f633", "Collin", "Allison", "Male" ],
    [ "8", "356279dAa0F7CbD", "Nicholas", "Branch", "Male" ],
    [ "9", "F563CcbFBfEcf5a", "Emma", "Robinson", "Female" ],
    [ "10", "f2dceFc00F62542", "Pedro", "Cordova", "Male" ]
  ],
  "row_count:": 4
}
*/

result = parse.rowOffset(5,8) //Returns all rows from 5th to 8th row
/*
{
  "Time": 1,
  "Header": [ "Index", "User Id", "First Name", "Last Name", "Sex" ],
  "Rows": [
    [ "6", "BdDb6C8Af309202", "Calvin", "Ramsey", "Female" ],
    [ "7", "FCdfFf08196f633", "Collin", "Allison", "Male" ],
    [ "8", "356279dAa0F7CbD", "Nicholas", "Branch", "Male" ]
  ],
  "row_count:": 3
}
*/



```

* If you want to change the row offset :

```js
parse.setRowOffset(offs) 

// The 'offs' parameter must be an integer and greater than or equal to 0.

// If the offset exists, return [offset,row_number].
result = parse.setRowOffset(5) 
/*
[236,5]
*/
result = parse.chunk(1) // Get rows from last offset saved
/*
{
  "Time": 0,
  "Header": [ "Index", "User Id", "First Name", "Last Name", "Sex" ],
  "Rows": [
    [ "6", "BdDb6C8Af309202", "Calvin", "Ramsey", "Female" ]
  ],
  "row_count:": 1
}
*/

// If not , returns false and the offset not changed.
result = parse.setRowOffset(20) 
/*
false
*/
result = parse.chunk(1) // Get rows from last offset saved
/*
{
  "Time": 0,
  "Header": [ "Index", "User Id", "First Name", "Last Name", "Sex" ],
  "Rows": [
    [ "7", "FCdfFf08196f633", "Collin", "Allison", "Male" ]
  ],
  "row_count:": 1
}
*/


```

* The default object option :

```js
{
	'header': true,
	'quote': false,
	'linebreak': '\r\n',
	'delimiter': ",",
  'bufferSize':1024*1024 
}
	// delimiter: (String: get rows containing columns, false: get lines without columns)
  //bufferSize: It only works with a CSV file, which is the maximum number of characters that can be read at a time, the minimum value is 1024
```

* If you want to use specific option :
```js
var option = {
	'header': false, 	/* or true */
	'quote': true, 		/* or false */
	'linebreak': '\n', 	/* '\n' or '\r' or any other string  */
	'delimiter': ","	/* ';' or any other string or false */
  'bufferSize':2000 /* It only works with a CSV file */
}

var parse;
// Create object from .csv file
parse = parseCsv('file_path.csv',option);

// Or if you just want create object from text
parse = parseText(
`Index,User Id,First Name,Last Name,Sex
1,5f10e9D33fC5f2b,Sara,Mcguire,Female
2,751cD1cbF77e005,Alisha,Hebert,Male
3,DcEFDB2D2e62bF9,Gwendolyn,Sheppard,Male`
, option);

option = {
	'header': false,
}

result = parse.rowOffset(2)
/*
{
  "Time": 0,
  "Header": false,
  "Rows": [
    [ "2", "751cD1cbF77e005", "Alisha", "Hebert", "Male" ]
  ],
  "row_count:": 1
}
*/

option = { 
	'header': true,
	'delimiter': false 
}
	// delimiter: (String: get rows containing columns, false: get lines without columns)
/*
{
  "Time": 0,
  "Header": false,
  "Rows": [
    [ "2,751cD1cbF77e005,Alisha,Hebert,Male" ] // No columns, just string (all line)
  ],
  "row_count:": 1
}
*/

```

* If you want to reset option after multiple uses of your code :
```js
const option = {       // Just an exapmle
	'header': false,
	'quote': true,
	'linebreak': '\n'
}

parse.resetOption(option); // All saved values are erased and the object is restared again


```

* If you want to get information of your object :
```js

const result = parse.getInfo();
/*
{
  "offset": 275,
  "rowOffset": 7,
  "option": {
    "header": false,
    "quote": false,
    "linebreak": "\n",
    "delimiter": false
  }
}
*/

```

* Examples of parsing a large CSV file:
(https://www.kaggle.com/datasets/zanjibar/100-million-data-csv)


```js

const parse = parseCsv('100-million-data.csv',{"header": false});
var result;
result = parse.chunk(100000)
/*
{
  time: 222,
  header: false,
  rows: [
    [ '198801', '1', '103', '100', '000000190', '0', '35843', '34353' ],
    [ '198801', '1', '103', '100', '120991000', '0', '1590', '4154' ],
    [ '198801', '1', '103', '100', '210390900', '0', '4500', '2565' ],
    .
    .
    .
    [ '198801', '1', '103', '100', '391590000', '0', '95000', '7850' ],
    [ '198801', '1', '103', '100', '391620000', '0', '1000', '404' ],
    [ '198801', '1', '103', '100', '391723000', '0', '545', '479' ],
    [ '198801', '1', '103', '100', '391732100', '0', '24', '393' ],
    [ '198801', '1', '103', '100', '391732900', '0', '60', '758' ],
    [ '198801', '1', '103', '100', '391810100', '0', '1935', '1042' ],
    [ '198801', '1', '103', '100', '391910200', '0', '510', '1303' ],
    [ '198801', '1', '103', '100', '391910300', '0', '133', '379' ],
    [ '198801', '1', '103', '100', '391990300', '0', '450', '1668' ],
    [ '198801', '1', '103', '100', '391990500', '0', '942', '1721' ],
    [ '198801', '1', '103', '100', '391990900', '0', '40', '235' ],
    [ '198801', '1', '103', '100', '392030000', '0', '406', '652' ],
    ... 99900 more items
  ],
  row_count: 100000
}
*/

result = parse.chunk(3) // Return row 100001,100002 and 100003 (Get rows from last offset saved)
/*
{
  time: 1,
  header: false,
  rows: [
    [ '198801', '1', '326', '500', '841330000', '90', '81', '246' ],
    [ '198801', '1', '326', '500', '841510000', '0', '35', '1366' ],
    [ '198801', '1', '326', '500', '841582100', '0', '6', '334' ]
  ],
  row_count: 3
}
*/

const from = 1000*1000*30;
const to = from + 5;
result = parse.rowOffset(from,to)
/*
{
  time: 3743,
  header: false,
  rows: [
    [
      '199804',    '2',
      '213',       '502',
      '848130000', '16035',
      '746',       '8380'
    ],
    [ '199804', '2', '213', '502', '848140000', '168', '152', '1891' ],
    [ '199804', '2', '213', '502', '848180010', '77', '404', '1366' ],
    [ '199804', '2', '213', '502', '848190000', '0', '131', '570' ],
    [ '199804', '2', '213', '502', '848230000', '300', '4', '882' ]
  ],
  row_count: 5
}
*/

const from = 1000*1000*90;
const to = from + 4;
result = parse.rowOffset(from,to)
/*
{
  time: 44126,
  header: false,
  rows: [
    [ '201412', '1', '125', '400', '283525000', '0', '160000', '6492' ],
    [ '201412', '1', '125', '400', '390740100', '0', '17500', '5579' ],
    [ '201412', '1', '125', '400', '390950000', '0', '36000', '21423' ],
    [ '201412', '1', '125', '400', '392329000', '0', '520', '1413' ]
  ],
  row_count: 4
}
*/

result = parse.chunk(3) // Get rows from last offset saved ( row to,to+1 and to+2 )
/*
{
  time: 29,
  header: false,
  rows: [
    [ '201412', '1', '125', '400', '400932000', '0', '18', '526' ],
    [ '201412', '1', '125', '400', '401110000', '173', '1735', '1197' ],
    [ '201412', '1', '125', '400', '401120000', '133', '1707', '1099' ]
  ],
  row_count: 3
}
*/

result = parse.getInfo() // Get all the information
/*
{
  offset: 3599945660,
  rowOffset: 90000008,
  option: {
    header: false,
    quote: false,
    linebreak: '\r\n',
    delimiter: ',',
    bufferSize: 1048576
  }
}
*/
```