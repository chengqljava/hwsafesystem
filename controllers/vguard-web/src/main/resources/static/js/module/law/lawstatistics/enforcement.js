var districtcode = "";
var districtlevel = "";
$(document).ready(function() {
        var colname = ['区域','检查企业','下发责令整改通知书','复查企业','立案','行政处罚(宗)','罚款(金额)'];
        var colmodel = [
            {name:'SHORTNAME',index:'SHORTNAME',width:'10%',align:'left',sortable : false,
                formatter:function(cellvalue, options, obj) { 
                   return '<a href="javascript:void(0);" onclick="nextLevel(\''+obj.DISTRICTCODE+'\',\''+obj.DISTRICTLEVEL+'\')">'+obj.SHORTNAME+'</a>';
                }
            },
            {name:'BJCS',index:'BJCS',width:'10%',align:'center',sortable : false,
                formatter:function(cellvalue, options, obj) { 
                   return '<a href="javascript:void(0);" onclick="openBJCS(\''+obj.DISTRICTCODE+'\',\''+obj.DISTRICTLEVEL+'\')">'+obj.BJCS+'</a>';
                }
            },
            {name:'XFZLZGTZS',index:'XFZLZGTZS',width:'10%',align:'center',sortable : false,
                formatter:function(cellvalue, options, obj) { 
                   return '<a href="javascript:void(0);" onclick="openXFZLZGTZS(\''+obj.DISTRICTCODE+'\',\''+obj.DISTRICTLEVEL+'\')">'+obj.XFZLZGTZS+'</a>';
                }
            },
            {name:'FZQYS',index:'FZQYS',width:'10%',align:'center',sortable : false,
                formatter:function(cellvalue, options, obj) { 
                   return '<a href="javascript:void(0);" onclick="openFZQYS(\''+obj.DISTRICTCODE+'\',\''+obj.DISTRICTLEVEL+'\')">'+obj.FZQYS+'</a>';
                }
            },
            {name:'LAS',index:'LAS',width:'10%',align:'center',sortable : false,
                formatter:function(cellvalue, options, obj) { 
                   return '<a href="javascript:void(0);" onclick="openLas(\''+obj.DISTRICTCODE+'\',\''+obj.DISTRICTLEVEL+'\')">'+obj.LAS+'</a>';
                }
            },
            {name:'XZCF',index:'XZCF',width:'10%',align:'center',sortable : false,
                formatter:function(cellvalue, options, obj) { 
                   return '<a href="javascript:void(0);" onclick="openXZCF(\''+obj.DISTRICTCODE+'\',\''+obj.DISTRICTLEVEL+'\')">'+obj.XZCF+'</a>';
                }
            },
            {name:'FKJE',index:'FKJE',width:'10%',align:'center',sortable : false}
        ];

        var tableHeight = $(window).height() - $('.pcheck').height() - 190;
        $(window).resize(function(){
            $("#grid-table").jqGrid( 'setGridHeight', $(window).height() - $('.pcheck').height() - 190 );
            $("#grid-table").jqGrid( 'setGridWidth', $(window).width()*0.99 );
        });

        $("#grid-table").jqGrid({
            height: tableHeight,
            url : BASE_URL + "/law/LawStatistics/enforcementStatis",
            datatype: "json",
            cache : false,
            mtype : 'POST',
            colNames:colname,
            colModel:colmodel,
            postData:{
                districtid:"",
                districtlevel:"",
                startTime:$("#starttime").val(),
                endTime:$("#endtime").val()
            },
            sortname : 'districtcode',
            sortorder : "asc",
            viewrecords : true,
            altRows: true,
            multiselect: true,
            caption: "执法情况统计表",
            autowidth: true,
            loadComplete: function() {
    			if($(window).width() < 700) {
    				$('.ui-jqgrid-htable').css({"width":"900"});
    				$("#grid-table").css({"width":"900"});
    				$("#grid-table").closest(".ui-jqgrid-bdiv").css({ "overflow-x" : "scroll","height":"350"});
    				$(".ui-jqgrid-hdiv").css({ "overflow-x" : "scroll"});
    			} else {
    				$("#grid-table").jqGrid( 'setGridWidth', $(window).width()*0.99 );
    			}
    		}
        });
});
/**
 *点击立案数 
 */
function openLas(districtid,districtlevel){
    if(districtlevel!=0){
        districtlevel--;
    }
    var startTime=$("#starttime").val();
    var endTime=$("#endtime").val();
    if(endTime==""){
        endTime = "null";
    }
     if(startTime==""){
        startTime = "null";
    }
    parent.openWin(BASE_URL+"/law/lawcase/lawcase/"+districtid+"/"+districtlevel+"/"+startTime+"/"+endTime,'立案列表','70%','75%');
}
/**
 *点击检查企业数 
 */
function openBJCS(districtid,districtlevel){
    if(districtlevel!=0){
        districtlevel--;
    }
    var startTime=$("#starttime").val();
    var endTime=$("#endtime").val();
    if(endTime==""){
        endTime = "null";
    }
     if(startTime==""){
        startTime = "null";
    }
    parent.openWin(BASE_URL+"/law/lawcheckinfo/lawcheckinfo/"+districtid+"/"+districtlevel+"/"+startTime+"/"+endTime,'检查企业列表','70%','75%');
}
/**
 * 下发责令整改通知书
 */
function openXFZLZGTZS(districtid,districtlevel){
    if(districtlevel!=0){
        districtlevel--;
    }
    var startTime=$("#starttime").val();
    var endTime=$("#endtime").val();
    if(endTime==""){
        endTime = "null";
    }
     if(startTime==""){
        startTime = "null";
    }
    parent.openWin(BASE_URL+"/law/lawdeadline/lawdeadline/"+districtid+"/"+districtlevel+"/"+startTime+"/"+endTime,'下发责令整改通知书','70%','75%');
}
/**
 * 复查企业
 */
function openFZQYS(districtid,districtlevel){
    if(districtlevel!=0){
        districtlevel--;
    }
    var startTime=$("#starttime").val();
    var endTime=$("#endtime").val();
    if(endTime==""){
        endTime = "null";
    }
     if(startTime==""){
        startTime = "null";
    }
    parent.openWin(BASE_URL+"/law/lawreview/lawreview/"+districtid+"/"+districtlevel+"/"+startTime+"/"+endTime,'复查企业','70%','75%');
}
/**
 *行政处罚 
 */
function openXZCF(districtid,districtlevel){
     if(districtlevel!=0){
        districtlevel--;
    }
    var startTime=$("#starttime").val();
    var endTime=$("#endtime").val();
    if(endTime==""){
        endTime = "null";
    }
     if(startTime==""){
        startTime = "null";
    }
    parent.openWin(BASE_URL+"/law/lawpunishdecision/lawPunishList/"+districtid+"/"+districtlevel+"/"+startTime+"/"+endTime,'行政处罚 ','70%','75%');
}

/**
 * 点击左边行政机构
 * @param districtcode2
 * @param name
 * @param districtlevel
 */
function searchDistrict(districtcode2,name,districtlevel2){
    districtcode = districtcode2;
    districtlevel = districtlevel2;
    reloadGrid(districtcode,districtlevel);
}


/**
 *点击区域名称 进入下一级
 * @param parentid
 * @param districtlevel
 * @author lzqiang
 * @date 2016年7月20日 下午1:01:20
 */
function nextLevel(parentid,districtlevel){
    if(parentid != undefined && districtlevel!=undefined && districtlevel!=3){//3级下面没有了
        $("#districtlevel").val(districtlevel);
        $("#parentid").val(parentid);
        
        $("#grid-table").jqGrid('setGridParam',{
            page:1,postData:{
                districtlevel:districtlevel,
                districtid:parentid
            }
        }).trigger("reloadGrid");
    }
}

/*加载*/
function reloadGrid(districtcode,districtlevel){
    $("#grid-table").jqGrid('setGridParam',{
        page:1,postData:{
             districtid:districtcode,
             districtlevel:districtlevel,
             startTime:$("#starttime").val(),
             endTime:$("#endtime").val()
        }
    }).trigger("reloadGrid");
}

/*搜索查询*/
$("#searchBtn").bind("click",function(){
    reloadGrid();
});

/*重置*/
$("#resetBtn").bind("click",function(){
    $('#starttime').val("");
    $('#endtime').val("");
});

