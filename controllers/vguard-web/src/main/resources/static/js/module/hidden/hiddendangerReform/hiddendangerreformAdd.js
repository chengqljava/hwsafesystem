/**
 * 隐患整改添加记录
 */
$(function() {
	var hiddendangerid = getQueryString("hiddendangerid");
	if (hiddendangerid == "null") {
		hiddendangerid = "-1";
	}
	$("#hiddendangerreformForm").validate({
		rules : {
			reformgoal : {
				required : true
			},
			reformusers : {
				required : true
			},
			endtime : {
				required : true
			},
			reformway : {
				required : true,
				maxlength : 200
			}
		},
		messages : {
			reformgoal : {
				required : "整改目标不能为空"
			},
			reformusers : {
				required : "整改人员不能为空"
			},
			endtime : {
				required : "整改完成日期不能为空"
			},
			reformway : {
				required : "整改措施不能为空",
				maxlength : "最多输入200个字"
			}
		},
		submitHandler : function(form) {
			parent.confirm("整改信息保存成功后，将进入复查环节！", function() {
				save();
			});
			
		}
	});

	$.ajax({
		type : "post",
		url : BASE_URL + "hidden/hidhiddendangerreform/load",
		dataType : "json",
		data : {
			"hiddendangerreformid" : "-1"
		},
		success : function(data) {
			if (data) {
				var enttransferTpt = _.template($("#hiddendangerreformTpt")
						.html());
				$("#hiddendangerreformForm").html(enttransferTpt(data));
				var attachList = data.attachList;// 图片附件

				var downloadurl = BASE_URL + 'hidden/hidattach/download/';
				showMultipleInputFile("picDiv", "filepic", "image", attachList,
						downloadurl, true);

				$("#hiddendangerid").val(hiddendangerid);
			}
		},
		error : function() {
			parent.toast("加载失败");
		}
	});

});

function getQueryString(name) {
	var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
	var r = window.location.search.substr(1).match(reg);
	if (r != null)
		return unescape(r[2]);
	return null;
}

/**
 * 保存
 * 
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
		type : "post",
		url : BASE_URL + "hidden/hidhiddendangerreform/save",
		files : arrId,
		async : false,
		data : $("#hiddendangerreformForm").serializeArray(),
		dataType : "json",
		success : function(data) {
			if (data.success == true) {
//				parent.toast("保存成功");// 弹出提示信息
				parent.getActiveIFrame().reloadGrid();//重新加载
//				parent.closeWin();// 关闭弹出框
			} else {
				parent.toast("保存失败");
			}
		},
		error : function() {
			parent.toast("新增失败");
		},
        complete:function(XMLHttpRequest,textStatus){ 
        	window.top.GEventObject.fireEvent('LOAD_HID_ReformList',"");
//            parent.closeWin();// 关闭弹出框
        	parent.parent.parent.loadRemindCount();
        	parent.closeAllWin();
        }
	});
}

