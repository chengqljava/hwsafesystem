/**
 * 隐患排查记录管理
 */
$(function () {
	initSeachInput();
	initDateSeach("startTime","endTime");
    //显示操作权限按钮
    $("#tableOpers").displayOper();
    //列表分页表格
    var colname = [
            "隐患排查记录id","检查记录名称","检查区域","检查项(项)","检查人员","检查时间","关联计划","检查进度","检查状态"
        ],
        colmodel = [
            {
                name: "CHECKRECORDID",
                index: "CHECKRECORDID",
                width: "15%",
                align: "center",
                sortable: false,
                hidden: true
            },
            {
                name: "CHECKNAME",
                index: "CHECKNAME",
                width: "15%",
                align: "center",
                sortable: false,
                formatter: function (cellvalue, options, obj) {
                    return '<a href="javascript:void(0);" onclick="display(\'' + obj.CHECKRECORDID + '\',\'' + obj.CHECKNAME + '\')">' + obj.CHECKNAME + '</a>';
                }
            },
            {
                name: "CHECKAREA",
                index: "CHECKAREA",
                width: "15%",
                align: "center",
                sortable: true,
                formatter: function (cellvalue, options, obj) {
                	if (cellvalue != '' && cellvalue != null ) {
                		return obj.CHECKAREA;
					}else{
						return '--';
					}
                }
            },
            {
                name: "ITEMCOUNT",
                index: "ITEMCOUNT",
                width: "15%",
                align: "center",
                sortable: true,
                hidden: false,
                formatter: function (cellvalue, options, obj) {
                    return '<a href="javascript:void(0);" onclick="displayHid(\'' + obj.CHECKRECORDID + '\')">' + cellvalue + '</a>';
                }
            },
            {
                name: "CHECKUSERS",
                index: "CHECKUSERS",
                width: "15%",
                align: "center",
                sortable: false
            },
            {
                name: "CHECKTIME",
                index: "CHECKTIME",
                width: "15%",
                align: "center",
                sortable: false,
                hidden: false,
                formatter: function (cellvalue, options, obj) {
                	if (obj.CHECKTIME != '' && obj.CHECKTIME != null ) {
                		return getSmpFormatDateByLong(obj.CHECKTIME,false);
					}else{
						return '--';
					}
                }
            },
            {
                name: "PLANNAME",
                index: "PLANNAME",
                width: "15%",
                align: "center",
                sortable: false,
                hidden: false,
                formatter: function (cellvalue, options, obj) {
                	if (obj.PLANNAME != '' && obj.PLANNAME != null ) {
                		return '<a href="javascript:void(0);" onclick="displayPlan(\'' + obj.CHECKPLANID + '\',\'' + obj.PLANNAME + '\',\'' + obj.ISCYCLE + '\')">' + cellvalue + '</a>';
					}else{
						return '--';
					}
                }
            },
            {
            	name : "progress",
                index: "progress",
                width: "12%",
                align: "center",
                sortable: true,
                formatter: function (cellvalue, options, obj) {
                	if(obj.CHECKSTATE == "1"){
                    	return '<img src="../../../../images/module/hidden/progress0.png"  style="height:10px;width: 65%;" alt="0%" />';
                    } else if(obj.CHECKSTATE == "2") {
                    	return '<img src="../../../../images/module/hidden/progress50.png" style="height:10px;width: 65%;" alt="50%" />';
                    } else if(obj.CHECKSTATE == "3"){
                    	return '<img src="../../../../images/module/hidden/progress100.png" style="height:10px;width: 65%;" alt="100%" />';
                    } else {
                    	return "";
                    }
                }
            },
            {
				name : "CHECKSTATE",
                index: "CHECKSTATE",
                width: "15%",
                align: "center",
                sortable: true,
                hidden: true
            }
        ];

    //分页表格响应式处理
    var tableHeight = $(window).height() - $(".pcheck").height() - 190 - 33;
    $(window).resize(function () {
        $("#grid-table").jqGrid("setGridHeight", $(window).height() - $('.pcheck').height() - 190 - 33);
        $("#grid-table").jqGrid("setGridWidth", $(window).width() * 0.99);
    });

    $("#grid-table").jqGrid({
        height: tableHeight,
        url: BASE_URL + "hidden/hidcheckrecord/list",
        datatype: "json",
        cache: false,
        mtype: "POST",
        colNames: colname,
        colModel: colmodel,
        postData: {
        },
        sortname: "CREATETIME",
        sortorder: "desc",
        viewrecords: true,
        pager: "#grid-pager",
        jsonReader: {
            root: "datas",
            total: "total",
            page: "page",
            records: "records",
            repeatitems: false
        },
        rowNum: 10,
        rowList: [10, 20, 30],
        altRows: true,
        multiselect: true,
        caption: "检查表管理",
        autowidth: true
    });
    //显示新增页面
    $("#addBtn").off("click").on("click", function () {
        parent.openWin(BASE_URL
            + "views/module/hidden/hidRecordManage/entAddOrEditCheckRecord.html?checkrecordid=-1",
            '新增隐患排查记录', '65%', '80%');
    });

    //显示执行导出操作
    $("#exportBtn").off("click").on("click", function () {
        window.location.href = BASE_URL + "hidden/hidcheckrecord/govExport";
    });

    //显示编辑页面
    $("#editBtn").off("click").on("click", function () {
        //返回当前grid中复选框所选择的数据的id
        var curSelRowArr = $("#grid-table").jqGrid("getGridParam", "selarrrow");
        if (1 != curSelRowArr.length) {
            // 弹出提示信息
            parent.toast("请选择一条数据进行编辑！");
            return;
        }
    	var checkstate = $("#grid-table").jqGrid("getRowData", curSelRowArr[0]).CHECKSTATE;
    	if (checkstate == '3') {
    		parent.toast("该检查表已检查完成，不可编辑！");
            return;
		}
        //打开编辑页面
        var checkrecordid = $("#grid-table").jqGrid("getRowData", curSelRowArr[0]).CHECKRECORDID;

        parent.openWin(BASE_URL + "views/module/hidden/hidRecordManage/entAddOrEditCheckRecord.html?checkrecordid="+checkrecordid,
            "编辑隐患排查记录", "65%", "80%");
    });


    //批量删除
    $("#delBtn").off("click").on("click", function () {
        // 返回当前grid中复选框所选择的数据的id
        var curSelRecordArr = $("#grid-table").jqGrid("getGridParam", "selarrrow");
        if (0 == curSelRecordArr.length) {
            // 弹出提示信息
            parent.toast("请选择需要删除的数据！");
            return;
        }

        var curSelRecordIdArr = [];
        for (var i = 0; i < curSelRecordArr.length; i++) {
        	var checkstate = $("#grid-table").jqGrid("getRowData", curSelRecordArr[i]).CHECKSTATE;
        	if (checkstate == '3' || checkstate == '2') {
        		parent.toast("检查中、已检查数据不可删除！");
                return;
			}
            var checkrecordid = $("#grid-table").jqGrid("getRowData", curSelRecordArr[i]).CHECKRECORDID;
            curSelRecordIdArr.push(checkrecordid);

        }
        //执行删除操作
        delReps({"ids": curSelRecordIdArr.toString()});
    });
    /**
     * 执行删除操作
     */
    function delReps(param) {
        //弹出提示框
        parent.confirm("确认删除吗?", function () {
            $.ajax({
                url: BASE_URL + "hidden/hidcheckrecord/delete",
                type: "post",
                dataType: "json",
                data: param,
                success: function (json) {
                    if (json.success == true) {
                        parent.toast(json.msg);
                        reloadGrid();// 刷新列表
                    } else {
                        parent.toast(json.msg);
                    }
                }
            });
        });
    }
    
});
function resetData(){
	$('#daterange-btn span').html(" 日期选择");
	$("#startTime").val("");
	$("#endTime").val("");
    $("#checkname").val("");
    $("#planname").val("");
}

function seach(){
	 reloadGrid();
}

/**
 * 排查项、隐患数、已整改数列表
 * @param checkrecordid
 * @param flag
 */
function displayHid(checkrecordid){
		parent.openWin(BASE_URL + "views/module/hidden/checkRecord/hidItemInfo.html?checkrecordid=" + checkrecordid,
				"排查项列表", "70%", "80%");
}

function display(checkrecordid, checkname) {
    parent.openWin(BASE_URL + "views/module/hidden/checkRecord/entCheckRecordDisplay.html?checkrecordid=" + checkrecordid,
    		checkname, "60%", "50%");
}

/*计划详情*/
function displayPlan(checkplanid, checkname,iscycle) {
	if(iscycle == "0"){		
		parent.openWin(BASE_URL + "views/module/hidden/hiddenPlan/gov/govcommonplan/govcommonplanDisplay.html?checkplanid=" + checkplanid,
				checkname, "60%", "70%");
	} else {
		parent.openWin(BASE_URL + "views/module/hidden/hiddenPlan/gov/govcycleplan/govCyclePlanDisplay.html?checkplanid=" + checkplanid,
				checkname, "60%", "70%");
	}
}

function GetQueryString(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
    var r = window.location.search.substr(1).match(reg);
    if (r != null)return unescape(r[2]);
    return null;
}

/**
 * 刷新加载分页表格数据
 */
function reloadGrid() {
	var checkname = $('#checkname').val();
    var planname = $("#planname").val();
    var stime = $("#startTime").val();
	var etime = $("#endTime").val();
    $("#grid-table").jqGrid("setGridParam", {
        page: 1,
        postData: {
        	checkname: checkname || '',
        	planname: planname || '',
        	stime: stime || '',
        	etime: etime || '',
        }
    }).trigger("reloadGrid");
}