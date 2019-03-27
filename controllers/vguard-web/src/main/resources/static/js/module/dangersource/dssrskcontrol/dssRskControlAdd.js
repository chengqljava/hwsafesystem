/*新增或编辑*/
$(function () {

	var controlid = getQueryString("controlid");
	var rskrecordid = getQueryString("rskrecordid");
	var isDisplay = getQueryString("isDisplay");
	$("#dssRskControlForm").validate({
		rules: {
			department:{
                required: true
			},
			liable:{
                required: true
			},
			phonenum:{
                required: true,
                isPhone: true
			},
			controlclass:{
                required: true
			}
		},
		messages: {
			department:{
                required: "风险管控责任部门不能为空"
            },
            liable:{
                required: "责任人不能为空"
            },
            phonenum:{
                required: "手机号码不能为空",
                isPhone: "请输入正确的号码格式"
            },
            controlclass:{
                required: "管控层级不能为空"
            }
		},
		submitHandler:function(form){
			save();
		}   
	});

	/*保存(新增或编辑)*/
	$.ajax({
		type : "post",
		url : BASE_URL + "dangersource/dssrskcontrol/load",
		dataType : "json",
		data :{
			controlid:controlid
		},
		success : function(data) {
			if (data) {
				var dssRskControlTpt = _.template($("#dssRskControlTpt").html());
				$("#dssRskControlForm").html(dssRskControlTpt(data));
				if(isDisplay != "true"){					
					SelectOption.loadControlClass("controlclass");
					$("#rskrecordid").val(rskrecordid);
				}
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
		url : BASE_URL + "dangersource/dssrskcontrol/save",
		data : $("#dssRskControlForm").serializeArray(),
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

