/**
 * 新增编辑
 */
var pandect = null;
$(function() {
	var evalpandectlid = getQueryString("evalpandectlid");
	$("#epideviceForm").validate({
//		rules : {
//			optscore1: {
//				eRessureCheck: true,
//				min: 0,
//				max: 100
//			}
//		},
//		messages : {
//			optscore1: {
//				eRessureCheck: "请输入正整数，最多三位",
//				min: "请输入0-100的正整数",
//				max: "请输入0-100的正整数"
//			}
//		},
		submitHandler:function(form){
			save();
		} 
	});

	$.ajax({
		type : "post",
		url : BASE_URL + "enterprise/entstandardevaldetail/load",
		dataType : "json",
		data : {
			evalpandectlid:evalpandectlid
		},
		success : function(data) {
			if (data) {
				pandect = data.pandect;
				var epideviceTpt = _.template($("#epideviceTpt").html());
				$("#epideviceForm").html(epideviceTpt(data));	
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
 * 保存
 * 
 * @returns
 */

function save() {
	
	var $details =  $("#recordopt tr");
	var entStandardevalDetails = [];
	
	if ($details.size() > 0) {
		for (var n = 0; n < $details.size(); n++) {
			var alevelelement = $($details[n]).find("td:eq(0) span").text(),
			evaldetailid = $($details[n]).find("input[name='evaldetailid']").val(),
			scoredetail = $($details[n]).find("textarea[name='scoredetail']").val(),
			evalscore = $($details[n]).find("input[name='evalscore']").val();
			entStandardevalDetails.push({
                "evalpandectlid": pandect.evalpandectlid,
                "evaldetailid":evaldetailid,
                "entorgid": pandect.entorgid,
                "belongyear": pandect.belongyear,
                "belongquarter": pandect.belongquarter,
                "alevelelement":alevelelement,
                "scoredetail":scoredetail,
                "evalscore":evalscore
            });
		}
	}
	var formdata = [];
	var entStandardevalDetails = {name: 'entStandardevalDetails', value: JSON.stringify(entStandardevalDetails)};
	var isadd = {name:"isadd",value:$("#isadd").val()};
	formdata.push(entStandardevalDetails);
	formdata.push(isadd);
	console.log(formdata);
	$.ajax({
		type : "post",
		url : BASE_URL + "enterprise/entstandardevaldetail/save",
		cache : false,
		dataType : 'json',
		data :formdata,
		global : false,
		success : function(data) {
			console.log(data);
			if(data.success==true){
				parent.toast(data.msg);//弹出提示信息
				parent.getActiveIFrame().reloadGrid();//重新加载
				window.top.layer.close(parent.getParentIndex());
				parent.closeWin();
			}else{
				parent.toast(data.msg);
			}
		},
		error : function() {
			parent.toast("保存失败");
		}
	});

}
