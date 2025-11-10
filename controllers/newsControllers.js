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


const news = (req, res)=>{
	res.render("uudised");
};



module.exports = {news};