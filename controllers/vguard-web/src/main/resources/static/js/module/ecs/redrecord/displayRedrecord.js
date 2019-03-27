$(document).ready(function() {
	//查询
	$.ajax({
		type : "post",
		url : BASE_URL + "ecs/ecsredrecord/display/" + GetQueryString("recordid"),
		data : {},
		success : function(data) {
			if (data) {
				var ecsRedrecordTpt = _.template($("#ecsRedrecordTpt").html());
				data.baseUrl = BASE_URL;
				$("#ecsRedrecordForm").html(ecsRedrecordTpt(data));
				showUploadFile("fileUploadDiv", 'file', false, false);// 显示文件上传控件
				//加载企业
				SelectTwo.initSelect2($('#belongentselect2'),BASE_URL + "enterprise/entbusinessinfo/searchEntSimpleInfo",'请选择企业',formatRepo,formatRepoSelection);
			}
		}
	});
});

function GetQueryString(name)
{
     var reg = new RegExp("(^|&)"+ name +"=([^&]*)(&|$)");
     var r = window.location.search.substr(1).match(reg);
     if(r!=null)return  unescape(r[2]); return null;
}
/**
 * 选择企业
 * @param $ajax
 * @param url 完整的地址
 */
function formatRepo(repo){
	if (repo.loading) {
	    return repo.text;
	}
	var markup = "<div class='select2-result-repository clearfix'>" + repo.text + "</div>";
    
    return markup;
}

function formatRepoSelection(repo){
	$("#businessinfoid").val(repo.id);
	$("#belongentselect2").val(repo.id);
	 return repo.text;
}
