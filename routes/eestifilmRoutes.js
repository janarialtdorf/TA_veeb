const express = require("express");
const router = express.Router();
//kontrollerid
const {
	eestifilm,
	inimesed,
	inimesedAdd,
	inimesedAddPost} = require("../controllers/eestifilmControllers");
	
router.route("/").get(eestifilm);

router.route("/inimesed").get(inimesed);

router.route("/inimesed_add").get(inimesedAdd);

router.route("/inimesed_add").post(inimesedAddPost);

/* router.route("/filmid").get(filmid);

router.route("/filmid_add").get(filmid_add);

router.route("/ametid").get(ametid);

router.route("/ametid_add").get(ametid_add); */

module.exports = router;
