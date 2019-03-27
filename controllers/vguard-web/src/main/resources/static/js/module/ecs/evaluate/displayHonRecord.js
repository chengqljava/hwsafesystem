$(document).ready(function() {
	
	// 查询
	$.ajax({
		type : "post",
		url : BASE_URL + "ecs/ecshonrecord/display/" + GetQueryString("recordid"),
		data : {},
		success : function(data) {
			if (data) {
				var ecsHonRecordTpt = _.template($("#ecsHonRecordTpt").html());
				$("#ecsHonRecordForm").html(ecsHonRecordTpt(data));
				// 加载企业
				SelectTwo.initSelect2($('#belongentselect2'),BASE_URL + "enterprise/entbusinessinfo/searchEntSimpleInfo",'请选择企业',formatRepo,formatRepoSelection);
				var ecsHonDetailList=data.ecsHonDetailList;
				if ($(ecsHonDetailList).size() > 0) {
					$("#ecsHonDetailTB").append("<tr>" +
						"<td align='center' width='15%'>序号</td>" +
						"<td align='center' width='20%'>评分项目</td>" +
						"<td align='center' width='20%'>权重</td>" +
						"<td align='center' width='20%'>打分值(满分100)</td>" +
						"<td align='center' width='20%'>权重得分</td>" +
						"<td align='center' width='20%'>合计得分</td>" +
						"</tr>");
				}
					$.each(data.ecsHonDetailList,function(index,ecsHonDetail){
						$("#ecsHonDetailTB").append("<tr>" +
							"<td align='center' width='15%'>"+(index+1)+"</td>" +
							"<td align='center' width='20%'>"+ecsHonDetail.optionname+"</td>" +
							"<td align='center' width='20%'>"+ecsHonDetail.optionweight+"</td>" +
							"<td align='center' width='20%'>"+ecsHonDetail.score+"</td>" +
							"<td align='center' width='20%'>"+ecsHonDetail.weightscore+"</td>" +
							"</tr>");
					});
					var $ecsHonDetail = $("#ecsHonDetailTB tr td[name='sumWeigth']");
					var rowspanNum =  $ecsHonDetail.size();
					$("#ecsHonDetailTB tr:eq(1)").append("<td align='center' width='20%' rowspan='"+rowspanNum+"'>"+$("#sum").val()+"</td>");
			}
		}
	});
	
});

// 获取传递参数
function GetQueryString(name)
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
	$("#businessinfoid").val(repo.id);
	 return repo.text;
}