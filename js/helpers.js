window.log = function(m){
	console.log(m);
}

window.clearLocal = function(){
	localStorage.clear();
}

window.delay = function(ms, func){
	setTimeout(func, ms);
}
