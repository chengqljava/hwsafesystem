var isDocSubmit=false;
var isSaved=false;

$(document).ready(function() {
	initializePage();
	$("#lawevidenceadviceform").validate({
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
			reason:{
				required: true
			},
			handletime:{
				required: true
			},
			handleaddress:{
				required: true,
				maxlength:150
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
			reason:{
				required: "违法行为不能为空"
			},
			handletime:{
				required: "时间不能为空"
			},
			handleaddress:{
				required: "地点不能为空",
				maxlength:"地点长度不能超过150"
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

//证据表格添加一行
$("#voucherAdd").on("click",function(){
	insertTR();
});
/**
 * 添加一行
 */
function insertTR(){
	var lenth = $("#voucherTab").find("tr:last").find("td:first").text();
	var trcount = $("#voucherTab tr").length;
	var html = '<tr> '+
		'		<td class="unborder">'+(parseInt(lenth)+1)+'</td>  '+
		'		<td><input type="text" style="width: 60px;" class="unborder" id="name'+trcount+'" name="name'+trcount+'"></td>  '+
		'		<td><input type="text" style="width: 60px;" class="unborder" id="model'+trcount+'" name="model'+trcount+'"></td>  '+
		'		<td><input type="text" style="width: 60px;" class="unborder" id="produceplace'+trcount+'" name="produceplace'+trcount+'"></td>  '+	 	  					
		'		<td><input type="text" style="width: 60px;" class="unborder" id="evidencelevel'+trcount+'" name="evidencelevel'+trcount+'"></td>  '+	 	  					
		'		<td><input type="text" style="width: 60px;" class="unborder" id="unit'+trcount+'" name="unit'+trcount+'"></td>  '+	 	  					
		'		<td><input type="text" style="width: 60px;" class="unborder" id="price'+trcount+'" name="price'+trcount+'"></td>  '+	 	  					
		'		<td><input type="text" style="width: 60px;" class="unborder" id="num'+trcount+'" name="num'+trcount+'"></td>  '+	 	  					
		'		<td><input type="text" style="width: 60px;" class="unborder" id="notes'+trcount+'" name="notes'+trcount+'"></td>  '+	 	  					
		'		<td><button type="button" style="width: 60px;" class="unborder" onclick="insertTR()">新增</button>  '+
		'		    <button type="button" style="width: 60px;" class="unborder" onclick="delTR(this)">删除</button></td>  '+
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
			 '	<td class="unborder">1</td>'+
			 '	<td><input type="text" style="width: 60px;" class="unborder" id="name1" name="name1"></td>'+
			 '	<td><input type="text" style="width: 60px;" class="unborder" id="model1" name="model1"></td>'+
			 '	<td><input type="text" style="width: 60px;" class="unborder" id="produceplace1" name="produceplace1"></td>'+	  					
			 '	<td><input type="text" style="width: 60px;" class="unborder" id="evidencelevel1" name="evidencelevel1"></td>'+ 					
			 '	<td><input type="text" style="width: 60px;" class="unborder" id="unit1" name="unit1"></td>'+	  					
			 '	<td><input type="text" style="width: 60px;" class="unborder" id="price1" name="price1"></td>'+  					
			 '	<td><input type="text" style="width: 60px;" class="unborder" id="num1" name="num1"></td>'+					
			 '	<td><input type="text" style="width: 60px;" class="unborder" id="notes1" name="notes1"></td>'+	  					
			 '	<td>'+
			 '		<button type="button" style="width: 60px;" class="unborder" onclick="insertTR()">新增</button>'+
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
	if($("#adviceid").val() == ""){
		$("#docyear").val(new Date().getFullYear());
	}
	
	$("#handleTimeDiv").html(
			"<input class='underline' type='text' placeholder='   年   月  日' id='handletime' name='handletime' onfocus='WdatePicker({dateFmt:\"yyyy-MM-dd\"})' class='underline' style='width:200px'/>");
	$("#createTimeDiv").html(
			"<input class='underline' placeholder='   年   月  日' type='text' id='createtime' name='createtime' onfocus='WdatePicker({dateFmt:\"yyyy-MM-dd\"})' class='underline' style='width:200px'/>");
	var handletime_hidden = $("#handletime_hidden").val();
	if(handletime_hidden)
		$("#handletime").val(formatCSTDate(handletime_hidden,"yyyy-MM-dd"));
	var createtime_hidden = $("#createtime_hidden").val();
	if(createtime_hidden)
		$("#createtime").val(formatCSTDate(createtime_hidden,"yyyy-MM-dd"));
}

/**
 * 先行登记保存证据物品验证
 */
function validate(){
    var trcount = $("#trcount").val();
    for(var i=1;i<=trcount;i++){
        var name = $("#name"+i).val();//128
        var model = $("#model"+i).val();//64
        var produceplace = $("#produceplace"+i).val();//128
        var evidenceleve = $("#evidencelevel"+i).val();//128
        var price = $("#price"+i).val();//32
        var unit = $("#unit"+i).val();//32
        var num = $("#num"+i).val();//10
        var notes = $("#notes"+i).val();//400
        
        if(name!="" && name.length>42){
            parent.toast("名称字数大于42");
            return false;
        }
        
        if(model!="" && model.length>21){
            parent.toast("规格型号字数大于21");
            return false;
        }
        //产地
        if(produceplace!="" && produceplace.length>42){
            parent.toast("产地字数大于42");
            return false;
        }
        //成色(品级)
        if(evidenceleve!="" && evidenceleve.length>42){
            parent.toast("成色(品级)字数大于42");
            return false;
        }
        //单位
        if(unit!="" && unit.length>21){
            parent.toast("单位字数大于21");
            return false;
        }
        //价格
        if(price!="" && isNaN(price)){
            parent.toast("价格不是数字");
            return false;
        }else if(price!="" && price.length>32){
            parent.toast("价格字数大于32");
            return false;
        }
        //数量
        if(num!="" && isNaN(num)){
            parent.toast("数量不是数字");
            return false;
        }else if(num!="" && num.length>=10){
            parent.toast("数量长度不能超过10");
            return false;
        }
        //备注
        if(notes!="" && notes.length>133){
            parent.toast("备注字数大于133");
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
	$("#lawevidenceadviceform").submit();
	}
});
function updateDocState(){
$.ajax({
    type: 'post',
    url: BASE_URL + '/law/lawdocstate/updateDocState',
    cache: false,
    dataType: 'json',
    data: {
        "docid": $("#adviceid").val(),
        "checkinfoid": $("#checkinfoid").val(),
        "doctype": "law_evidence_advice"
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

/** 保存 */
function save(){
    if(!validate()){
        return;
    }
	$.ajax({
		type : 'post',
		url : BASE_URL+'/law/lawevidenceadvice/save',
		cache : false,
		dataType : 'json',
		data : $("#lawevidenceadviceform").serializeArray(),
		global : false,
		success : function(json) {
			if(json.success==true){
				isSaved=true;
				if(isDocSubmit==true){
					if(json.docid!=""&&typeof(json.docid)!="undefined"){
						$("#adviceid").val(json.docid);
					}
					updateDocState();
					isDocSubmit=false;
				}else{
				parent.toast(json.msg);// 弹出提示信息
//				parent.getActiveIFrame().reloadGrid();// 刷新列表
				parent.closeWin();// 关闭弹出框
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