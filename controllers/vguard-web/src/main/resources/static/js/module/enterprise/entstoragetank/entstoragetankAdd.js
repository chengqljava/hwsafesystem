$(document).ready(function() {
	// 初始化下拉框
	SelectOption.loadStotankType("stotanktype");
	SelectOption.loadFormState("form");
	
	$("#entStoragetankform").validate({
		rules: {
			stotankname: {
				required: true,
				rangelength:[1,50]
			},
			commtime: {
				required: true
			},
			cubage: {
				required: true,
				rangelength:[1,10],
				number:true
			},
			height: {
				required: true,
				rangelength:[1,10],
				number:true
			},
			form: {
				required: true
			},
			stotanktype: {
				required: true
			},
			maxreserves: {
				number:true
			},
			pressure: {
				number:true
			},
			temperature: {
				number:true
			}
		},
		messages: {
			stotankname: {
				required: "储罐名称不能为空",
				rangelength: "请输入1-50个字符",
			},
			commtime: {
				required: "投产日期不能为空"
			},
			cubage: {
				required: "单罐容积不能为空",
				rangelength: "请输入1-10个字符",
				number: "请输入数字"
			},
			height: {
				required: "罐壁高度不能为空",
				rangelength: "请输入1-10个字符",
				number: "请输入数字"
			},
			form: {
				required: "存放物体形态不能为空"
			},
			stotanktype: {
				required: "储罐类型不能为空"
			},
			maxreserves: {
				number: "请输入数字"
			},
			pressure: {
				number: "请输入数字"
			},
			temperature: {
				number: "请输入数字"
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
		url : BASE_URL+'/enterprise/entstoragetank/save',
		cache : false,
		dataType : 'json',
		data : $("#entStoragetankform").serializeArray(),
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



