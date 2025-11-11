const express = require("express");
const multer = require("multer");
const mysql = require("mysql2/promise");


const router = express.Router();
//seadistame vahevara fotode üleslaadimiseks kindlasse kataloogi
const uploader = multer({dest: "./public/gallery/orig/"});

//kontrollerid
const {
	news,
	newsPost,
	newsUpload,
	newsUploadPost} = require("../controllers/newsControllers");
	
router.route("/").get(newsPost);

//router.route("/").post(newsPost);

router.route("/newsupload").get(newsUpload);

router.route("/newsupload").post(newsUploadPost);

module.exports = router;
