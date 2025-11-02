const express = require("express");
const router = express.Router();
//kontrollerid
const {
	külastus,
	külastusAdd,
	külastusAddPost} = require("../controllers/külastusControllers");
	
router.route("/").get(külastus);

router.route("/visits").get(külastusAdd);

router.route("/regvisit").post(külastusAddPost);

module.exports = router;
