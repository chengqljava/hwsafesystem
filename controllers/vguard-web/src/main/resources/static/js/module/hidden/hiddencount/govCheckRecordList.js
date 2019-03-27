/**
 * 隐患排查记录管理
 */
$(function () {
	var etime = GetQueryString("etime");
	var stime = GetQueryString("stime");
	var checkresult = GetQueryString("checkresult");
	var isgov = GetQueryString("isgov");
//	SelectOption.loadDangerlevel("reportstatus");//上报状态下拉选	
    //显示操作权限按钮
    $("#tableOpers").displayOper();
    SelectTwo.initSelect2($('#entid'), BASE_URL + "enterprise/entbusinessinfo/searchEntSimpleInfo", '请选择检查对象', formatRepo, formatRepoSelection);
    //列表分页表格
    var colname = [
            "隐患排查记录id","检查对象", "检查记录名称", "检查项(项)","隐患数","已整改数","检查人员","检查时间","检查状态", "上报状态","是否政府"
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
                name: "ENTNAME",
                index: "ENTNAME",
                width: "15%",
                align: "center",
                sortable: false
            },
            {
                name: "CHECKNAME",
                index: "CHECKNAME",
                width: "15%",
                align: "center",
                sortable: false,
                /*formatter: function (cellvalue, options, obj) {
                    return '<a href="javascript:void(0);" onclick="display(\'' + obj.CHECKRECORDID + '\',\'' + obj.CHECKNAME + '\')">' + obj.CHECKNAME + '</a>';
                }*/
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
                hidden: false,
                formatter: function (cellvalue, options, obj) {
                    if(obj.CHECKSTATE == "1"){
                    	return "待检查";
                    } else if(obj.CHECKSTATE == "2") {
                    	return "检查中";
                    } else if(obj.CHECKSTATE == "3"){
                    	return "已检查";
                    } else {
                    	return "";
                    }
                }
            },
            {
				name : "REPORTSTATUS",
                index: "REPORTSTATUS",
                width: "15%",
                align: "center",
                sortable: true,
                hidden: false,
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
            }
        ];

    if (isgov=='0') {
    	colname.push("上报时间");
    	colmodel.push({name: "REPORTTIME",
            index: "REPORTTIME",
            width: "15%",
            align: "center",
            sortable: false,
            hidden: false,
            formatter: function (cellvalue, options, obj) {
            	if (cellvalue != '' || cellvalue != null ) {
            		return getSmpFormatDateByLong(obj.REPORTTIME,false);
				}else{
					return '';
				}
            }});
	}
    //分页表格响应式处理
    var tableHeight = $(window).height() - $(".pcheck").height() - 190 - 33;
    $(window).resize(function () {
        $("#grid-table").jqGrid("setGridHeight", $(window).height() - $('.pcheck').height() - 190 - 33);
        $("#grid-table").jqGrid("setGridWidth", $(window).width() * 0.99);
    });

    $("#grid-table").jqGrid({
        height: tableHeight,
        url: BASE_URL + "/hidden/hidcount/list",
        datatype: "json",
        cache: false,
        mtype: "POST",
        colNames: colname,
        colModel: colmodel,
        postData: {
        	isgov:isgov,
        	etime:etime,
    		stime:stime,
    		checkresult:checkresult
        },
        sortname: "CHECKRECORDID",
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
        caption: "隐患排查记录列表",
        autowidth: true
    });
    //显示新增页面
    $("#addBtn").off("click").on("click", function () {
        parent.openWin(BASE_URL
            + "views/module/hidden/checkRecord/govSaveOrUpdateCheckRecord.html?checkrecordid=-1",
            '新增隐患排查记录', '65%', '80%');
    });


    //点击查询
    $("#searchbtn").off("click").on("click", function () {
        reloadGrid();
    });

    //显示执行导出操作
    $("#exportBtn").off("click").on("click", function () {
        window.location.href = BASE_URL + "train/etstrnrecord/export";
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
    	var isgov = $("#grid-table").jqGrid("getRowData", curSelRowArr[0]).ISGOV;
    	if(isgov == "0"){
    		parent.toast("不能对企业自查自报隐患进行编辑！");
            return;
    	}
        //打开编辑页面
        var checkrecordid = $("#grid-table").jqGrid("getRowData", curSelRowArr[0]).CHECKRECORDID;

        parent.openWin(BASE_URL + "views/module/hidden/checkRecord/govSaveOrUpdateCheckRecord.html?checkrecordid=" + checkrecordid,
            "编辑隐患排查记录", "65%", "80%");
    });


    /*重置*/
    $("#resetbtn").bind("click", function () {
//        $("#businessinfoid").val(null).trigger("change");
        $("#searchForm").each(function () {
            $(this).val("");
        })
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
            var checkrecordid = $("#grid-table").jqGrid("getRowData", curSelRecordArr[i]).CHECKRECORDID;
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
				titlename, "70%", "80%");
	}else if(flag == "YHLB"){
		titlename="隐患列表";
		parent.openWin(BASE_URL + "views/module/hidden/checkRecord/hidDangerInfo.html?checkrecordid=" + checkrecordid+"&flag=YHLB",
				titlename, "70%", "80%");
	}else{
		titlename="已整改隐患列表";
		parent.openWin(BASE_URL + "views/module/hidden/checkRecord/hidDangerInfo.html?checkrecordid=" + checkrecordid+"&flag=YZGLB",
				titlename, "70%", "80%");
	} 
}

function display(checkrecordid, checkname) {
    parent.openWin(BASE_URL + "views/module/hidden/checkRecord/displayEntCheckRecord.html?checkrecordid=" + checkrecordid,
    		checkname, "72%", "80%");
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
    var checktime = $("#checktime").val();
    $("#grid-table").jqGrid("setGridParam", {
        page: 1,
        postData: {
        	entid: entid || '',
        	checkname: checkname || '',
        	checktime: checktime || ''
        }
    }).trigger("reloadGrid");
}