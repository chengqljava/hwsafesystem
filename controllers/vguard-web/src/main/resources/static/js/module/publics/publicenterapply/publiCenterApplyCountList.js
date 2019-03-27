	/**
	 * 隐患计划
	 */
$(document).ready(function () {
	
    //生成任务列表分页表格
    var colname = ["主键id","申请人","性别","申请日期","身份证号","手机号码","单位名称","状态"],
        colmodel = [
            {
                name: "ENTERID",
                index: "ENTERID",
                width: "5%",
                align: "center",
                sortable: false,
                hidden: true
            },
            {
                name: "APPLYUSER",
                index: "APPLYUSER",
                width: "10%",
                align: "center",
                sortable: false,
                formatter: function (cellvalue, options, obj) {
                    return '<a href="javascript:void(0);" onclick="display(\'' + obj.ENTERID + '\',\'' + obj.APPLYUSER + '\')">' + obj.APPLYUSER + '</a>';
                }
            },
            {
            	name: "SEX",
            	index: "SEX",
            	width: "10%",
            	align: "center",
            	sortable: false,
            	formatter: function (cellvalue, options, obj) {
                    if (cellvalue =="0") {
						return "女"
					}else if(cellvalue =="1"){
						return "男"
					}
                }
            },
            {
                name: "APPLYDATE",
                index: "APPLYDATE",
                width: "15%",
                align: "center",
                sortable: false,
                formatter: function (cellvalue, options, obj) {
                    return getFormatDateByLong(cellvalue, 'yyyy-MM-dd');
                }
            },
            {
            	name: "IDCARD",
            	index: "IDCARD",
            	width: "10%",
            	align: "center",
            	sortable: false
            },
            {
            	name: "TELPHONE",
            	index: "TELPHONE",
            	width: "10%",
            	align: "center",
            	sortable: false
            },
            {
            	name: "UNITNAME",
            	index: "UNITNAME",
            	width: "10%",
            	align: "center",
            	sortable: false
            },
            {
            	name: "STATUS",
            	index: "STATUS",
            	width: "10%",
            	align: "center",
            	sortable: false,
            	formatter: function (cellvalue, options, obj) {
                    if (cellvalue =="0") {
						return "已保存"
					}else if(cellvalue =="1"){
						return "已申请"
					}else if(cellvalue =="2"){
						return "已同意"
					}else if(cellvalue =="3"){
						return "不同意"
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
        url: BASE_URL + "publics/publicenterapply/list",
        datatype: "json",
        cache: false,
        mtype: "POST",
        colNames: colname,
        colModel: colmodel,
        postData: {
        	status:GetQueryString("status"),
        	begintime:GetQueryString("begintime"),
        	endtime:GetQueryString("endtime")
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
        caption: "入园申请列表",
        autowidth: true
    });
    
});

/**
 * 周期计划
 * @param checkplanid
 * @param checkname
 */
function display(enterid, checkname) {
    parent.openWin(BASE_URL + "views/module/publics/publicenterapply/publiCenterApplyDisplay.html?enterid=" + enterid+"&display=display",
    		checkname,  '50%', '60%');
}

function GetQueryString(name){
     var reg = new RegExp("(^|&)"+ name +"=([^&]*)(&|$)");
     var r = window.location.search.substr(1).match(reg);
     if(r!=null)return  unescape(r[2]); return null;
}