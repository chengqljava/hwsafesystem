$(document).ready(function() {
	// 执法人员1下拉框
	SelectOption.loadSysUser("username1", {
		"jobtype" : null,
		"usertype" : "GOV"
	});
	// 执法人员2下拉框
	SelectOption.loadSysUser("username2", {
		"jobtype" : null,
		"usertype" : "GOV"
	});

	window.setTimeout(function() {
		$("#execcode1").val($("#username1 option:selected").attr("attr"));
		$("#execcode2").val($("#username2 option:selected").attr("attr"));
	}, 1000);
	$("#username1").change(function() {
		$("#execcode1").val($("#username1 option:selected").attr("attr"));
	});
	$("#username2").change(function() {
		$("#execcode2").val($("#username2 option:selected").attr("attr"));
	});

	// 隐患信息下载框
	// SelectOption.LoadLawDanger("danger",{"checkinfoid":$("#checkinfoid").val()});
	// 去除主办与协办重复人员，并级联加载协办安监员
	$("#username1").change(function() {
		var selected_value = $(this).val();// 被选中的值
		$("#username1 option").each(function() {
			$(this).show();
			var txt = $(this).val();
			if (txt == selected_value) {
				$(this).hide();
			}
		});
	});
	$("#username2").change(function() {
		var selected_value = $(this).val();// 被选中的值
		$("#username2 option").each(function() {
			$(this).show();
			var txt = $(this).val();
			if (txt == selected_value) {
				$(this).hide();
			}
		});
	});

	$("#lawdeadlineform").validate({
		rules : {
			entname : {
				required : true
			},
			docarea : {
				required : true,
				isChinese : true
			},
			docyear : {
				required : true,
				isDecimal : true
			},
			docnum : {
				required : true,
				isDecimal : true
			},
			dangerinfo : {
				required : true
			},
			deadline : {
				required : true
			},
			username1 : {
				required : true
			},
			username2 : {
				required : true
			},
			execcode1 : {
				required : true
			},
			execcode2 : {
				required : true
			},
			/*unitprin : {
				required : true
			},*/
			indate : {
				required : true
			},
			danger : {
				required : true
			}
		},
		messages : {
			entname : {
				required : "检查单位不能为空"
			},
			docarea : {
				required : "指令书发布安监办不能为空"
			},
			docyear : {
				required : "指令书发布年份不能为空"
			},
			docnum : {
				required : "指令书发布编号不能为空"
			},
			dangerinfo : {
				required : "隐患内容不能为空"
			},
			deadline : {
				required : "隐患整改期限不能为空"
			},
			username1 : {
				required : "主办执法人员不能为空"
			},
			username2 : {
				required : "协办执法人员不能为空"
			},
			execcode1 : {
				required : "主办执法人员证号不能为空"
			},
			execcode2 : {
				required : "协办执法人员证号不能为空"
			},
			/*unitprin : {
				required : "单位负责人不能为空"
			},*/
			indate : {
				required : "填写日期不能为空"
			},
			danger : {
				required : "隐患编号不能为空"
			}
		},
		submitHandler : function(form) {
			$('#lawuserid1').val($("#username1 option:selected").val());
			$('#lawuserid2').val($("#username2 option:selected").val());
			// $('#dangerinfoid').val($("#danger option:selected").val());
			save();
		}
	});
});

/* 保存(新增或编辑) */
function save() {
	$.ajax({
		type : 'post',
		url : BASE_URL + '/law/lawdeadline/save',
		cache : false,
		dataType : 'json',
		data : $("#lawdeadlineform").serializeArray(),
		global : false,
		success : function(json) {
			if (json.success == true) {
				parent.toast(json.msg);// 弹出提示信息
				parent.$("#contentIframe").attr(
						"src",
						BASE_URL + "/law/lawdeadline/"
								+ $('#menupagetype').val() + "/"
								+ $('#checkinfoid').val() + "/"
								+ $('#checkrecordid').val() + "/"
								+ $('#doccode').val());
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

$("#dangerinfo").change(function(){
	$("#dangerinfoStr").val($("#dangerinfo").val());
});

//执法依据
$("#basisBtn").click(
		function() {
			parent.openWin(BASE_URL + '/law/lawbasis/lawbasispage', '执法依据',
					'90%', '95%');
		});

function basisclick(divname){
	parent.openWin(BASE_URL + '/law/lawbasis/lawbasispage/'+divname, '执法依据',
			'90%', '95%');
}

/**
// 复选框事件
function checkclick(obj) {
	var num = obj.value;
	var rectcontent = $('#rectcontent').val(); //限期整改
	var strs= new Array(); //限期整改数组
	
	var rectcontentfast = $('#rectcontentfast').val(); //立即整改
	var strsfast= new Array(); //立即整改数组
	strsfast=rectcontentfast.split(","); //字符分割 
	
	if(obj.checked){
		// 选中
		if (rectcontent !== null && rectcontent !== undefined && rectcontent !== '') {
			rectcontent += "," + num;
		} else {
			rectcontent = num;
		}
		
		var numstrfast = "";
		for (var i = 0; i < strsfast.length; i++) {
			if(strsfast[i] != num){
				numstrfast += strsfast[i]+",";
			}
		}
		rectcontentfast = numstrfast.substring(0,(numstrfast.length-1)); ;

	} else {
		// 未选中
		if (rectcontent !== null && rectcontent !== undefined && rectcontent !== '') {
			
			strs=rectcontent.split(","); //字符分割 
			var numstr = "";
			for (var i = 0; i < strs.length; i++) {
				if(strs[i] != num){
					if(numstr == ""){
						numstr = strs[i];
					}else{
						numstr += ","+strs[i];
					}
				}
			}
			rectcontent = numstr;
			if (rectcontentfast !== null && rectcontentfast !== undefined && rectcontentfast !== '') {
				rectcontentfast += "," + num;
			} else {
				rectcontentfast = num;
			}
		}
	}
	$('#rectcontent').val(rectcontent);
	$('#rectcontentfast').val(rectcontentfast);
}
*/

// 复选框事件
function checkclick(obj) {
	var num = obj.value;
	var rectcontent = $('#rectcontent').val(); //限期整改
	var strs= new Array(); //限期整改数组
	
	if(obj.checked){
		// 选中
		if (rectcontent !== null && rectcontent !== undefined && rectcontent !== '') {
			rectcontent += "," + num;
		} else {
			rectcontent = num;
		}
		

	} else {
		// 未选中
		if (rectcontent !== null && rectcontent !== undefined && rectcontent !== '') {
			
			strs=rectcontent.split(","); //字符分割 
			var numstr = "";
			for (var i = 0; i < strs.length; i++) {
				if(strs[i] != num){
					if(numstr == ""){
						numstr = strs[i];
					}else{
						numstr += ","+strs[i];
					}
				}
			}
			rectcontent = numstr;
		}
	}
	$('#rectcontent').val(rectcontent);
}

/**
 * 返回
 */
/*
 * $("#backBtn").bind("click",function(){ var menupagetype =
 * $('#menupagetype').val(); var checkinfoid = $('#checkinfoid').val(); var
 * doccode = $('#doccode').val();
 * parent.$("#contentIframe").attr("src",BASE_URL+"/law/lawdeadline/"+menupagetype+"/"+checkinfoid+"/"+doccode);
 * });
 */
