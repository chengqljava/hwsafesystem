
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
		url = BASE_URL + "hidden/hidhiddendanger/loadBydangerid";
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
			},
			placeareaid: {
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
			},
			placeareaid: {
				required: "请选择所在区域"
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
				
				SelectOption.loadHiddendangerType("hiddendangertype");//隐患类别
				$("#hiddendangertype").val(getQueryString('checktype'));
				SelectOption.loadDangerfrom("hiddendangerfrom");//隐患来源
				
				/*************整改方式切换按钮开始***********************/
				//隐患整改期限切换 1立即整改正 0限期整改
				if ($("input[name=reformtype]:checked").val() == 0 ) {
					$("#reformlist").hide();
				}else{
					$("#reformlist").show();
				}
				$("input[name=reformtype]").change(function(){
					if ($(this).val() == 0) {
						$("#reformlist").hide();
					}else{
						$("#reformlist").show();
					}
				});
				/*************整改方式切换按钮结束***********************/
				
				if ($("input[name='reformtype']:checked").val() == 0) {
					$("#reformterm1").show();
					$("#reformterm2").show();
					if(data.reformterm == null || data.reformterm == ""){
						$("#reformterm").val("15");
					}
				}else {
					$("#reformterm1").hide();
					$("#reformterm2").hide();
					$("#reformterm").val("");
				}
				
//				if(data.reformtype == 0){//隐患整改期限
//					$("#reformterm1").show();
//					$("#reformterm2").show();
//					if(data.reformterm == null || data.reformterm == ""){
//						$("#reformterm").val("15");
//					}
//				} else {
//					$("#reformterm1").hide();
//					$("#reformterm2").hide();
//					$("#reformterm").val("");
//				}
//				
				console.log(getQueryString("businessinfoid"));
				if (getQueryString("businessinfoid") != "") {
					$("#placeArea").css("display","none");
				}
				
				if (data.findtime == "" ||  data.findtime == null) {
					$("#findtime").val(getNowFormatDate());
				}
				var reform  = data.reform;
				if (reform.endtime == "" ||  reform.endtime == null) {
					$("#endtime").val(getNowFormatDate());
				}
				
	            var downloadurl = BASE_URL + 'hidden/hidattach/download/';
	            
	            var attachList = data.attachList;//图片附件
	            var reformAttachList = data.reformAttachList;
	            showMultipleInputFile("picDiv","filehidcheckpic","image",attachList, downloadurl, true);
		        showMultipleInputFile("reforPicDiv", "fileReformpic", "image", reformAttachList,downloadurl, true);
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
        		window.top.saveornotFalg = '2';
        		parent.toast("保存成功");//弹出提示信息
            } else {
                parent.toast(data.msg);
            }
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
	
function loadPlaceArea(){
	/**
	 * 加载区域
	 */
	window.top.GEventObject.die('LOAD_PALCEAREA_EVENT');
	window.top.GEventObject.on('LOAD_PALCEAREA_EVENT', function(rowdata) {
		$('#placeareaid').val(rowdata.PLACEAREAID);
		$('#placeareaname').val(rowdata.PLACEAREANAME);
		$('#placeareaname').blur();
	});
	window.top.openWin(BASE_URL + "views/module/hkpark_hidden/hiddenManager/dssrskplaceareaList.html",'区域信息','55%','63%');
}

function returnWin(dangerId){
	window.top.GEventObject.fireEvent('LOAD_HID_REPORT',dangerId);
}
