$(function() {
	//初始化任务类别下拉框
	SelectOption.loadTaskType("tasktype");
	var backlogType = $("#backlogtype").val();
	//只有“工作派遣”类型的待办事项可以进行处理
	if(backlogType!=''&&backlogType!="03"){
		$("#handleBtn").hide();
	}
});

/**
 * 复查任务关联执法登记信息
 */
function selcheckinfo(taskid,taskname,businessinfoid,masterid,slavelid,taskstate){
	var param = {
			"taskid" : taskid,
			"businessinfoid" : businessinfoid,
			"masterid" : masterid,
			"slavelid" : slavelid
		};
	$.ajax({ 
  		url: BASE_URL + "/law/lawcheckinfo/task",
  		type:'post',
  		dataType:'json',
  		data:param,
  		success: function(json){
  			if(json.success==true){
	  			if(json.data == 1){
	  				var handleid = json.msg; //checkinfoid
	  				$('#handleid').val(handleid);
	  				parent.openWin(BASE_URL+"/law/lawdocinfo/handle?docid="+handleid+"&doctype=2&menupagetype=menuEdit&taskid="+taskid+"&taskstate="+taskstate,taskname,'80%','90%');
	  			}else{
	  				/**
	  				 *  选择执法登记信息
	  				 */
	  				parent.openWin(BASE_URL+"/law/lawcheckinfo/lawinfo?businessinfoid="+businessinfoid+
	  						"&masterid="+masterid+"&slavelid="+slavelid+"&taskid="+taskid+"&tasknam="+tasknam+"&taskstate="+taskstate,'执法检查信息','65%','70%');
	  				
	  			}
  			}else{
  				parent.toast(json.msg);
  			}
  		}
	 });
}


/**
 * 关联案件信息
 */
function selcaseinfo(taskid,taskname,businessinfoid,masterid,slavelid,taskstate){
	var param = {
			"taskid" : taskid,
			"businessinfoid" : businessinfoid,
			"masterid" : masterid,
			"slavelid" : slavelid
		};
	$.ajax({ 
  		url: BASE_URL + "/law/lawcase/case",
  		type:'post',
  		dataType:'json',
  		data:param,
  		success: function(json){
  			if(json.success==true){
  				if(json.data == 0){
  					//没有案件相关信息
  					parent.openWin(BASE_URL+"/law/lawdocinfo/handle?docid=null&doctype=1&menupagetype=menuEdit&taskid="+taskid+"&taskstate="+taskstate+"&tasktype="+tasktype,taskname,'80%','90%');

  				}else if(json.data == 1){
	  				var handleid = json.msg;
	  				$('#handleid').val(handleid);
	  				parent.openWin(BASE_URL+"/law/lawdocinfo/handle?docid="+handleid+"&doctype=null&menupagetype=menuEdit&taskid="+taskid+"&taskstate="+taskstate,taskname,'80%','90%');
	  			}else{
	  				/**
	  				 *  选择案件信息
	  				 */
	  				parent.openWin(BASE_URL+"/law/lawcase/caseinfo?businessinfoid="+businessinfoid+
	  						"&masterid="+masterid+"&slavelid="+slavelid+"&taskid="+taskid+"&tasknam="+tasknam+"&taskstate="+taskstate,'案件信息','65%','70%');
	  				
	  			}
  			}else{
  				parent.toast(json.msg);
  			}
  		}
	 });
}



/**
 * 待办事项处理
 */
function handle(taskid,taskname,tasktype,businessinfoid,masterid,slavelid,taskstate,handleid) {
	switch (tasktype) {
	case "01": 
		if(handleid != null && handleid != "" && handleid!="null"){
			parent.openWin(BASE_URL+"/law/lawdocinfo/handle?docid="+handleid+"&doctype=1&menupagetype=menuEdit&taskid="+taskid+"&taskstate="+taskstate+"&tasktype="+tasktype,taskname,'80%','90%');
		}else{
			parent.openWin(BASE_URL+"/law/lawdocinfo/handle?docid=null&doctype=1&menupagetype=menuEdit&taskid="+taskid+"&taskstate="+taskstate+"&tasktype="+tasktype,taskname,'80%','90%');
		}
		break;
	case "02": 
		if(handleid != null && handleid != "" && handleid!="null"){
			parent.openWin(BASE_URL+"/law/lawdocinfo/handle?docid="+handleid+"&doctype=2&menupagetype=menuEdit&taskid="+taskid+"&taskstate="+taskstate,taskname,'80%','90%');
		}else{
			selcheckinfo(taskid,taskname,businessinfoid,masterid,slavelid,taskstate);
		}
		break;
	default :
		if(handleid != null && handleid != "" && handleid!="null"){
			parent.openWin(BASE_URL+"/law/lawdocinfo/handle?docid="+handleid+"&doctype=null&menupagetype=menuEdit&taskid="+taskid+"&taskstate="+taskstate,taskname,'80%','90%');
		}else{
			selcaseinfo(taskid,taskname,businessinfoid,masterid,slavelid,taskstate);
		}
		break;
	}
	

}
