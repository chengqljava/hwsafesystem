$(function() {
	 new gnMenu(document.getElementById('gn-menu'))
	/*$('.gn-menu li').hover(function() {
		$(this).addClass('active');
		$(this).find('.gn-submenu').show();
		$('.subnav').css('visibility','visible');
		$('.subnav').css('display','block');
	},function() {
		$(this).removeClass('active');
		$(this).find('.gn-submenu').hide();
	});*/
	 $('.gn-menu').children('li').children('a').click(function(){
		 $('.subnav').css('visibility','visible');
			$('.subnav').css('display','block');
	 })
	$('.gn-submenu li').click(function() {
		$('.gn-submenu li').removeClass('active');
		$(this).addClass("active");
		$('.subnav').css('visibility','visible');
		$('.subnav').css('display','block');
		$('.gn-menu-wrapper').addClass('gn-open-ok');
	});
	$('.btnTop ul li').click(function() {
		$(this).addClass('active').siblings().removeClass('active')
	});
	
	var flag = 1;
	$('.special').click(function() {
		if(flag == 1) {
			$('.carousel').hide();
			flag = 0;
		}else {
			$('.carousel').show();
			flag = 1;
		}
	});
	
	$('.picAll').click(function(event) {
		if(flag == 1) {
			$('.picShow').show();
			flag = 0;
		}else {
			$('.picShow').hide();
			flag = 1;
		}
		$(document).one("click", function() 
		{
			$('.picShow').hide();
		});
		event.stopPropagation()
	});
	$('.picShow').click(function (event) 
	{
		event.stopPropagation();
	});
	$('.pic').click(function(event) {
		if(flag == 1) {
			$('.imgShow').show();
			flag = 0;
		}else {
			$('.imgShow').hide();
			flag = 1;
		}
		$(document).one("click", function () 
		{
			$('.imgShow').hide();
		});
		event.stopPropagation()
	});
	$('.imgShow').click(function (event) 
	{
		event.stopPropagation();
	});
	/*权限控制专题图的显隐*/
	var districtlevel = $("#districtlevel").val();
	if(districtlevel == 0){
		$('.special').show();
	}else{
		$('.special').hide();
	}
	
});

