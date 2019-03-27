	/**
	 * 隐患信息
	 */
$(document).ready(function () {
	initSeachInput();
	initDateSeach("startTime","endTime");
	
	var privcode = getQueryString("privcode");
	if(privcode=="GOV_YHPCZF_YHGZ_WZGYH"){
		var hiddendangerstate = "3";
	} else if(privcode=="GOV_YHPCZF_YHGZ_WFCYH"){
		var hiddendangerstate = "4";
	} else if(privcode=="GOV_YHPCZF_YHGZ_WHXYH"){
		var hiddendangerstate = "5";
	} else if(privcode=="GOV_YHPCZF_YHGZ_YHHXLB"){
		var hiddendangerstate = "6";
	}
	//显示操作权限按钮
	$("#tableOpers").displayOper();
	SelectTwo.initSelect2($('#entid'), BASE_URL + "enterprise/entbusinessinfo/searchEntSimpleInfo", '请选择', formatRepo, formatRepoSelection);	
    //生成任务列表分页表格
    var colname = ["隐患id","企业名称","隐患编号","隐患名称","隐患内容","发现地点","发现时间","隐患级别","排查方式","隐患来源","隐患状态","状态","操作"],
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
                formatter:function(cellvalue, options, obj) { 
  				   return '<a href="javascript:void(0);" onclick="displayEnt(\''+obj.ENTID+'\',\''+obj.ENTNAME+'\')">'+obj.ENTNAME+'</a>';
                 }
            },
            {
                name: "HIDDENDANGERNUM",
                index: "HIDDENDANGERNUM",
                width: "15%",
                align: "center",
                sortable: false,
            	formatter: function (cellvalue, options, obj) {
            		return '<a href="javascript:void(0);" onclick="display(\'' + obj.HIDDENDANGERID + '\')">' + obj.HIDDENDANGERNUM + '</a>';
            	}
            },
            {
            	name: "HIDDENDANGERNAME",
            	index: "HIDDENDANGERNAME",
            	width: "10%",
            	align: "center",
            	sortable: false,
            	formatter: function (cellvalue, options, obj) {
            		return '<a href="javascript:void(0);" onclick="display(\'' + obj.HIDDENDANGERID + '\')">' + obj.HIDDENDANGERNAME + '</a>';
            	}
            },
            {
            	name: "HIDDENDANGERCONTENT",
            	index: "HIDDENDANGERCONTENT",
            	width: "10%",
            	align: "center",
            	sortable: false
            },
            {
            	name: "FINDSITE",
            	index: "FINDSITE",
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
            	name: "ISGOV",
            	index: "ISGOV",
            	width: "10%",
            	align: "center",
            	sortable: false,
            	formatter : function(cellvalue, options, obj) {
            		if(obj.ISGOV == "0"){
            			return "企业自查";
            		} else if(obj.ISGOV == "1"){
            			return "政府巡查";
            		}
        		}
            },
            {
            	name: "HIDDENDANGERFROM",
            	index: "HIDDENDANGERFROM",
            	width: "10%",
            	align: "center",
            	sortable: false,
            	formatter : function(cellvalue, options, obj) {
            		return SelectOption.getDangerfrom(cellvalue);
        		}
            },
            {
            	name: "state",
            	index: "state",
            	width: "10%",
            	align: "center",
            	sortable: false,
            	formatter:function(cellvalue, options, obj) { 
            		if(obj.HIDDENDANGERSTATE == "3"){
            			return '<a style="color: rgba(204,0,0,1);">未整改</a>';
            		} else if(obj.HIDDENDANGERSTATE == "4"){
            			return '<a style="color: rgba(204,153,0,1);">未复查</a>';
            		} else if(obj.HIDDENDANGERSTATE == "5"){
            			return '<a style="color: rgba(255,102,0,1);">未核销</a>';
            		} else {
            			return '<a style="color: rgba(51,153,0,1);">已核销</a>';
            		}
    			}
            },
            {
            	name: "HIDDENDANGERSTATE",
            	index: "HIDDENDANGERSTATE",
            	width: "10%",
            	align: "center",
            	sortable: false,
            	hidden: true
            },
            {
            	name: "operation",
            	index: "operation",
            	width: "10%",
            	align: "center",
            	sortable: false,
            	formatter:function(cellvalue, options, obj) { 
//            		if(hiddendangerstate == "3"){
//            			return '<a href="javascript:void(0);" onclick="reform(\'' + obj.HIDDENDANGERID + '\',\''+obj.ISGOV+'\',\''+obj.HIDDENDANGERSTATE+'\')">整改</a>';
//            		} else 
        			if(hiddendangerstate == "4"){
            			return '<a href="javascript:void(0);" onclick="recheck(\'' + obj.HIDDENDANGERID + '\',\''+obj.ISGOV+'\',\''+obj.HIDDENDANGERSTATE+'\')">复查</a>';
            		} else if(hiddendangerstate == "5"){
            			return '<a href="javascript:void(0);" onclick="handle(\'' + obj.HIDDENDANGERID + '\',\''+obj.ISGOV+'\',\''+obj.HIDDENDANGERSTATE+'\')">核销</a>';
            		} else {
            			return "";
            		}
    			}
            }
        ];
    if(hiddendangerstate != "4" && hiddendangerstate != "5"){
    	colname.splice(colname.length-1,1);
    	colmodel.splice(colmodel.length-1,1);
    } 
  //分页表格响应式处理
    var tableHeight = $(window).height() - $(".pcheck").height() - 190 - 33;
    $(window).resize(function () {
        $("#grid-table").jqGrid("setGridHeight", $(window).height() - $('.pcheck').height() - 190 - 33);
        $("#grid-table").jqGrid("setGridWidth", $(window).width() * 0.99);
    });

    $("#grid-table").jqGrid({
        height: tableHeight,
        url: BASE_URL + "hidden/hidhiddendanger/hidlist",
        datatype: "json",
        cache: false,
        mtype: "POST",
        colNames: colname,
        colModel: colmodel,
        postData: {
        	hiddendangerstate:hiddendangerstate
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
        multiselect: false,
        caption: "隐患信息列表",
        autowidth: true
    });

});
function resetData(){
	$('#daterange-btn span').html(" 日期选择");
	$("#startTime").val("");
	$("#endTime").val("");
	$("#entid").val(null).trigger("change");
    $("#hiddendangername").val("");
    $("#hiddendangerlevel").val("");
    $("#isgov").val("");
    $("#hiddendangernum").val("");
}

function seach(){
	 reloadGrid();
}
//复查
function recheck(hiddendangerid,isgov,hiddendangerstate){
	if(isgov == "0"){    		
		parent.toast("请选择政府巡查数据！");
		return;
	} else{
		if(hiddendangerstate == "4"){
			//打开页面
			parent.openWin(BASE_URL + "views/module/hidden/hiddendanger/hiddendangerAllHandle.html?hiddendangerid=" + hiddendangerid+"&hiddendangerstate="+hiddendangerstate,
					"隐患验收", "65%", "85%");
		} else {
			parent.toast("请选择待复查的数据！");
			return;
		}
	}
}

//核销
function handle(hiddendangerid,isgov,hiddendangerstate){
	if(isgov == "0"){   
		parent.toast("请选择政府巡查数据！");
		return;
	} else{
		if(hiddendangerstate == "5"){
			//打开页面
			parent.openWin(BASE_URL + "views/module/hidden/hiddendanger/hiddendangerAllHandle.html?hiddendangerid=" + hiddendangerid+"&hiddendangerstate="+hiddendangerstate,
					"隐患核销", "65%", "85%");
		}else {
			parent.toast("请选择待核销的数据！");
			return;
		}
	}
}

/*企业详细查询*/
function displayEnt(businessinfoid,entname){
	parent.openWin(BASE_URL+'views/module/enterprise/entbusinessinfo/displayEntbusinessinfo.html?businessinfoid='+businessinfoid,entname,'80%','90%');
}

/**
 * 查看信息
 */
function display(hiddendangerid) {
	parent.openWin(BASE_URL + "views/module/hidden/hiddendanger/hiddendangerDisplay.html?hiddendangerid="+hiddendangerid,
             "隐患信息详情", "70%", "75%");
}


function formatRepo(repo) {
    if (repo.loading) {
        return repo.text;
    }
    var markup = "<div class='select2-result-repository clearfix'>" + repo.text + "</div>";

    return markup;
}

function formatRepoSelection(repo) {
    $("#entid").val(repo.id);
    return repo.text;
}

function getQueryString(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
    var r = window.location.search.substr(1).match(reg);
    if (r != null)return unescape(r[2]);
    return null;
}

/**
 * 刷新时加载查询条件
 */
function reloadGrid() {
	var entid = $('#entid').val();
	var hiddendangername = $("#hiddendangername").val();
	var hiddendangernum = $("#hiddendangernum").val();
	var hiddendangerlevel = $("#hiddendangerlevel").val();
	if (hiddendangerlevel == "一般隐患") {
		hiddendangerlevel = '1'
	}else if(hiddendangerlevel == "重大隐患"){
		hiddendangerlevel = '2'
	}
	var isgov = $("#isgov").val();
	if (isgov=="企业自查") {
		isgov = "0"
	}else if(isgov=="政府巡查"){
		isgov = "1"
	}
	var startTime = $("#startTime").val();
	var endTime = $("#endTime").val();
    $("#grid-table").jqGrid("setGridParam", {
        page: 1,
        postData: {
        	entid: entid || '',
        	hiddendangername:hiddendangername ||"",
        	startTime:startTime ||"",
        	endTime:endTime ||"",
        	hiddendangernum:hiddendangernum,
        	hiddendangerlevel:hiddendangerlevel,
        	isgov:isgov
        }
    }).trigger("reloadGrid");
}