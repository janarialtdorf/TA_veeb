const express = require("express");
const router = express.Router();
//kontrollerid
const {
	külastus,
	külastusAdd,
	külastusAddPost} = require("../controllers/külastusControllers");
	
router.route("/").get(külastus);

router.route("/visitadd").get(külastusAdd);

router.route("/visitadd").post(külastusAddPost);

module.exports = router;
