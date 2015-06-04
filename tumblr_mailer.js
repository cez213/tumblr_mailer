//Objective:
//Part 1: create a node.js script file that will email a list of contacts my most recent blog posts.

var fs = require('fs');

//return and store (in csvFrile) a string of text with the content from 'friend_list.csv'
var csvFile = fs.readFileSync("friend_list.csv", "utf8");

//Note: CSV file format is as follows: (with the first row as the "header")
//firstName, lastName, numMonthsSinceContact, emailAddress

//FileInfo constructor function
var FileInfo = function(infoArray){
	this.firstName = infoArray[0];
	this.lastName = infoArray[1];
	this.numMonthsSinceContact = infoArray[2];
	this.emailAddress = infoArray[3];
}

//personInfo function on FileInfo.prototype
FileInfo.prototype.personInfo = function(){
	var contact = new FileInfo();
	return contact;
}

//create the function csvParse that takes a CSV file as an argument
//and parses the lines of the CSV files into an Array of Objects.
//The keys of each obkect should be: firstName, lastName, numMonthsSinceContact, emailAddress
function csvParse(csvFile){
	var contactInfo = [];
	//split string into array at ',' & '\n'
	for(var i = 0; i < csvFile.length; i++){
	    if(csvFile[i] === ',' || csvFile[i] === '\n'){
	        content = csvFile.split(/,|\n/);
	    }
	}
	//Remove header information
	content = content.slice(4);

	var newContact = new FileInfo(content);
	contactInfo.push(newContact);
	return contactInfo;
}


//console.log(csvParse(nameofFile));
console.log(csvParse(csvFile));













