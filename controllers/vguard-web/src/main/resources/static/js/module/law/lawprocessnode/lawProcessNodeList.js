$(function () {
    //生成任务列表分页表格
    var colname = [
            "主键id", "流程节点编码", "节点名称", "流程状态", "待处理人","处理时间", 
            "处理意见"
        ],
        colmodel = [
            {
                name: "NODEID",
                index: "NODEID",
                width: "10%",
                align: "center",
                sortable: false,
                hidden: true
            },
            {
            	name: "NODECODE",
            	index: "NODECODE",
            	width: "10%",
            	align: "center",
            	sortable: false,
            	hidden: true
            },
            {
            	name: "NODENAME",
            	index: "NODENAME",
            	width: "15%",
            	align: "center",
            	sortable: false
            },
            {
            	name: "NODESTAT",
            	index: "NODESTAT",
            	width: "15%",
            	align: "center",
            	sortable: false,
            	hidden: true,
            	formatter:function(cellvalue, options, obj) { 
    				if(obj.NODESTAT == "1"){
    					return '待处理';
    				}else if(obj.NODESTAT == "2"){
    					return '通过';
    				}else if(obj.NODESTAT == "3"){
    					return '不通过';
    				}else if(obj.NODESTAT == "4"){
    					return '结束';
    				}else{
    					return '';
    				}
    			}
            },
            {
            	name: "HANDLEUSER",
            	index: "HANDLEUSER",
            	width: "15%",
            	align: "center",
            	sortable: false,
            },
           
            {
            	name: "HANDLETIME",
            	index: "HANDLETIME",
            	width: "25%",
            	align: "center",
            	sortable: true,
            	formatter: function (cellvalue, options, obj) {
                    return getFormatDateByLong(obj.HANDLETIME,
                        "yyyy-MM-dd hh:mm:ss");
                }
            },
            {
            	name: "HANDLEOPINION",
            	index: "HANDLEOPINION",
            	width: "45%",
            	align: "center",
            	sortable: false,
            }
        ];
    
    //分页表格响应式处理
    var tableHeight = $(window).height() - $(".pcheck").height() - 190 - 33;
    $(window).resize(function () {
        $("#grid-table").jqGrid("setGridHeight", $(window).height() - $('.pcheck').height() - 190 -33);
        $("#grid-table").jqGrid("setGridWidth", $(window).width() * 0.99);
    });

    $("#grid-table").jqGrid({
        height: tableHeight,
        url: BASE_URL + "/law/lawtodo/viewOpinions?processId="+$("#processId").val(),
        datatype: "json",
        cache: false,
        mtype: "POST",
        colNames: colname,
        colModel: colmodel,
        sortname: "HANDLETIME",
        sortorder: "asc",
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
        caption: "流程查看列表",
        autowidth: true
    });


});

