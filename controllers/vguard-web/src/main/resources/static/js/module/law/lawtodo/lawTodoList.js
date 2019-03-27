$(function () {
	initSeachInput();
    //生成待办文书列表分页表格
    var colname = [
            "企业id", "检查id", "立案id", "被检查企业","文书名称",  "执法人员", "状态","流程主状态"
        ],
        colmodel = [
			{
			    name: "BUSINESSINFOID",
			    index: "BUSINESSINFOID",
			    width: "15%",
			    align: "center",
			    sortable: false,
			    hidden: true
			},
            {
                name: "CHECKINFOID",
                index: "CHECKINFOID",
                width: "15%",
                align: "center",
                sortable: false,
                hidden: true
            },
            {
                name: "AUDITID",
                index: "AUDITID",
                width: "15%",
                align: "center",
                sortable: false,
                hidden: true
            },
            {
            	name: "ENTNAME",
            	index: "ENTNAME",
            	width: "30%",
            	align: "center",
            	sortable: false,
            	
            	formatter:function(cellvalue, options, obj) { 
					return '<a href="javascript:void(0);" onclick="display(\''+obj.BUSINESSINFOID+'\',\''+obj.ENTNAME+'\')">'+obj.ENTNAME+'</a>';
				}
            	
            },
            {
            	name: "WRITTYPE",
            	index: "WRITTYPE",
            	width: "15%",
            	align: "center",
            	sortable: false,
            	formatter:function(cellvalue, options, obj) { 
    				if(obj.WRITTYPE == "01"){
    					return '立案审批表';
    				}else if(obj.WRITTYPE == "02"){
    					return '案件处理呈批表';
    				}else if(obj.WRITTYPE == "03"){
    					return '案件移送审批表';
    				}else if(obj.WRITTYPE == "04"){
    					return '结案审批表';
    				}else if(obj.WRITTYPE == "05"){
    					return '延期(分期)缴纳罚款审批表';
    				}else{
    					return '';
    				}
    			}
            },
            {
                name: "USERNAME",
                index: "USERNAME",
                width: "15%",
                align: "center",
                sortable: false
            },
            {
            	name: "NODESTAT",
            	index: "NODESTAT",
            	width: "10%",
            	align: "center",
            	sortable: false,
            	formatter: function (cellvalue, options, obj) {
            		var lastVal = null;
            		switch (cellvalue) {
					case "1": lastVal = "待处理";
						break;
					case "2": lastVal = "通过";
						break;
					case "3": lastVal = "不通过";
						break;
					}
            		return lastVal;
                }
            },
            
            {
            	name: "FLOWSTAT",
            	index: "FLOWSTAT",
            	width: "10%",
            	align: "center",
            	sortable: false,
            	hidden: true
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
        url: BASE_URL + "/law/lawtodo/list",
        datatype: "json",
        cache: false,
        mtype: "POST",
        colNames: colname,
        colModel: colmodel,
        postData: {
        	entName: $("#entName").val()
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
        caption: "待办文书",
        autowidth: true
    });

    /*搜索查询*/
   /* $("#searchbtn").bind("click",function(){
    	reloadGrid();
    });*/

});

function resetData(){
    $("#entName").val("");
}

function seach(){
	 reloadGrid();
}

/*详细查询*/
function display(businessinfoid,entname){
	// parent.openWin(BASE_URL+'/enterprise/entsafeinfomenu/safemenuDisplay/'+businessinfoid,entname,'80%','90%');
    parent.openWin(BASE_URL+"/views/module/enterprise/entbusinessinfo/displayEntbusinessinfo.html?businessinfoid="+businessinfoid,'详细','90%','90%');
}


/*加载*/
function reloadGrid(){
	$("#grid-table").jqGrid('setGridParam',{
		page:1,postData:{
					entName:$("#entName").val()
			             }
	}).trigger("reloadGrid");
}

/*重置*/
/*$("#resetBtn").bind("click",function(){
	$("#entName").val("");
});*/


/* 编辑 */
$("#addBtn").bind("click", function() {
	// 返回当前grid中复选框所选择的数据的id
	var ids = $("#grid-table").jqGrid('getGridParam', 'selarrrow');
	if (ids.length != 1) {
		// 弹出提示信息
		parent.toast("请选择一条数据！");
		return;
	}
	// 返回指定id行的数据
	var rowdatas = $("#grid-table").jqGrid('getRowData', ids[0]);
	var checkinfoid = rowdatas.CHECKINFOID;
	//主流程状态
	var flowState = rowdatas.FLOWSTAT;
	//文书类型
	var writtype = rowdatas.WRITTYPE;
	
	var menupagetype = "menuDisplay";
	var type = "";
	if(writtype=="立案审批表"){
		type = "01";
	}else if(writtype=="案件处理呈批表"){
		type = "02";
	}else if(writtype=="案件移送审批表"){
		type = "03";
	}else if(writtype=="结案审批表"){
		type = "04";
	}else if(writtype=="延期(分期)缴纳罚款审批表"){
		type = "05";
	}
	/*if(flowState=="5"){//不同意
		menupagetype = "menuEdit";
	}*/
	/*案件列表*/
	parent.openWin(BASE_URL+"/law/lawdocinfo/menu?id="+checkinfoid+"&doctype=null&menupagetype="+menupagetype+"&writtype="+type,rowdatas.ENTNAME,'80%','98%');	
});



