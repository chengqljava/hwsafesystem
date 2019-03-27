$(function() {
	var saveType = getQueryString("saveType"),
		exposureid = getQueryString("exposureid");
	
	//编辑市级以上曝光记录时
	$.ajax({
		type : "post",
		url : BASE_URL + "ecs/ecsbadexposure/edit/" + ("0" == saveType ? "0" : exposureid),//新增风险类型时
		data : {},
		success : function(data) {
			if (data) {
				var editRiskTypeTpt = _.template($("#editRiskTypeTpt").html());
				$("#editBadexpoForm").html(editRiskTypeTpt(data));
				if(exposureid != null){	
					$("#entselect2").attr("disabled",true);
				}
				//企业选择
				//初始化企业select2
				SelectTwo.initSelect2($("#entselect2"), 
						BASE_URL + "enterprise/entbusinessinfo/searchEntSimpleInfo", "请选择企业", 
						formatRepo, formatRepoSelection);
				
				function formatRepo(repo){
					if (repo.loading) {
						return repo.text;
					}
					var markup = "<div class='select2-result-repository clearfix'>" + repo.text + "</div>";
					return markup;
				}
				function formatRepoSelection(repo){
					$("#businessinfoid").val(repo.id || "");
					$("#isbusinessinfoid").val(repo.id || "");
					return repo.text;
				}
				
				
//				SelectOption.loadRiskBelongcate("belongcate");
				
				$("#editBadexpoForm").validate({
					rules: {
						isbusinessinfoid: {
							required: true
						},
						exposuretime: {
							required: true
						},
						exposuremedia: {
							maxlength: 30
						},
						exposurecontent: {
							maxlength: 166
						},
						reduce: {
							maxlength: 166
						},
						remark: {
							maxlength: 166
						}
					},
					messages: {
						isbusinessinfoid: {
							required: "企业名称不能为空"
						},
						exposuretime: {
							required: "曝光日期不能为空"
						},
						exposuremedia: {
							maxlength: "曝光媒体字数不能超过30"
						},
						exposurecontent: {
							maxlength: "曝光内容字数不能超过166"
						},
						reduce: {
							maxlength: "影响扣分字数不能超过166"
						},
						remark: {
							maxlength: "备注字数不能超过166"
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
		url : BASE_URL + "ecs/ecsbadexposure/save",
		cache : false,
		dataType : "json",
		data : $("#editBadexpoForm").serializeArray(),
		global : false,
		success : function(json) {
			parent.toast(json.msg);//弹出提示信息
			//刷新风险分类树
			parent.getActiveIFrame().reloadGrid();
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