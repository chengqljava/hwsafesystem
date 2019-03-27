$(document).ready(function() {
	//初始化下拉框
	//SelectOption.loadForm("form");
	SelectOption.loadFormState("form");
	
	
	$("#entwarehouseform").validate({
		rules: {
			warehousename: {
				required: true,
				rangelength:[1,50]
			},
			location: {
				required: true,
				rangelength:[1,50]
			},
			areavolume: {
				required: true,
				rangelength:[1,50]
			},
			form: {
				required: true
			},
			articlequan: {
				required: true,
				rangelength:[1,100]
			}
		},
		messages: {
			warehousename: {
				required: "危险化学品仓库名称不能为空",
				rangelength: "请输入1-50个字符"
			},
			location: {
				required: "位置不能为空",
				rangelength: "请输入1-50个字符"
			},
			areavolume: {
				required: "面积(㎡)或容积(m3)不能为空",
				rangelength: "请输入1-50个字符"
			},
			form: {
				required: "存放物体形态不能为空"
			},
			articlequan: {
				required: "主要存放物品及数量不能为空",
				rangelength: "请输入1-100个字符"
			}
		},
		submitHandler:function(form){
			save();
	    }   
	});
});

/*保存(新增或编辑)*/
function save(){
	$.ajax({
		type : 'post',
		url : BASE_URL+'/enterprise/entwarehouse/save',
		cache : false,
		dataType : 'json',
		data : $("#entwarehouseform").serializeArray(),
		global : false,
		success : function(json) {
			if(json.success==true){
				parent.toast(json.msg);//弹出提示信息
				var index = parent.getParentIndex();
				parent.frames["layui-layer-iframe"+index].frames["contentIframe"].frames["chemIframe"].reloadGrid();//刷新列表
				parent.closeWin();// 关闭弹出框
			}else{
				parent.toast(json.msg);
			}
		},
		error : function() {
			parent.toast("保存失败");
		}
	});
}



