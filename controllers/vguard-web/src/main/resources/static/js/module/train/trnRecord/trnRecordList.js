//综合信息中截止日期
$(function () {
	initSeachInput();
	var etime = GetQueryString("etime");
    //显示操作权限按钮
    $("#tableOpers").displayOper();
    SelectTwo.initSelect2($('#entid'), BASE_URL + "enterprise/entbusinessinfo/searchEntSimpleInfo", '请选择企业', formatRepo, formatRepoSelection);
//    SelectOption.loadTrainTypeResult('traintype');
    //投诉并立案事件列表分页表格
    var colname = [
            "培训记录id", "培训名称",/*"企业名称",*/ "培训人数", "培训时长（分钟）", "培训地点","是否已考试","是否已评估", "培训时间","关联培训计划","操作"
        ],
        colmodel = [
            {
                name: "RECORDID",
                index: "RECORDID",
                width: "15%",
                align: "center",
                sortable: false,
                hidden: true
            },
            {
                name: "TRANINAME",
                index: "TRANINAME",
                width: "15%",
                align: "center",
                sortable: false,
                formatter: function (cellvalue, options, obj) {
                    return '<a href="javascript:void(0);" onclick="display(\'' + obj.RECORDID + '\',\'' + obj.TRANINAME + '\')">' + obj.TRANINAME + '</a>';
                }
            },
            /*{
                name: "ENTNAME",
                index: "ENTNAME",
                width: "15%",
                align: "center",
                sortable: false
            },*/
            {
                name: "TRAINNUM",
                index: "TRAINNUM",
                width: "8%",
                align: "center",
                sortable: true,
                hidden: false,
                formatter: function (cellvalue, options, obj) {
                    return '<a href="javascript:void(0);" onclick="displayTrainUsers(\'' + obj.RECORDID + '\')">' + cellvalue + '</a>';
                }
            },
            {
                name: "PERIOD",
                index: "PERIOD",
                width: "15%",
                align: "center",
                sortable: true,
                hidden: false

            },
            {
                name: "TRAINSITE",
                index: "TRAINSITE",
                width: "15%",
                align: "center",
                sortable: true,
                hidden: false
            },
            {
                name: "ISORNOTEXAM",
                index: "ISORNOTEXAM",
                width: "8%",
                align: "center",
                sortable: true,
                hidden: false,
                formatter: function (cellvalue, options, obj) {
                	if (cellvalue =="0") {
                		return "否";
                	}else if(cellvalue =="1"){
                		return "是";
                	}else {
                		return "";
                	}
                }
            },
            {
                name: "ISORNOTASSESS",
                index: "ISORNOTASSESS",
                width: "8%",
                align: "center",
                sortable: true,
                hidden: false,
                formatter: function (cellvalue, options, obj) {
                    if (cellvalue == "0") {
						return "否";
					}else if(cellvalue =="1"){
						return "是";
					}else {
						return "";
					}
                }
            },
            {
                name: "TRAINTIME",
                index: "TRAINTIME",
                width: "10%",
                align: "center",
                sortable: false,
                hidden: false,
                formatter: function (cellvalue, options, obj) {
                    return getFormatDateByLong(obj.TRAINTIME, "yyyy-MM-dd");
                }
            },
            {
                name: "PLANNAME",
                index: "PLANNAME",
                width: "15%",
                align: "center",
                sortable: true,
                hidden: false
            },
    		{name:'OPERATION',index:"OPERATION",width:'80px',fixed:true,align:"left",formatter:function(cellvalue, options, obj){
    			return '<a href="javascript:void(0);" title="编辑" class="operation editInfoBtn" onclick="editInfo(\''+obj.RECORDID+'\')">编辑</a><br>'
    			     + '<a href="javascript:void(0);" title="删除" class="operation delInfoBtn" onclick="delInfo(\''+obj.ISORNOTEXAM+'\',\''+obj.ISORNOTASSESS+'\',\''+obj.RECORDID+'\')">删除</a>'
    		}}
        ];

    //分页表格响应式处理
    var tableHeight = $(window).height() - $(".pcheck").height() - 190 - 33;
    $(window).resize(function () {
        $("#grid-table").jqGrid("setGridHeight", $(window).height() - $('.pcheck').height() - 190 - 33);
        $("#grid-table").jqGrid("setGridWidth", $(window).width() - 96 );
    });

    $("#grid-table").jqGrid({
        height: tableHeight,
        width: $(window).width() - 96,
        url: BASE_URL + "train/etstrnrecord/list",
        datatype: "json",
        cache: false,
        mtype: "POST",
        colNames: colname,
        colModel: colmodel,
        postData: {
        	"etime":etime,
        	"type":'gov'
        },
        sortname: "RECORDID",
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
        caption: "培训记录列表",
        //autowidth: true
    });
    //显示新增页面
    $("#addBtn").off("click").on("click", function () {
    	if (GetQueryString("privcode") == "PXJL_S_GOV") {
    		parent.openWin(BASE_URL
    				+ "views/module/train/trnRecord/saveOrUpdateTrnRecord.html?recordid=-1&privcode="+GetQueryString("privcode"),
    				'新增培训记录', '55%', '80%');
		}else{
			parent.openWin(BASE_URL
    				+ "views/module/train/trnRecord/entSaveOrUpdateTrnRecord.html?recordid=-1&privcode="+GetQueryString("privcode"),
    				'新增培训记录', '55%', '80%');
		}
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

        //打开编辑页面
        var recordid = $("#grid-table").jqGrid("getRowData", curSelRowArr[0]).RECORDID;
        if (GetQueryString("privcode") == "PXJL_S_GOV") {
        	parent.openWin(BASE_URL + "views/module/train/trnRecord/saveOrUpdateTrnRecord.html?recordid=" + recordid+"&privcode="+GetQueryString("privcode"),
        			"编辑培训记录", "55%", "80%");
        }else{
        	parent.openWin(BASE_URL + "views/module/train/trnRecord/entSaveOrUpdateTrnRecord.html?recordid=" + recordid+"&privcode="+GetQueryString("privcode"),
        			"编辑培训记录", '55%', "80%");
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

        
        var curSelRecordIdArr = [];
        for (var i = 0; i < curSelRecordArr.length; i++) {
        	var isornotexam = $("#grid-table").jqGrid("getRowData", curSelRecordArr[i]).ISORNOTEXAM;
        	if (isornotexam == '是') {
        		parent.toast("该培训记录已被引用，不可删除！");
                return;
			}
        	var isornotassess = $("#grid-table").jqGrid("getRowData", curSelRecordArr[i]).ISORNOTASSESS;
        	if (isornotassess == '是') {
        		parent.toast("该培训记录已被引用，不可删除！");
                return;
			}
            var recordid = $("#grid-table").jqGrid("getRowData", curSelRecordArr[i]).RECORDID;
            curSelRecordIdArr.push(recordid);

        }
        //执行删除操作
        delReps({"ids": curSelRecordIdArr.toString()});
    });



});
//编辑
function editInfo(recordid) {
	parent.openWin(BASE_URL + "views/module/train/trnRecord/entSaveOrUpdateTrnRecord.html?recordid=" + recordid+"&privcode="+GetQueryString("privcode"),
			"编辑培训记录", '55%', "80%");
}
// 删除
function delInfo(isornotexam,isornotassess,recordid) {
	if (isornotexam == '是') {
		parent.toast("该培训记录已被引用，不可删除！");
        return;
	}
	if (isornotassess == '是') {
		parent.toast("该培训记录已被引用，不可删除！");
        return;
	}
	//执行删除操作
	delReps({"ids": recordid});
}


/**
 * 执行删除操作
 */
function delReps(param) {
    //弹出提示框
    parent.confirm("确认删除吗?", function () {
        $.ajax({
            url: BASE_URL + "train/etstrnrecord/delete",
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
function resetData(){
	$("#trainname").val("");
    $("#planname").val("");
}

function seach(){
	 reloadGrid();
}

function display(recordid, name) {
    parent.openWin(BASE_URL + "views/module/train/trnRecord/displayTrnRecord.html?recordid=" + recordid,
        name, "55%", "60%");
}

function displayTrainUsers(recordid) {
    parent.openWin(BASE_URL + "views/module/train/trnRecord/displayTrnUsers.html?recordid=" + recordid,
        "培训签到表", "50%", "50%");
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
    $("#belongent").val(repo.id);
    return repo.text;
}

/**
 * 刷新加载培训记录分页表格数据
 */
function reloadGrid() {
    $("#grid-table").jqGrid("setGridParam", {
        page: 1,
        postData: {
            trainname:  $("#trainname").val(),
            planname: $("#planname").val(),
            etime:GetQueryString("etime")
        }
    }).trigger("reloadGrid");
}