/**
 * 黑名单查看
 */
$(document).ready(function() {
	var nonticeid = GetQueryString("nonticeid");
	
	//查询
	$.ajax({
		type : "post",
		url : BASE_URL + "ecs/ecsnotice/display/"+nonticeid,
		data : {},
		success : function(data) {
			if (data) {
				var blackRecordTpt = _.template($("#blackRecordTpt").html());
				data.baseUrl = BASE_URL;
				$("#blackRecordForm").html(blackRecordTpt(data));
				
				$("#entName").html(data.entname);
				$("#entName").attr("title",data.entname);
				$("#scoreSum").html(data.finascore);
				$("#scoreSum").attr("title",data.finascore);
				$("#person").html(data.marker);
				$("#person").attr("title",data.marker);
				$("#scoreTime").html(getSmpFormatDateByLong(data.markertime,false));
				$("#scoreTime").attr("title",getSmpFormatDateByLong(data.markertime,false));

				
//				$("#baseInfo").hide();
//				$("#reformInfo").hide();
				$("#honestyInfo").show();
				$("#badRecordInfo").hide();
//				$("#yinhuanInfo").hide();
				$("#blaRecordInfo").hide();
				$("#redRecordInfo").hide();//默认显示基本信息
				$("#revocationInfo").hide();
	        	$("#caseInfo").hide();
				$("#sanctionInfo").hide();
				$("#fakeInfo").hide();
				$("#exposureInfo").hide();
				$("#otherInfo").hide();
				$("#violationInfo").hide();
				autoHeight();
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
			$("#honestyInfo").hide();
			$("#badRecordInfo").hide();
			$("#yinhuanInfo").hide();
			$("#blaRecordInfo").hide();
			$("#redRecordInfo").hide();
			$("#revocationInfo").hide();
        	$("#caseInfo").hide();
			$("#sanctionInfo").hide();
			$("#fakeInfo").hide();
			$("#violationInfo").hide();
			$("#exposureInfo").hide();
			$("#otherInfo").hide();
        }else if(curmenu=="reformInfo"){//整改
        	$("#baseInfo").hide();
        	$("#reformInfo").show();
			$("#honestyInfo").hide();
			$("#badRecordInfo").hide();
			$("#yinhuanInfo").hide();
			$("#blaRecordInfo").hide();
			$("#redRecordInfo").hide();
			$("#revocationInfo").hide();
        	$("#caseInfo").hide();
			$("#sanctionInfo").hide();
			$("#fakeInfo").hide();
			$("#violationInfo").hide();
			$("#exposureInfo").hide();
			$("#otherInfo").hide();
        }else if(curmenu=="honestyInfo"){//核查
        	$("#baseInfo").hide();
        	$("#reformInfo").hide();
			$("#honestyInfo").show();
			$("#badRecordInfo").hide();
			$("#yinhuanInfo").hide();
			$("#blaRecordInfo").hide();
			$("#redRecordInfo").hide();
			$("#revocationInfo").hide();
        	$("#caseInfo").hide();
			$("#sanctionInfo").hide();
			$("#fakeInfo").hide();
			$("#violationInfo").hide();
			$("#exposureInfo").hide();
			$("#otherInfo").hide();
        }else if(curmenu=="badRecordInfo"){
        	$("#baseInfo").hide();
        	$("#reformInfo").hide();
			$("#honestyInfo").hide();
			$("#badRecordInfo").show();
			$("#yinhuanInfo").hide();
			$("#blaRecordInfo").hide();
			$("#redRecordInfo").hide();
			$("#revocationInfo").show();
        	$("#caseInfo").hide();
			$("#sanctionInfo").hide();
			$("#fakeInfo").hide();
			$("#violationInfo").hide();
			$("#exposureInfo").hide();
			$("#otherInfo").hide();
        }else if(curmenu=="yinhuanInfo"){
        	$("#baseInfo").hide();
        	$("#reformInfo").hide();
			$("#honestyInfo").hide();
			$("#badRecordInfo").hide();
			$("#yinhuanInfo").show();
			$("#blaRecordInfo").hide();
			$("#redRecordInfo").hide();
			$("#revocationInfo").hide();
        	$("#caseInfo").hide();
			$("#sanctionInfo").hide();
			$("#fakeInfo").hide();
			$("#violationInfo").hide();
			$("#exposureInfo").hide();
			$("#otherInfo").hide();
        }else if(curmenu=="blaRecordInfo"){
        	$("#baseInfo").hide();
        	$("#reformInfo").hide();
			$("#honestyInfo").hide();
			$("#badRecordInfo").hide();
			$("#yinhuanInfo").hide();
			$("#blaRecordInfo").show();
			$("#redRecordInfo").hide();
			$("#revocationInfo").hide();
        	$("#caseInfo").hide();
			$("#sanctionInfo").hide();
			$("#fakeInfo").hide();
			$("#violationInfo").hide();
			$("#exposureInfo").hide();
			$("#otherInfo").hide();
        }else if(curmenu=="redRecordInfo"){
        	$("#baseInfo").hide();
        	$("#reformInfo").hide();
			$("#honestyInfo").hide();
			$("#badRecordInfo").hide();
			$("#yinhuanInfo").hide();
			$("#blaRecordInfo").hide();
			$("#redRecordInfo").show();
			$("#revocationInfo").hide();
        	$("#caseInfo").hide();
			$("#sanctionInfo").hide();
			$("#fakeInfo").hide();
			$("#violationInfo").hide();
			$("#exposureInfo").hide();
			$("#otherInfo").hide();
        }
    });
    
  //绑定tab导航菜单点击事件
    $("#badRecordInfo li").off("click").on("click", function(){
        $("#badRecordInfo li.active").removeClass("active");
        $(this).addClass("active");
        var curmenu = $(this).attr("data-tgt");
        //判断当前点击的tab菜单，进行隐藏显示操作
        if(curmenu=="revocationInfo"){
        	$("#revocationInfo").show();
        	$("#caseInfo").hide();
			$("#sanctionInfo").hide();
			$("#fakeInfo").hide();
			$("#violationInfo").hide();
			$("#exposureInfo").hide();
			$("#otherInfo").hide();
        }else if(curmenu=="caseInfo"){//整改
        	$("#revocationInfo").hide();
        	$("#caseInfo").show();
			$("#sanctionInfo").hide();
			$("#fakeInfo").hide();
			$("#violationInfo").hide();
			$("#exposureInfo").hide();
			$("#otherInfo").hide();
        }else if(curmenu=="sanctionInfo"){//核查
        	$("#revocationInfo").hide();
        	$("#caseInfo").hide();
			$("#sanctionInfo").show();
			$("#fakeInfo").hide();
			$("#violationInfo").hide();
			$("#exposureInfo").hide();
			$("#otherInfo").hide();
        }else if(curmenu=="fakeInfo"){
        	$("#revocationInfo").hide();
        	$("#caseInfo").hide();
			$("#sanctionInfo").hide();
			$("#fakeInfo").show();
			$("#violationInfo").hide();
			$("#exposureInfo").hide();
			$("#otherInfo").hide();
        }else if(curmenu=="exposureInfo"){
        	$("#revocationInfo").hide();
        	$("#caseInfo").hide();
			$("#sanctionInfo").hide();
			$("#fakeInfo").hide();
			$("#violationInfo").hide();
			$("#exposureInfo").show();
			$("#otherInfo").hide();
        }else if(curmenu=="otherInfo"){
        	$("#revocationInfo").hide();
        	$("#caseInfo").hide();
			$("#sanctionInfo").hide();
			$("#fakeInfo").hide();
			$("#violationInfo").hide();
			$("#exposureInfo").hide();
			$("#otherInfo").show();
        }else if(curmenu=="violationInfo"){
        	$("#revocationInfo").hide();
        	$("#caseInfo").hide();
			$("#sanctionInfo").hide();
			$("#fakeInfo").hide();
			$("#violationInfo").show();
			$("#exposureInfo").hide();
			$("#otherInfo").hide();
        }
    });
});


function GetQueryString(name)
{
     var reg = new RegExp("(^|&)"+ name +"=([^&]*)(&|$)");
     var r = window.location.search.substr(1).match(reg);
     if(r!=null)return  unescape(r[2]); return null;
}
