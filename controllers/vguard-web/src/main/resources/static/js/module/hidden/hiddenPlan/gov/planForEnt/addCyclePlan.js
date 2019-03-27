//勾选检查项
var checkTaskArr = [];
var entList;
var creatergflag = getQueryString("creatergflag");
var pageIndex = getQueryString("pageIndex");
$(function () {
	//加载企业
	planCheckEnt();
	//加载页面
	initPage();
	//	时间轴上的点击事件
    $('body').on('click', '.timeMark', function () {
        var index = $(this).data('index');
        var sIndex = $('li.selected:last').data('index');
        if (index > sIndex) {
            return 0;
        }
        timeShowOrHide(index);
    });
    //	气象参数返回按钮点击事件
    $('#xielouTypeRetBtn').on('click', function () {
        $('#evnAnaFstType').hide();
        $('#evnAnaSecType').show();
        $('#evnAnaxielouType').hide();
        timeShowOrHide(2);
    });

    //一层页面下一步按钮
    $("#anaModeTypeForm").validate({
        rules: {
        	planname: {
                required: true
            },
            leader: {
                required: true
            },
            checkperson: {
                required: true
            },
            checktopic: {
                required: true
            },
            checkresult: {
                required: true
            }
        },
        messages: {
        	planname: {
                required: "计划名称不能为空"
            },
            leader: {
                required: "负责人不能为空"
            },
            checkperson: {
                required: "检查人不能为空"
            },
            checktopic: {
                required: "计划主题能为空"
            },
            checkresult: {
                required: "检查要求不能为空"
            }
        },
        submitHandler: function (form) {
            $('#evnAnaFstType').hide();
            $('#evnAnaSecType').show();
            $('#evnAnaxielouType').hide();
        }
    });

    //三层页面保存按钮
    $("#trdTypeSaveBtn").off("click").on("click", function () {
    	
    	//先清除当前页面内的所有项id
    	var rowIdArray = $("#taskGrid-table").jqGrid('getRowData');
    	for (var i = 0; i < rowIdArray.length; i++) {
    		if($.inArray(rowIdArray[i].CHECKTASKITEMID,checkTaskArr) != '-1'){			
    			checkTaskArr.splice($.inArray(rowIdArray[i].CHECKTASKITEMID,checkTaskArr),1);
    		}
    	};
    	
    	//新添加勾选的id
    	var curSelRowArr = $("#taskGrid-table").jqGrid("getGridParam", "selarrrow");
    	if(curSelRowArr != null){	    		
    		for (var i = 0; i < curSelRowArr.length; i++) {
    			var checktaskitemid = $("#taskGrid-table").jqGrid("getRowData", curSelRowArr[i]).CHECKTASKITEMID;
    			if($.inArray(checktaskitemid,checkTaskArr) == '-1'){        	
    				checkTaskArr.push(checktaskitemid);
    			}
    		}
    	}
    		
    	var params = $("#anaModeTypeForm").serializeArray();
    	params.push({name:"checkTaskArr",value:checkTaskArr});//关联排查项
    	params.push({name:"entArr",value:$("#optgroup").val()});//关联企业
    	
    	//判断周期类型0按天 1按周 2按月
    	if ($("input[name='frequency']:checked").val() == '0') {
    		params.push({name:"daycount",value:$("#daycount1").val()});//每隔几天
    		
		}else if($("input[name='frequency']:checked").val() == '1'){
			params.push({name:"daycount",value:$("#daycount2").val()});//每隔几周
			params.push({name:"week",value:$("#weekdate").val()});
			
		}else if($("input[name='frequency']:checked").val() == '2'){
			params.push({name:"daycount",value:$("#daycount3").val()});//每隔几月
			params.push({name:"dayly",value:$("#daydate").val()});
			
		}else if($("input[name='frequency']:checked").val() == '3'){
			var mon = $("#monthdate").val();
			params.push({name:"monthly",value:mon.substring(0,2)});
			params.push({name:"dayly",value:mon.substring(3,5)});
		}
    	
    	 var checkItemes = [];
    	    $('#checkItemTable').children().each(function (i) {
    	        var checkItem = {};
    	        var isCanAdd = false;
    	        $(this).children().children("input").each(function () {
    	            if ($(this).attr('name') == 'checkitemname') {
    	                if ($(this).val()) {
    	                	checkItem.checkitem = $(this).val();
    	                    isCanAdd = true;
    	                } else {
    	                    return;
    	                }

    	            } else if ($(this).attr('name') == 'checkcontent') {
    	            	checkItem.checkcontent = $(this).val() || "";
    	            }
    	            else if ($(this).attr('name') == 'checkrequire') {
    	            	checkItem.checkrequire = $(this).val() || "";
    	            }
    	            else if ($(this).attr('name') == 'fromway') {
    	            	checkItem.fromway = $(this).val() || "";
    	            }
    	        });
    	        if (isCanAdd) {
    	        	checkItemes.push(checkItem);
    	        } else {
    	            return;
    	        }
    	        isCanAdd = false;
    	    });
//    	var taskItemList = {name: 'checkItemes', value: JSON.stringify(checkItemes).replace(/\"/g, "'")};//新建检查项
    	params.push({name: 'checkItemes', value:JSON.stringify(checkItemes)});
//    	params.push({name: 'isgov', value:'2'});
    	params.push({name: 'creatergflag', value:creatergflag});
//        保存数据库操作
        $.ajax({
            type: "post",
            url: BASE_URL + "hidden/hidcheckplan/saveCycle",
            data:params,
            success: function (json) {
                parent.toast(json.msg);
                if (pageIndex != null && pageIndex != 'null') {
					parent.getActiveIFrame().reloadGrid(pageIndex);//重新加载
				}else{
					parent.getActiveIFrame().reloadGrid();//重新加载
				}
                parent.closeWin();//关闭窗口
            },
            error: function () {
                parent.toast("网络繁忙，请稍后重试！");
            }
        });
    });

    //三层页面返回按钮
    $("#trdTypeRetBtn").off("click").on("click", function () {
        $("#evnAnaTrdType").hide();
        $('#timeLine').show();
        timeShowOrHide(3);
    });
    
    
});

/**
 * 加载页面方法
 */
function initPage(){
	var checkplanid = getQueryString("checkplanid");
	var hidCheckItemes;
	$.ajax({
        type: "post",
        url: BASE_URL + "hidden/hidcheckplan/load",
        dataType: "json",
        data: {
        	checkplanid: checkplanid
        },
        success: function (data) {
            if (data) {
            	hidCheckItemes = data.hidCheckItemes;
            	data.entList = entList;
            	var entId =new Array();
            	$.each(data.checkEntlist,function(i,obj){
            		entId.push(obj.ENTID);
            	});
            	data.entids = entId;
            	if (data.monthly && data.dayly) {
            		data.monthDate = data.monthly+"-"+data.dayly;
				}else{
					data.monthDate = "";
				}
            	var baseInfoTb = _.template($("#baseInfoTb").html()),
            	selectEntTb = _.template($("#selectEntTb").html());
				$("#anaModeTypeForm").html(baseInfoTb(data));
				$("#evnAnaSecForm").html(selectEntTb(data));
				//回显时间方法
				showTime(data.frequency);
				//执行周期显隐切换
				showOrHidTime();
				initSelected();
				if (creatergflag == 2 || data.issuedtype == '0') {
					$.each($("input[name='iscycleplan']"),function(){
						$(this).attr("disabled",true);
					})
					$("#iscycleplan").append("<br/><span style='color:red;'>未下发计划默认关闭周期</span>")
					
				}
				/**
			     * 二层页面下一步按钮
			     */
			    $("#qixiangTypeAnaBtn").off("click").on("click", function () {
			    	
			    	if ( $('#optgroup').val() == null || $('#optgroup').val() == 0) {
			    		$("#noticeSpan").html("<font color ='red'>请选择检查企业</font>");
			    		return;
			    	}
			    	$("#noticeSpan").html("");
			    	$('#evnAnaFstType').hide();
			        $('#evnAnaSecType').hide();
			        $('#evnAnaxielouType').show();
			        timeShowOrHide(3);
			    });

			    //二层页面返回按钮
			    $("#secTypeRetBtn").off("click").on("click", function () {
			        $("#evnAnaSecType").hide();
			        $("#evnAnaFstType").show();
			        timeShowOrHide(1);
			    });
            }
        },
        error: function () {
            parent.toast("初始化信息加载失败!");
        },
        complete:function(){
        	goToTrdTypeAna(hidCheckItemes);
        }
    });
}

/**
 * 周期时间回显方法
 * @param index
 */
function showTime(frequency){
	if (frequency == 0) {
		$("#yearly,#weekly,#month").hide();
		$("#day").show();
	}else if(frequency == 1){
		$("#yearly,#day,#month").hide();
		$("#weekly").show();
	}else if(frequency == 2){
		$("#yearly,#day,#weekly").hide();
		$("#month").show();
	}else if(frequency == 3){
		$("#month,#day,#weekly").hide();
		$("#yearly").show();
	}
}

/**
 * 周期时间点击事件
 * @param index
 */
function showOrHidTime(){
	$("input[name='frequency']").off("click").on("click",function(){
		var datetype = $(this).val();
		if (datetype == 0) {
			$("#yearly,#weekly,#month").hide();
			$("#day").show();
		}else if(datetype == 1){
			$("#yearly,#day,#month").hide();
			$("#weekly").show();
		}else if(datetype == 2){
			$("#yearly,#day,#weekly").hide();
			$("#month").show();
		}else if(datetype == 3){
			$("#month,#day,#weekly").hide();
			$("#yearly").show();
		}
	});
}
//时间轴显示控制方法
function timeShowOrHide(index) {
    $('.timeMark').each(function (i, item) {
        if (i < index) {
            $(item).addClass('selected');
        }
        else {
            $(item).removeClass('selected');
        }
    })
    switch (index) {
        case 1:
            $('#evnAnaFstType').show();
            $('#evnAnaSecType').hide();
            $('#evnAnaxielouType').hide();
            break;
        case 2:
            $('#evnAnaFstType').hide();
            $('#evnAnaSecType').show();
            $('#evnAnaxielouType').hide();
            break;
        case 3:
            $('#evnAnaFstType').hide();
            $('#evnAnaSecType').hide();
            $('#evnAnaxielouType').show();
            break;
    }
}

/**
 * 获取当前url访问路径后缀参数值
 * @param name
 * @returns
 */
function getQueryString(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
    var r = window.location.search.substr(1).match(reg);
    if (r != null) return unescape(r[2]);
    return null;
}

/**
 * 加载选择框
 */
function planCheckEnt(){
	$.ajax({
        type: 'POST',
        url: BASE_URL + '/hidden/hidcheckplan/planEntZtree',
        cache: false,
        dataType: 'json',
        global: false,
        async: false,
        success: function (map) {
//        	$.each(map,function(i,obj){
//        		$.each(obj.children,function(j,child){
//        			$("#optgroup").append("<optgroup label='"+obj.name+"'>" +
//        					"<option value='"+child.id+"'>"+child.name+"</option>" +
//        			"</optgroup>");
//        		});
//        	});
        	entList = map;
        },
        error: function () {
            parent.toast("网络异常");
        }
    });  
	
}

/**
 * 初始化选择框
 */
function initSelected(){
	$('#optgroup').multiSelect({
		selectableHeader: "<input type='text' class='search-input' style='width:100%;margin-bottom:5px;' autocomplete='off' placeholder='请输入企业名称'>",
		selectionHeader: "<input type='text' class='search-input' style='width:100%;margin-bottom:5px;' autocomplete='off' placeholder='请输入企业名称'>",
	    selectableOptgroup: true,
	    afterInit: function(ms){
	        var that = this,
	            $selectableSearch = that.$selectableUl.prev(),
	            $selectionSearch = that.$selectionUl.prev(),
	            selectableSearchString = '#'+that.$container.attr('id')+' .ms-elem-selectable:not(.ms-selected)',
	            selectionSearchString = '#'+that.$container.attr('id')+' .ms-elem-selection.ms-selected';
	        that.qs1 = $selectableSearch.quicksearch(selectableSearchString).on('keydown', function(e){
	          if (e.which === 40){
	            that.$selectableUl.focus();
	            return false;
	          }
	        });
	        that.qs2 = $selectionSearch.quicksearch(selectionSearchString).on('keydown', function(e){
	          if (e.which == 40){
	            that.$selectionUl.focus();
	            return false;
	          }
	        });
	      },
	      afterSelect: function(values){
	        this.qs1.cache();
	        this.qs2.cache();
	      },
	      afterDeselect: function(values){
	        this.qs1.cache();
	        this.qs2.cache();
	      }
	});
}

//检查模板列表
function goToTrdTypeAna(hidCheckItemes) {
	var taskList;
	$.ajax({
        type: "post",
        url: BASE_URL + "hidden/hidchecktask/tasklist",
        dataType: "json",
        data: {},
        success: function (data) {
           if (data.taskList) {
//        	$("#taskList").empty();   
        	taskList = data.taskList;
           	var enable;
			$.each(data.taskList,function(index,task){
				$("#taskList").append('<tr onclick="getTaskItems(\''+task.CHECKTASKID+'\')">' +
		            '<td style="text-align:center;" title=\''+task.CHECKTASKNAME+'\'>' +
		            	task.CHECKTASKNAME +
		            '</td>' +
		            '</tr>'
		        );
			});
           }
           initCheckTable(hidCheckItemes);
           if (taskList.length > 0) {
        	   //默认显示第一个
        	   loadTaskItemsTab(data.taskList[0].CHECKTASKID);
        	   $("#taskList tr").eq(0).addClass('active');
           }else{
        	   if (hidCheckItemes.length === 0) {
        		   $("#taskList").append('<tr id="othertaskitem" onclick="otherTaskItems()">' +
	        				'<td style="text-align:center;" title="其他检查项目">其他检查项目</td>' +	          
	        				'</tr>'
	        		);
        	   }
        	   $("#taskList tr:eq(0)").addClass('active');
        	   $("#checktasklist").hide();//隐藏检查项分页列表
       		   $("#newchecktasklist").show();//显示新增检查项
           }
        },
        error: function () {
            parent.toast("初始化信息加载失败!");
        }
    });
	
	$("#taskList").on('click','tr',function(){
		$("#taskList tr").removeClass('active');
		$(this).addClass('active');
	})
	
	
	$("#addCheckItem").on('click',function(){
		$("#taskList tr").removeClass('active');
		if(!$("#othertaskitem td").text()){//如果其他检查项不存在，添加新的			
			$("#taskList").append('<tr id="othertaskitem" onclick="otherTaskItems()" class="active">' +
					'<td style="text-align:center;" title="其他检查项目">其他检查项目</td>' +	          
					'</tr>'
			);
			$('#checkItemTable').append(' <tr id="checkItem0">' +
	                '<td>' +
	                '<input type="text" class="form-control" placeholder="请输入检查项目" id="checkitemname0" name="checkitemname" />' +
	                '</td>' +
	                '<td>' +
	                '<input type="text" class="form-control" id="checkcontent0" placeholder="请输入检查内容" name="checkcontent" />' +
	                '</td>' +
	                '<td>' +
	                '<input type="text" class="form-control" id="checkrequire0" placeholder="请输入检查要求" name="checkrequire" />' +
	                '</td>' +
	                '<td>' +
	                '<input type="text" class="form-control" id="fromway0" placeholder="请输入依据条款" name="fromway" />' +
	                '</td>' +
	               '<td align="center">' +
	               '<a class="btn btn-danger" href="javascript:void(0);"  onclick="delCheckItemRow(\'checkItem0\')">删除</a>' +
	               '</td>' +
	               '</tr>'
	        );
		}
		$("#checktasklist").hide();//隐藏检查项分页列表
		$("#newchecktasklist").show();//显示新增检查项
	})
}

//绑定中标结果信息删除按钮事件
function delItem(itemid){
	$(itemid).remove();
}

function otherTaskItems(){
	$("#checktasklist").hide();//隐藏检查项分页列表
	$("#newchecktasklist").show();//显示新增检查项
}

/**
 * 刷新表格
 * @param checktaskid
 */
function getTaskItems(checktaskid){
	$("#checktasklist").show();
	$("#newchecktasklist").hide();
	//先清除当前页面内的所有项id
	var rowIdArray = $("#taskGrid-table").jqGrid('getRowData');
	for (var i = 0; i < rowIdArray.length; i++) {
		if($.inArray(rowIdArray[i].CHECKTASKITEMID,checkTaskArr) != '-1'){			
			checkTaskArr.splice($.inArray(rowIdArray[i].CHECKTASKITEMID,checkTaskArr),1);
		}
	};
	//重新添加勾选的id
	var curSelRowArr = $("#taskGrid-table").jqGrid("getGridParam", "selarrrow");
	for (var i = 0; i < curSelRowArr.length; i++) {
        var checktaskitemid = $("#taskGrid-table").jqGrid("getRowData", curSelRowArr[i]).CHECKTASKITEMID;
        if($.inArray(checktaskitemid,checkTaskArr) == '-1'){        	
        	checkTaskArr.push(checktaskitemid);
        }
    }
	reloadItemsGrid(checktaskid);
}

/**
 * 生成任务清单项列表
 */
function loadTaskItemsTab(checktaskid){
	//生成任务列表分页表格
    var colname = ["主键id", "任务id","检查项目","检查内容","检查要求","依据条款","任务名称"],
        colmodel = [
            {
                name: "CHECKTASKITEMID",
                index: "CHECKTASKITEMID",
                width: "5%",
                align: "left",
                sortable: false,
                hidden: true
            },
            {
            	name: "CHECKTASKID",
            	index: "CHECKTASKID",
            	width: "5%",
            	align: "left",
            	sortable: false,
            	hidden: true
            },
            {
            	name: "CHECKITEM",
            	index: "CHECKITEM",
            	width: "15%",
            	align: "left",
            	sortable: false,
            },
            {
            	name: "CHECKCONTENT",
            	index: "CHECKCONTENT",
            	width: "25%",
            	align: "left",
            	sortable: false,
            },
            {
            	name: "CHECKREQUIRE",
            	index: "CHECKREQUIRE",
            	width: "25%",
            	align: "left",
            	sortable: false
            },
            {
            	name: "FROMWAY",
            	index: "FROMWAY",
            	width: "20%",
            	align: "left",
            	sortable: false
            },
            {
            	name: "CHECKTASKNAME",
            	index: "CHECKTASKNAME",
            	width: "15%",
            	align: "left",
            	sortable: false
            }
        ];
    
  //分页表格响应式处理
    var tableHeight = $(window).height() - 280;
    $(window).resize(function () {
        $("#taskGrid-table").jqGrid("setGridHeight", $(window).height() - 280 );
        $("#taskGrid-table").jqGrid("setGridWidth", $(window).width() - 240 );
    });
    $("#taskGrid-table").jqGrid({
        height: tableHeight,
        url: BASE_URL + "hidden/hidchecktaskitem/list",
        datatype: "json",
        cache: false,
        mtype: "POST",
        colNames: colname,
        colModel: colmodel,
        postData: {
        	"checktaskid":checktaskid
        },
        sortname: "CHECKITEM",
        sortorder: "desc",
        viewrecords: true,
        pager: "#taskGrid-pager",
        jsonReader: {
            root: "datas",
            total: "total",
            page: "page",
            records: "records",
            repeatitems: false
        },
        rowNum: 10,
        rowList: [100, 200, 300],
        altRows: true,
        multiselect: true,
        caption: "任务排查清单列表",
        autowidth: true,
        loadComplete: function(){   
        	$("#taskGrid-table").jqGrid("setGridWidth", $(window).width()-240);
        	var rowArray = $("#taskGrid-table").jqGrid('getDataIDs');
        	var rowIdArray = $("#taskGrid-table").jqGrid('getRowData');
            for(var i = 0; i < rowArray.length; i++){
            	var rowId = rowIdArray[i].CHECKTASKITEMID
            	if($.inArray(rowId,checkTaskArr) != '-1'){        	                	
            		$("#taskGrid-table").setSelection(rowArray[i], true);
                }
        	}
        }
    });
}

/**
 * 点击左侧任务栏切换表格
 * @param checktaskid
 */
function reloadItemsGrid(checktaskid){
	$("#taskGrid-table").jqGrid("setGridParam", {
        page: 1,
        postData: {
        	checktaskid:checktaskid
        }
    }).trigger("reloadGrid");
}

/**
 * 刷新时加载查询条件
 */
function reloadGrid() {
    $("#taskGrid-table").jqGrid("setGridParam", {
        page: 1,
        postData: {
        }
    }).trigger("reloadGrid");
}