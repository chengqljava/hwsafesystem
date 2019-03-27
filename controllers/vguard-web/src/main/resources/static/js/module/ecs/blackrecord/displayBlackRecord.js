/**
 * 黑名单查看
 */
$(document).ready(function() {
	//查询
	$.ajax({
		type : "post",
		url : BASE_URL + "ecs/ecsblarecord/display/"+ GetQueryString("recordid"),
		data : {},
		success : function(data) {
			if (data) {
				var blackRecordTpt = _.template($("#blackRecordTpt").html());
				data.baseUrl = BASE_URL;
				$("#blackRecordForm").html(blackRecordTpt(data));
//				showUploadFile("fileUploadDiv", 'file', true, false);// 显示文件上传控件
				$("#baseInfo").show();//默认显示基本信息
				$("#reformInfo").hide();
				$("#checkInfo").hide();
				
			}
		}
	});
	
	//绑定tab导航菜单点击事件
    $("#infos li").off("click").on("click", function(){
        $("#infos li.active").removeClass("active");
        $(this).addClass("active");
        var curmenu = $(this).attr("data-tgt");
        //判断当前点击的tab菜单，进行隐藏显示操作
        if(curmenu=="baseInfo"){
        	$("#baseInfo").show();
        	$("#reformInfo").hide();
			$("#checkInfo").hide();
        }else if(curmenu=="reformInfo"){//整改
        	$("#baseInfo").hide();
        	$("#reformInfo").show();
			$("#checkInfo").hide();
			/*$("[data-ctrl='reformData']").each(function(index,element){
				showUploadFile("zgfileUploadDiv_"+index, 'file', true, false);// 显示文件上传控件
			});*/
			
        }else if(curmenu=="checkInfo"){//核查
        	$("#baseInfo").hide();
        	$("#reformInfo").hide();
			$("#checkInfo").show();
			/*$("[data-ctrl='checkData']").each(function(index,element){
				showUploadFile("hcfileUploadDiv_"+index, 'file', true, false);// 显示文件上传控件
			});*/
        }
    });
        
	
});


function GetQueryString(name)
{
     var reg = new RegExp("(^|&)"+ name +"=([^&]*)(&|$)");
     var r = window.location.search.substr(1).match(reg);
     if(r!=null)return  unescape(r[2]); return null;
}
