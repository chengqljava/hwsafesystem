$(document).ready(function (){
	var riskrating = getQueryString("riskrating");
	$("#riskrating").val(riskrating);
	    // $("#mestableOpers").displayOper();
//	    SelectTwo.initSelect2($('#belongent'), BASE_URL + "enterprise/entbusinessinfo/searchEntSimpleInfo", '请选择企业', formatRepo, formatRepoSelection);

	    $("#tabs").tabs();

	    initLecTable();
	    initMesTable();

//	    $("#resetbtn").off("click").on("click", function () {
//	        $('#belongent').val(null).trigger('change');
//
//	    });
//
//	    //点击查询
//	    $("#searchbtn").off("click").on("click", function () {
//	        reloadGrid();
//	    });

	});


	function initLecTable() {
	    //生成任务列表分页表格
	    var leccolname = ["风险记录id", /*"所属单位",*/ "场所区域", "岗位/设备", "安全风险", "危险因素", /*"事故发生的可能性(L)", "人员暴露于危险环境的频繁程度(E)", "发生事故可能造成的后果(C)", */"风险等级"],
	        leccolmodel = [
	            {
	                name: "RSKRECORDID",
	                index: "RSKRECORDID",
	                width: "5%",
	                align: "left",
	                sortable: false,
	                hidden: true
	            },
//	            {
//	                name: "BUSINESSINFONAME",
//	                index: "BUSINESSINFONAME",
//	                width: "15%",
//	                align: "left",
//	                sortable: false,
//	                formatter: function (cellvalue, options, obj) {
//	                    return '<a href="javascript:void(0);" onclick="display(\'' + obj.RSKRECORDID + '\')">' + obj.BUSINESSINFONAME + '</a>';
//	                }
//	            },
	            {
	                name: "PLACEAREANAME",
	                index: "PLACEAREANAME",
	                width: "10%",
	                align: "left",
	                sortable: true,
	                formatter: function (cellvalue, options, obj) {
	                    return '<a href="javascript:void(0);" onclick="display(\'' + obj.RSKRECORDID + '\')">' + obj.PLACEAREANAME + '</a>';
	                }
	            },
	            {
	                name: "SPECIFICNAME",
	                index: "SPECIFICNAME",
	                width: "10%",
	                align: "left",
	                sortable: true
	            },
	            {
	                name: "EVENTCATEGORYNAME",
	                index: "EVENTCATEGORYNAME",
	                width: "10%",
	                align: "left",
	                sortable: true
	            },
	            {
	                name: "RISKFACTOR",
	                index: "RISKFACTOR",
	                width: "15%",
	                align: "left",
	                sortable: false,
	                hidden: false
	            },
	            /*{
	                name: "LIKELIHOOD",
	                index: "LIKELIHOOD",
	                width: "10%",
	                align: "left",
	                sortable: false,
	                hidden: false
	            },
	            {
	                name: "EXPOSURE",
	                index: "EXPOSURE",
	                width: "10%",
	                align: "left",
	                sortable: false,
	                hidden: false
	            },
	            {
	                name: "CONSEQUENCE",
	                index: "CONSEQUENCE",
	                width: "10%",
	                align: "left",
	                sortable: false,
	                hidden: false
	            },*/
	            {
	                name: "RISKRATING",
	                index: "RISKRATING",
	                width: "10%",
	                align: "center",
	                sortable: false,
	                hidden: false,
	                formatter: function (cellvalue, options, obj) {
	                    if (obj.RESULTID) {

	                        if (obj.RISKRATING == '重大风险') {

	                            return '<a href="javascript:void(0);" style="color: rgba(255,0,3,1);" onclick="showRiskRatingInfo(\'' + obj.RSKRECORDID + '\')">' + obj.RISKRATING + '</a>';
	                        } else if (obj.RISKRATING == '较大风险') {

	                            return '<a href="javascript:void(0);" style="color: rgba(255,111,0,1);" onclick="showRiskRatingInfo(\'' + obj.RSKRECORDID + '\')">' + obj.RISKRATING + '</a>';
	                        } else if (obj.RISKRATING == '一般风险') {

	                            return '<a href="javascript:void(0);" style="color: rgba(255,159,0,1);" onclick="showRiskRatingInfo(\'' + obj.RSKRECORDID + '\')">' + obj.RISKRATING + '</a>';
	                        } else if (obj.RISKRATING == '低风险') {

	                            return '<a href="javascript:void(0);" style="color: rgba(51,153,255,1)" onclick="showRiskRatingInfo(\'' + obj.RSKRECORDID + '\')">' + obj.RISKRATING + '</a>';
	                        }


	                    } else {
	                        return '<a href="javascript:void(0);" style="color: rgba(51,51,51,1)" onclick="rskLevel(\'' + obj.RSKRECORDID + '\')">点击进行评价</a>';
	                    }

	                }

	            }

	        ];

	    //分页表格响应式处理
	    var tableHeight = $(window).height() - $(".pcheck").height() - 190 - 25;
	    $(window).resize(function () {
	        $("#lec-table").jqGrid("setGridHeight", $(window).height() - $('.pcheck').height() - 190 - 25);
	        $("#lec-table").jqGrid("setGridWidth", $(window).width() - 48);
	    });

	    $("#lec-table").jqGrid({
	        height: tableHeight,
	        width:$(window).width() - 48,
	        url: BASE_URL + "dangersource/dssrskrecord/countlist",
	        datatype: "json",
	        cache: false,
	        mtype: "POST",
	        colNames: leccolname,
	        colModel: leccolmodel,
	        postData: {
	            evaluatetype: "lec",
	            risktype: $("#riskrating").val()
	        },
	        sortname: "createtime",
	        sortorder: "desc",
	        viewrecords: true,
	        pager: "#lec-pager",
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
	        // caption: "风险评级管理列表",
	        //autowidth: true,
	        loadComplete : function() {
				if ($("#closeBtn").length==0) {
					$("body").append('<div id="closeBtn" style="text-align: center;margin-top:10px;">'+
							'<button type="button" class="backBtn" onclick="parent.closeWin();"><span>关闭</span></button>'+
					'</div>');
				}
			}
	    });
	}


	function initMesTable() {
	    //生成任务列表分页表格
	    var mescolname = ["风险记录id", /*"所属单位",*/ "场所区域", "岗位/设备", "安全风险", "危险因素",/* "控制措施的状态(M)", "人员暴露的频繁程度/危险状态出现的频次(E)", "发生事故可能造成的后果(S)",*/ "风险等级"],
	        mescolmodel = [
	            {
	                name: "RSKRECORDID",
	                index: "RSKRECORDID",
	                width: "5%",
	                align: "left",
	                sortable: false,
	                hidden: true
	            },
	            /*{
	                name: "BUSINESSINFONAME",
	                index: "BUSINESSINFONAME",
	                width: "15%",
	                align: "left",
	                sortable: false,
	                formatter: function (cellvalue, options, obj) {
	                    return '<a href="javascript:void(0);" onclick="display(\'' + obj.RSKRECORDID + '\')">' + obj.BUSINESSINFONAME + '</a>';
	                }
	            },*/
	            {
	                name: "PLACEAREANAME",
	                index: "PLACEAREANAME",
	                width: "10%",
	                align: "left",
	                sortable: true,
	                formatter: function (cellvalue, options, obj) {
	                    return '<a href="javascript:void(0);" onclick="display(\'' + obj.RSKRECORDID + '\')">' + obj.PLACEAREANAME + '</a>';
	                }
	            },
	            {
	                name: "SPECIFICNAME",
	                index: "SPECIFICNAME",
	                width: "10%",
	                align: "left",
	                sortable: true
	            },
	            {
	                name: "EVENTCATEGORYNAME",
	                index: "EVENTCATEGORYNAME",
	                width: "10%",
	                align: "left",
	                sortable: true
	            },
	            {
	                name: "RISKFACTOR",
	                index: "RISKFACTOR",
	                width: "15%",
	                align: "left",
	                sortable: false,
	                hidden: false
	            },
	            /*{
	                name: "MEASURESTATUS",
	                index: "MEASURESTATUS",
	                width: "10%",
	                align: "left",
	                sortable: false,
	                hidden: false
	            },
	            {
	                name: "EXPOSURE",
	                index: "EXPOSURE",
	                width: "10%",
	                align: "left",
	                sortable: false,
	                hidden: false
	            },
	            {
	                name: "CONSEQUENCE",
	                index: "CONSEQUENCE",
	                width: "10%",
	                align: "left",
	                sortable: false,
	                hidden: false
	            },*/
	            {
	                name: "RISKRATING",
	                index: "RISKRATING",
	                width: "10%",
	                align: "center",
	                sortable: false,
	                hidden: false,
	                formatter: function (cellvalue, options, obj) {
	                    if (obj.RESULTID) {

	                        if (obj.RISKRATING == '重大风险') {

	                            return '<a href="javascript:void(0);" style="color: rgba(255,0,3,1);" onclick="showRiskRatingInfo(\'' + obj.RSKRECORDID + '\')">' + obj.RISKRATING + '</a>';
	                        } else if (obj.RISKRATING == '较大风险') {

	                            return '<a href="javascript:void(0);" style="color: rgba(255,111,0,1);" onclick="showRiskRatingInfo(\'' + obj.RSKRECORDID + '\')">' + obj.RISKRATING + '</a>';
	                        } else if (obj.RISKRATING == '一般风险') {

	                            return '<a href="javascript:void(0);" style="color: rgba(255,159,0,1);" onclick="showRiskRatingInfo(\'' + obj.RSKRECORDID + '\')">' + obj.RISKRATING + '</a>';
	                        } else if (obj.RISKRATING == '低风险') {

	                            return '<a href="javascript:void(0);" style="color: rgba(51,153,255,1)" onclick="showRiskRatingInfo(\'' + obj.RSKRECORDID + '\')">' + obj.RISKRATING + '</a>';
	                        }


	                    } else {
	                        return '<a href="javascript:void(0);" style="color: rgba(51,51,51,1)" onclick="rskLevel(\'' + obj.RSKRECORDID + '\')">点击进行评价</a>';
	                    }

	                }

	            }

	        ];

	    //分页表格响应式处理
	    var tableHeight = $(window).height() - $(".pcheck").height() - 190 - 25;
	    $(window).resize(function () {
	        $("#mes-table").jqGrid("setGridHeight", $(window).height() - $('.pcheck').height() - 190 -25);
	        $("#mes-table").jqGrid("setGridWidth", $(window).width() * 0.95);
	    });

	    $("#mes-table").jqGrid({
	        height: tableHeight,
	        url: BASE_URL + "dangersource/dssrskrecord/countlist",
	        datatype: "json",
	        cache: false,
	        mtype: "POST",
	        colNames: mescolname,
	        colModel: mescolmodel,
	        postData: {
	            evaluatetype: "mes",
	            risktype: $("#riskrating").val()
	        },
	        sortname: "createtime",
	        sortorder: "desc",
	        viewrecords: true,
	        pager: "#mes-pager",
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
	        // caption: "风险评级管理列表",
	        autowidth: true,
	        loadComplete : function() {
				if ($("#closeBtn").length==0) {
					$(".table-line").append('<div id="closeBtn" style="text-align: center;">'+
							'<button type="button" class="backBtn" onclick="parent.closeWin();"><span>关闭</span></button>'+
					'</div>');
				}
			}
	    });
	    $("#mes-table").jqGrid("setGridWidth", $(window).width() * 0.95);
	}


	function showRiskRatingInfo(rskrecordid) {
	    if ($("#lectab").attr("aria-selected") == "true") {
	        parent.openWin(BASE_URL + "views/module/dangersource/dssrskrecord/gradeRskDetail.html?rskrecordid=" + rskrecordid,
	            "风险评级详情", "55%", "50%");
	    } else if ($("#mestab").attr("aria-selected") == "true") {
	        parent.openWin(BASE_URL + "views/module/dangersource/dssrskrecord/gradeMesRskDetail.html?rskrecordid=" + rskrecordid,
	            "风险评级详情", "55%", "50%");
	    }
	}

	function rskLevel(rskrecordid) {
	    if ($("#lectab").attr("aria-selected") == "true") {
	        parent.openWin(BASE_URL + "views/module/dangersource/dssrskrecord/gradeRsk.html?rskrecordid=" + rskrecordid,
	            "风险评级", "55%", "50%");
	    } else if ($("#mestab").attr("aria-selected") == "true") {
	        parent.openWin(BASE_URL + "views/module/dangersource/dssrskrecord/gradeMesRsk.html?rskrecordid=" + rskrecordid,
	            "风险评级", "55%", "50%");
	    }
	}

	/**
	 * 详细查看
	 */
	function display(rskrecordid) {


	    parent.openWin(BASE_URL + "views/module/dangersource/dssrskrecord/dssrskrecordDisplay.html?rskrecordid=" + rskrecordid,
	        "风险点详情", "55%", "50%");
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
	 * 刷新加载分页表格数据
	 */
	function reloadGrid() {
	    var belongent = $("#belongent").val();
	    var riskrating = $("#riskrating").val(); 
	    // if($("#lectab").attr("aria-selected")=="true"){
	    $("#lec-table").jqGrid("setGridParam", {
	        page: 1,
	        postData: {
	            belongent: belongent || "",
	            evaluatetype: "lec",
	            risktype: riskrating
	        }
	    }).trigger("reloadGrid");
	    // }
	    // if($("#mestab").attr("aria-selected")=="true"){
	    $("#mes-table").jqGrid("setGridParam", {
	        page: 1,
	        postData: {
	            belongent: belongent || "",
	            evaluatetype: "mes",
	            risktype: riskrating
	        }
	    }).trigger("reloadGrid");
	    // }


	}
	
function getQueryString(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
    var r = window.location.search.substr(1).match(reg);
    if (r != null)return unescape(r[2]);
    return null;
}