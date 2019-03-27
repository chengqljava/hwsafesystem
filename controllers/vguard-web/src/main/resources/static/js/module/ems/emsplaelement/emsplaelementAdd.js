$(document).ready(function() {
	SelectTree.loadPlanElementAllSelect("parentname",{templateid:$("#templateid").val(),elementid:$("#elementid").val()});//所属章节
	
	$("#emsPlaElementform").validate({
		rules : {
			elementnum : {
				required : true,
				isNumberDot : true
			},
			elementname : {
				required : true
			}
		},
		messages : {
			elementnum : {
				required : "元素编号不能为空"
			},
			elementname : {
				required : "元素名称不能为空"
			}
		},
		submitHandler : function(form) {
			save();
		}
	});
});

/*保存(新增或编辑)*/
function save(){
	$.ajax({
		type : 'post',
		url : BASE_URL+'/ems/emsplaelement/save',
		secureuri:false,
		cache : false,
		dataType : 'json',
		data : $("#emsPlaElementform").serializeArray(),
		global : false,
		success : function(json) {
			if(json.success==true){
				parent.toast(json.msg);
				var index = parent.getParentIndex();
				parent.frames["layui-layer-iframe"+index].reloadGrid();//刷新父列表（应急人员列表）
				parent.closeWin();// 关闭弹出框
			}else{
				parent.parent.toast(json.msg);
				$('#emsPlaElementform').data('formValidation').disableSubmitButtons(false);//设置提交按钮disable为false
			}
		},
		error : function() {
			parent.toast("保存失败");
		}
	});
}

/**
 * 清空上级节点
 */
function resetparent(){
	$("#parentname").attr("selectvalue","");//清空页面显示的值
	$("#parentname_select").val("");//清空隐藏域中的值
	$("#parentname").val("");
	
}
