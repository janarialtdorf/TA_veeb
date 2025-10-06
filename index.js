const express = require("express");
const dateET = require("./src/dateTimeET");
const fs = require ("fs");
//päringu lahtiharutaja POST jaoks:
const bodyparser = require("body-parser");
const mysql = require("mysql2");
const dbInfo = require("../../../vp2025config");
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

//Andmebaasi ühendus
const conn = mysql.createConnection({
	host: dbInfo.configData.host,
	user: dbInfo.configData.user,
	password: dbInfo.configData.passWord,
	database: "if25_jaltdorf"
});

app.get("/", (req, res)=>{
	//res.send("Express.js läks käima ja serveerib veebi!");
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

app.get("/regvisit", (req, res)=>{
	res.render("regvisit");
});

app.get("/kulastus", (req, res)=>{
	res.render("visitregistered");
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
		fs.appendFile("public/txt/visitlog.txt", req.body.firstNameInput + " " + req.body.lastNameInput + " " + dateET.fullDate() + " " + "kell: " + dateET.fullTime() + "; ", (err)=>{
			if(err){
				throw(err);
			}
			else{
				console.log("Salvestatud!");
				res.render("visitregistered");
			}
		});
		}
	});
	
});

app.get("/visitlog", (req, res)=>{
	let visitLog = [];
	fs.readFile(logRef, "utf8", (err, data)=>{
		if(err){
			res.render("visitlog", {heading: "Külastuste nimekiri", listData: ["Nimekiri puudub!"]});
		}
		else{
			visitLog = data.split(";");
			let correctListData = [];
			for(let i = 0; i < visitLog.length - 1; i ++){
				correctListData.push(visitLog[i]);
			}
			res.render("visitlog", {heading: "Külastuste nimekiri", listData: correctListData});
		}
	});
});

app.get("/eestifilm", (req, res)=>{
	res.render("eestifilm");
});

app.get("/eestifilm/inimesed", (req, res)=>{
	const sqlReq = "SELECT * FROM person";
	conn.execute(sqlReq, (err, sqlres)=>{
		if(err){
			throw(err);
		}
		else{
			console.log(sqlres);
			res.render("filmiinimesed", {personList: sqlres});
		}
	});
	//res.render("filmiinimesed");
});

app.get("/eestifilm/inimesed_add", (req, res)=>{
	res.render("filmiinimesed_add", {notice: "Ootan sisestust"});
});

app.post("/eestifilm/inimesed_add", (req, res)=>{
	console.log(req.body);
	//kas andmed on olemas
	if(!req.body.firstNameInput || !req.body.lastNameInput || !req.body.bornInput || req.body.bornInput >= new Date()){
		res.render("filmiinimesed_add", {notice: "Osa andmeid oli puudu või ebakorrektsed."});
	}
	else {
		let sqlReq = "INSERT INTO person(first_name, last_name, born, deceased) VALUES (?,?,?,?)";
	    conn.execute(sqlReq, [req.body.firstNameInput, req.body.lastNameInput, req.body.bornInput, req.body.deceasedInput], (err, sqlres)=>{
		    if(err){
			    res.render("filmiinimesed_add", {notice: "Andmete salvestamine ebaõnnestus."});
		    }
			else {
				res.render("filmiinimesed_add", {notice: "Andmed salvestatud!"});
			}
	    });
		
	}
});

app.get("/eestifilm/filmid", (req, res)=>{
	const sqlReq = "SELECT * FROM movie";
	conn.execute(sqlReq, (err, sqlres)=>{
		if(err){
			throw(err);
		}
		else{
			console.log(sqlres);
			res.render("filmid", {movieList: sqlres});
		}
	});
});

app.get("/eestifilm/filmid_add", (req, res)=>{
	res.render("filmid_add", {notice: "Ootan sisestust"});
});

app.post("/eestifilm/filmid_add", (req, res)=>{
	console.log(req.body);
	if(!req.body.titleInput || !req.body.prodYearInput || !req.body.durationInput || !req.body.descInput){
		res.render("filmid_add", {notice: "Osa andmeid oli puudu või ebakorrektsed."});
	}
	else {
		let sqlReq = "INSERT INTO movie(title, production_year, duration, description) VALUES (?,?,?,?)";
	    conn.execute(sqlReq, [req.body.titleInput, req.body.prodYearInput, req.body.durationInput, req.body.descInput], (err, sqlres)=>{
		    if(err){
			    res.render("filmid_add", {notice: "Andmete salvestamine ebaõnnestus."});
		    }
			else {
				res.render("filmid_add", {notice: "Andmed salvestatud!"});
			}
	    });
		
	}
});

app.listen(5101);  