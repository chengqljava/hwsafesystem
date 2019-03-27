$(function() {

	function activeClass($item) {
		$($item).addClass("active").siblings().removeClass("active");
	}
//	顶部工具条切换
	$(".toolbar-tabs").find(".tab-item").on("click", function() {
		var $parentLi = $(this).parent("li");
		var $idx = $parentLi.index();
		var $item = $parentLi;
		var $contPanel = $(".tab-content").find(".content-panel").eq($idx);
		$contPanel.fadeIn(800).siblings().hide();
		activeClass($item);
	});
	
//	1测量
	$(".tab-content .cj li").find("a").on("click", function($item) {
		var $item = $(this).parent("li");
		activeClass($item);
	});
	
//	2定位
	$(".select-from").find("input").on("click", function() {
		var $ul = $(".select-content ul");
		if ($ul.is(":visible")) {
			$ul.slideUp();
		}else {
			$ul.slideDown();
		}
	});
	
//	3路线
	$(".tab-content .hx").find(".btn-func").on("click", function($item) {
		var $item = $(this);
		activeClass($item);
	});
	
	$(".sel-dropdown").find("input").on("click", function() {
		var $ul = $(".sel-dropdown ul");
		if ($ul.is(":visible")) {
			$ul.slideUp();
		}else {
			$ul.slideDown();
		}
	});
	
//	4属性
	
//	5图层
	$(".tab-content .tc .tc-layer").find(".add-btn").on("click", function(){
		$(this).parent(".tc-layer").hide();
		$(".tab-content .tc .add-layer").show();
	});
	
	$(".tab-content .tc .bottom-content").find("button.btn-func").on("click", function() {
		$(".tab-content .tc .tc-layer").show();
		$(".tab-content .tc .add-layer").hide();
	});
	
	$(".tab-content .tc .top-toobar").find("a").on("click", function($item) {
		var $item = $(this);
		var $idx = $(this).index();
		var $content = $(".tab-content .tc .bottom-content");
		var $contentTab = $content.find(".tc-tab").eq($idx);
		$contentTab.show().siblings().hide();
		activeClass($item);
	});
	
//	右侧收缩
	$(".toolbar-wrapper").find("a.back-btn").on("click", function() {
		var x = $(".left-part").position();
		if(x.left === 0) {
			$(".left-part").animate({left: "-304px"});
			$(this).addClass("active");
			$(this).css("right","-21px");
			$("#sceneControlDiv").animate({left: "20px"});
		}else {
			$("#sceneControlDiv").animate({left: "310px"});
			$(".left-part").animate({left: "0"});
			$(this).removeClass("active");
			$(this).css("right","0px");
		}
	});

//			$(".toolbar-tabs").find(".shrink").on("click", function() {
//				var x = $(".toolbar-tabs").position();
//				if (x.left === 0) {
//					$(".toolbar-tabs").animate({left: "-301px"});
//					$(this).parent("li").removeClass("active");
//					$(".tab-content").css("display","none");
//				}else{
//					$(".toolbar-tabs").animate({left: "0px"});
//				}
//			});

			
//			$(".select-from").find("input").on("click", function() {
//				var $ul = $(".select-content ul");
//				if ($ul.is(":visible")) {
//					$ul.slideUp();
//				}else {
//					$ul.slideDown();
//				}
//			});

//			$(".tab-content ul.cj").find("a").on("click", function($item) {
//				var $item = $(this).parent("li");
//				activeClass($item);
//			});
//
//			$(".tab-content .hx").find("button.btn-func").on("click", function($item) {
//				var $item = $(this);
//				activeClass($item);
//			});


});

