/**
 * 新增编辑
 */
$(function() {
	var electricid = getQueryString("electricid");
	var isDisplay = getQueryString("isDisplay");
	$("#environmentalForm").validate({
		rules : {
			powersupply:{
				required : true
			},
			loadlevel:{
				required : true
			},
			management:{
				required : true
			},
			telphone:{
				required : true,
				isPhone:true
			}
		},
		messages : {
			powersupply:{
				required : "供电方式不能为空"
			},
			loadlevel:{
				required : "负荷等级不能空"
			},
			management:{
				required : "管理部门不能空"
			},
			telphone:{
				required : "手机号码不能为空",
				isPhone:"请输入正确手机格式"
			}
		},
		submitHandler:function(form){
			save();
		} 
	});

	$.ajax({
		type : "post",
		url : BASE_URL + "publics/publicelectric/load",
		dataType : "json",
		data : {
			"electricid":electricid
		},
		success : function(data) {
			if (data) {
				var environmentalTpt = _.template($("#environmentalTpt").html());
				$("#environmentalForm").html(environmentalTpt(data));
//				var attachmentList = data.attachmentList;
//				var downloadurl = BASE_URL + 'publics/publicattachment/download/';
//		        showMultipleInputFile("attachment","waterattach","file",attachmentList, downloadurl, true);
		        var exitstationList = data.exitstationList;
		        initExitTable('exitstationTable',exitstationList);
		        var planstationList = data.planstationList;
		        initPlanTable('planstationTable',planstationList);
		        var attachmentList = data.attachmentList;//附件
	            var downloadurl = BASE_URL + 'publics/publicattachment/download/';
		        if (isDisplay == "isDisplay") {
	            	 showChooseFiles('attachment', attachmentList, downloadurl, false);
				}else{
					SelectOption.loadLoadlevel("loadlevel");
					showMultipleInputFile("attachment","waterattach","file",attachmentList, downloadurl, true);
				}
			}
		},
		error : function() {
			parent.toast("加载失败");
		}
	});

});

function getQueryString(name) {
	var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
	var r = window.location.search.substr(1).match(reg);
	if (r != null)
		return unescape(r[2]);
	return null;
}

/**
 * 初始化现有变电站列表
 * @param code
 * @param exitstationList
 */
function initExitTable(code, exitstationList) {
    if (exitstationList.length > 0) {
    	$.each(exitstationList, function (n, exitstation) {
            var stationname = exitstation.stationname || '';
            var capacity = exitstation.capacity || '';
            var voltagelevel = exitstation.voltagelevel || '';
            var address = exitstation.address || '';
            var stationid = exitstation.stationid;
            var longitude = exitstation.longitude;
            var latitude = exitstation.latitude;
            var exitstation = "exitstation";
            $('#' + code).append(' <tr id="exitstation' + n + '">' +
                    '<td>' +
                    '<input type="text" class="form-control" id="stationname' + n + '" placeholder="请输入变电站名称" maxlength="50" name="stationname" value="' +stationname+ '"/>' +
                    '<input type="hidden" class="form-control" id="stationid' +n+ '"  name="stationid" value="' +stationid+ '"/>' +
                    '</td>' +
                    '<td>' +
                    '<input type="text" class="form-control" id="capacity' + n + '" placeholder="请输入变电站容量" maxlength="25" name="capacity" value="' + capacity + '"/>' +
                    '</td>' +
                    '<td>' +
                    '<input type="text" class="form-control" id="voltagelevel' + n + '" placeholder="请输入电压等级" maxlength="25" name="voltagelevel" value="' +voltagelevel + '"/>' +
                    '</td>' +
                    '<td>' +
                    '<input type="text" class="form-control" id="address' + n + '" placeholder="请输入地理位置" maxlength="50" name="address" value="' + address + '"/>' +
                    '</td>' +
                    '<td align="center">'+
					'<input type="hidden" id="isDisplay' + n+ '" value="0" />'+
					'<input type="hidden" id="longitude' + n+ '" value="'+longitude+'" name="longitude"/>'+
					'<input type="hidden" id="latitude' + n+ '" value="'+latitude+'" name="latitude"/>'+
					'<button type="button" class="backBtn" onclick="position(\''+exitstation+'\',\''+ n+'\');">地理定位</button>'+
					'</td>'+
                    '<td align="center">' +
                    '<a class="btn btn-danger" id="delBtn'+n+'" href="javascript:void(0);" onclick="delExitstationRow(\'exitstation' + n + '\')">删除</a>' +
                    '</td>' +
                    '</tr>'
            );
    	});
    }
}

//添加一行现有变电站项
function addExitstationRow() {
    //获取最后一个子标签的id,提取出最后的数字通过正则
    var total = $('#exitstationTable').children('tr:last-child').attr("id");
    var num;
    if (total) {
        num = parseInt(total.replace(/[^0-9]/ig, "")) + 1;
    } else {
        num = 0;
    }
    var exitstation = "exitstation";
    $('#exitstationTable').append(' <tr id="exitstation' + num + '">' +
            '<td>' +
            '<input type="text" class="form-control" id="stationname' +num+ '" placeholder="请输入变电站名称" maxlength="50" name="stationname"/>' +
            '<input type="hidden" class="form-control" id="stationid' +num+ '"  name="stationid" value=""/>' +
            '</td>' +
            '<td>' +
            '<input type="text" class="form-control" id="capacity' +num + '" placeholder="请输入变电站容量" maxlength="25" name="capacity"/>' +
            '</td>' +
            '<td>' +
            '<input type="text" class="form-control" id="voltagelevel' +num+ '" placeholder="请输入电压等级" maxlength="25" name="voltagelevel"/>' +
            '</td>' +
            '<td>' +
            '<input type="text" class="form-control" id="address' + num+ '" placeholder="请输入地理位置" maxlength="50" name="address" />' +
            '</td>' +
            '<td align="center">'+
			'<input type="hidden" id="isDisplay' + num+ '" value="0" />'+
			'<input type="hidden" id="longitude' + num+ '" value="" name="longitude"/>'+
			'<input type="hidden" id="latitude' + num+ '" value="" name="latitude"/>'+
			'<button type="button" class="backBtn" id="positionBtn' + num+ '" onclick="position(\''+exitstation+'\',\''+ num+'\');">地理定位</button>'+
			'</td>'+
            '<td align="center">' +
            '<a class="btn btn-danger" href="javascript:void(0);" onclick="delExitstationRow(\'exitstation' + num + '\')">删除</a>' +
            '</td>' +
            '</tr>'
    );
}

function delExitstationRow(code) {
    $('#exitstationTable').children('#' + code).remove();
}

/**
 * 初始化规划变电站列表
 * @param code
 * @param exitstationList
 */
function initPlanTable(code, planstationList) {
    if (planstationList.length > 0) {
    	 $.each(planstationList, function (n, planstation) {
             var stationname = planstation.stationname || '';
             var capacity = planstation.capacity || '';
             var voltagelevel = planstation.voltagelevel || '';
             var planbuilddate = planstation.planbuilddate || '';
             var builddate = getFormatDateByLong(planbuilddate, 'yyyy-MM-dd');
             var planworkdate = planstation.planworkdate || '';
             var workdate = getFormatDateByLong(planworkdate, 'yyyy-MM-dd');
             var address = planstation.address || '';
             var stationid = planstation.stationid;
             var longitude = planstation.longitude;
             var latitude = planstation.latitude;
             var planstation = "planstation";
             $('#' + code).append(' <tr id="planstation' + n + '">' +
                     '<td>' +
                     '<input type="text" class="form-control" id="stationname' + n + '" placeholder="请输入变电站名称" maxlength="50" name="stationname" value="' +stationname+ '"/>' +
                     '<input type="hidden" class="form-control" id="stationid' +n+ '"  name="stationid" value="' +stationid+ '"/>' +
                     '</td>' +
                     '<td>' +
                     '<input type="text" class="form-control" id="capacity' + n + '" placeholder="请输入变电站容量" maxlength="25" name="capacity" value="' + capacity + '"/>' +
                     '</td>' +
                     '<td>' +
                     '<input type="text" class="form-control" id="voltagelevel' + n + '" placeholder="请输入电压等级" maxlength="25" name="voltagelevel" value="' +voltagelevel + '"/>' +
                     '</td>' +
                     '<td>' +
                     "<input type=\"text\" class=\"form-control\" onclick=\"WdatePicker({dateFmt:'yyyy-MM-dd'})\" id=\"planbuilddate\""+n+" name=\"planbuilddate\" value=\""+builddate+"\" readonly/>" +
                     '</td>' +
                     '<td>' +
                     "<input type=\"text\" class=\"form-control\" onclick=\"WdatePicker({dateFmt:'yyyy-MM-dd'})\" id=\"planworkdate\""+n+" name=\"planworkdate\" value=\""+workdate+"\" readonly/>" +
                     '</td>' +
                     '<td>' +
                     '<input type="text" class="form-control" id="address' + n + '" placeholder="请输入地理位置" maxlength="50" name="address" value="' + address + '"/>' +
                     '</td>' +
                     '<td align="center">'+
         			 '<input type="hidden" id="isDisplay' + n+ '" value="0" />'+
         			 '<input type="hidden" id="longitudePlan' + n+ '" value="'+longitude+'" name="longitude"/>'+
         			 '<input type="hidden" id="latitudePlan' + n+ '" value="'+latitude+'" name="latitude"/>'+
         			 '<button type="button" class="backBtn" id="positionBtn' + n+ '" onclick="position(\''+planstation+'\',\''+ n +'\');">地理定位</button>'+
         			 '</td>'+
                     '<td align="center">' +
                     '<a class="btn btn-danger" id="delBtn'+n+'" href="javascript:void(0);" onclick="delPlanstationRow(\'planstation' + n + '\')">删除</a>' +
                     '</td>' +
                     '</tr>'
             );
    	 });
    }
}

//添加一行检查项
function addPlanstationRow() {
    //获取最后一个子标签的id,提取出最后的数字通过正则
    var total = $('#planstationTable').children('tr:last-child').attr("id");
    var num;
    if (total) {
        num = parseInt(total.replace(/[^0-9]/ig, "")) + 1;
    } else {
        num = 0;
    }
    var planstation = "planstation";
    $('#planstationTable').append(' <tr id="planstation' + num + '">' +
            '<td>' +
            '<input type="text" class="form-control" id="stationname' +num+ '" placeholder="请输入变电站名称" maxlength="50" name="stationname"/>' +
            '<input type="hidden" class="form-control" id="stationid' +num+ '"  name="stationid" value=""/>' +
            '</td>' +
            '<td>' +
            '<input type="text" class="form-control" id="capacity' +num + '" placeholder="请输入变电站容量" maxlength="25" name="capacity"/>' +
            '</td>' +
            '<td>' +
            '<input type="text" class="form-control" id="voltagelevel' +num+ '" placeholder="请输入电压等级" maxlength="25" name="voltagelevel"/>' +
            '</td>' +
            '<td>' +
            "<input type=\"text\" class=\"form-control\" onclick=\"WdatePicker({dateFmt:'yyyy-MM-dd'})\" id=\"planbuilddate\""+num+" name=\"planbuilddate\" placeholder=\"请输入计划建设时间\" readonly/>" +
            '</td>' +
            '<td>' +
            "<input type=\"text\" class=\"form-control\" onclick=\"WdatePicker({dateFmt:'yyyy-MM-dd'})\" id=\"planworkdate\""+num+" name=\"planworkdate\" placeholder=\"请输入计划投运时间\" readonly/>" +
            '</td>' +
            '<td>' +
            '<input type="text" class="form-control" id="address' + num+ '" placeholder="请输入地理位置" maxlength="50" name="address" />' +
            '</td>' +
            '<td align="center">'+
			'<input type="hidden" id="isDisplay' + num+ '" value="0" />'+
			'<input type="hidden" id="longitudePlan' + num+ '" value="" name="longitude"/>'+
			'<input type="hidden" id="latitudePlan' + num+ '" value="" name="latitude"/>'+
			'<button type="button" class="backBtn" id="positionBtn' + num+ '" onclick="position(\''+planstation+'\',\''+ num +'\');">地理定位</button>'+
			'</td>'+
            '<td align="center">' +
            '<a class="btn btn-danger" href="javascript:void(0);" onclick="delPlanstationRow(\'planstation' + num + '\')">删除</a>' +
            '</td>' +
            '</tr>'
    );
}

function delPlanstationRow(code) {
    $('#planstationTable').children('#' + code).remove();
}

/**
 * 保存
 * 
 * @returns
 */

function save() {
	var uplist = $("input[name^=file]");
	var arrId = [];
	for (var i = 0; i < uplist.length; i++) {
		if (uplist[i].value) {
			arrId[i] = uplist[i].id;
		}
	}
	
    var exitstations = [];
    $('#exitstationTable').children().each(function () {
        var exitstation = {};
        var isCanAdd = false;
        $(this).children().children("input").each(function () {
            if ($(this).attr('name') == 'stationname') {
                if ($(this).val()) {
                	exitstation.stationname = $(this).val();
                    isCanAdd = true;
                } else {
                    return;
                }
            } else if ($(this).attr('name') == 'capacity') {
            	exitstation.capacity = $(this).val() || "";
            }
            else if ($(this).attr('name') == 'voltagelevel') {
            	exitstation.voltagelevel = $(this).val() || "";
            }
            else if ($(this).attr('name') == 'address') {
            	exitstation.address = $(this).val() || "";
            }
            else if ($(this).attr('name') == 'longitude') {
            	exitstation.longitude = $(this).val() || "";
            }
            else if ($(this).attr('name') == 'latitude') {
            	exitstation.latitude = $(this).val() || "";
            }
        });
        if (isCanAdd) {
        	exitstations.push(exitstation);
        } else {
            return;
        }
        isCanAdd = false;
    });
	
    var planstations = [];
    $('#planstationTable').children().each(function () {
        var planstation = {};
        var isCanAdd = false;
        $(this).children().children("input").each(function () {
            if ($(this).attr('name') == 'stationname') {
                if ($(this).val()) {
                	planstation.stationname = $(this).val();
                    isCanAdd = true;
                } else {
                    return;
                }
            } else if ($(this).attr('name') == 'capacity') {
            	planstation.capacity = $(this).val() || "";
            }
            else if ($(this).attr('name') == 'voltagelevel') {
            	planstation.voltagelevel = $(this).val() || "";
            }
            else if ($(this).attr('name') == 'planbuilddate') {
            	planstation.planbuilddate = $(this).val() || "";
            }
            else if ($(this).attr('name') == 'planworkdate') {
            	planstation.planworkdate = $(this).val() || "";
            }
            else if ($(this).attr('name') == 'address') {
            	planstation.address = $(this).val() || "";
            }
            else if ($(this).attr('name') == 'longitude') {
            	planstation.longitude = $(this).val() || "";
            }
            else if ($(this).attr('name') == 'latitude') {
            	planstation.latitude = $(this).val() || "";
            }
        });
        if (isCanAdd) {
        	planstations.push(planstation);
        } else {
            return;
        }
        isCanAdd = false;
    });
    
    var formData = $("#environmentalForm").serializeArray();
    var exitstationFormData = {name: 'exitstationList', value: JSON.stringify(exitstations).replace(/\"/g, "'")};//替换双引号为单引号
    var planstationFormData = {name: 'planstationList', value: JSON.stringify(planstations).replace(/\"/g, "'")};//替换双引号为单引号
    formData.push(exitstationFormData);
    formData.push(planstationFormData);
	$.ajaxFileUpload({
		type : "post",
		url : BASE_URL + "publics/publicelectric/save",
		files : arrId,
		cache : false,
		dataType : 'json',
		data : formData,
		global : false,
		success : function(data) {
			if(data.success==true){
				parent.toast(data.msg);//弹出提示信息
				parent.getActiveIFrame().reloadGrid();//刷新列表
				parent.closeWin();// 关闭弹出框
			}else{
				parent.toast(data.msg);
			}
		},
		error : function() {
			parent.toast("保存失败");
		}
	});
}

function position(flag,num){
	 var isDisplay = $("#isDisplay"+num).val();
	 var longitude;
	 var latitude;
	if (flag == "exitstation") {
		longitude = encodeURIComponent($('#longitude'+num).val());
		latitude= encodeURIComponent($('#latitude'+num).val());
	}else{
		longitude = encodeURIComponent($('#longitudePlan'+num).val());
		latitude= encodeURIComponent($('#latitudePlan'+num).val());
	}
    
    //当编辑地图点位时
    if ("0" == isDisplay) {
    	window.top.GEventObject.die("LOAD_BDMAPPT_EVENT");
    	window.top.GEventObject.on("LOAD_BDMAPPT_EVENT", function(param) {
    		if (flag == "exitstation") {
    			$('#longitude'+num).val(param.lng);
    			$('#latitude'+num).val(param.lat);
			}else{
				$('#longitudePlan'+num).val(param.lng);
    			$('#latitudePlan'+num).val(param.lat);
			}
    	});
    }
    parent.parent.openWin(BASE_URL + "/views/module/ems/common/emsMapLoc.html?lng=" + longitude + "&lat=" + latitude + "&isDisplay="+ isDisplay, "地理定位", "50%", "50%", false);
}


function positionDisplay(longitude,latitude,isDisplay){
    parent.parent.openWin(BASE_URL + "/views/module/ems/common/emsMapLoc.html?lng=" + longitude + "&lat=" + latitude + "&isDisplay="+ isDisplay, "地理定位", "50%", "50%", false);
}