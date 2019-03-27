/********话务操作 OpenAPI 硬交换**********/
var reset_flag=0;//小休标志

//显示窗口
function  openCallOutWin(){
	document.all.ly.style.display="block";   
	document.all.ly.style.width=document.body.clientWidth;   
	document.all.ly.style.height=document.body.clientHeight;   
	document.all.Layer2.style.display='block';
	//判断是否是小休窗口
	if(reset_flag==1){		
		document.all.bohao.style.display='none';
		document.all.status_change.style.display='none';
		document.all.rest.style.display='block';
	}else{
		$geo("keyword").value="";
		document.all.bohao.style.display='block';
		document.all.status_change.style.display='block';
		document.all.rest.style.display='none';
	}	
	
	$("#ly").css({"width": "100%", "height": "100%",
				  "z-index": "1999", 
				  "background-color": "#000",
				  "opacity": "0.3"});
	$("#Layer2").css("z-index", "2000");
} 

//隐藏窗口
function  closeCallOutWin(theForm){  
	//判断是否是小休窗口
	if(reset_flag==1){
		resetStop();
	}
	document.all.bohao.style.display='none';
	document.all.status_change.style.display='none';
	document.all.rest.style.display='none';
	document.all.ly.style.display='none';
  	document.all.Layer2.style.display='none';
  	return false;   
}  

//将号号码放入拔号盘文本框中
function setCallNum(val){
	$geo("keyword").value=val;
}

//按键处理
function keyUpProc(num){
	var key_info=$geo("keyword").value;
	key_info=key_info+num;
	$geo("keyword").value=key_info;
}

//按钮显示	divCallIn,divCallOut,divTran,divConf
//0:内呼;1:外呼;2:转移;3:会议
function butDisplay(type){	
	//设置按钮显示
	if(type==0){//内呼		
		$geo("divCallIn").style.display="block";
		$geo("divCallOut").style.display="none";
		$geo("divTran").style.display="none";
		$geo("divConf").style.display="none";
	}else if(type==1){//外呼
		$geo("divCallIn").style.display="none";
		$geo("divCallOut").style.display="block";
		$geo("divTran").style.display="none";
		$geo("divConf").style.display="none";
	}else if(type==2){//转移
		$geo("divCallIn").style.display="none";
		$geo("divCallOut").style.display="none";
		$geo("divTran").style.display="block";
		$geo("divConf").style.display="none";
	}else if(type==3){//会议
		$geo("divCallIn").style.display="none";
		$geo("divCallOut").style.display="none";
		$geo("divTran").style.display="none";
		$geo("divConf").style.display="block";
	}
}	

//0:内呼 1:外呼 2:转移 3:会议
//按钮执行的方法
function dailTelCallClick(type){
	var val=document.getElementById("keyword").value;
	
	if(type==0){
//		var curCallStat = $("#span_call_status").text();
//		if ("空闲" != curCallStat && "工作" != curCallStat) {
//			toast("当前话机状态不为空闲，请稍后重试！");
//			return;
//		}
		
		//汉威判断通话状态
		var curCallStat = $("#span_call_status").text();
		if (!("空闲" == curCallStat || 
			("工作" == curCallStat && 
			"0" == $("#agent_phoneOnline").val())
			))
		{
			toast("当前话机状态不为空闲状态，请稍后重试！");
			return;
		}
		
		if(val==null || val==""){
			toast("内线座席号码不允许为空，请输入！");
			return;
		}else if(valid_number(val,0)==false){
			toast("内线座席号码错误：包含非法字符！");
			return;
		}else if(val.length>4){
			toast("内线座席号码长度错误！");
			return;
		}
		dialout(1,val);			
	}else if(type==1){
//		var curCallStat = $("#span_call_status").text();
//		if ("空闲" != curCallStat && "工作" != curCallStat) {
//			toast("当前话机状态不为空闲，请稍后重试！");
//			return;
//		}
		
		//汉威判断通话状态
		var curCallStat = $("#span_call_status").text();
		if (!("空闲" == curCallStat || 
			("工作" == curCallStat && 
			 "0" == $("#agent_phoneOnline").val())
			))
		{
			toast("当前话机状态不为空闲状态，请稍后重试！");
			return;
		}
		
		if(val==null || val==""){
			toast("外呼号码不允许为空，请输入！");
			return;
		}else if(valid_number(val,0)==false){
			toast("外呼号码错误：包含非法字符！");
			return;
		}else if(val.length>12){
			toast("外呼号码长度错误！");
			return;
		}
		dialout(0,val);
	}else if(type==2){
		//汉威判断通话状态
		if ("1" != $("#agent_phoneOnline").val()) {
			toast("当前话机状态不为工作状态，请稍后重试！");
			return;
		}
		
		if(val==null || val==""){
			toast("转移号码不允许为空，请输入！");
			return;
		}else if(valid_number(val,0)==false){
			toast("转移号码错误：包含非法字符！");
			return;
		}else if(val.length>12){
			toast("转移号码长度错误！");
			return;
		}
		//判断有没有发生初始转移
		if(agent_hold==0){
			if(val.length<=4){
				inittrans(1,val);
			}else{
				inittrans(0,val);
			}
		}else if(agent_hold==2){
			comptrans();
		}
	}else if(type==3){
		//汉威判断通话状态
		if ("1" != $("#agent_phoneOnline").val()) {
			toast("当前话机状态不为工作状态，请稍后重试！");
			return;
		}
		
		if(val==null || val==""){
			toast("会议号码不允许为空，请输入！");
			return;
		}else if(valid_number(val,0)==false){
			toast("会议号码错误：包含非法字符！");
			return;
		}else if(val.length>12){
			toast("会议号码长度错误！");
			return;
		}
		//判断有没有发生初始转移
		if(agent_hold==0){
			if(val.length<=4){
				initconf(1,val);
			}else{
				initconf(0,val);
			}
		}else if(agent_hold==3){
			compconf();
		}
	}
}

///////////////////////////座席签入签出/////////////////////////////
function agentLogInOut(){
	if(agent_login_status == true){
		var curCallStat = $("#span_call_status").text();
		if ("整理" == curCallStat) {
			toast("通话正在整理中，请稍后签出!");
			return;
		}
		if ("工作" == curCallStat) {
			toast("通话正在工作中，请稍后签出!");
			return;
		}
		agLogout();
	} else {
		//当当前用户是应急值守用户时，读取配置文件，赋上乐科外呼服务器地址等信息
		$.getJSON(BASE_URL + "/config/outCallInfo.json",function(data) {
			if (data) {
				$("#hiddenServerLink").val(data.serverLink);
				$("#hiddenAgentAcd").val(data.agentAcd);
				
				start();
			}
		});
	}	
}	
///////////////////////////座席签入签出/////////////////////////////

///////////////////////////设置话机状态摘机挂机/////////////////////////////
function setHookStatus(){
	var curCallStat = $("#span_call_status").text();
	if ("----" == curCallStat) {
		toast("请先签入电话机!");
		return;
	}
	
	if ("空闲" != curCallStat && "工作" != curCallStat) {
		toast("当前话机状态为空闲或工作状态方可摘挂机，请稍后重试!");
		return;
	}
	
	if(agent_login_status==true){ 
		if(agent_cur_hook==1){//如果当前状态为挂机，则设置状态为摘机
			offhook();
		}else if(agent_cur_hook==2){//如果当前状态为摘机，则设置状态为挂机
			onhook();
		}
	}
}
///////////////////////////设置话机状态摘机挂机/////////////////////////////

///////////////////////////设置小休停休/////////////////////////////
//小休窗口隐藏事件处理
function resetStop(){
	//小休时间清0
	agent_cur_rest_time=0;
	//设置示忙状态还原
	agent_busy_type=0;
	//设置空闲
	setidle();
	$geo("span_reset_time").innerText=agent_cur_rest_time.toString(); 
	//清除计时
	clearTimeout(agent_rest_time_clear);
	//设置小休标志
	reset_flag=0;
}

//设置小休计时器
function resetSetInterval(){
	agent_cur_rest_time--;
	if(agent_cur_rest_time==0){ 
		rest_window.hide();
	}
	$geo("span_reset_time").innerText=agent_cur_rest_time.toString();  	
	agent_rest_time_clear=setTimeout("resetSetInterval()",1000);
}

//小休
function resetAgent(){
	var curCallStat = $("#span_call_status").text();
	if ("----" == curCallStat) {
		toast("请先签入电话机!");
		return;
	}
	
	if ("空闲" != curCallStat) {
		toast("当前话机未处于空闲状态，请稍后重试!");
	}
	
	if(agent_login_status==true && agent_cur_status==2){
		//初始时间设置
		agent_cur_rest_time=agent_rest_time;	
		//设置当前状态为小休
		agent_busy_type=1;
		//设置小休标志
		reset_flag=1;
		//设置座席状态为离开
		setbusy();
		//打开小休倒计时窗口
		openCallOutWin();
		$geo("spanCallText").innerText="小休倒计时";
		//设置小休初始时间显示
		$geo("span_reset_time").innerText=agent_cur_rest_time.toString();    	
		//启动倒计时
		setTimeout("resetSetInterval()",1000);
	}
}

//停休
function stopResetAgent(){
	//判断是否是停休窗口
	if(reset_flag==1){
		resetStop();
	}
	document.all.bohao.style.display='none';
	document.all.status_change.style.display='none';
	document.all.rest.style.display='none';
	document.all.ly.style.display='none';
  	document.all.Layer2.style.display='none';
}	

///////////////////////////设置小休停休/////////////////////////////

///////////////////////////设置座席状态示忙示闲/////////////////////////////
function setAgentStatus(){
	var curCallStat = $("#span_call_status").text();
	if ("----" == curCallStat) {
		toast("请先签入电话机!");
		return;
	}
	
	if ("空闲" != curCallStat && "离开" != curCallStat) {
		toast("当前话机状态不为空闲或离开状态，请稍后重试！");
		return;
	}
	
	if(agent_login_status==true){ 
		if(agent_cur_status==2){//如果当前状态为空闲，则设置状态为离开
			setbusy();
		}else if(agent_cur_status==3){//如果当前状态为离开，则设置状态为空闲
			setidle();
		}
	}
}
///////////////////////////设置座席状态示忙示闲/////////////////////////////

///////////////////////////座席内呼/////////////////////////////
//主页面打开内呼界面
function dailInTel(){
	//汉威判断通话状态
	var curCallStat = $("#span_call_status").text();
	if ("----" == curCallStat) {
		toast("请先签入电话机!");
		return;
	}
	
	if (!("空闲" == curCallStat || 
		("工作" == curCallStat && 
		"0" == $("#agent_phoneOnline").val())
		))
	{
		toast("当前话机状态不为空闲状态，请稍后重试！");
		return;
	}
	
	if(agent_login_status==true){ 
		$geo("spanCallText").innerText="座席内呼";
		butDisplay(0);	
		openCallOutWin();
	}
}
///////////////////////////座席内呼/////////////////////////////

///////////////////////////座席外呼/////////////////////////////
//主页面打开外呼界面
function dailOutTel(){
//	var curCallStat = $("#span_call_status").text();
//	if ("空闲" != curCallStat && "工作" != curCallStat) {
//		toast("当前话机状态不为空闲或工作状态，请稍后重试！");
//		return;
//	}
	//汉威判断通话状态
	var curCallStat = $("#span_call_status").text();
	if ("----" == curCallStat) {
		toast("请先签入电话机!");
		return;
	}
	
	if (!("空闲" == curCallStat || 
		("工作" == curCallStat && 
		 "0" == $("#agent_phoneOnline").val())
		))
	{
		toast("当前话机状态不为空闲状态，请稍后重试！");
		return;
	}
	
	
	if(agent_login_status==true){ 	
		$geo("spanCallText").innerText="座席外呼";
		butDisplay(1);	
		openCallOutWin();		
	}	
}
///////////////////////////座席外呼/////////////////////////////

///////////////////////////座席保持恢复/////////////////////////////
//保持/恢复通话
function holdTel(){
	//汉威判断通话状态
	var curCallStat = $("#span_call_status").text();
	if ("----" == curCallStat) {
		toast("请先签入电话机!");
		return;
	}
	
	if ("1" != $("#agent_phoneOnline").val()) {
		toast("当前话机状态不为工作状态，请稍后重试！");
		return;
	}
	
	if(agent_hold==0){
		hold();
	}else if(agent_hold==1){
		retrieve(0);
	}
}
///////////////////////////座席保持恢复/////////////////////////////

///////////////////////////座席转移/////////////////////////////
//主页面打开转移界面
function tranTel(){
	//汉威判断通话状态
	var curCallStat = $("#span_call_status").text();
	if ("----" == curCallStat) {
		toast("请先签入电话机!");
		return;
	}
	
	if ("1" != $("#agent_phoneOnline").val()) {
		toast("当前话机状态不为工作状态，请稍后重试！");
		return;
	}
	
	if(agent_login_status==true){
		$geo("spanCallText").innerText="座席转移";
		butDisplay(2);	
		openCallOutWin();	
		if(agent_hold==0){	
			document.getElementById("btnTran").innerText="初始转移";	
		}else if(agent_hold==2){
			document.getElementById("btnTran").innerText="完成转移";	
		}				
	}	
}
///////////////////////////座席转移/////////////////////////////

///////////////////////////座席会议/////////////////////////////
//主页面打开会议界面
function confTel(){
	//汉威加判断话机状态
	var curCallStat = $("#span_call_status").text();
	if ("----" == curCallStat) {
		toast("请先签入电话机!");
		return;
	}
	
	if ("1" != $("#agent_phoneOnline").val()) {
		toast("当前话机状态不为工作状态，请稍后重试！");
		return;
	}
	
	if(agent_login_status==true){ 		
		$geo("spanCallText").innerText="座席会议";
		butDisplay(3);	
		openCallOutWin();
		if(agent_hold==0){	
			document.getElementById("btnConf").innerText="初始会议";	
		}else if(agent_hold==3){
			document.getElementById("btnConf").innerText="完成会议";	
		}				
	}	
}
///////////////////////////座席转移/////////////////////////////
