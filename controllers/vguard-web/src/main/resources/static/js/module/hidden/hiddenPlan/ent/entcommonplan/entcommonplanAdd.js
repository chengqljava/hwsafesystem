
//勾选检查项
var checkTaskArr = [];

$(function () {

	var checkplanid = getQueryString("checkplanid");		
//	时间轴上的点击事件
    $('body').on('click', '.timeMark', function () {
        var index = $(this).data('index');
        var sIndex = $('li.selected:last').data('index');
        if (index > sIndex) {
            return 0;
        }
        timeShowOrHide(index);
    });
  
    //三层参数返回按钮点击事件
    $('#xielouTypeRetBtn').on('click', function () {
        $('#evnAnaFstType').hide();
        $('#evnAnaSecType').show();
        $('#evnAnaxielouType').hide();
        timeShowOrHide(1);
    });

    //一层页面模拟表单校验
    $("#checkComPlanForm").validate({
        rules: {
        	planname: {
                required: true
            },
            leader: {
                required: true
            },
            planbegintime: {
            	required: true
            },
            planendtime:{
            	required: true
            },
            checkperson: {
            	required: true
            },
            checktopic: {
            	required: true
            },
            checkresult: {
            	required: true
            }
        },
        messages: {
        	planname: {
                required: "计划名称不能为空"
            },
            leader: {
                required: "负责人不能为空"
            },
            planbegintime: {
            	required: "开始时间不能为空"
            },
            planendtime:{
            	required: "结束时间不能为空"
            },
            checkperson: {
            	required: "检查人员不能为空"
            },
            checktopic: {
            	required: "计划主题不能为空"
            },
            checkresult: {
            	required: "检查要求不能为空"
            }
        },
        submitHandler: function (form) {
            $('#evnAnaFstType').hide();
            $('#evnAnaxielouType').show();
            timeShowOrHide(2);
        }
    });
    
    //三层页面保存按钮
    $("#trdTypeSaveBtn").off("click").on("click", function () {
    	save();
    });

    var hidCheckItemes;
    
    //编辑回显
    $.ajax({
        type: "post",
        url: BASE_URL + "hidden/hidcheckplan/load",
        dataType: "json",
        data: {
        	checkplanid: checkplanid
        },
        success: function (data) {
            if (data) {
            	var checkComPlanTpt = _.template($("#checkComPlanTpt").html());
				$("#checkComPlanForm").html(checkComPlanTpt(data));

            	hidCheckItemes = data.hidCheckItemes;
            	
            }
        },
        error: function () {
            parent.toast("初始化信息加载失败!");
        },
        complete: function (){
        	goToTrdTypeAna(hidCheckItemes);
        }
    });
    
});

function save(){
	//先清除当前页面内的所有项id
	var rowIdArray = $("#taskGrid-table").jqGrid('getRowData');
	for (var i = 0; i < rowIdArray.length; i++) {
		if($.inArray(rowIdArray[i].CHECKTASKITEMID,checkTaskArr) != '-1'){			
			checkTaskArr.splice($.inArray(rowIdArray[i].CHECKTASKITEMID,checkTaskArr),1);
		}
	};
	
	//新添加勾选的id
	var curSelRowArr = $("#taskGrid-table").jqGrid("getGridParam", "selarrrow");
	if(curSelRowArr != null){		
		for (var i = 0; i < curSelRowArr.length; i++) {
			var checktaskitemid = $("#taskGrid-table").jqGrid("getRowData", curSelRowArr[i]).CHECKTASKITEMID;
			if($.inArray(checktaskitemid,checkTaskArr) == '-1'){        	
				checkTaskArr.push(checktaskitemid);
			}
		}
	}
	
    var checkItemes = [];
    $('#checkItemTable').children().each(function (i) {
        var checkItem = {};
        var isCanAdd = false;
        $(this).children().children("input").each(function () {
            if ($(this).attr('name') == 'checkitemname') {
                if ($(this).val()) {
                	checkItem.checkitem = $(this).val();
                    isCanAdd = true;
                } else {
                    return;
                }

            } else if ($(this).attr('name') == 'checkcontent') {
            	checkItem.checkcontent = $(this).val() || "";
            }
            else if ($(this).attr('name') == 'checkrequire') {
            	checkItem.checkrequire = $(this).val() || "";
            }
            else if ($(this).attr('name') == 'fromway') {
            	checkItem.fromway = $(this).val() || "";
            }
        });
        if (isCanAdd) {
        	checkItemes.push(checkItem);
        } else {
            return;
        }
        isCanAdd = false;
    });
	
	var formData = $("#checkComPlanForm").serializeArray();
	
	var taskItemList = {name: 'checkItemes', value: JSON.stringify(checkItemes).replace(/\"/g, "'")};//新建检查项
	formData.push(taskItemList);
	
	var checkTaskArrData = {name: "checkTaskArr", value: checkTaskArr};
	formData.push(checkTaskArrData);
	
    //保存操作
	$.ajax({
		type : 'post',
		url : BASE_URL + 'hidden/hidcheckplan/savecomplan',
		dataType : 'json',
		data : formData,
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

//检查模板列表
function goToTrdTypeAna(hidCheckItemes) {
	var taskList;
	$.ajax({
        type: "post",
        url: BASE_URL + "hidden/hidchecktask/tasklist",
        dataType: "json",
        data: {},
        success: function (data) {
           if (data.taskList) {
        	$("#taskList").empty();   
        	taskList = data.taskList;
           	var enable;
			$.each(data.taskList,function(index,task){
				$("#taskList").append('<tr onclick="getTaskItems(\''+task.CHECKTASKID+'\')" >' +
		            '<td style="text-align:center;" title=\''+task.CHECKTASKNAME+'\'>' +
		            	task.CHECKTASKNAME +
		            '</td>' +
		            '</tr>'
		        );
			});
           }
           initCheckTable(hidCheckItemes);
           if (taskList.length > 0) {
        	   //默认显示第一个
        	   loadTaskItemsTab(data.taskList[0].CHECKTASKID);
        	   $("#taskList tr").eq(0).addClass('active');
           }else{
        	   if (hidCheckItemes.length === 0) {
        		   $("#taskList").append('<tr id="othertaskitem" onclick="otherTaskItems()">' +
	        				'<td style="text-align:center;" title="其他检查项目">其他检查项目</td>' +	          
	        				'</tr>'
	        		);
        	   }
        	   $("#taskList tr:eq(0)").addClass('active');
        	   $("#checktasklist").hide();//隐藏检查项分页列表
       		   $("#newchecktasklist").show();//显示新增检查项
           }
           
        },
        error: function () {
            parent.toast("初始化信息加载失败!");
        }
    });
	
	$("#taskList").on('click','tr',function(){
		$("#taskList tr").removeClass('active');
		$(this).addClass('active');
	})
	
	$("#addCheckItem").on('click',function(){
		$("#taskList tr").removeClass('active');
		$("#othertaskitem").addClass('active');
		if(!$("#othertaskitem td").text()){//如果其他检查项不存在，添加新的			
			$("#taskList").append('<tr id="othertaskitem" onclick="otherTaskItems()" class="active">' +
					'<td style="text-align:center;" title="其他检查项目">其他检查项目</td>' +	          
					'</tr>'
			);
			$('#checkItemTable').append(' <tr class="singleTr" id="checkItem0">' +
	                '<td align="center" style="width:20%;">' +
	                '<input type="text" class="form-control" placeholder="请输入检查项目" id="checkitemname0" name="checkitemname" />' +
	                '</td>' +
	                '<td align="center" style="width:20%;">' +
	                '<input type="text" class="form-control" id="checkcontent0" placeholder="请输入检查内容" name="checkcontent" />' +
	                '</td>' +
	                '<td align="center" style="width:20%;">' +
	                '<input type="text" class="form-control" id="checkrequire0" placeholder="请输入检查要求" name="checkrequire" />' +
	                '</td>' +
	                '<td align="center" style="width:20%;">' +
	                '<input type="text" class="form-control" id="fromway0" placeholder="请输入依据条款" name="fromway" />' +
	                '</td>' +
	               '<td align="center" style="width:20%;">' +
	               '<a class="btn btn-danger" href="javascript:void(0);"  onclick="delCheckItemRow(\'checkItem0\')">删除</a>' +
	               '</td>' +
	               '</tr>'
	        );
		}
		$("#checktasklist").hide();//隐藏检查项分页列表
		$("#newchecktasklist").show();//显示新增检查项
		tableScrollResize();
	})
}

//绑定中标结果信息删除按钮事件
function delItem(itemid){
	$(itemid).remove();
}

function otherTaskItems(){
	$("#checktasklist").hide();//隐藏检查项分页列表
	$("#newchecktasklist").show();//显示新增检查项
	tableScrollResize();
}

/**
 * 刷新表格
 * @param checktaskid
 */
function getTaskItems(checktaskid){
	$("#checktasklist").show();
	$("#newchecktasklist").hide();
	//先清除当前页面内的所有项id
	var rowIdArray = $("#taskGrid-table").jqGrid('getRowData');
	for (var i = 0; i < rowIdArray.length; i++) {
		if($.inArray(rowIdArray[i].CHECKTASKITEMID,checkTaskArr) != '-1'){			
			checkTaskArr.splice($.inArray(rowIdArray[i].CHECKTASKITEMID,checkTaskArr),1);
		}
	};
	//重新添加勾选的id
	var curSelRowArr = $("#taskGrid-table").jqGrid("getGridParam", "selarrrow");
	for (var i = 0; i < curSelRowArr.length; i++) {
        var checktaskitemid = $("#taskGrid-table").jqGrid("getRowData", curSelRowArr[i]).CHECKTASKITEMID;
        if($.inArray(checktaskitemid,checkTaskArr) == '-1'){        	
        	checkTaskArr.push(checktaskitemid);
        }
    }
	tableScrollResize();
	reloadItemsGrid(checktaskid);
}

/**
 * 生成任务清单项列表
 */
function loadTaskItemsTab(checktaskid){
	//生成任务列表分页表格
    var colname = ["主键id", "任务id","检查项目","检查内容","检查要求","依据条款","任务名称"],
        colmodel = [
            {
                name: "CHECKTASKITEMID",
                index: "CHECKTASKITEMID",
                width: "5%",
                align: "left",
                sortable: false,
                hidden: true
            },
            {
            	name: "CHECKTASKID",
            	index: "CHECKTASKID",
            	width: "5%",
            	align: "left",
            	sortable: false,
            	hidden: true
            },
            {
            	name: "CHECKITEM",
            	index: "CHECKITEM",
            	width: "15%",
            	align: "left",
            	sortable: false,
            },
            {
            	name: "CHECKCONTENT",
            	index: "CHECKCONTENT",
            	width: "25%",
            	align: "left",
            	sortable: false,
            },
            {
            	name: "CHECKREQUIRE",
            	index: "CHECKREQUIRE",
            	width: "25%",
            	align: "left",
            	sortable: false
            },
            {
            	name: "FROMWAY",
            	index: "FROMWAY",
            	width: "20%",
            	align: "left",
            	sortable: false
            },
            {
            	name: "CHECKTASKNAME",
            	index: "CHECKTASKNAME",
            	width: "15%",
            	align: "left",
            	sortable: false
            }
        ];
    
  //分页表格响应式处理
    var tableHeight = $(window).height() - 280;
    $(window).resize(function () {
        $("#taskGrid-table").jqGrid("setGridHeight", $(window).height() - 280 );
        $("#taskGrid-table").jqGrid("setGridWidth", $(window).width() * 0.7 - 50);
    });
    $("#taskGrid-table").jqGrid({
        height: tableHeight,
        url: BASE_URL + "hidden/hidchecktaskitem/list",
        datatype: "json",
        cache: false,
        mtype: "POST",
        colNames: colname,
        colModel: colmodel,
        postData: {
        	"checktaskid":checktaskid
        },
        sortname: "CHECKITEM",
        sortorder: "desc",
        viewrecords: true,
        pager: "#taskGrid-pager",
        jsonReader: {
            root: "datas",
            total: "total",
            page: "page",
            records: "records",
            repeatitems: false
        },
        rowNum: 10,
        rowList: [100, 200, 300],
        altRows: true,
        multiselect: true,
        caption: "任务排查清单列表",
        autowidth: true,
        loadComplete: function(){   
        	$("#taskGrid-table").jqGrid("setGridWidth", $(window).width() * 0.7 - 50);
        	var rowArray = $("#taskGrid-table").jqGrid('getDataIDs');
        	var rowIdArray = $("#taskGrid-table").jqGrid('getRowData');
            for(var i = 0; i < rowArray.length; i++){
            	var rowId = rowIdArray[i].CHECKTASKITEMID
            	if($.inArray(rowId,checkTaskArr) != '-1'){        	                	
            		$("#taskGrid-table").setSelection(rowArray[i], true);
                }
        	}
        }
    });
}

/**
 * 点击左侧任务栏切换表格
 * @param checktaskid
 */
function reloadItemsGrid(checktaskid){
	$("#taskGrid-table").jqGrid("setGridParam", {
        page: 1,
        postData: {
        	checktaskid:checktaskid
        }
    }).trigger("reloadGrid");
}

/**
 * 刷新时加载查询条件
 */
function reloadGrid() {
    $("#taskGrid-table").jqGrid("setGridParam", {
        page: 1,
        postData: {
        }
    }).trigger("reloadGrid");
}

//时间轴显示控制方法
function timeShowOrHide(index) {
    $('.timeMark').each(function (i, item) {
        if (i < index) {
            $(item).addClass('selected');
        }
        else {
            $(item).removeClass('selected');
        }
    })
    switch (index) {
        case 1:
            $('#evnAnaFstType').show();
            $('#evnAnaxielouType').hide();
            break;
        case 2:
            $('#evnAnaFstType').hide();
            $('#evnAnaxielouType').show();
            break;
    }
}

// 自适应高度
function autoHeight() {
    var height = $("body").height() + 20;
    //获取iframe的id  
    var frameId = window.frameElement && window.frameElement.id || '';
//  通过iframe的id设置高度
    $(window.parent.document).find("#" + frameId).css('height', height);
}

/**
 * 获取当前url访问路径后缀参数值
 * @param name
 * @returns
 */
function getQueryString(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
    var r = window.location.search.substr(1).match(reg);
    if (r != null) return unescape(r[2]);
    return null;
}