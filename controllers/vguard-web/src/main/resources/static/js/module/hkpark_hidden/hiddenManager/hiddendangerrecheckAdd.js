/**
 * 隐患复查
 */
$(function() {
	var hiddendangerid = getQueryString("hiddendangerid");
	var isRemind = getQueryString("isRemind");
	if (hiddendangerid == "null") {
		hiddendangerid = "-1";
	}
	$("#hiddendangerrecheckForm").validate({
		rules : {
			recheckstate:{
				required : true
			},
			recheckresult : {
				required : true
			},
			recheckusers : {
				required : true
			},
			rechecktime : {
				required : true
			}
		},
		messages : {
			recheckstate:{
				required : "复查状态不能为空"
			},
			recheckresult : {
				required : "复查意见不能为空"
			},
			recheckusers : {
				required : "复查人员不能为空"
			},
			rechecktime : {
				required : "复查日期不能为空"
			}
		},
		submitHandler : function(form) {
			saveconfirm(isRemind);
		}
	});

	$.ajax({
		type : "post",
		url : BASE_URL + "hidden/hidhiddendangerrecheck/load",
		dataType : "json",
		data : {
			"hiddendangerrecheckid" : "-1"
		},
		success : function(data) {
			if (data) {
				console.log(data);
				var enttransferTpt = _.template($("#hiddendangerrecheckTpt")
						.html());
				$("#hiddendangerrecheckForm").html(enttransferTpt(data));
				var attachList = data.attachList;// 图片附件

				SelectOption.loadRecheckState("recheckstate");
				
				var downloadurl = BASE_URL + 'hidden/hidattach/download/';
				showMultipleInputFile("picDiv", "filepic", "image", attachList,
						downloadurl, true);

				if (data.rechecktime == '' || data.rechecktime == null) {
					$("#rechecktime").val(getNowFormatDate());
				}
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

function saveconfirm(isRemind){
	var recheckstate = $("#recheckstate").val();
	if(recheckstate == "0"){		
		parent.confirm("复查信息保存成功后，将进入整改环节！", function() {
			save(isRemind);
		});
	} else if(recheckstate == "1"){
		parent.confirm("复查信息保存成功后，将进入核销环节！", function() {
			save(isRemind);
		});
	}
}

/**
 * 保存
 * 
 * @returns
 */

function save(isRemind) {
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
		url : BASE_URL + "hidden/hidhiddendangerrecheck/save",
		files : arrId,
		async : false,
		data : $("#hiddendangerrecheckForm").serializeArray(),
		dataType : "json",
		success : function(data) {
			if (data.success == true) {
                var isFromGis = getQueryString("isFormGis");
				parent.toast("保存成功");// 弹出提示信息
				parent.getActiveIFrame().reloadGrid();//重新加载
                if(isFromGis){
                    var entid = getQueryString("entid");
                    parent.parent.updateHidInfo(entid);
                    parent.closeAllWin();
                    return;
                }else{
                    parent.getActiveIFrame().reloadGrid();//重新加载
                }
			} else {
				parent.toast("保存失败");
			}
		},
		error : function() {
			parent.toast("新增失败");
		},
        complete:function(XMLHttpRequest,textStatus){
			var data ={};
            data.entid = getQueryString("entid");
        	window.top.GEventObject.fireEvent('LOAD_HID_RecheckList',data);
        	parent.parent.parent.loadRemindCount();
//            parent.closeWin();// 关闭弹出框
        	parent.closeAllWin();
        }
	});

}
