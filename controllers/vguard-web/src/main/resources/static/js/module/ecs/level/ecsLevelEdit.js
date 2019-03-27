$(function () {
	var levelid = GetQueryString("levelid");
	$("#ecsLevelForm").validate({
		rules: {
			code: {
				required: true,
			},
			typelevel: {
            	required: true
            },
            levelval: {
            	required: true
            },
            upperlimit: {
            	required: true
            },
            lowerlimit: {
            	required: true
            }
		},
		messages: {
			code: {
				required: "编号不能为空"
			},
			typelevel: {
            	required: "分类级别不能为空"
            },
            levelval: {
				required: "级别值不能为空"
			},
			upperlimit: {
				required: "分数上限不能为空"
			},
			lowerlimit: {
				required: "分数下限不能为空"
			}
		},
		submitHandler:function(form){
		   	save();
	    }   
	});
	
	$.ajax({
		type : "post",
		url : BASE_URL + "ecs/ecslevel/load",
		dataType: "json",
		data:{
			levelid:levelid
		},
		success : function(data) {
			if (data) {
				var ecsLevelTpt = _.template($("#ecsLevelTpt").html());
				$("#ecsLevelForm").html(ecsLevelTpt(data));
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
		url : BASE_URL + 'ecs/ecslevel/save',
		cache : false,
		dataType : 'json',
		data : $("#ecsLevelForm").serializeArray(),
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
