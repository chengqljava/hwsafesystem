$(document).ready(function() {
	//执法人员1下拉框
	SelectOption.loadSysUser("username1",{"jobtype": null,"usertype": "GOV"});
	//执法人员2下拉框
	SelectOption.loadSysUser("username2",{"jobtype": null,"usertype": "GOV"});
	
	window.setTimeout(function(){
		$("#execcode1").val($("#username1 option:selected").attr("attr"));
		$("#execcode2").val($("#username2 option:selected").attr("attr"));
	},1000);
	$("#username1").change(function(){
		$("#execcode1").val($("#username1 option:selected").attr("attr"));
	});
	$("#username2").change(function(){
		$("#execcode2").val($("#username2 option:selected").attr("attr"));
	});
	
	//去除主办与协办重复人员，并级联加载协办安监员
	$("#username1").change(function(){
		var selected_value = $(this).val();//被选中的值
		$("#username2 option").each(function(){
			$(this).show();
			var txt = $(this).val();
			if(txt==selected_value){
				 $(this).hide();
			}
		});
	});
	$("#username2").change(function(){
		var selected_value = $(this).val();//被选中的值
		$("#username1 option").each(function(){
			$(this).show();
			var txt = $(this).val();
			if(txt==selected_value){
				 $(this).hide();
			}
		});
	});
	
	$("#lawreviewform").validate({
		rules: {
			docarea: {
				required: true,
				isChinese: true
			},
			docyear: {
				required: true,
				isDecimal: true
			},
			docnum: {
				required: true,
				isDecimal: true
			},
			entname: {
				required: true
			},
			/*dangerinfo: {
				required: true
			},
			deaarea: {
				required: true,
				isChinese: true
			},
			deayear: {
				required: true,
				isDecimal: true
			},
			deanum: {
				required: true,
				isDecimal: true
			},
			opinion: {
				required: true
			},
			unitprin: {
				required: true
			},*/
			username1: {
				required: true
			},
			username2: {
				required: true
			},
			/*deadline: {
				required: true
			},*/
			indate: {
				required: true
			}
		},
		messages: {
			docarea: {
				required: "区域不能为空"
			},
			docyear: {
				required: "年份不能为空"
			},
			docnum: {
				required: "编号不能为空"
			},
			entname: {
				required: "检查单位不能为空"
			},
			/*dangerinfo: {
				required: "整改信息不能为空"
			},
			deaarea: {
				required: "区域不能为空"
			},
			deayear: {
				required: "年份不能为空"
			},
			deanum: {
				required: "编号不能为空"
			},
			opinion: {
				required: "意见信息不能为空"
			},
			unitprin: {
				required: "单位负责人不能为空"
			},*/
			username1: {
				required: "主办安监员不能为空"
			},
			username2: {
				required: "协办安监员不能为空"
			},
			/*deadline: {
				required: "整改日期不能为空"
			},*/
			indate: {
				required: "文书日期不能为空"
			}
		},
		submitHandler:function(form){
			$('#lawuserid1').val($("#username1 option:selected").val());
			$('#lawuserid2').val($("#username2 option:selected").val());
		   	save();
	    }
	});
});

/*保存(新增或编辑)*/
function save(){
	$.ajax({
		type : 'post',
		url : BASE_URL+'/law/lawreview/save',
		cache : false,
		dataType : 'json',
		data : $("#lawreviewform").serializeArray(),
		global : false,
		success : function(json) {
			if(json.success==true){
				parent.toast(json.msg);//弹出提示信息
				parent.$("#contentIframe").attr("src",BASE_URL+"/law/lawreview/"+$('#menupagetype').val()+"/"+$('#checkinfoid').val()+"/"+$('#doccode').val());
				parent.$('#reviewid').val(json.data);
				parent.closeWin();// 关闭弹出框
			}else{
				parent.toast(json.msg);
			}
		},
		error : function() {
			parent.toast("保存失败");
		}
	});
}

/**
 * 返回
 */
$("#backBtn").bind("click",function(){
	var menupagetype = $('#menupagetype').val();
	var checkinfoid = $('#checkinfoid').val();
	var doccode = $('#doccode').val();
	parent.$("#contentIframe").attr("src",BASE_URL+"/law/lawreview/"+menupagetype+"/"+checkinfoid+"/"+doccode);
});

