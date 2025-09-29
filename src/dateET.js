//function dateFormattedET(){
exports.dateFormattedET = function(){	
	let dateNow = new Date();
	//let dateNow = timeNow.getDate();
	//let monthNow = timeNow.getMonth();
	//let yearNow = timeNow.getYear();
	//let yearNow = timeNow.getFullYear();
	const monthNamesET = ["jaanuar", "veebruar", "märts", "aprill", "mai", "juuni", "juuli", "august", "september", "oktoober", "november", "detsember"];
	return `${dateNow.getDate()}. ${monthNamesET[dateNow.getMonth()]} ${dateNow.getFullYear()}`;
}