const mysql = require("mysql2/promise");
const fs = require("fs").promises;
const sharp = require("sharp");
const dbInfo = require("../../../../vp2025config");

const dbConf = {
	host: dbInfo.configData.host,
	user: dbInfo.configData.user,
	password: dbInfo.configData.passWord,
	database: "if25_jaltdorf"
};

//@desc home page for news articles
//@route GET /news
//@access public


const news = (req, res)=>{
	res.render("uudised");
};

const newsPost = async (req, res) =>{
	let conn;
	let sqlReq = "SELECT news_vp.news_title, news_vp.textarea, news_vp.pub_date, photos_vp.filename, photos_vp.alttext FROM news_vp LEFT JOIN photos_vp ON news_vp.photo_id = photos_vp.id";
	try{
		conn = await mysql.createConnection(dbConf);
		console.log("Andmebaasiühendus loodud!")
		const [rows, fields] = await conn.execute(sqlReq);
		res.render("uudised", {newsList: rows});
		console.log(rows[0].filename);
	}
	catch(err) {
		console.log("Viga: " + err);
		res.render("uudised", {newsList: []});
	}
	finally {
		if(conn){
			await conn.end();
			console.log("Andmebaasiühendus on suletud.");
		}
	}
	
};	
	
	
//@desc home page for uploading news articles
//@route GET /news/newsupload
//@access public
	
const newsUpload = (req, res) =>{
	res.render("uudisedAdd")
};

const newsUploadPost = async (req, res) =>{
	let conn;
	try{
		conn = await mysql.createConnection(dbConf);		
		let sqlReq = "INSERT INTO news_vp (news_title, textarea, photo_id) VALUES (?,?,?)";
		const [newsData] = await conn.execute(sqlReq, [req.body.titleInput, req.body.textInput, req.body.photoInput]);
		console.log("Salvestati kirje: " + newsData.insertId);
		res.render("uudisedAdd");
	}
	catch(err){
		console.log(err);
		res.render("uudisedAdd");
	}
	finally{
		if(conn){
		    await conn.end();
			console.log("Andmebaasiühendus on suletud.");		
		}
	}
};
module.exports = {
	news,
	newsPost,
	newsUpload,
	newsUploadPost};