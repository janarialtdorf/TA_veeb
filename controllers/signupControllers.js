const mysql = require("mysql2/promise");
const argon2 = require("argon2");
const dbInfo = require("../../../../vp2025config");

const dbConf = {
	host: dbInfo.configData.host,
	user: dbInfo.configData.user,
	password: dbInfo.configData.passWord,
	database: "if25_jaltdorf"
	//database: dbInfo.configData.passBase
};

//@desc home page for signup
//@route GET /signup
//@access public


const signupPage = (req, res)=>{
res.render("signup", {notice: "Ootan andmeid"});
};

//@desc page for creating use account, signup
//@route POST /signup
//@access public

const signupPagePost = async (req, res)=>{
	let conn;
	console.log(req.body);
	//andmete valideerimine
	//  || tähendab sama mis OR
	if(
		!req.body.firstNameInput ||
		!req.body.lastNameInput ||
		!req.body.birthDateInput ||
		!req.body.genderInput ||
		!req.body.emailInput ||
		req.body.passwordInput.length < 8 ||
		req.body.passwordInput !== req.body.confirmPasswordInput
	){
		let notice = "Andmeid on puudu või miski on vigane!";
		console.log(notice);
		return res.render("signup", {notice: notice});
	}
	try {
		//krüpteerime parooli
		const pwdHash = await argon2.hash(req.body.passwordInput);
		//console.log(pwdHash);
		//console.log(pwdHash.length);
		conn = await mysql.createConnection(dbConf);
		let sqlReq = "INSERT INTO users_vp (first_name, last_name, birth_date, gender, email, password) VALUES (?,?,?,?,?,?)";				
		const [result] = await conn.execute(sqlReq, [
			req.body.firstNameInput,
			req.body.lastNameInput,
			req.body.birthDateInput,
			req.body.genderInput,
			req.body.emailInput,
			pwdHash
		]);
		console.log("Salvestati kasutaja: " + result.insertId);
		res.render("signup", {notice: "Kasutajakonto loodud!"});
	}
	catch(err) {
	    console.log(err);
	    res.render("signup", {notice: "Tehniline viga!"});
	}
	finally {
	    if(conn){
	    await conn.end();
	    console.log("Andmebaasiühendus on suletud!");
	    }
	}
};

module.exports = {
	signupPage,
	signupPagePost
};