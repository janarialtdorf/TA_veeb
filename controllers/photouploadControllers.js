const mysql = require("mysql2/promise");
const fs = require("fs").promises;
const sharp = require("sharp");
const dbInfo = require("../../../../vp2025config");

const dbConf = {
	host: dbInfo.configData.host,
	user: dbInfo.configData.user,
	password: dbInfo.configData.passWord,
	database: "if25_jaltdorf"
	//database: dbInfo.configData.passBase
};

//@desc home page for Estonia film section
//@route GET /galleryphotoupload
//@access public


const photouploadPage = (req, res)=>{
	res.render("galleryphotoupload");
};


//@desc home page for Estonia film section
//@route GET /galleryphotoupload
//@access public

const photouploadPagePost = async (req, res)=>{
	let conn;
	//console.log(req.body);
	//console.log(req.file);
	try{
		const fileName = "vp_" + Date.now() + ".jpg";
		//console.log(fileName);
		await fs.rename(req.file.path, req.file.destination + fileName);
		//loon normaalsuuruse 800X600
	    await sharp(req.file.destination + fileName).resize(800,600).jpeg({quality: 90}).toFile("./public/gallery/normal/" + fileName);
		//loon thumbnail pildi 100X100
		await sharp(req.file.destination + fileName).resize(100,100).jpeg({quality: 90}).toFile("./public/gallery/thumbs/" + fileName);
		conn = await mysql.createConnection(dbConf);
		let sqlReq = "INSERT INTO photos_vp (filename, origname, alttext, privacy, userid) VALUES (?,?,?,?,?)";
		//Kuna kasutajakontosid veel ei ole, siis määrame userid = 1
		const userId = 1;
		const [result] = await conn.execute(sqlReq, [fileName, req.file.originalname, req.body.altInput, req.body.privacyInput, userId]);
		console.log("Salvestati kirje: " + result.insertId);
		res.render("galleryphotoupload");
	}
	catch(err){
		console.log(err);
		res.render("galleryphotoupload");
	}
    finally{
		if(conn){
		    await conn.end();
			console.log("Andmebaasiühendus on suletud.");
		}
	}
};


module.exports = {
	photouploadPage,
	photouploadPagePost	
};