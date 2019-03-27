$(document).ready(function() {

	var k = 1;//整数增量
	//绑定订单信息新增按钮事件
	$("#taskItemAddBtn").on("click", function () {
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
		        "<input type='button' class='taskItemDelBtn btn btn-danger' value='删除' onclick='delItem(checkitem_" + k + ")'/>" +
		        "</td>" +
	        "</tr>"
	    );
	    ++k;
	});
	
	 //绑定中标结果信息删除按钮事件
    $(".taskItemDelBtn").on("click", function () {
        $(this).parent().parent('tr').remove();
    });
	
    $("#saveConHang").on("click",function(){
    	save();
    })
    
});

//删除一行
function delItem(id){
	$(id).parent().parent('tr').remove();
}

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
	window.top.GEventObject.fireEvent('LOAD_HID_CHECKTASK',taskItems);
	
	parent.parent.closeWin();// 关闭弹出框
}