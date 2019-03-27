$(function () {
	var otherid = GetQueryString("otherid");
	$("#ecsBadOtherForm").validate({
		rules: {
			businessinfoid: {
				required: true,
			},
			othertime: {
            	required: true
            },
            othercontent: {
            	required: true
            },
            reduce: {
            	required: true
            }
		},
		messages: {
			businessinfoid: {
				required: "企业名称不能为空"
			},
			othertime: {
            	required: "记录日期不能为空"
            },
            othercontent: {
				required: "不良内容不能为空"
			},
			reduce: {
				required: "影响扣分不能为空"
			}
		},
		submitHandler:function(form){
		   	save();
	    }   
	});
	
	$.ajax({
		type : "post",
		url : BASE_URL + "ecs/ecsbadother/load",
		dataType: "json",
		data:{
			otherid:otherid
		},
		success : function(data) {
			if (data) {
				var ecsBadOtherTpt = _.template($("#ecsBadOtherTpt").html());
				$("#ecsBadOtherForm").html(ecsBadOtherTpt(data));
				if(otherid != "null"){					
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

/*保存*/
function save(){
	$.ajax({
		type : 'post',
		url : BASE_URL + 'ecs/ecsbadother/save',
		cache : false,
		dataType : 'json',
		data : $("#ecsBadOtherForm").serializeArray(),
		global : false,
		success : function(json) {
			parent.toast(json.msg);//弹出提示信息
			parent.getActiveIFrame().reloadGrid();//重新加载
			parent.closeWin();// 关闭弹出框
		},
		error : function() {
			parent.toast("保存失败");
		}
	});
}

function GetQueryString(name)
{
     var reg = new RegExp("(^|&)"+ name +"=([^&]*)(&|$)");
     var r = window.location.search.substr(1).match(reg);
     if(r!=null)return  unescape(r[2]); return null;
}
