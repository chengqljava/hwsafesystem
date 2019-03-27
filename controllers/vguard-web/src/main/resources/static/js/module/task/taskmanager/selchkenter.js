$(function() {
	SelectOption.loadSubjection("subjection");// 单位管辖隶属关系
	var colname = [ '主键id', '企业用户id', '企业名称', '行业主管分类', '注册地址', '注册时间', '注册用户',
			'注册部门', '审核状态' ];
	var colmodel = [
			{
				name : 'BUSINESSINFOID',
				index : 'BUSINESSINFOID',
				width : '5%',
				hidden : true
			},
			{
				name : 'USERID',
				index : 'USERID',
				width : '5%',
				hidden : true
			},
			{
				name : 'ENTNAME',
				index : 'ENTNAME',
				width : '20%',
				align : 'left'
			},
			{
				name : 'DIRECTORTYPENAME',
				index : 'DIRECTORTYPENAME',
				width : '20%',
				align : 'left'
			},
			{
				name : 'ADDRESS',
				index : 'ADDRESS',
				width : '20%',
				align : 'left'
			},
			{
				name : 'REGISTERDATE',
				index : 'REGISTERDATE',
				width : '15%',
				align : 'left',
				formatter : function(cellvalue, options, obj) {
					return getFormatDateByLong(obj.REGISTERDATE,
							"yyyy-MM-dd hh:mm:ss");
				}
			}, {
				name : 'NICKNAME',
				index : 'NICKNAME',
				width : '10%',
				align : 'left'
			}, {
				name : 'ORGNAME',
				index : 'ORGNAME',
				width : '10%',
				align : 'left'
			}, {
				name : 'CHECKSTATES',
				index : 'CHECKSTATES',
				width : '10%',
				align : 'left',
				editoptions : {
					value : "0:未审核;1:已审核"
				},
				formatter : 'select'
			} ];
	var tableHeight = $(window).height() - $('.pcheck').height() - 190 - 33;
	$(window).resize(
			function() {
				$("#grid-table").jqGrid('setGridHeight',
						$(window).height() - $('.pcheck').height() - 190 - 33);
				$("#grid-table").jqGrid('setGridWidth',
						$(window).width() * 0.99);
			});
	$("#grid-table").jqGrid(
			{
				height : tableHeight,
				url : BASE_URL + "/enterprise/entbusinessinfo/list",
				datatype : "json",
				cache : false,
				mtype : 'post',
				colNames : colname,
				colModel : colmodel,
				postData : {
					entname : $("#entname").val(),
					registernum : $("#registernum").val(),
					subjection : $("#subjection").val(),
					entcode : $("#entcode").val(),
					datastatus : "true",
					districtid : $("#districtid").val()
				},
				sortname : 'updatetime',
				sortorder : "desc",
				viewrecords : true,
				pager : "#grid-pager",
				jsonReader : {
					root : "datas",
					total : "total",
					page : "page",
					records : "records",
					repeatitems : false
				},
				rowNum : 10,
				rowList : [ 10, 20, 30 ],
				altRows : true,
				multiselect : true,
				caption : "工商信息",
				autowidth : true,
				loadComplete : function() {
					if ($(window).width() < 700) {
						$('.ui-jqgrid-htable').css({
							"width" : "900"
						});
						$("#grid-table").css({
							"width" : "900"
						});
						$("#grid-table").closest(".ui-jqgrid-bdiv").css({
							"overflow-x" : "scroll"
						});
						$(".ui-jqgrid-hdiv").css({
							"overflow-x" : "scroll"
						});
						$("#grid-table").jqGrid('setGridHeight', 500);
					} else {
						$("#grid-table").jqGrid('setGridWidth',
								$(window).width() * 0.99);
					}
				}
			});
});

/* 加载 */
function reloadGrid() {
	$("#grid-table").jqGrid('setGridParam', {
		page : 1,
		postData : {
			entname : $("#entname").val(),
			registernum : $("#registernum").val(),
			subjection : $("#subjection").val(),
			entcode : $("#entcode").val(),
			datastatus : "true",
			districtid : $("#districtid").val()
		}
	}).trigger("reloadGrid");
}

/* 搜索查询 */
$("#searchBtn").bind("click", function() {
	reloadGrid();
});

/* 重置 */
$("#resetBtn").bind("click", function() {
	$("#entname").val("");
	$("#registernum").val("");
	$("#subjection").val("");
	$("#entcode").val("");
});

/**
 * 选择检查企业
 */
$("#selEntBtn").off("click").on(
		"click",
		function() {
			// 返回当前grid中复选框所选择的数据的id
			var curSelRowArr = $("#grid-table").jqGrid("getGridParam",
					"selarrrow");
			var isSingle = $("#isSingle").val();
			if (isSingle) {
				if (1 != curSelRowArr.length) {
					// 弹出提示信息
					parent.toast("请选择一个需要选择的企业！");
					return;
				}

				var curRowDataObj = $("#grid-table").jqGrid("getRowData",
						curSelRowArr[0]);
				// 给父窗口中企业赋值方法
				var index = parent.getParentIndex();
				parent.frames["layui-layer-iframe" + index].setEntInfo({
					"curEntId" : curRowDataObj.BUSINESSINFOID,
					"curEntName" : curRowDataObj.ENTNAME
				});
				parent.closeWin();
			} else {

				var selIds = new Array();
				var selNames = new Array();
				$.each(curSelRowArr, function(index, item) {
					var curRowDataObj = $("#grid-table").jqGrid("getRowData",
							curSelRowArr[index]);
					selIds.push(curRowDataObj.BUSINESSINFOID);
					selNames.push(curRowDataObj.ENTNAME);
					console.log(curRowDataObj);
				});
				// 给父窗口中企业赋值方法
				var index = parent.getParentIndex();
				parent.frames["layui-layer-iframe" + index].setEntInfo({
					"curEntIds" : selIds.join(),
					"curEntNames" : selNames.join()
				});
				parent.closeWin();
			}
		});