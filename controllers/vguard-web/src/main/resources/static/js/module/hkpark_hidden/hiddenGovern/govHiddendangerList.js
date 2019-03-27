	/**
	 * 隐患信息
	 */
var privcodestate;
$(document).ready(function () {
	initSeachInput();
	initDateSeach("startTime","endTime");
	
	var privcode = getQueryString("privcode");
	if(privcode=="GOV_YHPCZF_YHGZ_WZGYH"){
		var hiddendangerstate = "3";
		privcodestate = '3';
	} else if(privcode=="GOV_YHPCZF_YHGZ_WFCYH"){
		var hiddendangerstate = "4";
		privcodestate = '4';
	} else if(privcode=="GOV_YHPCZF_YHGZ_WHXYH"){
		var hiddendangerstate = "5";
		privcodestate = '5';
	} else if(privcode=="GOV_YHPCZF_YHGZ_YHHXLB"){
		var hiddendangerstate = "6";
		privcodestate = '6';
	}
	//显示操作权限按钮
	$("#tableOpers").displayOper();
	SelectTwo.initSelect2($('#entid'), BASE_URL + "enterprise/entbusinessinfo/searchEntSimpleInfo", '请选择', formatRepo, formatRepoSelection);	
    //生成任务列表分页表格
    var colname = ["隐患id","隐患编号","企业名称","整改项目","检查人员","发现地点","发现时间","隐患级别","隐患类别","隐患来源","隐患状态","状态","操作"],
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
            	name: "ENTNAME",
            	index: "ENTNAME",
            	width: "10%",
            	align: "center",
            	sortable: false,
                formatter:function(cellvalue, options, obj) { 
                	if (cellvalue) {
                		return '<a href="javascript:void(0);" onclick="displayEnt(\''+obj.ENTID+'\',\''+obj.ENTNAME+'\')">'+obj.ENTNAME+'</a>';
					}else {
						return '--';
					}
                 }
            },
            {
            	name: "HIDDENDANGERNAME",
            	index: "HIDDENDANGERNAME",
            	width: "10%",
            	align: "center",
            	sortable: false,
            },
            {
            	name: "CHECKPERSON",
            	index: "CHECKPERSON",
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
            	name: "HIDDENDANGERTYPE",
            	index: "HIDDENDANGERTYPE",
            	width: "10%",
            	align: "center",
            	sortable: false,
            	formatter : function(cellvalue, options, obj) {
        			if (cellvalue =='1') {
						return '园区隐患';
					}else {
						return '企业隐患';
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
            		if (obj.HIDDENDANGERSTATE == '0') {
            			return '已处理';
					}else if(obj.HIDDENDANGERSTATE == "2"){
            			return  '待确认';
            		}else if(obj.HIDDENDANGERSTATE == "3"){
            			return '<a style="color: rgba(204,0,0,1);">待整改</a>';
            		} else if(obj.HIDDENDANGERSTATE == "4"){
            			return '<a style="color: rgba(204,153,0,1);">待复查</a>';
            		} else if(obj.HIDDENDANGERSTATE == "5"){
            			return '<a style="color: rgba(255,102,0,1);">待核销</a>';
            		} else if(obj.HIDDENDANGERSTATE == "6"){
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
            		if(hiddendangerstate == "3"){
            			return '<a href="javascript:void(0);" onclick="reform(\'' + obj.HIDDENDANGERID + '\',\''+obj.ISGOV+'\',\''+obj.HIDDENDANGERSTATE+'\')">整改</a>';
            		} else 
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
    //隐藏操作栏
    if(privcode == 'GOV_YHPCZF_YHGZ_YHXX' || hiddendangerstate == '6'){
    	colname.splice(colname.length-1,1);
    	colmodel.splice(colmodel.length-1,1);
    } 
    //隐藏隐患状态搜索
    if (privcode != 'GOV_YHPCZF_YHGZ_YHXX') {
    	$('#stateDIv').css('display','none');
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
    $("#hiddendangername,#hiddendangerstate,#hiddendangertype,#hiddendangerlevel").val("");
    $("#entid").val(null).trigger("change");
}

function seach(){
	 reloadGrid();
}

//整改
function reform(hiddendangerid,isgov,hiddendangerstate){
	if(hiddendangerstate == "3"){
        //打开页面
        parent.openWin(BASE_URL + "views/module/hkpark_hidden/hiddenManager/hiddendangerAllHandle.html?hiddendangerid=" + hiddendangerid+"&hiddendangerstate="+hiddendangerstate,
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
			parent.openWin(BASE_URL + "views/module/hkpark_hidden/hiddenManager/hiddendangerAllHandle.html?hiddendangerid=" + hiddendangerid+"&hiddendangerstate="+hiddendangerstate,
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
			parent.openWin(BASE_URL + "views/module/hkpark_hidden/hiddenManager/hiddendangerAllHandle.html?hiddendangerid=" + hiddendangerid+"&hiddendangerstate="+hiddendangerstate,
					"隐患核销", "65%", "85%");
		}else {
			parent.toast("请选择待核销的数据！");
			return;
		}
//	}
}

/*企业详细查询*/
function displayEnt(businessinfoid,entname){
	parent.openWin(BASE_URL+'views/module/enterprise/entbusinessinfo/displayEntbusinessinfo.html?businessinfoid='+businessinfoid,entname,'80%','90%');
}

/**
 * 查看信息
 */
function display(hiddendangerid) {
	
	parent.openWin(BASE_URL + "views/module/hkpark_hidden/displayPage/dangerInfoPage.html?hiddendangerid="+hiddendangerid,
            "隐患信息详情", "50%", "80%");
	/*parent.openWin(BASE_URL + "views/module/hkpark_hidden/hiddenManager/hiddendangerDisplay.html?hiddendangerid="+hiddendangerid,
             "隐患信息详情", "70%", "75%");*/
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
	var startTime = $("#startTime").val();
	var endTime = $("#endTime").val();
	
	//隐患类型
	var hiddendangertype = $("#hiddendangertype").val();
	if (hiddendangertype =='园区隐患') {
		hiddendangertype = '1';
	}else if (hiddendangertype =='企业隐患'){
		hiddendangertype = '2';
	}else{
		hiddendangertype = '';
	}
	
	var hiddendangerstate = $("#hiddendangerstate").val();
	if ($('#stateDIv').css('display') == 'none') {
		hiddendangerstate = privcodestate;
	}else{
		//隐患状态
		if (hiddendangerstate =='待确认') {
			hiddendangerstate = '2';
		}else if (hiddendangerstate =='待整改'){
			hiddendangerstate = '3';
		}else if (hiddendangerstate =='待复查'){
			hiddendangerstate = '4';
		}else if (hiddendangerstate =='待核销'){
			hiddendangerstate = '5';
		}else if (hiddendangerstate =='已核销'){
			hiddendangerstate = '6';
		}else if (hiddendangerstate =='已处理'){
			hiddendangerstate = '0';
		}else{
			hiddendangerstate = '';
		}
	}
	//隐患级别
	var hiddendangerlevel = $("#hiddendangerlevel").val();
	if (hiddendangerlevel =='一般隐患') {
		hiddendangerlevel = '1';
	}else if (hiddendangerlevel =='重大隐患'){
		hiddendangerlevel = '2';
	}else{
		hiddendangerlevel = '';
	}
    $("#grid-table").jqGrid("setGridParam", {
        page: 1,
        postData: {
        	entid: entid || '',
        	hiddendangername:hiddendangername ||"",
        	startTime:startTime ||"",
        	endTime:endTime ||"",
        	hiddendangerstate:hiddendangerstate,
        	hiddendangerlevel:hiddendangerlevel,
        	hiddendangertype:hiddendangertype
        }
    }).trigger("reloadGrid");
}