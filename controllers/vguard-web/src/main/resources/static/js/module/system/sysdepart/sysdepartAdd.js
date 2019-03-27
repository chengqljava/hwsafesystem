$(document).ready(function() {
	//初始化部门下拉树
	SelectTree.loadDepartSelect("parentname");
	//初始化机构下拉树
	//SelectTree.loadOrgByOrgidSelect("organname",{ismember:'0'});
	SelectTree.loadIsMemberSelect("organname", {ismember:'0'});
	
	$("#departform").validate({
		rules: {
			departname: {
				required: true
			},
			departcode: {
				required: true
			},
            principal: {
            	required: true
            },
            principalotel: {
            	required: true,
            	isTelephone: true
            },
            principalmtel: {
            	required: true,
            	isPhone: true
            },
            organname: {
            	required: true
            }
		},
		messages: {
			departname: {
				required: "部门名称不能为空"
			},
			departcode: {
				required: "部门编码不能为空"
			},
			principal: {
            	required: "主要负责人不能为空"
            },
            principalotel: {
				required: "办公电话不能为空"
			},
			principalmtel: {
				required: "移动电话不能为空"
            },
            organname: {
            	required: "所属机构不能为空"
            }
		},
		submitHandler:function(form){
		   	save();
	    }   
	});
	
});

/*保存(新增或编辑)*/
function save(){
	$.ajax({
		type : 'post',
		url : BASE_URL+'/system/sysdepart/save',
		cache : false,
		dataType : 'json',
		data : $("#departform").serializeArray(),
		global : false,
		success : function(json) {
			if(json.success==true){
				parent.toast(json.msg);//弹出提示信息
				parent.getActiveIFrame().reloadGrid();//重新加载
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

