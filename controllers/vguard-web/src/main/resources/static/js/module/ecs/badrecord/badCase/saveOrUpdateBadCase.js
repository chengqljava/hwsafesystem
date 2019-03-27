/**
 * 新增和修改投诉并立案事件信息
 */
$(function () {
	var caseid = GetQueryString("caseid");
	$("#badCaseForm").validate({
		rules: {
            businessinfoid: {
				required: true
			},
            casetime: {
				required: true
			},
            casereason:{
				required: true,
                maxlength:120
			},
            remark:{
            	maxlength:120
			}
		},
		messages: {
            businessinfoid: {
				required: "企业名称不能为空"
			},
            casetime: {
				required: "事件发生时间不能为空"
			},
            casereason:{
				required: "事件原因不能为空",
				maxlength:"最多输入120个字"
			},
			remark:{
            	maxlength:"最多输入120个字"
			}
			
		},
		submitHandler:function(form){
		   	save();
	    }   
	});
	
	
	$.ajax({
		type : "post",
		url : BASE_URL + "ecs/ecsbadcase/load",
		dataType: "json",
		data:{
            caseid:caseid
		},
		success : function(data) {
			if (data) {
				var badCaseTpt = _.template($("#badCaseTpt").html());
				$("#badCaseForm").html(badCaseTpt(data));
				if(caseid != "-1"){					
					$("#businessinfoid").attr("disabled",true);
				}
				SelectTwo.initSelect2($('#businessinfoid'),BASE_URL + "enterprise/entbusinessinfo/searchEntSimpleInfo",'请选择企业');
			}
		},
		error : function() {
			parent.toast("初始化信息加载失败!");
		}
	});
	
});
function GetQueryString(name)
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
		url : BASE_URL + "ecs/ecsbadcase/save",
		data : $("#badCaseForm").serializeArray(),
        dataType: "json",
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
