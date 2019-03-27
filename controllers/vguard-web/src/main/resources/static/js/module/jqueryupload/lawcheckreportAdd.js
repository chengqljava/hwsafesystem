//___________________________________________________________

$(document).ready(function() {
	var lawstatusArr = [ 
	                       { code : 2, name : '未处理'},
	                       { code : 6, name : '已处理'}
	                       ]
	
	SelectOption.loadBaseCode(reportTypeArr, 'reporttype');
	SelectOption.loadBaseCode(lawstatusArr, 'lawstatus');
	
    $("#lawcheckreportform").validate({
    	rules: {
			reportcompany: { required : true, maxlength : 100 },
			reportpersonid : { required: true, maxlength : 16 },
			infosource : { required: true },
			phone : { required : true, isTelephone : true },
			reporttype : { required :  true },
			reportcontent : { required: true, maxlength : 500 }
		},
		messages: {
			reportcompany : { required : '举报单位不能为空', maxlength : '长度不能超过100' },
			reportpersonid : { required : '举报人不能为空', maxlength : '长度不能超过8' },
			infosource : { required : '信息来源不能为空' },
			phone : { required : '联系方式不能为空', isTelephone : '格式不正确' },
			reporttype : { required : '举报类型不能 为空' },
			reportcontent : { required : '举报内容不能为空', maxlength : '长度不能超过500' },
		},
        submitHandler : function(form) {
            save();
        }
    });
});

var delAttachIdArr = [];

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
		
	});
}

/**保存*/
function save(){
	
	//删除的附件
	$('#delAttachIds').val(delAttachIdArr);
	
	//获取file的全部id  
    var uplist = $("input[name^=file]");  
	var arrId = [];  
	for (var i=0; i< uplist.length; i++){  
	    if(uplist[i].value){  
	        arrId[i] = uplist[i].id;  
	    }  
    }
	
	
	$.ajaxFileUpload({
		type : 'post',
		url : BASE_URL + '/law/lawcheckreport/save',
		secureuri:false,
	    files : arrId,
		cache : false,
		dataType : 'json',
		data : $("#lawcheckreportform").serializeArray(),
		global : false,
		success : function(json) {
			if(json.success==true){
				parent.toast(json.msg);//弹出提示信息
//				var index = parent.getParentIndex();
//				parent.frames["layui-layer-iframe"+index].frames["contentIframe"].reloadGrid();//刷新列表
				parent.parent.getActiveIFrame().reloadGrid();//刷新列表
				parent.closeWin();// 关闭弹出框
			}else{
				parent.toast(json.msg);
				$('#fileUploadDiv').empty();
				showUploadFile('fileUploadDiv','file');//显示文件上传控件
			}
		},
		error : function() {
			parent.toast("保存失败");
		}
	});
}


/**
 * 删除数据库中已经保存的附件
 * @param id
 */
function deleteOldAttach(id,fileid){
	$('#'+id).remove();
	delAttachIdArr.push(id);
}

/**
 * 删除附件
 * @param id
 */
function delAttach(id){
	$('#'+id).remove();
	$('#'+id+'_bnt').remove();
}
