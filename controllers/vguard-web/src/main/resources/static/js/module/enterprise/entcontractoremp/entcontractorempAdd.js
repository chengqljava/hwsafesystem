/*新增或编辑课程管理*/
$(function () {
	var contractorempid = getQueryString("contractorempid");
	$("#contactorForm").validate({
			rules: {
                entcontractorname: {
					required: true
				}
			},
			messages: {
                entcontractorname: {
					required: "承包商名称不能为空"
				}
			},
			submitHandler:function(form){
			   	save();
		    }
		});
	
	//查询
	$.ajax({
		type : "post",
		url : BASE_URL + "enterprise/entcontractoremp/load",
		dataType : "json",
		data :{
            contractorempid:contractorempid
		},
		success : function(data) {
			if (data) {
				var contactorTpt = _.template($("#contactorTpt").html());
				$("#contactorForm").html(contactorTpt(data));

                showUploadFile("fileDiv","image",false,true);
                SelectOption.loadContractor("contractorid");
			}
		},
		error : function() {
			parent.toast("初始化信息加载失败");
		}
	});
});

/*保存(新增或编辑)*/
function save(){

    var uplist = $("input[name^=file]");
    var arrId = [];
    for (var i = 0; i < uplist.length; i++) {
        if (uplist[i].value) {
            arrId[i] = uplist[i].id;
        }
    }
    $.ajaxFileUpload({
        type: "post",
        url: BASE_URL + "enterprise/entcontractoremp/save",
        files: arrId,
        dataType: "json",
        data: $("#contactorForm").serializeArray(),
        success: function (data) {
            if (data.success == true) {
                parent.toast(data.msg);//弹出提示信息
                parent.getActiveIFrame().reloadGrid();//重新加载
                parent.closeWin();// 关闭弹出框
            } else {
                parent.toast(data.msg);
            }
        },
        error: function () {
            parent.toast("保存失败");
        }
    });
}

function getQueryString(name)
{
     var reg = new RegExp("(^|&)"+ name +"=([^&]*)(&|$)");
     var r = window.location.search.substr(1).match(reg);
     if(r!=null)return  unescape(r[2]); return null;
}