//设置AJAX的全局默认选项
$.ajaxSetup({
	cache : false,
	global: true
});

var jdIndexArray=new Array();
$(document).ajaxSend(function() {
	if(window.top.layer != undefined){
		var i=window.top.layer.load();
		jdIndexArray.push(i);
	}
});

$(document).ajaxSuccess(function(){
	var i=jdIndexArray.pop();
	if(i != undefined)
		window.top.layer.close(i);
});

$(document).ajaxError(function(){
	var i=jdIndexArray.pop();
	window.top.layer.close(i);
});

