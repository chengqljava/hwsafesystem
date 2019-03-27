/********话务操作 OpenAPI 硬交换**********/

/*******************话务参数列表beg*************************/
//座席基础参数,数据需要初始化
var agent_server_link='';//OPENAPI地址IXServer
var agent_cur_dn=''; //当前登陆话机号
var agent_cur_id='';//当前登陆工号
var agent_acd='2000';//ACD队列号
var agent_ismonitor='1';//0:普通座席 1:班长座席
var agent_skillarray='-1';//技能组
var agent_out_no='9';//出局号
var agent_trans_no='';//拓传号码
var agent_trunkid=0;//呼出中继组，0/-1表示任意可用通道

//座席相关业务信息
var agent_login_status=false;//座席登陆状态
var agent_cti_status=false;//连接CTI状态
var agent_call_type=1;//来电类型(0呼出;1呼入)
var agent_cur_tel="";//当前呼叫的号码
var agent_cur_bno="";//呼入的被叫号码
var agent_cur_uud="";//呼入的被叫号码
var agent_trans_tel="";//当前转移的号码
var agent_conf_tel="";//当前会议的号码
var agent_call_id=0;//当前录音编号callid
var agent_cur_status=2;//当前坐席状态（2空闲，3离开，4忙碌）
var agent_cur_hook=1;//当前话机状态（1挂机，2摘机）
var agent_task_id=0;//放音任务号
var agent_hold=0;//保持  0：未保持通话；1：保持通话 2:转移 3:会议
var agent_monitor_oper=0;//0:取消 1:强插 2:监听

//小休时间设置
var agent_rest_time=300;//小休时间设置（秒)
var agent_cur_rest_time=0;//小休时间设置（秒）
var agent_rest_time_clear=null;//清除计时

//通话时间设置
var agent_talk_time=0;//通话时长
var agent_talk_time_clear=null;//通话计时器

//整理时间设置
var agent_made_time=30;//座席整理时间
var agent_cur_made_time=0;//当前整理时间
var agent_made_time_clear=null;//整理计时器

//示忙类型
var agent_busy_type=0;//示忙类型(0离开1小休2整理)

//用于座席监控
var Agent_Count=0;//响应消息包含的座席数
var Agent_ID_Array='';//座席ID集合的字符串（ID之间用”；”隔开）
var Agent_Status_Array='';//座席状态集合的字符串（状态之间用”；”隔开，合法状态为；
var Agent_DN_Array='';//座席登录时使用的话机号码集合的字符串（号码之间用”；”隔开）；
var Agent_DestDN_Array='';//座席正在服务的客户号码集合的字符串（号码之间用”；”隔开）；
var Agent_CalledDN_Array='';//座席正在服务的客户拨的被叫号码集合的字符串（号码之间用”；”隔开）；
var Agent_Acd_Array="";//座席队列
/*******************话务参数列表end*************************/


/*******************初始化话务参数beg*************************/
//设置座席初始化参数
function setInitParam(){
	agent_server_link=$ge("hiddenServerLink");
	agent_cur_dn=$ge("txtAgentDn");
	agent_cur_id=$ge("txtAgentId");
	agent_acd=$ge("hiddenAgentAcd");
}
/*******************初始化话务参数end*************************/

/*******************话务方法列表beg*************************/

//启动连接
function start()
{	
	//初始化参数
	setInitParam();
	var cur_dn="";
	if(agent_cur_dn==null || agent_cur_dn==""){		
		toast("分机号码不存在！");  
		return;
	}else if(agent_cur_dn.length==4){
		cur_dn=agent_cur_dn;
	}else{
		cur_dn="9"+agent_cur_dn;
	}
	UMO.exit(function(cmd, result){
	    UMO.start(agent_server_link, "", EvtHandler, "0", "",agent_cur_id, "", cur_dn, function(cmd, result){
	        if (result.errno == 0)
	        {
	        	setDebugInfo("连接CTI服务器成功！,连接地址："+agent_server_link+" 工号："+agent_cur_id+",分机号："+cur_dn);
	        	//设置CTI服务器连接状态
	        	agent_cti_status=true; 
	        	//登出座席	        	 	
	        	UMO.logout(agent_cur_id, function(cmd, result){
        			login();
				}, null)    
	        }else{
	        	setDebugInfo("连接CTI服务器失败！,连接地址："+agent_server_link+" 工号："+agent_cur_id+",分机号："+cur_dn+",错误码："+result.errno+",错误原因："+result.errmsg);
	        	toast("连接CTI服务器失败,请检查网络连接！,连接地址："+agent_server_link+" 工号："+agent_cur_id+",话机号："+cur_dn+",错误码："+result.errno+",错误原因："+result.errms);
	        }
	    }, null);
	}, null);
}

//退出
function exit()
{
    UMO.exit(function(cmd, result){
        if (result.errno == 0)
        {
        	//设置CTI服务器连接状态
        	agent_cti_status=false;   
        	setDebugInfo("退出CTI服务器连接成功！");     	  
        }else{
        	//alert("连接CTI服务器失败，请检查网络连接！");
        	setDebugInfo("退出CTI服务器连接失败！"); 
        }
	}, null)
}

//签入
function login()
{
	var ismonitor=false;
	if(agent_ismonitor=="1"){
		ismonitor=true;
	}
    UMO.login(agent_cur_id, agent_acd, -1, false, false, function(cmd, result){
        if (result.errno == 0)
        { 
        	//设置签入标志
        	agent_login_status=true; 
        	setDebugInfo("签入座席成功！agent_cur_id："+agent_cur_id+",ACD:"+agent_acd);
        	//设置图标状态
        	setCurrAgentImg();        	  
        }else{
        	toast("座席签入失败！错误码："+result.errno+",错误原因："+result.errmsg);
        	setDebugInfo("座席签入失败！agent_cur_id："+agent_cur_id+",ACD:"+agent_acd+",错误码："+result.errno+",错误原因："+result.errmsg);    
        }
	}, null);
}

//签出
function agLogout()
{
	if(agent_login_status==false){
		if(agent_cti_status==true){
			exit();
		}else{
			return;
		}
	}
    UMO.logout(agent_cur_id, function(cmd, result){
        if (result.errno == 0)
        { 
        	//设置签出状态
        	agent_login_status=false;
        	setDebugInfo("签出座席成功！");  
        	setCurrAgentImg();	        	
        }else{        	
        	toast("座席签出失败！错误码："+result.errno+",错误原因："+result.errmsg);
        	setDebugInfo("签出座席失败！错误码："+result.errno+",错误原因："+result.errmsg);  
        }
        exit();
	}, null);
    
    return false;
}

//摘机
function offhook()
{
    UMO.offhook(function(cmd, result){
        if (result.errno == 0)
        { 
        	//设置话机状态
        	agent_cur_hook=2;
        	setDebugInfo("设置座席摘机成功！");      	  
        }else{
        	toast("座席摘机失败！错误码："+result.errno+",错误原因："+result.errmsg);
        	setDebugInfo("设置座席摘机失败！错误码："+result.errno+",错误原因："+result.errmsg); 
        }
	}, null);
}

//挂机
function onhook()
{
    UMO.onhook(function(cmd, result){
        if (result.errno == 0)
        { 
        	//设置话机状态
        	agent_cur_hook=1;  
        	setDebugInfo("设置座席挂机成功！");          	  
        }else{
        	toast("座席挂机失败！错误码："+result.errno+",错误原因："+result.errmsg);
        	setDebugInfo("设置座席挂机失败！错误码："+result.errno+",错误原因："+result.errmsg);   
        }
	}, null)
}

//示闲
function setidle()
{
    UMO.setidle(function(cmd, result){
        if (result.errno == 0)
        { 
        	//设置座席状态
        	agent_cur_status=2;
        	if(agent_busy_type==2){
				madeClearInterval();
			}
			agent_busy_type=0;
			agent_cur_made_time=0;
        	setDebugInfo("设置座席示闲成功！");          	  
        }else{
        	toast("座席示闲失败！错误码："+result.errno+",错误原因："+result.errmsg);
        	setDebugInfo("座席示闲失败！错误码："+result.errno+",错误原因："+result.errmsg);  
        }
	}, null)
}

//示忙
function setbusy()
{
    UMO.setbusy(function(cmd, result){
        if (result.errno == 0)
        { 
        	//设置座席状态        	
        	agent_cur_status=3; 
        	setDebugInfo("设置座席示忙成功！");        	  
        }else{
        	toast("座席示忙失败！错误码："+result.errno+",错误原因："+result.errmsg);
        	setDebugInfo("座席示忙失败！错误码："+result.errno+",错误原因："+result.errmsg);  
        }
	}, null)
}

//呼叫(calleddn： 呼叫号码  calledtype:呼叫类型0:外呼1:内呼 )
function dialout(calledtype,calleddn)
{
	var uud = "";	
	var called_tel="";
	if(agent_cur_hook!=2){
		//toast("座席未摘机");
	}
	if(calledtype==0){
		called_tel="9"+calleddn;
	}else{
		called_tel=calleddn;
	}
    UMO.dialout(called_tel, agent_trunkid, uud, true, function(cmd, result){
        if (result.errno == 0)
        {       	
        	//呼入成功设置呼叫方向
        	agent_call_type=0;
        	//设置当前座席呼叫号码
        	agent_cur_tel=calleddn; 
        	setDebugInfo("座席外呼成功！外呼号码:,"+called_tel);     	  
        }else{
        	toast("座席外呼失败！错误码："+result.errno+",错误原因："+result.errmsg);
        	setDebugInfo("座席外呼失败！外呼号码:"+called_tel+" ,错误码："+result.errno+",错误原因："+result.errmsg);    
        }
	}, null)
}

//保持
function hold()
{
    UMO.hold(function(cmd, result){
        if (result.errno == 0)
        {    
        	agent_hold=1;  
        	changeHoldOrRetr(1); 	
			setDebugInfo("保持通话成功！");     
        }else{
        	toast("座席保持通话失败,请检查座席是否处于通话状态！错误码："+result.errno+",错误原因："+result.errmsg);
        	agent_hold=0;
			setDebugInfo("保持通话失败！,错误码："+result.errno+",错误原因："+result.errmsg);     
        }
	}, null)
}

//恢复
function retrieve()
{
    UMO.retrieve(function(cmd, result){
        if (result.errno == 0)
        {  
        	if(agent_hold==1){
        		agent_hold=0;  
        		changeHoldOrRetr(0); 
        	}   
        	setDebugInfo("座席恢复通话成功！");      	  
        }else{        	
        	toast("座席恢复通话失败,请检查是否已挂机！错误码："+result.errno+",错误原因："+result.errmsg);
        	setDebugInfo("座席恢复通话失败！错误码："+result.errno+",错误原因："+result.errmsg);      
        }
	}, null)
}

//初始转移(calledtype:呼叫类型0:外呼1:内呼)
function inittrans(calledtype,calleddn)
{
    var uud = "";
    var called_tel="";
    if(agent_cur_hook!=2){
		//toast("座席未摘机");
	}
	if(calledtype==0){
		called_tel="9"+calleddn;
	}else{
		called_tel=calleddn;
	}
    UMO.inittrans(called_tel, uud, true, function(cmd, result){
        if (result.errno == 0)
        { 
        	setDebugInfo("初始转移成功！转移号码："+calleddn);   
        	agent_hold=2;
			document.getElementById("btnTran").innerText="完成转移";    	  
        }else{
        	agent_hold=0; 
        	retrieve();
        	toast("座席初始转移失败,已恢复原有通话！错误码："+result.errno+",错误原因："+result.errmsg);   
        	setDebugInfo("初始转移成功！转移号码："+calleddn+",错误码："+result.errno+",错误原因："+result.errmsg);       	
        }
	}, null)
}

//完成转移
function comptrans()
{
    UMO.comptrans(function(cmd, result){
        if (result.errno == 0)
        {   
        	toast("完成转移成功！");	  
        	setDebugInfo("完成转移成功！");  	  
        }else{
        	agent_hold=0; 
        	retrieve();
        	toast("座席完成转移失败,已恢复原有通话！错误码："+result.errno+",错误原因："+result.errmsg);
        	setDebugInfo("座席完成转移失败！错误码："+result.errno+",错误原因："+result.errmsg);  
        }
        agent_hold=0; 
        document.getElementById("btnTran").innerText="初始转移"; 
	}, null)
}

//初始会议(calledtype:呼叫类型0:外呼1:内呼)
function initconf(calledtype,calleddn)
{
    var uud = "";
    var called_tel="";
    if(agent_cur_hook!=2){
		//toast("座席未在通话中!");
	}
	if(calledtype==0){
		called_tel="9"+calleddn;
	}else{
		called_tel=calleddn;
	}
    UMO.initconf(called_tel, uud, true, function(cmd, result){
        if (result.errno == 0)
        { 
        	setDebugInfo("初始会议成功！会议号码："+calleddn); 
        	agent_hold=3;
        	document.getElementById("btnConf").innerText="完成会议";  
        }else{
        	agent_hold=0;        	 
        	retrieve();
        	toast("座席初始会议失败,已恢复原有通话！错误码："+result.errno+",错误原因："+result.errmsg);  
        	setDebugInfo("初始完成会议失败！会议号码："+calleddn+"错误码："+result.errno+",错误原因："+result.errmsg);        	
        }
	}, null)
}

//完成会议
function compconf()
{
    UMO.compconf(function(cmd, result){
        if (result.errno == 0)
        {
        	toast("完成会议成功！")    
        	setDebugInfo("完成会议成功！");  		  
        }else{        	 
        	retrieve();
        	toast("座席完成会议失败,已恢复原有通话！错误码："+result.errno+",错误原因："+result.errmsg);    
        	setDebugInfo("座席完成会议失败！错误码："+result.errno+",错误原因："+result.errmsg);      	
        }
        agent_hold=0; 
    	document.getElementById("btnConf").innerText="初始会议"; 
	}, null)
}

//放音
function play(filename)
{
    var tts = "";
    var async = true;
    var loop = true;
    
    UMO.play(filename, tts, async, loop, function(cmd, result){
        if (result.errno == 0)
        {
            //任务ID
            agent_task_id = result.taskid;
            setDebugInfo("放音成功！话音文件："+filename);  
        }else{
        	toast("座席放音失败！错误码："+result.errno+",错误原因："+result.errmsg);   
        	setDebugInfo("放音失败！话音文件："+filename+",错误码："+result.errno+",错误原因："+result.errmsg);     	
        }
    }, null)
}

//停止操作(type:1放音 2录音 3外呼)
function stopop(taskid, type)
{
    UMO.stopop(taskid, type, function(cmd, result){
        if (result.errno == 0)
        {
        	setDebugInfo("停止成功!");  
        }else{
        	toast("停止失败！错误码："+result.errno+",错误原因："+result.errmsg);   
        	setDebugInfo("停止失败！错误码："+result.errno+",错误原因："+result.errmsg);       	
        }
    }, null)
}

//获取话单ID
function getcallid()
{
    UMO.getcdrid(function(cmd, result){
        if (result.errno == 0)
        {
        	agent_call_id=result.cdrid;
            agent_cdr_id=result.cdrid;
            if(agent_hold!=2 && agent_hold!=3){
            	loadScreenPopUP(agent_call_id); 
            }
            setDebugInfo("获取话单ID成功!话单ID:"+agent_cdr_id);  
        }else{
        	//alert("获取话单ID失败！错误码："+result.errno+",错误原因："+result.errmsg);  
        	setDebugInfo("获取话单ID成功!错误码："+result.errno+",错误原因："+result.errmsg);  
        }
    }, null)
}

//话务员列表
function agentlist()
{
    UMO.agentlist(agent_acd, function(cmd, result){
        if (result.errno == 0)
        {
        	Agent_ID_Array="";
			Agent_Status_Array="";
			Agent_DN_Array="";
			Agent_DestDN_Array="";
			Agent_CalledDN_Array="";
			Agent_Acd_Array="";
            var msg = "";
            for (var i=0;i<result.agentlist.length;i++)
            {
                var ai = result.agentlist[i];
                if(i==result.agentlist.length-1){
                	Agent_ID_Array+=ai.agentID;
               	 	Agent_Status_Array+=ai.agentStatus;
                	Agent_DN_Array+=ai.agentDN;
                	Agent_DestDN_Array+=ai.agentDestDN;
                	Agent_CalledDN_Array+=ai.agentCalledDN;
                	Agent_Acd_Array+=ai.acdDNs;
                }else{
                	Agent_ID_Array+=ai.agentID+";";
               		Agent_Status_Array+=ai.agentStatus+";";
               	 	Agent_DN_Array+=ai.agentDN+";";
                	Agent_DestDN_Array+=ai.agentDestDN+";";
                	Agent_CalledDN_Array+=ai.agentCalledDN+";";
                	Agent_Acd_Array+=ai.acdDNs+";";
                }
            }
            loadLoginAgent();
            setDebugInfo("获取话务员列表成功!Agent_ID_Array:"+Agent_ID_Array+",Agent_Status_Array:"+Agent_Status_Array+",Agent_DN_Array:"+Agent_DN_Array+",Agent_DestDN_Array:"+Agent_DestDN_Array+",Agent_CalledDN_Array:"+Agent_CalledDN_Array);
        }else{
        	setDebugInfo("获取话务员列表失败!")
        }
    }, null);
}

/*******************话务方法列表*************************/

/*******************话务事件列表*************************/
//事件处理
var EvtHandler =
{
    onReadyState: function(status)
    {
        setDebugInfo("onReadyState: " + status);   
    },
    onCallincome: function(ano, bno, uud)
    {
        setDebugInfo("来话事件(onCallincome): ano=" + ano + " bno=" + bno + " uud=" + uud);     
        setScreenPopUp(ano,bno,uud);
    },
    onTalked: function(ano, bno, uud)
    {
        setDebugInfo("座度通话通知事件(onTalked): ano=" + ano + " bno=" + bno + " uud=" + uud);        
        
        //汉威自定义-标识当前有真实通话
        $("#agent_phoneOnline").val("1");
        
//        if(agent_call_type==0){
//        	//设置呼叫号码 
//        	agent_cur_tel=bno;
//        	//设置当前呼叫的号码显示
//        	$geo("labAgentTel").innerText=bno;
//        }
        
        if(agent_call_type==0){
        	//设置当前呼叫的号码显示
        	$geo("labAgentTel").innerText=agent_cur_tel;
        }
        
        //如果是外呼,则拔号盘改变外呼状态
		if(agent_call_type==0){
			//状态设置(正在通话)
	        changeAgentCall(2);
		}
        //设置座席状态为整理态(座席挂机之后自动进入整理态)
        agent_busy_type=2;
        
        //判断通话计时器在转移和会议时不再进行启动
        if(agent_hold!=2 && agent_hold!=3){
        	//通话计时
            agent_talk_time=0;
        	//启动计时器   
            talkSetInterval();  
        }
        
        //通话计时
//        agent_talk_time=0;
        //启动计时器   
//        talkSetInterval();    
        //调用callid
        getcallid();
    },
    onRingStoped: function()
    {
        setDebugInfo("振铃停止事件(onRingStoped)")
        changeRingStatus(false);
    },
    onHookChanged: function(status)
    {
        setDebugInfo("话机状态改变事件(onHookChanged): status=" + status)
        agent_cur_hook=status;
        changeHookStatus(status);
    },
    onAgentChanged: function(status)
    {
        setDebugInfo("座席状态改变事件(onAgentChanged): status=" + status)
        agent_cur_status=status;
        changeAgentStatus(status);
    },
    onAsyncFinished: function(atype, taskid, ret, desc)
    {
        setDebugInfo("onAsyncFinished: atype=" + atype + " taskid=" + taskid + " ret=" + ret + " desc=" + desc);
    },
    onAllBusy: function(status, acd, quelen)
    {
        setDebugInfo("onAllBusy: status=" + status + " acd=" + acd + " quelen=" + quelen);
    },
    onQuelen: function(acd, quelen)
    {
        setDebugInfo("onQuelen: acd=" + acd + " quelen=" + quelen);
    },
    onSmsincome: function(dtime, from, content, slot)
    {
        setDebugInfo("onSmsincome: dtime=" + dtime + " from=" + from+ " content=" + content + " slot=" + slot);
    },
    onOperCallback: function(flowid, callid, direction, teleno, time, state)
    {
        setDebugInfo("onOperCallback: : flowid=" + flowid + " callid=" + callid + " direction=" + direction + " teleno=" + teleno  + " time=" + time  + " state=" + state)
    },
    onSpeedCallback: function(flowid, callid, direction, teleno, time, state, desc)
    {
        setDebugInfo("onSpeedCallback: flowid=" + flowid + " callid=" + callid + " direction=" + direction + " teleno=" + teleno  + " time=" + time  + " state=" + state  + " desc=" + desc );
    }
}
/*******************话务事件列表*************************/

/*******************自定义方法列表beg*************************/
//设置登陆座席
function setCurrAgentImg(){
	if(agent_login_status==true){		
		$geo("txtAgentLogin").innerText="签出";
		
		$(".yjzsTabs").addClass("active");
		$geo("imgHookStatus").src= BASE_URL + "/images/theme/blue/main/icon_zhaiji_0.png";
		$geo("imgAgentRest").src=BASE_URL + "/images/theme/blue/main/icon_xiaoxiu_0.png";
		$geo("imgAgentStatus").src=BASE_URL + "/images/theme/blue/main/icon_shimang_0.png";
		$geo("imgAgentCallIn").src=BASE_URL + "/images/theme/blue/main/icon_neihu_0.png";
		$geo("imgAgentCallIOut").src=BASE_URL + "/images/theme/blue/main/icon_waihu_0.png";
		$geo("imgAgentConf").src=BASE_URL + "/images/theme/blue/main/icon_huiyi_0.png";
		$geo("imgAgentHold").src=BASE_URL + "/images/theme/blue/main/icon_baochi_0.png";
		$geo("imgAgentTran").src=BASE_URL + "/images/theme/blue/main/icon_zhuanyi_0.png";
		$geo("imgAgentLogin").src=BASE_URL + "/images/theme/blue/main/icon_qianru_1.png";
	}else{
		$geo("span_call_status").innerText="----";
		$geo("txtAgentLogin").innerText="签入";
		
		$(".yjzsTabs").removeClass("active");
		$geo("imgHookStatus").src=BASE_URL + "/images/theme/blue/main/icon_zhaiji_1.png";
		$geo("imgAgentRest").src=BASE_URL + "/images/theme/blue/main/icon_xiaoxiu_1.png";
		$geo("imgAgentStatus").src=BASE_URL + "/images/theme/blue/main/icon_shimang_1.png";
		$geo("imgAgentCallIn").src=BASE_URL + "/images/theme/blue/main/icon_neihu_1.png";
		$geo("imgAgentCallIOut").src=BASE_URL + "/images/theme/blue/main/icon_waihu_1.png";
		$geo("imgAgentConf").src=BASE_URL + "/images/theme/blue/main/icon_huiyi_1.png";
		$geo("imgAgentHold").src=BASE_URL + "/images/theme/blue/main/icon_baochi_1.png";
		$geo("imgAgentTran").src=BASE_URL + "/images/theme/blue/main/icon_zhuanyi_1.png";
		$geo("imgAgentLogin").src=BASE_URL + "/images/theme/blue/main/icon_qianru_0.png";
	}
	
	return false;
}

//改变座席状态图标设置 
function changeAgentStatus(AgentStatus){
	if(AgentStatus==2){//空闲 
		$geo("txtAgentStatus").innerText="示忙";
		$geo("imgAgentStatus").src=BASE_URL + "/images/theme/blue/main/icon_shimang_0.png";
		$geo("span_call_status").innerText="空闲";
	}else if(AgentStatus==3){//离开		
		$geo("txtAgentStatus").innerText="示闲";
		$geo("imgAgentStatus").src=BASE_URL + "/images/theme/blue/main/icon_shixian_0.png";
		if(agent_busy_type==1){//小休
			$geo("span_call_status").innerText="小休";
		}else if(agent_busy_type==2){//整理
			$geo("span_call_status").innerText="整理";
			agent_cur_made_time=agent_made_time;
			$geo("span_call_num").innerText=formatSecToHms(agent_cur_made_time);
			setTimeout("madeSetInterval()",1000);
		}else{//离开
			$geo("span_call_status").innerText="离开";
		}
	}else if(AgentStatus==4){//工作
		$geo("txtAgentStatus").innerText="工作";
//		$geo("imgAgentStatus").src=BASE_URL + "/images/module/hcallapi/icon_3-2.png";
		$geo("span_call_status").innerText="工作";
	}
}

//改变话机状态图标设置
function changeHookStatus(HookStatus){
	//1挂机，2摘机,3客户挂机
	if (HookStatus == 1) //挂机
	{
		//如果是外呼,则拔号盘改变外呼状态
		if(agent_call_type==0){
			//状态设置(正在通话)
	        changeAgentCall(0);
		}
		//停止计时器			
		clearTimeout(agent_talk_time_clear);
		//设置整理态
		if(agent_busy_type==2 && agent_cur_made_time==0){
			setbusy();
		}
		$geo("imgHookStatus").src = BASE_URL + "/images/theme/blue/main/icon_zhaiji_0.png";
		$geo("txtHookstatus").innerText="摘机";
//		$geo("imgCallOutStatus").src = BASE_URL + "/images/module/hcallapi/callout_no.gif";
		if(agent_hold==1){
			agent_hold=0;
//			$geo("imgAgentHold").src = BASE_URL + "/images/module/hcallapi/icon_6.png";
			$geo("txtAgentHold").innerText="保持";			
		}else if(agent_hold==2){
			agent_hold=0;
			$geo("btnTran").innerText="初始转移";
		}else if(agent_hold==3){
			agent_hold=0;
			$geo("btnConf").innerText="初始会议";
		}
		
		//汉威自定义-标识当前有真实通话
        $("#agent_phoneOnline").val("0");
		
	}else if(HookStatus == 2)//摘机
	{		
		$geo("imgHookStatus").src = BASE_URL + "/images/theme/blue/main/icon_guaji_0.png";
		$geo("txtHookstatus").innerText="挂机";		
	}else if(HookStatus == 3)//客户挂机
	{
		//如果是外呼,则拔号盘改变外呼状态
		if(agent_call_type==0){
			//状态设置(正在通话)
	        changeAgentCall(0);
		}
		//停止计时器			
		clearTimeout(agent_talk_time_clear);
		//设置整理态
		if(agent_busy_type==2 && agent_cur_made_time==0){
			setbusy();
		}
//		$geo("imgCallOutStatus").src = BASE_URL + "/images/module/hcallapi/callout_no.gif";
		if(agent_hold==2){
			agent_hold=0;
			$geo("btnTran").innerText="初始转移";
			setTimeout("retrieve()", 500);
		}else if(agent_hold==3){
			agent_hold=0;
			$geo("btnConf").innerText="初始会议";
			setTimeout("retrieve()", 500);
		}
		
		//汉威自定义-标识当前有真实通话
		$("#agent_phoneOnline").val("0");
        
	}else if(HookStatus == 4){//座席听忙音
		if(agent_hold==1){
			agent_hold=0;
//			$geo("imgAgentHold").src = BASE_URL + "/images/module/hcallapi/icon_6.png";
			$geo("txtAgentHold").innerText="保持";			
		}else if(agent_hold==2){			
			agent_hold=0;
			$geo("btnTran").innerText="初始转移";
			retrieve();
			toast("初始转移失败,系统自动恢复通话!")
		}else if(agent_hold==3){
			agent_hold=0;
			$geo("btnConf").innerText="初始会议";
			retrieve();
			toast("初始会议失败,系统自动恢复通话!")
		}
	}	
}

//改变座席振铃/停止图标设置 
function changeRingStatus(ring_status){
	if(ring_status==true){	
		$geo("imgHookStatus").src = BASE_URL + "/images/theme/blue/main/icon_xiangling_0.png";
	}else{
		$geo("imgHookStatus").src = BASE_URL + "/images/theme/blue/main/icon_zhaiji_0.png";
	}
}

//座席呼叫情况(0:未呼叫/挂机1:正在呼叫2正在通话)
function changeAgentCall(call_status){
	if(call_status==0){
//		$geo("imgCallOutStatus").src = BASE_URL + "/images/module/hcallapi/callout_no.gif";
	}else if(call_status==1){
//		$geo("imgCallOutStatus").src = BASE_URL + "/images/module/hcallapi/callout_ing.gif";
	}else if(call_status==2){
//		$geo("imgCallOutStatus").src = BASE_URL + "/images/module/hcallapi/callout_talk.gif";
	}
}

//保持/恢复(0恢复1保持)
function changeHoldOrRetr(AgentHold){
	if(AgentHold==1){//保 持
		$geo("imgAgentHold").src = BASE_URL + "/images/theme/blue/main/icon_huifu_0.png";
		$geo("txtAgentHold").innerText="恢复";
	}else{//恢复
		$geo("imgAgentHold").src = BASE_URL + "/images/theme/blue/main/icon_baochi_0.png";
		$geo("txtAgentHold").innerText="保持";
	}
}

//设置号码并调用来电弹屏
function setScreenPopUp(ano,bno,uud){
	//座席响铃
	changeRingStatus(true);
	
	//设置呼叫号码 
	agent_cur_tel = ano;
	agent_cur_bno = bno; 
	agent_cur_uud = uud;
	
	//初始化来电号码
	$geo("labAgentTel").innerHTML = ano;
	
	if (bno != agent_cur_dn){
		agent_call_type = 1;
		
	} else if (4 == ano.toString().length &&
		  4 == bno.toString().length) {
		
		agent_call_type = 0;
	} else {
		//如果是外呼,则拔号盘改变外呼状态
		if (agent_call_type == 0) {
			
			//状态设置(正在呼叫)
			changeAgentCall(1);
		}
	}
}

//来电弹   uud:IDE传入数据项
function loadScreenPopUP(callid){
	
	//当外线向内呼时弹屏
	if (1 == agent_call_type &&
		2 != agent_hold && 
		3 != agent_hold) {
		parent.openWin(BASE_URL + "/views/module/ems/emscallalarm/emscallalarmAdd.html?policeofficerseat=" + agent_cur_bno + 
				"&alarmphone=" + agent_cur_tel + "&callid=" + callid,
				"来电弹屏", "70%", "55%");
	}
	//var val=-1;
	//var openUrl;
	//openUrl=$ge("hiddenBasePath")+"customer/cm/customer_detail.jsp?TYPE=2&CUST_ID="+val+"&TEL="+agent_cur_tel;
	//window.open(openUrl,'newwindow'+val,'left=50,top=40,width='+ (screen.availWidth-100) +',height='+ (screen.availHeight-80));
//	alert("来电弹屏：\n\r主叫号码："+agent_cur_tel+"\n\r被叫号码："+agent_cur_bno+"\n\r通话编号："+callid);
}

//设置通话计时器
function talkSetInterval(){
  agent_talk_time++;	
  var val=formatSecToHms(agent_talk_time);
  $geo("span_call_num").innerText=val;
  agent_talk_time_clear=setTimeout("talkSetInterval()",1000);
}
  
//停止通话计时器
function talkClearInterval(){
  clearTimeout(agent_talk_time_clear);
}

//设置整理计时器
function madeSetInterval(){
  agent_cur_made_time--;	
  var val=formatSecToHms(agent_cur_made_time);
  $geo("span_call_num").innerText=val;
  if(agent_cur_made_time==0){    	
  	setidle();
  }else{
  	agent_made_time_clear=setTimeout("madeSetInterval()",1000);
  }
}

//停止整理计时器
function madeClearInterval(){
  clearTimeout(agent_made_time_clear);
}

//写日志
function setDebugInfo(write_log){
	console.log(write_log);
	//toast(write_log)
}

/*******************自定义方法列表end*************************/
//卸载时自动停止
UMO._addEvent(window, 'beforeunload', agLogout, false);