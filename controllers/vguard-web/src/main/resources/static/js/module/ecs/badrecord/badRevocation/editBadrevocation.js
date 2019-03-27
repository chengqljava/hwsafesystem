$(document).ready(function() {
	var revocationid = GetQueryString("revocationid")
	//查询
	$.ajax({
		type : "post",
		url : BASE_URL + "ecs/ecsbadrevocation/load/" + revocationid,
		data : {},
		success : function(data) {
			if (data) {
				var ecsBadrevocationTpt = _.template($("#ecsBadrevocationTpt").html());
				$("#ecsBadrevocationForm").html(ecsBadrevocationTpt(data));
				if(revocationid != "null"){					
					$("#belongentselect2").attr("disabled",true);
				}
				//加载企业
				SelectTwo.initSelect2($('#belongentselect2'),BASE_URL + "enterprise/entbusinessinfo/searchEntSimpleInfo",'请选择企业',formatRepo,formatRepoSelection);
				
				$("#ecsBadrevocationForm").validate({
					rules: {
						entname: {
							required: true,
						},
						revocationtime: {
			            	required: true
			            },
			            revocationreason: {
			            	required: true
			            }/*,
			            remark: {
			            	required: true,
			            }*/
					},
					messages: {
						entname: {
							required: "企业名称不能为空"
						},
						revocationtime: {
			            	required: "吊销时间不能为空"
			            },
			            revocationreason: {
							required: "吊销原因不能为空"
						}/*,
						remark: {
			            	required: "备注"
			            }*/
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
		type : 'post',
		url : BASE_URL + 'ecs/ecsbadrevocation/save',
		cache : false,
		dataType : 'json',
		data : $("#ecsBadrevocationForm").serializeArray(),
		global : false,
		success : function(json) {
			parent.toast(json.msg);//弹出提示信息
			parent.getActiveIFrame().reloadGrid();//重新加载
			parent.closeWin();// 关闭弹出框
		},
		error : function() {
			parent.toast("保存失败");
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
	$("#entname").val(repo.id);
	 return repo.text;
}

