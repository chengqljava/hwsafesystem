/**
 * 新增企业人员通讯录
 */
$(function () {
	var contactsid = getQueryString("contactsid");
	var idArr = getidArr();
	var param = {"ids":idArr.toString(),"usertype":"ENT"};
	//加载权限树
	loadFuncTree("privtree",param);
	
    $.ajax({
        type: "post",
        url: BASE_URL + "enterprise/entcontacts/load",
        data: {
        	contactsid:contactsid
        },
        success: function (data) {
            if (data) {
                var createAccountTpt = _.template($("#createAccountTpt").html());
                $("#createAccountForm").html(createAccountTpt(data));
                
                //初始化下拉框
                SelectOption.loadSex("sex");//性别
                $.each(data.roleList, function(key, value) { 
                	console.log(value);
                	$("#roleCheckBox").append('<label><input type="checkbox" name="id" onclick="selectRole()" value="'+value.roleid+'" />'+value.rolename+'</label>&nbsp;&nbsp;');
            	}); 
                
                $("#createAccountForm").validate({
                    rules: {
                        username: {
                            required: true
                        },
                        nickname: {
                            required: true
                        },
                        password: {
                            required: true
                        },
                        phone: {
                            required: true
                        }
                    },
                    messages: {
                        username: {
                            required: "用户名不能为空"
                        },
                        nickname: {
                            required: "昵称不能为空"
                        },
                        password: {
                            required: "密码不能为空"
                        },
                        phone: {
                            required: "手机号不能为空"
                        }

                    },
                    submitHandler: function (form) {
                        save();
                    }
                });


            }
        },
        error: function () {
            parent.toast("初始化信息加载失败!");
        }
    });
    
    //加载区域
    loadPlacea();
});

//获取角色数组
function getidArr(){
	var idArr= [];
	$("input[name='id']:checked").each(function(){
		var id = $(this).val();
		idArr.push(id);
	});
	return idArr;
}

/**加载权限树*/
function loadFuncTree(divid,param){
	var setting = {
		data : {
			simpleData : {
				enable : true
			}
		},
		check:{
			enable:true//复选框
		}
	};	
	
	//加载权限树
	$.ajax({
		type :'get',
		url : BASE_URL+'/system/sysrole/privtree',
		cache : false,
		dataType : 'json',
		data: param,
		global : false,
		success : function(map) {
			var tree_map = initTreeMap(map);
			$.fn.zTree.init($("#"+divid), setting, tree_map);
		
		},
		error : function() {
			alert("网络异常");
		}
	});
	/*
	 * {id=1, pId=-1, name=监测监控, checked=false}
	 */
	//树图标的初始化
	function initTreeMap(map) {
		var t_map = new Array();
		//遍历子节点
		if (map != null && map.length > 0) {
			var open = false;
			
			
			for (var i = 0; i < map.length; i++) {
				var icon = "";
				var checked = false;
				
				if (map[i].pId == -1) {//父菜单
					icon= BASE_URL+"/images/tree/d_icon_tree2.png";
					id= map[i].id;
					open = false;
				}else{//子菜单
					open = false;
					icon= BASE_URL+"/images/tree/d_icon_tree3.png";
				}	
				
				if(map[i].checked != "false"){
					  checked = true;
				}
				
				t_map.push(new Node(map[i].id,map[i].pId, map[i].name,open,icon,checked,true ));
			}
			
		} else {
			t_map = null;
		}
		
		return t_map;
	}
	
	//树节点对象
	function Node(id, pId, name, open, icon ,checked,chkDisabled) {
		this.id = id;
		this.pId = pId;
		this.name = name;
		this.open = open;
		this.icon = icon;
		this.checked = checked;
		this.chkDisabled = chkDisabled;
	}
}

//勾选角色
function selectRole(){
	//被选中的角色数组
	var idArr = getidArr();
	var param = {"ids":idArr.toString(),"usertype":"ENT"};
	loadFuncTree("privtree",param);
}

function getQueryString(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
    var r = window.location.search.substr(1).match(reg);
    if (r != null)return unescape(r[2]);
    return null;
}

function save() {
	var idArr = getidArr();
	if(idArr.length == 0){
		parent.toast("请选择角色");//弹出提示信息
		return;
	}
	//被选中的角色数组
	var formdata = $("#createAccountForm").serializeArray();
	console.log("formdata"+formdata);
//	var checkData = {name: 'id', value: JSON.stringify(idArr).replace(/\"/g, "'")};//替换双引号为单引号
//	formdata.push(checkData);
    $.ajax({
        type: "post",
        url: BASE_URL + "enterprise/entcontacts/createAccount",
        data: formdata,
        success: function (data) {
            if (data.success == true) {
                parent.toast(data.msg);//弹出提示信息
                parent.getActiveIFrame().reloadGrid();//重新加载
                parent.closeWin();// 关闭弹出框
            } else {
                parent.toast(data.msg);
            }
        },
        error: function () {
            parent.toast("新增失败");
        }
    });

}

function loadPlacea(){
	 $.ajax({
	        type: "GET",
	        url: BASE_URL + "/dangersource/dssrskplacearea/list/businssinfoid",
	        data: {},
	        cache : false,
			dataType : 'json',
	        success: function (data) {
	        	console.log("1"+data);
	        	console.log("2"+$("#placeCheckBox").val());
	        	 for(var i=0;i<data.length;i++){
	                	$("#placeCheckBox").append('<label><input type="checkbox" name="placeAreas" value="'+data[i].placeareaid+'" />'+data[i].placeareaname+'</label>&nbsp;&nbsp;');

	        		 console.log(data[i]);
	        	 }
	    
	            if (data.success == true) {
	            	console.log(data);
	            } else {
	                
	            }
	        },
	        error: function () {
	            parent.toast("新增失败");
	        }
	    });
}

