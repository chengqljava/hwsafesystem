var isDocSubmit=false;
var isSaved=false;

$(document).ready(function() {
	initializePage();
	$("#lawinspectform").validate({
		rules: {
			docarea:{
				required: true,
				maxlength:5
			},
			docyear:{
				required: true,
				maxlength:4,
				isDigits:true
			},
			docnum:{
				required: true,
				maxlength:8,
				stringCheck:true
			},
			inspectrequire:{
				required: true
			},
			inspecttime:{
				required: true
			},
			createtime:{
				required: true
			}
		},
		messages: {
			docarea:{
				required: "文书区域不能为空",
				maxlength:"文书区域长度不能超过5"
			},
			docyear:{
				required: "文书年份不能为空",
				maxlength:"文书年份长度不能超过4",
				isDigits:"只能输入数字"
			},
			docnum:{
				required: "文书编号不能为空",
				stringCheck:"只能是字母数字下划线",
				maxlength:"文书编号长度不能超过8"
			},
			inspectrequire:{
				required: "鉴定要求不能为空"
			},
			inspecttime:{
				required: "提交鉴定时间不能为空"
			},
			createtime:{
				required: "文书发布时间不能为空"
			}
		},
		submitHandler:function(form){
	    	save();
	    }   
	});
});

/**
 * 返回
 */
$("#backBtn").bind("click",function(){
	parent.parent.closeWin();// 关闭弹出框
});

/**
 * 添加一行
 */
function insertTR(){
	var lenth = $("#voucherTab").find("tr:last").find("td:first").text();
	var trcount = $("#voucherTab tr").length;
	var html = '<tr> '+
		'		<td><input type="text" class="unborder" id="name'+trcount+'" name="name'+trcount+'"></td>  '+
		'		<td><input type="text" class="unborder" id="model'+trcount+'" name="model'+trcount+'"></td>  '+
		'		<td><input type="text" class="unborder" id="num'+trcount+'" name="num'+trcount+'"></td>  '+	 	  					
		'		<td><input type="text" class="unborder" id="notes'+trcount+'" name="notes'+trcount+'"></td>  '+	 	  					
		'		<td><button type="button" class="unborder" onclick="insertTR()">新增</button>  '+
		'		    <button type="button" class="unborder" onclick="delTR(this)">删除</button></td>  '+
		'	</tr>';
	$("#voucherTab").append(html);
	$("#trcount").val(trcount);
}
/**
 * 删除一行
 */
function delTR(obj){
	$(obj).parent().parent().remove();
	var trcount = $("#voucherTab tr").length;
	if(trcount==1){
		html='<tr>'+
			 '	<td><input type="text" class="unborder" id="name1" name="name1"></td>'+
			 '	<td><input type="text" class="unborder" id="model1" name="model1"></td>'+
			 '	<td><input type="text" class="unborder" id="num1" name="num1"></td>'+					
			 '	<td><input type="text" class="unborder" id="notes1" name="notes1"></td>'+	  					
			 '	<td>'+
			 '		<button type="button" class="unborder" id="voucherAdd">新增</button>'+
			 '	</td>'+
			 '</tr>';
		$("#voucherTab").append(html);
		$("#trcount").val(trcount);
	}else{
		$("#trcount").val(parseInt(trcount)-1);
	}
}

/**
 * 替换页面元素
 */
function initializePage(){
	if($("#inspectid").val() == ""){
		$("#docyear").val(new Date().getFullYear());
	}
	
	$("#inspecttimeDiv").html(
			"<input class='underline' type='text' placeholder='   年   月  日' id='inspecttime' name='inspecttime' onfocus='WdatePicker({dateFmt:\"yyyy-MM-dd\"})' class='underline' style='width:200px'/>");
	var inspecttime_hidden = $("#inspecttime_hidden").val();
	if(inspecttime_hidden)
		$("#inspecttime").val(formatCSTDate(inspecttime_hidden,"yyyy-MM-dd"));
	
	$("#createtimeDiv").html(
			"<input class='underline' placeholder='   年   月  日' type='text' id='createtime' name='createtime' onfocus='WdatePicker({dateFmt:\"yyyy-MM-dd\"})' class='underline' style='width:200px'/>");
	var createtime_hidden = $("#createtime_hidden").val();
	if(createtime_hidden)
		$("#createtime").val(formatCSTDate(createtime_hidden,"yyyy-MM-dd"));
}


/**
 * 鉴定委托书物品验证
 */
function validate(){
    var trcount = $("#trcount").val();
    for(var i=1;i<=trcount;i++){
        var name = $("#name"+i).val();//128
        var model = $("#model"+i).val();//128
        var num = $("#num"+i).val();//8
        var notes = $("#notes"+i).val();//600
        if(name!="" && name.length>42){
            parent.toast("名称字数大于42");
            return false;
        }
        if(model!="" && model.length>42){
            parent.toast("规格及批号字数大于42");
            return false;
        }
        if(num!="" && isNaN(num)){
            parent.toast("数量不是数字");
            return false;
        }else if(num!="" && num.length>=8){
            parent.toast("数量长度不能超过8");
            return false;
        }
        //备注
        if(notes!="" && notes.length>200){
            parent.toast("备注字数大于200");
            return false;
        }
    }
    return true;
}


$("#reportBtn").bind("click",function(){
	if(isSaved){
		 updateDocState();
	}else{
	isDocSubmit=true;
	$("#lawinspectform").submit();
	}
});
function updateDocState(){
$.ajax({
    type: 'post',
    url: BASE_URL + '/law/lawdocstate/updateDocState',
    cache: false,
    dataType: 'json',
    data: {
        "docid": $("#inspectid").val(),
        "checkinfoid": $("#checkinfoid").val(),
        "doctype": "law_inspect"
    },
    global: false,
    async: true,
    success: function (json) {
		if(json.success==true){
			parent.toast(json.msg);//弹出提示信息
			$("#reportBtn").hide();
			$("#saveBtn").hide();
			
	        $("#printBtn").show();
	        $("#backBtn").show();
		}else{
			parent.toast(json.msg);
		}
    },
    error: function () {
     parent.parent.toast("网络异常");
    }
});
}


/**保存*/
function save(){
    if(!validate()){
        return;
    }
	$.ajax({
		type : 'post',
		url : BASE_URL+'/law/lawinspect/save',
		cache : false,
		dataType : 'json',
		data : $("#lawinspectform").serializeArray(),
		global : false,
		success : function(json) {
			if(json.success==true){
				isSaved=true;
				if(isDocSubmit==true){
					if(json.docid!=""&&typeof(json.docid)!="undefined"){
						$("#inspectid").val(json.docid);
					}
					updateDocState();
					isDocSubmit=false;
				}else{
				parent.toast(json.msg);//弹出提示信息
//				parent.getActiveIFrame().reloadGrid();//刷新列表
//				parent.closeWin();// 关闭弹出框
				}
			}else{
				parent.toast(json.msg);
			}
		},
		error : function() {
			parent.toast("保存失败");
		}
	});
}