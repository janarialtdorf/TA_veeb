const express = require("express");
const dateET = require("./src/dateTimeET");
const fs = require ("fs");
//päringu lahtiharutaja POST jaoks:
const bodyparser = require("body-parser");
const textRef = "public/txt/vanasonad.txt";
const logRef = "public/txt/visitlog.txt";
//käivitan express.js funktsiooni ja annan talle nimeks "app".
const app = express();
//Määran veebilehtede mallide renderdamise mooduli ehk VIEW ENGINE
app.set("view engine", "ejs");
//Määran ühe päris kataloogi avalikult kättesaadavaks.
app.use(express.static("public"));
//Parsime päringu URL-i, lipp false, kui ainult tekst ja true, kui muid andmeid ka:
app.use(bodyparser.urlencoded({extended: false}));

app.get("/", (req, res)=>{
	res.render("index");
});

app.get("/timenow", (req, res)=>{
	const weekDayNow = dateET.weekDay();
	const dateNow = dateET.fullDate();
	const fullTime = dateET.fullTime();
	res.render("timenow", {weekDayNow: weekDayNow, dateNow: dateNow, timeNow: fullTime});
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



//külastuste marsruudid
const külastusRouter = require("./routes/külastusRoutes");
app.use("/visitlog", külastusRouter);

//eestifilm marsruudid
const eestifilmRouter = require("./routes/eestifilmRoutes");
app.use("/eestifilm", eestifilmRouter);

app.listen(5101);  