/*新增或编辑课程管理*/
$(function () {		
	
	var typeid = getQueryString("typeid");
	$("#placeTypeForm").validate({
		rules: {
			name: {
				required: true,
				maxlength: 50
			},
			remark: {
				maxlength: 255
			}
		},
		messages: {
			name: {
				required: "场所类型名称不能为空",
				maxlength: "最多输入50字"
			},
			remark: {
				maxlength: "最多输入255字"
			}
		},
		submitHandler:function(form){
		   	save();
	    }   
	});
	//查询
	$.ajax({
		type : "post",
		url : BASE_URL + "ems/codeemssucplacetype/load",
		dataType : "json",
		data :{
			typeid:typeid
		},
		success : function(data) {
			if (data) {
				var placeTypeTpt = _.template($("#placeTypeTpt").html());
				$("#placeTypeForm").html(placeTypeTpt(data));				
			}
		},
		error : function() {
			parent.toast("初始化信息加载失败");
		}
	});
});

/*保存(新增或编辑)*/
function save(){
	$.ajax({
		type : "post",
		url : BASE_URL + "ems/codeemssucplacetype/save",
		data : $("#placeTypeForm").serializeArray(),
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

function getQueryString(name)
{
     var reg = new RegExp("(^|&)"+ name +"=([^&]*)(&|$)");
     var r = window.location.search.substr(1).match(reg);
     if(r!=null)return  unescape(r[2]); return null;
}