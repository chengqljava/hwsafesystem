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
            	console.log(data.entid);
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
function initCheckTable(code, hidCheckItemes, importItems) {
    if (hidCheckItemes.length === 0) {
        $('#' + code).append(' <tr id="checkItem0">' +
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
    } else {
    	var arrTab = $("#checkItemTable tr");
    	var i;
        $.each(hidCheckItemes, function (n, hidCheckItem) {
        	i =  n + arrTab.length;
            var checkitemname = hidCheckItem.CHECKITEM || '';
            var checkcontent = hidCheckItem.CHECKCONTENT || '';
            var checkrequire = hidCheckItem.CHECKREQUIRE || '';
            var fromway = hidCheckItem.FROMWAY || '';
            var dangerlevel = hidCheckItem.DANGERLEVEL || '';
            $('#' + code).append(' <tr id="checkItem' + i + '">' +
                    '<td>' +
                    '<input type="text" class="form-control" id="checkitemname' + i + '" placeholder="请输入检查项目" name="checkitemname" value="' +checkitemname+ '"/>' +
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
                    '<td align="center">' +
                    '<a class="btn btn-danger" id="delBtn'+i+'" href="javascript:void(0);" onclick="delCheckItemRow(\'checkItem' + i + '\')">删除</a>' +
                    '</td>' +
                    '</tr>'
            );
            if(importItems != true){//非模板导入数据            	
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
		initCheckTable('checkItemTable', itemsArr, true);
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
            }
            checkItem.notes = "";
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
//    formData.push({name: 'checkarea', value: $("#checkarea").text().trim()});
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

function formatRepo(repo) {
    if (repo.loading) {
        return repo.text;
    }
    var markup = "<div class='select2-result-repository clearfix'>" + repo.text + "</div>";
    $("#checkarea").text("");
    return markup;
}

function formatRepoSelection(repo) {
    $("#checkarea").val(repo.text);
    return repo.text;
}

SelectTwo.initSelect2 = function initSelect2($id, url, placename, formatRepo, formatRepoSelection) {
    var ac = $id.attr("allowClear");
    if (ac == 'true' || ac == true) {
        ac = true;
    } else {
        ac = false;
    }
    var $idselect = $id.select2({
        ajax: {
            type: "post",
            url: url,
            dataType: 'json',
            delay: 250,
            data: function (params) {
                var query = {
                    //需要传递
                	checkarea: params.term
                }
                return query;
            },
            processResults: function (data) {
                var itemList = [];
                for (var i = 0; i < data.length; i++) {
                    itemList.push({id: data[i].ID, text: data[i].TEXT});
                }
                return {
                    results: itemList,
                    pagination: {
                        more: false
                    }
                };
            }
        },
        placeholder: placename,
        escapeMarkup: function (markup) {
            return markup;
        },
        language: "zh-CN",
        templateResult: formatRepo,
        templateSelection: formatRepoSelection,
        allowClear: ac,
        tags: true
    });
    return $idselect;
}