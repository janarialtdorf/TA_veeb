const express = require("express");
const fs = require ("fs");
const textRef = "../public/txt/vanasonad.txt";
const logRef = "../public/txt/visitlog.txt";
const dateET = require("../public/src/dateTimeET.js");
const külastusAddPost = (req, res)=>{
	res.render("regvisit");
};

//app.get("/kulastus", (req, res)=>{
const külastusAdd = (req, res)=>{
	res.render("visitregistered");
};


//app.post("/regvisit", (req, res)=>{
const külastus = (req, res)=>{
	console.log(req.body);
	fs.open("../public/txt/visitlog.txt", "a", (err, file)=>{
		if(err){
			throw(err);
		}
		else{
		fs.appendFile("../public/txt/visitlog.txt", req.body.firstNameInput + " " + req.body.lastNameInput + " " + dateET.fullDate() + " " + "kell: " + dateET.fullTime() + "; ", (err)=>{
			if(err){
				throw(err);
			}
			else{
				console.log("Salvestatud!");
				res.render("visitregistered");
			}
		});
		}
	});	
};

module.exports = {
	külastus,
	külastusAdd,
	külastusAddPost
	};