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

const filmid = async (req, res)=>{
	let conn;
	const sqlReq = "SELECT * FROM movie";
	try{
		conn = await mysql.createConnection(dbConf);
		console.log("Andmebaasiühendus loodud!")
		const [rows, fields] = await conn.execute(sqlReq);
		res.render("filmid", {movieList: rows});
	}
	catch(err) {
		console.log("Viga: " + err);
		res.render("filmid", {movieList: []});
	}
	finally {
		if(conn){
			await conn.end();
			console.log("Andmebaasiühendus on suletud.");
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
 */
//app.get("/eestifilm/filmid_add", (req, res)=>{
const filmidAdd = (req, res)=>{
	res.render("filmid_add", {notice: "Ootan sisestust"});
};

const filmidAddPost = async (req, res)=>{
	let conn;
	let sqlReq = "INSERT INTO movie(title, production_year, duration, description) VALUES (?,?,?,?)";
	
	if(!req.body.titleInput || !req.body.prodYearInput || !req.body.durationInput || !req.body.descInput){
		res.render("filmid_add", {notice: "Osa andmeid oli puudu või ebakorrektsed."});
	}
	else{
		try{
			conn = await mysql.createConnection(dbConf);
		    console.log("Andmebaasiühendus loodud!")
			const [result] = await conn.execute(sqlReq, [req.body.titleInput, req.body.prodYearInput, req.body.durationInput, req.body.descInput]);
			console.log("Salvestati kirje: " + result.insertId);
			res.render("filmid_add", {notice: "Andmed salvestatud!"});
		}
		catch(err){
			console.log("Viga: " + err);
			res.render("filmid_add", {notice: "Andmete salvestamine ebaõnnestus."});
		}
		finally{
			if(conn){
				await conn.end();
				console.log("Andmebaasiühendus on suletud.");
			}
		}
	}
};

const ametid = async (req, res)=>{
	let conn;
	const sqlReq = "SELECT * FROM position";
	try{
		conn = await mysql.createConnection(dbConf);
		console.log("Andmebaasiühendus loodud!")
		const [rows, fields] = await conn.execute(sqlReq);
		res.render("ametid", {positionList: rows});
	}
	catch(err){
		console.log("Viga: " + err);
		res.render("ametid", {positionList: []});
	}
	finally{
		if(conn){
			await conn.end();
			console.log("Andmebaasiühendus on suletud.");
		}
	}
};

const ametidAdd = (req, res)=>{
	res.render("ametid_add", {notice: "Ootan sisestust"});
};

const ametidAddPost = async (req, res)=>{
	let conn;
	let sqlReq = "INSERT INTO `position` (position_name, description) VALUES (?,?)";
	
	if(!req.body.positionInput || !req.body.positionDescriptionInput) {
		res.render("ametid_add", {notice: "Osa andmeid oli puudu või ebakorrektsed."});
	}
	else {
		try {
			conn = await mysql.createConnection(dbConf);
		    console.log("Andmebaasiühendus loodud!")
			const [result] = await conn.execute(sqlReq, [req.body.positionInput, req.body.positionDescriptionInput]);
			console.log("Salvestati kirje: " + result.insertId);
			res.render("ametid_add", {notice: "Andmed salvestatud!"});
		}
		catch(err) {
			console.log("Viga: " + err);
			res.render("ametid_add", {notice: "Andmete salvestamine ebaõnnestus."});
		}
		finally {
			if(conn){
				await conn.end();
				console.log("Andmebaasiühendus on suletud.");
			}
		}
	}
};

const seosed = async (req, res) => {
	let conn;
	try {
		conn = await mysql.createConnection(dbConf);
		console.log("Andmebaasiühendus loodud!");

		const [persons] = await conn.execute("SELECT * FROM person");
		const [movies] = await conn.execute("SELECT * FROM movie");
		const [positions] = await conn.execute("SELECT * FROM position");

		res.render("seosed", {
			personList: persons,
			movieList: movies,
			positionList: positions
		});
	} catch (err) {
		console.log("Viga: " + err);
		res.render("seosed", {
			personList: [],
			movieList: [],
			positionList: []
		});
	} finally {
		if (conn) {
			await conn.end();
			console.log("Andmebaasiühendus on suletud.");
		}
	}
};

const seosedAdd = async (req, res) => {
  let conn;
  try {
    conn = await mysql.createConnection(dbConf);
    console.log("Andmebaasiühendus loodud!");

    const [persons] = await conn.execute("SELECT * FROM person");
    const [movies] = await conn.execute("SELECT * FROM movie");
    const [positions] = await conn.execute("SELECT * FROM position");

    res.render("seosed_add", {notice: "Ootan sisestust."});
  } catch (err) {
    console.log("Viga: " + err);
	res.render("seosed_add", {notice: "Andmete salvestamine ebaõnnestus."});
  } finally {
    if (conn) {
      await conn.end();
      console.log("Andmebaasiühendus on suletud.");
    }
  }
};

const seosedAddPost = async (req, res)=>{
 const { personSelect, movieSelect, positionSelect, role } = req.body;
  let conn;
  try {
    conn = await mysql.createConnection(dbConf);
    await conn.execute(
      "INSERT INTO person_in_movie (person_id, movie_id, position_id, role) VALUES (?, ?, ?, ?)",
      [personSelect, movieSelect, positionSelect, role || null]
    );
    res.render("seosed_add");
  } catch (err) {
    console.log("Viga seose lisamisel: " + err);
    res.send("Viga seose lisamisel!");
  } finally {
    if (conn) await conn.end();
  }
};

module.exports = {
	eestifilm,
	inimesed,
	inimesedAdd,
	inimesedAddPost,
	filmid,
	filmidAdd,
	filmidAddPost,
	ametid,
	ametidAdd,
	ametidAddPost,
	seosed,
	seosedAdd,
	seosedAddPost
	
};