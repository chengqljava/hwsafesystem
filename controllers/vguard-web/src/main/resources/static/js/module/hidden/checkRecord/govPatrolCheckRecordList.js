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
    SelectTwo.initSelect2($('#entid'), BASE_URL + "enterprise/entbusinessinfo/searchEntSimpleInfo", '请选择检查对象', formatRepo, formatRepoSelection);
    //列表分页表格
    var colname = [
            "隐患排查记录id","检查对象", "检查记录名称","检查项(项)", "隐患数","未整改数",/*"排查开始时间", "排查结束时间",*/"检查人员","检查时间", "关联计划",  "检查状态","上报状态","是否政府",
        "检查进度"],
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
                name: "ENTNAME",
                index: "ENTNAME",
                width: "15%",
                align: "center",
                sortable: false,
                formatter:function(cellvalue, options, obj) { 
  				   return '<a href="javascript:void(0);" onclick="displayEnt(\''+obj.ENTID+'\',\''+obj.ENTNAME+'\')">'+obj.ENTNAME+'</a>';
                 }
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
            /*{
                name: "BEGINTIME",
                index: "BEGINTIME",
                width: "15%",
                align: "center",
                sortable: false,
                hidden: false,
                formatter: function (cellvalue, options, obj) {
                    return getFormatDateByLong(obj.BEGINTIME, "yyyy-MM-dd hh:mm:ss");
                }
            },
            {
                name: "ENDTIME",
                index: "ENDTIME",
                width: "15%",
                align: "center",
                sortable: false,
                hidden: false,
                formatter: function (cellvalue, options, obj) {
                    return getFormatDateByLong(obj.ENDTIME, "yyyy-MM-dd hh:mm:ss");
                }
            },*/
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
				name : "CHECKSTATE",
                index: "CHECKSTATE",
                width: "15%",
                align: "center",
                sortable: true,
                hidden: true,
                /*formatter: function (cellvalue, options, obj) {
                    if(obj.CHECKSTATE == "1"){
                    	return "待检查";
                    } else if(obj.CHECKSTATE == "2") {
                    	return "检查中";
                    } else if(obj.CHECKSTATE == "3"){
                    	return "已检查";
                    } else {
                    	return "";
                    }
                }*/
            },
            {
				name : "REPORTSTATUS",
                index: "REPORTSTATUS",
                width: "15%",
                align: "center",
                sortable: true,
                hidden: true,
                formatter: function (cellvalue, options, obj) {
                    if(obj.REPORTSTATUS == "0"){
                    	return "未上报";
                    } else if(cellvalue == "1"){
                    	return "已上报";
                    }else{
                    	return "政府填报";
                    }
                }
            },
            {
                name: "ISGOV",
                index: "ISGOV",
                width: "15%",
                align: "center",
                sortable: false,
                hidden: true
            },
            {
            	name : "progress",
                index: "progress",
                width: "10%",
                align: "center",
                sortable: true,
                formatter: function (cellvalue, options, obj) {
                	if(obj.CHECKSTATE == "1"){
                    	return '<img src="../../../../images/module/hidden/progress0.png" style="height:10px;width: 65%;" alt="0%" />';
                    } else if(obj.CHECKSTATE == "2") {
                    	return '<img src="../../../../images/module/hidden/progress50.png" style="height:10px;width: 65%;" alt="50%" />';
                    } else if(obj.CHECKSTATE == "3"){
                    	return '<img src="../../../../images/module/hidden/progress100.png" style="height:10px;width: 65%;" alt="100%"  />';
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
        	isgov:"1"//查询政府巡查隐患
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
        caption: "网格巡查记录列表",
        autowidth: true
    });
    //显示新增页面
    $("#addBtn").off("click").on("click", function () {
        parent.openWin(BASE_URL
            + "views/module/hidden/hidRecordManage/addOrEditCheckRecord.html?checkrecordid=-1",
            '新增隐患排查记录', '65%', '80%');
    });

    //显示执行导出操作
    $("#exportBtn").off("click").on("click", function () {
        window.location.href = BASE_URL + "hidden/hidcheckrecord/govPatrolExport";
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
        if(checkstate == 3){
        	// 弹出提示信息
            parent.toast("请选择未完成数据进行巡查！");
            return;
        } else {        	
        	var isgov = $("#grid-table").jqGrid("getRowData", curSelRowArr[0]).ISGOV;
        	if(isgov == "0"){
        		parent.toast("不能对企业自查自报隐患进行编辑！");
        		return;
        	}
        	//打开编辑页面
        	var checkrecordid = $("#grid-table").jqGrid("getRowData", curSelRowArr[0]).CHECKRECORDID;
        	
        	parent.openWin(BASE_URL + "views/module/hidden/checkRecord/govSaveOrUpdateCheckRecord.html?checkrecordid=" + checkrecordid,
        			"编辑隐患排查记录", "65%", "80%");
        }
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
        
        /**
         * 查看是否存在检查项或隐患项
         */
        
        var curSelRecordIdArr = [];
        for (var i = 0; i < curSelRecordArr.length; i++) {
            var checkrecordid = $("#grid-table").jqGrid("getRowData", curSelRecordArr[i]).CHECKRECORDID;
            var checkstate = $("#grid-table").jqGrid("getRowData", curSelRecordArr[i]).CHECKSTATE;
            if (checkstate !='1') {
            	parent.toast("不可删除检查中或已检查的记录！");
                return;
			}
            curSelRecordIdArr.push(checkrecordid);

        }
        //执行删除操作
        delReps({"ids": curSelRecordIdArr.toString()});
    });

    $("#resetbtn").off("click").on("click", function () {
        $("#entid").val(null).trigger("change");
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
	$("#entid").val(null).trigger("change");
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
				titlename,"60%", "60%");
	}else{
		titlename="未整改隐患列表";
		parent.openWin(BASE_URL + "views/module/hidden/checkRecord/hidDangerInfo.html?checkrecordid=" + checkrecordid+"&flag=YZGLB",
				titlename, "60%", "60%");
	} 
}

/*企业详细查询*/
function displayEnt(businessinfoid,entname){
	parent.openWin(BASE_URL+'views/module/enterprise/entbusinessinfo/displayEntbusinessinfo.html?businessinfoid='+businessinfoid,entname,'80%','90%');
}

function display(checkrecordid, checkname) {
    parent.openWin(BASE_URL + "views/module/hidden/checkRecord/govCheckRecordDisplay.html?checkrecordid=" + checkrecordid,
    		checkname, "55%", "45%");
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


function formatRepo(repo) {
    if (repo.loading) {
        return repo.text;
    }
    var markup = "<div class='select2-result-repository clearfix'>" + repo.text + "</div>";

    return markup;
}

function formatRepoSelection(repo) {
    $("#entid").val(repo.id);
    return repo.text;
}

/**
 * 刷新加载分页表格数据
 */
function reloadGrid() {
    var checkname = $('#checkname').val();
    var entid = $('#entid').val();
    var planname = $("#planname").val();
    var checkstate = $("#checkstate").val();
    if (checkstate =="待排查") {
    	checkstate = "1"
	}else if(checkstate =="排查中"){
		checkstate = "2"
	}else if(checkstate =="排查完"){
		checkstate = "3"
	}
    var stime = $("#startTime").val();
	var etime = $("#endTime").val();
    $("#grid-table").jqGrid("setGridParam", {
        page: 1,
        postData: {
        	entid: entid || '',
        	checkname: checkname || '',
        	planname: planname || '',
        	checkstate: checkstate || '',
        	stime: stime || '',
        	etime: etime || ''
        }
    }).trigger("reloadGrid");
}