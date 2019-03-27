$(function () {
	initSeachInput();
	var contactsid = getQueryString("contactsid");
    //显示操作权限按钮
    //生成任务列表分页表格
    var colname = ["主键id", "场所区域编号", "场所区域名称", "负责人", "负责人电话"],
        colmodel = [
            {
                name: "PLACEAREAID",
                index: "PLACEAREAID",
                width: "5%",
                align: "center",
                sortable: false,
                hidden: true
            },
            {
                name: "PLACEAREACODE",
                index: "PLACEAREACODE",
                width: "10%",
                align: "center",
                sortable: false
            },
            {
                name: "PLACEAREANAME",
                index: "PLACEAREANAME",
                width: "10%",
                align: "center",
                sortable: true,
                formatter: function (cellvalue, options, obj) {
                    return '<a href="javascript:void(0);" onclick="display(\'' + obj.PLACEAREAID + '\')">' + obj.PLACEAREANAME + '</a>';
                }
            },
            {
                name: "LIABLOR",
                index: "LIABLOR",
                width: "10%",
                align: "center",
                sortable: true
            },
            {
                name: "TELEPHONE",
                index: "TELEPHONE",
                width: "10%",
                align: "center",
                sortable: true
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
        url: BASE_URL + "enterprise/lkcontactsplacearea/loadAreaList",
        datatype: "json",
        cache: false,
        mtype: "POST",
        colNames: colname,
        colModel: colmodel,
        postData: {
        	contactsid:contactsid 
        	},
        sortname: "PLACEAREACODE",
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
        caption: "场所区域管理列表",
        autowidth: true
    });
});

function resetData(){
    $("#placeareacode").val("");
    $("#placeareaname").val("");
}

function seach(){
	 reloadGrid();
}

function getQueryString(name) {
     var reg = new RegExp("(^|&)"+ name +"=([^&]*)(&|$)");
     var r = window.location.search.substr(1).match(reg);
     if(r!=null)return  unescape(r[2]); return null;
}

/**
 * 详细查看场所环境风险
 */
function display(placeareaid) {
    parent.openWin(BASE_URL + "views/module/dangersource/dssrskplacearea/dssrskplaceareaDisplay.html?placeareaid=" + placeareaid,
        "场所区域详情", "50%", "40%");
}

/**
 * 刷新加载设备设施分页表格数据
 */
function reloadGrid() {
    var placeareacode = $("#placeareacode").val();
    var placeareaname = $("#placeareaname").val();
    $("#grid-table").jqGrid("setGridParam", {
        page: 1,
        postData: {
        	placeareacode: placeareacode || "",
        	placeareaname: placeareaname || ""
        }
    }).trigger("reloadGrid");
}