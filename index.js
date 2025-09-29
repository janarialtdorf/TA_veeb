const express = require("express");
const dateET = require("./src/dateTimeET");
const fs = require ("fs");
//päringu lahtiharutaja POST jaoks:
const bodyparser = require("body-parser");
const textRef = "public/txt/vanasonad.txt";
//käivitan express.js funktsiooni ja annan talle nimeks "app".
const app = express();
//Määran veebilehtede mallide renderdamise mooduli ehk VIEW ENGINE
app.set("view engine", "ejs");
//Määran ühe päris kataloogi avalikult kättesaadavaks.
app.use(express.static("public"));
//Parsime päringu URL-i, lipp false, kui ainult tekst ja true, kui muid andmeid ka:
app.use(bodyparser.urlencoded({extended: false}));

app.get("/", (req, res)=>{
	//res.send("Express.js läks käima ja serveerib veebi!");
	res.render("index");
});

app.get("/timenow", (req, res)=>{
	const weekDayNow = dateET.weekDay();
	const dateNow = dateET.fullDate();
	res.render("timenow", {weekDayNow: weekDayNow, dateNow: dateNow});
});

app.get("/vanasonad", (req, res)=>{
	let folkWisdom = [];
	fs.readFile(textRef, "utf8", (err, data)=>{
		if(err){
			res.render("genericlist", {heading: "Valik Eesti vanasõnu", listData: ["Ei leidnud ühtegi vanasõna!"]});
		}
		else{
			folkWisdom = data.split(";");
			res.render("genericlist", {heading: "Valik Eesti vanasõnu", listData: folkWisdom});
		}
	});
});

app.get("/regvisit", (req, res)=>{
	res.render("regvisit");
});

app.post("/regvisit", (req, res)=>{
	console.log(req.body);
	//avan tekstifaili kirjutamiseks sellisel moel, et kui teda pole, siis ta luuakse:
	fs.open("public/txt/visitlog.txt", "a", (err, file)=>{
		if(err){
			throw(err);
		}
		else{
			//faili senisele sisule lisamine
		fs.appendFile("public/txt/visitlog.txt", req.body.nameInput + "; ", (err)=>{
			if(err){
				throw(err);
			}
			else{
				console.log("Salvestatud!");
				res.render("regvisit");
			}
		});
		}
	});
	
});



app.listen(5101);