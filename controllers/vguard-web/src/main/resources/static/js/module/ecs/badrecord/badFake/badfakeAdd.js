/*新增或编辑提供虚假资料*/
$(function () {		
	
	var fakeid = getQueryString("fakeid");
	$("#badFakeForm").validate({
		rules: {
			businessinfoid: {
				required: true,
			},
			faketime: {
				required: true,
			},
			reason: {
				required: true,
				maxlength: 250
			},
			reduce: {
				maxlength: 250
			},
			remark: {
				maxlength: 250
			}
		},
		messages: {
			businessinfoid: {
				required: "企业名称不能为空",
			},
			faketime: {
				required: "日期不能为空",
			},
			reason: {
				required: "事件因不能为空",
				maxlength: "最多输入250字"
			},
			reduce: {
				maxlength: "最多输入250字"
			},
			remark: {
				maxlength: "最多输入250字"
			}
		},
		submitHandler:function(form){
			save();
		}   
	});

	/*保存(新增或编辑)*/
	$.ajax({
		type : "post",
		url : BASE_URL + "ecs/ecsbadfake/load",
		dataType : "json",
		data :{
			fakeid:fakeid
		},
		success : function(data) {
			if (data) {
				var badFakeTpt = _.template($("#badFakeTpt").html());
				$("#badFakeForm").html(badFakeTpt(data));	
				if(fakeid != "-1"){					
					$("#businessinfoid").attr("disabled",true);
				}
				//加载企业
				SelectTwo.initSelect2($('#businessinfoid'),BASE_URL + "enterprise/entbusinessinfo/searchEntSimpleInfo",'请选择企业');
			}
		},
		error : function() {
			parent.toast("保存失败");
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
		url : BASE_URL + "ecs/ecsbadfake/save",
		data : $("#badFakeForm").serializeArray(),
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

