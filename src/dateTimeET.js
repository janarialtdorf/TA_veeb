const dateFormattedET = function(){	
	let dateNow = new Date();
	const monthNamesET = ["jaanuar", "veebruar", "märts", "aprill", "mai", "juuni", "juuli", "august", "september", "oktoober", "november", "detsember"];
	return dateNow.getDate() + ". " + monthNamesET[dateNow.getMonth()] + " " + dateNow.getFullYear();
}


const timeNowFormattedET = function() {
  let timeNow = new Date();
  return timeNow.getHours() + ":" + timeNow.getMinutes() + ":" + timeNow.getSeconds();
  
}


const dayFormattedET = function() {
	let dayNow = new Date();
	const dayNamesET = ["pühapäev", "esmaspäev", "teisipäev", "kolmapäev", "neljapäev", "reede", "laupäev"];
	return dayNamesET[dayNow.getDay()];
}


const partOfDay = function() {
	let dayPart = "random time";
	let hourNow = new Date().getHours();
	if(hourNow <= 6){
		dayPart = "varahommik";
	} else if (hourNow < 12){
		dayPart = "hommik";
	} else if (hourNow == 12){
		dayPart = "keskpäev";
	} else if (hourNow > 12){
		dayPart = "pärastlõuna";
	} else if (hourNow > 16){
		dayPart = "õhtu";
	} else if (hourNow > 22){
		dayPart = "hilisõhtu";
	}
	return dayPart 
}


//export kõik vajalik
module.exports = {fullDate: dateFormattedET, fullTime: timeNowFormattedET, weekDay: dayFormattedET, partOfDay: partOfDay};