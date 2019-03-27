
$(function () {		
	var dangerid = getQueryString("dangerid");
	var rskrecordid = getQueryString("rskrecordid");
	$("#hiddendangerForm").validate({
		rules: {
			entid:{
				required: true
			},
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
//			reformtime:{
//				required: true
//			},
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
			hiddendangerfrom:{
				required: true
			},
			hiddendangertype: {
				required: true
			}
		},
		messages: {
			entid:{
				required: "检查对象不能为空"
			},
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
//			reformtime:{
//				required: "隐患整改期限不能为空"
//			},
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
			hiddendangerfrom:{
				required: "隐患来源不能为空"
			},
			hiddendangertype: {
				required: "隐患类别不能为空"
			}
		},
		submitHandler:function(form){
			save(rskrecordid);
		}   
	});
	
	$.ajax({
		type : "post",
		url : BASE_URL + "hidden/hidhiddendanger/loadBydangerid",
		dataType : "json",
		data :{
			"id":dangerid,
			"rskrecordid":rskrecordid
		},
		success : function(data) {
			if (data) {
				var enttransferTpt = _.template($("#hiddendangerTpt").html());
				$("#hiddendangerForm").html(enttransferTpt(data));
				
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
				if(data.dssRskRecord){
					var dssRskRecord = data.dssRskRecord;
					$("#hiddendangername").val(dssRskRecord.placeareaname+"/"+dssRskRecord.specificname+"隐患排查");
					$("#findsite").val(dssRskRecord.placeareaname+"/"+dssRskRecord.specificname);
				}
				SelectOption.loadDangerfrom("hiddendangerfrom");//隐患来源
				SelectOption.loadHiddendangerType("hiddendangertype");//隐患类别
				var attachList = data.attachList;//图片附件
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
	
function save(rskrecordid) {
	var dangerId;
    var uplist = $("input[name^=file]");
    var arrId = [];
    for (var i = 0; i < uplist.length; i++) {
        if (uplist[i].value) {
            arrId[i] = uplist[i].id;
        }
    }
    var formData = $("#hiddendangerForm").serializeArray();
    formData.push({name:"rskrecordid",value:rskrecordid});
    $.ajaxFileUpload({
        type: "post",
        url: BASE_URL + "hidden/hidhiddendanger/save",
        files: arrId,
        async: false,
        data: formData,
        dataType: "json",
        success: function (data) {
        	if (data.success == true) {
        		dangerId = data.msg;//弹出提示信息
        		parent.toast("保存成功");//弹出提示信息
        		parent.loadRemindCount();
                parent.getActiveIFrame().reloadGrid();//重新加载
                parent.closeWin();// 关闭弹出框
            } else {
                parent.toast(data.msg);
            }
        },
        error: function (XMLHttpRequest, textStatus, errorThrown) {
            parent.toast("提交失败");
        }
    });
}

function loadEnt(){
	/**
	 * 加载企业
	 */
	window.top.GEventObject.die('LOAD_ENT_EVENT');
	window.top.GEventObject.on('LOAD_ENT_EVENT', function(rowdata) {
		$('#entid').val(rowdata.BUSINESSINFOID);
		$('#entname').val(rowdata.ENTNAME);
		$('#entname').blur();
	});
	var planid = $("#plan option:selected").val();
	window.top.openWin(BASE_URL+"/law/lawcheckinfo/entinfo?planid="+planid,' 企业信息','55%','63%');
}

function deleteFile(div, fileid) {
    $('#' + div).hide();
    $('#hidCheckAttachPics').append("<input class=\"form-control\" type='hidden' name='delids' value='" + fileid + "'/>");
}