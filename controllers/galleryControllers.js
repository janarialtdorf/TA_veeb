const mysql = require("mysql2/promise");
const dbInfo = require("../../../../vp2025config");

const dbConf = {
	host: dbInfo.configData.host,
	user: dbInfo.configData.user,
	password: dbInfo.configData.passWord,
	database: "if25_jaltdorf"
};

//@desc home page for photogallery
//@route GET /photogallery
//@access public

const galleryHome = async (req, res)=>{
	res.redirect("/photogallery/1");
};

const galleryPage = async (req, res)=>{
	let conn;
	const photoLimit = 3;
	const privacy = 2;
	let page = parseInt(req.params.page);
	//let skip = (page - 1) * photoLimit;
	let skip = 0;
	
	try {
		//kontrollin, et poleks liiga väike lehekülg
		if(page < 1 || isNaN(page)){
			page = 1;
		}
		//vaatame, palju üldse fotosid on
		conn = await mysql.createConnection(dbConf);
		let sqlReq = "SELECT COUNT(id) AS photos FROM photos_vp WHERE privacy >= ? AND DELETED IS NULL";
		const [countResult] = await conn.execute(sqlReq, [privacy]);
		const photoCount = countResult[0].photos;
		//parandame lehekülje numbrid, kui see on valitud liiga suur
		if((page - 1) * photoLimit >= photoCount){
			page = Math.max(1, Math.ceil(photoCount / photoLimit));
		}
		skip = (page - 1) * photoLimit;
		//navigatsioonilinkide loomine
		//eelmine leht
		if(page === 1){
			galleryLinks = "Eelmine leht &nbsp;&nbsp;&nbsp; | &nbsp;&nbsp;&nbsp;";
		} else {
			galleryLinks = `<a href="/photogallery/${page - 1}">Eelmine leht</a>&nbsp;&nbsp;&nbsp; | &nbsp;&nbsp;&nbsp;`;
		}
		if(page * photoLimit >= photoCount){
			galleryLinks += "Järgmine leht";
		} else {
			galleryLinks += `<a href="/photogallery/${page + 1}">Järgmine leht</a>`;
		}  
		//fotode andmebaasist lugemine
		sqlReq = "SELECT filename, alttext FROM photos_vp WHERE privacy >= ? AND deleted IS NULL LIMIT ?,?";
		const [rows, fields] = await conn.execute(sqlReq, [privacy, skip, photoLimit]);
		let galleryData = [];
		for (let i = 0; i < rows.length; i ++){
			let altText = "Galeriipilt";
			if(rows[i].alttext != ""){
				altText = rows[i].alttext;
			}
			galleryData.push({src: rows[i].filename, alt: altText});
		}
		res.render("photogallery", {galleryData: galleryData, imagehref: "/gallery/thumbs/", links: galleryLinks});
	}
	catch(err){
		console.log(err);
		res.render("photogallery", {listData: [], imagehref: "/gallery/thumbs/", links: ""});
	}
	finally {
	  if(conn){
	    await conn.end();
	    console.log("Andmebaasiühendus on suletud!");
	  }
	}
};

module.exports = {
	galleryHome,
	galleryPage
};