/*新增或编辑场所环境*/
$(function () {

    var rskrecordid = getQueryString("rskrecordid");
    var riskrating = getQueryString("riskrating");
    if(riskrating == 4){
    	$("#dssType").text("重大风险");
    	$("#dssType").css('color','#ED5851');
    	$(".zdfx").css('background','#C2E7F6');
    } else if(riskrating == 3){
    	$("#dssType").text("较大风险");
    	$("#dssType").css('color','#F5A623');
    	$(".jdfx").css('background','#C2E7F6');
    } else if(riskrating == 2){
    	$("#dssType").text("一般风险");
    	$("#dssType").css('color','#F8E71C');
    	$(".ybfx").css('background','#C2E7F6');
    } else if(riskrating == 1){
    	$("#dssType").text("低风险");
    	$("#dssType").css('color','#4AA3E2');
    	$(".dfx").css('background','#C2E7F6');
    }

    /*保存(新增或编辑)*/
    $.ajax({
        type: "post",
        url: BASE_URL + "dangersource/dssrskevaluatemes/loadByRskRecordid",
        dataType: "json",
        data: {
            rskrecordid: rskrecordid
        },
        success: function (data) {
            if (data) {
                var gradeRskTpt = _.template($("#gradeRskTpt").html());
                $("#gradeRskForm").html(gradeRskTpt(data));
                if(data.hisRskResult.length > 0){
                	$("#hisRsk").show();
                }
                if(data.DANGERVALUE>180){
                	$("#zdfx").text("极其危险，不能继续作业");
                }
            }
        },
        error: function () {
            parent.toast("初始化信息加载失败");
        }
    });
});
var flag = 0;
function loadHisRsk(){
	if(flag == 0){
		$("#hisRskList").show();
		flag = 1;
	} else if(flag == 1){
		$("#hisRskList").hide();
		flag = 0;
	}
}

function mOver(ele){  
    $("#dssLevel").show(); 
  }  

function mOut(ele){  
	$("#dssLevel").hide();
  } 

function getQueryString(name)
{
    var reg = new RegExp("(^|&)"+ name +"=([^&]*)(&|$)");
    var r = window.location.search.substr(1).match(reg);
    if(r!=null)return  unescape(r[2]); return null;
}


