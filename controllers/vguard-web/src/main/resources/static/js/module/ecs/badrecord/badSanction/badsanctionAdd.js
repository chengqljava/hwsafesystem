/*新增或编辑行政执法*/
$(function () {		
	
	var sanctionid = getQueryString("sanctionid");
	$("#badSanctionForm").validate({
		rules: {
			businessinfoid: {
				required: true,
			},
			orgid: {
				required: true,
			},
			sanctiontime: {
				required: true,
			},
			sanctiontype: {
				required: true,
			},
			sanctionreason: {
				required: true,
				maxlength: 250
			},
			reduce: {
				maxlength: 250
			},
			remark: {
				maxlength: 250
			}
		},
		messages: {
			businessinfoid: {
				required: "企业名称不能为空",
			},
			orgid: {
				required: "执法部门不能为空",
			},
			sanctiontime: {
				required: "日期不能为空",
			},
			sanctiontype: {
				required: "处罚种类不能为空",
			},
			sanctionreason: {
				required: "处罚原因不能为空",
				maxlength: "最多输入250字"
			},
			reduce: {
				maxlength: "最多输入250字"
			},
			remark: {
				maxlength: "最多输入250字"
			}
		},
		submitHandler:function(form){
			save();
		}   
	});

	/*保存(新增或编辑)*/
	$.ajax({
		type : "post",
		url : BASE_URL + "ecs/ecsbadsanction/load",
		dataType : "json",
		data :{
			sanctionid:sanctionid
		},
		success : function(data) {
			if (data) {
				var badSanctionTpt = _.template($("#badSanctionTpt").html());
				$("#badSanctionForm").html(badSanctionTpt(data));
				if(sanctionid != "-1"){					
					$("#businessinfoid").attr("disabled",true);
				}
				//加载企业
				SelectTwo.initSelect2($('#businessinfoid'),BASE_URL + "enterprise/entbusinessinfo/searchEntSimpleInfo",'请选择企业');
				//选择执法部门
				SelectTree.loadOrgSelect("orgname");
				//选择处罚类型
				SelectOption.loadPunishtype("sanctiontype");
			}
		},
		error : function() {
			parent.toast("保存失败");
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
		url : BASE_URL + "ecs/ecsbadsanction/save",
		data : $("#badSanctionForm").serializeArray(),
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

