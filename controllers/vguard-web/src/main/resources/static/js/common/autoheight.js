//自适应高度
function autoHeight(){
	var height = $("body").height();
//	console.log(height);
	if( height > 500 ){
		height = 500;
		$('body').css('overflow-y','auto');
	}
    //获取iframe的id  
    var frameId = window.frameElement && window.frameElement.id || '';
    //  通过iframe的id设置高度
    $(window.parent.document).find("#"+frameId).css('height',height);
//    console.log($(window.parent.document).find("#"+frameId).parent('.layui-layer-content').parent('.layui-layer'));
    $(window.parent.document).find("#"+frameId).parent('.layui-layer-content').parent('.layui-layer').css('height',height + 35 );
}
