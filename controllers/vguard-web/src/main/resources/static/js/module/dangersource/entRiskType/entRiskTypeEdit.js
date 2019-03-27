$(function() {
	var saveType = decodeURI(getQueryString("saveType")),
		curSelId = decodeURI(getQueryString("curSelId")),
		typelvl = decodeURI(getQueryString("typeLvl")),
		typeCode = decodeURI(getQueryString("typeCode")),
		parentname = decodeURI(getQueryString("parentname"));
	
	//编辑风险类型时
	$.ajax({
		type : "post",
		url : BASE_URL + "dangersource/dssrsktype/edit/" + ("0" == saveType ? "0" : curSelId),//新增风险类型时
		data : {},
		success : function(data) {
			if (data) {
				if ("" == data.dssRskType.typeid) {
					data.dssRskType = {
							"typeid": "",
							"parentid": curSelId,
							"parentname": parentname,
							"typename": "",
							"typelvl": (parseInt(typelvl) + 1),
							"typecode": typeCode,
							"ordernum": "",
							"notes": "",
							"belongcate": "",
							"belongent": "",
							"creater": "",
							"ceatetime": ""	
					};
				} else {
					data.dssRskType.parentname = parentname;
				}
				
				var editRiskTypeTpt = _.template($("#editRiskTypeTpt").html());
				$("#editRiskTypeForm").html(editRiskTypeTpt(data));
				
				//风险所属分类
				SelectOption.loadRiskBelongcate("belongcate");
				
				$("#editRiskTypeForm").validate({
					rules: {
						typename: {
							required: true,
							maxlength: 60
						},
						belongcate: {
			            	required: true
			            },
			            ordernum: {
			            	required: true,
			            	number: true,
			            	max: 5000
			            },
			            notes: {
			            	maxlength: 80
			            }
					},
					messages: {
						typename: {
							required: "分类名称不能为空",
							maxlength: "最大长度不能超过60个字符"
						},
						belongcate: {
			            	required: "所属分类不能为空"
			            },
			            ordernum: {
							required: "顺序不能为空",
							number: "顺序字段需为整数",
							max: "最大不能超过5000"
						},
						notes: {
			            	maxlength: "最大长度不能超过80个字符"
			            }
					},
					submitHandler:function(form){
					   	save();
				    }   
				});
			}
		}
	});
	
});

/*保存(新增或编辑)*/
function save(){
	$.ajax({
		type : "post",
		url : BASE_URL + "dangersource/dssrsktype/save",
		cache : false,
		dataType : "json",
		data : $("#editRiskTypeForm").serializeArray(),
		global : false,
		success : function(json) {
			parent.toast(json.msg);//弹出提示信息
			//刷新风险分类树
			parent.getActiveIFrame().loadRiskTypeTree();
			parent.closeWin();// 关闭弹出框
		},
		error : function() {
			parent.toast("保存失败");
		}
	});
}

function getQueryString(name) {
     var reg = new RegExp("(^|&)"+ name +"=([^&]*)(&|$)");
     var r = window.location.search.substr(1).match(reg);
     if(r!=null)return  unescape(r[2]); return null;
}