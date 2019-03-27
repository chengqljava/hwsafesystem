/**
 *@author 刘赵强
 *@date2017-01-22 15:12
 *@descript 视频播放封装插件形式
 *@email 335892083@qq.com
 */
;(function($, window, document,undefined) {
  	/**
	 *海康的云台控制常量 
	 */
	var HKconstants = {
	    /*******云台控制方向代码 开始**********************/
	    cameraUp:21,//上
	    cameraDown:22,//下
	    cameraLeft:23,//左
	    cameraRight:24,//右
	    cameraLeftUp:25,//左上
	    cameraLeftDown:27,//左下
	    cameraRightUp:26,//右上
	    camerarightDown:28,//右下
	    camerafocalizeAdd:13,//调焦+
	    camerafocalizeDel:14,//调焦-
	    camerafocusAdd:11,//变倍+
	    camerafocusDel:12,//变倍-
	    cameraapertureAdd:15,//光圈+
	    cameraapertureDel:16,//光圈-
	    /********云台控制方向代码 结束*********************/
	};
	/**
	 *大华的云台控制常量 
	 */
	var DHconstants = {
	    /*******云台控制方向代码 开始**********************/
	    cameraUp:0,//上
	    cameraDown:1,//下
	    cameraLeft:2,//左
	    cameraRight:3,//右
	    cameraLeftUp:32,//左上
	    cameraLeftDown:34,//左下
	    cameraRightUp:33,//右上
	    camerarightDown:35,//右下
	    camerafocalizeAdd:6,//调焦+
	    camerafocalizeDel:7,//调焦-
	    camerafocusAdd:4,//变倍+
	    camerafocusDel:5,//变倍-
	    cameraapertureAdd:8,//光圈+
	    cameraapertureDel:9,//光圈-
	    /********云台控制方向代码 结束*********************/
	};
	/**
	 *视频配置
	 */
	var Camera={
		up:1,//上
		down:2,//下
		left:3,//左
		right:4,//右
		leftup:5,//左上
		leftdown:6,//左下
		rightup:7,//右上
		rightdown:8,//右下
		focalizeAdd:9,//调焦 增加
		focalizeDel:10,//调焦 减少
		focusAdd:11,//变倍 增加 
		focusDel:12,//变倍 减少
		apertureAdd:13,//光圈 增加 
		apertureDel:14,//光圈 减少
		hk:1,//海康
		dh:0,//大华
		cameraRunStop:1,//停止
	    cameraRunStart:0,//开始
		outtime:1000//间隔时间
	};
  //定义Beautifier的构造函数
  var Beautifier = function(ele, opt) {
    this.$element = ele,
    this.defaults = {
      'brand': '1',//海康
      'channel':'1',//通道
      'width':'580',//宽
      'height':'300'//高
    },
    this.options = $.extend({}, this.defaults, opt);
  };
  //定义Beautifier的方法
  Beautifier.prototype = {
  	/**
  	 *获取视频对象 
  	 */
  	cameraObj:function(){
  		return this.$element;
  	},
  	/**
	 *开始视频实施预览
 	 */
    play: function() {
		if (this.cameraObj().valid) {//valid：有效的
			/**
			 *登录 
			 *@param ip:摄像头ip地址
			 *@param port：摄像头端口
			 *@param username：摄像头登录用户名
			 *@param password：摄像头登录密码
			 *@param brand 摄像头品牌 0大华 1海康
			 */
			var loginresult = this.cameraObj().LoginWp(this.options.ip,this.options.port,this.options.username,this.options.password,this.options.brand);
			
			var result = false;
			try{
				/**
				 *启动实时预览 
				 *@param channel视频通道 
				 *@param brand 品牌类型
				 */
				result = this.cameraObj().StartRealPlayWp(this.options.channel,this.options.brand);//启动实施预览 通道号,品牌类型 0大华 1海康
			}catch(e){
			}
			//var result = this.cameraObj().StartRealPlayWp(1,this.options.brand);//启动实施预览 通道号,品牌类型 0大华 1海康
			return loginresult&&result;
		} else {
			 throw new Error("视频播放插件无效");
	    }
   },
   	/**
	 * 停止实时预览
	 * @param bran品牌 0大华 1海康
	 */
	stopPlay:function() {
		if (this.cameraObj().valid) {
			var result = this.cameraObj().StopRealPlayWp(this.options.brand);
			return result;
		} else {
			throw new Error("视频播放插件无效");
		}
	},
	/**
	 *用户注销 
	 */
	logoutWp:function(){
		this.cameraObj().LogoutWp(this.options.brand);
	},
	/**
	 * @param command 云台控制命令
	 * @param horico 水平坐标
	 * @param vertco 垂直速度
	 * @param zoom 变倍
	 */
	command:function(command,horico,vertco,zoom){
		if(horico == undefined){
			horico = 0;
		}
		if(vertco == undefined){
			vertco = 0;
		}
		if(zoom == undefined){
			zoom = 0;
		}
		command = this.transition(command);//将转入的命令转换成和品牌相对应的
		if (this.cameraObj().valid) {
			//通道号,云台控制命令,水平坐标,垂直速度,变倍,是否停止0开始1停止,品牌
			this.cameraObj().PTZControlWp(this.options.channel,command,horico,vertco,zoom,Camera.cameraRunStart,this.options.brand);
			sleep(Camera.outtime);
			this.cameraObj().PTZControlWp(this.options.channel,command,horico,vertco,zoom,Camera.cameraRunStop,this.options.brand);
		} else {
			throw new Error("视频播放插件无效");
		}
	},
	/**
	 *云台命令转换,转换成对应品牌的命令
	 */
	transition:function(command){
		if(this.options.brand == Camera.hk){
			switch(command){
				case Camera.up://上
				return HKconstants.cameraUp;
				break;
				case Camera.down://下
				return HKconstants.cameraDown;
				break;
				case Camera.left://左
				return HKconstants.cameraLeft;
				break;
				case Camera.right://右
				return HKconstants.cameraRight;
				break;
				case Camera.leftup://左上
				return HKconstants.cameraLeftUp;
				break;
				case Camera.leftdown://左下
				return HKconstants.cameraLeftDown;
				break;
				case Camera.rightup://右上
				return HKconstants.cameraRightUp;
				break;
				case Camera.rightdown://右下
				return HKconstants.camerarightDown;
				break;
				case Camera.focalizeAdd://调焦增加
				return HKconstants.camerafocalizeAdd;
				break;
				case Camera.focalizeDel://调焦 减少
				return HKconstants.camerafocalizeDel;
				break;
				case Camera.focusAdd://变倍 增加
				return HKconstants.camerafocusAdd;
				break;
				case Camera.focusDel://变倍 减少
				return HKconstants.camerafocusDel;
				break;
				case Camera.apertureAdd://光圈 增加
				return HKconstants.cameraapertureAdd;
				break;
				case Camera.apertureDel://光圈 减少
				return HKconstants.cameraapertureDel;
				break;
			}
		}else if(this.options.brand == Camera.dh){
			switch(command){
				case Camera.up://上
				return DHconstants.cameraUp;
				break;
				case Camera.down://下
				return DHconstants.cameraDown;
				break;
				case Camera.left://左
				return DHconstants.cameraLeft;
				break;
				case Camera.right://右
				return DHconstants.cameraRight;
				break;
				case Camera.leftup://左上
				return DHconstants.cameraLeftUp;
				break;
				case Camera.leftdown://左下
				return DHconstants.cameraLeftDown;
				break;
				case Camera.rightup://右上
				return DHconstants.cameraRightUp;
				break;
				case Camera.rightdown://右下
				return DHconstants.camerarightDown;
				break;
				case Camera.focalizeAdd://调焦增加
				return DHconstants.camerafocalizeAdd;
				break;
				case Camera.focalizeDel://调焦 减少
				return DHconstants.camerafocalizeDel;
				break;
				case Camera.focusAdd://变倍 增加
				return DHconstants.camerafocusAdd;
				break;
				case Camera.focusDel://变倍 减少
				return DHconstants.camerafocusDel;
				break;
				case Camera.apertureAdd://光圈 增加
				return DHconstants.cameraapertureAdd;
				break;
				case Camera.apertureDel://光圈 减少
				return DHconstants.cameraapertureDel;
				break;
			}
		}
	},
	/**
	 *视频摄像头方向 向上
	 * @param command：云台控制命令
	 * @param vertco：垂直速度(大华1-8,海康填0)
	 * @param zoom：变倍
	 */
	up:function(vertco) {
		this.command(Camera.up,0,vertco,0);
	},
	/**
	 *视频摄像头方向 向下
	 * @param channel:通道号
	 * @param command：云台控制命令
	 * @param vertco：垂直速度(大华1-8,海康填0)
	 * @param zoom：变倍
	 */
	down:function(vertco) {
		this.command(Camera.down,0,vertco,0);
	},
	/**
	 *视频摄像头方向 向左
	 * @param channel:通道号
	 * @param command：云台控制命令
	 * @param vertco：水平速度(大华1-8,海康填0)
	 * @param zoom：变倍
	 * @param stop：是否停止 0开始1停止
	 * @param brand：品牌 0大华 1海康
	 */
	left:function(vertco) {
		this.command(Camera.left,0,vertco,0);
	},
	/**
	 *视频摄像头方向 向右
	 * @param channel:通道号
	 * @param command：云台控制命令
	 * @param vertco：水平速度(大华1-8,海康填0)
	 * @param zoom：变倍
	 * @param stop：是否停止 0开始1停止
	 * @param brand：品牌 0大华 1海康
	 */
	right:function(vertco) {
		this.command(Camera.right,0,vertco,0);
	},
	/**
	 *左上 
	 */
	leftUp:function(horico,vertco){
		this.command(Camera.leftup,horico,vertco,0);
	},
	/**
	 *左下 
	 */
	leftDown:function(horico,vertco){
		this.command(Camera.leftdown,horico,vertco,0);
	},
	/**
	 *右上 
	 */
	rightUp:function(horico,vertco){
		this.command(Camera.rightup,horico,vertco,0);
	},
	/**
	 *右下 
	 */
	rightDown:function(horico,vertco){
		this.command(Camera.rightdown,horico,vertco,0);
	},
	/**
	 * 调焦 增加 
	 */
	focalizeAdd:function(vertco){
		this.command(Camera.focalizeAdd,0,vertco,0);
	},
	/**
	 *调焦 减少  
	 */
	focalizeDel:function(vertco){
		this.command(Camera.focalizeDel,0,vertco,0);
	},
	/**
	 *变倍 增加 
	 */
	focusAdd:function(vertco){
		this.command(Camera.focusAdd,0,vertco,0);
	},
	/**
	 *变倍 减少  
	 */
	focusDel:function(vertco){
		this.command(Camera.focusDel,0,vertco,0);
	},
	/**
	 *光圈 增加  
	 */
	apertureAdd:function(vertco){
		this.command(Camera.apertureAdd,0,vertco,0);
	},
	/**
	 *光圈 减少  
	 */
	apertureDel:function(vertco){
		this.command(Camera.apertureDel,0,vertco,0);
	},
	/**
	 *浓度叠加
	 * @param line：行号 1-5
	 * @param osdstr：叠加字符串 小于32byte
	 * @param leftX：X坐标
	 * @param leftY：y坐标
	 */
	setosd:function(line,osdstr,leftX,leftY) {
		if (this.cameraObj().valid) {
			this.cameraObj().SetOsdCfgWp(this.options.channel,line,osdstr,leftX,leftY,this.options.brand);
		} else {
			throw new Error("视频播放插件无效");
		}
	},
	//监测插件是否安装 true已安装，false未安装
	isInstall:function(){
		return CheckPluginInstall();
	}
 };
  //在插件中使用Beautifier对象
  $.fn.loadCamera = function(options) {
  	//判断参数中有没有ip,port,username,password等参数
  	validOptions(options);
    //创建Beautifier的实体
    var beautifier = new Beautifier(document.getElementById('plugin'), options);
    //this.width(options.width);//设置宽
    //this.height(options.height);//设置高
    document.getElementById('plugin').style.width =options.width+"px" ;
    document.getElementById('plugin').style.height =options.height+"px";
    return beautifier;
  };
  
  //模拟一个复杂函数 需要执行很多时间
  function sleep(time) {
	 var now = +new Date();
	 while(true) {
	   if(+new Date() - now > time) {
	     break;
	   }
	 }
  }
  
  function throttle(fn) {  // 闭包  节流
    var timer = null;
    return function() {
        clearTimeout(timer);
        timer = setTimeout(fn,Camera.outtime);
    };
  }
 /**
  *验证必填项参数有没有传递 
  *@author lzqiang
  *@date 2017-01-22 12：21
  */
  function validOptions(options){
	if(options.ip == undefined){
		throw new Error("视频初始化时 没有传递ip地址：ip");
	}
	if(options.port == undefined){
		throw new Error("视频初始化时 没有传递端口：port");
	}
	if(options.username == undefined){
		throw new Error("视频初始化时 没有传递 用户名：username");
	}
	if(options.password == undefined){
		throw new Error("视频初始化时 没有传递 密码：password");
	}
	if(options.channel == undefined){
		throw new Error("视频初始化时 没有传递 通道号：channel");
	}
  }
  //监测浏览器是否安装了插件
  function CheckPluginInstall(){
  		var e = !1;
        if (isIE() && (navigator.userAgent.indexOf('Opera') < 0))
            try { 	
				new ActiveXObject("hok.WebVideoPluginZw.1");
                e = !0;
            } catch(t) {
            	/*
            	 * 在网上了解到，存在这种问题是因为IE8/9并不支持console的方式。
      				解决方法有两种：
			        1.按F12开启IE Dev Tools才能存取console；
			        2.在调用之前，先进行一下判断：
		             if(window.console && console.log){
		                  console.log('xx');
		             }
            	 */
				//console.error(t);
            }
        else
            for (var s = 0, n = navigator.mimeTypes.length; n > s; s++)
                if ("application/x-webvideopluginzw" == navigator.mimeTypes[s].type.toLowerCase()) {
                    e = !0;
                    break;
                }
        return e ? true : false;
  	}
  
   function isIE() { //ie?  
	    if (!!window.ActiveXObject || "ActiveXObject" in window){
	    	return true;
	    }
	    else{  
	        return false; 
	    }
	}  
})(jQuery, window, document);