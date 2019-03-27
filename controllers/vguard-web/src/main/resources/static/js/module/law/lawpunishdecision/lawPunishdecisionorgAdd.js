var isDocSubmit = false;
var isSaved = false;
$(document).ready(function () {
    initializePage();

    $("#xqcf").change(function () {
        if ($("#xqcf").is(':checked')) {
            //添加验证信息
            $("#payorg").rules("add", {
                required: true,maxlength:100, messages: {required: "缴费机构不能为空",maxlength:"长度不能超过100"}}
            );
            $("#paybankaccount").rules("add", {
                required: true,maxlength:100, messages: {required: "缴费账号不能为空",maxlength:"长度不能超过100"}}
            );
        } else {
            //去除验证信息
            $("#payorg").rules("remove");
            $("#paybankaccount").rules("remove");
        }

    });

    $("#lawpunishdecisionform").validate({
        rules: {
            docarea: {
                required: true,
                maxlength: 2
            },
            docyear: {
                required: true,
                maxlength: 4,
                isDigits: true
            },
            docnum: {
                required: true,
                maxlength: 3,
                stringCheck: true
            },
            entname: {
                required: true,
                maxlength: 50
            },
            /*			address:{
             required: true,
             maxlength:150
             },
             zipcode:{
             required: true,
             maxlength:16
             },*/
            legalperson: {
                required: true,
                maxlength: 16
            },
            /*			duty:{
             required: true,
             maxlength:50
             },
             phone:{
             required: true,
             isPhone: true
             },*/
            illegalact: {
                required: true,
                maxlength: 250
            },
            lawarticle: {
                required: true,
                maxlength: 100

            },
            punishstandard: {
                required: true,
                maxlength: 100
            },
            punishresult: {
                required: true,
                maxlength: 100
            },
            // payorg:{
            // 	required: true,
            // 	maxlength:100
            // },
            // paybankaccount:{
            // 	required: true,
            // 	maxlength:50
            // },
            /*			reconsidergov:{
             required: true,
             maxlength:100
             },
             appealcourt:{
             required: true,
             maxlength:100
             },*/
            docdate: {
                required: true
            },
            /*			reconsiderorg:{
             required: true,
             maxlength: 100
             }*/
            enforcersign1:{
				required: true,
				maxlength: 10
			},
			enforcersign2:{
				required: true,
				maxlength:10
			},
			personsign:{
				required: true,
				maxlength:10
			}
        },
        messages: {
            docarea: {
                required: "文书区域不能为空",
                maxlength: "不能超过4个字"
            },
            docyear: {
                required: "文书年份不能为空",
                maxlength: "长度不能超过4",
                isDigits: "只能输入数字"
            },
            docnum: {
                required: "文书编号不能为空",
                stringCheck: "只能是字母数字下划线",
                maxlength: "长度不能超过4"
            },
            entname: {
                required: "被处罚单位不能为空",
                maxlength: "长度不能超过50"
            },
            /*			address:{
             required: "地址不能为空",
             maxlength: "长度不能超过150"
             },*/
            zipcode: {
                required: "邮编不能为空",
                maxlength: "长度不能超过16"
            },
            legalperson: {
                required: "法定代表人不能为空",
                maxlength: "长度不能超过16"
            },
            /*			duty:{
             required: "职务不能为空",
             maxlength:"长度不能超过50"
             },
             phone:{
             required: "电话不能为空",
             isPhone: "电话格式不对"
             },*/
            illegalact: {
                required: "违法内容不能为空",
                maxlength: "长度不能超过250"
            },
            lawarticle: {
                required: "法律法规不能为空",
                maxlength: "长度不能超过100"
            },
            punishstandard: {
                required: "法律标准不能为空",
                maxlength: "长度不能超过100"
            },
            punishresult: {
                required: "处罚结果不能为空",
                maxlength: "长度不能超过100"
            },
            // payorg:{
            // 	required: "缴费机构不能为空",
            // 	maxlength:"长度不能超过100"
            // },
            // paybankaccount:{
            // 	required: "缴费账号不能为空",
            // 	maxlength:"长度不能超过25"
            // },
            /*			reconsidergov:{
             required: "复议机构不能为空",
             maxlength:"长度不能超过100"
             },
             appealcourt:{
             required: "申诉法院不能为空",
             maxlength:"长度不能超过100"
             },*/
            docdate: {
                required: "文书日期不能为空"
            },
            /*			reconsiderorg: {
             required: "复议部门不能为空",
             maxlength:"长度不能超过100"
             }*/
            enforcersign1:{
				required: "主办执法人员签名不能为空",
				maxlength: "主办执法人员签名长度不能超过10"
			},
			enforcersign2:{
				required: "协办执法人员签名不能为空",
				maxlength:"协办执法人员签名长度不能超过10"
			},
			personsign:{
				required: "当事人签名不能为空",
				maxlength:"当事人签名长度不能超过10"
			}
        },
        submitHandler: function (form) {
            save();
        }
    });
});

$("#backBtn").bind("click", function () {
    parent.parent.closeWin();// 关闭弹出框
});


$("#reportBtn").bind("click", function () {
    if (isSaved) {
        updateDocState();
    } else {
        isDocSubmit = true;
        $("#lawpunishdecisionform").submit();
    }
});
function updateDocState() {
    $.ajax({
        type: 'post',
        url: BASE_URL + '/law/lawdocstate/updateDocState',
        cache: false,
        dataType: 'json',
        data: {
            "docid": $("#punishid").val(),
            "checkinfoid": $("#checkinfoid").val(),
            "doctype": "law_punishdecisionorg"
        },
        global: false,
        async: true,
        success: function (json) {
            if (json.success == true) {
                parent.toast(json.msg);//弹出提示信息
                $("#reportBtn").hide();
                $("#saveBtn").hide();

                $("#printBtn").show();
                $("#backBtn").show();
            } else {
                parent.toast(json.msg);
            }
        },
        error: function () {
            parent.parent.toast("网络异常");
        }
    });
}

/**保存*/
function save() {
    //
    // //需要判断选择的是当场缴纳还是限期缴纳
    // if ($("#xqcf").checked) {
    //     //添加验证信息
    //     $("#payorg").rules("add", {
    //         rules: {required: true,maxlength:100}, messages: {required: "缴费机构不能为空",maxlength:"长度不能超过100"}
    //     });
    //     $("#paybankaccount").rules("add", {
    //         rules: {required: true,maxlength:100}, messages: {required: "缴费账号不能为空",maxlength:"长度不能超过100"}
    //     });
    // } else {
    //     //去除验证信息
    //     $("#payorg").rules("remove");
    //     $("#paybankaccount").rules("remove");
    // }


    $.ajax({
        type: 'post',
        url: BASE_URL + '/law/lawpunishdecision/save',
        cache: false,
        dataType: 'json',
        data: $("#lawpunishdecisionform").serializeArray(),
        global: false,
        success: function (json) {
            if (json.success == true) {
                isSaved = true;
                if (json.docid != "" && typeof(json.docid) != "undefined") {
                    $("#punishid").val(json.docid);
                }
                if (isDocSubmit == true) {
                    updateDocState();
                    isDocSubmit = false;
                } else {
                    parent.toast(json.msg);//弹出提示信息
                    location.reload();
//                    parent.getActiveIFrame().reloadGrid();//刷新列表
                    parent.closeWin();// 关闭弹出框
                }
            } else {
                parent.toast(json.msg);
            }
        },
        error: function () {
            parent.toast("保存失败");
        }
    });
}

//初始化页面
function initializePage() {
    if ($("#punishid").val() == "") {
        $("#docyear").val(new Date().getFullYear());
//		$("#docarea").val("乐五");
    }
    setDateVal("docdate");
//    if ($("#paytype").val()=="1") {
//		$("#dccfdw").removeAttr("checked");
//		$("#xqcfdw").attr("checked",true);
//	}else{
//		//缴费方式，默认第一个
//		$("input[name=paytypeSel]").eq(0).attr("checked","checked");
//		$("#paytype").val($("input[name=paytypeSel]").eq(0).val());
//	}
}

var setDateVal = function (dateStrEleId) {
    var docDateStr = $("#" + dateStrEleId).val();
    if (docDateStr != null && docDateStr != "" && docDateStr != undefined) {
        var docDate = new Date(docDateStr);
        $("#" + dateStrEleId).val(docDate.getFullYear() + "-" + (docDate.getMonth() + 1) + "-" + docDate.getDate() + "");
    }
}
