$(function () {
    //显示操作权限按钮
//    $("#tableOpers").displayOper();
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
        $("#dssTableTitle").text(entname);
        $("#entid").val(entid);
        reloadGrid(entid);
    })
    
    //生成任务列表分页表格
    var colname = ["风险记录id", "所属单位", "场所区域", "岗位/设备", "安全风险\n(可能发生的事故)", "危险因素", "LEC风险等级", "MES风险等级","是否管控","风险管控id","隐患排查"],
        colmodel = [
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
                width: "10%",
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
                name: "LECRISKRATING",
                index: "LECRISKRATING",
                width: "10%",
                align: "left",
                sortable: false,
                hidden: false,
                formatter: function (cellvalue, options, obj) {
                    if (obj.LECRISKRATING) {

                    	if (obj.LECRISKRATING == '重大风险') {
                        	var riskrating = 4
                            return '<a href="javascript:void(0);" style="color: rgba(255,0,3,1);" onclick="showRiskRatingInfo(\'' + obj.RSKRECORDID + '\',\'lec\',\''+riskrating+'\')">' + obj.LECRISKRATING + '</a>';
                        } else if (obj.LECRISKRATING == '较大风险') {
                        	var riskrating = 3
                            return '<a href="javascript:void(0);" style="color: rgba(255,111,0,1);" onclick="showRiskRatingInfo(\'' + obj.RSKRECORDID + '\',\'lec\',\''+riskrating+'\')">' + obj.LECRISKRATING + '</a>';
                        } else if (obj.LECRISKRATING == '一般风险') {
                        	var riskrating = 2
                            return '<a href="javascript:void(0);" style="color: rgba(255,159,0,1);" onclick="showRiskRatingInfo(\'' + obj.RSKRECORDID + '\',\'lec\',\''+riskrating+'\')">' + obj.LECRISKRATING + '</a>';
                        } else if (obj.LECRISKRATING == '低风险') {
                        	var riskrating = 1
                            return '<a href="javascript:void(0);" style="color: rgba(51,153,255,1)" onclick="showRiskRatingInfo(\'' + obj.RSKRECORDID + '\',\'lec\',\''+riskrating+'\')">' + obj.LECRISKRATING + '</a>';
                        }

                    } else {
                        return '<a href="javascript:void(0);" onclick="rskLevel(\'' + obj.RSKRECORDID + '\',\'lec\')">LEC法评价</a>';
                    }

                }

            },
            {
                name: "MESRISKRATING",
                index: "MESRISKRATING",
                width: "10%",
                align: "left",
                sortable: false,
                hidden: false,
                formatter: function (cellvalue, options, obj) {
                    if (obj.MESRISKRATING) {
                        if (obj.MESRISKRATING == '重大风险') {
                        	var riskrating = 4
                            return '<a href="javascript:void(0);" style="color: rgba(255,0,3,1);" onclick="showRiskRatingInfo(\'' + obj.RSKRECORDID + '\',\'mes\',\''+riskrating+'\')">' + obj.MESRISKRATING + '</a>';
                        } else if (obj.MESRISKRATING == '较大风险') {
                        	var riskrating = 3
                            return '<a href="javascript:void(0);" style="color: rgba(255,111,0,1);" onclick="showRiskRatingInfo(\'' + obj.RSKRECORDID + '\',\'mes\',\''+riskrating+'\')">' + obj.MESRISKRATING + '</a>';
                        } else if (obj.MESRISKRATING == '一般风险') {
                        	var riskrating = 2
                            return '<a href="javascript:void(0);" style="color: rgba(255,159,0,1);" onclick="showRiskRatingInfo(\'' + obj.RSKRECORDID + '\',\'mes\',\''+riskrating+'\')">' + obj.MESRISKRATING + '</a>';
                        } else if (obj.MESRISKRATING == '低风险') {
                        	var riskrating = 1
                            return '<a href="javascript:void(0);" style="color: rgba(51,153,255,1)" onclick="showRiskRatingInfo(\'' + obj.RSKRECORDID + '\',\'mes\',\''+riskrating+'\')">' + obj.MESRISKRATING + '</a>';
                        }
                    } else {
                        return '<a href="javascript:void(0);" onclick="rskLevel(\'' + obj.RSKRECORDID + '\',\'mes\')">MES法评价</a>';
                    }

                }

            },
            {
                name: "rskcontrol",
                index: "rskcontrol",
                width: "8%",
                align: "center",
                sortable: true,
                formatter: function (cellvalue, options, obj) {
                	if(obj.CONTROLID != null && obj.CONTROLID != '' && obj.CONTROLID != 'null'){                		
                		return '<a href="javascript:void(0);" onclick="displayControl(\'' + obj.CONTROLID + '\')">是</a>';
                	} else {
                		return '否';  
                	}
                }
            },
            {
                name: "CONTROLID",
                index: "CONTROLID",
                width: "10%",
                align: "left",
                sortable: true,
                hidden: true
            },
            {
                name: "HIDCOUNT",
                index: "HIDCOUNT",
                width: "10%",
                align: "center",
                sortable: true,
                formatter: function(cellvalue, options, obj){
                	if(obj.HIDCOUNT>0){
                		return '<a href="javascript:void(0);" onclick="displayHid(\'' + obj.RSKRECORDID + '\')">已排查</a>';
                	} else {
                		return "未排查";
                	}
                }
            }
        ];

    //分页表格响应式处理
    var tableHeight = $(window).height() - $(".pcheck").height() - 260;
    $(window).resize(function () {
        $("#grid-table").jqGrid("setGridHeight", $(window).height() - $('.pcheck').height() - 260);
        $("#grid-table").jqGrid("setGridWidth", $(window).width() * 0.99);
    });

    $("#grid-table").jqGrid({
        height: tableHeight,
        url: BASE_URL + "dangersource/dssrskrecord/list",
        datatype: "json",
        cache: false,
        mtype: "POST",
        colNames: colname,
        colModel: colmodel,
        postData: {},
        sortname: "createtime",
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
//        caption: "风险记录管理列表",
        autowidth: true
    });

    //点击查询
    $("#searchbtn").off("click").on("click", function () {
        reloadGrid();
        loadDssEntList();
        $("#dssTableTitle").text("风险记录管理");
    });

    $("#resetbtn").off("click").on("click", function () {
    	$('#belongent').val(null).trigger('change');
    	$("#placeareaid").attr("disabled",true); 
    	$("#eventcategory").val("");
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

//风险管控详情
function displayControl(controlid){
	parent.openWin(BASE_URL + "views/module/dangersource/dssrskcontrol/dssRskControlDisplay.html?controlid=" + controlid + "&isDisplay=true",
            "风险管控详情", "55%", "40%");
}

//隐患详情
function displayHid(rskrecordid){
	parent.openWin(BASE_URL + "views/module/dangersource/hiddanger/govHiddendangerList.html?rskrecordid="+rskrecordid,
			"隐患列表","70%","65%");
}

function showRiskRatingInfo(rskrecordid, method,riskrating) {
    if (method == 'lec') {
        parent.openWin(BASE_URL + "views/module/dangersource/dssrskrecord/gradeRskDetail.html?rskrecordid=" + rskrecordid +"&riskrating="+riskrating,
            "风险评级详情", "55%", "60%");
    } else {
        parent.openWin(BASE_URL + "views/module/dangersource/dssrskrecord/gradeMesRskDetail.html?rskrecordid=" + rskrecordid +"&riskrating="+riskrating,
            "风险评级详情", "55%", "60%");
    }
}

function rskLevel(rskrecordid, method) {
    if (method == 'lec') {
        parent.openWin(BASE_URL + "views/module/dangersource/dssrskrecord/gradeRsk.html?rskrecordid=" + rskrecordid,
            "风险评级", "55%", "45%");
    } else {
        parent.openWin(BASE_URL + "views/module/dangersource/dssrskrecord/gradeMesRsk.html?rskrecordid=" + rskrecordid,
            "风险评级", "55%", "45%");
    }
}

/**
 * 详细查看场所环境风险
 */
function display(rskrecordid) {
    parent.openWin(BASE_URL + "views/module/dangersource/dssrskrecord/dssrskrecordDisplay.html?rskrecordid=" + rskrecordid,
        "风险点详情", "55%", "45%");
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
 * 刷新加载设备设施分页表格数据
 */
function reloadGrid(entid) {
	var belongent = $("#belongent").val();
    var placeareaid = $("#placeareaid").val();
	var eventcategory = $("#eventcategory").val();
	if(entid != null){
		belongent = entid;
	}
    $("#grid-table").jqGrid("setGridParam", {
        page: 1,
        postData: {
        	belongent: belongent || "",
            placeareaid: placeareaid || "",
            eventcategory: eventcategory || ""
        }
    }).trigger("reloadGrid");
}