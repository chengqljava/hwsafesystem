
$(function () {		
	var id = getQueryString("id");
	$("#id").val(id);

	$("#collectionForm").validate({
		rules: {
			handler:{
				required: true
			}
		},
		messages: {
            handler:{
				required: "处理人不能为空"
			}
		},
		submitHandler:function(form){
			save();
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
	
function save() {

    $.ajax({
        type: "post",
        url: BASE_URL + "epi/epialaram/handleHbMsg",
        data: $("#collectionForm").serializeArray(),
        cache : false,
        dataType: "json",
        global : false,
        success: function (data) {
        	if (data.success == true) {
        		parent.toast("保存成功");//弹出提示信息
                parent.closeWin();// 关闭弹出框
            } else {
                parent.toast(data.msg);
            }
        },
        error: function (XMLHttpRequest, textStatus, errorThrown) {
        	console.log(textStatus);
            parent.toast("提交失败");
        }
    });
}
