/**
 * 新增和修改隐患排查记录信息
 */
$(function () {

    var checkrecordid = GetQueryString("checkrecordid");
    $("#checkRecordForm").validate({
        rules: {
        	entname:{
        		 required: true
        	},
        	checkname: {
                required: true
            },
            checkusers: {
                required: true
            },
            /*begintime: {
                required: true
            },
            endtime: {
                required: true
            },*/
            checktime: {
                required: true
            },
            note: {
                maxlength: 100
            }
        },
        messages: {
        	entname:{
       		 	required: "检查对象不能为空"
        	},
        	checkname: {
                required: "检查记录名称不能为空"
            },
            checkusers: {
                required: "检查人员不能为空"
            },
            /*begintime: {
                required: "排查开始时间不能为空"
            },
            endtime: {
                required: "排查结束时间不能为空"
            },*/
            checktime: {
                required: "检查时间不能为空"
            },
            note: {
                maxlength: "最多输入100个字"
            }

        },
        submitHandler: function (form) {
            save();
        }
    });


    $.ajax({
        type: "post",
        url: BASE_URL + "hidden/hidcheckrecord/load",
        dataType: "json",
        data: {
        	checkrecordid: checkrecordid
        },
        success: function (data) {
            if (data) {
            	$('#entid').val(data.entid);
                var checkRecordTpt = _.template($("#checkRecordTpt").html());
                $("#checkRecordForm").html(checkRecordTpt(data));
                if (data.checktime == "" ||  data.checktime == null) {
					$("#checktime").val(getNowFormatDate());
				}
                $("#isAdd").val(data.isAdd);
                var hidCheckAttachPics = data.hidCheckAttachPics;
                var hidCheckItemes =  data.hidCheckItemes;
	            var downloadurl = BASE_URL + 'hidden/hidattach/download/';
	            showMultipleInputFile("picDiv","filehidcheckpic","image",hidCheckAttachPics, downloadurl, true);
	            $("#checkarea").attr("disabled",true); 
	            if(data.entid != null && data.entid != ""){
	            	$("#checkarea").attr("disabled",false);
	            	$("#checkarea").html("");
	            	SelectOption.loadPlacearea("checkarea",{"businessinfoid":data.entid}); 
	            }
//	            var defaultval;
//	            if(data.checkarea != null && data.checkarea != '' && data.checkarea != 'null'){
//	            	defaultval = data.checkarea;
//	            } else {
//	            	defaultval = "请选择区域岗位";
//	            }
//	            SelectTwo.initSelect2($('#checkarea'), BASE_URL + "dangersource/dssrskrecord/loadrskselect", defaultval, formatRepo, formatRepoSelection);
	            initCheckTable('checkItemTable', hidCheckItemes);
            }
        },
        error: function () {
            parent.toast("初始化信息加载失败!");
        }
    });
    
});

/**
 * 初始化隐患排查项目列表
 * @param code
 * @param hidCheckItemes
 */
function initCheckTable(code, hidCheckItemes,importItems) {
    if (hidCheckItemes.length === 0) {
        $('#' + code).append(' <tr id="checkItem0">' +
                '<td>' +
                '<input type="text" class="form-control" placeholder="请输入检查项目" id="checkitemname0" name="checkitemname" />' +
                '<input type="hidden" class="form-control" id="dangerId0"  name="dangerId" value=""/>' +
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
                '<td>' +
                '<input type="text" class="form-control" id="notes0" placeholder="请输入检查结果" name="notes" />' +
                '</td>' +
                '<td style="text-align: center;">' +
                /*'<div class="occdiseaseDiv" style="text-align: center;">'+*/
                '<input id="dangeryes0" name="danger0" type="radio" value="1" onclick="isDanger(\''+null+'\',\''+ 0 +'\')"/>有隐患</br>' +
                '<input id="dangerno0" name="danger0" type="radio" value="0" onclick="ischecked(0)" />无隐患'+
               /*'</div>'+*/
               '</td>' +
               '<td align="center">' +
               '<a class="btn btn-danger" href="javascript:void(0);"  onclick="delCheckItemRow(\'checkItem0\')">删除</a>' +
               '</td>' +
               '</tr>'
        );
        $("#checkitemname0").rules("add", {
            required: true,
            messages: {
                required: "检查项目不能为空"
            }
        });
        $("#checkcontent0").rules("add", {
            required: true,
            messages: {
                required: "检查内容不能为空"
            }
        });
        $("#checkrequire0").rules("add", {
            required: true,
            messages: {
                required: "检查要求不能为空"
            }
        });
        $("#fromway0").rules("add", {
            required: true,
            messages: {
                required: "依据条款不能为空"
            }
        });
        $("#notes0").rules("add", {
            required: true,
            messages: {
                required: "检查结果不能为空"
            }
        });
    } else {
    	var arrTab = $("#checkItemTable tr");
    	var i;
        $.each(hidCheckItemes, function (n, hidCheckItem) {
        	i =  n + arrTab.length;
            var checkitemname = hidCheckItem.CHECKITEM || '';
            var checkcontent = hidCheckItem.CHECKCONTENT || '';
            var checkrequire = hidCheckItem.CHECKREQUIRE || '';
            var fromway = hidCheckItem.FROMWAY || '';
            var dangerlevel = hidCheckItem.DANGERLEVEL;
            var checkitemid = hidCheckItem.CHECKITEMID;
            var dangerid = hidCheckItem.DANGERID;
            var note = hidCheckItem.NOTE;
            if (note == null || note == 'null') {
            	note = '';
			}
            $('#' + code).append(' <tr id="checkItem' + i + '">' +
                    '<td>' +
                    '<input type="text" class="form-control" id="checkitemname' + i + '" placeholder="请输入检查项目" name="checkitemname" value="' +checkitemname+ '"/>' +
                    '<input type="hidden" class="form-control" id="dangerId' +i+ '"  name="dangerId" value="' +dangerid+ '"/>' +
                    '</td>' +
                    '<td>' +
                    '<input type="text" class="form-control" id="checkcontent' + i + '" placeholder="请输入检查内容" name="checkcontent" value="' + checkcontent + '"/>' +
                    '</td>' +
                    '<td>' +
                    '<input type="text" class="form-control" id="checkrequire' + i + '" placeholder="请输入检查要求" name="checkrequire" value="' +checkrequire + '"/>' +
                    '</td>' +
                    '<td>' +
                    '<input type="text" class="form-control" id="fromway' + i + '" placeholder="请输入依据条款" name="fromway" value="' + fromway + '"/>' +
                    '</td>' +
                    '<td>' +
                    '<input type="text" class="form-control" id="notes' + i + '" placeholder="请输入检查结果" name="notes" value="' + note + '"/>' +
                    '</td>' +
                    '<td style="text-align: center;">' +
                    /*'<div class="occdiseaseDiv" style="text-align: center;">'+*/
                    '<input id="dangeryes' + i+ '" name="danger' + i + '" type="radio"  value="1" onclick="isDanger(\''+checkitemid+'\',\''+ i +'\')"/ >有隐患</br>' +
                    '<input id="dangerno' + i+ '" name="danger' + i + '" type="radio" value="0" onclick="ischecked(\''+i+'\')" />无隐患'+
                   /*'</div>'+*/
                    '</td>' +
                    '<td align="center">' +
                    '<a class="btn btn-danger" id="delBtn'+i+'" href="javascript:void(0);" onclick="delCheckItemRow(\'checkItem' + i + '\')">删除</a>' +
                    '</td>' +
                    '</tr>'
            );
            if (dangerlevel == "0") {
            	//无隐患
				$("#dangerno"+i).attr("checked",true);
			}else if(dangerlevel == "1" || dangerlevel == "2"){
				//有隐患
				$("#dangeryes"+i).attr("checked",true);
			}
            if(importItems != true){ //不是导入的排查项时           	
            	if (dangerlevel != "" && dangerlevel !=null && dangerlevel != "null") {
            		$("#delBtn"+i).removeClass("btn btn-danger").addClass("btn btn-default disabled");
            		$("#delBtn"+i).prop('disabled', true);
            	}
            	if ($("#checkplanid").val() != "" && $("#checkplanid").val() !=null && $("#checkplanid").val() != "null") {
            		$("#delBtn"+i).removeClass("btn btn-danger").addClass("btn btn-default disabled");
            		$("#delBtn"+i).prop('disabled', true);
            	}
            }
            $("#checkitemname"+i).rules("add", {
                required: true,
                messages: {
                    required: "检查项目不能为空"
                }
            });
            $("#checkcontent"+i).rules("add", {
                required: true,
                messages: {
                    required: "检查内容不能为空"
                }
            });
            $("#checkrequire"+i).rules("add", {
                required: true,
                messages: {
                    required: "检查要求不能为空"
                }
            });
            $("#fromway"+i).rules("add", {
                required: true,
                messages: {
                    required: "依据条款不能为空"
                }
            });
            $("#notes"+i).rules("add", {
                required: true,
                messages: {
                    required: "检查结果不能为空"
                }
            });
        });

    }
}
//添加一行检查项
function addCheckItemRow() {
    //获取最后一个子标签的id,提取出最后的数字通过正则
    var total = $('#checkItemTable').children('tr:last-child').attr("id");
    var num;
    if (total) {
        num = parseInt(total.replace(/[^0-9]/ig, "")) + 1;
    } else {
        num = 0;
    }

    $('#checkItemTable').append(' <tr id="checkItem' + num + '">' +
            '<td>' +
            '<input type="text" class="form-control" id="checkitemname' +num+ '" placeholder="请输入检查项目" name="checkitemname"/>' +
            '<input type="hidden" class="form-control" id="dangerId' +num+ '"  name="dangerId" value=""/>' +
            '</td>' +
            '<td>' +
            '<input type="text" class="form-control" id="checkcontent' +num + '" placeholder="请输入检查内容" name="checkcontent"/>' +
            '</td>' +
            '<td>' +
            '<input type="text" class="form-control" id="checkrequire' +num+ '" placeholder="请输入检查要求" name="checkrequire"/>' +
            '</td>' +
            '<td>' +
            '<input type="text" class="form-control" id="fromway' + num+ '" placeholder="请输入依据条款" name="fromway" />' +
            '</td>' +
            '<td>' +
            '<input type="text" class="form-control" id="notes' + num+ '" placeholder="请输入检查结果" name="notes" />' +
            '</td>' +
            '<td style="text-align: center;">' +
           /* '<div class="occdiseaseDiv" style="text-align: center;">'+*/
            '<input id="dangeryes' + num+ '" name="danger' + num+ '"" type="radio" value="1" onclick="isDanger(\''+null+'\',\''+ num +'\')">有隐患</br>' +
            '<input id="dangerno' + num+ '" name="danger' + num+ '"" type="radio" value="0" onclick="ischecked(\''+num+'\')" >无隐患'+
           /*'</div>'+*/
            '</td>' +
            '<td align="center">' +
            '<a class="btn btn-danger" href="javascript:void(0);" onclick="delCheckItemRow(\'checkItem' + num + '\')">删除</a>' +
            '</td>' +
            '</tr>'
    );

    $("#checkitemname"+num).rules("add", {
        required: true,
        messages: {
            required: "检查项目不能为空"
        }
    });
    $("#checkcontent"+num).rules("add", {
        required: true,
        messages: {
            required: "检查内容不能为空"
        }
    });
    $("#checkrequire"+num).rules("add", {
        required: true,
        messages: {
            required: "检查要求不能为空"
        }
    });
    $("#fromway"+num).rules("add", {
        required: true,
        messages: {
            required: "依据条款不能为空"
        }
    });
    $("#notes"+num).rules("add", {
        required: true,
        messages: {
            required: "检查结果不能为空"
        }
    });
}

var checkedFlag = "0";

function ischecked(num){
		$("#dangeryes"+num).attr("checked",false);
		$("#dangerno"+num).attr("checked",true);
}
/**
 * 淡出隐患登记窗口
 */
var dangerIds = [];
function isDanger(checkitemid,num){
	var businessinfoid = $('#entid').val();
	if (businessinfoid =='' || businessinfoid ==null || typeof("businessinfoid") == "undefined"  ) {
		parent.toast("请选择巡查企业");//弹出提示信息
		return;
	}
		$("#dangerno"+num).attr("checked",false);
		$("#dangeryes"+num).attr("checked",true);
		
	if ($("#checkitemname"+num).val() == "") {
		 parent.toast("请至少填写一项检查项信息");//弹出提示信息
		 return;
	}
	
	var dangerId = $("#dangerId"+num).val();
	
	window.top.GEventObject.die('LOAD_HID_REPORT');
	window.top.GEventObject.on('LOAD_HID_REPORT', function(dangerId) {
		$("#dangerId"+num).val(dangerId);
		$("#delBtn"+num).removeClass("btn btn-danger").addClass("btn btn-default disabled");
	});
	if (checkitemid=="null" || checkitemid=="undefined") {
		window.top.openWin(BASE_URL
				+ "views/module/hidden/hiddendanger/hiddendangerAdd.html?dangerId="+dangerId+"&hasCheck="+false+"&businessinfoid="+businessinfoid,
				'隐患登记', '60%', '70%');
	}else{
		window.top.openWin(BASE_URL
				+ "views/module/hidden/hiddendanger/hiddendangerAdd.html?checkitemid="+checkitemid+"&hasCheck="+true+"&businessinfoid="+businessinfoid,
				'隐患登记', '60%', '70%');
	}
}

/**
 * 导入隐患信息
 */
function importItems(){
	window.top.GEventObject.die('LOAD_HID_ITEMS');
	window.top.GEventObject.on('LOAD_HID_ITEMS', function(itemsArr) {
		var arrTD = [];
		var k = 1;
		var tdCon = "";
		var arr = $("#checkItemTable tr:last td").find("input");
		$.each(arr,function(i,obj){
			if (k <= 4) {
				tdCon += $(obj).val();
				k++;
			}
		});
		if (tdCon == "") {
			$("#checkItemTable tr:last").remove();
		}
		initCheckTable('checkItemTable', itemsArr,true);
	});
	window.top.openWin(BASE_URL+"views/module/hidden/checkTask/importCheckTaskMain.html?",
			'导入隐患排查模板', '55%', '70%');
}

function delCheckItemRow(code) {
    $('#checkItemTable').children('#' + code).remove();
}

function GetQueryString(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
    var r = window.location.search.substr(1).match(reg);
    if (r != null)return unescape(r[2]);
    return null;
}

/**
 * 保存
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
            }else if ($(this).attr('name') == 'dangerId') {
            	checkItem.dangerId = $(this).val() || "";
			}else if ($(this).attr('name') == 'notes') {
            	checkItem.notes = $(this).val() || "";
			}else if ($(this).attr('name') == 'danger' + i) {
				if ($(this).attr('checked')) {
					var dangerlevel = $(this).val();
					checkItem.dangerlevel = dangerlevel;
				}else{
					checkItem.dangerlevel = "";
				}
			}

        });
        if (isCanAdd) {
        	checkItemes.push(checkItem);
        } else {
            return;
        }
        isCanAdd = false;
    });
    var formData = $("#checkRecordForm").serializeArray();
    var checkItemFormData = {name: 'checkItemes', value: JSON.stringify(checkItemes).replace(/\"/g, "'")};//替换双引号为单引号
    formData.push(checkItemFormData);
    $.ajaxFileUpload({
        type: "post",
        url: BASE_URL + "hidden/hidcheckrecord/save",
        files: arrId,
        data: formData,
        dataType: "json",
        success: function (data) {
            if (data.success == true) {
                parent.toast(data.msg);//弹出提示信息
                parent.getActiveIFrame().reloadGrid();//重新加载
                parent.closeWin();// 关闭弹出框
            } else {
                parent.toast(data.msg);
            }
        },
        error: function (XMLHttpRequest, textStatus, errorThrown) {
            parent.toast("提交失败");
        }   
    });

}

/**
 * 企业信息
 */
function loadEnt(){
	/**
	 * 加载企业
	 */
	window.top.GEventObject.die('LOAD_ENT_EVENT');
	window.top.GEventObject.on('LOAD_ENT_EVENT', function(rowdata) {
		$('#entid').val(rowdata.BUSINESSINFOID);
		$('#entname').val(rowdata.ENTNAME);
		$('#entname').blur();
		$("#checkarea").attr("disabled",false); 
		$("#checkarea").html("");
		SelectOption.loadPlacearea("checkarea",{"businessinfoid":rowdata.BUSINESSINFOID});
	});
	var planid = $("#plan option:selected").val();
	window.top.openWin(BASE_URL+"/law/lawcheckinfo/entinfo?planid="+planid,' 企业信息','55%','63%');
}

function deleteFile(div, fileid) {
    $('#' + div).hide();
    $('#hidCheckAttachPics').append("<input class=\"form-control\" type='hidden' name='delids' value='" + fileid + "'/>");
}

/**
 * 关闭窗口
 */
function closeWindow(){
	 var checkItemes = [];
	    $('#checkItemTable').children().each(function () {
	        $(this).children().children("input").each(function () {
	            if ($(this).attr('name') == 'dangerId') {
	            	if ($(this).val() !="" && $(this).val() !=null && $(this).val() !='undefined') {
	            		checkItemes.push($(this).val());
					}
				}
	        });
	    });
	if (checkItemes.length > 0 && $("#isAdd").val() == 'true') {
//		layer.confirm("该排查记录已录入隐患信息，确认关闭？", function(index){
		delReps({"ids": checkItemes.toString()});
	}
		parent.closeWin();
//		});  
//	}else{
//		 parent.closeWin();
//	}
}

/**
 * 未保存隐患记录是删除已录入的隐患信息
 * @param param
 */
function delReps(param) {
    //弹出提示框
    $.ajax({
      url: BASE_URL + "/hidden/hidhiddendanger/delete",
       type: "post",
       dataType: "json",
       data: param,
       async:false,
       success: function (json) {
    	   if (json.success == true) {
//    		   parent.getActiveIFrame().reloadGrid();//重新加载
    	   } else {
    		   parent.toast(json.msg);
    	   }
       },
       error: function (XMLHttpRequest, textStatus, errorThrown) {
       }  
     });
}