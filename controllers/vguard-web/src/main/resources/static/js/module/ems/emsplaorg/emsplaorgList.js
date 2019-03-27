$(document).ready(function() {
    var colname = ['机构id','机构编号','机构名称','行政区域','机构职责','内设部门','机构成员','地图定位','所属单位']; 
    var colmodel = [
        {name:'ORGID',index:'ORGID', width:'5%',hidden: true},
        {name:'ORGNO',index:'ORGNO',width:'10%',align:'left'},
        {name:'ORGNAME',index:'ORGNAME',width:'20%',align:'left',
            formatter:function(cellvalue, options, obj) { 
                return '<a href="javascript:void(0);" onclick="display(\''+obj.ORGID+'\')">'+obj.ORGNAME+'</a>';
            }
        },
        {name:'DISTRICTNAME',index:'DISTRICTNAME',width:'10%',align:'left'},
        {name:'ORGDUTIES',index:'ORGDUTIES',width:'20%',align:'center'},
        {name:'DEPTCOUNT',index:'DEPTCOUNT',width:'10%',align:'center',
            // formatter:function(cellvalue, options, obj) { 
                // return '<a href="javascript:void(0);" onclick="displayDepts(\''+obj.ORGID+'\')">'+obj.DEPTCOUNT+'</a>';
            // }
        },
        {name:'USERCOUNT',index:'USERCOUNT',width:'10%',align:'center',
            // formatter:function(cellvalue, options, obj) { 
                // return '<a href="javascript:void(0);" onclick="displayUsers(\''+obj.ORGID+'\')">'+obj.USERCOUNT+'人</a>';
            // }
        },
        {name:'LONGITUDE',index:'LONGITUDE',width:'10%',align:'center',
            formatter:function(cellvalue, options, obj) { 
                if(obj.LONGITUDE && obj.LATITUDE){
                    return '<a href="javascript:void(0);" onclick="loactionGIS(\''+obj.LONGITUDE+'\',\''+obj.LATITUDE+'\',\''+obj.DISTRICTID+'\')">已定位</a>';
                }else{
                    return '未定位';
                }
            }
        },
        {name:'UNITNAME',index:'UNITNAME',width:'20%',align:'left'}
    ];

    var tableHeight = $(window).height() - $('.pcheck').height() - 190;
    $(window).resize(function(){
        $("#grid-table").jqGrid( 'setGridHeight', $(window).height() - $('.pcheck').height() - 190 );
        $("#grid-table").jqGrid( 'setGridWidth', $(window).width()*0.99 );
    });
        
    $("#grid-table").jqGrid({
        height: tableHeight,
        url : BASE_URL + "/ems/emsplaorg/list",
        datatype: "json",
        cache : false,
        mtype : 'post',
        colNames:colname,
        colModel:colmodel,
        postData:{
            planid:$("#planid").val()
        },
        sortname : 'ORGNO',
        sortorder : "asc",
        viewrecords : true,
        pager : "#grid-pager",
        jsonReader : {
            root : "datas",
            total : "total",
            page : "page",
            records : "records",
            repeatitems : false
        },
        rowNum:10,
        rowList:[10,20,30],
        altRows: true,
        multiselect: true,
        caption: "应急机构",
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

/*加载行政区域*/
function searchDistrict(districtid){
    $("#districtname_select").val(districtid);
    reloadGrid();
}

/*加载*/
function reloadGrid(){
    $("#grid-table").jqGrid('setGridParam',{
        page:1,postData:{
            planid:$("#planid").val()
        }
    }).trigger("reloadGrid");
}

/*搜索查询*/
$("#searchbtn").bind("click",function(){
    reloadGrid();
});

/*重置*/
$("#resetbtn").bind("click",function(){
    $("#orgname").val();
    $("#districtname_select").val();
});

/*添加*/
$("#addBtn").on("click", function () {
    parent.openWin(BASE_URL+"/ems/emsplaorg/add/"+$("#planid").val(),'添加','95%','95%');
});

/*详细查询*/
function display(orgid){
    parent.openWin(BASE_URL+"/ems/emsresorg/display/"+orgid,'详细','80%','70%');
}

/*内设应急部门*/
function displayDepts(orgid){
    parent.openWin(BASE_URL+"/ems/emsresdepart/displayDepts/"+orgid,'详细','80%','80%');
}

/*机构人员*/
function displayUsers(orgid){
    parent.openWin(BASE_URL+"/ems/emsresdepartpreson/displayUsersByOrgid/"+orgid,'详细','80%','80%');
}

/*地图定位*/
/**
 *在GIS上定位 
 *longitude:经度
 *latitude:维度 
 */
function loactionGIS(longitude,latitude,areaName){
    //parent.openWin(BASE_URL+"/olgis/gisOperBuss/position?module=gis&type=edit&longitude="+longitude+"&latitude="+latitude+"&areaName="+areaName+"&register=null",'地理定位','90%','90%',false);
	parent.openWin(BASE_URL + "/views/module/ems/common/emsMapLoc.html?lng=" + longitude + "&lat=" + latitude + "&isDisplay=1", "地理定位", "90%", "90%", false);
//	parent.openWin(BASE_URL+"/olgis/gisOperBuss/viewposition?longitude="+longitude+"&latitude="+latitude,'地理定位','90%','90%',false);
}



/*批量删除*/
$("#delBtn").on("click", function () {
    //返回当前grid中复选框所选择的数据的id 
    var ids = $("#grid-table").jqGrid('getGridParam','selarrrow');
    if(ids.length==0){
        // 弹出提示信息
        parent.toast("请选择需要删除的数据！");
        return;
    }

    var orgids=[];
    for(var i=0;i<ids.length;i++){
        var id = ids[i]; 
        //返回指定id行的数据 
        var rowdatas = $("#grid-table").jqGrid('getRowData',id);
        orgids[i]= rowdatas.ORGID;
    }
    var parmJson = orgids.toString();
    var param = {"ids":parmJson,"planid":$("#planid").val()};
    del(param);
});


/*删除方法*/
function del(param){
    parent.confirm("确认删除吗?", function() { 
         $.ajax({ 
            url: BASE_URL+"/ems/emsplaorg/delete",
            type:'post',
            dataType:'json',
            data:param,
            success: function(json){
                if(json.success==true){
                    parent.toast(json.msg);
                    reloadGrid();//刷新列表
                }else{
                    parent.toast(json.msg);
                }
            }
         });
    });
}


 

