/**
 * 详情
 */
$(function () {
	var sanctionid = getQueryString("sanctionid");	
	$.ajax({
		type : "post",
		url : BASE_URL + "ecs/ecsbadsanction/display/"+sanctionid,
		dataType: "json",
		data:{
			
		},
		success : function(data) {
			if (data) {
				var badSanctionTpt = _.template($("#badSanctionTpt").html());
				$("#badSanctionForm").html(badSanctionTpt(data));			
				//选择执法部门
				SelectTree.loadOrgSelect("orgname");
				//选择处罚类型
				SelectOption.loadPunishtype("sanctiontype");
				
			}
		},
		error : function() {
			parent.toast("初始化信息加载失败!");
		}
	});
	
});
function getQueryString(name)
{
     var reg = new RegExp("(^|&)"+ name +"=([^&]*)(&|$)");
     var r = window.location.search.substr(1).match(reg);
     if(r!=null)return  unescape(r[2]); return null;
}
