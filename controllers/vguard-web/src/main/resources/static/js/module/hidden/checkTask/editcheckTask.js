$(document).ready(function() {
	var checktaskid = GetQueryString("checktaskid");
	//查询
	$.ajax({
		type : "post",
		url : BASE_URL + "hidden/hidchecktask/load/" + checktaskid,
		data : {},
		success : function(data) {
			if (data) {
				
				var checkTaskTpt = _.template($("#checkTaskTpt").html());
				$("#checkTaskForm").html(checkTaskTpt(data));
				if (data.isenable == "1" ||data.isenable == '' ||data.isenable == null) {
					$("#isenable").attr("checked",true);
				}else{
					$("#notIsenable").attr("checked",true);
				}
				
				var k = 0;//整数增量
				//绑定订单信息新增按钮事件
				$("#checkTaskForm").delegate("#taskItemAddBtn", "click", function () {
				    $("#taskItemsTab").append(
				        "<tr>" +
					        "<td align='left'>" +
					        "<input id='checkitem_" + k + "' name='checkitem' class='form-control formWidth' type='text' />" +
					        "</td>" +
					        "<td align='left'>" +
					        "<input id='checkcontent_" + k + "' name='checkcontent' class='form-control formWidth' type='text' />" +
					        "</td>" +
					        "<td align='left'>" +
					        "<input id='checkrequire_" + k + "' name='checkrequire' class='form-control formWidth' type='text' />" +
					        "</td>" +
					        "<td align='left'>" +
					        "<input id='fromway_" + k + "' name='fromway' class='form-control formWidth' type='text'/>" +
					        "</td>" +
					        "<td align='center'>" +
					        "<input type='button' class='taskItemDelBtn btn btn-danger' value='删除' />" +
					        "</td>" +
				        "</tr>"
				    );
				    ++k;
				});
				
				 //绑定中标结果信息删除按钮事件
                $("#checkTaskForm").delegate(".taskItemDelBtn", "click", function () {
                    $(this).parent().parent().remove();
                });
				
				$("#checkTaskForm").validate({
					rules: {
						checktaskname: {
							required: true,
						}
					},
					messages: {
						checktaskname: {
							required: "任务名称不能为空"
						}
					},
					submitHandler:function(form){
					   	save();
				    }   
				});
			}
		},
		error: function () {
            parent.toast("初始化信息加载失败!");
        }
	});
});

/*保存(新增或编辑)*/
function save(){
	var taskItems = [];
	var $taskItems = $("#taskItemsTab tr");
	if ($taskItems.size() > 0) {
		for (var n = 0; n < $taskItems.size(); n++) {
			var checkitem = $($taskItems[n]).find("input[name='checkitem']").val(),
			checkcontent = $($taskItems[n]).find("input[name='checkcontent']").val(),
			checkrequire = $($taskItems[n]).find("input[name='checkrequire']").val(),
			fromway = $($taskItems[n]).find("input[name='fromway']").val();
			
			if ($.trim(checkitem) == "" && $.trim(checkcontent) == "" && $.trim(checkrequire) == "" && $.trim(fromway) == "") {
				parent.toast("新增检查清单行至少填写一项才可保存！")
				return;
			}
			taskItems.push({
	            "checkitem": checkitem,
	            "checkcontent": checkcontent,
	            "checkrequire": checkrequire,
	            "fromway": fromway
	        });
		}
	}
	var taskItemList = {name: 'taskItemList', value: JSON.stringify(taskItems)};
	var formdata = $("#checkTaskForm").serializeArray();
	formdata.push(taskItemList);
	$.ajax({
		type : 'post',
		url : BASE_URL + 'hidden/hidchecktask/save',
		dataType : 'json',
		data : formdata,
		success : function(json) {
			if (json.success == true) {
				parent.toast(json.msg);//弹出提示信息
				parent.getActiveIFrame().reloadGrid();//重新加载
				parent.closeWin();// 关闭弹出框
			} else {
				parent.toast(json.msg);
			}
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
