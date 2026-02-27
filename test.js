const {parseCsv,parseText} = require("select-csv");

var parse;

// First create object from .csv file
//parse = parseCsv('file_path.csv');

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
10,f2dceFc00F62542,Pedro,Cordova,Male`,
{ 
    linebreak: '\n',
    header: true 
}
);

const result = parse.get();
console.log(result)