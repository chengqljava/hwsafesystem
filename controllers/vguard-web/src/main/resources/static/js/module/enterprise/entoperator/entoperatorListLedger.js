$(document).ready(function() {
	initDateSeach("stime","etime");
	if($(window).width() < 700) {
		$('.showBtn').css({"display":"none"});
		var len = $('.dropdown-menu li').length;
		for(var i = 0; i < len; i++) {
			$('.smallShow li button')[i].onclick = function () {
    				var html = $(this).html();
    				$('.clickBtn').html(html);
    			};
    		}
	}else {
		$('#btnli').css({"display":"none"});
		$("#btnli").empty();
		$('#btnli').remove();
	}
	
	var colname = ['人员id','姓名','性别','特种作业岗位','持有的特种作业操作证名称','证书编号','发证时间','证书有效期','证书发证机关']; 
	var colmodel = [
		{name:'OPERATORID',index:'OPERATORID', width:'5%',hidden: true},
		{name:'OPERATORNAME',index:'OPERATORNAME',width:'10%',align:'center',
			formatter:function(cellvalue, options, obj) { 
				   return '<a href="javascript:void(0);" onclick="display(\''+obj.OPERATORID+'\')">'+obj.OPERATORNAME+'</a>';
			}
		},
		{name:'SEX',index:'SEX',width:'5%',align:'center',
			formatter:function(cellvalue, options, obj) { 
				   return SelectOption.getSex(obj.SEX);
			}
		},
		{name:'POSITIONNAME',index:'POSITIONNAME',width:'10%',align:'left'},
		{name:'CERTIFICATENAME',index:'CERTIFICATENAME',width:'15%',align:'center'},
		{name:'CERTIFICATECODE',index:'CERTIFICATECODE',width:'10%',align:'center'},
		{name:'ISSUINGDATE',index:'ISSUINGDATE',width:'10%',align:'center',
			formatter:function(cellvalue, options, obj) { 
				if (obj.ISSUINGDATE) {
					return getSmpFormatDateByLong(obj.ISSUINGDATE, false);
				} else {
					return "";
				}
			}
		},
		{name:'VALIDITYPERIOD',index:'VALIDITYPERIOD',width:'10%',align:'center',
			formatter:function(cellvalue, options, obj) { 
				if (obj.VALIDITYPERIOD) {
					return getSmpFormatDateByLong(obj.VALIDITYPERIOD, false);
				} else {
					return "";
				}
			}
		},
		{name:'ISSUINGAUTHORITY',index:'ISSUINGAUTHORITY',width:'10%',align:'center'}
	];


	var tableHeight = $(window).height() - $('.pcheck').height() - 190 - 33;
	$(window).resize(function(){
		$("#grid-table").jqGrid( 'setGridHeight', $(window).height() - $('.pcheck').height() - 190 - 33 );
		$("#grid-table").jqGrid( 'setGridWidth', $(window).width() - 96 );
	});

    $("#grid-table").jqGrid({
    	height: tableHeight,
    	url : BASE_URL + "/enterprise/entoperator/list",
		datatype: "json",
		cache : false,
		mtype : 'post',
		colNames:colname,
		colModel:colmodel,
		postData:{
			entid:$("#entid").val() || ''
		},
		sortname : 'UPDATETIME',
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
		caption: "特种作业人员",
		//autowidth: true,
		loadComplete: function() {
			if($(window).width() < 700) {
				$('.ui-jqgrid-htable').css({"width":"900"});
				$("#grid-table").css({"width":"900" });
				$("#grid-table").closest(".ui-jqgrid-bdiv").css({ "overflow-x" : "scroll"});
				$(".ui-jqgrid-hdiv").css({ "overflow-x" : "scroll"});
			} else {
				$("#grid-table").jqGrid( 'setGridWidth', $(window).width() - 96 );
			}
		}
	});
    
});

/*搜索查询*/
$("#searchBtn").bind("click",function(){
	reloadGrid();
});

/*重置*/
function resetData(){
	$('#daterange-btn span').html(" 日期选择");
	$("#stime").val("");
	$("#etime").val("");
	$("#operatorname").val("");
}

/*加载*/
function reloadGrid(){
	$("#grid-table").jqGrid('setGridParam',{
		page:1,postData:{
			operatorname:$("#operatorname").val() || '',
			stime:$("#stime").val(),
			etime:$("#etime").val()
		}
	}).trigger("reloadGrid");
}

/*详细查询*/
function display(operatorid){
	parent.parent.openWin(BASE_URL+"/enterprise/entoperator/display/"+operatorid,'详细','60%','55%');
}