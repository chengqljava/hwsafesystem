
$(function () {		
	var waterid = getQueryString("waterid");
	var isDisplay = getQueryString("isDisplay");
	
	$("#processwaterForm").validate({
		rules: {
			watername:{
				required : true
			},
			watercode:{
				required : true
			},
			sourcewater:{
				required: true
			},
			handlemethod:{
				required: true
			},
			pipepressure:{
				isNumber:true,
				mRessureCheck:true
			},
			installdistance:{
				isNumber:true,
				installdistance:true
			}
		},
		messages: {
			watername:{
				required : "管道名称不能为空"
			},
			watercode:{
				required : "管道编号不能为空"
			},
			sourcewater:{
				required: "供水水源不能为空"
			},
			handlemethod:{
				required: "处理方式不能为空"
			},
			pipepressure:{
				isNumber:"请输入正确的数字格式",
				mRessureCheck: "只能输入一位整数,小数后精确二位"
			},
			installdistance:{
				isNumber:"请输入正确的数字格式",
				installdistance:"只能输入5位整数,小数后精确2位"
			}
		},
		submitHandler:function(form){
			save();
		}   
	});
	
	$.ajax({
		type : "post",
		url : BASE_URL + "publics/publicprocesswater/load/"+waterid,
		dataType : "json",
		data :{},
		success : function(data) {
			if (data) {
				var processwaterTpt = _.template($("#processwaterTpt").html());
				$("#processwaterForm").html(processwaterTpt(data));
//				$("#maptab").val(data.maptab.replace("'", /\"/g));
				$("#maptab").val(data.maptab);
				if (data.usetype == '0') {
					$("#installdistanceTD1").show();
					$("#installdistanceTD2").show();
				}else{
					$("#installdistanceTD1").hide();
					$("#installdistanceTD2").hide();
				}
				var attachList = data.attachs;//附件
	             var downloadurl = BASE_URL + 'publics/publicattachment/download/';
	             if (isDisplay == "isDisplay") {
	            	 showChooseFiles('fileDiv', attachList, downloadurl, false);
				}else{
					showMultipleInputFile("fileDiv","waterfile","file",attachList, downloadurl, true);
				}
			}
		},
		error : function() {
			parent.toast("加载失败");
		}
	});
		
	

});

function appendTD(type){
	if (type == '0') {
		$("#installdistanceTD1").show();
		$("#installdistanceTD2").show();
	}else{
		$("#installdistanceTD1").hide();
		$("#installdistanceTD2").hide();
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
    var formData = $("#processwaterForm").serializeArray();
    if($("#isFlag").val() != "0"){
    	var lines = JSON.stringify($("#maptab").val()).replace(/\"/g, "'")
    	var maptab = lines.substring(1,lines.length-1);
    	var maptabs = {name: 'maptab', value: maptab};//新建检查项
    	formData.push(maptabs);
    }
    $.ajaxFileUpload({
        type: "post",
        url: BASE_URL + "publics/publicprocesswater/save",
        files: arrId,
        async: false,
        data: formData,
        dataType: "json",
        success: function (data) {
        	if (data.success == true) {
        		parent.toast("保存成功");//弹出提示信息
                parent.getActiveIFrame().reloadGrid();//重新加载
                parent.closeWin();// 关闭弹出框
            } else {
                parent.toast(data.msg);
            }
        },
        error: function (XMLHttpRequest, textStatus, errorThrown) {
        	console.log(textStatus);
            parent.toast("提交失败");
        }
    });
}

function checkMap(){
	var isDisplay = $("#isDisplay").val();
	window.top.GEventObject.die("LOAD_BDMAPPT_EVENT");
	window.top.GEventObject.on("LOAD_BDMAPPT_EVENT", function(param) {
		$('#maptab').val(param.lineArray);
		$("#isFlag").val("1");
		$("#mapTag").empty();
		$("#mapTag").append('<a href="javascript:void(0);" onclick="checkMap()">已标注</a>');
	});
	parent.parent.openWin(BASE_URL + "/views/module/publics/common/mapTag.html?isDisplay=" + isDisplay,
			 "地理标注", "50%", "50%");
}
