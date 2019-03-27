$(document).ready(function() {
	var recordid = GetQueryString("recordid");
	//查询
	$.ajax({
		type : "post",
		url : BASE_URL + "ecs/ecsredrecord/load/" + recordid,
		data : {},
		success : function(data) {
			if (data) {
				var ecsRedrecordTpt = _.template($("#ecsRedrecordTpt").html());
				data.baseUrl = BASE_URL;
				$("#ecsRedrecordForm").html(ecsRedrecordTpt(data));
				
				showUploadFile("fileUploadDiv", 'file', true, true);// 显示文件上传控件
				if(recordid != "null"){					
					$("#belongentselect2").attr("disabled",true);
				}
				//加载企业
				SelectTwo.initSelect2($('#belongentselect2'),BASE_URL + "enterprise/entbusinessinfo/searchEntSimpleInfo",'请选择企业',formatRepo,formatRepoSelection);
				
				$("#ecsRedrecordForm").validate({
					rules: {
						businessinfoid: {
							required: true,
						}
					},
					messages: {
						businessinfoid: {
							required: "企业名称不能为空"
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
	
	var uplist = $("input[name^=file]");
	var arrId = [];
	for (var i = 0; i < uplist.length; i++) {
		if (uplist[i].value) {
			arrId[i] = uplist[i].id;
		}
	}

	$.ajaxFileUpload({
		type : 'post',
		url : BASE_URL + 'ecs/ecsredrecord/save',
		secureuri : false,
		files : arrId,
		cache : false,
		dataType : 'json',
		data : $("#ecsRedrecordForm").serializeArray(),
		global : false,
		success : function(json) {
			if (json.success == true) {
				parent.toast(json.msg);//弹出提示信息
				parent.getActiveIFrame().reloadGrid();//重新加载
				parent.closeWin();// 关闭弹出框
			} else {
				parent.toast(json.msg);
			}
		},
		error : function() {
			parent.toast("新增失败");
		}
	});
}

function GetQueryString(name)
{
     var reg = new RegExp("(^|&)"+ name +"=([^&]*)(&|$)");
     var r = window.location.search.substr(1).match(reg);
     if(r!=null)return  unescape(r[2]); return null;
}
/**
 * 选择企业
 * @param $ajax
 * @param url 完整的地址
 */
function formatRepo(repo){
	if (repo.loading) {
	    return repo.text;
	}
	var markup = "<div class='select2-result-repository clearfix'>" + repo.text + "</div>";
    
    return markup;
}

function formatRepoSelection(repo){
	$("#businessinfoid").val(repo.id);
	$("#belongentselect2").val(repo.id);
	 return repo.text;
}
