/**
 * 已检查企业
 */
$(function () {
	var checkplanid = getQueryString("checkplanid");
	//列表分页表格
    var colname = [
            "检查项id","检查项目", "检查内容","检查要求", "依据条款"/*,"处罚条款"*/
        ],
        colmodel = [
            {
                name: "plancheckitemid",
                index: "plancheckitemid",
                width: "5%",
                align: "center",
                sortable: false,
                hidden: true
            },
            {
                name: "checkitem",
                index: "checkitem",
                width: "10%",
                align: "center",
                sortable: false
            },
            {
                name: "checkcontent",
                index: "checkcontent",
                width: "30%",
                align: "center",
                sortable: false
            },
            {
                name: "checkrequire",
                index: "checkrequire",
                width: "35%",
                align: "center",
                sortable: true,
                hidden: false
            },
            {
                name: "fromway",
                index: "fromway",
                width: "15%",
                align: "center",
                sortable: true,
                hidden: false
            }/*,
            {
				name : "punishway",
                index: "punishway",
                width: "10%",
                align: "center",
                sortable: true,
                hidden: false
            }*/
        ];

    //分页表格响应式处理
    var tableHeight = $(window).height() - $(".pcheck").height() - 190 - 33;
    $(window).resize(function () {
        $("#grid-table").jqGrid("setGridHeight", $(window).height() - $('.pcheck').height() - 190 - 33);
        $("#grid-table").jqGrid("setGridWidth", $(window).width() * 0.99);
    });

    $("#grid-table").jqGrid({
        height: tableHeight,
        url: BASE_URL + "hidden/hidplancheckitem/list",
        datatype: "json",
        cache: false,
        mtype: "POST",
        colNames: colname,
        colModel: colmodel,
        postData: {
        	checkplanid: checkplanid,
        },
        sortname: "checkitem",
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
        caption: "检查项目表",
        autowidth: true
    });
    
});

function getQueryString(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
    var r = window.location.search.substr(1).match(reg);
    if (r != null)return unescape(r[2]);
    return null;
}