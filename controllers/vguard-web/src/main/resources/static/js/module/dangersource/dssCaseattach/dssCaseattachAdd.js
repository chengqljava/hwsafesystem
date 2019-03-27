$(document).ready(function() {
	/*
	$("#dsscaseattachform").validate({
		rules: {
		},
		messages: {
		},
		submitHandler:function(form){
			save('/dangersource/dssCaseattach/save');
	    }   
	});
	*/
	
	$("#saveBtn").click(function(){
		if(checkFileNameLength()){
			parent.parent.toast("文件名称太长！");
		}else{
			save('/dangersource/dssCaseattach/save');
		}
	});
	
	$("#submitBtn").click(function(){
		if(checkAllNotNullAttach()){
			save('/dangersource/dssCaseattach/submit');
		}else if(checkFileNameLength()){
			parent.parent.toast("文件名称太长！");
		}else{
			parent.parent.toast("必填附件不能为空！");
		}
	});
});

/**
 * 将要删除的附件（数据库中已经保存的附件）
 */
var deleteids = new Array();

/**保存或提交*/
function save(url){
	//获取file的全部id  
    var uplist = $("input[name^=file]");  
	var arrId = [];  
	for (var i=0; i< uplist.length; i++){  
	    if(uplist[i].value){  
	        arrId[i] = uplist[i].id;  
	    }  
    }
	
	$("#deleteids").val(deleteids);
	
	$.ajaxFileUpload({
		type : 'post',
		url : BASE_URL + url,
		secureuri:false,
		files : arrId,
		cache : false,
		dataType : 'json',
		data : $("#dsscaseattachform").serializeArray(),
		global : false,
		success : function(json) {
			if(json.success==true){
				parent.parent.toast(json.msg);//弹出提示信息
				location.reload();
				//parent.$('#ent_dsscaseattach').val("true");
				//parent.loadSafemenutree();
			}else{
				parent.parent.toast(json.msg);
			}
		},
		error : function(data, status, e) {
			parent.parent.toast("保存失败");
		}
	});
	
}

/**
 * 增加一行附件
 * @param fileid
 */
function addAttach(fileid){
	var td = 'td'+fileid;
	var divlen = $("#"+td+" div.zwUpload").length;
	
	var divid = '_'+fileid+'_'+divlen;
	var div = '<div class="zwUpload" id="'+divid+'"></div>';
	var bntdelid = divid+'_bnt';
	var btndel = '<button type="button" id="'+bntdelid+'" onclick="delAttach(\''+divid+'\')">删除</button>';
	$('#'+td).append(div).append(btndel);
	showUploadFile(divid,'file',true);//显示文件上传控件	
	// 给input type添加onchange事件 
	// 当附件为空时，显示提示；反之删除提示
	//$("input[name^=file]").on('change',checkAttach(fileid));
	$("#uploadFile"+divid).on('change',function(){
		// 原附件个数
		var len = $("#td"+fileid+" div a").length;

		//获取file的全部id  
	    var uplist = $("input[id^=uploadFile_"+fileid+"]");  
		var arrId = [];  
		for (var i=0; i< uplist.length; i++){
			if(uplist[i].value.length>50){
//				console.log($("#"+'_'+fileid+'_'+i+"_bnt").next("#errorMsg").length);
				if($("#"+'_'+fileid+'_'+i+"_bnt").next("#fileNameLen"+fileid+"_"+i).length == 0){
					$("#"+'_'+fileid+'_'+i+"_bnt").after("<div id='fileNameLen"+fileid+"_"+i+"'><font color='red'>文件名称太长</font></div>");
				}
			}else{
				if($("#"+'_'+fileid+'_'+i+"_bnt").next("#fileNameLen"+fileid+"_"+i).length != 0){
					$("#"+'_'+fileid+'_'+i+"_bnt").next().remove();
				}
			}
		    if(uplist[i].value){  
		        arrId[i] = uplist[i].id;  
		    }  
	    }
		
		var attachLen = arrId.length;
		if(len==0 && attachLen==0){
			if($("#tips"+fileid).size()<=0){
				$("#td"+fileid).append("<div id='tips"+fileid+"'><font color='red'>文件必填</font></div>");
			}
		}else{
			$("#tips"+fileid).remove();
		}
	});
}

/**
 * 删除附件
 * @param id
 */
function delAttach(id){
	$('#'+id).remove();
	$('#'+id+'_bnt').remove();
}

/**
 * 删除数据库中已经保存的附件
 * @param id
 */
function deleteOldAttach(id,fileid){
	$('#'+id).remove();
	deleteids.push(id);
	if(fileid){
		checkAttach(fileid);
	}
}

/**
 * 获取指定文件的附件数量
 * @param fileid
 * @returns
 */
function getAttachCount(fileid){
	//获取file的全部id  
    var uplist = $("input[id^=uploadFile_"+fileid+"]");  
	var arrId = [];  
	for (var i=0; i< uplist.length; i++){  
	    if(uplist[i].value){  
	        arrId[i] = uplist[i].id;  
	    }  
    }
	return arrId.length;
}

/**
 * 验证必填附件
 */
function checkAttach(fileid){
	// 原附件个数
	var len = $("#td"+fileid+" div a").length;
	if(len==0 && getAttachCount(fileid)==0){
		if($("#tips"+fileid).size()<=0){
			$("#td"+fileid).append("<div id='tips"+fileid+"'><font color='red'>文件必填</font></div>");
		}
	}else{
		$("#tips"+fileid).remove();
	}
}

/**
 * 获取验证提示数量
 */
function getTipsCount(){
    var tipslist = $("div[id^=tips"+"]");  
    if(tipslist){
        return tipslist.length;
    }else{
    	return 0;
    }
}

function checkAllNotNullAttach(){
	checkAttach("01");
	checkAttach("02");
	checkAttach("03");
	checkAttach("04");
	checkAttach("05");
	checkAttach("06");
	checkAttach("07");
	checkAttach("08");
	checkAttach("09");
	checkAttach("10");
	if(getTipsCount()>0){
		return false;
	}
	return true;
}

function checkFileNameLength(){
	var tipslist = $("div[id^=fileNameLen"+"]");  
    if(tipslist){
        if(tipslist.length>0){
        	return true;
        }
    }else{
    	return false;
    }
}

/**
 * 验证必填附件
 * @returns {Boolean}
 */
function checkNotNullAttach(){
	
	// 重大危险源辨识、分级记录
	if($("#td01 div.zwUpload").length==0){
		$("#td01").append("<div id='tips01'><font color='red'>重大危险源辨识、分级记录必填</font></div>");
		parent.parent.toast("重大危险源辨识、分级记录必填");
		return false;
	}
	
	// 重大危险源基本特征表
	if($("#td02 div.zwUpload").length==0){
		$("#td02").append("<div id='tips02'><font color='red'>重大危险源基本特征表</font></div>");
		parent.parent.toast("重大危险源基本特征表");
		return false;
	}
	
	// 化学品安全技术说明书
	if($("#td03 div.zwUpload").length==0){
		$("#td03").append("<div id='tips03'><font color='red'>化学品安全技术说明书</font></div>");
		parent.parent.toast("化学品安全技术说明书");
		return false;
	}
	
	// 区域位置图，平面布置图，工艺流程图和主要设备表
	if($("#td04 div.zwUpload").length==0){
		$("#td04").append("<div id='tips04'><font color='red'>区域位置图，平面布置图，工艺流程图和主要设备表</font></div>");
		parent.parent.toast("区域位置图，平面布置图，工艺流程图和主要设备表");
		return false;
	}
	
	// 安全管理制度安全操作规程清单
	if($("#td05 div.zwUpload").length==0){
		$("#td05").append("<div id='tips05'><font color='red'>安全管理制度安全操作规程清单</font></div>");
		parent.parent.toast("安全管理制度安全操作规程清单");
		return false;
	}
	
	// 安全监测监控系统、措施说明和检测检验结果
	if($("#td06 div.zwUpload").length==0){
		$("#td06").append("<div id='tips06'><font color='red'>安全监测监控系统、措施说明和检测检验结果</font></div>");
		parent.parent.toast("安全监测监控系统、措施说明和检测检验结果");
		return false;
	}
	
	// 事故应急预案，评审意见，演练计划和评估报告
	if($("#td07 div.zwUpload").length==0){
		$("#td07").append("<div id='tips07'><font color='red'>事故应急预案，评审意见，演练计划和评估报告</font></div>");
		parent.parent.toast("事故应急预案，评审意见，演练计划和评估报告");
		return false;
	}
	
	// 安全评价或评估报告
	if($("#td08 div.zwUpload").length==0){
		$("#td08").append("<div id='tips08'><font color='red'>安全评价或评估报告</font></div>");
		parent.parent.toast("安全评价或评估报告");
		return false;
	}
	
	// 重大危险源关键装置，重点部位责任人，责任机构名称
	if($("#td09 div.zwUpload").length==0){
		$("#td09").append("<div id='tips09'><font color='red'>重大危险源关键装置，重点部位责任人，责任机构名称</font></div>");
		parent.parent.toast("重大危险源关键装置，重点部位责任人，责任机构名称");
		return false;
	}
	
	// 重大危险源场所安全警示标志的设置情况
	if($("#td10 div.zwUpload").length==0){
		$("#td10").append("<div id='tips10'><font color='red'>重大危险源场所安全警示标志的设置情况</font></div>");
		parent.parent.toast("重大危险源场所安全警示标志的设置情况");
		return false;
	}	

	return true;
}
