/*新增或编辑操作程序*/
$(function () {		
	var operid = getQueryString("operid");
	$("#dssRskOperForm").validate({
		rules: {
			typeid: {
				required: true
			},
			jobstep: {
				required: true,
				maxlength:500
			},
			oprbehavior: {
				required: true,
				maxlength:500
			},
			introducer: {
				maxlength:500
			},
			warp: {
				maxlength:500
			},
			saferisk: {
				required: true,
				maxlength:500
			},
			ctrlmeasure: {
				maxlength:500
			}

		},
		messages: {
			typeid: {
				required: "所属模块不能为空"
			},
			jobstep: {
				required: "作业步骤不能为空",
                maxlength:"最多输入500个字"
			},
			oprbehavior: {
				required: "操作行为不能为空",
                maxlength:"最多输入500个字"
			},
			introducer: {
                maxlength:"最多输入500个字"
			},
			warp: {
                maxlength:"最多输入500个字"
			},
			saferisk: {
				required: "安全风险不能为空",
                maxlength:"最多输入500个字"
			},
			ctrlmeasure: {
                maxlength:"最多输入500个字"
			}
			
		},
		submitHandler:function(form){
			save();
		}   
	});

	/*保存(新增或编辑)*/
	$.ajax({
		type : "post",
		url : BASE_URL + "dangersource/dssrskoper/load",
		dataType : "json",
		data :{
			operid:operid
		},
		success : function(data) {
			if (data) {
				var operActTpt = _.template($("#dssRskOperTpt").html());
				$("#dssRskOperForm").html(operActTpt(data));
				
				SelectTree.loadRiskTypeTree("typename",{
					userType:0,
					typecode:4
				},"");
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
		url : BASE_URL + "dangersource/dssrskoper/save",
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

