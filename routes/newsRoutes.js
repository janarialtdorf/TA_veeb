const express = require("express");
const multer = require("multer");
const mysql = require("mysql2/promise");


const router = express.Router();
//seadistame vahevara fotode üleslaadimiseks kindlasse kataloogi
const uploader = multer({dest: "./public/gallery/orig/"});

//kontrollerid
const {news} = require("../controllers/photouploadControllers");
	
router.route("/").get(news);

module.exports = router;
