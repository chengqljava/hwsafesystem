$(document).ready(function() {
	
	$("#safemgrprojform").validate({
		rules: {
		},
		messages: {
		},
		submitHandler:function(form){
			if(checkAllNotNullAttach()){
				save();
			}else{
				parent.parent.toast("必填附件不能为空！");
			}
	    }   
	});
	
	
});


/**
 * 检查附件是否超过最大限制
 */
function checkSize(len){
    var maxUploadInfo = '50M';
    var sizeType = {'K': 1024, 'M': 1024 * 1024, 'G': 1024 * 1024 * 1024};
    var unit = maxUploadInfo.replace(/\d+/, '');
    var maxUploadSize = maxUploadInfo.replace(unit,'') * sizeType[unit];
    //var fileSize = $(obj)[0].files[0].size;
    if(len > maxUploadSize){
    	return false;
    }
    return true;
}

/**
 * 将要删除的附件（数据库中已经保存的附件）
 */
var deleteids = new Array();

/**保存*/
function save(){
	//获取file的全部id  
    var uplist = $("input[name^=file]");  
	var arrId = []; 
	var len = 0;
	for (var i=0; i< uplist.length; i++){  
		len += $(uplist[i])[0].files[0].size;
	    if(uplist[i].value){  
	        arrId[i] = uplist[i].id;  
	    }  
    }
	
	if(checkSize(len)){
		
		$("#deleteids").val(deleteids);
		
		if(getTipsCount()==0){
			$.ajaxFileUpload({
				type : 'post',
				url : BASE_URL+'/enterprise/entsafemgrproj/save',
				secureuri:false,
			    files : arrId,
				cache : false,
				dataType : 'json',
				data : $("#safemgrprojform").serializeArray(),
				global : false,
				success : function(json) {
					if(json.success==true){
						parent.parent.toast(json.msg);//弹出提示信息
						parent.frames["contentIframe"].location.reload();
						parent.$('#ent_safemgrproj').val("true");
						parent.loadSafemenutree();
					}else{
						parent.parent.toast(json.msg);
					}
				},
				error : function() {
					parent.parent.toast("保存失败");
				}
			});
		}
	}else{
    	parent.parent.toast(' 文件大小已经超过50M限制，可能不能成功上传！');
	}
	
}

/**
 * 增加一行附件
 * @param fileid
 */
function addAttach(fileid,filetype){
	var td = 'td'+fileid;
	var divlen = $("#"+td+" div.zwUpload").length;
	
	var divid = '_'+fileid+'_'+divlen;
	var div = '<div class="zwUpload" id="'+divid+'"></div>';
	var bntdelid = divid+'_bnt';
	var btndel = '<button type="button" id="'+bntdelid+'" onclick="delAttach(\''+divid+'\')">删除</button>';
	$('#'+td).append(div).append(btndel);
	if(filetype){
		showUploadFile(divid,{maxFileSize:1024,allowedFileExtensions:['doc','docx','jpg','pdf']},true);//显示文件上传控件	
	}else{
		showUploadFile(divid,{maxFileSize:1024,allowedFileExtensions:['doc','docx']},true);//显示文件上传控件
	}	
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
	checkAttach("0101");
	checkAttach("0102");
	checkAttach("0103");
	checkAttach("0201");
	checkAttach("0301");
	checkAttach("0302");
	checkAttach("0401");
	checkAttach("0402");
	checkAttach("0403");
	checkAttach("0501");
	checkAttach("0502");
	checkAttach("0601");
	checkAttach("0602");
	checkAttach("0603");
	checkAttach("0701");
	checkAttach("0801");
	checkAttach("0901");
	checkAttach("0902");
	checkAttach("1001");
	checkAttach("1101");
	if(getTipsCount()>0){
		return false;
	}
	return true;
}


/**
 * 验证必填附件
 * @returns {Boolean}
 */
function checkNotNullAttach(){
	
	// 安全生产责任制文件
	if($("#td0101 div.zwUpload").length==0){
		$("#td0101").append("<div id='tips0101'><font color='red'>安全生产责任制文件必填</font></div>");
		parent.parent.toast("安全生产责任制文件必填");
		return false;
	}
	// 岗位签订安全责任书
	if($("#td0102 div.zwUpload").length==0){
		parent.parent.toast("岗位签订安全责任书必填");
		return false;
	}
	// 责任制考核
	if($("#td0103 div.zwUpload").length==0){
		parent.parent.toast("责任制考核必填");
		return false;
	}
	// 安全生产奖惩制度
	if($("#td0201 div.zwUpload").length==0){
		parent.parent.toast("安全生产奖惩制度必填");
		return false;
	}
	// 安全生产投入保障制度
	if($("#td0301 div.zwUpload").length==0){
		parent.parent.toast("安全生产投入保障制度必填");
		return false;
	}
	// 年度安全投入提取计划
	if($("#td0302 div.zwUpload").length==0){
		parent.parent.toast("年度安全投入提取计划必填");
		return false;
	}
	// 安全生产教育培训制度
	if($("#td0401 div.zwUpload").length==0){
		parent.parent.toast("安全生产教育培训制度必填");
		return false;
	}
	// 安全生产教育和培训计划
	if($("#td0402 div.zwUpload").length==0){
		parent.parent.toast("安全生产教育和培训计划必填");
		return false;
	}
	// 安全生产责任制文件
	if($("#td0403 div.zwUpload").length==0){
		parent.parent.toast("主要负责人、安全管理人员证书必填");
		return false;
	}
	// 事故隐患排查治理制度
	if($("#td0501 div.zwUpload").length==0){
		parent.parent.toast("事故隐患排查治理制度必填");
		return false;
	}
	// 事故隐患排查治理统计分析表
	if($("#td0502 div.zwUpload").length==0){
		parent.parent.toast("事故隐患排查治理统计分析表必填");
		return false;
	}
	// 应急救援管理制度
	if($("#td0601 div.zwUpload").length==0){
		parent.parent.toast("应急救援管理制度必填");
		return false;
	}
	// 生产安全事故应急救援预案
	if($("#td0602 div.zwUpload").length==0){
		parent.parent.toast("生产安全事故应急救援预案必填");
		return false;
	}
	// 应急演练计划
	if($("#td0603 div.zwUpload").length==0){
		parent.parent.toast("应急演练计划必填");
		return false;
	}
	// 岗位安全操作规程清单
	if($("#td0701 div.zwUpload").length==0){
		parent.parent.toast("岗位安全操作规程清单必填");
		return false;
	}
	// 生产安全事故报告和调查处理制度
	if($("#td0801 div.zwUpload").length==0){
		parent.parent.toast("生产安全事故报告和调查处理制度必填");
		return false;
	}
	// 应急救援管理制度
	if($("#td0901 div.zwUpload").length==0){
		parent.parent.toast("应急救援管理制度必填");
		return false;
	}
	// 危险作业审批单
	if($("#td0902 div.zwUpload").length==0){
		parent.parent.toast("危险作业审批单必填");
		return false;
	}
	// 劳动防护管理制度
	if($("#td1001 div.zwUpload").length==0){
		parent.parent.toast("劳动防护管理制度必填");
		return false;
	}
	// 职业卫生安全管理规章制度
	if($("#td1101 div.zwUpload").length==0){
		parent.parent.toast("职业卫生安全管理规章制度必填");
		return false;
	}
	return true;
}
