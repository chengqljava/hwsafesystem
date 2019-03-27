/**
 * 黑名单编辑
 */
$(function () {
	var recordid = GetQueryString("recordid");
	$("#blackRecordForm").validate({
		rules: {
			businessinfoid: {
				required: true
			},
			adddate: {
				required: true
			},
			manage:{
				digits: true,
				required: true
			}
		},
		messages: {
			businessinfoid: {
				required: "企业不能为空"
			},
			adddate: {
				required: "加入时间不能为空"
			},
			manage:{
				digits: "请输入整数",
				required: "管理期不能为空" 
			}
			
		},
		submitHandler:function(form){
		   	save();
	    }   
	});
	
	
	$.ajax({
		type : "post",
		url : BASE_URL + "ecs/ecsblarecord/edit/"+recordid,
		dataType: "json",
		data:{
			recordid:recordid
		},
		success : function(data) {
			if (data) {
				var blackRecordTpt = _.template($("#blackRecordTpt").html());
				data.baseUrl = BASE_URL;
				$("#blackRecordForm").html(blackRecordTpt(data));
				if(recordid != "-1"){					
					$("#businessinfoid").attr("disabled",true);
				}
				//选择企业
				SelectTwo.initSelect2($('#businessinfoid'),BASE_URL + "enterprise/entbusinessinfo/searchEntSimpleInfo",'请选择企业');
				showUploadFile("fileUploadDiv", 'file', true, true);// 显示文件上传控件
				
			}
		},
		error : function() {
			parent.toast("初始化信息加载失败!");
		}
	});
	
});
function GetQueryString(name)
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
	var uplist = $("input[name^=file]");
	var arrId = [];
	for (var i = 0; i < uplist.length; i++) {
		if (uplist[i].value) {
			arrId[i] = uplist[i].id;
		}
	}

	$.ajaxFileUpload({
		type : 'post',
		url : BASE_URL + "ecs/ecsblarecord/save",
		secureuri : false,
		files : arrId,
		cache : false,
		dataType : 'json',
		data : $("#blackRecordForm").serializeArray(),
		global : false,
		success : function(json) {
			if (json.success == true) {
				parent.toast(json.msg);// 弹出提示信息
				parent.getActiveIFrame().reloadGrid();//重新加载
				parent.closeWin();// 关闭弹出框
			} else {
				parent.toast(json.msg);
			}
		},
		error : function() {
			parent.toast("编辑失败");
		}
	});
	
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
