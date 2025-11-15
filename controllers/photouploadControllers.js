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

const savePhotoToGallery = async (conn, file, altText, privacy = 3, userId = 1) => {
    
    const fileName = "vp_" + Date.now() + ".jpg";
    
    await fs.rename(file.path, file.destination + fileName);
    await sharp(file.destination + fileName).resize(800,600).jpeg({quality: 90}).toFile("./public/gallery/normal/" + fileName);
    await sharp(file.destination + fileName).resize(100,100).jpeg({quality: 90}).toFile("./public/gallery/thumbs/" + fileName);
    
    let sqlReq = "INSERT INTO photos_vp (filename, origname, alttext, privacy, userid) VALUES (?,?,?,?,?)";
    
    const [result] = await conn.execute(sqlReq, [fileName, file.originalname, altText, privacy, userId]);
    
    return fileName;
};

//@desc home page for Estonia film section
//@route GET /galleryphotoupload
//@access public

const photouploadPagePost = async (req, res)=>{
	let conn;
	try{
		conn = await mysql.createConnection(dbConf);
        await savePhotoToGallery(conn, req.file, req.body.altInput, req.body.privacyInput, 1);
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
	photouploadPagePost,
	savePhotoToGallery
	
};