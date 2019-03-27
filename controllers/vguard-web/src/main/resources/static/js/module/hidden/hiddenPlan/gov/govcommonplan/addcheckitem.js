/**
 * 初始化隐患排查项目列表
 * @param hidCheckItemes
 */
function initCheckTable(hidCheckItemes) {
    if (hidCheckItemes.length === 0) {
//        $('#checkItemTable').append(' <tr id="checkItem0">' +
//                '<td>' +
//                '<input type="text" class="form-control" placeholder="请输入检查项目" id="checkitemname0" name="checkitemname" />' +
//                '</td>' +
//                '<td>' +
//                '<input type="text" class="form-control" id="checkcontent0" placeholder="请输入检查内容" name="checkcontent" />' +
//                '</td>' +
//                '<td>' +
//                '<input type="text" class="form-control" id="checkrequire0" placeholder="请输入检查要求" name="checkrequire" />' +
//                '</td>' +
//                '<td>' +
//                '<input type="text" class="form-control" id="fromway0" placeholder="请输入依据条款" name="fromway" />' +
//                '</td>' +
//               '<td align="center">' +
//               '<a class="btn btn-danger" href="javascript:void(0);"  onclick="delCheckItemRow(\'checkItem0\')">删除</a>' +
//               '</td>' +
//               '</tr>'
//        );
    } else {
    	var arrTab = $("#checkItemTable tr");
    	var i;
        $.each(hidCheckItemes, function (n, hidCheckItem) {
        	if(hidCheckItem.checktaskitemid == "" || hidCheckItem.checktaskitemid == null 
        			|| hidCheckItem.checktaskitemid == 'null'){
        		if(!$("#othertaskitem td").text()){//如果其他检查项不存在，添加新的		
	        		$("#taskList").append('<tr id="othertaskitem" onclick="otherTaskItems()">' +
	        				'<td style="text-align:center;" title="其他检查项目">其他检查项目</td>' +	          
	        				'</tr>'
	        		);
        		}
        		i =  n + arrTab.length;
        		var checkitemname = hidCheckItem.checkitem || '';
        		var checkcontent = hidCheckItem.checkcontent || '';
        		var checkrequire = hidCheckItem.checkrequire || '';
        		var fromway = hidCheckItem.fromway || '';
        		$('#checkItemTable').append(' <tr class="singleTr" id="checkItem' + i + '">' +
        				'<td align="center" style="width:20%;">' +
        				'<input type="text" class="form-control" id="checkitemname' + i + '" placeholder="请输入检查项目" name="checkitemname" value="' +checkitemname+ '"/>' +
        				'</td>' +
        				'<td align="center" style="width:20%;">' +
        				'<input type="text" class="form-control" id="checkcontent' + i + '" placeholder="请输入检查内容" name="checkcontent" value="' + checkcontent + '"/>' +
        				'</td>' +
        				'<td align="center" style="width:20%;">' +
        				'<input type="text" class="form-control" id="checkrequire' + i + '" placeholder="请输入检查要求" name="checkrequire" value="' +checkrequire + '"/>' +
        				'</td>' +
        				'<td align="center" style="width:20%;">' +
        				'<input type="text" class="form-control" id="fromway' + i + '" placeholder="请输入依据条款" name="fromway" value="' + fromway + '"/>' +
        				'</td>' +
        				'<td align="center" style="width:20%;">' +
        				'<a class="btn btn-danger" id="delBtn'+i+'" href="javascript:void(0);" onclick="delCheckItemRow(\'checkItem' + i + '\')">删除</a>' +
        				'</td>' +
        				'</tr>'
        		);

        	} else {
        		checkTaskArr.push(hidCheckItem.checktaskitemid);
        	}
        });
    }
    $('#tableContent').niceScroll({
        cursorborder: "#4d86d6",
        cursorcolor: "#4d86d6",
        background: false,
        horizrailenabled: false,
        autohidemode: false
    }).show().resize();
}

function tableScrollResize(){
	$('#tableContent').niceScroll({
        cursorborder: "#4d86d6",
        cursorcolor: "#4d86d6",
        background: false,
        horizrailenabled: false,
        autohidemode: false
    }).resize();
}

//添加一行检查项
function addCheckItemRow() {
    //获取最后一个子标签的id,提取出最后的数字通过正则
    var total = $('#checkItemTable').children('tr:last-child').attr("id");
    var num;
    if (total) {
        num = parseInt(total.replace(/[^0-9]/ig, "")) + 1;
    } else {
        num = 0;
    }

    $('#checkItemTable').append(' <tr class="singleTr" id="checkItem' + num + '">' +
            '<td align="center" style="width:20%;">' +
            '<input type="text" class="form-control" id="checkitemname' +num+ '" placeholder="请输入检查项目" name="checkitemname"/>' +
            '<input type="hidden" class="form-control" id="dangerId' +num+ '"  name="dangerId" value=""/>' +
            '</td>' +
            '<td align="center" style="width:20%;">' +
            '<input type="text" class="form-control" id="checkcontent' +num + '" placeholder="请输入检查内容" name="checkcontent"/>' +
            '</td>' +
            '<td align="center" style="width:20%;">' +
            '<input type="text" class="form-control" id="checkrequire' +num+ '" placeholder="请输入检查要求" name="checkrequire"/>' +
            '</td>' +
            '<td align="center" style="width:20%;">' +
            '<input type="text" class="form-control" id="fromway' + num+ '" placeholder="请输入依据条款" name="fromway" />' +
            '</td>' +
            '<td align="center" style="width:20%;">' +
            '<a class="btn btn-danger" href="javascript:void(0);" onclick="delCheckItemRow(\'checkItem' + num + '\')">删除</a>' +
            '</td>' +
            '</tr>'
    );
    tableScrollResize();
}
//删除一行
function delCheckItemRow(code) {
    $('#checkItemTable').children('#' + code).remove();
    tableScrollResize();
}
