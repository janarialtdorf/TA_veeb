const express = require("express");
const dateET = require("./src/dateTimeET");
const fs = require ("fs");
//päringu lahtiharutaja POST jaoks:
const bodyparser = require("body-parser");
const textRef = "public/txt/vanasonad.txt";
const logRef = "public/txt/visitlog.txt";
//käivitan express.js funktsiooni ja annan talle nimeks "app".
const app = express();
const sharp = require('sharp');
const path = require('path');
const watermarkPNG = path.join(__dirname, "public", "watermark", "vp_logo_small.png");
//Määran veebilehtede mallide renderdamise mooduli ehk VIEW ENGINE
app.set("view engine", "ejs");
//Määran ühe päris kataloogi avalikult kättesaadavaks.
app.use(express.static("public"));
//Parsime päringu URL-i, lipp false, kui ainult tekst ja true, kui muid andmeid ka:
app.use(bodyparser.urlencoded({extended: true}));

const mysql = require("mysql2/promise");
const dbInfo = require("../../../vp2025config");

const dbConf = {
	host: dbInfo.configData.host,
	user: dbInfo.configData.user,
	password: dbInfo.configData.passWord,
	database: "if25_jaltdorf"
};


async function watermark(piltData){
	const originalPhoto = piltData.filename;
	const inputPath = path.join(__dirname, "public", "gallery", "normal", originalPhoto)
	const watermarkPhoto = `watermark_${piltData.filename}`;
	const outputPath = path.join(__dirname, "public", "watermark", watermarkPhoto)
	try {
        await sharp(inputPath)
            .resize(800, 600, {fit: 'cover'})
            .composite([{input: watermarkPNG, gravity: 'southeast', tile: false}])
            .toFile(outputPath);    
        console.log(` vesimark salvestatud ${watermarkPhoto}`);
        return watermarkPhoto;

    } catch (error) {
        console.error("viga vesimargi salvestamisega", error);
        return originalPhoto; 
    }
};

app.get("/", async (req, res) => {
    let conn;
    let piltData = null;
    const sqlReq = "SELECT filename, alttext FROM photos_vp WHERE privacy = 3 AND deleted IS NULL ORDER BY id DESC LIMIT 1";
    try {
        conn = await mysql.createConnection(dbConf);
        console.log("Andmebaasiühendus loodud!");        
        const [rows, fields] = await conn.execute(sqlReq);
        if (rows.length > 0) {
            piltData = rows[0];
			const wmFilename = await watermark(piltData);
			piltData.filename = wmFilename;
        }
        res.render("index", { pilt: piltData });        
    } catch(err) {
        console.error("Viga andmebaasi päringul: " + err);
        res.render("index", { pilt: null, error: "Pilid laadimine ebaõnnestus." });       
    } finally {
        if(conn){
            await conn.end();
            console.log("Andmebaasiühendus on suletud.");
        }
    }
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
/* const külastusRouter = require("./routes/külastusRoutes");
app.use("/visits", külastusRouter); */

//eestifilm marsruudid
const eestifilmRouter = require("./routes/eestifilmRoutes");
app.use("/eestifilm", eestifilmRouter);

//Galerii fotode üleslaadimine
const photoupRouter = require("./routes/photoupRoutes");
app.use("/galleryphotoupload", photoupRouter);

//Fotogalerii
const galleryRouter = require("./routes/galleryRoutes");
app.use("/photogallery", galleryRouter);

//Uudised
const newsRouter = require("./routes/newsRoutes");
app.use("/news", newsRouter);

app.listen(5101);  