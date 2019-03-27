/**
 * 新增和修改隐患排查记录信息
 */
$(function () {
    $("#planForm").validate({
        rules: {
        	planname:{
        		 required: true
        	},
        	plantitle: {
                required: true
            },
            leader: {
                required: true
            },
            /*phone: {
                required: true,
                isPhone:true
            },*/
            begintime: {
                required: true
            },
            endtime: {
                required: true
            }
        },
        messages: {
        	planname:{
       		 	required: "请输入计划名称"
        	},
        	plantitle: {
                required: "请输入培训主题"
            },
            leader: {
                required: "请输入负责人"
            },
            /*phone: {
                required: "请输入手机号码",
                isPhone: "请输入正确格式手机号码"
            },*/
            begintime: {
                required: "请输入计划开始时间"
            },
            endtime: {
                required: "请输入计划结束时间"
            },
        },
        submitHandler: function (form) {
            save();
        }
    });

    $.ajax({
        type: "post",
        url: BASE_URL + "train/etstrnplan/load/"+GetQueryString("planid"),
        dataType: "json",
        data: {},
        success: function (data) {
            if (data) {
                var planTpt = _.template($("#planTpt").html());
                $("#planForm").html(planTpt(data));
                if (GetQueryString("isdisplay") != 'display') {
                	initTable('userTable', data.userlist);
				}
            }
            autoHeight();
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
function initTable(code,userlist,importItems) {
    if (userlist.length === 0) {
        $('#' + code).append(' <tr id="Item0">' +
                '<td>' +
                '<input type="text" class="form-control" placeholder="请输入人员姓名" id="username0" name="username" />' +
                '</td>' +
                '<td>' +
                '<input type="text" class="form-control" id="telnumber0" placeholder="请输入联系电话" name="telnumber" />' +
                '</td>' +
                '<td>' +
                '<input type="text" class="form-control" id="deptname0" placeholder="请输入所在部门" name="deptname" />' +
                '</td>' +
               '<td align="center">' +
               '<a class="btn btn-danger" href="javascript:void(0);"  onclick="delRow(\'Item0\')">删除</a>' +
               '</td>' +
               '</tr>'
        );
        $("#username0").rules("add", {
            required: true,
            messages: {
                required: "人员姓名不能为空"
            }
        });
        $("#telnumber0").rules("add", {
            required: true,
            isPhone:true,
            messages: {
                required: "联系电话不能为空",
                isPhone:"请输入正确手机号"
            }
        });
        $("#deptname0").rules("add", {
            required: true,
            messages: {
                required: "所在部门不能为空"
            }
        });
    } else {
    	var arrTab = $("#userTable tr");
    	var i;
        $.each(userlist, function (n, user) {
        	i =  n + arrTab.length;
            var username = user.planusername || '';
            var telnumber = user.telnumber || '';
            var deptname = user.deptname || '';
            $('#' + code).append(' <tr id="Item' + i + '">' +
                    '<td>' +
                    '<input type="text" class="form-control" id="username' + i + '" placeholder="请输入人员姓名" name="username" value="' +username+ '"/>' +
                    '</td>' +
                    '<td>' +
                    '<input type="text" class="form-control" id="telnumber' + i + '" placeholder="请输入联系电话" name="telnumber" value="' + telnumber + '"/>' +
                    '</td>' +
                    '<td>' +
                    '<input type="text" class="form-control" id="deptname' + i + '" placeholder="请输入所在部门" name="deptname" value="' +deptname + '"/>' +
                    '</td>' +
                    '<td align="center">' +
                    '<a class="btn btn-danger" id="delBtn'+i+'" href="javascript:void(0);" onclick="delRow(\'Item' + i + '\')">删除</a>' +
                    '</td>' +
                    '</tr>'
            );
            $("#username"+i).rules("add", {
                required: true,
                messages: {
                    required: "人员姓名不能为空"
                }
            });
            $("#telnumber"+i).rules("add", {
                required: true,
                isPhone:true,
                messages: {
                    required: "联系电话不能为空",
                    isPhone:"请输入正确手机号"
                }
            });
            $("#deptname"+i).rules("add", {
                required: true,
                messages: {
                    required: "所在部门不能为空"
                }
            });
        });
    }
}
//添加一行检查项
function addCheckItemRow() {
    //获取最后一个子标签的id,提取出最后的数字通过正则
    var total = $('#userTable').children('tr:last-child').attr("id");
    var num;
    if (total) {
        num = parseInt(total.replace(/[^0-9]/ig, "")) + 1;
    } else {
        num = 0;
    }
    $('#userTable').append(' <tr id="Item' + num + '">' +
            '<td>' +
            '<input type="text" class="form-control" id="username' +num+ '" placeholder="请输入人员姓名" name="username"/>' +
            '</td>' +
            '<td>' +
            '<input type="text" class="form-control" id="telnumber' +num + '" placeholder="请输入联系电话" name="telnumber"/>' +
            '</td>' +
            '<td>' +
            '<input type="text" class="form-control" id="deptname' +num+ '" placeholder="请输入所在部门" name="deptname"/>' +
            '</td>' +
            '<td align="center">' +
            '<a class="btn btn-danger" href="javascript:void(0);" onclick="delRow(\'Item' + num + '\')">删除</a>' +
            '</td>' +
            '</tr>'
    );

    $("#username"+num).rules("add", {
        required: true,
        messages: {
            required: "人员姓名不能为空"
        }
    });
    $("#telnumber"+num).rules("add", {
        required: true,
        isPhone:true,
        messages: {
            required: "联系电话不能为空",
            isPhone:"请输入正确手机号"
        }
    });
    $("#deptname"+num).rules("add", {
        required: true,
        messages: {
            required: "所在部门不能为空"
        }
    });
}

function delRow(code) {
    $('#userTable').children('#' + code).remove();
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
    var userList = [];
    $('#userTable').children().each(function (i) {
        var user = {};
        var isCanAdd = false;
        $(this).children().children("input").each(function () {
            if ($(this).attr('name') == 'username') {
            	if ($(this).val()) {
            		user.username = $(this).val();
                    isCanAdd = true;
                } else {
                    return;
                }
            } else if ($(this).attr('name') == 'telnumber') {
            	user.telnumber = $(this).val() || "";
            }
            else if ($(this).attr('name') == 'deptname') {
            	user.deptname = $(this).val() || "";
            }
        });
        if (isCanAdd) {
        	userList.push(user);
        } else {
            return;
        }
        isCanAdd = false;
    });
    var formData = $("#planForm").serializeArray();
    var users = {name: 'userlist', value: JSON.stringify(userList).replace(/\"/g, "'")};//替换双引号为单引号
    formData.push(users);
    $.ajax({
		type : 'post',
		url : BASE_URL + 'train/etstrnplan/save',
		dataType : 'json',
		data : formData,
		success : function(json) {
			if (json.success == true) {
				parent.toast(json.msg);//弹出提示信息
				parent.getActiveIFrame().reloadGrid();//重新加载
				parent.closeWin();// 关闭弹出框
			} else {
				parent.toast(json.msg);
			}
		},
		error : function() {
			parent.toast("保存失败");
		}
	});
}

