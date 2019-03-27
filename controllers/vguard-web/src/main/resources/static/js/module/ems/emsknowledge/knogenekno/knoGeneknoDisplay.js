/**
 * 应急常识查看
 */
$(document).ready(function() {
	//查询
	$.ajax({
		type : "post",
		url : BASE_URL + "ems/emsknogenekno/display/"+ GetQueryString("geneknoid"),
		data : {},
		success : function(data) {
			if (data) {
				var knoGeneknoTpt = _.template($("#knoGeneknoTpt").html());
				data.baseUrl = BASE_URL;
				$("#knoGenekonForm").html(knoGeneknoTpt(data));
				//附件显示
				if(data.attachid!=""){
					showUploadFile("fileUploadDiv", 'file', false, false);// 显示文件上传控件
				}
				//知识类型
				SelectOption.loadKnoType("geneknotypecode");
				$("input").attr("disabled",true);
				$("textarea").attr("disabled",true);
				$("select").attr("disabled",true);
				
			}
		}
	});
	
        
	
});


function GetQueryString(name)
{
     var reg = new RegExp("(^|&)"+ name +"=([^&]*)(&|$)");
     var r = window.location.search.substr(1).match(reg);
     if(r!=null)return  unescape(r[2]); return null;
}
