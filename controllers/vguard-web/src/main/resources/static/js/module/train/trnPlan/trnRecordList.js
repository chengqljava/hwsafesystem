//综合信息中截止日期
$(function () {
	GetQueryString
	
    //投诉并立案事件列表分页表格
    var colname = [
            "培训记录id", "培训名称", "培训人数", "培训时长（分钟）", "培训地点","是否已考试","是否已评估", "培训时间"],
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
            }
        ];

    //分页表格响应式处理
    var tableHeight = $(window).height() - $(".pcheck").height() - 190 - 50;
    $(window).resize(function () {
        $("#grid-table").jqGrid("setGridHeight", $(window).height() - $('.pcheck').height() - 190 - 50);
        $("#grid-table").jqGrid("setGridWidth", $(window).width() - 48);
    });

    $("#grid-table").jqGrid({
        height: tableHeight,
        width:$(window).width() - 48,
        url: BASE_URL + "train/etstrnrecord/listByPlanid",
        datatype: "json",
        cache: false,
        mtype: "POST",
        colNames: colname,
        colModel: colmodel,
        postData: {
        	planid:GetQueryString("planid")
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
        caption: "培训记录列表",
        autowidth: true,
        loadComplete : function() {
			if ($("#closeBtn").length==0) {
				$("body").append('<div id="closeBtn" class="col-sm-offset-4 col-sm-4" style="text-align: center;margin-top: 1em;margin-bottom: 1em">'+
						'<button type="button" class="backBtn" onclick="parent.closeWin();"><span>关闭</span></button>'+
				'</div>');
			}
        }
    });
});

function display(recordid, name) {
    parent.openWin(BASE_URL + "views/module/train/trnRecord/displayTrnRecord.html?recordid=" + recordid,
        name, "60%", "85%");
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