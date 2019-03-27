var arrayNewList = new Array();//保存表格勾选数据的id
$(document).ready(function() {

	//检查项类别查询
	$("input:radio[name='itemtype']").change(function (){
		reloadGrid();
	});
	
	var colname = ['主键id',"检查项目名称","检查项编号","检查内容","检查方法","参考依据","排序"]; 
	var colmodel = [
		{name:'STANDARDID',index:'STANDARDID', width:'5%',hidden: true},
		{name:'ITEMNAME',index:'ITEMNAME',width:'20%',align:'left'},
		{name:'ITEMNO',index:'ITEMNO',width:'10%',align:'left'},
		{name:'CHECKCONTENT',index:'CHECKCONTENT',width:'30%',align:'left'},
		{name:'CHECKMETHOD',index:'CHECKMETHOD',width:'10%',align:'left'},
		{name:'GIST',index:'GIST',width:'10%',align:'left'},
		{name:'ORDERNUM',index:'ORDERNUM',width:'10%',align:'left',hidden: true}
	];
	var tableHeight = $(window).height() - $('.pcheck').height() - 190 -33;
	$(window).resize(function(){
		$("#grid-table").jqGrid( 'setGridHeight', $(window).height() - $('.pcheck').height() - 190 -33 );
		$("#grid-table").jqGrid( 'setGridWidth', $(window).width()*0.99 );
	});
    
    $("#grid-table").jqGrid({
    	height: tableHeight,
    	url : BASE_URL + "/law/lawcheckrecord/checkinfo",
		datatype: "json",
		cache : false,
		mtype : 'post',
		colNames:colname,
		colModel:colmodel,
		postData:{
			itemname:$("#itemname").val(),
			itemtype:$("input[name='itemtype']:checked").val()
		},
		sortname : 'ORDERNUM',
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
		rownumbers:true,
		rownumWidth:40,
		scroll: true,
		  /* loadComplete:function(xhr){
		        var array = xhr.list;
		        alert(array);
		        if (arrayNewList.length > 0) {
		            $.each(array, function (i, item) {
		                if (arrayNewList.indexOf(item.code) > -1) {
		                    //判断arrayNewList中存在item.code值时，选中前面的复选框，
		                    $("#jqg_proList_" + item.code).attr("checked", true);
		                }
		            });
		        }

		   },
		   onSelectAll:function(aRowids,status){
		       if(status==true){
		           //循环aRowids数组，将code放入arrayNewList数组中
		           $.each(aRowids,function(i,item){
		              saveData(item);
		           })
		       }else{
		           //循环aRowids数组，将code从arrayNewList中删除
		           $.each(aRowids,function(i,item){
		              deleteIndexData(item);
		           })
		       }

		   },
		   onSelectRow:function(aRowids,status){
		       if(status==true){
		          saveData(aRowids);
		       }else{
		          deleteIndexData(aRowids);
		       }

		   },*/
		caption: "检查信息",
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
 *重写Array的remove方法	
 */
Array.prototype.remove = function(from, to) {  
    var rest = this.slice((to || from) + 1 || this.length);  
    this.length = from < 0 ? this.length + from : from;  
    return this.push.apply(this, rest);  
};

function saveData(obj){
	var rowdatas = $("#grid-table").jqGrid('getRowData', obj);
	var standardid = rowdatas.STANDARDID;
    arrayNewList.push(standardid);
    console.log(arrayNewList.toString());
}
function deleteIndexData(obj){
    //获取obj在arrayNewList数组中的索引值
	var rowdatas = $("#grid-table").jqGrid('getRowData', obj);
	var standardid = rowdatas.STANDARDID;
    for(i = 0; i < arrayNewList.length; i++){
        if (arrayNewList[i] == standardid){
            //根据索引值删除arrayNewList中的数据
            arrayNewList.remove(i);
            i--;
        }
     }
    console.log(arrayNewList.toString());
}

$("#confirmBtn").bind("click", function() {
	// 返回当前grid中复选框所选择的数据的id
	var ids = $("#grid-table").jqGrid('getGridParam', 'selarrrow');
	if (ids.length == 0) {
		// 弹出提示信息
		parent.toast("请选择检查项！");
		return;
	}
	if(ids.length > 10) {
		// 弹出提示信息
		parent.toast("检查项最多选择10项！");
		return;
	}
	
	var checkcontents = [];
	var standardids = [];
	var htmlcontent = "<textarea class='textarea' id='exacondition' name='exacondition' rows='20' cols='57' style='width: 100%;' onclick='checkpage()' maxlength='500' readonly>";
	for (var i = 0; i < ids.length; i++) {
		var id = ids[i];
		// 返回指定id行的数据
		var rowdatas = $("#grid-table").jqGrid('getRowData', id);
		checkcontents[i] = rowdatas.CHECKCONTENT;
		standardids[i] = rowdatas.STANDARDID;
		htmlcontent += "["+rowdatas.ITEMNO+"] "+rowdatas.CHECKCONTENT+"\n";
	}
	parent.frames["contentIframe"].$('#standardids').val(standardids.toString());
	htmlcontent += "</textarea>";
	parent.frames["contentIframe"].$("#exaconditionDiv").html(htmlcontent);
	arrayNewList = null;//清空数组
	parent.closeWin()
});

/*加载*/
function reloadGrid(){
	$("#grid-table").jqGrid('setGridParam',{
		page:1,postData:{
			itemname:$("#itemname").val(),
			itemtype:$("input[name='itemtype']:checked").val()
		}
	}).trigger("reloadGrid");
}

/*搜索查询*/
$("#searchBtn").bind("click",function(){
	reloadGrid();
});


/*重置*/
$("#resetBtn").bind("click",function(){
	$("#itemname").val("");
});

