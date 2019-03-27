/**
 * 隐患排查记录管理
 */
$(function () {
	initSeachInput();
	initDateSeach("startTime","endTime");
	var etime = GetQueryString("etime");
//	SelectOption.loadDangerlevel("reportstatus");//上报状态下拉选	
    //显示操作权限按钮
    $("#tableOpers").displayOper();
//    SelectTwo.initSelect2($('#entid'), BASE_URL + "enterprise/entbusinessinfo/searchEntSimpleInfo", '请选择企业', formatRepo, formatRepoSelection);
    //列表分页表格
    var colname = [
            "隐患排查记录id", "检查记录名称","检查区域","检查项(项)", "隐患数","未整改数",/*"排查开始时间", "排查结束时间"*/"检查人员","检查时间","排查状态","关联计划","检查进度"
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
                sortable: false,
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
                    return '<a href="javascript:void(0);" onclick="displayHid(\'' + obj.CHECKRECORDID + '\',\'PCLB\')">' + cellvalue + '</a>';
                }
            },
            {
                name: "DANGERCOUNT",
                index: "DANGERCOUNT",
                width: "15%",
                align: "center",
                sortable: true,
                hidden: false,
                formatter: function (cellvalue, options, obj) {
                    return '<a href="javascript:void(0);" onclick="displayHid(\'' + obj.CHECKRECORDID + '\',\'YHLB\')">' + cellvalue + '</a>';
                }
            },
            {
				name : "ISOUTCOUNT",
                index: "ISOUTCOUNT",
                width: "15%",
                align: "center",
                sortable: true,
                hidden: false,
                formatter: function (cellvalue, options, obj) {
                    return '<a href="javascript:void(0);" onclick="displayHid(\'' + obj.CHECKRECORDID + '\',\'YZGLB\')">' + cellvalue + '</a>';
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
                	if (cellvalue != '' || cellvalue != null ) {
                		return getSmpFormatDateByLong(obj.CHECKTIME,false);
					}else{
						return '';
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
            },
            {
                name: "PLANNAME",
                index: "PLANNAME",
                width: "15%",
                align: "center",
                sortable: false,
                hidden: false,
                formatter: function (cellvalue, options, obj) {
                	if (cellvalue != '' && cellvalue != null ) {
                		return '<a href="javascript:void(0);" onclick="displayPlan(\'' + obj.CHECKPLANID + '\',\'' + obj.PLANNAME + '\',\'' + obj.ISCYCLE + '\')">' + cellvalue + '</a>';
					}else{
						return '--';
					}
                }
            },
            {
            	name : "progress",
                index: "progress",
                width: "13%",
                align: "center",
                sortable: true,
                formatter: function (cellvalue, options, obj) {
                	if(obj.CHECKSTATE == "1"){
                    	return '<img src="../../../../images/module/hidden/progress0.png" style="height:10px;width: 65%;" alt="0%" />';
                    } else if(obj.CHECKSTATE == "2") {
                    	return '<img src="../../../../images/module/hidden/progress50.png" style="height:10px;width: 65%;" alt="50%" />';
                    } else if(obj.CHECKSTATE == "3"){
                    	return '<img src="../../../../images/module/hidden/progress100.png" style="height:10px;width: 65%;" alt="100%" />';
                    } else {
                    	return "";
                    }
                }
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
        	issueofgov:'1'
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
        caption: "自查自报记录列表",
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
        window.location.href = BASE_URL + "hidden/hidcheckrecord/entExport";
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
//    	var reportstatus = $("#grid-table").jqGrid("getRowData", curSelRowArr[0]).REPORTSTATUS;
//    	if(reportstatus == "已上报"){
//    		parent.toast("请选择未上报的数据！");
//            return;
//    	}
        var checkstate = $("#grid-table").jqGrid("getRowData", curSelRowArr[0]).CHECKSTATE;
        if (checkstate =='3') {
        	parent.toast("请选择未完成自查的数据！");
            return;
		}
        //打开编辑页面
        var checkrecordid = $("#grid-table").jqGrid("getRowData", curSelRowArr[0]).CHECKRECORDID;

        parent.openWin(BASE_URL + "views/module/hidden/checkRecord/saveOrUpdateCheckRecord.html?checkrecordid=" + checkrecordid,
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
        	var reportstatus = $("#grid-table").jqGrid("getRowData", curSelRecordArr[i]).REPORTSTATUS;
        	if("已上报" == reportstatus){
        		// 弹出提示信息
                parent.toast("请选择未上报的数据！");
                return;
        	}
        	
        	var checkstate = $("#grid-table").jqGrid("getRowData", curSelRecordArr[i]).CHECKSTATE;
            if (checkstate !='1') {
            	parent.toast("不可删除检查中或已检查的记录！");
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
    
    //批量上报
    $("#upBtn").off("click").on("click", function () {
        // 返回当前grid中复选框所选择的数据的id
        var curSelRecordArr = $("#grid-table").jqGrid("getGridParam", "selarrrow");
        if (0 == curSelRecordArr.length) {
            // 弹出提示信息
            parent.toast("请选择需要删除的数据！");
            return;
        }

        var curSelRecordIdArr = [];
        for (var i = 0; i < curSelRecordArr.length; i++) {
        	var reportstatus = $("#grid-table").jqGrid("getRowData", curSelRecordArr[i]).REPORTSTATUS;
        	if(reportstatus == "已上报"){
        		parent.toast("请选择未上报的数据！");
                return;
        	}
            var checkrecordid = $("#grid-table").jqGrid("getRowData", curSelRecordArr[i]).CHECKRECORDID;
            curSelRecordIdArr.push(checkrecordid);
        }
        //执行删除操作
        upReps({"ids": curSelRecordIdArr.toString()});
    });
    
    /**
     * 执行上报操作
     */
    function upReps(param) {
        //弹出提示框
        parent.confirm("上报之后不能再修改，确认上报吗?", function () {
            $.ajax({
                url: BASE_URL + "hidden/hidcheckrecord/upreport",
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
    $("#checkstate").val("");
}

function seach(){
	 reloadGrid();
}
/**
 * 排查项、隐患数、已整改数列表
 * @param checkrecordid
 * @param flag
 */
function displayHid(checkrecordid,flag){
	var titlename;
	if (flag == "PCLB") {
		titlename="排查项列表";
		parent.openWin(BASE_URL + "views/module/hidden/checkRecord/hidItemInfo.html?checkrecordid=" + checkrecordid,
				titlename, "60%", "60%");
	}else if(flag == "YHLB"){
		titlename="隐患列表";
		parent.openWin(BASE_URL + "views/module/hidden/checkRecord/hidDangerInfo.html?checkrecordid=" + checkrecordid+"&flag=YHLB",
				titlename, "60%", "60%");
	}else{
		titlename="未整改隐患列表";
		parent.openWin(BASE_URL + "views/module/hidden/checkRecord/hidDangerInfo.html?checkrecordid=" + checkrecordid+"&flag=YZGLB",
				titlename, "60%", "60%");
	} 
}

function display(checkrecordid, checkname) {
    parent.openWin(BASE_URL + "views/module/hidden/checkRecord/entCheckRecordDisplay.html?checkrecordid=" + checkrecordid,
    		checkname, "60%", "60%");
}

/*计划详情*/
function displayPlan(checkplanid, checkname,iscycle) {
	if(iscycle == "0"){		
		parent.openWin(BASE_URL + "views/module/hidden/hiddenPlan/ent/entcommonplan/entcommonplanDisplay.html?checkplanid=" + checkplanid,
				checkname, "60%", "70%");
	} else {
		parent.openWin(BASE_URL + "views/module/hidden/hiddenPlan/ent/entcycleplan/entCyclePlanDisplay.html?checkplanid=" + checkplanid,
				checkname, "60%", "70%");
	}
}

//function displayTrainUsers(recordid, name) {
//    parent.openWin(BASE_URL + "views/module/train/trnRecord/displayTrnUsers.html?recordid=" + recordid,
//        name, "50%", "40%");
//}

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
//    var reportstatus = $('#reportstatus').val();
    var checktime = $("#checktime").val();
//    var reporttime = $("#reporttime").val();
    var planname = $("#planname").val();
    var checkstate = $("#checkstate").val();
    if (checkstate =="待排查") {
    	checkstate = "1"
	}else if(checkstate =="排查中"){
		checkstate = "2"
	}else if(checkstate =="排查完"){
		checkstate = "3"
	}
    $("#grid-table").jqGrid("setGridParam", {
        page: 1,
        postData: {
        	checkname: checkname || '',
//        	reportstatus: reportstatus || '',
        	checktime: checktime || '',
//        	reporttime: reporttime || ''
        	planname: planname || '',
        	checkstate : checkstate || ''	
        }
    }).trigger("reloadGrid");
}