/**
* 弹出框
*/
function openWin(url, title, width, height, maxmin, shade) {
	//在手机上使用时 弹出框默认全屏
	if($(window).width()<700){
		width="100%";
		height="100%";
		maxmin=false;
	}else{//PC端
		var defWidth =  '56%';//默认宽度
	    var defHeight = '55%';//默认高度
		if(width == undefined || width == null || width == ""){
			width = defWidth;
		}
		if(height == undefined || height == null || height == ""){
		   height = defHeight;
		}
		maxmin = maxmin == undefined ? true : maxmin;
	}
    var index = layer.open({
      type: 2,
      title: title,
      shadeClose: false,
      shade: shade == undefined ? 0.3 : 0,
	  maxmin: maxmin, //开启最大化最小化按钮
      area: [width,height],
      content:url,
      success: function(layero){
    	 layer.setTop(layero); //开启多窗口时可以点击title能够切换至最高层
      }
    });
    layer.dialogArr.push(index);
    return index;
}


/**
* 弹出框 为了点击关闭时做的操作
*/
function openWinWithCloseCallback(url, title, width, height, maxmin, closeCallBack, endCallBack, shade){
	//在手机上使用时 弹出框默认全屏
	if($(window).width()<700){
		width="100%";
		height="100%";
		maxmin=false;
	}else{//PC端
		var defWidth =  '56%';//默认宽度
	    var defHeight = '55%';//默认高度
		if(width == undefined || width == null || width == ""){
			width = defWidth;
		}
		if(height == undefined || height == null || height == ""){
		   height = defHeight;
		}
		maxmin=maxmin==undefined?true:maxmin;
	}
    var index = layer.open({
      type: 2,
      title: title,
      shadeClose: false,
      shade: shade == undefined ? 0.3 : 0,
	  maxmin: maxmin, //开启最大化最小化按钮
      area: [width,height],
      content:url,
      cancel:closeCallBack,
      end:endCallBack
    });
    layer.dialogArr.push(index);
    return index;
}

/**
* 关闭当前弹出框
*/
function closeWin(){
    //当前弹出框层
    var currIndex = layer.dialogArr[layer.dialogArr.length-1];
 	layer.close(currIndex);
}

/**
* 关闭所有打开的弹出框
*/
function closeAllWin(){
 	layer.closeAll();
 	layer.dialogIndex.length=0;
}

/* 提示信息*/
function toast(msg){
    layer.msg(msg, {
      time: 2000//2秒关闭（如果不配置，默认是3秒）
    }, function(){
     
    });
}

/* 询问框*/
function confirm(msg,callback){
	layer.confirm(msg, function(index){
	  callback();
	  layer.close(index);
	});  
}

/**
 * 多个弹出框嵌套时，获取当前弹出框的父弹出框的index
 * @returns
 */
function getParentIndex(){
	return layer.dialogArr[layer.dialogArr.length-2];
}

/**
 * 获取当前弹出框的index
 * @returns
 */
function getSelfIndex(){
	return layer.dialogArr[layer.dialogArr.length-1];
}

function getGrandIndex(){
	return layer.dialogArr[layer.dialogArr.length-3];
}
