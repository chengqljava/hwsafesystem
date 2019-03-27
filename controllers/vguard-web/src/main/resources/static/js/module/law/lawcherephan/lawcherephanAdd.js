$(document).ready(function() {	
	// 加载举报类型
	SelectOption.loadBaseCode(reportTypeArr, 'reporttype');
	
	$("#lawcherephanform").validate({
		rules: {
			rephandler : {required : true, maxlength : 16},
			phone : { required : true, isTelephone : true },
			handledate : {required : true},
			notes : {required : true, maxlength : 250}
		},
		messages: {
			rephandler : {required : "经办人不能为空", maxlength : "长度不能超过16"},
			phone : { required : '联系电话不能为空', isTelephone : '格式不正确' },
			handledate : {required : "处理日期不能为空"},
			notes : {required : "处理内容不能为空", maxlength : "长度不能超过250"}
		},
		submitHandler:function(form){
			saveForm();
	    }   
	});
	
});




var saveForm = function(callbackFunc) {
	
	var lawCheRepHanJson = {};
	
	$.each( $( '#lawcherephanform' ).serializeArray(), function(){
    	lawCheRepHanJson[this.name] = this.value; 
    });
	
	$.post( BASE_URL + '/law/lawcheckreport/submitLawCheRepHan',
		{
			lawCheRepHanJsonStr : JSON.stringify(lawCheRepHanJson)
		},
		function( data ){
			parent.toast('保存成功');//弹出提示信息
			parent.parent.getActiveIFrame().reloadGrid();//刷新列表
			parent.closeWin();// 关闭弹出框
		}
	);
	
}

