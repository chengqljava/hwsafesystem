/*新增或编辑场所环境*/
$(function () {		
	
	var placeareaid = getQueryString("placeareaid");
	$("#dssRskPlaceareaForm").validate({
		rules: {
			placeareacode: {
                required: true
            },
            placeareaname: {
				required: true
			},
			liablor: {
				required: true
			},
			telephone: {
				required: true,
				isMobile: true
			},
            orgid: {
                required: true
            }
		},
		messages: {
			placeareacode: {
                required: "场所区域编号不能为空"
            },
            placeareaname: {
				required: "场所区域名称不能为空"
			},
			liablor: {
				required: "负责人不能为空"
			},
			telephone: {
				required: "负责人电话不能为空",
				isMobile:"请输入正确的手机号码格式"
			},
            orgid: {
                required: "请选择所属部门/车间"
            }
		},
		submitHandler:function(form){
			save();
		}   
	});

	/*保存(新增或编辑)*/
	$.ajax({
		type : "post",
		url : BASE_URL + "dangersource/dssrskplacearea/load",
		dataType : "json",
		data :{
			placeareaid:placeareaid
		},
		success : function(data) {
			if (data) {
				var dssRskPlaceareaTpt = _.template($("#dssRskPlaceareaTpt").html());
				$("#dssRskPlaceareaForm").html(dssRskPlaceareaTpt(data));
                SelectTree.loadEntOrgTree("orgid");
				showUploadFile("fileUploadDiv", 'image', true, true);// 显示文件上传控件
			}
		},
		error : function() {
			parent.toast("初始化信息加载失败");
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
function save(){
	var uplist = $("input[name^=file]");
	var arrId = [];
	for (var i = 0; i < uplist.length; i++) {
		if (uplist[i].value) {
			arrId[i] = uplist[i].id;
		}
	}

	$.ajaxFileUpload({
		type : "post",
		url : BASE_URL + "dangersource/dssrskplacearea/save",
		files: arrId,
		dataType: "json",
		data : $("#dssRskPlaceareaForm").serializeArray(),
		success : function(data) {
			if(data.success==true){
				parent.toast(data.msg);//弹出提示信息
				parent.getActiveIFrame().reloadGrid();//重新加载
				parent.closeWin();// 关闭弹出框
			}else{
				parent.toast(data.msg);
			}
		},
		error : function() {
			parent.toast("编辑失败");
		}
	});
	
}

