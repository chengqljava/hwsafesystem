$(function () {
	//显示操作权限按钮
    $("#lectableOpers").displayOper();
    SelectTwo.initSelect2($('#belongent'), BASE_URL + "enterprise/entbusinessinfo/searchEntSimpleInfo", '请选择企业', formatRepo, formatRepoSelection);
    SelectOption.loadRskDic("eventcategory",{rskdictype:"eventcategory"});
    $("#placeareaid").attr("disabled",true); 
    $("#belongent").bind("change",function(){
        $("#placeareaid").html('<option value="" selected="selected">场所区域</option>');
        if($(this).val()!=""){
			$("#placeareaid").attr("disabled",false); 
			SelectOption.loadPlacearea("placeareaid",{"businessinfoid":$(this).val()});
		}
    });
    loadDssEntList();
    initLecTable();
    initMesTable();
    
    $('.factoryListContent ul').niceScroll({
        cursorborder: "#4d86d6",
        cursorcolor: "#4d86d6",
        background: false,
        horizrailenabled: true,
        autohidemode: false
    }).show().resize();
    $('.factoryListContent ul').on('click','li',function(){
        $('.factoryListContent ul li').removeClass('active');
        $(this).addClass('active');
        var entid = $('.active input').val();
        var entname = $('.factoryListContent ul .active').text();
        $("#entid").val(entid);
        reloadGrid(entid);
    })
    
    //查询按钮事件
    $("#searchbtn").off("click").on("click", function () {
    	reloadGrid();
    	loadDssEntList();
    });
    /*重置*/
    $("#resetbtn").bind("click", function () {
    	$('#belongent').val(null).trigger('change');
    	$("#placeareaid").attr("disabled",true); 
    	$("#eventcategory").val("");
    });
    
    $("#tabs").tabs();
        
    //风险降级
    $("#degradeBtn").off("click").on("click", function () {
        //返回当前grid中复选框所选择的数据的id
        if ($("#lectab").attr("aria-selected") == "true") {
            var curSelRowArr = $("#lec-table").jqGrid("getGridParam", "selarrrow");
            if (1 != curSelRowArr.length) {
                // 弹出提示信息
                parent.toast("请选择一条数据进行编辑！");
                return;
            }
            var rskrecordid = $("#lec-table").jqGrid("getRowData", curSelRowArr[0]).RSKRECORDID;
            dssRskAdjust(rskrecordid);

        } else if ($("#mestab").attr("aria-selected") == "true") {
            var curSelRowArr = $("#mes-table").jqGrid("getGridParam", "selarrrow");
            if (1 != curSelRowArr.length) {
                // 弹出提示信息
                parent.toast("请选择一条数据进行编辑！");
                return;
            }
            var rskrecordid = $("#lec-table").jqGrid("getRowData", curSelRowArr[0]).RSKRECORDID;
            dssRskAdjust(rskrecordid);

        }
    });

});

//加载企业列表
function loadDssEntList(){ 
	var belongent = $("#belongent").val();
    var placeareaid = $("#placeareaid").val();
	var eventcategory = $("#eventcategory").val();
    $.ajax({
        type: "post",
        url: BASE_URL + "dangersource/dssrskrecord/loadallentlist",
        dataType: "json",
        data: {
        	businessinfoid: belongent || '',
        	placeareaid: placeareaid || '',
        	eventcategory: eventcategory || ''
        },
        async:false,
        success: function (data) {
        	$("#entList").empty();
        	$("#gridTable").empty();
        	$.each(data.entList,function(i,item){
        		var entlist = '<li>'+item.BUSINESSINFONAME+'<input type="hidden" name="entid" value="'+item.BUSINESSINFOID+'"/></li>'
                $("#entList").append(entlist);
            }) 
        },
        error: function () {
            parent.toast("初始化信息加载失败!");
        }
    });
}

function initLecTable() {
    //生成任务列表分页表格
    var leccolname = ["风险记录id", "所属单位", "场所区域", "岗位/设备", "安全风险\n(可能发生的事故)", "危险因素", "事故发生的可能性(L)", "人员暴露于危险环境的频繁程度(E)", "发生事故可能造成的后果(C)", "风险等级"],
        leccolmodel = [
            {
                name: "RSKRECORDID",
                index: "RSKRECORDID",
                width: "5%",
                align: "left",
                sortable: false,
                hidden: true
            },
            {
                name: "BUSINESSINFONAME",
                index: "BUSINESSINFONAME",
                width: "15%",
                align: "left",
                sortable: false
            },
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
                hidden: true
            },
            {
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
            },
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
                        	var riskrating = 4
                            return '<a href="javascript:void(0);" style="color: rgba(255,0,3,1);" onclick="showRiskRatingInfo(\'' + obj.RSKRECORDID + '\',\''+riskrating+'\')">' + obj.RISKRATING + '</a>';
                        } else if (obj.RISKRATING == '较大风险') {
                        	var riskrating = 3
                            return '<a href="javascript:void(0);" style="color: rgba(255,111,0,1);" onclick="showRiskRatingInfo(\'' + obj.RSKRECORDID + '\',\''+riskrating+'\')">' + obj.RISKRATING + '</a>';
                        } else if (obj.RISKRATING == '一般风险') {
                        	var riskrating = 2
                            return '<a href="javascript:void(0);" style="color: rgba(255,159,0,1);" onclick="showRiskRatingInfo(\'' + obj.RSKRECORDID + '\',\''+riskrating+'\')">' + obj.RISKRATING + '</a>';
                        } else if (obj.RISKRATING == '低风险') {
                        	var riskrating = 1
                            return '<a href="javascript:void(0);" style="color: rgba(51,153,255,1)" onclick="showRiskRatingInfo(\'' + obj.RSKRECORDID + '\',\''+riskrating+'\')">' + obj.RISKRATING + '</a>';
                        }
                    } else {
                        return '<a href="javascript:void(0);" style="color: rgba(51,51,51,1)" onclick="rskLevel(\'' + obj.RSKRECORDID + '\')">点击进行评价</a>';
                    }
                }
            }
        ];

    //分页表格响应式处理
    var tableHeight = $(window).height() - $(".pcheck").height() - 270;
    $(window).resize(function () {
        $("#lec-table").jqGrid("setGridHeight", $(window).height() - $('.pcheck').height() - 270);
        $("#lec-table").jqGrid("setGridWidth", $(window).width());
    });

    $("#lec-table").jqGrid({
        height: tableHeight,
        url: BASE_URL + "dangersource/dssrskrecord/resultlist",
        datatype: "json",
        cache: false,
        mtype: "POST",
        colNames: leccolname,
        colModel: leccolmodel,
        postData: {
            evaluatetype: "lec"
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
        autowidth: true
    });
}


function initMesTable() {
    //生成任务列表分页表格
    var mescolname = ["风险记录id", "所属单位", "场所区域", "岗位/设备", "安全风险\n(可能发生的事故)", "危险因素", "控制措施的状态(M)", "人员暴露的频繁程度/危险状态出现的频次(E)", "发生事故可能造成的后果(S)", "风险等级"],
        mescolmodel = [
            {
                name: "RSKRECORDID",
                index: "RSKRECORDID",
                width: "5%",
                align: "left",
                sortable: false,
                hidden: true
            },
            {
                name: "BUSINESSINFONAME",
                index: "BUSINESSINFONAME",
                width: "15%",
                align: "left",
                sortable: false
            },
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
                hidden: true
            },
            {
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
            },
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
                        	var riskrating = 4
                            return '<a href="javascript:void(0);" style="color: rgba(255,0,3,1);" onclick="showRiskRatingInfo(\'' + obj.RSKRECORDID + '\',\''+riskrating+'\')">' + obj.RISKRATING + '</a>';
                        } else if (obj.RISKRATING == '较大风险') {
                        	var riskrating = 3
                            return '<a href="javascript:void(0);" style="color: rgba(255,111,0,1);" onclick="showRiskRatingInfo(\'' + obj.RSKRECORDID + '\',\''+riskrating+'\')">' + obj.RISKRATING + '</a>';
                        } else if (obj.RISKRATING == '一般风险') {
                        	var riskrating = 2
                            return '<a href="javascript:void(0);" style="color: rgba(255,159,0,1);" onclick="showRiskRatingInfo(\'' + obj.RSKRECORDID + '\',\''+riskrating+'\')">' + obj.RISKRATING + '</a>';
                        } else if (obj.RISKRATING == '低风险') {
                        	var riskrating = 1
                            return '<a href="javascript:void(0);" style="color: rgba(51,153,255,1)" onclick="showRiskRatingInfo(\'' + obj.RSKRECORDID + '\',\''+riskrating+'\')">' + obj.RISKRATING + '</a>';
                        }
                    } else {
                        return '<a href="javascript:void(0);" style="color: rgba(51,51,51,1)" onclick="rskLevel(\'' + obj.RSKRECORDID + '\')">点击进行评价</a>';
                    }
                }
            }
        ];

    //分页表格响应式处理
    var tableHeight = $(window).height() - $(".pcheck").height() - 270;
    $(window).resize(function () {
        $("#mes-table").jqGrid("setGridHeight", $(window).height() - $('.pcheck').height() - 270);
        $("#mes-table").jqGrid("setGridWidth", $(window).width());
    });

    $("#mes-table").jqGrid({
        height: tableHeight,
        url: BASE_URL + "dangersource/dssrskrecord/resultlist",
        datatype: "json",
        cache: false,
        mtype: "POST",
        colNames: mescolname,
        colModel: mescolmodel,
        postData: {
            evaluatetype: "mes"
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
        autowidth: true
    });
//    $("#mes-table").jqGrid("setGridWidth", $(window).width() * 0.975);
}


function showRiskRatingInfo(rskrecordid,riskrating) {
    if ($("#lectab").attr("aria-selected") == "true") {
        parent.openWin(BASE_URL + "views/module/dangersource/dssrskrecord/gradeRskDetail.html?rskrecordid=" + rskrecordid+"&riskrating="+riskrating,
            "风险评级详情", "55%", "60%");
    } else if ($("#mestab").attr("aria-selected") == "true") {
        parent.openWin(BASE_URL + "views/module/dangersource/dssrskrecord/gradeMesRskDetail.html?rskrecordid=" + rskrecordid+"&riskrating="+riskrating,
            "风险评级详情", "55%", "60%");
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

//风险管控
function dssControl(controlid,rskrecordid){
	parent.openWin(BASE_URL + "views/module/dangersource/dssrskcontrol/dssRskControlAdd.html?controlid=" + controlid+"&rskrecordid="+rskrecordid,
            "风险管控", "70%", "40%");
}

//评价调整
function dssRskAdjust(rskrecordid){
	if ($("#lectab").attr("aria-selected") == "true") {
		parent.openWin(BASE_URL + "views/module/dangersource/dssrskrecord/gradeRskAdjust.html?rskrecordid=" + rskrecordid,
				"风险评价调整", "55%", "60%");
    } else if ($("#mestab").attr("aria-selected") == "true") {
    	parent.openWin(BASE_URL + "views/module/dangersource/dssrskrecord/gradeMesRskAdjust.html?rskrecordid=" + rskrecordid,
				"风险评价调整", "55%", "60%");
    }
}

/**
 * 详细查看
 */
function display(rskrecordid) {
    parent.openWin(BASE_URL + "views/module/dangersource/dssrskrecord/dssrskrecordDisplay.html?rskrecordid=" + rskrecordid,
        "风险点详情", "55%", "42%");
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
function reloadGrid(entid) {
    var belongent = $("#belongent").val();
    var placeareaid = $("#placeareaid").val();
	var eventcategory = $("#eventcategory").val();
	if(entid != null){
		belongent = entid;
	}
    // if($("#lectab").attr("aria-selected")=="true"){
    $("#lec-table").jqGrid("setGridParam", {
        page: 1,
        postData: {
            belongent: belongent || "",
            placeareaid: placeareaid || "",
            eventcategory: eventcategory || "",
            evaluatetype: "lec"
        }
    }).trigger("reloadGrid");
    // }
    // if($("#mestab").attr("aria-selected")=="true"){
    $("#mes-table").jqGrid("setGridParam", {
        page: 1,
        postData: {
            belongent: belongent || "",
            placeareaid: placeareaid || "",
            eventcategory: eventcategory || "",
            evaluatetype: "mes"
        }
    }).trigger("reloadGrid");
    // }


}