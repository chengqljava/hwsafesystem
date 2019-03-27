
$(function () {		
	var hiddendangerid = getQueryString("hiddendangerid");
	var hiddendangerstate = getQueryString("hiddendangerstate");

	if(hiddendangerstate != "5"){
		$("#cancelHid").attr("style","display:none");
	}
	$("#cancelHiddendangerForm").validate({
		rules: {
			cancelusers:{
				required: true
			},
			canceltime:{
				required: true
			}
		},
		messages: {
			cancelusers:{
				required: "核销人不能为空"
			},
			canceltime:{
				required: "核销时间不能为空"
			}
		},
		submitHandler:function(form){
			save();
		}   
	});
	
	$.ajax({
		type : "post",
		url : BASE_URL + "hidden/hidhiddendanger/loadbyid",
		dataType : "json",
		data :{
			"id":hiddendangerid
		},
		success : function(data) {
			if (data) {
				var enttransferTpt = _.template($("#cancelHiddendangerTpt").html());
				$("#cancelHiddendangerForm").html(enttransferTpt(data));
				
				var attachList = data.attachs;//附件
				var downloadurl = BASE_URL + 'hidden/hidattach/download/';
//				showChooseFiles('fileDiv', attachList, downloadurl, false);
				showMultipleInputFile("fileDiv","noticefile","file",attachList, downloadurl, true);
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
    var isFromGis = getQueryString("isFormGis");
    var isRemind = getQueryString("isRemind");
    var uplist = $("input[name^=file]");
    
    var arrId = [];
    for (var i = 0; i < uplist.length; i++) {
        if (uplist[i].value) {
            arrId[i] = uplist[i].id;
        }
    }
    
    $.ajaxFileUpload({
        type: "post",
        url: BASE_URL + "hidden/hidhiddendanger/cancel",
        files: arrId,
        async: false,
        data: $("#cancelHiddendangerForm").serializeArray(),
        dataType: "json",
        success : function(data) {
			if(data.success==true){
				parent.toast(data.msg);//弹出提示信息
				if(isRemind == 0){
					parent.parent.parent.loadRemindCount();
					parent.closeAllWin();
				} else{					
					if(isFromGis){
						var entid = getQueryString("entid");
						parent.updateHidInfo(entid);
					}else{
						parent.getActiveIFrame().reloadGrid();//重新加载
					}
					parent.closeWin();// 关闭弹出框
				}
			}else{
				parent.toast(data.msg);
			}
		},
		error : function() {
			parent.toast("编辑失败");
		} 
    });
    
//    $.ajax({
//        type: "post",
//        url: BASE_URL + "hidden/hidhiddendanger/cancel",
//        async: false,
//        data: $("#cancelHiddendangerForm").serializeArray(),
//        dataType: "json",
//		success : function(data) {
//			if(data.success==true){
//				parent.toast(data.msg);//弹出提示信息
//				if(isRemind == 0){
//					parent.parent.parent.loadRemindCount();
//					parent.closeAllWin();
//				} else{					
//					if(isFromGis){
//						var entid = getQueryString("entid");
//						parent.updateHidInfo(entid);
//					}else{
//						parent.getActiveIFrame().reloadGrid();//重新加载
//					}
//					parent.closeWin();// 关闭弹出框
//				}
//			}else{
//				parent.toast(data.msg);
//			}
//		},
//		error : function() {
//			parent.toast("编辑失败");
//		} 
//    });

}
