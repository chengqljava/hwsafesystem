/**
 * 海康视频播放 
 * @auther:刘赵强
 * @date：2016/09/28
 */
/**
 *常量对象 
 */
var constants = {
    noInstallMsg:"您还未安装过插件，双击开发包目录里的WebComponents.exe安装！",
    downloadMsg:"您还未安装插件，是否下载安装",
    upInstallMsg:"检测到新的插件版本，双击开发包目录里的WebComponents.exe升级！",
    /*******云台控制方向代码 开始**********************/
    cameraUp:1,
    cameraDown:2,
    cameraLeft:3,
    cameraRight:4,
    cameraLeftUp:5,
    cameraLeftDown:6,
    cameraRightUp:7,
    camerarightDwon:8,
    /********云台控制方向代码 结束*********************/
};
/**
 *海康视频对象 
 */
var CameraHK={
    g_iWndIndex:0,
    showOPInfo:function(msg){
      console.info(msg);  
    },
    /**
     * 监测插件是否安装
     * 已安装返回true  未安装返回 false
     */
    isInstall:function(){
        if (-1 == WebVideoCtrl.I_CheckPluginInstall()) {
            layer.confirm(constants.downloadMsg, {
                btn: ['下载','取消'], //按钮
                shade: false //不显示遮罩
            }, function(index){
                window.location.href = BASE_URL+"/monitor/macmonitormap/downloadWebComponents";
                layer.close(index);
            });
            return false;
        }else{
            return true;
        }
    },
    /**
     * 初始化插件参数及插入插件 
     */
    init:function(successCallback){//500宽  400高
        if(CameraHK.isInstall()){
            WebVideoCtrl.I_InitPlugin(520, 335, {
                iWndowType: 1,//初始化分屏 1*1
                cbSelWnd: function (xmlDoc) {
                    CameraHK.g_iWndIndex = $(xmlDoc).find("SelectWnd").eq(0).text();
                    var szInfo = "当前选择的窗口编号：" + CameraHK.g_iWndIndex;
                    CameraHK.showOPInfo(szInfo);
                }
            });
            WebVideoCtrl.I_InsertOBJECTPlugin("divPlugin");
            successCallback();
        }
    },
    /**
     *窗口分隔数 
     */
    changeWndNum:function(iType){
        iType = parseInt(iType, 10);
        WebVideoCtrl.I_ChangeWndNum(iType);
    },
    /**
     *检查插件是否最新
     *有更新 返回true 没有返回false
     */
    isupdate:function(){
        if (-1 == WebVideoCtrl.I_CheckPluginVersion()) {
        	console.log(constants.upInstallMsg);
            return true;
        }else{
            return false;
        }
    },
    /**
     *登录 
     */
    login:function(ip,port,username,password,successCallback){
        if ("" == ip || "" == port) {
            return;
        }
        var iRet = WebVideoCtrl.I_Login(ip, 1, port, username, password, {
            success: function (xmlDoc) {
                successCallback();
                CameraHK.showOPInfo(ip + " 登录成功！");
                setTimeout(function () {
                    CameraHK.getChannelInfo();
                }, 10);
            },
            error: function () {
            	console.log("登录失败,请检查用户名密码!");
                CameraHK.showOPInfo(ip+".."+username+".."+password+".."+port + " 登录失败！");
            }
        });
        if (-1 == iRet) {
            successCallback();
            CameraHK.showOPInfo(ip + " 已登录过！");
        } 
    },
    /**
     *退出 
     */
    clickLogout:function(szIP){
        var szInfo = "";
        if (szIP == "") {
            return;
        }
        var iRet = WebVideoCtrl.I_Logout(szIP);
        if (0 == iRet) {
            szInfo = "退出成功！";
            CameraHK.getChannelInfo();
        } else {
            szInfo = "退出失败！";
        }
        CameraHK.showOPInfo(szIP+"..."+szInfo);
    },
    /**
     *获取通道 
     */
    getChannelInfo:function(){
        
    },
    /**
     *全屏 
     */
    clickFullScreen:function(){
        WebVideoCtrl.I_FullScreen(true);
    },
    /**
     *开始预览 
     * (strDvrIP,iStreamType,iChannelID,isZearoChannel);
     */
    clickStartRealPlay:function(szIP,iStreamType,iChannelID,bZeroChannel){
        var oWndInfo = WebVideoCtrl.I_GetWindowStatus(CameraHK.g_iWndIndex);
        szInfo = "";
        if ("" == szIP) {
            return;
        }
        if (oWndInfo != null) {// 已经在播放了，先停止
            WebVideoCtrl.I_Stop();
        }
        var iRet = WebVideoCtrl.I_StartRealPlay(szIP, {
            iStreamType: iStreamType,
            iChannelID: iChannelID,
            bZeroChannel: bZeroChannel
        });
    
        if (0 == iRet) {
            szInfo = "开始预览成功！";
        } else {
            szInfo = "开始预览失败！";
        }
        CameraHK.showOPInfo(szIP + " " + szInfo);
    },
    /**
     *播放视频 
     */
    play:function(strDvrIP, nPort,strUserName, strPwd,iStreamType,iChannelID,isZearoChannel){
       CameraHK.login(strDvrIP,nPort,strUserName,strPwd,function(){
             CameraHK.clickStartRealPlay(strDvrIP,iStreamType,iChannelID,isZearoChannel);
       });
    },
    /**
     *暂停播放 
     */
    stop:function(){
        var oWndInfo = WebVideoCtrl.I_GetWindowStatus(CameraHK.g_iWndIndex),
        szInfo = "";
        if (oWndInfo != null) {
            var iRet = WebVideoCtrl.I_Stop();
            if (0 == iRet) {
                szInfo = "暂停成功！";
            } else {
                szInfo = "暂停失败！";
            }
            CameraHK.showOPInfo(oWndInfo.szIP + " " + szInfo);
        }
    },
    /**
     *截图 
     */
    clickCapturePic:function(szChannelID){
        var oWndInfo = WebVideoCtrl.I_GetWindowStatus(CameraHK.g_iWndIndex),
        szInfo = "";
        if (oWndInfo != null) {
            var szPicName = oWndInfo.szIP + "_" + szChannelID + "_" + new Date().getTime(),
                iRet = WebVideoCtrl.I_CapturePic(szPicName);
            if (0 == iRet) {
                szInfo = "抓图成功！";
            } else {
                szInfo = "抓图失败！";
            }
            console.log(szInfo);
            CameraHK.showOPInfo(oWndInfo.szIP + " " + szInfo);
        }
    },
    /**
     *开始录像 
     */
    clickStartRecord:function(szChannelID){
        var oWndInfo = WebVideoCtrl.I_GetWindowStatus(CameraHK.g_iWndIndex),
        szInfo = "";
        if (oWndInfo != null) {
            var szFileName = oWndInfo.szIP + "_" + szChannelID + "_" + new Date().getTime();
            var iRet = WebVideoCtrl.I_StartRecord(szFileName);
            if (0 == iRet) {
                szInfo = "开始录像成功！";
            } else {
                szInfo = "开始录像失败！";
            }
            CameraHK.showOPInfo(oWndInfo.szIP + " " + szInfo);
        }
    },
    /**
     *停止录像 
     */
    clickStopRecord:function(){
        var oWndInfo = WebVideoCtrl.I_GetWindowStatus(CameraHK.g_iWndIndex),
        szInfo = "";
        if (oWndInfo != null) {
            var iRet = WebVideoCtrl.I_StopRecord();
            if (0 == iRet) {
                szInfo = "停止录像成功！";
            } else {
                szInfo = "停止录像失败！";
            }
            CameraHK.showOPInfo(oWndInfo.szIP + " " + szInfo);
        }
    },
    /**
     *停止云台控制 
     */
    mouseUpPTZControl:function(){
        var oWndInfo = WebVideoCtrl.I_GetWindowStatus(CameraHK.g_iWndIndex);
        if (oWndInfo != null) {
            WebVideoCtrl.I_PTZControl(1, true, {
                success: function (xmlDoc) {
                    CameraHK.showOPInfo(oWndInfo.szIP + " 停止云台成功！");
                },
                error: function () {
                    CameraHK.showOPInfo(oWndInfo.szIP + " 停止云台失败！");
                }
            });
        }
    },
    g_bPTZAuto:false,//是否自动开启
    /**
     *云台控制 
     * 9为自动，1,2,3,4,5,6,7,8为方向PTZ
     */
    mouseDownPTZControl:function(bZeroChannel,iPTZIndex,iPTZSpeed){
        CameraHK.showOPInfo("调用云台！方向=="+iPTZIndex+"..速度=="+iPTZSpeed);
        var oWndInfo = WebVideoCtrl.I_GetWindowStatus(CameraHK.g_iWndIndex);
        bStop = false;
        if (bZeroChannel) {// 零通道不支持云台
            CameraHK.showOPInfo("零通道不支持云台");
            return;
        }
        if (oWndInfo != null) {
            if (9 == iPTZIndex && CameraHK.g_bPTZAuto) {
                iPTZSpeed = 0;// 自动开启后，速度置为0可以关闭自动
                bStop = true;
            } else {
                CameraHK.g_bPTZAuto = false;// 点击其他方向，自动肯定会被关闭
                bStop = false;
            }
            WebVideoCtrl.I_PTZControl(iPTZIndex, bStop, {
                iPTZSpeed: iPTZSpeed,
                success: function (xmlDoc) {
                    if (9 == iPTZIndex) {
                        CameraHK.g_bPTZAuto = !CameraHK.g_bPTZAuto;
                    }
                    CameraHK.showOPInfo(oWndInfo.szIP + " 开启云台成功！");
                    //1秒后停止云台控制
                    window.setTimeout(CameraHK.mouseUpPTZControl,2000);
                },
                error: function () {
                    CameraHK.showOPInfo(oWndInfo.szIP + " 开启云台失败！");
                }
            });
        }
    },
    /**
     *向上 
     */
    cameraUp:function(isZearoChannel,iPTZSpeed){
        CameraHK.mouseDownPTZControl(isZearoChannel,constants.cameraUp,iPTZSpeed);
    },
    /**
     *向下
     */
    cameraDown:function(isZearoChannel,iPTZSpeed){
        CameraHK.mouseDownPTZControl(isZearoChannel,constants.cameraDown,iPTZSpeed);
    },
    /**
     *向左 
     */
    cameraLeft:function(isZearoChannel,iPTZSpeed){
        CameraHK.mouseDownPTZControl(isZearoChannel,constants.cameraLeft,iPTZSpeed);
    },
    /**
     *向右 
     */
    cameraRight:function(isZearoChannel,iPTZSpeed){
        CameraHK.mouseDownPTZControl(isZearoChannel,constants.cameraRight,iPTZSpeed);
    },
    /**
     *左上 
     */
    cameraLeftUp:function(isZearoChannel,iPTZSpeed){
       CameraHK.mouseDownPTZControl(isZearoChannel,constants.cameraLeftUp,iPTZSpeed);
    },
    /**
     *左下 
     */
    cameraLeftDown:function(isZearoChannel,iPTZSpeed){
        CameraHK.mouseDownPTZControl(isZearoChannel,constants.cameraLeftDown,iPTZSpeed);
    },
    /**
     *右上 
     */
    cameraRightUp:function(isZearoChannel,iPTZSpeed){
        CameraHK.mouseDownPTZControl(isZearoChannel,constants.cameraRightUp,iPTZSpeed);
    },
    /**
     *右下 
     */
    camerarightDwon:function(isZearoChannel,iPTZSpeed){
       CameraHK.mouseDownPTZControl(isZearoChannel,constants.camerarightDwon,iPTZSpeed);
    },
    /**
     *调焦停止 
     */
    PTZZoomStop:function(){
        var oWndInfo = WebVideoCtrl.I_GetWindowStatus(CameraHK.g_iWndIndex);
        if (oWndInfo != null) {
            WebVideoCtrl.I_PTZControl(11, true, {
                iWndIndex: CameraHK.g_iWndIndex,
                success: function (xmlDoc) {
                    CameraHK.showOPInfo(oWndInfo.szIP + " 调焦停止成功！");
                },
                error: function () {
                    CameraHK.showOPInfo(oWndInfo.szIP + "  调焦停止失败！");
                }
            });
        }
    },
    /**
     *调焦 增加 
     */
    focalizeAdd:function(){
        var oWndInfo = WebVideoCtrl.I_GetWindowStatus(CameraHK.g_iWndIndex);
        if (oWndInfo != null) {
            WebVideoCtrl.I_PTZControl(10, false, {
                iWndIndex: CameraHK.g_iWndIndex,
                success: function (xmlDoc) {
                    CameraHK.showOPInfo(oWndInfo.szIP + " 调焦+成功！");
                    window.setTimeout(CameraHK.PTZZoomStop,2000);
                },
                error: function () {
                    CameraHK.showOPInfo(oWndInfo.szIP + "  调焦+失败！");
                }
            });
        }
    },
    /**
     *调焦 减少 
     */
    focalizeDel:function(){
        var oWndInfo = WebVideoCtrl.I_GetWindowStatus(CameraHK.g_iWndIndex);
        if (oWndInfo != null) {
            WebVideoCtrl.I_PTZControl(11, false, {
                iWndIndex: CameraHK.g_iWndIndex,
                success: function (xmlDoc) {
                    CameraHK.showOPInfo(oWndInfo.szIP + " 调焦-成功！");
                    window.setTimeout(CameraHK.PTZZoomStop,2000);
                },
                error: function () {
                    CameraHK.showOPInfo(oWndInfo.szIP + "  调焦-失败！");
                }
            });
        }
    },
    /**
     *变倍停止 
     */
    PTZFoucusStop:function(){
        var oWndInfo = WebVideoCtrl.I_GetWindowStatus(CameraHK.g_iWndIndex);
        if (oWndInfo != null) {
            WebVideoCtrl.I_PTZControl(12, true, {
                iWndIndex: CameraHK.g_iWndIndex,
                success: function (xmlDoc) {
                    CameraHK.showOPInfo(oWndInfo.szIP + " 聚焦停止成功！");
                },
                error: function () {
                    CameraHK.showOPInfo(oWndInfo.szIP + "  聚焦停止失败！");
                }
            });
        }
    },
    /**
     *变倍 增加 
     */
    focusAdd:function(){
        var oWndInfo = WebVideoCtrl.I_GetWindowStatus(CameraHK.g_iWndIndex);
        if (oWndInfo != null) {
            WebVideoCtrl.I_PTZControl(12, false, {
                iWndIndex: CameraHK.g_iWndIndex,
                success: function (xmlDoc) {
                    CameraHK.showOPInfo(oWndInfo.szIP + " 聚焦+成功！");
                    window.setTimeout(CameraHK.PTZFoucusStop,2000);
                },
                error: function () {
                    CameraHK.showOPInfo(oWndInfo.szIP + "  聚焦+失败！");
                }
            });
        }
    },
    /**
     *变倍 减少 
     */
    focusDel:function(){
        var oWndInfo = WebVideoCtrl.I_GetWindowStatus(CameraHK.g_iWndIndex);
        if (oWndInfo != null) {
            WebVideoCtrl.I_PTZControl(13, false, {
                iWndIndex: CameraHK.g_iWndIndex,
                success: function (xmlDoc) {
                    CameraHK.showOPInfo(oWndInfo.szIP + " 聚焦-成功！");
                    window.setTimeout(CameraHK.PTZFoucusStop,2000);
                },
                error: function () {
                    CameraHK.showOPInfo(oWndInfo.szIP + "  聚焦-失败！");
                }
            });
        }
    },
    /**
     *光圈停止 
     */
    PTZIrisStop:function(){
        var oWndInfo = WebVideoCtrl.I_GetWindowStatus(CameraHK.g_iWndIndex);
        if (oWndInfo != null) {
            WebVideoCtrl.I_PTZControl(14, true, {
                iWndIndex: CameraHK.g_iWndIndex,
                success: function (xmlDoc) {
                    CameraHK.showOPInfo(oWndInfo.szIP + " 光圈停止成功！");
                },
                error: function () {
                    CameraHK.showOPInfo(oWndInfo.szIP + "  光圈停止失败！");
                }
            });
        }
    },
    /**
     *光圈 增加 
     */
    apertureAdd:function(){
        var oWndInfo = WebVideoCtrl.I_GetWindowStatus(CameraHK.g_iWndIndex);
        if (oWndInfo != null) {
            WebVideoCtrl.I_PTZControl(14, false, {
                iWndIndex: CameraHK.g_iWndIndex,
                success: function (xmlDoc) {
                    CameraHK.showOPInfo(oWndInfo.szIP + " 光圈+成功！");
                    window.setTimeout(CameraHK.PTZIrisStop,2000);
                },
                error: function () {
                    CameraHK.showOPInfo(oWndInfo.szIP + "  光圈+失败！");
                }
            });
        }
    },
    /**
     *光圈 减少 
     */
    apertureDel:function(){
        var oWndInfo = WebVideoCtrl.I_GetWindowStatus(CameraHK.g_iWndIndex);
        if (oWndInfo != null) {
            WebVideoCtrl.I_PTZControl(15, false, {
                iWndIndex: CameraHK.g_iWndIndex,
                success: function (xmlDoc) {
                    CameraHK.showOPInfo(oWndInfo.szIP + " 光圈-成功！");
                    window.setTimeout(CameraHK.PTZIrisStop,2000);
                },
                error: function () {
                    CameraHK.showOPInfo(oWndInfo.szIP + "  光圈-失败！");
                }
            });
        }
    }
};