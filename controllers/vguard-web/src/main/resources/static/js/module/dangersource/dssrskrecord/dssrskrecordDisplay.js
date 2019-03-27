/*新增或编辑场所环境*/
$(function () {

	var rskrecordid = getQueryString("rskrecordid");


	/*保存(新增或编辑)*/
	$.ajax({
		type : "post",
		url : BASE_URL + "dangersource/dssrskrecord/load",
		dataType : "json",
		data :{
            rskrecordid:rskrecordid
		},
		success : function(data) {
			if (data) {
				var dssRskRecordTpt = _.template($("#dssRskRecordTpt").html());
				$("#dssRskRecordForm").html(dssRskRecordTpt(data));

			}
		},
		error : function() {
			parent.toast("初始化信息加载失败");
		}
	});
});


function getQueryString(name)
{
     var reg = new RegExp("(^|&)"+ name +"=([^&]*)(&|$)");
     var r = window.location.search.substr(1).match(reg);
     if(r!=null)return  unescape(r[2]); return null;
}

