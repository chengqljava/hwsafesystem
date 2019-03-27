// JavaScript Document
$.extend({
	/**
	 * ajax请求
	 */
	/*_ajax: function(opts){
		var _opts = $.extend({}, {
				async: true,  // 异步
				type: "POST",
				dataType: "JSON" // set all response data as json type
			}, opts);
		$.ajax({
            url: _opts.url,
            type: _opts.type,
            async: _opts.async,
            data: JSON2.stringify(_opts.data),
            dataType: _opts.dataType,
            beforeSend: function(xhr) {
              xhr.setRequestHeader("Content-Type","application/json");
            }
        }).done(function(response, status, xhr) {
        	if(opts.success && typeof opts.success == 'function'){
        		opts.success(response);
        	}
        }).fail(function(xhr) {
			if(opts.fail && typeof opts.fail == 'function'){
        		opts.fail(xhr);
        	}else{
        		$.hy_log("ajax request [url = " + _opts.url + "] failed");
			}
        });
	},*/
	
	
    hy_date_format: function(myDate, dateTime) {
            dateTime = dateTime.replace("yyyy", myDate.getFullYear());
            dateTime = dateTime.replace("mm", myDate.getMonth() < 9 ? '0' + (myDate.getMonth() + 1) : (myDate.getMonth() + 1));
            dateTime = dateTime.replace("dd", myDate.getDate() < 10 ? '0' + myDate.getDate() : myDate.getDate());
            dateTime = dateTime.replace("hh", myDate.getHours() < 10 ? '0' + myDate.getHours() : myDate.getHours());
            dateTime = dateTime.replace("ii", myDate.getMinutes() < 10 ? '0' + myDate.getMinutes() : myDate.getMinutes());
            dateTime = dateTime.replace("ss", myDate.getSeconds() < 10 ? '0' + myDate.getSeconds() : myDate.getSeconds());
            return dateTime;
        }, 
		//log日志
	hy_log: function(message) {
        try{
			$.java_log(JSON2.stringify(message));
		}catch(e){}

		try{
			var msg  = String(message);
			var length = msg.length;
			var c = 400;
			var start = 0;
			var end = c;
			if(length <= end)
			{            
			  window.console && window.console.log( $.hy_date_format(new Date(), "yyyy-mm-dd hh:ii:ss") + " :: " + msg);        
			}
			else{
				var i= 0;
				while(true)
				{
					if(end >= length)
					{
						end = length;
					}
			  
					if(start >= end)
					{
						break;
					}  
					else
					{
						var t = msg.substring(start,end);
						if(i == 0)
						{
							window.console && window.console.log( $.hy_date_format(new Date(), "yyyy-mm-dd hh:ii:ss") + " :: " + t);
						}
						else
						{
							window.console && window.console.log(t);
						}
						start = end;
						end = end+c;          
					 }
					 i++;
				}
			}
		 }catch(e)
		 {
		   window.console && window.console.log( $.hy_date_format(new Date(), "yyyy-mm-dd hh:ii:ss") + " :: " + e);
		 }
		}	
})

(function(){
	$.errorMsg = {
    	1720200007:"用户没有登录或正在忙碌",
    	1720200001:"用户名或密码错误",
    	1720200002:"用户重复登录",
		1800000000:"操作超时",
	    1720410008:"对讲人数达到上限，无法加入"
    };

    $.CaptureNo=0;//0 代表未采集未显示播放画面 1代表已采集成功，已播放画面

	$.success = new Object();
    
    $.fail = new Object();
	
	$.isLog = true; //是否打印参数
    
    $.isPWDEmpty = 1;   // 密码是否需要修改，0：不需要，1：需要
	
    $.msgCode = {
    	54001 : {  //1.1  登录业务服务器
    		desc:'6.1.用户登录', 
			req: 54001,
    		resp: 54003
    	},
		54023  : {  //1.2  获取人员状态
			desc:'获取人员状态', 
         req: 54023,
        	resp: 54025
        },
		54017 : {  //3.21 踢出用户
			desc:'6.4.踢出用户', 
            req:54017,
            resp:54019
        },
		54021  : {  //1.3  通知用户被踢出
    		desc:'6.5.监听踢出', 
			req: 54021,
    		resp: 54021
    	},
		54005:{//1.1 登出业务服务器
			desc:'6.2.用户登出', 
			req: 54005,
    		resp: 54007
		},/* 
		54013:{//1.1  断线重连
			desc:'断线重连', 
			req: 54013,
    		resp: 54015
		},*/
		54027:{//1.1 设置用户关注人员
			desc:'6.6.设置用户关注人员', 
			req: 54027,
    		resp: 54029
		},
		54035:{//用户状态通知
            desc:'6.7.推送用户状态', 
			req: 54035,
    		resp: 54035
		},/*
		54015:{
			desc:'用户重连', 
			req: 54015,
    		resp: 54015
			},*/
		45035:{ //重连推送
			desc:'6.3.监听断线', 
			req: 45035,
    		resp: 45035
		},
		584:{ //获取地址流
			desc:'获取地址流', 
			req: 584,
    		resp: 585
		},
		54501:{ //发送消息给指定的人
			desc:'10.1.发送消息', 
			req: 54501,
    		resp: 54501
		},
		54031:{//设置用户是否使用网络摄像
			desc:'设置用户是否使用网络摄像',
            req: 54031,
    		resp: 54033
		},

       4714:{//获取移动设备直播地址
	   		desc:'9.7.获取移动设备采集直播地址', 
            req: 4714,
    		resp: 4715
		},/*
        264:{//获取域列表
			desc:'获取域列表', 
            req: 264,
            resp: 265 
        },
*/

		54301:{//发起对讲
			desc:'9.1.发起对讲', 
            req: 54301,
    		resp: 54303
		},
		54305:{//通知参加对讲
            desc:'9.2.监听来电（被叫）', 
			req: 54305,
    		resp: 54305
		},
		
		54307:{//参加对讲
			desc:'9.4.接听对讲', 
			req: 54307,
    		resp: 54309
		},
		54311:{//通知发起方对方是否已接听
            desc:'通知发起方对端是否接听对讲', 
			req: 54311,
    		resp: 54311
		},
		54313:{//邀请别人参加对讲
            desc:'9.8.邀请对讲', 
			req: 54313,
    		resp: 54315
		},
		54321:{//通知对讲状态信息
            desc:'9.6.通知对方对讲状态信息', 
			req: 54321,
    		resp: 54321
		},
		54317:{//退出对讲
            desc:'9.3.结束对讲',
            req: 54317,
    		resp: 54319
		},
		54329:{//获取对讲信息
            desc:'9.11.获取对讲信息', 
			req: 54329,
    		resp: 54331
		},
		52323:{//通知对讲结束
            desc:'通知对讲结束', 
			req: 52323,
    		resp: 52323
		},
		383:{ //获取固定设备播放地址
			desc:'获取固定设备播放地址', 
			req: 383,
    		resp: 384
		}
        //added by huangwenhai
        ,
        54401:{
           desc:'创建会议', 
           req:54401,
           resp:54403
        },
        54413:{
           desc:'邀请他人参加会议',
           req:54413,
           resp:54415
        }, 
        54407:{
           desc:'参加会议',
           req:54407,
           resp:54409
        },
		45044:{
		   desc:'采集质量参数',
           req:45044,
           resp:45044
			
		},
        54427:{
           desc:'退出会议',
           req:54427,
           resp:54429
        },
        54431:{
           desc:'结束会议', 
           req:54431,
           resp:54433
        },
        54405:{ 
            desc:'通知加入会议', 
			req: 54405,
    		resp: 54405
		},
        54411:
        { 
            desc:'通知发起方对方参加会议意见', 
			req: 54411,
    		resp: 54411
		},
        54417:
        { 
            desc:'获取会议播放地址', 
			req: 54417,
    		resp: 54419
		},
        //add end
		// 588:{
		// 	desc:'开始移动设备录像采集流', 
		// 	req: 588,
  //   		resp: 589
		// 	},
        54205:{
			desc:'5.7开始移动设备采集流',
            req: 54205,
            resp: 54207
        },
		54209:{
			desc:'5.8停止移动设备采集流',
            req: 54209,
            resp: 54211
        },
		590:{
			desc:'结束移动设备采集流录像', 
			req: 590,
    		resp: 591
		},
		54339:{//请出对讲
			desc:'请出对讲', 
            req: 54339,
            resp: 54341   
        },
        54337:{//通知用户被请出对讲
			desc:'通知用户被请出对讲', 
            req: 54337,
            resp: 54337 
        },
        /*add by sw*/
        54343:{//对讲状态监听
			desc:'对讲状态监听', 
            req: 54343,
            resp: 54345 
        },

	   54421:{//请出参会人
	   		desc:'请出参会人', 
            req: 54421,
            resp: 54423
        },
        54425:{//通知用户被请出会议
			desc:'通知用户被请出会议', 
            req: 54425,
            resp: 54425 
        },
        54469:{//会议禁言/解禁言
			desc:'会议禁言/解禁', 
            req: 54469,
            resp: 54471 
        },
        54461:{//会议画面缩放
			desc:'会议画面缩放', 
            req: 54461,
            resp: 54463 
        },
        54465:{//会议画面交换
			desc:'会议画面交换', 
            req: 54465,
            resp: 54467 
        },
        54477:{//会议画面推送
			desc:'会议画面推送', 
            req: 54477,
            resp: 54479 
        },
        45048:{//会议画面交换/缩放推送
			desc:'会议画面交换/缩放推送', 
            req: 45048,
            resp: 45048
        },
        45049:{//会议画面推送(推送)
			desc:'会议画面推送', 
            req: 45049,
            resp: 45049
        },
        45050:{//usb被拔掉推送
			desc:'usb被拔掉推送', 
            req: 45050,
            resp: 45050
        },
        54453:{//查询会议信息
			desc:'查询会议信息', 
            req: 54453,
            resp: 54455 
            
            },/*
        54449:{//查询会议列表
            req: 54449,
            resp: 54451 
            
            },*/
        54473:{//会议状态监听
			desc:'会议状态监听', 
            req: 54473,
            resp: 54475 
            },
		47340:{//离线消息推送
			desc:'离线消息推送', 
            req: 47340,
    		resp: 47343
		},
		418:{
			desc:'根据录像ID获取录像信息 ', 
			req: 418,
            resp: 419 
        },
		45045:{
			desc:'窗口激活推送', 
			req: 45045,
            resp: 45045 
			},
		45046:{
			desc:'窗口放大推送', 
			req: 45046,
            resp: 45046 
			},
		45047:{
			desc:'窗口交换', 
			req: 45047,
            resp: 45047 
			},
		45005:{
			desc:'启动播放结果通知', 
			req: 45005,
            resp: 45005 
			},
		45011:{
			desc:'播放停止通知', 
			req: 45011,
            resp: 45011 
			},
		45016:{
			desc:'播放时间通知', 
			req: 45016,
            resp: 45016 
			},
		45013:{
			desc:'是否采集成功', 
			req: 45013,
            resp: 45013 
			},
		45021:{
			desc:'播放画面抓拍结果通知', 
			req: 45021,
            resp: 45021 
			},
        54447:{
            desc:'会议状态推送', 
            req: 54447,
            resp: 54447 
            },
        54515:{
            desc:'离线消息推送', 
            req: 54515,
            resp: 54515
        },
        45036:{
            desc:'视频开始播放时画面宽高通知和画面宽高变化通知', 
            req: 45036,
            resp: 45036
        },
        31:{
            desc:'请求超时', 
            req: 31,
            resp: 31
        },
        4632:{
            desc:'获取录像大小', 
            req: 4632,
            resp: 4634
        },
        45401:{
            desc:"音视频质量反馈",
            req: 45401,
            resp: 45401
        },
        54909:{
            desc:"11.6.接收告警通知信息",
            req: 54909,
            resp: 54909
        },
        54917:{
            desc:"11.10.获取告警可订阅目录",
            req: 54917,
            resp: 54919
        },
        54921:{
            desc:"11.11.获取告警订阅信息",
            req: 54921,
            resp: 54923
        },
        54925:{
            desc:"11.12.设置告警订阅信息",
            req: 54925,
            resp: 54927
        },
        54988:{
            desc:"11.13.新建人脸黑名单分组",
            req: 54988,
            resp: 54990
        },
        54992:{
            desc:"11.14.编辑人脸黑名单分组",
            req: 54992,
            resp: 54994
        },
        54996:{
            desc:"11.15.删除人脸黑名单分组",
            req: 54996,
            resp: 54998
        },
        54881:{
            desc:"11.16.获取人脸黑名单组列表",
            req: 54881,
            resp: 54883
        },
        55004:{
            desc:"11.17.获取组人员列表信息",
            req: 55004,
            resp: 55006
        },
        55008:{
            desc:"11.18.获取人员信息",
            req: 55008,
            resp: 55010
        },
        55016:{
            desc:"11.20.新增人员基本信息",
            req: 55016,
            resp: 55018
        },
        55024:{
            desc:"11.22.编辑人员基本信息",
            req: 55024,
            resp: 55026
        },
        55032:{
            desc:"11.24.删除人员图片",
            req: 55032,
            resp: 55034
        },
        55036:{
            desc:"11.25.删除人员",
            req: 55036,
            resp: 55038
        },
        55043:{
            desc:"11.9.中间件获取告警图片",
            req: 55043,
            resp: 55041
        },
        55013:{
            desc:"11.19.中间件获取人员图片信息",
            req: 55013,
            resp: 55015
        },
        55021:{
            desc:"11.21.中间件新增人员图片信息",
            req: 55021,
            resp: 55023
        },
        55029:{
            desc:"11.23.中间件编辑人员图片信息",
            req: 55029,
            resp: 55031
        }

    };

	/**消息推送**/
    $.push = [31,45021,45036,45047,45035,54021,/*54015,*/54501,45044,54305,54311,54321,/*52323,47311,*/54405,54411,54337,54035,45045,45046,45005,45011,45016,45013,54425,45048,45049,45050,54447,54515,45401,54909];
    $.push_funs = new Object();
	
	/**--消息推送**/
	
	/**不需要感知的消息号**/
    $.noShowpush = [45016,45047,45003];
	/**--不需要感知的消息号**/
	
	function boolean2Int(value,defaultValue){
	   var valueType=typeof value;
	   var ret;
	   if('undefined'==valueType){
		if(false===defaultValue) {
			ret=0;
		}else{
			ret=1;5 
		}
	   }else if('number'==valueType){
		  ret=value;
	   }else if('string'==valueType){
		  ret=parseInt(value); 
	   }else{
		   if(false===value) {
				ret=0;
			}else{
				ret=1; 
			}
	   }
	   return ret; 
	}
	

	//发送消息		
	function send(mcocx, cmd, type, data) {
		var req = $.msgCode[cmd]["req"];   // 请求消息号
		var resp = $.msgCode[cmd]["resp"];  // 请求消息号
		$.hy_log($.msgCode[cmd]["desc"]+" method ( " + cmd + " ) with arguments ( " + JSON2.stringify(data) + " )");
		
		if(data.success &&　'function'　==　typeof data.success){
			 $.success[resp] = data.success 
		};
		if(data.error　&& 'function'　==　typeof data.error){
			 $.fail[resp] =data.error 
		};
		delete data.SeqNo;
		return invoke(mcocx, "SendNetworkMessage", cmd, type, JSON2.stringify(data));
	}
    function send1(mcocx, cmd, type, data) {
		var req = $.msgCode[cmd]["req"];   // 请求消息号
		var resp = $.msgCode[cmd]["resp"];  // 请求消息号
		$.hy_log($.msgCode[cmd]["desc"]+" method ( " + cmd + " ) with arguments ( " + JSON2.stringify(data) + " )");
		
		if(data.success &&　'function'　==　typeof data.success){
			 $.success[resp] = data.success 
		};
		if(data.error　&& 'function'　==　typeof data.error){
			 $.fail[resp] =data.error 
		};
		delete data.SeqNo;
		return invoke(mcocx, "sendSdpJsonMessage", cmd, type, JSON2.stringify(data));
	}
	//接收消息	
	function registerPush(cmd, success) {
		
		var nMsgType = $.msgCode[cmd]["req"];
		$.push_funs[nMsgType] = success;
	}
	function invoke(obj, method) {
		// 增加OCX校验
		if(!obj || $.isEmptyObject(obj)){
			$.hy_log("get ocx faild..."); 
			return;
		}
		var params = new Array();
		for(var i = 2; i < arguments.length; i++) {
			
			if (typeof(arguments[i]) == "number") {
				params.push(arguments[i]);
			} else {
				params.push("'" + arguments[i] + "'");
			}
		}
		var args = params.join(", ");
		var desc = $.msgCode[params[0]]["desc"]; 
		$.hy_log("<" + $(obj).attr("id") + "> : "+method+" with arguments ( " + args + " )");
		var ret = '';
		try{
			ret = eval("obj[method](" + args + ")");
		
		}catch(e){
			$.hy_log("call ocx method failed ...");
			$.hy_log("Error < " + e.name + " > occured " + ": " + e.message);
		}
		return ret;
	}
	function callback(method, data, fun) {
		if (method && typeof(method) == "function") {
			method(data);
		} else {
			// 添加默认处理机制
			if('function'==typeof fun){
			   fun(data); 
			}
		}
	}
	
	function receive(id, result, nSize) {
		if($.inArray(id, $.noShowpush) != -1){} //如果消息号在不允许用户感知的推送里面那就什么都不做
		else{
			
			try{
				var data1 = JSON2.parse(result);
				var data = ($.extend({}, {SeqNo: nSize,}, data1));
				if($.msgCode[id]){   //推送消息
					var desc = $.msgCode[id]["desc"];
					$.hy_log("receive "+desc+" push message:[nMsgType=" + id + "] <" + result + ">");
				}else{ //返回消息
					
					$.hy_log("receive response data:[nMsgType=" + id + "] <" + JSON2.stringify(data) + ">");
				}
				if($.inArray(id, $.push) != -1){  //推送消息
					
					callback($.push_funs[id],data,function(data){
						$.hy_log("默认处理 receive "+desc+" push message:[nMsgType=" + id + "] <" + result + ">");
					});
				}else{
				
					if(data && data.nResultCode == 0) {
						var successCallback=$.success[id];
						delete $.success[id];
						callback(successCallback, data,function(){
							$.hy_log("默认处理 receive response data:[nMsgType=" + id + "] <" + JSON2.stringify(data) + "> 成功");
						});
						/*if(id!=419&&id!=4715){
							delete $.success[id];
						}*/
					}else{
						 var failCallback=$.fail[id];
						 delete $.fail[id];
						 if($.errorMsg[data.nResultCode]){
							 data.strResultDescribe = $.errorMsg[data.nResultCode];
						 }
						 callback(failCallback, data, function(){
							$.hy_log("默认处理 receive response data:[nMsgType=" + id + "] <" + JSON2.stringify(data) + "> ");
						 });
						 
						/* if(id!=419&&id!=4715){
						  delete $.fail[id];
						}*/

						
					}
				}
			
		}catch(e){
			 $.hy_log("receive push message:[nMsgType=" + id + "] 解析失败<" + e.message + ">");
		}
	}}
	
	receiveEvent = receive;
	meetingContext={};	
	var initSDK = function(){
		//var $logindomainCode;
		}
	initSDK.prototype = {
		constructor : initSDK,
		_init_ : function(info) {
			var thats = this
			var msg_id = info.id + "_ocx";
			document.getElementById(info.id).innerHTML = '<object VIEWASTEXT type="application/x-oleobject" id="' + msg_id + '" classid="' + info.classid + '" codebase="' +
    		info.codebase + '" width="' + info.width + '" height="' + info.height + '"></object>';
		    ocx = document.getElementById(msg_id);
			var sct = document.createElement('script');
			sct.htmlFor=msg_id;
			sct.event="SdComEvent(nMsgType,pMsg,nSize)";
			sct.text="if($.trim(pMsg)){receiveEvent(nMsgType,pMsg,nSize)}";
			document.getElementsByTagName('head')[0].appendChild(sct);
			
		},
		_playinit_ : function(target,initParam) {
			var rawId=(initParam.id || initParam.name),
       			id= rawId + "_ocx",
       			name=initParam.name || initParam.id;
			var opts={},_options;
			var width=initParam.width || "100%";
			var height=initParam.height || "100%";
			var classId=initParam.classid;
			var play = '<OBJECT _mbe=\"true\" style="display:block" id="'+id+'" name="'+name+'" codeBase="" classid="'
				+ classId+'" width="'+width+'" height="'+height+'" VIEWASTEXT="">' 
				+ '<PARAM name="ShowPlayBar" value="'+boolean2Int(initParam.showPlayBar,true)+'">'
                + '<PARAM name="ShowBarFullBtn" value="'+boolean2Int(initParam.ShowBarFullBtn,true)+'">'  
				+ '<PARAM name="ShowProgressBar" value="'+boolean2Int(initParam.showProgressBar,true)+'">'
				+ '<PARAM name="ShowAudioBar" value="'+boolean2Int(initParam.showAudioBar,true)+'">'
				+ '<PARAM name="ShowPlayPauseBtn" value="'+boolean2Int(initParam.showPlayPauseBtn,true)+'">'
				+ '<PARAM name="ShowLayoutBtn" value="'+boolean2Int(initParam.showLayoutBtn,true)+'">'
				+ '<PARAM NAME="ShowStretchBtn" VALUE="'+boolean2Int(initParam.showStretchBtn,true)+'" >'
				+ '</OBJECT>';	
            if(typeof target === 'object'){
                target.append(play);
                $.hy_log("target is object");
            }else{
                $("#"+target).append(play);
            }
			
			 var sct = document.createElement('script');
				 sct.htmlFor=id;
				 sct.event="SdComEvent(nMsgType,pMsg,nSize)";
				 sct.text="if($.trim(pMsg)){receiveEvent(nMsgType,pMsg,nSize);}";
			     document.getElementsByTagName('head')[0].appendChild(sct);
            this.player = $("#"+id)[0];
			
			return this.player;
		},
		
		//给ocx设置变量 vlue是字符串
		setOcxAttr:function(key,vlue){                               
			ocx.SetUserData(key,vlue);
		},
		//从ocx里面取值	
		getOcxAttr:function(key){                                  
			return ocx.GetUserData(key);
		},	
		
		//isCapturing 返回非0正在采集，返回0没有采集
		isCapturing:function(){                                            
			return ocx.IsCapturing();
		},
		
		//setisLocalcollection 设置本地采集
		setisLocalcollection:function(vlue){   
			ocx.SetUserData("isLocalcollection"+ocx.GetUserData("userDomainCode"),vlue);	
		},
		//getisLocalcollection 获取是否本地采集会有四个值，没设置是空，设置本地为true，设置成屏幕采集就是screentrue 设置四元组就保存了四元组的四个code
		getisLocalcollection:function(){                                 
			return ocx.GetUserData("isLocalcollection"+ocx.GetUserData("userDomainCode"));
		},
		
		//用户登录
		login:function(data){
			ocx.SetUserData("strUserID",data.strUserID);
			ocx.SetUserData("strUserName",data.strUserName);
			var data1 = $.extend({}, {
				nDevType: 4,
				strMacAddr:ocx.GetMacAddr(),	
			}, data);	
			var callback=function(resp){
				
				//$logindomainCode = resp.strUserDomainCode;
				ocx.SetUserData("strUserTokenID",resp.strUserTokenID);
				ocx.SetUserData("userDomainCode",resp.strUserDomainCode);
				
				if(data.success &&　'function'==typeof data.success){
				   data.success(resp);
				}
				var islocalcon = initSDK.prototype.getisLocalcollection(); 
			
				var setUserIPCCallback=function(resp2){
					if(data.EventHandle && 'function' == typeof(data.EventHandle)){
						data.EventHandle("setIPC",0,resp2);
					}
				};
				var setUserIPCErrorCallback=function(resp2){
					if(data.EventHandle && 'function' == typeof(data.EventHandle)){
						data.EventHandle("setIPC",1,resp2);
					}
				};
				if(islocalcon.indexOf("strDomainCode")>0){  //已经设置了ipc摄像头
					var fourCode=JSON2.parse(islocalcon); 
					
					var islocalcondata = {
						    captureType:3,
							strDomainCode:fourCode.strDomainCode,
							strDeviceCode:fourCode.strDeviceCode,
							strChannelCode:fourCode.strChannelCode,
							strStreamCode:fourCode.strStreamCode,
							strUserTokenID:ocx.GetUserData("strUserTokenID"),
							nIsUse:1,
							success:setUserIPCCallback,
							error:setUserIPCErrorCallback,
							SeqNo:8
						}
					send(ocx, 54031, data.SeqNo, islocalcondata);
				}else if(islocalcon == "screentrue"){  //已经设置屏幕采集
					var islocalcondata = {
						captureType:2,
							strDomainCode:"",
						   strDeviceCode:"",
						   strChannelCode:"",
						    strStreamCode:"",
							strUserTokenID:ocx.GetUserData("strUserTokenID"),
							nIsUse:0,
							success:setUserIPCCallback,
							error:setUserIPCErrorCallback,
							SeqNo:8
						}
					send(ocx, 54031, data.SeqNo, islocalcondata);
				}else{  //已经设置了本地摄像头
					var islocalcondata = {
						captureType:1,
						strDomainCode:"",
						strDeviceCode:"",
						strChannelCode:"",
						strStreamCode:"",
						strUserTokenID:ocx.GetUserData("strUserTokenID"),
						nIsUse:0,
						SeqNo:8, 
						success:setUserIPCCallback,
						error:setUserIPCErrorCallback
						}
					send(ocx, 54031, data.SeqNo, islocalcondata); 
				}
				
			};
			data1.success = callback;
			send(ocx, 54001, data1.SeqNo, data1);
		},
		
		//用户退出
		logout:function(data){                        
			var data1=$.extend({},{
				 strUserTokenID:ocx.GetUserData("strUserTokenID")
			},data);
			send(ocx, 54005, data.SeqNo, data1);
		},
		
		 //设置用户是否使用网络摄像头
		setUserUseIPC:function(data){                                 //setUserUseIPC 用户设置是否使用本地摄像头
			var data1=$.extend({},{
				strUserTokenID:ocx.GetUserData("strUserTokenID")
			},data);
			
			var callback = function(resp){
				if(data.success &&　'function'==typeof data.success){
				   data.success(resp);
				}
				if(data.nIsUse == 0 && data.captureType == 1){
					initSDK.prototype.setisLocalcollection("true");	
				}else if(data.nIsUse == 0 && data.captureType == 2){
					initSDK.prototype.setisLocalcollection("screentrue");	
				}else{
					initSDK.prototype.setisLocalcollection('{"strDomainCode":"'+data.strDomainCode+'","strDeviceCode":"'+data.strDeviceCode+'","strChannelCode":"'+data.strChannelCode+'","strStreamCode":"'+data.strStreamCode+'"}');   
				}
				
			}
			data1.success = callback;
			send(ocx, 54031, data.SeqNo, data1);
		},
		//通知用户提出
		registerKickoutUserMessage:function(success){                  //通知  registerKickoutUserMessage用户被提出
		    registerPush(54021,success);
	    },
		registerOverTime:function(success){                  //通知  registerOverTime用户被提出
		    registerPush(31,success);
	    },
		
		dynamicUrlCTS:function(data){                               //dynamicUrlCTS  播放固定摄像头（播放固定摄像头）
		   var data1=$.extend({},{
				tokenID:ocx.GetUserData("strUserTokenID")
			},data);
			send(ocx, 383, data1.SeqNo, data1); 
		 },
			
		pushBigWindow:function(success){                                  // 通知pushBigWindow 窗口变大 返回值 {"strOcxID":"playOcx","nMaximizeScreenID":3,    //最大化窗口 winID "nMaximizeWinID":2   //最大化窗口 screenID2}
			  registerPush(45046,success);
		},
			
		pushIsCapture:function(success){                                  // 通知pushIsCapture 是否采集成功 返回值{"m_nResultCode":0,//0成功，非0失败 "m_strResultDsc":"Start Capture Publish Success."}
			  registerPush(45013,success);
		},
		//离线消息推送
		offlineMsgToUser:function(success){                          
			 registerPush(54515,success);
	    },
		setUserFriend:function(data){                        //setUserFriend 设置用户关注人员
			 	var data1=$.extend({},{
					strUserID:ocx.GetUserData("strUserID"),
					strUserDomainCode:ocx.GetUserData("userDomainCode"),
			 		strUserTokenID:ocx.GetUserData("strUserTokenID")
			 	},data);
				send(ocx, 54027, data.SeqNo, data1);
			 },

		 //踢出用户
		kickoutUser:function(data){ 
			var macadrr = ocx.GetMacAddr();                       //kickoutUser 剔除人员
			var data1=$.extend({},{
				strUserID:ocx.GetUserData("strUserID"),
				strUserName:ocx.GetUserData("strUserName"),
				nDevType:4,
				strMacAddr:macadrr,
			},data);
				//console.log(JSON.stringify(data1));

			 send(ocx, 54017, data.SeqNo, data1);
		 },

		 //用户状态通知
		 userStatus:function(success){                          //通知  userStatus关注的人用户状态变更接收到的消息
			 registerPush(54035,success);
		 },

		 reconnectFromOCX:function(success){                    //通知  reconnectFromOCX系统重连
			registerPush(45035,function(data){
				if( -1 == data.m_nConnectStatus){
					if(ocx.IsCapturing()){
						ocx.stopCapture();
					}
				}
				success(data);
			});
		 },
		
		//不暴露，不需要做，有需要再提
	    myuserState:function(data){                                //myuserState 获取人员状态
			var data1=$.extend({},{
			},data);
			 send(ocx, 54023, data.SeqNo, data1);
		 },

		startMobileRecord:function(data){                                 //startMobileRecord 开始录像
			 var data1=$.extend({},{
				 // domainCode:ocx.GetUserData("userDomainCode"),
	             // strUserTokenID:ocx.GetUserData("strUserTokenID")
				 strUserDomainCode:ocx.GetUserData("userDomainCode"),
				 strUserTokenID:ocx.GetUserData("strUserTokenID"),
				 strUserName:ocx.GetUserData("strUserName")//option.strUserName
			},data);
			 send(ocx, 54205, data.SeqNo, data1);
		},
		stopMobileRecord:function(data){                              //stopMobileRecord 结束录像
			 var data1=$.extend({},{
				 // domainCode:ocx.GetUserData("userDomainCode"),
                strUserName:ocx.GetUserData("strUserName"),
                strUserDomainCode:ocx.GetUserData("userDomainCode"),
                strUserTokenID:ocx.GetUserData("strUserTokenID")
            },data);
            send(ocx, 54209, data.SeqNo, data1);
			
		},
		//透明通道
		registerReceiveMessage:function(success){                            //通知 registerReceiveMessage  获取消息
			registerPush(54501,success);
	    },

		sendMessage:function(data){              //sendMessage 发送消息
			var aa =$.trim(data.strMsg).replace(/"/g,'\\\"')
			var data3 = data;
			    data3.strMsg = aa;                         
			var data1=$.extend({},{
				nImportant:0,
			},data3);
			send(ocx, 54501, data1.SeqNo, data1); 
		 },	
        //------------------------------------------------以下采集--------------------------------------
        //是否预览
        setCapturePreviewWnd:function(data){
            data.play.SetCapturePreviewWnd(data.winid);
        },
        //抓拍
        chooseDirectory:function(player){
          return player.ChooseDirectory();     
        },
        captureSnapShot0:function(player,fileFullname){
            var r=-1;
            try{
              r=player.CaptureSnapShot(fileFullname);
            }catch(e){
              $.hy_log("error"+e);
            }
            return r;
        },
        captureSnapShot:function(data){
             if(!data.play){
//                 alert("未提供音视频播放器!");
                 return;
             }
             var player=data.play;
             var strPath=initSDK.prototype.chooseDirectory(player);
             //用户未选择目录
             if("-1"==strPath){
                return "";
             }
             var fullFileName=strPath+"\\"+data.fileName;
             var ret=initSDK.prototype.captureSnapShot0(player,fullFileName);
             if(0==ret){
               return fullFileName;
             }
             return "";
        },
        startMobileRecord:function(data){                                 //startMobileRecord 开始录像
			 var data1=$.extend({},{
				 strUserDomainCode:ocx.GetUserData("userDomainCode"),
				 strUserTokenID:ocx.GetUserData("strUserTokenID"),
				 strUserName:ocx.GetUserData("strUserName")//option.strUserName
			},data);
			 send(ocx, 54205, data.SeqNo, data1);
		},
        //开始采集
		startCapture:function(param){
            
            if(!param.play){
//                alert("未提供音视频播放器!");
                return;
            }
			var data1 = {
				SeqNo:15,
				strUserTokenID:ocx.GetUserData("strUserTokenID"),
				strUserName:ocx.GetUserData("strUserName"),
				success:function(res){
                    
				    //$.hy_log("debug startCapture: "+JSON2.stringify(param));
                    var player=param.play;
				    var layout=param.layout || 1;
                    var data = {play:player,layout:layout}
					initSDK.prototype.setLayout(data);
					var sessionId = ocx.GetUserData("strUserTokenID");
					var playWindowId=param.windowId || 0,
					sieAddr=param.sieIPAddr || res.strIP,
					siePort=param.sieCapturePort || res.nPort,
					captureSessionId=new String(sessionId),
					captureWidth=param.width || 640,
					captureHeight=param.height || 480,
					fps=param.fps || 15,  //这边给它三个选项15 20 25 
					bitRate=param.bitRate || 1024,//这边给它三个选项512 1024 2048   码率
					audioFormat=param.audioFormat || "OPUS",
					audioSample = param.audioSample || 16000,
					audioChannel = param.audioChannel || 1,
					audioBitrate = param.audioBitrate || 32000,
					localFile=param.localFile || "",
					cameraId=param.cameraId || 0,
					microphoneId=param.microphoneId || 0,
					file=param.file||2,//分别为0,1,2三档
					transport=param.transport || 'tcp';
					fontfile=param.fontfile || 'stsong.ttf',
					textOnVideoParam=param.textNameAndTime || '';
                    audioAndVideo =param.audioAndVideo || 3;
                    
                    if(param.audioFormat=="PCMA"){
                        audioSample=8000;
                    }else if(param.audioFormat=="PCMU"){
                        audioSample=8000;
                    }
					if (file==1) {
					  fps=15;
					  bitRate=512;
                      captureWidth=640;
					  captureHeight=480;
					}else if (file==2) {
					  fps=20;
					  bitRate=800;
                      captureWidth=640;
					  captureHeight=480;
					}else if (file==3) {
					  fps=25;
					  bitRate=1024;
                      captureWidth=640;
					  captureHeight=480;
					}
					if('tcp'==transport){
						transport=1;
					}else{
						transport=0;
					}
					if(param.textNameAndTime){
						textOnVideoParam = "fontfile"+fontfile+":fontcolor=black:fontsize=32:text='" + textOnVideoParam+"'";
					}
					
					playWindowId=parseInt(playWindowId);
					
					$.hy_log("debug->StartCapture:[sieAddr= "+sieAddr+",siePort= "+siePort+",playWindowId="+playWindowId+",captureSessionId="+captureSessionId+",cameraId="+cameraId+
						",microphoneId="+microphoneId+",captureWidth="+captureWidth+",captureHeight="+captureHeight+",fps="+fps+",bitRate="+bitRate+",audioFormat="+audioFormat+",audioSample="+audioSample+
                        ",audioChannel="+audioChannel+",audioBitrate="+audioBitrate+",localFile="+localFile+",tstype="+transport+",audioAndVideo="+audioAndVideo+"]"
					);  
				
					/*res=player.StartCapture(sieAddr, siePort, playWindowId, captureSessionId, cameraId,microphoneId, captureWidth, 
					          captureHeight, fps ,bitRate, audioFormat, localFile,transport,textOnVideoParam);*/
					
					//新接口
					var resPlayer =player.StartCapture(sieAddr, siePort, playWindowId, captureSessionId, cameraId,microphoneId,captureWidth, 
							  captureHeight, fps ,bitRate, audioFormat, audioSample, audioChannel, audioBitrate, localFile,transport,textOnVideoParam,audioAndVideo);
				
					
					/*//默认开启音频
					if('undefined'!=typeof param.enableAudio){
						var enableAudio=param.enableAudio ? 1 : 0;
						setCaptureAudioSwitch(player,enableAudio);
					}
					
					if('undefined'!=typeof param.enableVideo){
						var enableVideo=param.enableVideo ? 1 : 0;
						setCaptureVideoSwitch(player,enableVideo);
					}*/
                    if(resPlayer>=0){
                        var resP = initSDK.prototype.errorCode(0);
                        if(param.success&&typeof param.success === "function"){
                            param.success(resP);
                        }else{
                            $.hy_log(JSON2.stringify(resP)); 
                        }
                    }else{
                        var resP ;
                        if(resPlayer==-2){
                            resP = initSDK.prototype.errorCode(1685010002);
                        }else{
                            resP = initSDK.prototype.errorCode(1685010003);
                        }
                        if(param.error&&typeof param.error === "function"){
                             param.error(resP);
                        }else{
                             $.hy_log(JSON2.stringify(resP)); 
                        }
                    } 
				   
				 },
				 error:function(err){
					if(param.error&&typeof param.error === "function"){
                         param.error(err);
                    }else{
                         $.hy_log(JSON2.stringify(err)); 
                    }
				 }
			};
			send(ocx, 584, data1.SeqNo, data1); 
		},
        startCaptureScreen:function(param){
           if(!param.play){
//               alert("未提供音视频播放器!");
               return;
           }
           //$.hy_log("debug ->startCaptureScreen: "+JSON2.stringify(param));
           var resPlayer ;
            var data1 = ({
                SeqNo:30,
                strUserTokenID:ocx.GetUserData("strUserTokenID"),
                strUserName:ocx.GetUserData("strUserName"),
                success:function(res){
						
                        var player=param.play;
						var playWindowId=param.windowId || 0;
                        var sessionId = ocx.GetUserData("strUserTokenID");
                        var sieIPAddr=param.sieIPAddr || res.strIP,
                        siePort=param.siePort || res.nPort,
						
                        captureSessionId=new String(sessionId),
                        captureWidth=param.width || 1280,
                        captureHeight=param.height || 720,
                        fps=param.fps || 25,
                        bitRate=param.bitRate || 1024,
                        audioFormat=param.audioFormat || "OPUS",
                        audioSample = param.audioSample || 16000,
                        audioChannel = param.audioChannel || 1,
                        audioBitrate = param.audioBitrate || 32000,
                        screenX=param.screenX || 0,
                        screenY=param.screenY || 0,
                        screenWidth=param.screenWidth || 0,//TODO:确认下默认值是否合理
                        screenHeight=param.screenHeight || 0,
                        publishWidth=param.publishWidth || 1280,
                        publishHeight=param.publishHeight || 720,
                        microphoneId=param.microphoneId || 0,
                        transport=param.transport || 'tcp',
                        fontfile=param.fontfile || 'stsong.ttf',
                        textOnVideoParam=param.textNameAndTime || '';
                        audioAndVideo =param.audioAndVideo || 3;
                        if('tcp'==transport){
                            transport=1;
                        }else{
                            transport=0;
                        }
                        if(param.textNameAndTime){
                            textOnVideoParam = "fontfile"+fontfile+":fontcolor=black:fontsize=32:text='" + textOnVideoParam+"'";
                        }
                        if(param.audioFormat=="PCMA"){
                            audioSample=8000;
                        }else if(param.audioFormat=="PCMU"){
                            audioSample=8000;
                        }
                    //->StartCaptureScreen:[sieIPAddr=192.168.1.66,siePort=9012,captureSessionId=5,fps=25,bitRate=2048,audioFormat=PCMA,screenY=0,screenWidth=0,screenHeight=600,publishWidth=800,publishHeight=1280]
                       $.hy_log("debug ->StartCaptureScreen:[sieIPAddr="+sieIPAddr+",siePort="+siePort+",windowid="+playWindowId+",captureSessionId="+captureSessionId+",microphoneId="+microphoneId+",fps="+fps+","
                                        +"bitRate="+bitRate+",audioFormat="+audioFormat+",audioSample="+audioSample+",audioChannel="+audioChannel+",audioBitrate="+audioBitrate+",screenX="+screenX+
                                        ",screenY="+screenY+",screenWidth="+screenWidth+",screenHeight="+screenHeight+",publishWidth="+publishWidth+",publishHeight="+publishHeight+
                                        ",tstype="+transport+",audioAndVideo="+audioAndVideo+"]");
                                        
                       resPlayer = player.StartCaptureScreen(sieIPAddr,siePort,playWindowId,captureSessionId,microphoneId,fps,bitRate,audioFormat,audioSample,audioChannel,audioBitrate
                                        ,screenX,screenY,screenWidth,screenHeight,publishWidth,publishHeight,transport,textOnVideoParam,audioAndVideo);
                    if(resPlayer>=0){
                        var resP = initSDK.prototype.errorCode(0);
                        if(param.success&&typeof param.success === "function"){
                            param.success(JSON2.parse(resP));
                        }else{
                            $.hy_log(JSON2.stringify(resP)); 
                        }
                    }else{
                        var resP ;
                        if(resPlayer==-2){
                            resP = initSDK.prototype.errorCode(1685010002);
                        }else{
                            resP = initSDK.prototype.errorCode(1685010003);
                        }
                        if(param.error&&typeof param.error === "function"){
                             param.error(resP);
                        }else{
                             $.hy_log(JSON2.stringify(resP)); 
                        }
                    } 
				      
                    },
                 error:function(err){
                    if(param.error&&typeof param.error === "function"){
                         param.error(err);
                    }else{
                         $.hy_log(JSON2.stringify(err)); 
                    }
                 }
                
            })
            send(ocx, 584, data1.SeqNo, data1); 
        },
        //改变清晰度
        changeCapturePara:function(param){
            if(!param.play){
            	console.log("未提供音视频播放器!");
                return;
            }
            var file = param.file || 2;
            if (file==1) {
              fps=15;
              bitRate=512;
              captureWidth=640;
			  captureHeight=480;
            }else if (file==2) {
              fps=20;
              bitRate=800;
              captureWidth=640;
			  captureHeight=480;
            }else if (file==3) {
              fps=25;
              bitRate=1024;
              captureWidth=640;
			  captureHeight=480;
            }
            $.hy_log("captureWidth="+captureWidth+",captureHeight="+captureHeight+",fps="+fps+",bitRate="+bitRate);
            param.play.ChangeCapturePara(captureWidth,captureHeight,fps,bitRate)
        },
        //获取采集参数
        getCaptureParameter:function(data){
           if(!data.play){
        	   	console.log("未提供音视频播放器!");
                return;
           }
           $.hy_log("debug ->GetCaptureParameter");
           var ret=data.play.GetCaptureParameter(),
           result;
           if(ret){
              result=JSON2.parse(ret);
           }else{
              result={}; 
           }
           return result;
        },
        //采集参数推送
        pushCaptureParameter:function(success){       
            registerPush(45044,success);
        },
		//停止采集
		stopCapture:function(data){
            if(!data.play){
            	console.log("未提供音视频播放器!");
                return;
            }
            $.hy_log("debug ->stopCapture");
			data.play.StopCapture();
		},
         //
        getCameraList:function(data){
            if(!data.play){
            	console.log("未提供音视频播放器!");
                return;
            }
            return JSON2.parse(data.play.GetCameraList());
        },
        //选择摄像头
        chooseCamera:function(data){
            if(!data.play){
            	console.log("未提供音视频播放器!");
                return;
            }
            data.play.SwitchCameraID(data.cameraId);
        },
        getMicrophoneList:function(data){
            if(!data.play){
            	console.log("未提供音视频播放器!");
                return;
            }
            return JSON2.parse(data.play.GetMicList());
        },
        chooseMicrophone:function(data){
            if(!data.play){
            	console.log("未提供音视频播放器!");
                return;
            }
            data.play.SwitchMicID(data.micId);
        },
        //------------------------------------------------以下会议--------------------------------------
        getMeetingAllInfo:function(data){//获取会议信息
                var p={};
                
                p= $.extend({}, {}, data);
                
                send(ocx, 54453, data.SeqNo, p);
            },
        createMeeting:function(data){
				
                //$.hy_log('debug createMeeting:'+JSON2.stringify(data));
                var p={};
                var userDomainCode=ocx.GetUserData("userDomainCode");
                
                p= $.extend({}, {
					strInitiaterUserDomainCode:userDomainCode,
                    strInitiaterUserTokenID:ocx.GetUserData("strUserTokenID"),
                    strInitiaterUserName:ocx.GetUserData("strUserName"),
                    strMeetingDomainCode:userDomainCode,
                    //处理默认值
                    strTrunkPara:"",
                    strMeetingDesc:data.strMeetingName,
                    strMainUserDomainCode:userDomainCode,
                    strMainUserID:ocx.GetUserData("strUserID"),
                    nMeetingMode:2,
                    nRecord:1,
                    nInviteStyle:1
                    
				}, data);
                
                p.success=function(response){
                    var meetingID=response.nMeetingID,
                    meetingName=data.strMeetingName;
                    meetingContext[meetingID]={
                        id:meetingID,
                        name:meetingName,
                        meetingDomainCode:response.strMeetingDomainCode,
                        sdURL:response.strMeetingSdUrl,
                        hdURL:response.strMeetingHdUrl
                    };

                    $.hy_log("DEBUG Meeting created:ID-"+meetingID+",Name-"+meetingName);
                   data.success(response);  
                    
                };
                send(ocx, 54401, data.SeqNo, p);
            },
            getMeeetingName:function(meetingId){
               return getMeetingInfo(meetingId).name;
            },
            getMeetingInfo:function(meetingId){
               var prop=meetingContext[meetingId] || {};
               return  prop;
            },
            inviteToAttendMeeting:function(data){
                //$.hy_log('debug inviteToAttendMeeting:'+JSON2.stringify(data));
                var p={};
                var userDomainCode=ocx.GetUserData("userDomainCode");
                p= $.extend({}, {
					strUserDomainCode:userDomainCode,
					strUserTokenID:ocx.GetUserData("strUserTokenID"),
                    strUserID:ocx.GetUserData("strUserID"),
					strUserName:ocx.GetUserData("strUserName"),
                    
                    //处理默认值
                    strMeetingDomainCode:userDomainCode
                    
				}, data);
                
                send(ocx, 54413, data.SeqNo, p);
            },
            //请出参会人
             kickMeetingUser:function(data){                        //kickMeetingUser 请出人员
			 	var data1=$.extend({},{
                    strUserDomainCode:ocx.GetUserData("userDomainCode"),
					strUserTokenID:ocx.GetUserData("strUserTokenID")
			 	},data);
			 		//console.log(JSON.stringify(data1));

				send(ocx, 54421, data.SeqNo, data1);
			 },
             //会议禁言/解禁言
             meetingSpeakSet:function(data){                        //meetingSpeakSet 会议禁言/解禁言
			 	var data1=$.extend({},{
                    strUserDomainCode:ocx.GetUserData("userDomainCode"),
					strUserTokenID:ocx.GetUserData("strUserTokenID"),
                    strUserID:ocx.GetUserData("strUserID")
                    //strMeetingDomainCode:ocx.GetUserData("userDomainCode")                    
                },data);
			 		//console.log(JSON.stringify(data1));

				 send(ocx, 54469, data.SeqNo, data1);
			 },
            attendMeeting:function(data){
                //$.hy_log('debug','attendMeeting:{0}',JSON2.stringify(data));
                var p;
                var userDomainCode=ocx.GetUserData("userDomainCode");
                //$.token 这个最好别暴露到jQuery
                p= $.extend({}, {
                    strUserDomainCode:ocx.GetUserData("userDomainCode"),
					strUserTokenID:ocx.GetUserData("strUserTokenID"),
					strUserName:ocx.GetUserData("strUserName"),
                    //处理默认值
                    strMeetingDomainCode:ocx.GetUserData("userDomainCode")
				}, data);
                if(1==data.nIsForceReceived){
                    p.nPicMode = 1
                }
                send(ocx, 54407, data.SeqNo, p);
            },
            quitMeeting:function(data){
              //$.hy_log('debug quitMeeting:'+JSON2.stringify(data));  
                var p;
                var userDomainCode=ocx.GetUserData("userDomainCode");
                p = $.extend({}, {
                    strUserDomainCode:userDomainCode,
					strUserTokenID:ocx.GetUserData("strUserTokenID"),
                      //处理默认值
                    strMeetingDomainCode:userDomainCode
				}, data);
                send(ocx, 54427, data.SeqNo, p);
                
            },
             stopMeeting:function(data){
                
              //$.hy_log('debug stopMeeting:'+JSON2.stringify(data));  
                var p;
                var userDomainCode=ocx.GetUserData("userDomainCode");
                p = $.extend({}, {
                    strUserDomainCode:userDomainCode,
					strUserTokenID:ocx.GetUserData("strUserTokenID"),
                     //处理默认值
                    strMeetingDomainCode:userDomainCode
				}, data);
                send(ocx, 54431, data.SeqNo, p);
                
            },
            notifyInviteUserJoinMeeting:function(success){
                var callback=function(data){
					if(success &&　'function'==typeof success){
                         if(data.strInviteUserTokenID==ocx.GetUserData("strUserTokenID")){
                            data.nIsForceReceived=1; 
                         }else{
                            data.nIsForceReceived=0;
                         }
					     success(data);
					}
					
				};
				var successCallback = callback;
                registerPush(54405,successCallback);
            },
            notifyPeerUserMeeting:function(success){//通知发起方对方参加会议意见
                registerPush(54411,success); 
            },
             notifyKickUserMeeting:function(success){                  //通知  notifyKickUserMeeting用户被请出
		       	 registerPush(54425,success);
	         },
             meetingStateObserver:function(data){//会议状态监听
                var p={};
                
                p= $.extend({}, {
                     strUserDomainCode:ocx.GetUserData("userDomainCode"),
                     strUserTokenID:ocx.GetUserData("strUserTokenID"),
                }, data);
                var callback=function(response){
					if(data.success &&　'function'==typeof data.success){
					   data.success(response);
                       //exportEvent.meetingPicZoomAndSwap(response);
                       //exportEvent.meetingPushOne(response);
					}
				
					
				};
				p.success = callback;
                send(ocx, 54473, data.SeqNo, p);
            },
             getMeetingURL:function(data){//获取会议播放地址
                //$.hy_log('debug getMeetingURL:'+JSON2.stringify(data));  
                var p;
                var userDomainCode=ocx.GetUserData("userDomainCode");
                p = $.extend({}, {
					//tokenID:ocx.GetUserData($.token)
                    strUserTokenID:ocx.GetUserData("strUserTokenID"),
                    strMeetingDomainCode:ocx.GetUserData("userDomainCode")
				}, data);
                var callback=function(response){
					if(data.success &&　'function'==typeof data.success){
					   data.success(response);
                       //exportEvent.meetingPicZoomAndSwap(response);
                       //exportEvent.meetingPushOne(response);
					}
				
					
				};
				p.success = callback;
                send(ocx, 54417, data.SeqNo, p);
                
            },
            //会议状态通知
	        notifyMeetingStatus:function(success){                          
                registerPush(54447,success);
	        },
             //------------------------------------------------以下画面放大等--------------------------------------
           //获取会议播放地址并播放
           getMeetingURLAndPlay:function(data){
           	    var result="";
                var getMeetingURLReq={
                    SeqNo:data.SeqNo,
                    strMeetingDomainCode:data.strMeetingDomainCode,
                    nMeetingID:data.nMeetingID,
                    success:function(meetingURLGetResp){
                       /* $.hy_log("handling meeting invite=>Get meeting URL OK for meeting {0}"+meetingURLGetResp.nMeetingID)
                        var tip="您已加入会议："+meetingURLGetResp.nMeetingID;
                        $.hy_log(tip);
                        $.hy_log("标清URL：{0},高清URL：{1}"+meetingURLGetResp.strMeetingSdUrl+meetingURLGetResp.strMeetingHdUrl);*/
                           
                        //播放会议视频
                        var playURL=meetingURLGetResp.strMeetingSdUrl;
                        result=initSDK.prototype.playlive({play:data.play,layout:data.layout,list:[{url:playURL,playWindowId:data.playWindowId,caption:initSDK.prototype.getMeetingInfo(meetingURLGetResp.nMeetingID).name}]});
                        
                        var data1 = {play:data.play,windowId:data.playWindowId,nclick:1}
                        initSDK.prototype.setWindowClickMode(data1);
                        meetingURLGetResp["SeqNo"] = data.SeqNo
                        initSDK.prototype.meetingPicZoomAndSwap(meetingURLGetResp);
                        initSDK.prototype.meetingPushOne(meetingURLGetResp);
                        //add  by  sw 2017年10月26日10:31:51
                        var resultCode=JSON.parse(result);
						
                         if (resultCode.nResultCode==0) {
                           if (data.success&&"function"==typeof(data.success)) {
                        	data.success(resultCode);
                          }
                        }
                        else{
                          if (data.error&&"function"==typeof(data.error)) {
                          	data.error(resultCode);
                          }
                        }
                        //****end****
                       
                    },
                    //获取播放URL失败，仍然算做加入会议失败
                    error:function(meetingURLGetResp){
                         /*$.hy_log("handling meeting invite=>Failed to get meeting URL for meeting {0}"+meetingURLGetResp.nMeetingID);
                         meetingAttendFailed(meetingURLGetResp);*/
                         if(initSDK.prototype.getisLocalcollection()){
                           if(data.play){
                               initSDK.prototype.stopCapture({play:data.play});
                           }
                        }
                        //停止会议
                        if(data.play){
                            initSDK.prototype.stopPlay({play:data.play});
                        }
                    }
                };
                $.hy_log("handling meeting invite=>before invoking exportEvent.getMeetingURL");
                initSDK.prototype.getMeetingURL(getMeetingURLReq);
            },
           //设置
           setWindowClickMode:function(data){
                data.play.SetWindowClickMode(data.windowId,data.nclick)
           },
           //会议画面缩放/交换
             meetingPicZoomAndSwap :function(meetingURLGetResp){
                var meetingPicZoomAndSwap0 = function(data){
                    var req={
                    SeqNo:data.SeqNo, 
                    strMeetingDomainCode:meetingURLGetResp.strMeetingDomainCode,   
                    strUserDomainCode:ocx.GetUserData("userDomainCode"),
					strUserTokenID:ocx.GetUserData("strUserTokenID"), 
                    nMeetingID:meetingURLGetResp.nMeetingID*1,
                    strMeetingUrl:meetingURLGetResp.strMeetingSdUrl,   //标清url
                    success:function(response){
                        $.hy_log("debug response="+response);
                    },
                    error:function(response){$.hy_log(response);}
                    };
                    if(data.nStartPointX==data.nEndPointX){
                        req["nXpoint"] = data.nStartPointX;
                        req["nYpoint"] = data.nStartPointY;
                        send(ocx, 54461, req.SeqNo, req);               //会议画面缩放 
                    }else{
                        req["nStartXpoint"] = data.nStartPointX;
                        req["nStartYpoint"] = data.nStartPointY;
                        req["nEndXpoint"] = data.nEndPointX;
                        req["nEndYpoint"] = data.nEndPointY;
                        send(ocx, 54465, req.SeqNo, req);               //会议画面交换
                    }
                }
				registerPush(45048,meetingPicZoomAndSwap0);
			},
            //会议画面推送
            meetingPushOne :function(meetingURLGetResp){   
                var meetingPushOne0 = function(data){
                    var req={
                    SeqNo:data.SeqNo, 
                    strMeetingDomainCode:meetingURLGetResp.strMeetingDomainCode,   
                    strUserDomainCode:ocx.GetUserData("userDomainCode"),
					strUserTokenID:ocx.GetUserData("strUserTokenID"), 
                    nMeetingID:meetingURLGetResp.nMeetingID*1,
                    strMeetingUrl:meetingURLGetResp.strMeetingSdUrl,   //标清url
                    nXpoint:data.nPointX,
                    nYpoint:data.nPointY,
                    success:function(response){
                        $.hy_log("response={0}"+response);
                    },
                    error:function(){$.hy_log(response);}
                    };
                    send(ocx, 54477, req.SeqNo, req);
                }
				registerPush(45049,meetingPushOne0);
			},
            //音视频质量反馈
            qualityAudioAndVideo:function(fn){
                registerPush(45401,fn);
            },
            pushWinChange:function(success){                                  // 通知pushWinChange 窗口交换 返回值 { "strOcxID":"playOcx",  "nScreenID1":3,"nWinID1":2,"nScreenID2":2, "nWinID2":3}
				registerPush(45047,success);
			},
            //------------------------------------------------以下人脸识别--------------------------------------
            
            
            //11.13.新建人脸黑名单分组
            addFaceRecGroup:function(data){
                var p={};
                p= $.extend({}, {
                    strUserTokenID:ocx.GetUserData("strUserTokenID"),
                    strUserDomainCode:ocx.GetUserData("userDomainCode")
                }, data);
                send(ocx, 54988, data.SeqNo, p);
            },
            //11.14.编辑人脸黑名单分组
            modFaceRecGroup:function(data){
                var p={};
                p= $.extend({}, {
                    strUserTokenID:ocx.GetUserData("strUserTokenID"),
                    strUserDomainCode:ocx.GetUserData("userDomainCode")
                }, data);
                send(ocx, 54992, data.SeqNo, p);
            },
            //11.15.删除人脸黑名单分组
            delFaceRecGroup:function(data){
                var p={};
                p= $.extend({}, {
                    strUserTokenID:ocx.GetUserData("strUserTokenID"),
                    strUserDomainCode:ocx.GetUserData("userDomainCode")
                }, data);
                send(ocx, 54996, data.SeqNo, p);
            },
            //11.16.获取人脸黑名单组列表
            getFaceRecGroupList:function(data){
                var p={};
                p= $.extend({}, {
                    strUserTokenID:ocx.GetUserData("strUserTokenID"),
                    strUserDomainCode:ocx.GetUserData("userDomainCode")
                }, data);
                send(ocx, 54881, data.SeqNo, p);
            },
             //11.17.获取组人员列表信息
            getFaceRecPersonList:function(data){
                var p={};
                p= $.extend({}, {
                    strUserTokenID:ocx.GetUserData("strUserTokenID"),
                    strUserDomainCode:ocx.GetUserData("userDomainCode")
                }, data);
                send(ocx, 55004, data.SeqNo, p);
            },
            //11.18.获取人员信息
            getFaceRecPersonInfo:function(data){
                var p={};
                p= $.extend({}, {
                    strUserTokenID:ocx.GetUserData("strUserTokenID"),
                    strUserDomainCode:ocx.GetUserData("userDomainCode")
                }, data);
                send(ocx, 55008, data.SeqNo, p);
            },
            //11.20.新增人员基本信息
            addFaceRecPersonInfo:function(data){
                var p={};
                p= $.extend({}, {
                    strUserTokenID:ocx.GetUserData("strUserTokenID"),
                    strUserDomainCode:ocx.GetUserData("userDomainCode")
                }, data);
                send(ocx, 55016, data.SeqNo, p);
            },
            //11.22.编辑人员基本信息
            modFaceRecPersonInfo:function(data){
                var p={};
                p= $.extend({}, {
                    strUserTokenID:ocx.GetUserData("strUserTokenID"),
                    strUserDomainCode:ocx.GetUserData("userDomainCode")
                }, data);
                send(ocx, 55024, data.SeqNo, p);
            },
             //11.24.删除人员图片
            delFaceRecPersonPicInfo:function(data){
                var p={};
                p= $.extend({}, {
                    strUserTokenID:ocx.GetUserData("strUserTokenID"),
                    strUserDomainCode:ocx.GetUserData("userDomainCode")
                }, data);
                send(ocx, 55032, data.SeqNo, p);
            },
             //11.25.删除人员
            delFaceRecPersonInfo:function(data){
                var p={};
                p= $.extend({}, {
                    strUserTokenID:ocx.GetUserData("strUserTokenID"),
                    strUserDomainCode:ocx.GetUserData("userDomainCode")
                }, data);
                send(ocx, 55036, data.SeqNo, p);
            },
            //11.9.中间件获取告警图片
            downloadSnap:function(data){
                var p={};
                p= $.extend({}, {}, data);
                send1(ocx, 55043, data.SeqNo, p);
            },
            //11.19.中间件获取人员图片信息
            getFaceRecPersonPicInfo:function(data){
                var p={};
                p= $.extend({}, {
                    strUserTokenID:ocx.GetUserData("strUserTokenID"),
                    strUserDomainCode:ocx.GetUserData("userDomainCode")
                }, data);
                send1(ocx, 55013, data.SeqNo, p);
            },
            //11.21.中间件新增人员图片信息
            addFaceRecPersonPicInfo:function(data){
                var p={};
                p= $.extend({}, {
                    strPicRecord: "",
                    strUserTokenID:ocx.GetUserData("strUserTokenID"),
                    strUserDomainCode:ocx.GetUserData("userDomainCode")
                }, data);
                send1(ocx, 55021, data.SeqNo, p);
            },
            //11.23.中间件编辑人员图片信息
            modFaceRecPersonPicInfo:function(data){
                var p={};
                p= $.extend({}, {
                    strUserTokenID:ocx.GetUserData("strUserTokenID"),
                    strUserDomainCode:ocx.GetUserData("userDomainCode")
                }, data);
                send1(ocx, 55029, data.SeqNo, p);
            },
            
            //------------------------------------------------以下订阅--------------------------------------
           //11.10.获取告警可订阅目录
           getAlarmSubscribeCatalog:function(data){
                var p={};
                
                p= $.extend({}, {
                     strUserDomainCode:ocx.GetUserData("userDomainCode"),
                     strUserTokenID:ocx.GetUserData("strUserTokenID"),
                     strUserID:ocx.GetUserData("strUserID"),
                }, data);
                send(ocx, 54917, data.SeqNo, p);
           },
           //11.11.获取告警订阅信息
          getAlarmSubscribe:function(data){
                var p={};
                
                p= $.extend({}, {
                     strUserDomainCode:ocx.GetUserData("userDomainCode"),
                     strUserTokenID:ocx.GetUserData("strUserTokenID"),
                     strUserID:ocx.GetUserData("strUserID"),
                }, data);
                send(ocx, 54921, data.SeqNo, p);
           },
          //11.12.设置告警订阅信息
          setAlarmSubscribe:function(data){
                var p={};
                
                p= $.extend({}, {
                     strUserDomainCode:ocx.GetUserData("userDomainCode"),
                     strUserTokenID:ocx.GetUserData("strUserTokenID"),
                     strUserID:ocx.GetUserData("strUserID"),
                }, data);
                send(ocx, 54925, data.SeqNo, p);
           },
           //11.6.接收告警通知信息
            notifyAlarm:function(success){
                registerPush(54909,success);
            },

          
           //***************************播放******************************************
		//直播
		playlive:function(param){	
			if (!param.play) {
				console.log("未提供音视频播放器");
                //   if (param.error&&"function"==typeof(param.error)) {
          	  	// var errorCode=initSDK.prototype.errorCode(-3);
          	  	// param.error(errorCode);
          	    // }
			}
			else
			{
			   var player=param.play;
			   var layout=param.layout;
			   var list=param.list || [];
			   var itemCount=list.length;
			   var ret=[];
			   var playliveObj={
                   playWindowId:"",
                   resultCode:""
			   };
			   var playliveList=[];
		
			   if(0 == itemCount){
				  return ret;
			   }
			   if('undefined'==typeof layout){
				   layout=itemCount;
			   }
			   //新增 判断
			    if (layout>0&&layout<itemCount) {
			    	layout=itemCount;
			    }
			   try{
				   	var data={
                        play:player,
                        layout:layout
				   	};
				    initSDK.prototype.setLayout(data);

				   $.each(list,function(index,item){
				   	   playliveObj={
		                   playWindowId:"",
		                   resultCode:""
					   };
					   var sessionID,
					   url=item.url,
					   playWindowId=item.playWindowId || index,
					   transport=item.transport || 'tcp',
					   caption=item.caption || ' ',//播放窗口左上方显示的标题
					   enableAudio=item.enableAudio || true;
					   playWindowId=parseInt(playWindowId);
					   enableAudio=(enableAudio) ?  1 : 0;
					   transport=(transport=='tcp') ?  1 : 0;
					   //ret.push(sessionID);
					   var enableAec=item.enableAec || 0;//默认值0 
					   if(url){
						  sessionID= player.StartRealPlaybyUrl(url,caption,playWindowId,enableAudio,enableAec,transport);
						  playliveObj.playWindowId=playWindowId;
						  playliveObj.resultCode=sessionID;
					   }
					     playliveList.push(playliveObj);
				   });  
			   }catch(e){
				   playliveList=[];
			   }
			   
                if (JSON.stringify(playliveList).indexOf(-2)>=0) {
                   errorCode=initSDK.prototype.errorCode(1685010002);
                   errorCode.strResultDescribe+=JSON.stringify(playliveList);
                   return JSON.stringify(errorCode);
			   }
			   else if (JSON.stringify(playliveList).indexOf(-1)>=0) {
                   errorCode=initSDK.prototype.errorCode(1685010003);
                   errorCode.strResultDescribe+=JSON.stringify(playliveList);
                   return JSON.stringify(errorCode);
			   }
			   else{
			   	 errorCode=initSDK.prototype.errorCode(0);
                 errorCode.strResultDescribe+=JSON.stringify(playliveList);
			   	 return JSON.stringify(errorCode);
			   }

			}
		},
		//回放  
		playback:function(param){
		if (param.play) {
               var ret=[],
               playbackList=[],
               playbackObj={
                  playWindowId:"",
                  resultCode:""
               },
               player=param.play,
			   layout=param.layout,
			   list=param.list || [],
			   itemCount=list.length;
			   
			   if(0==itemCount){
			      return ret;
			   }
			   if('undefined'==typeof layout){
			       layout=itemCount;
			   }
			   //新增判断 
			   if (layout>0&&layout<itemCount) {
			   	    layout=itemCount;
			   }

			  try{
			       	var data={
			       	 	play:player,
			       	 	layout:layout
			       	 };
			         initSDK.prototype.setLayout(data);
			     $.each(list,function(index,item){
			     	 playbackObj={
		                  playWindowId:"",
		                  resultCode:""
		               };
			      var sessionID,
			          url=item.url,
			          playWindowId=item.playWindowId || index,
			          transport=item.transport || 'tcp',
			          playTime=item.playTime || 0,
			          speed=item.speed || 1,
			          enableAudio=item.enableAudio || true,
			          enableAec=item.enableAec || false;
			          enableAudio=(enableAudio) ?  1 : 0; 
			          enableAec=(enableAec) ?  1 : 0; 
			          transport=(transport=='tcp') ?  1 : 0;
			          playWindowId=parseInt(playWindowId);
			          //Fix:#7606 
			      var caption=item.caption || ' ';//播放窗口左上方显示的标题
			          
			      if(url){
			         
                      sessionID=player.StartPlaybackbyUrl(url,caption,playWindowId, playTime,speed,enableAudio,transport);
                      playbackObj.playWindowId=playWindowId;
                      playbackObj.resultCode=sessionID;
			      }
			         playbackList.push(playbackObj);
			      });   
			   }catch(e){
			       playbackList=[];
			   }
			    if (JSON.stringify(playbackList).indexOf(-2)>=0) {
                   errorCode=initSDK.prototype.errorCode(1685010002);
                   errorCode.strResultDescribe+=JSON.stringify(playbackList);
                   return JSON.stringify(errorCode);
			   }
			   else if (JSON.stringify(playbackList).indexOf(-1)>=0) {
                   errorCode=initSDK.prototype.errorCode(1685010003);
                   errorCode.strResultDescribe+=JSON.stringify(playbackList);
                   return JSON.stringify(errorCode);
			   }
			   else{
			   	 errorCode=initSDK.prototype.errorCode(0);
                 errorCode.strResultDescribe+=JSON.stringify(playbackList);
			   	 return JSON.stringify(errorCode);
                  
			   }
			 
		  }
		   else
		  {
			   console.log("未提供音视频播放器");
		  	 // if (param.error&&"function"==typeof(param.error)) {
      //     	  	var errorCode=initSDK.prototype.errorCode(-3);
      //     	  	param.error(errorCode);
      //     	  }
		  }
          
		},
	
		//=================================================采集=============================================
		//分配音视频推流地址 
		 getDeviceMediaAddr:function(data){                            //getDeviceMediaAddr 获取sieip 和 iport 采集的时候需要徒留的sie地址和端口       
			var data1=$.extend({},{
		 		strUserTokenID:ocx.GetUserData("strUserTokenID"),
				strUserName:ocx.GetUserData("strUserName")//option.strUserName
		 	},data);
		     send(ocx, 584, data1.SeqNo, data1); 
		 },
        //获取移动设备采集直播地址 
        getMobileDynamicUrl:function(data){ 
           var data1=$.extend({},{
		 		tokenID:ocx.GetUserData("strUserTokenID")
		 	},data);
		   send(ocx, 4714, data.SeqNo, data1);
        },
        //会议录像下载
        downloadMeeting:function(data){
            var data1={
          		SeqNo:data.SeqNo,
          		strDomainCode:data.strDomainCode,
          		nMeetingID:data.nMeetingID,
          		success:function(res){
                if (res.nResultCode==0) {
                   var downdata = {
                        SeqNo:data.SeqNo,
                        play:data.play,
                        speed:data.speed,
                        downloadFileName:data.downloadFileName,//下载地址及文件名称
                        unRecordId:res.nRecordID,
                        serviceUrl:{//四元组信息
                            strDomainCode:data.strDomainCode,
                            strDeviceCode:data.strDeviceCode,
                            strChannelCode:data.strChannelCode,
                            strStreamCode:data.strStreamCode,
                            },
                        error:function(err){
                        	if (data.error&&"function"==typeof(data.error)) {
			                   	  data.error(err);
			                  }
                        },
                    }
                   initSDK.prototype.downloadVideo(downdata);
                 }
          		},
          		error:function(err){
                   if (data.error&&"function"==typeof(data.error)) {
                   	  data.error(err);
                   }
          		}
          	};
            initSDK.prototype.getMeetingAllInfo(data1);
        },
		// ======================================固定设备  ================================================================

		//获取固定设备的录像降码回放地址
		playbackCTS:function(data){
        
			var p;
			p = $.extend({}, {
				strUserTokenID:ocx.GetUserData("strUserTokenID")
			}, data);
			send(ocx, 418, data.SeqNo, p);
			
		}, 
		mixPlay:function(data){
          if (data.play) {
          	  var result="";
              var player=data.play;
              var layout=data.layout;
              var datalist=data.list||[];
              var len=datalist.length;
              if (len==0) {
              	return [];
              }
              var list=[];//存放播放url等参数
              var mixPlayCallback=function(j){
                  var i=j;
                  var playParam=data.list[i].playParam?data.list[i].playParam:{};
                  var type=data.list[i].type;
                  var mixData="";
                  if (type==1) {
                  	// Todo
                  	 mixData={
                  	 	 SeqNo:data.SeqNo,
                  	 	 domainCode:data.list[i].domainCode,
		                 strUserTokenID:data.list[i].strUserTokenID,
		                 error:function(err){
                           mixData.success(err);
		                 },
		                 success:function(res){
		                 		i++;
		                 		var url=res.dynamicUrl;
				         	    playParam["url"]="";
				         	    playParam["url"]=url;
				         	    list.push(playParam);
		                        if (i<len) {	
		                        	//回调callback
		                         	mixPlayCallback(i);
		                        }
		                        else
		                        {
		                        	var listParam={
			                    		play:player,
			                    		layout:layout,
			                    		list:list
			                    	};
			                       result= initSDK.prototype.playlive(listParam);
			                       var resultCode=JSON.parse(result);
			                       if (resultCode.nResultCode==0) {
			                       	  if (data.success&&"function"==typeof(data.success)) {
				                       	data.success(resultCode);
				                       }
			                       }
			                       else {
			                        	if (data.error&&"function"==typeof(data.error)) {
			                       		  data.error(resultCode);
			                       	     }
		                           }
		                        }
		                 }
                  	 };
                  	 initSDK.prototype.getMobileDynamicUrl(mixData);
                  }
                  else if (type==2) {
                  	//Ipc  Todo
                  	mixData={
                  	 SeqNo:data.SeqNo,
			         serviceUrl:{
			         	strDomainCode:data.list[i].serviceUrl.strDomainCode,
						strDeviceCode:data.list[i].serviceUrl.strDeviceCode,
						strChannelCode:data.list[i].serviceUrl.strChannelCode,
						strStreamCode:data.list[i].serviceUrl.strStreamCode,
			         },
			         success:function(res){
	                    var url=res.strDynamicUrl;
	                    playParam["url"]="";
	                    playParam["url"]=url;
	                    list.push(playParam);
	                    //delete res.playbackUrlInfo.strPlaybackUrl;
	                    i++;
	                    if (i<len) {
	                    	mixPlayCallback(i);
	                    }
	                    else{
	                    	var listParam={
	                    		play:player,
	                    		layout:layout,
	                    		list:list
	                    	}
	                       result= initSDK.prototype.playlive(listParam);
	                       var resultCode=JSON.parse(result);
	                        if (resultCode.nResultCode==0) {
	                       	  if (data.success&&"function"==typeof(data.success)) {
		                       	 data.success(resultCode);
		                       }
	                       }
	                       else {
	                       	if (data.error&&"function"==typeof(data.error)) {
	                       		data.error(resultCode);
	                       	}
	                       }
	                    }
			         },
			         error:function(err){
			            mixData.success(err);
			         }
           	     };
                initSDK.prototype.dynamicUrlCTS(mixData);
               }
              };
              mixPlayCallback(0);
          }
          else{
        	  console.log("未提供音视频播放器");
          }
		},
		//直播(非IPC)
		playliveVideo:function(data){
           if(data.play){
           	 var result="";
             var player=data.play;
             var layout=data.layout;
             var datalist=data.list||[];
             var len=datalist.length;
             if (len==0) {
             	return [];
             }
             var list=[];
           	 var liveArr=[];
           	 var playliveCallback=function(j){
             var i=j;
             var playParam=data.list[i].playParam?data.list[i].playParam:{};
             var data1={
           	     SeqNo:data.SeqNo,
           	 	 domainCode:data.list[i].domainCode,
		         strUserTokenID:data.list[i].strUserTokenID,
		         error:function(err){
		           data1.success(err);
		         },
		         success:function(res){
		         	   i++;
		         	   var url=res.dynamicUrl;
		         	   playParam["url"]="";
		         	   playParam["url"]=url;
		         	   list.push(playParam);
                       if (i<len) {	
                        	//回调获取
                         	playliveCallback(i);
                       }
                       else
                       {
                    	var listParam={
                    		play:player,
                    		layout:layout,
                    		list:list
                    	};
                       result= initSDK.prototype.playlive(listParam);
                       var resultCode=JSON.parse(result);
                       if (resultCode.nResultCode==0) {
                       	  if (data.success&&"function"==typeof(data.success)) {
	                       	data.success(resultCode);
	                       }
                       }
                       else {
                        	if (data.error&&"function"==typeof(data.error)) {
                       		  data.error(resultCode);
                       	     }
                           }
                       }
		         }
           	 };
             initSDK.prototype.getMobileDynamicUrl(data1);
           	 };
           	 playliveCallback(0);
            }
            else{
            	console.log("未提供音视频播放器");
            }
        },
        //直播(IPC)
        playliveIpc:function(data){
          if (data.play) {
          	 var result="";
             var player=data.play;
             var layout=data.layout;
             var datalist=data.list||[];
             var len=datalist.length;
             if (len==0) {
             	//数据为空返回[]
             	return [];
             }
             var list=[];
             var playliveCallback=function(j){
                var i=j;
                var playParam=data.list[i].playParam?data.list[i].playParam:{};
                var data1={
           	 	 SeqNo:data.SeqNo,
		         serviceUrl:{
		         	strDomainCode:data.list[i].serviceUrl.strDomainCode,
					strDeviceCode:data.list[i].serviceUrl.strDeviceCode,
					strChannelCode:data.list[i].serviceUrl.strChannelCode,
					strStreamCode:data.list[i].serviceUrl.strStreamCode,
		         },
		         success:function(res){
                    var url=res.strDynamicUrl;
                    playParam["url"]="";
                    playParam["url"]=url;
                    list.push(playParam);
                  
                    i++;
                    if (i<len) {
                    	playliveCallback(i);
                    }
                    else{
                    	var listParam={
                    		play:player,
                    		layout:layout,
                    		list:list
                    	}
                       result= initSDK.prototype.playlive(listParam);
                       var resultCode=JSON.parse(result);
                        if (resultCode.nResultCode==0) {
                       	  if (data.success&&"function"==typeof(data.success)) {
	                       	 data.success(resultCode);
	                       }
                       }
                       else {
                       	if (data.error&&"function"==typeof(data.error)) {
                       		data.error(resultCode);
                       	}
                       }
                    }
		         },
		         error:function(err){
		         	data1.success(err);
		         }
           	 };
             initSDK.prototype.dynamicUrlCTS(data1);
             };
             playliveCallback(0);
          }
          else{
        	  console.log("未提供音视频播放器");
          }
        },
        //观摩会议
        imitateMeeting:function(data){
        	if (data.play) {
        	   var result="";
        	   var player=data.play;
        	   var layout=data.layout;
        	   var list=[];
        	   var playParam=data.playParam?data.playParam:{};
               var data3={
	             	 SeqNo:data.SeqNo,
	             	 strMeetingDomainCode:data.strMeetingDomainCode,
	             	 nMeetingID:data.nMeetingID,
	             	 success:function(res){
	         	 		var url=res.strMeetingSdUrl;
	         	 		playParam["url"]="";
	         	 		playParam["url"]=url;
	         	 		list.push(playParam);
	         	 		var listParam={
	         	 			play:player,
	         	 			layout:layout,
	         	 			list:list
	         	 		};
	         	 		var data6={ 
			                    SeqNo:data.SeqNo,
			                    strDomainCode:res.strMeetingDomainCode,
			                    nMeetingID:res.nMeetingID*1,
			                    nEnable:data.nEnable||1,
			                    error:function(err){
	                               if (data.error&&"function"==typeof(data.error)) {
			                       	data.error(err);
			                       }
			                    }
			                };
			            initSDK.prototype.meetingStateObserver(data6);
	         	 	    result=initSDK.prototype.playlive(listParam);
	         	 	    var resultCode=JSON.parse(result);
	         	 	     if (resultCode.nResultCode==0) {
	                   	  if (data.success&&"function"==typeof(data.success)) {
	                       	data.success(resultCode);
	                       }
	                     }
	                    else {
	                    	if (data.error&&"function"==typeof(data.error)) {
	                   		data.error(resultCode);
	                   	}
	                  }
	             	},
	             	error:function(err){
	                  if (data.error&&"function"==typeof(data.error)) {
	                   	data.error(err);
	                   }
	             	}
                  };
               initSDK.prototype.getMeetingURL(data3);
        	}
        	else
        	{
        		console.log("未提供音视频播放器");
        	}
        },
        //观摩对讲
        imitateTalk:function(data){
          if (!data.play) {
        	  console.log("未提供音视频播放器");
          }
          else{
          	var data1=$.extend({},{
                   type:3
            },data);
            initSDK.prototype.getTalkBackInfo(data1);
          }
        },
        //对讲观摩3
        talkImitate:function(res){
          if (!res.play) {
        	  console.log("未提供音视频播放器");
          }
          else
          {
          	var result="";
          	var player=res.play;
          	var len=res.imitTalklist.length;
          	var playParam={
          		url:""
          	};
			var imitlist=[];
          	var imitateCallback=function(j){
			    var i=j;
	            var data4={
               	 	 SeqNo:res.SeqNo,
                	 domainCode:res.imitTalklist[i].strUserDomainCode,
                     strUserTokenID:res.imitTalklist[i].strUserTokenID,
			         error:function(err){
			         	 data4.success(err);
			         },
			         success:function(dt){
			         		var url=dt.dynamicUrl;
                             playParam={
				          		url:""
				          	 };
				          	 playParam={
				          		url:url
				          	 };
                             imitlist.push(playParam);
			         		 i++;
			                 if(i<len)
				             {
				                //回调获取 每个对讲用户的直播地址url
			                    imitateCallback(i);
			                 }
			                 else
			                 {
			                 	var listParam={
			                 		play:player,
			                 		list:imitlist
			                 	};
			                 	result=initSDK.prototype.playlive(listParam);
			                 	var resultCode=JSON.parse(result);
			                 	 if (resultCode.nResultCode==0) {
		                       	  if (res.success&&"function"==typeof(res.success)) {
			                       	res.success(resultCode);
			                        }
		                        }
		                         else {
		                       	  if (res.error&&"function"==typeof(res.error)) {
		                       		res.error(resultCode);
		                        	}
                                }
			                 }
			         	
			         }
               	 };
                initSDK.prototype.getMobileDynamicUrl(data4);
				};
			   imitateCallback(0);
	            //开启对讲监听
	           var data0={
	             SeqNo:res.SeqNo,
	             error:function(err){
                     if (res.error&&"function"==typeof(res.error)) {
                         res.error(err);
                     }
	             },
	             nEnable:parseInt(res.nEnable),//是否开启监听 0 不开启 1开启
	             nTalkbackID:parseInt(res.nTalkbackID),
	             strDomainCode:res.strDomainCode
	             };
			   initSDK.prototype.talkbackStateObserver(data0);
          }
        },
        //获取对讲信息
        getTalkBackInfo:function(data){
			var videoIdArr=[];
		    var OtherUserTokenID=[];//对方用户tokenID
			var OtherUserDomainCode=[];//对方用户域编码
			var recordlist=[];
			var recordlistObj={
                recoidID:"",
                recordDomainCode:""
			};
			var imitTalkObj={
                strUserTokenID:"",
                strUserDomainCode:""
			};
			var imitTalklist=[];
			var player=data.play;
			var type=data.type;
            var data1={
                 SeqNo:data.SeqNo,
                 nTalkbackID:data.nTalkbackID,
                 strDomainCode:data.strDomainCode,
                 success:function(dt){
					if(dt.nResultCode==0)
					{
					  if (type==1||type==2) {

                          for(var j=0;j<dt.listRecordInfo.length;j++)
						  {
						  	recordlistObj={
				                recoidID:"",
				                recordDomainCode:""
							};
							//录像ID
							if(dt.listRecordInfo[j].nRecordID!=0)
							{
						     videoIdArr.push(dt.listRecordInfo[j].nRecordID);
						     recordlistObj={
                             recoidID:dt.listRecordInfo[j].nRecordID,
                             recordDomainCode:data.strDomainCode
						     };
						     recordlist.push(recordlistObj);
						    }
						  }

		                  //调用回放接口
		                  if (videoIdArr&&videoIdArr.length>0) {
                              
                             var data2=$.extend({},{
                             	recordlist:recordlist
                                //RecordIDList:videoIdArr,//录像ID数组,例如：[1,2,3]
						        //serviceUrl:{
								   // strDomainCode:data.strDomainCode,//必填
								   // strDeviceCode:"",
								   // strChannelCode:"",
								   // strStreamCode:"",
							    //}
                             },data);
						      if (type==1) {
						      	 //对讲回放
						      	 initSDK.prototype.talkPlayback(data2);
						      }
						      else if(type==2)
						      {
						      	 //对讲下载
                                 initSDK.prototype.talkDownload(data2);
						      }
		                  }
		              }
		              else if (type==3) {
		              	  for(var i=0;i<dt.listUserInfo.length;i++)
						  {
						  	imitTalkObj={
				                strUserTokenID:"",
				                strUserDomainCode:""
							};
							//观摩用户token
		                    if(dt.listUserInfo[i].strUserTokenID!="")
		                    {  //tokenid为空表示用户未参加此次对讲

		                    	imitTalkObj={
		                    		strUserTokenID:dt.listUserInfo[i].strUserTokenID,
		                    		strUserDomainCode:dt.listUserInfo[i].strUserDomainCode
		                    	};
		                    	imitTalklist.push(imitTalkObj);
		                    	OtherUserTokenID.push(dt.listUserInfo[i].strUserTokenID);//tokenid，若存在重复tokenID 则表示用户多次进入此次对讲，例如：接收对讲后被踢出，再次被邀请进对讲。下同。
		                    	OtherUserDomainCode.push(dt.listUserInfo[i].strUserDomainCode);//domain code
		                    }
		                   
						  }
						  if (OtherUserTokenID.length>0&&OtherUserDomainCode.length>0) {
							  //观摩对讲  用户tokenID+域Code
							  var data3=$.extend({},{
							  	imitTalklist:imitTalklist
							  	// domainCodelist:OtherUserTokenID,
							  	// strUserTokenIDlist:OtherUserDomainCode
							  },data);
							  if (type==3) {
							  	//对讲观摩
							  	initSDK.prototype.talkImitate(data3);
							  }
						   }
		              }
				    }
				},
				error:function(err){
                  if (data.error&&"function"==typeof(data.error)) {
	          	  	data.error(err);
	          	  }
				}
             };
           initSDK.prototype.getTalkbackInfo(data1);
        },
        //对讲多路同步下载
        downloadTalk:function(data){
          if (data.play) {
              var data1=$.extend({},{
                   type:2
              },data);
             initSDK.prototype.getTalkBackInfo(data1);
          }
          else
          {
        	  console.log("未提供音视频播放器");
          }
        },
        //对讲录像回放  通过对讲ID回放录像
        playbackTalk:function(data){
           if (data.play) {
           	    var data1=$.extend({},{
                    type:1
           	    },data);
           	    //获取信息（对讲下载、回放、观摩↓同一个接口，执行不同操作，type作为区分）
           	    initSDK.prototype.getTalkBackInfo(data1);
          }
          else{
        	  console.log("未提供音视频播放器");
          }
        },
        //会议回放
        playbackMeeting:function(data){
          if (!data.play) {
        	  console.log("未提供音视频播放器");
          }
          else{
          	var result="";
          	var player=data.play;//赋值
          	var layout=data.layout;
          	var playParam={//声明变量
          		url:""
          	};
          	var list=[];
          	var data1={
          		SeqNo:data.SeqNo,
          		strDomainCode:data.strDomainCode,
          		nMeetingID:data.nMeetingID,
          		success:function(res){
                 if (res.nResultCode==0) {
                 	 var data2={
                 	 	SeqNo:data.SeqNo,
                 	 	unRecordId:res.nRecordID,
                 	 	serviceUrl:{
						   strDomainCode:res.strDomainCode,//必填
						   strDeviceCode:data.strDeviceCode,
						   strChannelCode:data.strChannelCode,
						   strStreamCode:data.strStreamCode,
					    },
					    success:function(dt){
					    	if(dt.nResultCode==0){
                                var url=dt.playbackUrlInfo.strPlaybackUrl;
                                playParam={//初始化
					          		url:""
					          	};
					          	playParam={
					          		url:url
					          	};
                               // playParam["url"]="";
			                   // playParam["url"]=url;
			                    list.push(playParam);
			                    var listParam={
		                    		play:player,
		                    		layout:layout,
		                    		list:list
		                    	};
		                       result=initSDK.prototype.playback(listParam);
		                       var resultCode=JSON.parse(result);
			                 	 if (resultCode.nResultCode==0) {
		                       	  if (data.success&&"function"==typeof(data.success)) {
			                       	data.success(resultCode);
			                        }
		                        }
		                         else {
		                       	  if (data.error&&"function"==typeof(data.error)) {
		                       		data.error(resultCode);
		                        	}
                                }
					    	}
                         
					    },
					    error:function(err){
                         if (data.error&&"function"==typeof(data.error)) {
			          	  	data.error(err);
			          	  }
					    }
                 	 };
                   initSDK.prototype.playbackCTS(data2);
                 }
          		},
          		error:function(err){
                  if (data.error&&"function"==typeof(data.error)) {
	          	  	data.error(err);
	          	  }
          		}
          	};
          initSDK.prototype.getMeetingAllInfo(data1);
          }
        },
        //URL回放1
        playbackVideo:function(data){  //录像recordID  回放录像 
           if(data.play){
             var result="";
             var player=data.play;
             var layout=data.layout;
             var datalist=data.list||[];
             var len=datalist.length;
             if (len==0) {
             	return [];
             }
             var list=[];
             var playbackCallback=function(j){
                var i=j;
                var playParam=data.list[i].playParam?data.list[i].playParam:{};
                var data1={
           	 	 SeqNo:data.SeqNo,
           	 	 unRecordId:data.list[i].unRecordId,
		         serviceUrl:{
		         	strDomainCode:data.list[i].serviceUrl.strDomainCode,
					strDeviceCode:data.list[i].serviceUrl.strDeviceCode,
					strChannelCode:data.list[i].serviceUrl.strChannelCode,
					strStreamCode:data.list[i].serviceUrl.strStreamCode,
		         },
		         success:function(res){
                    var url=res.playbackUrlInfo.strPlaybackUrl;
                        playParam["url"]="";
                        playParam["url"]=url;
                       list.push(playParam);
                    //delete res.playbackUrlInfo.strPlaybackUrl;?
                    i++;
                    if (i<len) {
                    	playbackCallback(i);
                    }
                    else{
                    	var listParam={
                    		play:player,
                    		layout:layout,
                    		list:list
                    	};
                       result=initSDK.prototype.playback(listParam);
	                    var resultCode=JSON.parse(result);
	                 	 if (resultCode.nResultCode==0) {
	                   	  if (data.success&&"function"==typeof(data.success)) {
	                       	data.success(resultCode);
	                        }
	                    }
	                     else {
	                   	  if (data.error&&"function"==typeof(data.error)) {
	                   		data.error(resultCode);
	                    	}
	                    }
                    }
                   
		         },
		         error:function(err){
		         	data1.success(err);
		         }
           	 };
             initSDK.prototype.playbackCTS(data1);
             };
             playbackCallback(0);
           }
           else
           {
        	   console.log("未提供音视频播放器");
           }

        },
		//获取录像大小
		getRecordDataSize:function(data){
           var data1=$.extend({},{
                       
           },data);
           send(ocx,4632,data.SeqNo,data1);
		},
		//录像下载 单个recordID下载
		downloadVideo:function(dataall){
             
			if(!dataall.play){
				console.log("未提供音视频播放器");
			}
			else{
				var player = dataall.play;
				var recordDataSize={
					SeqNo:dataall.SeqNo,
                    recordList:[{
                    	strDomainCode:dataall.serviceUrl.strDomainCode,
                    	unRecordID:dataall.unRecordId
                    }],
                    success:function(res){
                    	//获取录像文件Size
                    	var recordParam={
							SeqNo:dataall.SeqNo,
							   serviceUrl:{
								   strDomainCode:dataall.serviceUrl.strDomainCode,
								   strDeviceCode:dataall.serviceUrl.strDeviceCode,
								   strChannelCode:dataall.serviceUrl.strChannelCode,
								   strStreamCode:dataall.serviceUrl.strStreamCode,
								},
						unRecordId:dataall.unRecordId,
						success:function(data){
							var len=data.playbackUrlInfo.playbackTimeInfo.length;
							var dateTimeStart=new Date(data.playbackUrlInfo.playbackTimeInfo[0].strStartTime.replace(/-/g,  "/"));
							var dateTimeEnd=new Date(data.playbackUrlInfo.playbackTimeInfo[len-1].strEndTime.replace(/-/g,  "/"));
							var recordEndTime=parseInt((dateTimeEnd.getTime()-dateTimeStart.getTime())/1000);
							//待修改
							var size=0;
							var recordDomainCode=res.lstRecordSize[0].strDomainCode;
							size=res.lstRecordSize[0].unDataSize;
							var recordObj={
								  play:player,
								  url:data.playbackUrlInfo.strPlaybackUrl,
								  speed:data.speed||1024,
								  downloadFileName:dataall.downloadFileName||"C:\\Users\\Administrator\\Downloads\\default.mp4",
								  beginTime:0,
								  endTime:recordEndTime,
								  size:size,
								  error:function(err){
                                     //someCode  暂无 ？
								  }
							  };
						 initSDK.prototype.StartDownLoadByUrl(recordObj.play,recordObj.url,recordObj.speed,recordObj.downloadFileName,recordObj.beginTime,recordObj.endTime,recordObj.size,recordObj.error);
						},
						error:dataall.error
					   };
					   initSDK.prototype.playbackCTS(recordParam);
                    },
                    error:dataall.error

				};
				initSDK.prototype.getRecordDataSize(recordDataSize);
			}
			
		}, 
	   //批量下载
	   downloadBatch:function(res){
         if (!res.play) {
        	 console.log("未提供音视频播放器");
         }
         else{
           initSDK.prototype.talkDownload(res);
         }
	    },
	   //对讲录像下载 通过对讲ID下载录像
	   talkDownload:function(res){
         if (!res.play) {
        	 console.log("未提供音视频播放器");
         }
         else{
         	var player=res.play;
         	var recordLen=res.recordlist.length;
         	var startTime=0;
         	var endTime=0;
         	var downloadSpeed=res.downloadSpeed,
         	    downloadAddr=res.downloadAddr,
         	    downloadCaseName=res.downloadCaseName,
         	    downloadfileName="1.mp4",
         	    layout=res.layout;
         	//发送ocx，下载数据对象
         	var downloadObj={ //下载对象
         		play:player,
		        caseName:downloadCaseName,
		        downloadDir:downloadAddr+"\\"+downloadCaseName,
		        speed:downloadSpeed||1024,
		        layout:"",
		        videoList:""
			};
			var videoList=[];//录像数组
			var videoListObj={};//单个录像对象
			var urlList=[];
			//重新编辑urllistObj、urllistArr数据，修改存放至urlList、urlListObj后发送给ocx
			var urlListObj={
				strStreamCode:"",
				url:"",
				fileName:"",
				offset:0,
				size:0,
	            timelist:""
			};
			//存放递归回来的数据
			var urllistObj={
				strStreamCode:"",
				url:"",
				startTime:"",
				endTime:"",
				size:0,
				fileName:"",
				timelist:""
			};
			//递归获取到的时间数据对象
			var timeListObj={
			  	startTime:"",
				stopTime:""
		    };
		    //编辑timeListObj、timeListArr数据，存放至timeObj、timeObjArr
		    var timeObj={
		    	beginTime:"",
		    	endTime:""
		    };
		    var timeObjArr=[];
		    var timeListArr=[];
			var urllistArr=[];
			var downcallback=function(j){
              var i=j;
              var recordDataSize={
					SeqNo:0,
                    recordList:[{
                    	strDomainCode:res.recordlist[i].recordDomainCode,//res.serviceUrl.strDomainCode,
                    	unRecordID:parseInt(res.recordlist[i].recoidID)//parseInt(res.RecordIDList[i])
                    }],
                    success:function(dtsize){
                      var downdata={
		                   SeqNo:0,
		                   serviceUrl:{
				            strDomainCode:res.recordlist[i].recordDomainCode,//res.serviceUrl.strDomainCode,
				            strDeviceCode:"",//res.serviceUrl.strDeviceCode,
				            strChannelCode:"",//res.serviceUrl.strChannelCode,
				            strStreamCode:""//res.serviceUrl.strStreamCode
				            },
				            unRecordId:parseInt(res.recordlist[i].recoidID),//parseInt(res.RecordIDList[i]),
				           success:function(dt){
				             	//初始化对象
				            	urllistObj={
				            		strStreamCode:"",
									url:"",
									startTime:"",
									endTime:"",
									size:0,
									fileName:"",
									timelist:""
								};
								timeListObj={
								  	startTime:"",
									stopTime:""
								};
								timeListArr=[];
		                        var len=dt.playbackUrlInfo.playbackTimeInfo.length;
							    ///获取开始、结束时间，暂定长度为1
							    var dateTimeStart=new Date(dt.playbackUrlInfo.playbackTimeInfo[0].strStartTime.replace(/-/g,  "/"));//时间格式转换
							    var dateTimeEnd=new Date(dt.playbackUrlInfo.playbackTimeInfo[len-1].strEndTime.replace(/-/g,  "/"));
							    if (startTime==0) {
							    	startTime=dateTimeStart;
							    }
							    else{
		                            if(dateTimeStart.getTime()<startTime.getTime())
							    	{
							    		startTime=dateTimeStart;
							    		//StartDateTime=dt.playbackUrlInfo.playbackTimeInfo[0].strStartTime;
							    	}
							    }
							    if (endTime==0) {
							    	endTime==dateTimeEnd;
							    }
							    else{
		                            if(dateTimeEnd.getTime()>endTime.getTime())
						        	{
						        		endTime=dateTimeEnd;
						        	}
							    }
							    for(var n=0;n<len;n++){
							    	  //初始化对象，获取时间段信息（可能存在间隔）
							          timeListObj={
									  	startTime:"",
										stopTime:""
								      };
								      var timeStartTime=new Date(dt.playbackUrlInfo.playbackTimeInfo[n].strStartTime.replace(/-/g,  "/"));//时间格式转换
							          var timeStopTime=new Date(dt.playbackUrlInfo.playbackTimeInfo[n].strEndTime.replace(/-/g,  "/"));
							          timeListObj.startTime=timeStartTime;
							          timeListObj.stopTime=timeStopTime;
							          timeListArr.push(timeListObj);
							    }
							    urllistObj.strStreamCode=dt.playbackUrlInfo.strStreamCode;
							    urllistObj.url=dt.playbackUrlInfo.strPlaybackUrl;
							    urllistObj.startTime=dateTimeStart;
							    urllistObj.endTime=dateTimeEnd;
							    urllistObj.fileName= downloadCaseName+"_"+i; 
							    urllistObj.size=dtsize.lstRecordSize[0].unDataSize;
							    urllistObj.timelist=timeListArr;
							    urllistArr.push(urllistObj);
							    i++;
							    if (i<recordLen) {
							    	downcallback(i);
							    }
							    else
							    {
							      //递归结束，进行数据封装修改，后发送给ocx，执行下载操作
							      downouter:
		                          for(var m=0;m<urllistArr.length;m++){
		                          	//初始化对象
		                          	urlListObj={
										strStreamCode:"",//用于记录用户userID
										url:"",
										fileName:"",
										offset:0,
										size:0,
							            timelist:""
									};
                                    timeObj={
								    	beginTime:"",
								    	endTime:""
								    };
								    timeObjArr=[];
                                    var startTimeLen=parseInt((urllistArr[m].startTime.getTime()-startTime.getTime())/1000);
                                    var existFlag=0;//标记
                                    for(var b=0;b< urllistArr[m].timelist.length;b++)
                                    {
                                    	timeObj={
								    	 beginTime:"",
								    	 endTime:""
								        };
                                        var beginTimeLen=parseInt((urllistArr[m].timelist[b].startTime.getTime()-startTime.getTime())/1000);//转换时间戳，计算开始和结束时间，后转化为秒
                                        var endTimeLen=parseInt((urllistArr[m].timelist[b].stopTime.getTime()-startTime.getTime())/1000);
                                        timeObj.beginTime=beginTimeLen;
                                        timeObj.endTime=endTimeLen;
                                        timeObjArr.push(timeObj);
                                    }
                                    urllistArr[m].timelist=timeObjArr;
                                    var fileNameToMath="";//
                                     if (videoList.length>0) {
						                //校验是否存在相同用户，不同录像id
						                var vLen=videoList.length;//foreach??
						                downinter:
						                for(var a=0;a<vLen;a++){

						                	//后期如若修改，将streamcode改为对应字段记录userID即可
						                  if(urllistArr[m].strStreamCode==videoList[a].urllist[0].strStreamCode){
						                  	//添加至已存在的数组对象中
											  urlListObj={
												strStreamCode:urllistArr[m].strStreamCode,
												url:urllistArr[m].url,
												fileName:urllistArr[m].fileName+".mp4",//
												offset:0,//startTimeLen,
												size:urllistArr[m].size,
										        timelist:urllistArr[m].timelist
											};
						                  	videoList[a].urllist.push(urlListObj);
						                  	//标识
						                  	existFlag=1;
						                  	//跳出当前循环
						                  	break downinter;
						                  }
						                  //downinter for循环结束
						                }

						            }
						            else{

						            }
                                    urlList=[{
                                       strStreamCode:urllistArr[m].strStreamCode,
                                       url:urllistArr[m].url,
                                       offset:0,//startTimeLen,
                                       size:urllistArr[m].size,
                                       fileName:urllistArr[m].fileName+".mp4", //urllistArr[m].fileName+".mp4",2017年10月11日15:09:24
                                       timelist:urllistArr[m].timelist
                                    }];
                                    videoListObj={
                                    	urllist:urlList
                                    };
                                    if (existFlag==0) {
                                       videoList.push(videoListObj);
                                    }
                                     //downouter for循环结束
		                          }

		                          for(var c=0;c<videoList.length;c++){
		                          	//播放窗口winID设置
		                          	videoList[c].wid=c;
		                          	videoList[c].isAudioValid=1;//是否开启音频，1开启
		                          }
		                          downloadObj.videoList=videoList;
		                          downloadObj.layout=videoList.length;
                                  initSDK.prototype.StartBatchDownload(downloadObj);
							    }
				               },
				               error:function(err){
                                 if (res.error&&"function"==typeof(res.error)) {
					          	  	res.error(err);
					          	  }
				               }
					   };
					   initSDK.prototype.playbackCTS(downdata);
                    },
                    error:function(err){
                      if (res.error&&"function"==typeof(res.error)) {
					      res.error(err);
					    }
                    }
			};
			initSDK.prototype.getRecordDataSize(recordDataSize);
		  }
		  downcallback(0);
         }
	   },
       //对讲录像回放  通过对讲ID回放录像
       talkPlayback:function(res){
        if (!res.play) {
        	console.log("未提供音视频播放器");
        }
        else{
          var result="";
          var recordLen=res.recordlist.length;//res.RecordIDList.length;
          var player=res.play;
		   //初始化录像录像发送数据
		  var totalplaybackTimeInfo={
		  	 play:player,
		     videoStartTime:"",
		     videoList:"",
		     error:function(err){
                if (res.error&&"function"==typeof(res.error)) {
                	res.error(err);
                }
		     }
		  };
		  //初始化单个录像信息
		  var playbackTimeInfo={
		  	  strStreamCode:"",//编码
		  	  nRecordID:"",//录像ID
		  	  strStartTime:"",//开始时间
		      strEndTime:"",//结束时间
		  	  nBeginOffset:0,//偏移时间
		  	  unRecordType:"",//录像类型tcp  udp
		  	  url:"",//录像地址
		  	  timeList:""//录像时间段
		  };
		  //存放录像信息
		  var playbackTimeInfoArr=[];
		  //开始时间
		  var startTime=0;
		  var StartDateTime="";
		  //结束时间
		  var endTime=0;
		  //初始化全部播放数组信息
		  var videoList=[];
		  var videoObj={};
		  //初始化个人数组信息
		  var recordList=[];
		  var recordListObj={
		  	  recordId:0,
		  	  strStreamCode:"",
		  	  startTime:0,
		  	  stopTime:0,
		  	  speed:1,//播放速度
		  	  isAudioValid:1,//是否启用音频
		  	  tsType:1,//类型 udp  tcp
		  	  offset:0,//偏移时间
		      url:"",//播放地址
		      timeList:""//录像时间段
		  };
		  //时间段数组
		  var timeListArr=[];
		  //时间段对象
		  var timeListObj={
		  	  startTime:"",
			  stopTime:""
		  };
		  //初始化时间参数
		  var year,month,day,hour,min,second;
		
		  //回调获取多个录像url
		  var videoCallback=function(j){
			var i=j;
			var data={
				SeqNo:0,
			    success:function(dt){
			     //每次执行先初始化单个录像信息,否则存放的都是最后一条数据
				 playbackTimeInfo={
				  	strStreamCode:"",//编码
				  	nRecordID:"",//录像ID
				  	strStartTime:"",//开始时间
				  	strEndTime:"",//结束时间
				  	nBeginOffset:0,//偏移时间
				  	unRecordType:"",//录像类型tcp  udp
				  	url:"",//录像地址
		        	timeList:""//录像时间段
				};
				timeListObj={
				  	startTime:"",
					stopTime:""
			    };
			    timeListArr=[];
			    //比较时间
			    ///获取录像时间段长度
			    var len=dt.playbackUrlInfo.playbackTimeInfo.length;
			    ///获取开始、结束时间
			    var dateTimeStart=new Date(dt.playbackUrlInfo.playbackTimeInfo[0].strStartTime.replace(/-/g,  "/"));
			    var dateTimeEnd=new Date(dt.playbackUrlInfo.playbackTimeInfo[len-1].strEndTime.replace(/-/g,  "/"));
			    /*录像下载需要**/
		        //recordEndTime=parseInt((dateTimeEnd.getTime()-dateTimeStart.getTime())/1000);
		        //recordUrl=dt.playbackUrlInfo.strPlaybackUrl;
		        /**录像下载需要***/
			    if(startTime==0)
			    {
			    	//比较开始时间大小
			    	startTime=dateTimeStart;
			    	StartDateTime=dt.playbackUrlInfo.playbackTimeInfo[0].strStartTime;
			    }
			    else{
			    	if(dateTimeStart.getTime()<startTime.getTime())
			    	{
			    		startTime=dateTimeStart;
			    		StartDateTime=dt.playbackUrlInfo.playbackTimeInfo[0].strStartTime;
			    	}
			    }
			    
		        if(endTime==0)
		        {
		        	//比较结束时间大小
		        	endTime=dateTimeEnd;
		        }
		        else{
		        	if(dateTimeEnd.getTime()>endTime.getTime())
		        	{
		        		endTime=dateTimeEnd;
		        	}
		        }
		        for(var n=0;n<len;n++){
		          timeListObj={
				  	startTime:"",
					stopTime:""
			       };
		          timeListObj.startTime=dt.playbackUrlInfo.playbackTimeInfo[n].strStartTime;
		          timeListObj.stopTime=dt.playbackUrlInfo.playbackTimeInfo[n].strEndTime;

		          timeListArr.push(timeListObj);
		        }
		        //获取录像信息
		        playbackTimeInfo.strStreamCode=dt.playbackUrlInfo.strStreamCode;//用户识别
		        playbackTimeInfo.nRecordID=dt.playbackUrlInfo.nRecordID;
		        playbackTimeInfo.url=dt.playbackUrlInfo.strPlaybackUrl;
		        playbackTimeInfo.strStartTime=dateTimeStart;
		        playbackTimeInfo.strEndTime=dateTimeEnd;
		        playbackTimeInfo.nBeginOffset=dt.playbackUrlInfo.nBeginOffset;
		        playbackTimeInfo.unRecordType=dt.playbackUrlInfo.playbackTimeInfo[0].unRecordType;

		        //1
		        //playbackTimeInfo.timeList.startTime=dt.playbackUrlInfo.playbackTimeInfo[0].strStartTime;
		        //playbackTimeInfo.timeList.stopTime=dt.playbackUrlInfo.playbackTimeInfo[0].strEndTime;
		        playbackTimeInfo.timeList=timeListArr;
		        //存放录像数据
		        playbackTimeInfoArr.push(playbackTimeInfo);
		        //获取得到录像url
		        //var Uri=dt.playbackUrlInfo.strPlaybackUrl;
		        
		        //videoUriS.push(Uri);

		        //player.playback(videoUriS);

		        i++;
		        if(i<recordLen)
		        {

		         videoCallback(i);
		        }
		        else{
		         //取到所有录像数据操作
		         var TotalTimeLen=parseInt((endTime.getTime()-startTime.getTime())/1000);
		         outer:
		         for(var m=0;m<playbackTimeInfoArr.length;m++){
		         	var startTimeLen=parseInt(( playbackTimeInfoArr[m].strStartTime.getTime()-startTime.getTime())/1000);
		         	var endTimeLen=parseInt(( playbackTimeInfoArr[m].strEndTime.getTime()-startTime.getTime())/1000);
		         	var existFlag=0;
		            // var 
		            recordListObj={
					  	recordId:0,
					  	strStreamCode:"",
					  	startTime:0,
					  	stopTime:0,
					  	speed:1,//播放速度
					  	isAudioValid:1,//是否启用音频
					  	tsType:1,//类型 udp  tcp
					  	offset:0,//偏移时间
					    url:"",//播放地址
					    timeList:""//录像时间段
					};
		            if (videoList.length>0) {
		                //校验是否存在相同用户，不同录像id
		                var vLen=videoList.length;//foreach??
		                inter:
		                for(var a=0;a<vLen;a++){
		                	//后期如若修改，将streamcode改为对应字段即可
		                  if(playbackTimeInfoArr[m].strStreamCode==videoList[a].recordList[0].strStreamCode){
		                  	//添加至已存在的数组对象中
							  recordListObj={
								  	recordId:playbackTimeInfoArr[m].nRecordID,
								  	strStreamCode:playbackTimeInfoArr[m].strStreamCode,
								  	startTime:startTimeLen,
								  	stopTime:endTimeLen,
								  	speed:1,//播放速度
								  	isAudioValid:1,//是否启用音频
								  	tsType:1,//类型 udp  tcp
								  	offset:playbackTimeInfoArr[m].nBeginOffset,//偏移时间
								    url:playbackTimeInfoArr[m].url,//播放地址
								    timeList:playbackTimeInfoArr[m].timeList//录像时间段
							};
		                  	videoList[a].recordList.push(recordListObj);
		                  	//标识
		                  	existFlag=1;
		                    //跳出当前循环
		                  	break inter;
		                  }
		                  else{

		                  }
		                }
		            }
		            else{

		            }
		            recordList=[{
					  	 recordId:playbackTimeInfoArr[m].nRecordID,
					  	 strStreamCode:playbackTimeInfoArr[m].strStreamCode,
					     startTime:startTimeLen,
					  	 stopTime:endTimeLen,
					     speed:1,//播放速度
					  	 isAudioValid:1,//是否启用音频
					  	 tsType:1,//类型 udp  tcp
					  	 offset:playbackTimeInfoArr[m].nBeginOffset,//偏移时间
					  	 url:playbackTimeInfoArr[m].url,
					  	 timeList:playbackTimeInfoArr[m].timeList
					  	 // timeList:[{
					  	 // 	startTime:playbackTimeInfoArr[m].timeList.startTime,
					  	 // 	stopTime:playbackTimeInfoArr[m].timeList.stopTime
					  	 // }]
				    }];
				    videoObj={
				    	//winId:m,
				    	recordList:recordList
				    };
				    if(existFlag==0)
				    {
				     videoList.push(videoObj);
				    }
		         }
		         for(var k=0;k<videoList.length;k++)
		         {
		         	videoList[k].winId=k;
		         }
		         totalplaybackTimeInfo.videoStartTime=StartDateTime;
		         totalplaybackTimeInfo.videoList=videoList;
		         initSDK.prototype.playbackMultiSync(totalplaybackTimeInfo);
		        }

		        },
		        error:function(err){
                  if (res.error&&"function"==typeof(res.error)) {
                  	   res.error(err);
                  }
		        },
		        serviceUrl:{
		           strDomainCode:res.recordlist[i].recordDomainCode,//res.serviceUrl.strDomainCode,
		           strDeviceCode:"",//res.serviceUrl.strDeviceCode,
		           strChannelCode:"",//res.serviceUrl.strChannelCode,
		           strStreamCode:""//res.serviceUrl.strStreamCode
		         },
		        unRecordId:res.recordlist[i].recoidID//parseInt(res.RecordIDList[i])
			};
			initSDK.prototype.playbackCTS(data);
		}
		videoCallback(0);
        }
        },
        //*********************************************************对讲********************************
	    //发起对讲
        startTalking:function(data){
        	//添加code
         var data1=$.extend({},{
            strTalkbackDomainCode:data.strTalkbackDomainCode||ocx.GetUserData("userDomainCode"),
        	strFromUserDomainCode:ocx.GetUserData("userDomainCode"),
        	strFromUserTokenID:ocx.GetUserData("strUserTokenID"),
        	strFromUserName:ocx.GetUserData("strUserName")
         },data);
            send(ocx, 54301, data.SeqNo, data1);
         },
		
        //通知参加对讲
        registerIncomingCall:function(fn){

           registerPush(54305,fn);
        },
        
        //邀请对讲
        inviteUserTalkBack:function(data){
         var data1=$.extend({},{
        	 strFromUserDomainCode:ocx.GetUserData("userDomainCode"),
             strFromUserTokenID:ocx.GetUserData("strUserTokenID"),
             strFromUserName:ocx.GetUserData("strUserName")
            },data);
          send(ocx, 54313, data.SeqNo, data1);
        },

        //参加对讲
        judgeJoinTalking:function(data){
            var data1=$.extend({},{
			 strUserDomainCode:ocx.GetUserData("userDomainCode"),
			 strUserTokenID:ocx.GetUserData("strUserTokenID"),
			},data);
            send(ocx, 54307, data.SeqNo, data1);
        },
		
        //结束对讲
        quitTalking:function(data){
          var data1=$.extend({},{
          	 strUserDomainCode:ocx.GetUserData("userDomainCode"),
          	 strUserName:ocx.GetUserData("strUserName"),
             strUserTokenID:ocx.GetUserData("strUserTokenID"),
            },data);
         send(ocx, 54317, data.SeqNo, data1);
        },

		//请出对讲
        kickTalkbackUser:function(data){
         var data1=$.extend({},{
            strFromUserDomainCode:ocx.GetUserData("userDomainCode"),
            strFromUserTokenID:ocx.GetUserData("strUserTokenID"),
            strFromUserName: ocx.GetUserData("strUserName"),
            },data);
            send(ocx, 54339, data.SeqNo, data1);
         },

         //通知用户被请出对讲
         notifyKickUserTalkBack:function(fn){ 
		 	registerPush(54337,fn);
         },
         
        //对讲状态信息
        notifyTalkbackStatusInfo:function(fn){
        	 registerPush(54321,fn);
        },

        //获取对讲信息
        getTalkbackInfo:function(data){
         var data1=$.extend({},{
        	},data);
        	send(ocx, 54329, data.SeqNo, data1);
        },
        //通知发起方对方是否已接听
        notifyPeerUserTalkbackInfo:function(fn){
            registerPush(54311,fn);
        },
		  //对讲状态监听
        talkbackStateObserver:function(data){
          var data1=$.extend({},{
                strUserDomainCode:ocx.GetUserData("userDomainCode"),
                strUserTokenID:ocx.GetUserData("strUserTokenID")
            },data);
            send(ocx, 54343, data.SeqNo, data1);
         },
		// ======================================对讲全部接口  ================================================================
		// ========================================player 播放器==================================================================
		setLayout:function(param){
          if (!param.play) {
        	  console.log("未提供音视频播放器");
          }
          else{
          	var ret,
          	    player=param.play,
          	    layout=param.layout;
          	if('number'==typeof layout){
		       ret=player.SetLayout(layout);
		    }else{
		       ret=player.SetLayoutEx(JSON.stringify(layout));
		    }
		    return ret;
          }
		},
		setLayoutEx:function(param){
          if (!param.play) {
        	  console.log("未提供音视频播放器");
          }
          else{
          		var ret,
          	    player=param.play,
          	    layout=param.layout;
		        ret=player.SetLayoutEx(JSON.stringify(layout));
          }                    
		},
		appendLayout:function(param){
         if (!param.play) {
        	 console.log("未提供音视频播放器");
         }
         else
         {
         	var count=param.count, 
         	    prevLayout,
         	    ret,
         	    player=param.play;
		    
		    if('undefined'==typeof count){
		        count=1;
		    }
		    prevLayout=initSDK.prototype.getLayout(param);
		    var layout=prevLayout+count;
		    param.count=layout;
		    ret=initSDK.prototype.setLayout(param);
		    return ret;
         }
		},
		getLayoutInfo:function(param){
			if (!param.play) {
				console.log("未提供音视频播放器");
			}
			else{
				var player=param.play;
			    var result=player.GetLayoutInfo();
			    if(result.length>0){
			       result=JSON.parse(result);
			    }else{
			       result={};
			    }
			    return result;
			}
		},
		getLayout:function(param){
			if (!param.play) {
				console.log("未提供音视频播放器");
			}
			else
			{
			   var player=param.play; 
               var layoutInfo=player.GetLayoutInfo();
			   if(0==layoutInfo.length){
			       return -1;
			   }
			   layoutInfo=JSON.parse(layoutInfo);
			   var result=layoutInfo.listLayoutRect.length;
			   return result;
			}
           
		},
		getWinIDByScreenID:function(param){
          if (!param.play) {
        	  console.log("未提供音视频播放器");
          }
          else{
              var player=param.play,
              ret;
              ret=player.GetWinIDByScreenID(param.screenId);
              return ret;
          }
		},
		getScreenIDByWinID:function(param){
             if (!param.play) {
            	 console.log("未提供音视频播放器");
          }
          else{
              var player=param.play,
              ret;
              ret=player.GetScreenIDByWinID(param.playWindowId);
              return ret;
          }
		},
		setActiveWindowBorderColor:function(param){
          if (!param.play) {
        	  console.log("未提供音视频播放器");
          }
          else{
          	var player=param.play,
          	ret;
          	var color=param.color.replace('#','');
          	var colors=parseInt(color,16);
          	ret=player.setActiveWindowBorderColor(colors);
          	return ret;
          }
		},
        setWindowBackgroundColor:function(param){
         if (!param.play) {
        	 console.log("未提供音视频播放器");
	     }
	     else{
              var player=param.play,
              ret;
              var color=param.color.replace('#','');
          	  var colors=parseInt(color,16);
              ret=player.SetWindowBackgroundColor(colors)
              return ret;
	      }
        },
        setWindowBorderColor:function(param){
             if (!param.play) {
            	 console.log("未提供音视频播放器");
             }
             else
             {
             	var player=param.play,
             	ret;
             	var color=param.color.replace('#','');
             	var colors=parseInt(color,16);
                ret=player.SetWindowBorderColor(colors);
                return ret;
             }
        },
        swapWindowByScreenID:function(param){
          if (!param.play) {
        	  console.log("未提供音视频播放器");
          }
          else{
          	var player=param.play,
             	ret,
                id1=parseInt(param.screenId1),
                id2=parseInt(param.screenId2),
                ret=player.SwapWindowByScreenID(id1,id2);
                return ret;
          }
        },
        swapWindowByWinID:function(param){
          if (!param.play) {
        	  console.log("未提供音视频播放器");
          }
          else{
          	var player=param.play,
             	ret,
                id1=parseInt(param.playWindowId1),
                id2=parseInt(param.playWindowId2),
                ret=player.SwapWindowByWinID(id1,id2);
                return ret;
          }
        },
        pushPlayTime:function(fn){//播放
        	registerPush(45016,fn);
        },
        pushStopPlay:function(fn){//停止播放
           registerPush(45011,fn);
        },
		stopPlay:function(param){
          if (!param.play) {
        	  console.log("未提供音视频播放器");
          	 // if (param.error&&"function"==typeof(param.error)) {
          	 //  	var errorCode=initSDK.prototype.errorCode(-3);
          	 //  	param.error(errorCode);
          	 //  }
			}
			else
			{
               var player=param.play;
               player.stopPlayBySessionId(-1);
			}
		},
		stopPlayBySessionId:function(param){
          if (!param.play) {
        	  console.log("未提供音视频播放器");
			}
			else
			{
               var player=param.play,
                   sessionId=parseInt(param.sessionId);
               player.StopPlayBySessionID(sessionId);
			}
		},
		stopPlayByWinId:function(param){
           if (!param.play) {
        	   console.log("未提供音视频播放器");
			}
			else
			{
               var player=param.play,
                   playWindowId=parseInt(param.playWindowId);
               player.StopPlayByWinID(playWindowId);
			}
		},
		pushActive:function(success){     //窗口激活
			  registerPush(45045,success);
		},
        
		pushWinwH:function(success){  // 视频开始播放时画面宽高通知和画面宽高变化通知
			  registerPush(45036,success);
		},

		pushCapture:function(success){ // 播放画面抓拍结果通知 
			  registerPush(45021,success);
		},

		pushStartPlay:function(success){  // 启动播放结果通知 
			  registerPush(45005,success);
		},
		setCaptureAudioSwitch:function(param){//开关音频
            if (!param.play) {
            	console.log("未提供音视频播放器");
			}
			else
			{
               var player=param.play,
                   isOn=param.isOn;
               var value=isOn ? 1 : 0;
               player.SetCaptureProperty(4,value);
			}
		},
		setCaptureVideoSwitch:function(param){//开关视频
            if (!param.play) {
            	console.log("未提供音视频播放器");
			}
			else
			{
               var player=param.play,
                   isOn=param.isOn;
               var value=isOn ? 1 : 0;
               player.SetCaptureProperty(5,value);
			}
		},
		playbackMultiSync:function(param){//对讲多路同步回放
           if (!param.play) {
        	   console.log("未提供音视频播放器");
			}
			else
			{
               var player=param.play;
               delete param.play;
               var strParam=JSON.stringify(param);
               player.StartMultiSyncPlayBack(strParam); 
			}
		},
		StartDownLoadByUrl:function(player,url,spd,addr,stime,etime,size,error){//下载 by url
            if (!player) {
            	console.log("未提供音视频播放器");
			}
			else
			{
               player.StartDownLoadByUrl(url,spd,addr,stime,etime,size);
			}
		},
		//对讲多路同步下载
		StartBatchDownload:function(param){
            if (!param.play) {
            	console.log("未提供音视频播放器");
			}
			else
			{
               var player=param.play;
               delete param.play;
               var strParam=JSON.stringify(param);
               player.StartBatchDownload(strParam); 
			}
		},
		SetVideoStretch:function(param){//拉伸
            if (!param.play) {
            	console.log("未提供音视频播放器");
			}
			else
			{
               var player=param.play;
               var width=param.width;
               var length=param.length;
               player.SetVideoStretch(width,length);
			}
		},
		ShowPlayPauseBtn:function(param){
          if (!param.play) {
        	  console.log("未提供音视频播放器");
		  }
		  else
		  {
             var player=param.play;
             var num=param.num?1:0;
             player.ShowPlayPauseBtn(num);
		  }
		},
		getBgPic:function(param){
          //设置背景图片
          if (param.play) {
              var player=param.play;
              var url=param.url;
              player.GetBgPic(url);
          }
          else
          {
        	  console.log("未提供音视频播放器");
          }
		},
		getPlayState:function(param){
          //获取播放状态
          if (param.play) {
              var ret,
              player=param.play,
              winid=param.playWindowId;
              ret=player.GetPlayState(winid);
              //true  播放  false 未播放
              return ret;
          }
          else{
        	  console.log("未提供音视频播放器");
          }
		},
		//===============================================播放器功能===========================================
		errorCode:function(n)
		{
           switch(n)
			{
			case 1685010002:
               var resultCode={
	          	 nResultCode:1685010002,
	             strResultDescribe : "内存不足"
              };
			  return resultCode;
			  break;
			case 1685010003:
              var resultCode={
	          	 nResultCode:1685010003,
	             strResultDescribe : "内部错误"
              };
			  return resultCode;
			  break;
			case 0:
			var resultCode={
                nResultCode:0,
                strResultDescribe : ""
			};
			return resultCode;
			break;
			default:
			 
			}
		},
		ListenServerPushMsg:function(value){
			ocx.ListenServerPushMsg(value);
		},
		//清除ocx,防止内存溢出
		destroy:function(play){
            play.Uninit();
		 }
	}
	
	window.initSDK = initSDK;

}())