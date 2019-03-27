// 右键更换平面图
$('.thrDimViewArea').contextmenu(function(e){
    var mouseX = e.originalEvent.x || e.originalEvent.layerX || 0;
    var mouseY = e.originalEvent.y || e.originalEvent.layerY || 0;
    $('#replaceMap').show().css({
        'position':'absolute',
        'left':mouseX+30,
        'top':mouseY-20
    })
    return false;
})

$('#icon').on('mousedown','.realWkSpMonPt',function(e){
    // 阻止事件冒泡，只在元素本身触发
    e.stopPropagation();
    var id = this.id;

    var mouseX = e.originalEvent.x || e.originalEvent.layerX || 0;
    var mouseY = e.originalEvent.y || e.originalEvent.layerY || 0;
    var left = $('#'+id).position().left-mouseX;
    var top = $('#'+id).position().top-mouseY;
    console.log(left,top);
    pointMove(id,left|0,top|0);
});
$('main').on('mouseup',function(){
	$('#replaceMap').hide();
})
// 监听移动区域的点击事件，解绑鼠标移动事件；
$('main').on('mouseup','.realWkSpMonPt',(function(e){
    $('main').unbind('mousemove');
    //获取点位类型
    var mactype = $(this).attr("data-type");
    var id = $(this).attr("data-blg");
    var left = $('#'+id).position().left;
    var top = $('#'+id).position().top;
    var lefts = ((left/$(".thrDimViewArea").width()) * 100).toFixed(4);
    var tops = ((top/$(".thrDimViewArea").height()) * 100).toFixed(4);
    console.log(lefts,tops);

	if(mactype == 1){
		//将最新的点位横纵坐标保存到探头表
		$.ajax({
			type : "post",
			url : BASE_URL + "monitor/macprobe/savePoint",
			dataType : "json",
			data: {
				"id": id,
				"left": lefts,
				"top": tops
			},
			success: function(data){
				if(data.success==true){
					parent.toast(data.msg);//弹出提示信息
				};
			}
		});
	} else{
		//将最新的点位横纵坐标保存到摄像头表
		$.ajax({
			type : "post",
			url : BASE_URL + "monitor/macvideo/savePoint",
			dataType : "json",
			data: {
				"id":id,
				"left": lefts,
				"top": tops
			},
			success: function(data){
				if(data.success==true){
					parent.toast(data.msg);//弹出提示信息
				};
			}
		});
	}
}));

var lastWidth = $(".thrDimViewArea").width();
$(window).resize(function() {
	var thisWidth = $(".thrDimViewArea").width();
	var i = thisWidth/lastWidth;
	pointBecomeScreen(i);
	lastWidth = thisWidth;
});
function pointBecomeScreen(i){
	$('.realWkSpMonPt').each(function(){
		var Rleft = $(this).position().left;
		var Rtop = $(this).position().top;
		$(this).css({
			"left":Rleft*i,
			"top":Rtop*i
		})
	})
}
/**
 * 使元素随鼠标的移动而移动；
 * @param {any} id 需要移动的元素的id；
 */
function pointMove(id,left,top){
    console.log(id)
    $('main').bind('mousemove',(function(e){
    	e.stopPropagation();
        // 获取鼠标位置
        var mouseX = e.originalEvent.x || e.originalEvent.layerX || 0;
        var mouseY = e.originalEvent.y || e.originalEvent.layerY || 0;
        $('#'+id).css({
            'left': (mouseX+left)+'px',
            'top': (mouseY+top)+'px'
        });

    }));
};

//打开企业平面图选择列表
$("#replaceMap").off("click").on("click",function(){
	parent.openWin(BASE_URL + "views/module/monitor/dataflag/planattachlist.html",
			"企业平面图", "60%", "80%");
})

$(function(){
	//加载企业平面图
	loadPlan();
	
	//加载探头、摄像头
	initWorkShopMonPts();	
	
})

/**
 * 查询数据库初始化加载指定车间内部监测点位
 */
function initWorkShopMonPts(){
	//查询数据库生成相关监测点位dom元素---------------------------------
	//加载探头
	$.ajax({
		type : "post",
		url : BASE_URL + "monitor/macprobe/load",
		dataType : "json",
		data :{},
		success : function(data) {
			if (data) {
				var arr = [];
				$.each(data,function(i,item){
					$(item).each(function(){
						arr.push(this);
					});
				})
				var appDom = "";
				_.map(arr, function(num, key){

					appDom += (
					"<div data-blg='" + num.probeid + "' id='" + num.probeid +  "' data-pName='" + num.probename + "'" +
					" data-pType='" + num.probegroup + "' data-type='1' " +
					" class='realWkSpMonPt' style='top: " + num.top +"%;left: " + num.left + "%;'>" + 
					"		<div class='demo1'></div>" +					
					"	<div class='ptTitle' style='z-index: 99999;'>"+ num.probename +
					"	</div>" +	
					"	<div class='demo2'>" +
					"	</div>" +
					"</div>");
				});
				$(".device").append(appDom);
			}
		},
		error : function() {
			parent.toast("初始化信息加载失败");
		}
	});

	//加载摄像头
	$.ajax({
		type : "post",
		url : BASE_URL + "monitor/macvideo/load",
		dataType : "json",
		data :{},
		success : function(data) {
			if (data) {
				var arr = [];
				$.each(data,function(i,item){
					$(item).each(function(){
						arr.push(this);
					});
				})
				var appDom = "";
				_.map(arr, function(num, key){
			
					appDom += (
					"<div  data-blg='" + num.videoid + "' id='" + num.videoid +  "' data-pName='" + num.videoname + "'" +
					" data-pType='" + num.videogroup + "' data-type='2' " +
					" class='realWkSpMonPt' style='top: " + num.top +"%;left: " + num.left + "%;'>" +
					"		<div class='demo3'></div>" +
					"	<div class='ptTitle' style='z-index: 99999;'>"+ num.videoname +
					"	</div>" +					
					"	<div class='demo2'>" +
					"	</div>" +
					"</div>");
				});
				$(".device").append(appDom);
			}
		},
		error : function() {
			parent.toast("初始化信息加载失败");
		}
	});
		

}

//查询绑定的企业平面图
function loadPlan() {    	
	$.ajax({
		type : "post",
		url : BASE_URL + "enterprise/entplan/loadplan",
		dataType : "json",
		data :{
			
		},
		success : function(data) {
			if (data) {
				if(data.planattach == null){
//					var httpurl = location.protocol + "//" + location.host + "/";
					//加载企业平面图
					$(".thrDimImg").attr("src", BASE_URL+data.defaulturl);					
				}else{
					var planattach = data.planattach;//平面图附件
					var attachurl = planattach.attachurl;
					var httpurl = location.protocol + "//" + location.host + "/";
					//加载企业平面图
					$(".thrDimImg").attr("src", httpurl+"zwsafe_uploadFiles"+attachurl);					
				}
				$(".thrDimImg").attr("width","100%").attr("height","100%");
			}
		},
		error : function() {
			parent.toast("初始化信息加载失败");
		}
	});
}

/**
 * 关闭弹窗自动刷新
 */
function reloadGrid() {
	loadPlan();
}
		