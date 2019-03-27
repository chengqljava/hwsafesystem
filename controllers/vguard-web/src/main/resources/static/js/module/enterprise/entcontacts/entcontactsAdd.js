/*新增或编辑课程管理*/
$(function () {
	var contactsid = getQueryString("contactsid");
	$("#contactsForm").validate({
			rules: {
				contactsname: {
					required: true
				},
				mobile: {
					required: true,
					isPhone:true
				},
				telphone:{
					isTelephone: true
				},
				position: {
					required: true
				},
				entorgid:{
					required: true
				}
			},
			messages: {
				contactsname: {
					required: "姓名不能为空"
				},
				mobile: {
					required: "电话不能为空",
					isPhone: "请输入正确手机格式"
				},
				telphone:{
					isTelephone: "请输入正确的电话号码"
				},
				position: {
					required: "职位不能为空"
				},
				entorgid:{
					required: "所属部门不能为空"
				}
			},
			submitHandler:function(form){
			   	save();
		    }
		});
	
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
				SelectOption.loadSex("sex");// 性别下拉框
				SelectTree.loadEntOrgTree("entorgid");
				SelectOption.loadContactsType("contactstype");// 人员类别下拉框
			}
		},
		error : function() {
			parent.toast("初始化信息加载失败");
		}
	});
});

/*保存(新增或编辑)*/
function save(){
	$.ajax({
		type : "post",
		url : BASE_URL + "enterprise/entcontacts/save",
		data : $("#contactsForm").serializeArray(),
		success : function(data) {
			if(data.success==true){
				parent.toast(data.msg);//弹出提示信息
				parent.getActiveIFrame().reloadGrid();//重新加载
				parent.closeWin();// 关闭弹出框
			}else{
				parent.toast(data.msg);
			}
		},
		error : function() {
			parent.toast("编辑失败");
		}
	});
}

function getQueryString(name)
{
     var reg = new RegExp("(^|&)"+ name +"=([^&]*)(&|$)");
     var r = window.location.search.substr(1).match(reg);
     if(r!=null)return  unescape(r[2]); return null;
}