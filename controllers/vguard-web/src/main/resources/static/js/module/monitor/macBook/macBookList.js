/**
 * 设备台账信息
 */
$(document)
		.ready(
				function() {
					var usestate = getQueryString("usestate");
					initSeachInput();
					initDateSeach("startTime", "endTime");

					// 显示操作权限按钮
					$("#tableOpers").displayOper();

					// 生成任务列表分页表格
					var colname = [ "设备编号id", "设备id", "设备名称", "设备类型id", "设备类型",
							"品牌系列id", "品牌系列", "设备型号id", "设备型号", "设备编码",
							"设备存放位置", "设备状态", "录入日期" ], colmodel = [
							{
								name : "DEVICEINFOID",
								index : "DEVICEINFOID",
								width : "5%",
								align : "center",
								sortable : false,
								hidden : true
							},
							{
								name : "DEVICEID",
								index : "DEVICEID",
								width : "5%",
								align : "center",
								sortable : false,
								hidden : true
							},
							{
								name : "DEVICENAME",
								index : "DEVICENAME",
								width : "15%",
								align : "center",
								sortable : false,
								formatter : function(cellvalue, options, obj) {
									return '<a href="javascript:void(0);" onclick="displayDeviceInfo(\''
											+ obj.DEVICEINFOID
											+ '\')">'
											+ obj.DEVICENAME + '</a>';
								}
							},
							{
								name : "DEVICETYPEID",
								index : "DEVICETYPEID",
								width : "5%",
								align : "center",
								sortable : false,
								hidden : true
							},
							{
								name : "DEVICETYPENAME",
								index : "DEVICETYPENAME",
								width : "10%",
								align : "center",
								sortable : false
							},
							{
								name : "BRANDID",
								index : "BRANDID",
								width : "10%",
								align : "center",
								sortable : false,
								hidden : true
							},
							{
								name : "BRANDNAME",
								index : "BRANDNAME",
								width : "10%",
								align : "center",
								sortable : false
							},
							{
								name : "BRANDTYPEID",
								index : "BRANDTYPEID",
								width : "10%",
								align : "center",
								sortable : false,
								hidden : true
							},
							{
								name : "BRANDTYPENAME",
								index : "BRANDTYPENAME",
								width : "10%",
								align : "center",
								sortable : false
							},
							{
								name : "DEVICENUM",
								index : "DEVICENUM",
								width : "10%",
								align : "center",
								sortable : false
							},
							{
								name : "POSITION",
								index : "POSITION",
								width : "10%",
								align : "center",
								sortable : false
							},
							{
								name : "USESTATE",
								index : "USESTATE",
								width : "10%",
								align : "center",
								sortable : false,
								formatter : function(cellvalue, options, obj) {
									if (obj.USESTATE == "1") {
										return '<a style="color: rgba(51,153,0,1);">正常</a>';
									} else if (obj.USESTATE == "2") {
										return '<a style="color: rgba(204,153,0,1);">备用</a>';
									} else if (obj.USESTATE == "3") {
										return '<a style="color: rgba(204,0,0,1);">故障待修</a>';
									} else if (obj.USESTATE == "4") {
										return '<a style="color: rgba(204,0,0,1);">报废</a>';
									} else if (obj.USESTATE == "5") {
										return '<a style="color: rgba(204,0,0,1);">闲置</a>';
									} else {
										return '<a style="color: rgba(204,0,0,1);">--</a>';
									}
								}
							},
							{
								name : "CREATETIME",
								index : "CREATETIME",
								width : "10%",
								align : "center",
								sortable : false,
								formatter : function(cellvalue, options, obj) {
									return getFormatDateByLong(obj.CREATETIME,
											"yyyy-MM-dd");
								}
							} ];
					// 分页表格响应式处理
					var tableHeight = $(window).height()
							- $(".pcheck").height() - 190 - 33;
					$(window).resize(
							function() {
								$("#grid-table").jqGrid(
										"setGridHeight",
										$(window).height()
												- $('.pcheck').height() - 190
												- 33);
								$("#grid-table").jqGrid("setGridWidth",
										$(window).width() * 0.99);
							});

					$("#grid-table").jqGrid({
						height : tableHeight,
						url : BASE_URL + "monitor/macdeviceinfo/macBookList",
						datatype : "json",
						cache : false,
						mtype : "POST",
						colNames : colname,
						colModel : colmodel,
						postData : {
							usestate:usestate,
							devicename : $("#devicename").val()
						},
						sortname : "CREATETIME",
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
						caption : "设备台账列表",
						autowidth : true,
						loadComplete: function() {
							if ($("#closeBtn").length==0) {
								$(".table-line").append('<div id="closeBtn" class="col-sm-offset-4 col-sm-4" style="text-align: center; margin-top: 10px;">'+
										'<button type="button" class="backBtn" onclick="parent.closeWin();"><span>关闭</span></button>'+
								'</div>');
							}
						}
						
					});

				});

function resetData() {
	$('#daterange-btn span').html(" 日期选择");
	$("#startTime").val("");
	$("#endTime").val("");
	$("#devicename").val("");
}

function seach() {
	reloadGrid();
}

/**
 * 查看设备信息
 */
function displayDeviceInfo(deviceinfoid) {
	parent.openWin(BASE_URL
			+ "views/module/monitor/macBook/macDeviceInfo.html?deviceinfoid="
			+ deviceinfoid, "设备信息详情", "65%", "60%");
}

function getQueryString(name) {
	var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
	var r = window.location.search.substr(1).match(reg);
	if (r != null)
		return unescape(r[2]);
	return null;
}

/**
 * 刷新时加载查询条件
 */
function reloadGrid() {
	var devicename = $("#devicename").val();
	var startTime = $("#startTime").val();
	var endTime = $("#endTime").val();

	$("#grid-table").jqGrid("setGridParam", {
		page : 1,
		postData : {
			devicename : devicename || "",
			startTime : startTime || "",
			endTime : endTime || ""
		}
	}).trigger("reloadGrid");
}