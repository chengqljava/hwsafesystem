/*新增或编辑场所环境*/
$(function () {		
	
	var placeid = getQueryString("placeid");
	$("#dssRskPlaceForm").validate({
		rules: {
            typeid: {
                required: true,
            },
			powersrc: {
				required: true,
                maxlength:500
			},
			saferisk: {
				required: true,
                maxlength:500
			},
			danfactor: {
				required: true,
                maxlength:500
			},
			ctrlmeasure: {
                maxlength:500
			}
		},
		messages: {
            typeid: {
                required: "所属模块不能为空"
            },
			powersrc: {
				required: "能量源不能为空",
                maxlength:"最多输入500个字"
			},
			saferisk: {
				required: "安全风险不能为空",
                maxlength:"最多输入500个字"
			},
			danfactor: {
				required: "危险因素不能为空",
                maxlength:"最多输入500个字"
			},
			ctrlmeasure: {
                maxlength:"最多输入500个字"
			}
		},
		submitHandler:function(form){
			save();
		}   
	});

	/*保存(新增或编辑)*/
	$.ajax({
		type : "post",
		url : BASE_URL + "dangersource/dssrskplace/load",
		dataType : "json",
		data :{
			placeid:placeid
		},
		success : function(data) {
			if (data) {
				var placeActTpt = _.template($("#dssRskPlaceTpt").html());
				$("#dssRskPlaceForm").html(placeActTpt(data));
				
				SelectTree.loadRiskTypeTree("typename",{
					userType:0,
					typecode:5
				},"");							
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

/**
 * 保存
 * @returns
 */
function save(){
	$.ajax({
		type : "post",
		url : BASE_URL + "dangersource/dssrskplace/save",
		data : $("#dssRskPlaceForm").serializeArray(),
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

