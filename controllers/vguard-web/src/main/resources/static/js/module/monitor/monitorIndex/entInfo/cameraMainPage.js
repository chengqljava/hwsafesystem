var cameraspeed = 4;//1~8
var interval = "";
$(function(){
	//速度加
	$('.btn_add').click(function() {
        var n=$(this).prev().val();
        var num=parseInt(n)+13;
        if(num>=100){
            num=100;
        }
        $(this).prev().val(num);
        $('.ind_processbar span').css({'width':num});
        if(num!=100){
            cameraspeed++;
        }
    });
    //速度减
    $('.btn_minus').click(function() {
        var n=$(this).next().next().val();
        var num=parseInt(n)-13;
        if(num<=0){
           num=0;
        }
        $(this).next().next().val(num);
        $('.ind_processbar span').css({'width':num});
        if(num!=0){
            cameraspeed--;
        }
    });
});
/**
 * 播放/暂停视频
 */
function playPause(){
	if(MonitorVideo.isplay){
		MonitorVideo.isplay = !MonitorVideo.cameraObj.stopPlay();
	}else{
		MonitorVideo.isplay = MonitorVideo.cameraObj.play();
	}
}
/**
 * 向上
 */
function cameraUp(){
	MonitorVideo.cameraObj.up(cameraspeed);
}
/**
 * 向下
 */
function cameraDown(){
	MonitorVideo.cameraObj.down(cameraspeed);
}
/**
 * 向左
 */
function cameraLeft(){
	MonitorVideo.cameraObj.left(cameraspeed);
}
/**
 * 向右
 */
function cameraRight(){
	MonitorVideo.cameraObj.right(cameraspeed);
}
/**
 * 左上
 */
function cameraLeftUp(){
	//horico,vertco,zoom
	MonitorVideo.cameraObj.leftUp(cameraspeed,cameraspeed);
}
/**
 * 左下
 */
function cameraLeftDown(){
	//horico,vertco,zoom
	MonitorVideo.cameraObj.leftDown(cameraspeed,cameraspeed);
}
/**
 * 右上
 */
function cameraRightUp(){
	//horico,vertco,zoom
	MonitorVideo.cameraObj.rightUp(cameraspeed,cameraspeed);
}
/**
 * 右下
 */
function camerarightDwon(){
	//horico,vertco,zoom
	MonitorVideo.cameraObj.rightDown(cameraspeed,cameraspeed);
}

/**
 * 调焦 增加
 */
function focalizeAdd(){
	//vertco,zoom
	MonitorVideo.cameraObj.focalizeAdd(cameraspeed);
}
/**
 * 调焦 减少
 */
function focalizeDel(){
	MonitorVideo.cameraObj.focalizeDel(cameraspeed);
}
/**
 * 变倍 增加
 */
function focusAdd(){
	MonitorVideo.cameraObj.focusAdd(cameraspeed);
}
/**
 * 变倍 减少
 */
function focusDel(){
	MonitorVideo.cameraObj.focusDel(cameraspeed);
}
/**
 * 光圈 增加
 */
function apertureAdd(){
    MonitorVideo.cameraObj.apertureAdd(cameraspeed);
}
/**
 * 光圈 减少
 */
function apertureDel(){
   MonitorVideo.cameraObj.apertureDel(cameraspeed);
}
/**
 * 注：在抓图时候，必须先打开实时预览。否则抓图失败。
 */
function iconCamera(){
	console.log("功能暂未开放,请等待...");
}
/**
 * 录像
 */
function iconVideo(){
	console.log("功能暂未开放,请等待...");
}
/**
 *暂停录像 
 */
function stopVideo(){
	console.log("功能暂未开放,请等待...");
}
/**
 * 播放
 */
function iconOn(){
     MonitorVideo.cameraObj.play();
}
/**
 * 停止播放
 */
function iconStop(){
    MonitorVideo.cameraObj.stopPlay();
}

/**
 * 展示输入3d定位参数
 */
function showLocation(){
	$("#threeparam").fadeToggle(1000);//显示和隐藏切换
}
/**
 * 定位
 */
function threeDlocation(){
	console.log("功能暂未开放,请等待...");
	return ;
	//DH_EXTPTZ_EXACTGOTO,三维精确定位 parm1：水平角度(0~3600)；parm2：垂直坐标(0~900)；parm3：变倍(1~128)
	var zoomspeed = $("#zoomspeed").val();
	var horangle = $("#horangle").val();
	var verangle = $("#verangle").val();
	var result = PtzControl(senid,cameraCommand.DH_EXTPTZ_EXACTGOTO,verangle,horangle,zoomspeed);
}

/**
 * 灯光
 */
function lamplight(){
	console.log("功能暂未开放,请等待...");
	return ;
	var result = PtzControl(senid,cameraCommand.DH_PTZ_LAMP_CONTROL,cameraspeed);
}
/**
 * 雨刷
 */
function wiper(){
	console.log("功能暂未开放,请等待...");
	return ;
	var result = PtzControl(senid,cameraCommand.DH_PTZ_LAMP_CONTROL,cameraspeed);
}
/*******云台控制结束******************/

window.onunload=function(){
	MonitorVideo.cameraObj.logoutWp();
};