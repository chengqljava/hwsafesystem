var districtcode = "";
var stateArr = getQueryString("stateArr");
var isNew = getQueryString("isNew");
var placeareaid = getQueryString("placeareaid");
var searchtime = getQueryString("searchtime");
$(document).ready(
		function() {
			initSeachInput();
			// SelectOption.loadProbeState("state");//探测器状态
			/**
			 * 定时刷新列表
			 */
			window.setInterval(function() {
				reloadGrid(districtcode);
			}, 5000);

			var colname = [ '主键ID', '探头id',/* '企业名称', */'监测点位名称', '监测数值',
					'监测类型', /*'单位',*/ '状态', '监测时间' ];

			var colmodel = [
					{
						name : 'REALTIMEID',
						index : 'REALTIMEID',
						hidden : true
					},
					{
						name : 'PROBEID',
						index : 'PROBEID',
						align : 'left',
						hidden : true
					},
					/* {name:'ENTNAME',index:'ENTNAME',align:'left'}, */
					{
						name : 'PROBENAME',
						index : 'PROBENAME',
						align : 'left'
					},
					{
						name : 'CHROVAL',
						index : 'CHROVAL',
						align : 'left',
						formatter : function(cellvalue, options, obj) {
							return obj.CHROVAL+obj.UNIT;
						}
					},
					{
						name : 'PROBETYPE',
						index : 'PROBETYPE',
						align : 'left',
						formatter : function(cellvalue, options, obj) {
							return SelectOption
									.getMonitorGatherTypeResult(obj.PROBETYPE);
						}
					},
					/*{
						name : 'UNIT',
						index : 'UNIT',
						align : 'left'
					},*/
					{
						name : 'STATE',
						index : 'STATE',
						align : 'left',
						formatter : function(cellvalue, options, obj) {
							if (100 == obj.STATE || obj.STATE == 101
									|| obj.STATE == 102) {
								return "<span style='color:red'>"
										+ SelectOption.getProbeState(obj.STATE)
										+ "</span>";
							} else if (3 == obj.STATE || 4 == obj.STATE
									|| 99 == obj.STATE || 7 == obj.STATE) {
								return "<span style='color:blue'>"
										+ SelectOption.getProbeState(obj.STATE)
										+ "</span>";
							} else {
								return SelectOption.getProbeState(obj.STATE);
							}
						}
					},
					{
						name : 'UPDATETIME',
						index : 'UPDATETIME',
						align : 'left',
						formatter : function(cellvalue, options, obj) {
							return getFormatDateByLong(obj.UPDATETIME,
									"yyyy-MM-dd hh:mm:ss");
						}
					} ];

			var tableHeight = $(window).height() - $('.pcheck').height() - 190
					- 42;
			$(window).resize(
					function() {
						$("#grid-table").jqGrid(
								'setGridHeight',
								$(window).height() - $('.pcheck').height()
										- 190 - 42);
						$("#grid-table").jqGrid('setGridWidth',
								$(window).width() - 96);
					});

			$("#grid-table").jqGrid(
					{
						height : tableHeight,
						url : BASE_URL + "/monitor/macrealtime/list",
						datatype : "json",
						cache : false,
						mtype : 'post',
						colNames : colname,
						colModel : colmodel,
						postData : {
							state : "",
							entname : "",
							probename : "",
							stateArr : stateArr,
							isNew : isNew,
							placeareaid:placeareaid,
							searchtime:searchtime
						},
						sortname : 'STATE',
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
						caption : "实时监测列表",
						//autowidth : true,
						loadComplete : function() {
//							if ($("#closeBtn").length==0) {
//								$(".table-line").append('<div id="closeBtn" class="nextDiv" style="text-align: center;margin-top: 10px;">'+
//										'<button type="button" class="backBtn" onclick="parent.closeWin();"><span>关闭</span></button>'+
//								'</div>');
//							}
							if ($(window).width() < 700) {
								$('.ui-jqgrid-htable').css({
									"width" : "900"
								});
								$("#grid-table").css({
									"width" : "900"
								});
								$("#grid-table").closest(".ui-jqgrid-bdiv")
										.css({
											"overflow-x" : "scroll"
										});
								$(".ui-jqgrid-hdiv").css({
									"overflow-x" : "scroll"
								});
							} else {
								$("#grid-table").jqGrid('setGridWidth',
										$(window).width() - 96);
							}
						}
					});
		});

/* 加载 */
function reloadGrid(districtcode) {
	var p = $("#grid-table").jqGrid('getGridParam', 'page');

	var state = $("#state").val();
	if (state == "正常") {
		state = "0";
	} else if (state == "待标定") {
		state = "2";
	} else if (state == "探头故障") {
		state = "3";
	} else if (state == "预警") {
		state = "4";
	} else if (state == "通讯故障") {
		state = "7";
	} else if (state == "网络故障") {
		state = "99";
	} else if (state == "满量程") {
		state = "100";
	} else if (state == "低报") {
		state = "101";
	} else if (state == "高报") {
		state = "102";
	} else if (state == "超低报") {
		state = "103";
	} else if (state == "超高报") {
		state = "104";
	} else {
		state = "";
	}
	$("#grid-table").jqGrid('setGridParam', {
		page : p,
		postData : {
			state : state,
			entname : $("#entname").val(),
			probename : $("#probename").val(),
			districtcode : districtcode,
			isNew : isNew
		}
	}).trigger("reloadGrid");
}
/**
 * 点击左边行政机构
 * @param districtcode2
 * @param name
 * @param districtlevel
 */
function searchDistrict(districtcode2, name, districtlevel) {
	districtcode = districtcode2;
	reloadGrid(districtcode);
}

/*搜索查询*/
$("#searchbtn").bind("click", function() {
	reloadGrid();
});

/*重置*/
$("#resetbtn").bind("click", function() {
	$("#searchForm").each(function() {
		$(this).val("");
	});
});

/*详细查询*/
function display(realtimeid) {
	parent.openWin(BASE_URL + "/monitor/macrealtime/display/" + realtimeid,
			'详细', '65%', '50%');
}

/**
 * 获取当前url访问路径后缀参数值
 * @param name
 * @returns
 */
function getQueryString(name) {
	var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
	var r = window.location.search.substr(1).match(reg);
	if (r != null)
		return unescape(r[2]);
	return null;
}