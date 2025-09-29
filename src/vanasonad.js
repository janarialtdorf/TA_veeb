const fs = require("fs");
const textRef = "txt/vanasonad.txt";

function pickOneSentence(rawText){
	let oldWisdomList = rawText.split(";");
	let wisdomOfTheDay = oldWisdomList[Math.round(Math.random() * (oldWisdomList.length - 1))];
	console.log(wisdomOfTheDay);
}

function readTextFile(){
	fs.readFile(textRef, "utf8", (err, data)=>{
		if(err){
			console.log(err);
		} else {
			pickOneSentence(data);
		}
	});
}
//readTextFile();
module.exports	= {randomWisdom: readTextFile};