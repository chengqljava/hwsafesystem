function loadHistroy(evaluationid,radius) {
	$("#evaluationid").val(evaluationid);
	$.ajax({
		type : "post",
		url : BASE_URL + "ems/emssucresourceevaluation/resoucelist",
		data : {
			"evaluationid":evaluationid
		},
		success : function(data) {
			if (data.data.length>0) {
				window.parent.initResMarks(data.data,data.radius);
			}
		}
	});
	loadHisResource(evaluationid);
};

function loadType(){
	var resTypeParaArr = [];
    $('.item').each(function(){
    	if(!$(this).hasClass("selected")){    
    		var type = $(this).data('index');
    		resTypeParaArr.push(type);		
    	}
	});
    return resTypeParaArr;
}

function loadHisResource(evaluationid) {
	var resTypeParaArr = loadType().join(",");
	$.ajax({
		type : "post",
		url : BASE_URL + "ems/portalgisems/loadSucResInfo",
		data : {
			"resType":resTypeParaArr,
			"evaluationid":evaluationid
		},
		success : function(data) {
			$("#hisResInfo").empty();
			if (data.emsResList) {
				var emsResList = data.emsResList;
				var histroyResTpt = _.template($("#histroyResTpt").html());
                $("#hisResInfo").html(histroyResTpt(data));
                scrollResize();
                $("#histroynbsp").show();
                autoHeight();
			}
		}
	});
}

//类型选中不选中
$('#histroyInfos').on('click','tr',function(){
	var resId = $(this).data('resid');
	parent.makePointMaker(resId);
})
