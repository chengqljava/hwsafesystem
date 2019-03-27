//添加自定义滚动条，为淡蓝色，使用时先引入jquery.nicescroll，再在loadcompete参数方法内调用
function tableScrollResize() {
	if('niceScroll' in $('aaacas')){
	    $('.ui-jqgrid-bdiv').niceScroll({
	        cursorborder: "#4d86d6",
	        cursorcolor: "#4d86d6",
	        cursorwidth: "5px",
	        background: false,
	        autohidemode: false,
	        horizrailenabled: false
	    }).resize();
	}
	else{
		return 0;
	}
}