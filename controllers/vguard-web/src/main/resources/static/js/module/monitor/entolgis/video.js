videoOperation={};

/*
 * 是否连接设备
 * */
videoOperation.isConnection=function(axRealPlayX,ip,port,username,pwd){
	return axRealPlayX.SetDeviceInfo(ip,port,username,pwd);
};

/*
 * 实时播放
 * */
videoOperation.startPlay=function(axRealPlayX){
	axRealPlayX.StartPlay(0);
};

/*
 * 停止播放
 * */
videoOperation.stopPlay=function(axRealPlayX){
	axRealPlayX.StopPlay();
};