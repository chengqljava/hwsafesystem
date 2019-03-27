/*新增或编辑场所环境*/
$(function () {		
	
	var postequipid = getQueryString("postequipid");
	$("#dssRskPostequipForm").validate({
		rules: {
			postequipcode: {
                required: true
            },
            postequipname: {
				required: true
			},
			placeareaid: {
				required: true
			},
			type: {
				required: true
			},
			liablor: {
				required: true
			},
			telephone: {
				required: true,
				isMobile: true
			}
		},
		messages: {
			postequipcode: {
                required: "岗位/设备编号不能为空"
            },
            postequipname: {
				required: "岗位/设备名称不能为空"
			},
			placeareaid: {
				required: "所属区域不能为空"
			},
			type: {
				required: "类型不能为空"
			},
			liablor: {
				required: "负责人不能为空"
			},
			telephone: {
				required: "负责人电话不能为空",
				isMobile:"请输入正确的手机号码格式"
			}
		},
		submitHandler:function(form){
			save();
		}   
	});

	/*保存(新增或编辑)*/
	$.ajax({
		type : "post",
		url : BASE_URL + "dangersource/dssrskpostequip/load",
		dataType : "json",
		data :{
			postequipid:postequipid
		},
		success : function(data) {
			if (data) {
				var dssRskPostequipTpt = _.template($("#dssRskPostequipTpt").html());
				$("#dssRskPostequipForm").html(dssRskPostequipTpt(data));
				SelectOption.loadPlacearea("placeareaid");
				SelectOption.loadPostequipType("type");						
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
	$.ajax({
		type : "post",
		url : BASE_URL + "dangersource/dssrskpostequip/save",
		data : $("#dssRskPostequipForm").serializeArray(),
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

