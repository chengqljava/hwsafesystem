/*新增或编辑课程管理*/
$(function () {
	var contactsid = getQueryString("contactsid");
	//查询
	$.ajax({
		type : "post",
		url : BASE_URL + "enterprise/entcontacts/load",
		dataType : "json",
		data :{
			contactsid:contactsid
		},
		success : function(data) {
			if (data) {
				var contactsTpt = _.template($("#contactsTpt").html());
				$("#contactsForm").html(contactsTpt(data));
//				SelectTree.loadComfirmTypeTree("typecodeid");// 通讯保障节点树
//				SelectOption.loadSex("sex");// 性别下拉框
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