$(function () {
	//显示操作权限按钮
	$("#tableOpers").displayOper();
	SelectOption.loadBlackState("blackstate");
	SelectTwo.initSelect2($('#belongentselect2'),BASE_URL + "enterprise/entbusinessinfo/searchEntSimpleInfo",'请选择企业',formatRepo,formatRepoSelection);
    //生成任务列表分页表格
    var colname = ["黑名单记录id","企业名称",'法人名称',"组织机构代码","联系方式","加入时间","管理期(年)","备注", "状态"],
        colmodel = [
            {
                name: "RECORDID",
                index: "RECORDID",
                width: "10%",
                align: "center",
                sortable: false,
                hidden: true
            },
            {
            	name: "ENTNAME",
            	index: "ENTNAME",
            	width: "10%",
            	align: "center",
            	sortable: false,
            	formatter: function (cellvalue, options, obj) {
            		return '<a href="javascript:void(0);" onclick="display(\'' + obj.RECORDID + '\')">' + obj.ENTNAME + '</a>';
            	}
            },
            {
            	name: "LEGALPERSON",
            	index: "LEGALPERSON",
            	width: "10%",
            	align: "center",
            	sortable: false
            },
            {
            	name: "ENTCODE",
            	index: "ENTCODE",
            	width: "10%",
            	align: "center",
            	sortable: false
            },
            {
            	name: "PHONE",
            	index: "PHONE",
            	width: "10%",
            	align: "center",
            	sortable: false
            },
            {
            	name: "ADDDATE",
            	index: "ADDDATE",
            	width: "10%",
            	align: "center",
            	sortable: true,
            	formatter:function(cellvalue, options, obj) { 
					if (obj.ADDDATE) {
						return getSmpFormatDateByLong(obj.ADDDATE, false);
					} else {
						return "";
					}
				}
            },
            {
            	name: "MANAGE",
            	index: "MANAGE",
            	width: "10%",
            	align: "center",
            	sortable: false
            },
            {
            	name: "NOTE",
            	index: "NOTE",
            	width: "10%",
            	align: "center",
            	sortable: false
            },
            {
            	name: "BLACKSTATE",
            	index: "BLACKSTATE",
            	width: "10%",
            	align: "center",
            	sortable: false,
            	formatter : function(cellvalue, options, obj) {
            		if(cellvalue=="1"){
            			return '已上报';
            		}else if(cellvalue=="2"){
            			return '已整改';
            		}else if(cellvalue=="3"){
            			return '已核查';
            		}else if(cellvalue=="4"){
            			return '已移除';
            		}else{
            			return '--';
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
        url: BASE_URL + "ecs/ecsblarecord/list",
        datatype: "json",
        cache: false,
        mtype: "POST",
        colNames: colname,
        colModel: colmodel,
        postData: {
        	"businessinfoid": $("#businessinfoid").val(),
        	"blackstate":$("#blackstate").val()
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
        caption: "黑名单记录",
        autowidth: true
    });

    //显示新增页面
    $("#addBtn").off("click").on("click",function(){
    	parent.openWin(BASE_URL
				+ "views/module/ecs/blackrecord/blackRecordEdit.html?recordid=-1",
				'新增黑名单记录', '50%', '50%');
    });
    
  //点击查询
    $("#searchbtn").off("click").on("click",function(){
    	reloadGrid();
    });
    
    /*重置*/
    $("#resetbtn").bind("click",function(){
    	var str = $("<span class='select2-selection__placeholder'>请选择名称</span>");
    	$("#belongentselect2").empty();
    	$("#select2-belongentselect2-container").attr("title","");
    	$("#select2-belongentselect2-container").prepend(str);
    	$("#select2-belongentselect2-container").empty();
    	$("#businessinfoid").val("");
    });
    
    //显示编辑页面
    $("#editBtn").off("click").on("click", function (){
        //返回当前grid中复选框所选择的数据的id
        var curSelRowArr = $("#grid-table").jqGrid("getGridParam", "selarrrow");
        if (1 != curSelRowArr.length) {
            // 弹出提示信息
            parent.toast("请选择一条数据进行编辑！");
            return;
        }
        
        //打开编辑页面
        var recordid = $("#grid-table").jqGrid("getRowData", curSelRowArr[0]).RECORDID;
       
        	parent.openWin(BASE_URL + "views/module/ecs/blackrecord/blackRecordEdit.html?recordid=" + recordid,
        			       "编辑黑名单记录", "50%", "50%");
      
       
    });
    
    //显示整改页面，只能对已上报的数据进行整改
    $("#reformBtn").off("click").on("click", function (){
        //返回当前grid中复选框所选择的数据的id
        var curSelRowArr = $("#grid-table").jqGrid("getGridParam", "selarrrow");
        if (1 != curSelRowArr.length) {
            // 弹出提示信息
            parent.toast("请选择一条已上报的数据进行整改！");
            return;
        }
        
        //打开编辑页面
        var recordid = $("#grid-table").jqGrid("getRowData", curSelRowArr[0]).RECORDID;
        var blackstate = $("#grid-table").jqGrid("getRowData", curSelRowArr[0]).BLACKSTATE;
        if(blackstate!="已上报"){
        	 // 弹出提示信息
            parent.toast("请选择已上报的数据进行整改！");
            return;
        }else{
        	parent.openWin(BASE_URL + "views/module/ecs/blackrecord/blackRecordReform.html?recordid=" + recordid,
        			"黑名单整改", "50%", "40%");
        }
      
       
    });
    
    //显示核查页面，只能对已整改的数据进行核查
    $("#checkBtn").off("click").on("click", function (){
        //返回当前grid中复选框所选择的数据的id
        var curSelRowArr = $("#grid-table").jqGrid("getGridParam", "selarrrow");
        if (1 != curSelRowArr.length) {
            // 弹出提示信息
            parent.toast("请选择一条已整改的数据进行核查！");
            return;
        }
        
        //打开编辑页面
        var recordid = $("#grid-table").jqGrid("getRowData", curSelRowArr[0]).RECORDID;
        var blackstate = $("#grid-table").jqGrid("getRowData", curSelRowArr[0]).BLACKSTATE;
        if(blackstate!="已整改"){
        	 // 弹出提示信息
            parent.toast("请选择已整改的数据进行核查！");
            return;
        }else{
        	parent.openWin(BASE_URL + "views/module/ecs/blackrecord/blackRecordCheck.html?recordid=" + recordid,
        			"黑名单核查", "50%", "50%");
        }
      
       
    });
    
    
    
    //批量删除
    $("#delBtn").off("click").on("click", function () {
        // 返回当前grid中复选框所选择的数据的id
        var curSelCaseArr = $("#grid-table").jqGrid("getGridParam", "selarrrow");
        if (1 != curSelCaseArr.length) {
            // 弹出提示信息
            parent.toast("请选择一条需要移除的数据！");
            return;
        }

        //打开编辑页面
        var recordid = $("#grid-table").jqGrid("getRowData", curSelCaseArr[0]).RECORDID;
        //管理期
        var manage = $("#grid-table").jqGrid("getRowData", curSelCaseArr[0]).MANAGE;
        //加入时间
        var adddate = $("#grid-table").jqGrid("getRowData", curSelCaseArr[0]).ADDDATE;
        
        var endyear = Number(adddate.split("-")[0])+Number(manage);
        var enddate = endyear+adddate.substring(4,10);
        var now  = new Date();
        if(formatDate(now)<formatDate(enddate)||formatDate(now)==formatDate(enddate)){
        	 // 弹出提示信息
            parent.confirm("当前企业仍在黑名单管理期内，确定移除吗？", function (){
            	parent.openWin(BASE_URL + "views/module/ecs/blackrecord/blackRecordRemove.html?recordid=" + recordid,
      			       "移除黑名单记录", "50%", "40%");
            });
        }else{
        	parent.confirm("确定移除吗？", function (){
        	parent.openWin(BASE_URL + "views/module/ecs/blackrecord/blackRecordRemove.html?recordid=" + recordid,
  			       "移除黑名单记录", "50%", "40%");
        });
        }
    
    });
	
});
/**
 * 刷新时加载查询条件
 */
function reloadGrid() {
	//获取企业id
	var businessinfoid = $("#businessinfoid").val();
    $("#grid-table").jqGrid("setGridParam", {
        page: 1,
        postData: {
        	businessinfoid:businessinfoid||"",
        	blackstate:$("#blackstate").val()
        }
    }).trigger("reloadGrid");
}

function formatRepo(repo){
	if (repo.loading) {
	    return repo.text;
	}
	var markup = "<div class='select2-result-repository clearfix'>" + repo.text + "</div>";
    
    return markup;
}

function formatRepoSelection(repo){
	 $("#businessinfoid").val(repo.id);
	 return repo.text;
}

/**
 * 详细查看黑名单信息
 */
function display(recordid) {
	 //返回当前grid中复选框所选择的数据的id
	parent.openWin(BASE_URL + "views/module/ecs/blackrecord/displayBlackRecord.html?recordid="+recordid,
             "黑名单详情", "50%", "40%");
}

/*时间格式化*/
function formatDate(time){
	 var now = new Date(time);
	 var year = now.getYear();     
     var month = now.getMonth()+1; 
     if(month<10){
    	 month="0"+month;
     }
     var date = now.getDate();  
     if(date<10){
    	 date="0"+date;
     }
     return year+"-"+month+"-"+date;  
}