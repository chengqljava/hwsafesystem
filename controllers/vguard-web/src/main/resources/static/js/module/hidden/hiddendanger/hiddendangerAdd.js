
$(function () {		
	var hasCheck = getQueryString("hasCheck");
	var businessinfoid = getQueryString("businessinfoid");
	var url;
	var id;
	var checkitemId;
	if (hasCheck == "true") {
		checkitemId = getQueryString("checkitemid");
		if (checkitemId == "null"|| checkitemId == "" || checkitemId == "undefined" || checkitemId==null) {
			id = "-1";
		}else{
			id = checkitemId;
		}
		url = BASE_URL + "hidden/hidhiddendanger/load";
	}else if(hasCheck == "false") {
		var dangerId = getQueryString("dangerId");
		if (dangerId == "null"|| dangerId == "" || dangerId == "undefined" || dangerId==null) {
			id = "-1";
		}else{
			id = dangerId;
		}
		url = BASE_URL + "hidden/hidhiddendanger/loadbyid";
	}
	
	
	
	$("#hiddendangerForm").validate({
		rules: {
			hiddendangername:{
				required: true
			},
			hiddendangerlevel:{
				required: true
			},
			findtime:{
				required: true
			},
			findsite:{
				required: true
			},
			reformtype:{
				required: true
			},
			reformtime:{
				required: true
			},
			hiddendangercontent: {
				required: true,
				maxlength:200
			},
			cause : {
				maxlength:100
			},
			affect:{
				maxlength:100
			},
			hiddendangertype: {
				required: true
			}
		},
		messages: {
			hiddendangername:{
				required: "隐患名称不能为空"
			},
			hiddendangerlevel:{
				required: "隐患分级不能为空"
			},
			findtime:{
				required: "发现时间不能为空"
			},
			findsite:{
				required: "发现地点不能为空"
			},
			reformtype:{
				required: "整改措施不能为空"
			},
			reformtime:{
				required: "隐患整改期限施不能为空"
			},
			hiddendangercontent: {
				required: "隐患内容不能为空",
				maxlength:"最多输入200个字"
			},
			cause : {
				maxlength:"最多输入200个字"
			},
			affect : {
				maxlength:"最多输入200个字"
			},
			hiddendangertype: {
				required: "隐患类别不能为空"
			}
		},
		submitHandler:function(form){
			save();
		}   
	});
	
	$.ajax({
		type : "post",
		url : url,
		dataType : "json",
		data :{
			"id":id
		},
		success : function(data) {
			if (data) {
				var enttransferTpt = _.template($("#hiddendangerTpt").html());
				$("#hiddendangerForm").html(enttransferTpt(data));
				$("#checkitemid").val(checkitemId);
				$("#entid").val(businessinfoid);
				var attachList = data.attachList;//图片附件
				if(data.reformtype == "0" || data.findtime == "" ||  data.findtime == null){//隐患整改期限
					$("#reformterm1").show();
					$("#reformterm2").show();
					if(data.reformterm == null || data.reformterm == ""){
						$("#reformterm").val("15");
					}
				} else {
					$("#reformterm1").hide();
					$("#reformterm2").hide();
					$("#reformterm").val("");
				}
				
				if (data.findtime == "" ||  data.findtime == null) {
					$("#findtime").val(getNowFormatDate());
				}
				
				SelectOption.loadHiddendangerType("hiddendangertype");//隐患类别
	             var downloadurl = BASE_URL + 'hidden/hidattach/download/';
	             showMultipleInputFile("picDiv","filehidcheckpic","image",attachList, downloadurl, true);
			}
		},
		error : function() {
			parent.toast("加载失败");
		}
	});
	
});

function reformType(type){
	if(type == "0"){
		$("#reformterm1").show();
		$("#reformterm2").show();
		$("#reformterm").val("15");
	} else {
		$("#reformterm1").hide();
		$("#reformterm2").hide();
		$("#reformterm").val("");
	}
}

function getQueryString(name)
{
     var reg = new RegExp("(^|&)"+ name +"=([^&]*)(&|$)");
     var r = window.location.search.substr(1).match(reg);
     if(r!=null)return  unescape(r[2]); return null;
}

/**
 * 保存
 * @returns
 */
	
function save() {
	var dangerId;
    var uplist = $("input[name^=file]");
    var arrId = [];
    for (var i = 0; i < uplist.length; i++) {
        if (uplist[i].value) {
            arrId[i] = uplist[i].id;
        }
    }
    $.ajaxFileUpload({
        type: "post",
        url: BASE_URL + "hidden/hidhiddendanger/save",
        files: arrId,
        async: false,
        data: $("#hiddendangerForm").serializeArray(),
        dataType: "json",
        success: function (data) {
        	if (data.success == true) {
        		dangerId = data.msg;//弹出提示信息
        		parent.toast("保存成功");//弹出提示信息
//                parent.getActiveIFrame().reloadGrid();//重新加载
//                parent.closeWin();// 关闭弹出框
            } else {
                parent.toast(data.msg);
            }
            /*if (data.isSave) {
            	dangerId = data.dangerId;
				parent.toast("保存成功");//弹出提示信息
				parent.getActiveIFrame().reloadGrid();//重新加载
            } else {
                parent.toast("保存失败");
            }*/
        },
        error: function (XMLHttpRequest, textStatus, errorThrown) {
            parent.toast("提交失败");
        },
        complete:function(XMLHttpRequest,textStatus){  
        	parent.loadRemindCount();
            returnWin(dangerId);
            parent.closeWin();// 关闭弹出框
        },  
    });

}
	
function returnWin(dangerId){
	window.top.GEventObject.fireEvent('LOAD_HID_REPORT',dangerId);
}
