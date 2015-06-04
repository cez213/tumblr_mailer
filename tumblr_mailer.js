//Objective:
//Part 1: create a node.js script file that will email a list of contacts my most recent blog posts.

var fs = require('fs');

var csvFile = fs.readFileSync("friend_list.csv", "utf8");
console.log(csvFile);

