$(document).ready(function () {
	var dzgwyq = getQueryString("dzgwyq");
	var dfc = getQueryString("dfc");
	var dhx = getQueryString("dhx");
	var dzgyq = getQueryString("dzgyq");
	var usertype = getQueryString("usertype");
	var isGis = getQueryString("isGis");
	$("#dzgwyqnum").text(dzgwyq);
	$("#dfcnum").text(dfc);
	$("#dhxnum").text(dhx);
	$("#yqwzgnum").text(dzgyq);
	$("#usertype").val(usertype);

	/**
	 * 隐患列表
	 */
    //生成任务列表分页表格
    //生成任务列表分页表格
    var colname = ["隐患id","企业名称","隐患编号","隐患名称","隐患内容","发现时间","整改期限","隐患级别","隐患来源","隐患状态"],
        colmodel = [
            {
                name: "HIDDENDANGERID",
                index: "HIDDENDANGERID",
                width: "5%",
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
            	hidden: true
            },
            {
                name: "HIDDENDANGERNUM",
                index: "HIDDENDANGERNUM",
                width: "15%",
                align: "center",
                sortable: false,
                formatter: function (cellvalue, options, obj) {
            		return '<a href="javascript:void(0);" style="color: #0075c7;" onclick="display(\'' + obj.HIDDENDANGERID + '\')">' + cellvalue + '</a>';
            	}
            },
            {
            	name: "HIDDENDANGERNAME",
            	index: "HIDDENDANGERNAME",
            	width: "10%",
            	align: "center",
            	sortable: false
            },
            {
            	name: "HIDDENDANGERCONTENT",
            	index: "HIDDENDANGERCONTENT",
            	width: "10%",
            	align: "center",
            	sortable: false
            },
            {
            	name: "FINDTIME",
            	index: "FINDTIME",
            	width: "10%",
            	align: "center",
            	sortable: false,
            	formatter : function(cellvalue, options, obj) {
        			return getFormatDateByLong(obj.FINDTIME, "yyyy-MM-dd");
        		}
            },
            {
            	name: "REFORMTIME",
            	index: "REFORMTIME",
            	width: "10%",
            	align: "center",
            	sortable: false,
            	formatter : function(cellvalue, options, obj) {
            		if(obj.REFORMTIME != null){            			
            			return getFormatDateByLong(obj.REFORMTIME, "yyyy-MM-dd");
            		} else {
            			return "--";
            		}
        		}
            },
            {
            	name: "HIDDENDANGERLEVEL",
            	index: "HIDDENDANGERLEVEL",
            	width: "10%",
            	align: "center",
            	sortable: false,
            	formatter:function(cellvalue, options, obj) { 
    				return SelectOption.getDangerlevel(obj.HIDDENDANGERLEVEL);
    			}
            },
            {
            	name: "HIDDENDANGERFROM",
            	index: "HIDDENDANGERFROM",
            	width: "7%",
            	align: "center",
            	sortable: false,
            	formatter : function(cellvalue, options, obj) {
            		return SelectOption.getDangerfrom(cellvalue);
        		}
            },
            {
            	name: "HIDDENDANGERSTATE",
            	index: "HIDDENDANGERSTATE",
            	width: "10%",
            	align: "center",
            	sortable: false,
            	formatter:function(cellvalue, options, obj) { 
            		if(obj.HIDDENDANGERSTATE == "3"){
            			if(usertype == "GOV"){            				
            				return '未整改';
            			} else if(usertype == "ENT"){
            				return '<a style="color: #0075c7;" href="javascript:void(0);" onclick="reform(\'' + obj.HIDDENDANGERID + '\',\''+obj.ISGOV+'\',\''+obj.HIDDENDANGERSTATE+'\')">未整改</a>';
            			}else{
            				return '未整改';
            			}
            		} else if(obj.HIDDENDANGERSTATE == "4"){
            			console.log(obj.ISGOV);
            			if((usertype == "GOV" && obj.ISGOV == "1") || (usertype == "ENT" && obj.ISGOV == "0")){            				
            				return '<a style="color: #0075c7;" href="javascript:void(0);" onclick="recheck(\'' + obj.HIDDENDANGERID + '\',\''+obj.ISGOV+'\',\''+obj.HIDDENDANGERSTATE+'\')">未复查</a>';
            			} else {
            				return '未复查';            				
            			}
            		} else if(obj.HIDDENDANGERSTATE == "5"){
            			if((usertype == "GOV" && obj.ISGOV == "1") || (usertype == "ENT" && obj.ISGOV == "0")){            				
            				return '<a style="color: #0075c7;" href="javascript:void(0);" onclick="handle(\'' + obj.HIDDENDANGERID + '\',\''+obj.ISGOV+'\',\''+obj.HIDDENDANGERSTATE+'\')">未核销</a>';
            			} else{
            				return '未核销';            				
            			}
            		} else {
            			return '已核销';
            		}
    			}
            }
        ];
    
  //分页表格响应式处理
    var tableHeight = $(window).height() - $(".pcheck").height() - 120 - 33;
    $(window).resize(function () {
        $("#grid-table").jqGrid("setGridHeight", $(window).height() - $('.pcheck').height() - 120 - 33);
        $("#grid-table").jqGrid("setGridWidth", $(window).width() - 20);
    });
    
    $("#grid-table").jqGrid({
        height: tableHeight,
        url: BASE_URL + "hidden/hidhiddendanger/everyHidList",
        datatype: "json",
        cache: false,
        mtype: "POST",
        colNames: colname,
        colModel: colmodel,
        postData: {
        	hiddendangerstate:3,
        	state:0
        },
        sortname: "REFORMTIME",
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
        autowidth: true,
        scrollOffset: 1,
        loadComplete:function(){
//        	$("#grid-table").jqGrid("setGridWidth", $(window).width() - 20);
        	tableScrollResize();
        }
    });

});

//弹窗tab点击事件
$('.xxtxpopupTab ul').on('click','li',function(){
	$('.xxtxpopupTab ul li').removeClass('active');
	$(this).addClass('active');
})

//点击事件
$("#wzg").off("click").on("click", function () {
	var hiddendangerstate = "3";
	var state = "0";
	reloadType(hiddendangerstate,state);
});

//点击事件
$("#wfc").off("click").on("click", function () {
	var hiddendangerstate = "4";
	var state = "3";
	reloadType(hiddendangerstate,state);
});

//点击事件
$("#whx").off("click").on("click", function () {
	var hiddendangerstate = "5";
	var state = "3";
	reloadType(hiddendangerstate,state);
});

//点击事件
$("#yqwzg").off("click").on("click", function () {
	var hiddendangerstate = "3";
	var state = "1";
	reloadType(hiddendangerstate,state);
});

function reloadType(hiddendangerstate,state) {
    $("#grid-table").jqGrid("setGridParam", {
        page: 1,
        postData: {
        	hiddendangerstate:hiddendangerstate,
        	state:state
        }
    }).trigger("reloadGrid");
}

//整改
function reform(hiddendangerid,isgov,hiddendangerstate){
	if(hiddendangerstate == "3"){
        //打开页面
        parent.openWin(BASE_URL + "views/module/hidden/hiddendanger/hiddendangerAllHandle.html?hiddendangerid=" + hiddendangerid+"&hiddendangerstate="+hiddendangerstate,
        		"隐患整改", "65%", "85%");
	} else {
		parent.toast("请选择待整改的数据！");
        return;
	}
}

//复查
function recheck(hiddendangerid,isgov,hiddendangerstate){
//	if(isgov == "0"){    		
//		parent.toast("请选择政府巡查数据！");
//		return;
//	} else{
		if(hiddendangerstate == "4"){
			//打开页面
			parent.openWin(BASE_URL + "views/module/hidden/hiddendanger/hiddendangerAllHandle.html?hiddendangerid=" + hiddendangerid+"&hiddendangerstate="+hiddendangerstate,
					"隐患验收", "65%", "85%");
		} else {
			parent.toast("请选择待复查的数据！");
			return;
		}
//	}
}

//核销
function handle(hiddendangerid,isgov,hiddendangerstate){
//	if(isgov == "0"){   
//		parent.toast("请选择政府巡查数据！");
//		return;
//	} else{
		if(hiddendangerstate == "5"){
			//打开页面
			parent.openWin(BASE_URL + "views/module/hidden/hiddendanger/hiddendangerAllHandle.html?hiddendangerid=" + hiddendangerid+"&hiddendangerstate="+hiddendangerstate+"&isRemind=0",
					"隐患核销", "65%", "85%");
		}else {
			parent.toast("请选择待核销的数据！");
			return;
		}
//	}
}

/**
 * 查看信息
 */
function display(hiddendangerid) {
	parent.openWin(BASE_URL + "views/module/hidden/hiddendanger/hiddendangerDisplay.html?hiddendangerid="+hiddendangerid,
             "隐患信息详情", "70%", "75%");
}

function reloadGrid() {
    $("#grid-table").jqGrid("setGridParam", {
        page: 1,
        postData: {}
    }).trigger("reloadGrid");
}

function getQueryString(name){
    var reg = new RegExp("(^|&)"+ name +"=([^&]*)(&|$)");
    var r = window.location.search.substr(1).match(reg);
    if(r!=null)return  unescape(r[2]); return null;
}