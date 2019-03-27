$(document).ready(function() {
	//初始化下拉框
	SelectOption.loadReserveWay("reserveway");//储存方式
	SelectOption.loadReserveSite("reservesite");//储存场所
	//初始化危化品目录下拉树
	//SelectTree.loadChecatalogSelect("chemcatalname");
	
	// 最大存储量不能小于当前存储量
	jQuery.validator.addMethod("reserves", function(value, element) {  
		if($("#prereserves").val()!="" && $("#largereserves").val()!=""){
			var prereserves = $("#prereserves").val()
			var largereserves = $("#largereserves").val();
			if(parseInt(largereserves)<parseInt(prereserves)){
				return false;
			}else{
				return true;
			}
		}else{
			return true;
		}
	}, "最大存储量不能小于当前存储量");
	
	$("#entdanchemicalform").validate({
		rules: {
			chemcatalname: {
				required: true,
            	rangelength:[1,100]
            },
            chemicaltype: {
            	required: true
            },
            chemicalsource: {
            	required: true,
            	rangelength:[1,50]
            },
            purpose: {
            	required: true,
            	rangelength:[1,50]
            },
            largereserves: {
            	required: true,
            	number: true,
            	reserves: true
            },
            prereserves: {
            	required: true,
            	number: true,
            	reserves: true
            },
            reservesite: {
            	required: true
            },
            reserveway: {
            	required: true
            }
		},
		messages: {
			chemcatalname: {
				required : "危险化学品不能为空",
            	rangelength: "请输入1-100个字符"
            },
            chemicaltype: {
            	required: "危险化学品类型不能为空",
            },
            chemicalsource: {
				required : "危险化学品来源不能为空",
            	rangelength: "请输入1-50个字符"
            },
            purpose: {
				required : "用途不能为空",
            	rangelength: "请输入1-50个字符"
            },
            largereserves: {
            	required: "最大储量不能为空",
            	number: "请输入数字",
            	reserves: "最大存储量不能小于当前存储量"
            },
            prereserves: {
            	required: "当前储量不能为空",
            	number: "请输入数字",
            	reserves: "当前存储量不能大于最大存储量"
            },
            reservesite: {
            	required: "储存场所不能为空"
            },
            reserveway: {
            	required: "储存方式不能为空"
            }
		},
		errorPlacement: function (error, element) { //指定错误信息位置
	       if (element.is(':radio') || element.is(':checkbox')) { //如果是radio或checkbox
	         var eid = element.attr('name'); //获取元素的name属性
	         error.appendTo($('.'+eid+'Div')); //将错误信息添加当前元素的父结点后面
	       }else {
	         error.insertAfter(element);
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
		url : BASE_URL+'/enterprise/entdanchemical/save',
		cache : false,
		dataType : 'json',
		data : $("#entdanchemicalform").serializeArray(),
		global : false,
		success : function(json) {
			if(json.success==true){
				parent.toast(json.msg);//弹出提示信息
				var index = parent.getParentIndex();
				parent.frames["layui-layer-iframe"+index].frames["contentIframe"].frames["chemIframe"].reloadGrid();//刷新列表
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

function showchemical(){
	//parent.parent.parent.openWin(BASE_URL + '/enterprise/entdanchemical/knochemical', '危化品目录',"65%","75%");
	//危化品基础信息id
	var danexclusiveid = $("#danexclusiveid").val();
	//危化品详细信息id
	var chemicalid = $("#chemicalid").val();
	//危化品目录id
	var chemcatalid = $("#chemcatalid").val();
	window.location = BASE_URL + "/enterprise/entdanchemical/knochemical?danexclusiveid="+danexclusiveid+"&chemicalid="+chemicalid+"&chemcatalid="+chemcatalid;
	
}


