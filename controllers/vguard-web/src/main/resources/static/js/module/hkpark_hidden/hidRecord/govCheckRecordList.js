/**
 * 隐患排查记录管理
 */
$(function () {
	initSeachInput();
	initDateSeach("startTime","endTime");
    //显示操作权限按钮
    $("#tableOpers").displayOper();
    //列表分页表格
    var colname = ["隐患排查记录id","检查对象","检查区域","检查部位","检查人员", "检查时间","隐患数(个)","检查类型"],
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
                	if (cellvalue) {
                		return '<a href="javascript:void(0);" onclick="displayEnt(\''+obj.ENTID+'\',\''+obj.ENTNAME+'\')">'+cellvalue+'</a>';
					}else{
						return '--';
					}
                }
            },
            {
                name: "CHECKAREA",
                index: "CHECKAREA",
                width: "15%",
                align: "center",
                sortable: false,
                formatter:function(cellvalue, options, obj) { 
                	if (cellvalue) {
                		return cellvalue;/*'<a href="javascript:void(0);" onclick="displayEnt(\''+obj.ENTID+'\',\''+obj.CHECKAREA+'\')">'+cellvalue+'</a>';*/
					}else{
						return '--';
					} 				   
                }
            },
            {
                name: "CHECKPART",
                index: "CHECKPART",
                width: "15%",
                align: "center",
                sortable: false,
                formatter: function (cellvalue, options, obj) {
                	if (cellvalue) {
                		return cellvalue;/*'<a href="javascript:void(0);" onclick="display(\'' + obj.CHECKRECORDID + '\',\'' + obj.CHECKNAME + '\')">' + cellvalue + '</a>';*/
					}else{
						return '--';
					}
                }
            },
            {
                name: "CHECKUSERS",
                index: "CHECKUSERS",
                width: "15%",
                align: "center",
                sortable: false,
               formatter: function (cellvalue, options, obj) {
            	   	var name='检查详情';
            		return '<a href="javascript:void(0);" onclick="display(\'' + obj.CHECKRECORDID + '\',\'' + name + '\')">' + cellvalue + '</a>';
               }
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
                name: "CHECKTYPE",
                index: "CHECKTYPE",
                width: "15%",
                align: "center",
                sortable: true,
                hidden: false,
                formatter: function (cellvalue, options, obj) {
                    if (cellvalue == '1') {
						return '园区';
					}else{
						return '企业';
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
        postData: {},
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
        caption: "检查记录列表",
        autowidth: true
    });
    //显示新增页面
    $("#addBtn").off("click").on("click", function () {
        parent.openWin(BASE_URL
            + "views/module/hkpark_hidden/hidRecord/govSaveOrUpdateCheckRecord.html?checkrecordid=-1",
            '新增检查记录', '65%', '80%');
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
    	var isgov = $("#grid-table").jqGrid("getRowData", curSelRowArr[0]).ISGOV;
    	if(isgov == "0"){
    		parent.toast("不能对企业自查自报隐患进行编辑！");
            return;
    	}
        //打开编辑页面
        var checkrecordid = $("#grid-table").jqGrid("getRowData", curSelRowArr[0]).CHECKRECORDID;

        parent.openWin(BASE_URL + "views/module/hkpark_hidden/hidRecord/govSaveOrUpdateCheckRecord.html?checkrecordid=" + checkrecordid,
            "编辑检查记录", "65%", "80%");
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

function seach(){
	 reloadGrid();
}

function resetData(){
	$('#daterange-btn span').html(" 日期选择");
	$("#startTime").val("");
	$("#endTime").val("");
    $("#checkusers").val("");
    $("#checkarea").val("");
    $("#checktype").val("");
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
		parent.openWin(BASE_URL + "views/module/hkpark_hidden/hidRecord/hidItemInfo.html?checkrecordid=" + checkrecordid,
				titlename, "70%", "80%");
	}else if(flag == "YHLB"){
		titlename="隐患列表";
		parent.openWin(BASE_URL + "views/module/hkpark_hidden/hidRecord/hidDangerInfo.html?checkrecordid=" + checkrecordid+"&flag=YHLB",
				titlename, "70%", "80%");
	}else{
		titlename="已整改隐患列表";
		parent.openWin(BASE_URL + "views/module/hidden/checkRecord/hidDangerInfo.html?checkrecordid=" + checkrecordid+"&flag=YZGLB",
				titlename, "70%", "80%");
	} 
}

/*企业详细查询*/
function displayEnt(businessinfoid,entname){
	parent.openWin(BASE_URL+'views/module/enterprise/entbusinessinfo/displayEntbusinessinfo.html?businessinfoid='+businessinfoid,entname,'80%','90%');
}

function display(checkrecordid, checkname) {
    parent.openWin(BASE_URL + "views/module/hkpark_hidden/hidRecord/checkRecordDisplay.html?checkrecordid=" + checkrecordid,
    		checkname, "60%", "50%");
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

/**
 * 刷新加载分页表格数据
 */
function reloadGrid() {
	var checktype = $('#checktype').val();
	if (checktype == '园区') {
		checktype = '1'
	}else if(checktype == '企业'){
		checktype = '2'
	}
    $("#grid-table").jqGrid("setGridParam", {
        page: 1,
        postData: {
        	checkarea: $('#checkarea').val() || '',
        	checkusers: $('#checkusers').val() || '',
        	stime: $('#startTime').val() || '',
        	etime: $('#endTime').val() || '',
        	checktype:checktype
        }
    }).trigger("reloadGrid");
}