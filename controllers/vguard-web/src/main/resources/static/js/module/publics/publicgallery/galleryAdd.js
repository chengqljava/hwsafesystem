
$(function () {		
	var galleryid = getQueryString("galleryid");
	var isDisplay = getQueryString("isDisplay");
	
	$("#galleryForm").validate({
		rules: {
			galleryname:{
				required: true
			},
			gallerycode:{
				required: true
			},
			startpoint:{
				required: true
			},
			endpoint:{
				required: true
			},
			gallength:{
				required: true,
				isNumber:true,
				wRessureCheck:true
			}
		},
		messages: {
			galleryname:{
				required: "管廊名称不能为空"
			},
			gallerycode:{
				required: "管廊编号不能为空"
			},
			startpoint:{
				required: "管廊起点不能为空"
			},
			endpoint:{
				required: "管廊终点不能为空"
			},
			gallength:{
				required: "管廊总长度不能为空",
				isNumber: "请输入正确的数字格式",
				wRessureCheck: "只能输入三位整数,小数后精确二位"
			}
		},
		submitHandler:function(form){
			save();
		}   
	});
	
	$.ajax({
		type : "post",
		url : BASE_URL + "publics/publicgallery/load/"+galleryid,
		dataType : "json",
		data :{},
		success : function(data) {
			if (data) {
				var galleryTpt = _.template($("#galleryTpt").html());
				$("#galleryForm").html(galleryTpt(data));
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
    var formData = $("#galleryForm").serializeArray();
    if($("#isFlag").val() != "0"){
    	var lines = JSON.stringify($("#maptab").val()).replace(/\"/g, "'")
    	var maptab = lines.substring(1,lines.length-1);
    	var maptabs = {name: 'maptab', value: maptab};//新建检查项
    	formData.push(maptabs);
    }
    $.ajaxFileUpload({
        type: "post",
        url: BASE_URL + "publics/publicgallery/save",
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
