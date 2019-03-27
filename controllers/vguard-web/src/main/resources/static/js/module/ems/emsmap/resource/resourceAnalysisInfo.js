  
//获取事故信息id
var eventid = GetQueryString("eventid");
$(function(){
	
	//分析
    $("#analysis").off("click").on("click",function(){
//    	$("#flag").val("2");
    	var selectedArray = new Array;
    	$("span.item").each(function(){
    		if($(this).hasClass('selected')){
    		}else{
    			selectedArray.push($(this).data("kind"));
    		}
    		
    	});
    	if(selectedArray.length==0){
    		parent.toast("请选择资源类型!");
    		return;
    	}
    	var radiusCount = removeAllSpace($("#radius").val());
    	if (!checkNumber(radiusCount) || radiusCount<0 || radiusCount>20) {
    		parent.toast("分布范围请输入0-20以内的整数!");
    		$("#radius").val('');
    		return false;
    	}
    	//清空历史操作
    	$("#analysisRadius").val("");
    	$("#types").val("");
    	$("#wzzbdata").val("");
    	$("#jydwdata").val("");
    	$("#bncsdata").val("");
    	$("#ylzydata").val("");
    	$("#ysbzdata").val("");
    	$("#txbzdata").val("");
    	$("#yjzjdata").val("");
    	$("#yjjgdata").val("");
    	//获取分析半径
    	var radius = $("#radius").val();
    	//分析半径赋值，便于列表中显示查询
    	$("#analysisRadius").val(radius);
    	$("#types").val(selectedArray);
    	
    	$("#histroyInfos").removeClass('singleArea');
//    	$("#zypgAdd").addClass('singleArea');
    	$('#zypgHistry').addClass('singleArea');
//    	$("#infos").show();
//    	$("#saveBtn").show();
    	//查询
    	$.ajax({
    		type : "post",
    		url : BASE_URL + "ems/emssucresourceevaluation/resoucedata",
    		data : {
    			"eventid":eventid,
    			"radius":radius,
    			"types":JSON.stringify(selectedArray)
    		},
    		success : function(data) {
    			$("#hisResInfo").empty();
    			if (data.data.length > 0) {
    				window.parent.initMapPts(data.data,"resourceEva",radius);
    				var newResTpt = _.template($("#newResTpt").html());
                    $("#hisResInfo").html(newResTpt(data));
                    scrollResize();
    			}
    		}
    	});
    	$("#histroynbsp").show();
    	$('#save').show();
    	autoHeight();
    });
});	

//类型选中不选中
$('#histroyRes').on('click','tr',function(){
	var resId = $(this).data('resid');
	parent.makePointMaker(resId);
})

//验证字符串是否是数字
function checkNumber(theObj) {
	var reg = /^\+?[1-9][0-9]*$/;
	if (reg.test(theObj)) {
		return true;
	}
		return false;
}
//正则表达式去掉所有空格
function removeAllSpace(str) {
    return str.replace(/\s+/g, "");
}

//保存
$("#save").click(function(){
	
	var types = $("#types").val();
	//初始化列表中需要保存的资源id
	var wzzbIds = new Array;
	var jydwIds = new Array;
	var bncsIds = new Array;
	var ylzyIds = new Array;
	var ysbzIds = new Array;
	var txbzIds = new Array;
	var yjzjIds = new Array;
	var yjjgIds = new Array;
	$("#histroyInfos table tbody tr").each(function(){
		var type = $(this).data("type")
		var id = $(this).data("resid")
		if(type == "wzzb"){
			wzzbIds.push(id);
		} else if(type == "jydw"){
			jydwIds.push(id);
		} else if(type == "bncs"){
			bncsIds.push(id);
		} else if(type == "ylzy"){
			ylzyIds.push(id);
		} else if(type == "ysbz"){
			ysbzIds.push(id);
		} else if(type == "txbz"){
			txbzIds.push(id);
		} else if(type == "yjzj"){
			yjzjIds.push(id);
		} else if(type == "yjjg"){
			yjjgIds.push(id);
		}
	});
	$("#wzzbdata").val(wzzbIds);
	$("#jydwdata").val(jydwIds);
	$("#bncsdata").val(bncsIds);
	$("#ylzydata").val(ylzyIds);
	$("#ysbzdata").val(ysbzIds);
	$("#txbzdata").val(txbzIds);
	$("#yjzjdata").val(yjzjIds);
	$("#yjjgdata").val(yjjgIds);
	var wzzbdata = $("#wzzbdata").val();
	var jydwdata = $("#jydwdata").val();
	var bncsdata = $("#bncsdata").val();
	var ylzydata = $("#ylzydata").val();
	var ysbzdata = $("#ysbzdata").val();
	var txbzdata = $("#txbzdata").val();
	var yjzjdata = $("#yjzjdata").val();
	var yjjgdata = $("#yjjgdata").val();
	if(wzzbdata.length==0&&jydwdata.length==0&&bncsdata.length==0&&ylzydata.length==0 &&ysbzdata.length==0 &&txbzdata.length==0 &&yjzjdata.length==0 &&yjjgdata.length==0){
		parent.toast("没有需要保存的资源数据!");
		return;
	}
	
	//异步加载
	$.ajax({
		type : 'post',
		url : BASE_URL+'/ems/emssucresourceevaluation/save',
		cache : false,
		dataType : 'json',
		data : {
			"eventid":eventid,
			"wzzbdata":$("#wzzbdata").val(),
			"jydwdata":$("#jydwdata").val(),
			"bncsdata":$("#bncsdata").val(),
			"ylzydata":$("#ylzydata").val(),
			"ysbzdata":$("#ysbzdata").val(),
			"txbzdata":$("#txbzdata").val(),
			"yjzjdata":$("#yjzjdata").val(),
			"yjjgdata":$("#yjjgdata").val(),
			"radius":$("#analysisRadius").val()
		},
		global : false,
		success : function(json) {
			parent.toast(json.msg);
			$('#save').hide();
		},
		error : function() {
			parent.toast("保存失败");
		}
	});
	
	
});

    function GetQueryString(name)
    {
         var reg = new RegExp("(^|&)"+ name +"=([^&]*)(&|$)");
         var r = window.location.search.substr(1).match(reg);
         if(r!=null)return  unescape(r[2]); return null;
    }
