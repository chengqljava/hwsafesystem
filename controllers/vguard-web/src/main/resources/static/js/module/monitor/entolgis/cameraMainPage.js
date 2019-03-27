var axRealPlayX;
var cameraspeed = 4;//1~8
var senid = "0";//摄像头通道
var cameraOsdLine = 6;//摄像头可以显示的行数
var camerachroReftime = $("#camerachroReftime").val();
var interval = "";
$(function(){
	//刷新摄像头浓度叠加
	clearInterval(interval);//清除js定时器
	
	$( "#slider" ).slider({ 
		max:8,
		min:1,
		step:1,
		value:1
	});
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
 * 播放视频
 */
function play(){
	var start = function(obj){
		bSuccess = obj.axRealPlayX.StartPlay(0);
	};
	//findRealPlayX(rooid,start)
}
/**
 * 视频和浓度叠加 
 * 新的 正在使用的
 */
var tempsennum = new Array();
function setOsdCfg(){
	var rooid = $("#rooid").val();
	var setOsdcfg = function(obj,sensnum,json){
		var count = 0;
		if(tempsennum.length == json.length){
			tempsennum = [];//清空，所有的探测器信息都显示了
		}
		for(var j = 0;j<json.length && obj.bSuccess;j++){
	    	if(json[j].hoststyle==1){//1未探测器
	    		if(tempsennum.contains(json[j].sensnum)){
	    			continue;
	    		}
	    		var labname = json[j].labname == undefined?"":json[j].labname;
	    		if(labname.length>8){
	    			labname = labname.substring(0,labname.lastIndexOf('实验室'));
	    			if(labname.length>8){
	    				labname = labname.substring(0,8);
	    			}
	    		}
				var message=labname+" "+(json[j].gasname == undefined ? "":json[j].gasname)+" "+(json[j].realchro == undefined?"":json[j].realchro)+" "+(json[j].unitname==undefined?"":json[j].unitname);
				//参数为 通道号 叠加字符串(<32 Bytes) 行号(0~5) 设置使能(true:设置 false：取消设置)  探头状态(true:正常 false：异常)
				//console.log("message==="+message+"..count=="+count+"  senid=="+obj.senid+".."+new Date().toLocaleString()+"..json[j].hoststyle="+json[j].hoststyle+"..json[j].sensnum="+json[j].sensnum+"..sensnum"+sensnum);
				var res = obj.axRealPlayX.SetOsdCfg(obj.senid,message,count,true,true);
				if(res){
					count++;
				}
	    	}
	    	tempsennum.push(json[j].sensnum);
	    	if(count == cameraOsdLine){
				break;
			}
	    }
		//如果这次没有显示cameraOsdLine多条，将多余的清除
		for(var i=0;i<(cameraOsdLine-count);i++){
			var res = obj.axRealPlayX.SetOsdCfg(obj.senid,"",count+i,true,true);
		}
	};
	findRealPlayX(rooid,setOsdcfg,"");
}


/**
 * 连接摄像头
 * @param rooid 房间Id
 * @param callback 回调函数
 */
function findRealPlayX(rooid,callback,sensnum){
	if(rooid == ""){
		return ;
	}
	$.ajax({
		type : 'post',
		url : BASE_URL+'/monitor/monrealdata/findCamera/'+rooid,
		dataType : 'json',
		async:true,//是否异步 
		success : function(json) {
			if(json!=null && json.length>0){
				try{
					var ip = "";
					var port ="";
					var usr ="";
					var pwd ="";
					var count = 0;
					for(var i=0;i<json.length;i++){
						if(json[i].hoststyle==2){
							ip = json[i].hostip;
							port = json[i].hostport;
							usr = json[i].hostusr;
							pwd = json[i].hostpsw;
							senid = (parseInt(json[i].sensid)-1);
							break;
						}
					}
					if(ip!=""){
						axRealPlayX = document.getElementById('RealPlayX');
					    var bSuccess = axRealPlayX.SetDeviceInfo(ip,port,usr,pwd);
					    callback.call(this,{axRealPlayX:axRealPlayX,senid:senid,bSuccess:bSuccess},sensnum,json);//回调函数
					}
			    }catch(e){
			    	//如果是firefox等不支持摄像头插件的浏览器就会走catch中
			    }
			}
		},error:function(){
			console.log("获取浓度值没有成功：error");
		}
	});
}

/********云台控制开始*************/
var cameraCommand = {
	DH_PTZ_UP_CONTROL:0,// 上
	DH_PTZ_DOWN_CONTROL:1,// 下
	DH_PTZ_LEFT_CONTROL:2,// 左
	DH_PTZ_RIGHT_CONTROL:3,// 右
	DH_EXTPTZ_LEFTTOP:0x20,// 左上
	DH_EXTPTZ_RIGHTTOP:0x21,// 右上
	DH_EXTPTZ_LEFTDOWN:0x22,// 左下
	DH_EXTPTZ_RIGHTDOWN:0x23,// 右下
	DH_PTZ_ZOOM_ADD_CONTROL:4,// 变倍+
	DH_PTZ_ZOOM_DEC_CONTROL:5,// 变倍-
	DH_PTZ_FOCUS_ADD_CONTROL:6,// 调焦+
	DH_PTZ_FOCUS_DEC_CONTROL:7,// 调焦-
	DH_PTZ_APERTURE_ADD_CONTROL:8,// 光圈+
	DH_PTZ_APERTURE_DEC_CONTROL:9,// 光圈-
    DH_PTZ_POINT_MOVE_CONTROL:10,// 转至预置点
    DH_PTZ_POINT_SET_CONTROL:11,// 设置
    DH_PTZ_POINT_DEL_CONTROL:12,// 删除
    DH_PTZ_POINT_LOOP_CONTROL:13,// 点间巡航
    DH_PTZ_LAMP_CONTROL:14,// 灯光雨刷
    DH_EXTPTZ_EXACTGOTO:0x43//三维精确定位
};

//延迟执行 闭包
function throttle(fn) {  // 闭包  节流
    var timer = null;
    return function() {
        clearTimeout(timer);
        timer = setTimeout(fn,1000);
    };
}

var timer = null;
function PtzControl(senid,Command,horspeed,dwstop,horangle,zoomspeed){
	//参数为 通道号、云台命令、水平坐标(0~3600)、垂直速度(1~8)/水平速度(1~8)/垂直坐标（0~900）、变倍(1~128)、是否停止(false)
	if(horangle == undefined || horangle == ""){
		horangle = 0;
	}
	if(zoomspeed == undefined || zoomspeed==""){
		zoomspeed = 1;
	}
	if(axRealPlayX != undefined){
		var result = axRealPlayX.PtzControl(senid,Command,horangle,horspeed,zoomspeed,false);
		console.log("result=="+result+"Command=="+Command+"  senid=="+senid+"..horspeed="+horspeed+"..zoomspeed="+zoomspeed+"..horangle="+horangle);
		clearTimeout(timer);
		timer = setTimeout(function(){
			var res = axRealPlayX.PtzControl(senid,Command,horangle,horspeed,zoomspeed,true);
			console.log("res=="+res);
		},1000);
		return result;
	}
}

/**
 * 向上
 */
function cameraUp(){
	var cameraBusiness = $("#cameraBusiness").val();
    if(cameraBusiness==0){//大华
	   //参数为 通道号、云台命令、步进速度(1~8)、是否停止(false)
       var result = PtzControl(1,cameraCommand.DH_PTZ_UP_CONTROL,cameraspeed);
    }else{
        CameraHK.cameraUp(false,cameraspeed);
    }
}
/**
 * 向下
 */
function cameraDown(){
	var cameraBusiness = $("#cameraBusiness").val();
    if(cameraBusiness==0){//大华
       var result = PtzControl(senid,cameraCommand.DH_PTZ_DOWN_CONTROL,cameraspeed);
    }else{
        CameraHK.cameraDown(false,cameraspeed);
    }
}
/**
 * 向左
 */
function cameraLeft(){
	var cameraBusiness = $("#cameraBusiness").val();
    if(cameraBusiness==0){//大华
       var result = PtzControl(senid,cameraCommand.DH_PTZ_LEFT_CONTROL,cameraspeed);
    }else{
        CameraHK.cameraLeft(false,cameraspeed);
    }
}
/**
 * 向右
 */
function cameraRight(){
	var cameraBusiness = $("#cameraBusiness").val();
    if(cameraBusiness==0){//大华
       var result = PtzControl(senid,cameraCommand.DH_PTZ_RIGHT_CONTROL,cameraspeed);
    }else{
        CameraHK.cameraRight(false,cameraspeed);
    }
}
/**
 * 左上
 */
function cameraLeftUp(){
	var cameraBusiness = $("#cameraBusiness").val();
    if(cameraBusiness==0){//大华
       var result = PtzControl(senid,cameraCommand.DH_EXTPTZ_LEFTTOP,cameraspeed);
    }else{
        CameraHK.cameraLeftUp(false,cameraspeed);
    }
}
/**
 * 左下
 */
function cameraLeftDown(){
	var cameraBusiness = $("#cameraBusiness").val();
    if(cameraBusiness==0){//大华
       var result = PtzControl(senid,cameraCommand.DH_EXTPTZ_LEFTDOWN,cameraspeed);
    }else{
        CameraHK.cameraLeftDown(false,cameraspeed);
    }
}
/**
 * 右上
 */
function cameraRightUp(){
	var cameraBusiness = $("#cameraBusiness").val();
    if(cameraBusiness==0){//大华
       var result = PtzControl(senid,cameraCommand.DH_EXTPTZ_RIGHTTOP,cameraspeed);
    }else{
        CameraHK.cameraRightUp(false,cameraspeed);
    }
}
/**
 * 右下
 */
function camerarightDwon(){
	var cameraBusiness = $("#cameraBusiness").val();
    if(cameraBusiness==0){//大华
       var result = PtzControl(senid,cameraCommand.DH_EXTPTZ_RIGHTDOWN,cameraspeed);
    }else{
        CameraHK.camerarightDwon(false,cameraspeed);
    }
}

/**
 * 调焦 增加
 */
function focalizeAdd(){
	var cameraBusiness = $("#cameraBusiness").val();
    if(cameraBusiness==0){//大华
       var result = PtzControl(senid,cameraCommand.DH_PTZ_FOCUS_ADD_CONTROL,cameraspeed);
    }else{
        CameraHK.focalizeAdd();
    }
}
/**
 * 调焦 减少
 */
function focalizeDel(){
	var cameraBusiness = $("#cameraBusiness").val();
    if(cameraBusiness==0){//大华
       var result = PtzControl(senid,cameraCommand.DH_PTZ_FOCUS_DEC_CONTROL,cameraspeed);
    }else{
        CameraHK.focalizeDel();
    }
}
/**
 * 变倍 增加
 */
function focusAdd(){
	var cameraBusiness = $("#cameraBusiness").val();
    if(cameraBusiness==0){//大华
       var result = PtzControl(senid,cameraCommand.DH_PTZ_ZOOM_ADD_CONTROL,cameraspeed);
    }else{
        CameraHK.focusAdd();
    }
}
/**
 * 变倍 减少
 */
function focusDel(){
	var cameraBusiness = $("#cameraBusiness").val();
    if(cameraBusiness==0){//大华
       var result = PtzControl(senid,cameraCommand.DH_PTZ_ZOOM_DEC_CONTROL,cameraspeed);
    }else{
        CameraHK.focusDel();
    }
}
/**
 * 光圈 增加
 */
function apertureAdd(){
    var cameraBusiness = $("#cameraBusiness").val();
    if(cameraBusiness==0){//大华
       var result = PtzControl(senid,cameraCommand.DH_PTZ_APERTURE_ADD_CONTROL,cameraspeed);
    }else{
        CameraHK.apertureAdd();
    }
}
/**
 * 光圈 减少
 */
function apertureDel(){
    var cameraBusiness = $("#cameraBusiness").val();
    if(cameraBusiness==0){//大华
	   var result = PtzControl(senid,cameraCommand.DH_PTZ_APERTURE_DEC_CONTROL,cameraspeed);
    }else{
        CameraHK.apertureDel();
    }
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
/**
 * 注：在抓图时候，必须先打开实时预览。否则抓图失败。
 */
function iconCamera(){
    var cameraBusiness = $("#cameraBusiness").val();
    if(cameraBusiness == 0){//大华
    	console.log("功能暂未开放,请等待...");
    	return ;
    	var path = $("#camearPicturePath").val();
    	var result = axRealPlayX.CapPicture(path+getFormatDate(new Date(),"yyyyMMddhhmmss")+".bmp");//参数为： .bmp格式的文件名（包含存放的路径）
    	console.log("iconCamera=="+result);
    }else{
        CameraHK.clickCapturePic(0);
    }
}
/**
 * 录像
 * 数值 意义 
 * 0 为不录像 
 * 1 手动录像 
 * 2 为自动录像 
 */
function iconVideo(){
    var cameraBusiness = $("#cameraBusiness").val();
    if(cameraBusiness == 0){//大华
    	console.log("功能暂未开放,请等待...");
    	return ;
    	var result = axRealPlayX.SetRecordState(2);//参数为：录像状态缓冲区，总长度为通道个数.长度暂定为16Bytes.
    	console.log("iconVideo=="+result);
    }else{//海康
        CameraHK.clickStartRecord(0);
    }
}
/**
 *暂停录像 
 */
function stopVideo(){
    var cameraBusiness = $("#cameraBusiness").val();
    if(cameraBusiness == 0){//大华
    	console.log("功能暂未开放,请等待...");
    	return ;
    	var result = axRealPlayX.SetRecordState(0);
    	console.log("stopVideo=="+result);
	}else{//海康
	    CameraHK.clickStopRecord();
	}
}
var axRealPlayX;
/**
 * 播放
 */
function iconOn(){
     var cameraBusiness = $("#cameraBusiness").val();//区别摄像头厂家的 0大华 1海康
     var data = eval("("+$('.videoPop').attr('ip')+")");//存放的ip地址
     var strDvrIP =data.IPADDR;//"192.168.88.202";       
     var nPort = data.PORT;//37777;        
     var strUserName = data.USERNAME;//"admin";
     var strPwd =data.PASSWORD;//"admin";
     var nChannel = 0   ;    
	 if(cameraBusiness == 0){//大华
    	 axRealPlayX= document.getElementById('RealPlayX');  
    	 var bSuccess = axRealPlayX.SetDeviceInfo(strDvrIP, nPort,strUserName, strPwd);
    	 if (bSuccess){ 
    		 bSuccess = axRealPlayX.StartPlay(0);
    	 }
     }else if(cameraBusiness == 1){//海康
         //strDvrIP, nPort,strUserName, strPwd,iStreamType,iChannelID,isZearoChannel
         var iStreamType="1";//<option value="1">主码流</option>
                             //<option value="2">子码流</option>
                             //<option value="3">第三码流</option>
         var iChannelID="1";//通道
         var isZearoChannel = "false";
         CameraHK.play(strDvrIP, nPort,strUserName, strPwd,iStreamType,iChannelID,isZearoChannel);
     }
}
/**
 * 停止播放
 */
function iconStop(){
    var cameraBusiness = $("#cameraBusiness").val();
    if(cameraBusiness == 0){//大华
    	if(axRealPlayX == undefined){
    		return;
    	}
    	axRealPlayX.StopPlay();
    }else if(cameraBusiness == 1){//海康
         CameraHK.stop();//停止播放
    }
}
/*******云台控制结束******************/


// window.onload=function(){btRealPlay_onclick();}
function onunload() {
    var cameraBusiness = $("#cameraBusiness").val();//区别摄像头厂家的 0大华 1海康
    if(cameraBusiness == 0){//大华
        document.all('RealPlayX').StopPlay();
    }else{
	    var data = eval("("+$('.videoPop').attr('ip')+")");//存放的ip地址
        var strDvrIP = data.IPADDR;
        CameraHK.clickLogout(strDvrIP);
	}
}


