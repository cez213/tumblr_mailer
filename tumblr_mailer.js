//Objective:
//Part 1: create a node.js script file that will email a list of contacts my most recent blog posts.
var mandrill = require('mandrill-api/mandrill');
var mandrill_client = new mandrill.Mandrill('_HrZ4VdCFDLb6afgApoxUw');
var fs = require('fs');
var ejs = require('ejs');
var tumblr = require('tumblr.js');

//return and store (in csvFrile) a string of text with the content from 'friend_list.csv'
var csvFile = fs.readFileSync("friend_list.csv", "utf8");
//var emailTemplate = fs.readFileSync("email_template.html", "utf8");
var emailTemplate = fs.readFileSync("email_template.ejs", "utf8");

// Authenticate via OAuth
var client = tumblr.createClient({
  consumer_key: 'YpcBle2dU5Pl8vnnVeChAyuCcb0iRNuaFefQHvcpGhPxr7AcDB',
  consumer_secret: 'VCRiAtxdZS5tMzLSTzkT1DFn8uJiT78jx5bOQh11ZgxNm9oGSJ',
  token: 'OZWeKOq3DuosZdJSuoHo5iPdY42oeeTfHMgLC9LE6be0FhaogP',
  token_secret: 'LCuoPZoINKxIxCpcZtAauwF6ucO34tiI5vzsWnPfH8GLh2SAgg'
});

var header = csvFile.split("\n").toString().split(",").slice(0,4);
var userInfo = csvFile.split("\n").toString().split(",").slice(4);

//FileInfo constructor function
var fileInfo = function(infoArray){
	for(var i = 0; i < header.length; i++){
		this[header[i]] = infoArray[i];
	}
}

//create the function csvParse that takes a CSV file as an argument
//and parses the lines of the CSV files into an Array of Objects.
//The keys of each obkect should be: firstName, lastName, numMonthsSinceContact, emailAddress
function csvParse(csvFile){
	var contactInfo = [];
	var newContact = {};

	for(var i = 0; i < userInfo.length; i++){
		var userArray = userInfo.splice(0,4);
		newContact = new fileInfo(userArray);
		contactInfo.push(newContact);
	}

	return contactInfo;
}

//csv_data = csvParse(csvFile);
//console.log(csv_data[0]['emailAddress']);

client.posts('cez213.tumblr.com', function(err, blog){
	var latestPosts = [];
	blog.posts.forEach(function(post){
		//published date of post
		var dateOfPost = new Date(post["date"]);
		//current date (format to match published date), then split into array
		var currentDate = new Date();
		//elapsed time converted into days from milliseconds (MS/day = 1000*60*60*24)
		var elapsedTime = Math.ceil((currentDate - dateOfPost)/(1000 * 60 * 60 * 24));

		//Check if post is 7 days old or less, if it is, put the post object in the array
		if(elapsedTime <= 7){
			var newPost = {};
			newPost.href = post["post_url"];
			newPost.title = post["title"];
			latestPosts.push(newPost);
		}
	})

	var emailList = csvParse(csvFile);

	emailList.forEach(function(row){
		var template = emailTemplate;
		var firstName = row["firstName"];
		var numMonthsSinceContact = row["numMonthsSinceContact"];

		//customize email using ejs.render
		for(var i = 0; i < emailList.length; i++){
			var customizedTemplate = ejs.render(template, {firstName: firstName,
					numMonthsSinceContact: numMonthsSinceContact,
					latestPosts: latestPosts			
			});
		}
		//send email
		sendEmail(firstName, row["emailAddress"], "Carolyn", "carolyn.zelenetz@gmail.com", "Blog Posts", customizedTemplate);
	});
})

function sendEmail(to_name, to_email, from_name, from_email, subject, message_html){
var message = {
    "html": message_html,
    "subject": subject,
    "from_email": from_email,
    "from_name": from_name,
    "to": [{
            "email": to_email,
            "name": to_name
        }],
    "important": false,
    "track_opens": true,    
    "auto_html": false,
    "preserve_recipients": true,
    "merge": false,
    "tags": [
        "Fullstack_Tumblrmailer_Workshop"
    ]    
};
var async = false;
var ip_pool = "Main Pool";
mandrill_client.messages.send({"message": message, "async": async, "ip_pool": ip_pool}, function(result) {
    // console.log(message);
    // console.log(result);   
}, function(e) {
    // Mandrill returns the error as an object with name and message keys
    console.log('A mandrill error occurred: ' + e.name + ' - ' + e.message);
    // A mandrill error occurred: Unknown_Subaccount - No subaccount exists with the id 'customer-123'
});
}





















