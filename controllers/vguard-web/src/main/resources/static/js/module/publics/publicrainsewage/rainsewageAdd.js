
$(function () {		
	var rainsewageid = getQueryString("rainsewageid");
	var isDisplay = getQueryString("isDisplay");
	
	$("#rainsewageForm").validate({
		rules: {
			draingone:{
				required: true
			},
			conduitcode:{
				required: true
			},
			rainsewagename:{
				required: true
			},
			draintype:{
				required: true
			},
			diameter:{
				required: true,
				isNumber:true
			},
			depth:{
				isNumber:true,
				dRessureCheck:true
			},
			spacing:{
				isNumber:true
			}
		},
		messages: {
			draingone:{
				required: "排水去向不能为空"
			},
			conduitcode:{
				required: "管道编号不能为空"
			},
			rainsewagename:{
				required: "管道名称不能为空"
			},
			draintype:{
				required: "排水类型不能为空"
			},
			diameter:{
				required: "管道直径不能为空",
				isNumber: "请输入正确的数字格式"
			},
			depth:{
				isNumber: "请输入正确的数字格式",
				dRessureCheck: "只能输入两位整数,小数后精确两位"
			},
			spacing:{
				isNumber: "请输入正确的数字格式"
			}
		},
		submitHandler:function(form){
			save();
		}   
	});
	
	$.ajax({
		type : "post",
		url : BASE_URL + "publics/publicrainsewage/load/"+rainsewageid,
		dataType : "json",
		data :{},
		success : function(data) {
			if (data) {
				var rainsewageTpt = _.template($("#rainsewageTpt").html());
				$("#rainsewageForm").html(rainsewageTpt(data));
//				$("#maptab").val(data.maptab.replace("'", /\"/g));
				$("#maptab").val(data.maptab);
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
    var formData = $("#rainsewageForm").serializeArray();
    if($("#isFlag").val() != "0"){
    	var lines = JSON.stringify($("#maptab").val()).replace(/\"/g, "'")
    	var maptab = lines.substring(1,lines.length-1);
    	var maptabs = {name: 'maptab', value: maptab};//新建检查项
    	formData.push(maptabs);
    }
    $.ajaxFileUpload({
        type: "post",
        url: BASE_URL + "publics/publicrainsewage/save",
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
