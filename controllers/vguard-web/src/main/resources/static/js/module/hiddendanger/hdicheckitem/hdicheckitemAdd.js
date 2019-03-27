$(document).ready(function() {
	 	//上级排查项
		SelectTree.loadCheckitemSelect("parentname");
		
	    //行业分类(排查项)
	    SelectOption.loadCheckIndustryType("industrytype");
	    
	    //排查分类
	    SelectOption.loadCheckItemType("itemtype");
	    
		/**数字验证*/
		jQuery.validator.addMethod("num", function(value, element) {
			var num = /^([0-9]+)$/;
			return this.optional(element) || (num.test(value));
			}, "只能输入数字(0-9)");
		
		$("#checkitemform").validate({
			rules: {
				itemname: {
					required: true
				},
				parentname: {
					required: true
				},
				industrytype: {
					required: true
				},
				itemtype: {
					required: true
				},
				ordernum: {
					num: true
				}
			},
			messages: {
				itemname: {
					required: "排查项名不能为空"
				},
				parentname: {
					required: "父排查项不能为空"
				},
				industrytype: {
					required: "请选择行业分类!"
				},
				itemtype: {
					required: "请选择排查分类!",
				},
				ordernum: {
					num: "只能输入数字(0-9)",
				}
			},
			submitHandler:function(form){
				 save();
		    }   
		});
});


/**保存*/
function save(){
	$.ajax({
		type : 'post',
		url : BASE_URL+'/hiddendanger/hdicheckitem/save',
		cache : false,
		dataType : 'json',
		data : $("#checkitemform").serializeArray(),
		global : false,
		success : function(json) {
			if(json.success==true){
				parent.toast(json.msg);//弹出提示信息
				parent.getActiveIFrame().reloadGrid();//刷新列表
				parent.getActiveIFrame().loadCheckitemTree();//刷新树();
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

/**
 * 企业信息
 */
function loadEnt(){
	/**
	 * 加载企业
	 */
	window.top.GEventObject.die('LOAD_ENT_EVENT');
	window.top.GEventObject.on('LOAD_ENT_EVENT', function(rowdata) {
		$('#businessinfoid').val(rowdata.BUSINESSINFOID);
		$('#entname').val(rowdata.ENTNAME);
		$('#entname').blur();
	});
	var planid = $("#plan option:selected").val();
	window.top.openWin(BASE_URL+"/law/lawcheckinfo/entinfo?planid="+planid,' 企业信息','65%','70%');
}
