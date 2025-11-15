const mysql = require("mysql2/promise");
const fs = require("fs").promises;
const sharp = require("sharp");
const dbInfo = require("../../../../vp2025config");
const {savePhotoToGallery} = require("./photouploadControllers");

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
	let sqlReq = "SELECT news_vp.news_title, news_vp.textarea, DATE_FORMAT(news_vp.pub_date, '%d.%m.%Y') AS pub_date_formatted, photos_vp.filename, photos_vp.alttext FROM news_vp LEFT JOIN photos_vp ON news_vp.photo_filename = photos_vp.filename ORDER BY news_vp.pub_date DESC";
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
	let photoFilename = null; 
    const userId = 1; 
    const privacy = 3; 
    const altText = req.body.titleInput || "Uudise pilt"; 
    
	try{
		conn = await mysql.createConnection(dbConf);
		
		if (req.file) {
			photoFilename = await savePhotoToGallery(conn, req.file, altText, privacy, userId);
		}
        
		let sqlReq = "INSERT INTO news_vp (news_title, textarea, photo_filename) VALUES (?,?,?)";
		const [newsData] = await conn.execute(sqlReq, [req.body.titleInput, req.body.textInput, photoFilename]);
		
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