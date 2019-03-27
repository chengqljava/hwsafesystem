$(document).ready(function () {
	/**
	 * 环保信息-固体废物
	 */
	var entid = getQueryString("businessinfoid");
	var isDisplay = getQueryString("isDisplay");
	if (isDisplay == "display") {
		$("#btnDiv").hide();
	}
    //生成任务列表分页表格
    var colname = ["id","固废名称","产生时间", "产生量（吨/立方米）","来源","委托处置量（吨/立方米）","委托处置单位","处置时间","责任人"],
        colmodel = [
            {
                name: "solidwasteid",
                index: "solidwasteid",
                width: "5%",
                align: "center",
                sortable: false,
                hidden: true
            },
            {
            	name: "solidwastename",
            	index: "solidwastename",
            	width: "12.5%",
            	align: "center",
            	sortable: false,
            	formatter: function (cellvalue, options, obj) {
            		return '<a href="javascript:void(0);" onclick="display(\'' + obj.solidwasteid + '\')">' + obj.solidwastename + '</a>';
            	}
            },
            {
                name: "gentime",
                index: "gentime",
                width: "12.5%",
                align: "center",
                sortable: false,
                formatter: function(cellvalue,options,obj){
            		return getFormatDateByLong(cellvalue, "yyyy-MM");
            	}
            },
            {
            	name: "genquantity",
            	index: "genquantity",
            	width: "12.5%",
            	align: "center",
            	sortable: false
            },
            {
                name: "source",
                index: "source",
                width: "12.5%",
                align: "center",
                sortable: false,
            },
            {
            	name: "handlecapacity",
            	index: "handlecapacity",
            	width: "12.5%",
            	align: "center",
            	sortable: false
            },
            {
                name: "handlecompany",
                index: "handlecompany",
                width: "12.5%",
                align: "center",
                sortable: false,
            },
            {
                name: "handletime",
                index: "handletime",
                width: "12.5%",
                align: "center",
                sortable: false,
                formatter: function(cellvalue,options,obj){
            		return getFormatDateByLong(cellvalue, "yyyy-MM-dd");
            	}
            },
            {
                name: "personliable",
                index: "personliable",
                width: "12.5%",
                align: "center",
                sortable: false,
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
        url: BASE_URL + "epi/episolidwasterecord/list",
        datatype: "json",
        cache: false,
        mtype: "POST",
        colNames: colname,
        colModel: colmodel,
        postData: {
        	entid:entid
        },
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
        caption: "固体废物列表",
        autowidth: true
    });

    $("#addBtn").off("click").on("click", function () {
    	parent.parent.openWin(BASE_URL + "views/module/epi/solidwasteRecord/solidwasteRecordAdd.html?solidwasteid=null&entid="+entid+"&addPage=addPage",
        		"新增固体废物记录", "65%", "45%");
    });
    
    //修改
    $("#editBtn").off("click").on("click", function () {
        //返回当前grid中复选框所选择的数据的id
        var curSelRowArr = $("#grid-table").jqGrid("getGridParam", "selarrrow");
        if (1 != curSelRowArr.length) {
            // 弹出提示信息
        	parent.parent.toast("请选择一条数据进行编辑！");
            return;
        }
            //打开页面
        var solidwasteid = $("#grid-table").jqGrid("getRowData", curSelRowArr[0]).solidwasteid;
        parent.parent.openWin(BASE_URL + "views/module/epi/solidwasteRecord/solidwasteRecordAdd.html?solidwasteid="+solidwasteid,
        		"编辑固体废物记录",  "60%", "45%");
    });	
    
  //批量删除任务信息
    $("#delBtn").off("click").on("click", function () {
        // 返回当前grid中复选框所选择的数据的id
        var curSelRowArr = $("#grid-table").jqGrid("getGridParam", "selarrrow");
        if (0 == curSelRowArr.length) {
            // 弹出提示信息
        	parent.parent.toast("请选择需要删除的数据！");
            return;
        }

        var curSelBadIdArr = [];
        for (var i = 0; i < curSelRowArr.length; i++) {
        	var solidwasteid = $("#grid-table").jqGrid("getRowData", curSelRowArr[i]).solidwasteid;
        	curSelBadIdArr.push(solidwasteid);
        }
        //执行删除操作
        delSolidWasteRecord({"ids": curSelBadIdArr.toString()});
    });
    
    /**
     * 执行删除操作
     */
    function delSolidWasteRecord(param) {
        //弹出提示框
    	parent.parent.confirm("确认删除记录?", function () {
            $.ajax({
                url: BASE_URL + "epi/episolidwasterecord/delete",
                type: "post",
                dataType: "json",
                data: param,
                success: function (json) {
                    if (json.success == true) {
                    	parent.parent.toast(json.msg);
                        reloadGrid();// 刷新列表
                    } else {
                    	parent.parent.toast(json.msg);
                    }
                }
            });
        });
    }

});
/**
 * 查看信息
 */
function display(solidwasteid) {
	parent.parent.openWin(BASE_URL + "views/module/epi/solidwasteRecord/solidwasteRecordDisplay.html?solidwasteid="+solidwasteid+"&isDisplay=isDisplay",
    		"固体废物记录详情",  "60%", "45%");
}

function reloadGrid() {
    $("#grid-table").jqGrid("setGridParam", {
        page: 1,
        postData: {}
    }).trigger("reloadGrid");
}

function getQueryString(name)
{
    var reg = new RegExp("(^|&)"+ name +"=([^&]*)(&|$)");
    var r = window.location.search.substr(1).match(reg);
    if(r!=null)return  unescape(r[2]); return null;
}