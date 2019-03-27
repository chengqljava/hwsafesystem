/**
 * 技术标准查看
 */
$(document).ready(function() {
	//查询
	$.ajax({
		type : "post",
		url : BASE_URL + "ems/emsknostandard/display/"+ GetQueryString("standid"),
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
				// 标准类型
				SelectOption.loadStandardType("standardtypecode");
				//标准等级
				SelectOption.loadStandardLevel("standardlevelcode");
				//法律效力
				SelectOption.loadLawForce("lawforce");
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
