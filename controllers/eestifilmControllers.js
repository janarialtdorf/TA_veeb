const mysql = require("mysql2/promise");
const dbInfo = require("../../../../vp2025config");

const dbConf = {
	host: dbInfo.configData.host,
	user: dbInfo.configData.user,
	password: dbInfo.configData.passWord,
	database: "if25_jaltdorf"
};

//@desc home page for Estonia film section
//@route GET /eestifilm
//@access public

//app.get("/eestifilm", (req, res)=>{
const eestifilm = (req, res)=>{
	res.render("eestifilm");
};

//@desc home page for people involved in Estonia film industry
//@route GET /eestifilm/inimesed
//@access public

//app.get("/eestifilm/inimesed", async (req, res)=>{
const inimesed = async (req, res)=>{
	let conn;
	const sqlReq = "SELECT * FROM person";
	try{
		conn = await mysql.createConnection(dbConf);
		console.log("Andmebaasiühendus loodud!")
		const [rows, fields] = await conn.execute(sqlReq);
		res.render("filmiinimesed", {personList: rows});
	}
	catch(err) {
		console.log("Viga: " + err);
		res.render("filmiinimesed", {personList: []});
	}
	finally {
		if(conn){
			await conn.end();
			console.log("Andmebaasiühendus on suletud.");
		}
	}
	
};

//@desc home page for adding people involved in Estonia film industry
//@route GET /eestifilm/inimesed_add
//@access public

//app.get("/eestifilm/inimesed_add", (req, res)=>{
const inimesedAdd = (req, res)=>{
	res.render("filmiinimesed_add", {notice: "Ootan sisestust"});
};

//@desc home page for adding people involved in Estonia film industry
//@route POST /eestifilm/inimesed_add
//@access public

//app.post("/eestifilm/inimesed_add", async (req, res)=>{
const inimesedAddPost = async (req, res)=>{
	let conn;
	let sqlReq = "INSERT INTO person(first_name, last_name, born, deceased) VALUES (?,?,?,?)";
	
	if(!req.body.firstNameInput || !req.body.lastNameInput || !req.body.bornInput || req.body.bornInput >= new Date()){
		res.render("filmiinimesed_add", {notice: "Osa andmeid oli puudu või ebakorrektsed."});
	}
	else {
		try {
			conn = await mysql.createConnection(dbConf);
		    console.log("Andmebaasiühendus loodud!")
			let deceasedDate = null;
			if(req.body.deceasedInput != ""){
				deceasedDate = req.body.deceasedInput;
			}
			const [result] = await conn.execute(sqlReq, [req.body.firstNameInput, req.body.lastNameInput, req.body.bornInput, deceasedDate]);
			console.log("Salvestati kirje: " + result.insertId);
			res.render("filmiinimesed_add", {notice: "Andmed salvestatud!"});
		}
		catch(err) {
			console.log("Viga: " + err);
			res.render("filmiinimesed_add", {notice: "Andmete salvestamine ebaõnnestus."});
		}
		finally {
			if(conn){
				await conn.end();
				console.log("Andmebaasiühendus on suletud.");
			}
		}
	}
};

/* app.get("/eestifilm/filmid", (req, res)=>{
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

app.get("/eestifilm/ametid", (req, res)=>{
	const sqlReq = "SELECT * FROM position";
	conn.execute(sqlReq, (err, sqlres)=>{
		if(err){
			throw(err);
		}
		else{
			console.log(sqlres);
			res.render("ametid", {positionList: sqlres});
		}
	});
});

app.get("/eestifilm/ametid/lisa", (req, res)=>{
	res.render("ametid_add", {notice: "Ootan sisestust"});
});

app.post("/eestifilm/ametid/lisa", (req, res)=>{
	console.log(req.body);
	if(!req.body.positionInput || !req.body.positionDescriptionInput) {
		res.render("ametid_add", {notice: "Osa andmeid oli puudu või ebakorrektsed."});
	}
	else {
		let sqlReq = "INSERT INTO `position` (position_name, description) VALUES (?,?)";
	    conn.execute(sqlReq, [req.body.positionInput, req.body.positionDescriptionInput], (err, sqlres)=>{
		    if(err){
				console.error("MySQL error:", err);
			    res.render("ametid_add", {notice: "Andmete salvestamine ebaõnnestus."});
		    }
			else {
				res.redirect("/eestifilm/ametid");
			}
	    });
		
	}
}); */

module.exports = {
	eestifilm,
	inimesed,
	inimesedAdd,
	inimesedAddPost
};