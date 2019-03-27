/*新增或编辑体检信息*/
$(function () {		
	var healthinfoid = getQueryString("healthinfoid");
	var flag = getQueryString("flag");
	$("#healthInfoForm").validate({
		rules: {
			workerid: {
				required: true,
			},
			checktime: {
				required: true,
			},
			healthdept: {
				required: true,
			}
		},
		messages: {
			workerid: {
				required: "员工姓名不能为空",
			},
			checktime: {
				required: "体检时间不能为空",
			},
			healthdept: {
				required: "体检医院不能为空"
			}
		},
		submitHandler:function(form){
		   	save();
	    }   
	});
	//查询
	$.ajax({
		type : "post",
		url : BASE_URL + "/health/ochhealthinfo/load/"+healthinfoid,
		dataType : "json",
		data :{},
		success : function(data) {
			if (data) {
				var healthInfoTpt = _.template($("#healthInfoTpt").html());
				$("#healthInfoForm").html(healthInfoTpt(data));				
							
				SelectTwo.initSelect2($('#belongentselect2'),BASE_URL + "/health/ochworker/loadWorkerSimpleInfo",'请选择员工',formatRepo,formatRepoSelection);

                var ochHealthInfoAttachs = data.ochHealthInfoAttachs;//资料附件
                var downloadurl = BASE_URL + 'health/ochhealthinfo/download/';
                if (flag == "true") {
                	showMultipleInputFile("fileDiv", "healthinfoFile", "file", ochHealthInfoAttachs, downloadurl, true);
				}else{
					showChooseFiles('fileDiv', ochHealthInfoAttachs, downloadurl, false);
				}
			}
		},
		error : function() {
			parent.toast("初始化信息加载失败");
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
		url : BASE_URL + 'health/ochhealthinfo/save',
		files : arrId,
		cache : false,
		dataType : 'json',
		data : $("#healthInfoForm").serializeArray(),
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
			parent.toast("保存失败");
		}
	});
}

function getQueryString(name)
{
     var reg = new RegExp("(^|&)"+ name +"=([^&]*)(&|$)");
     var r = window.location.search.substr(1).match(reg);
     if(r!=null)return  unescape(r[2]); return null;
}

function formatRepo(repo){
	if (repo.loading) {
	    return repo.text;
	}
	var markup = "<div class='select2-result-repository clearfix'>" + repo.text + "</div>";
    
    return markup;
}

function formatRepoSelection(repo){
	$("#workerid").val(repo.id);
	 return repo.text;
}