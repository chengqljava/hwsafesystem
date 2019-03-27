$(document).ready(function() {
    SelectOption.loadDefendType("detype");//防护类型
    $("#ochcureform").validate({
        rules : {
        	dename : {
                required : true
            },
            model : {
                required : true
            },
            quantity : {
                required : true
            },
            updatetime : {
                required : true
            },
            place : {
                required : true
            },
            preserver : {
                required : true
            },
            detype : {
                required : true
            }
        },
        messages : {
        	dename : {
                required : "设备名称不能为空"
            },
            model : {
                required : "设备型号不能为空"
            },
            quantity : {
                required : "设备数量不能为空"
            },
            updatetime : {
                required : "购进日期不能为空"
            },
            place : {
                required : "存放地点不能为空"
            },
            preserver : {
                required : "保管人不能为空"
            },
            detype : {
                required : "防护表类型不能为空"
            }
        },
        submitHandler : function(form) {
            save();
        }
    });
});

/**保存*/
function save() {
	
    $.ajax({
        type : 'post',
        url : BASE_URL + '/health/ochdefend/save',
        cache : false,
        dataType : 'json',
        data : $("#ochcureform").serializeArray(),
        global : false,
        success : function(json) {
            if (json.success == true) {
                parent.toast(json.msg); //弹出提示信息
                parent.getActiveIFrame().reloadGrid(); //刷新列表
                parent.closeWin(); // 关闭弹出框
            } else {
                parent.toast(json.msg);
            }
        },
        error : function() {
            parent.toast("保存失败");
        }
    });
}