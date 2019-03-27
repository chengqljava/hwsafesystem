
/**
 * 新增和修改生产作业活动风险信息
 */
$(function () {
	var operid = getQueryString("operid");
	$("#dssRskOperForm").validate({
		rules: {
			sugmeasure: {
				required: true
			},
			auditresult:{
				required:true
			}
		},
		messages: {
			sugmeasure: {
				required: "建议措施不能为空"
			},
			auditresult:{
				required: "审核建议不能为空"
			}
			
		},
		submitHandler:function(form){
		   	save();
	    }   
	});
	
	
	$.ajax({
		type : "post",
		url : BASE_URL + "dangersource/dssrskoper/load",
		dataType: "json",
		data:{
			operid:operid
		},
		success : function(data) {
			if (data) {
				var dssRskOperTpt = _.template($("#dssRskOperTpt").html());
				$("#dssRskOperForm").html(dssRskOperTpt(data));
				
				SelectOption.loadSugAuditResult("auditresult");
				
				
			}
		},
		error : function() {
			parent.toast("初始化信息加载失败!");
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
		url : BASE_URL + "dangersource/dssrskoper/auditSug",
		data : $("#dssRskOperForm").serializeArray(),
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

