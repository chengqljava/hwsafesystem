var popupPanel = function(){
	var self = this;
	
	var closePopup;
	var popup;
	this.init = function(){
		//弹出的带关闭按钮的面板
		closePopup = new ol.Overlay({
			id:'closePopupOverlay',
			positioning : 'top-center',
		    element : document.getElementById('closePopup')
		});
		
		//提示面板
		popup = new ol.Overlay({
			id:'popupOverlay',
			positioning : 'top-center',
			element : document.getElementById('popup')
		});
		
	}
	
	//加载弹出框
	this.loadClosePopup = function(attributes){
		var element = closePopup.getElement();
		var content = createTable(attributes);
		$(element).css('height', 'auto');
		$(element).css('visibility', 'visible');
		$(".popup-bubbleContent").html(content);
		$(".popup-bubleTitle").html(attributes.ENTNAME);
		closePopup.setPosition(ol.proj.fromLonLat([parseFloat(attributes.LONGITUDE),parseFloat(attributes.LATITUDE)]));
		var height = $(element).height();
		closePopup.setOffset([ 32, -(height + 40) ]);
		//popup弹出框tab页切换js
		changeTab();
	}
	
	//创建弹出框面板
	var createTable = function(attributes){
		var mycontent = new PopupContent();
		var BusiDate = mycontent.getBusiData(attributes);
		var content = mycontent.setPopupContent(BusiDate);
		return content;
	}
	
	//popup弹出框tab页切换js
	function changeTab(){
		var $div =$(".tab_menu ul li");
	    $div.click(function(){
			$(this).addClass("active")
				   .siblings().removeClass("active"); 
	        var index =  $div.index(this); 
			$("div.tab_box > div")   	
					.eq(index).show()   
					.siblings().hide(); 
		}).hover(function(){
			$(this).addClass("hover");
		},function(){
			$(this).removeClass("hover");
		})
	}
	
	//清除弹出框
	this.clearPopup = function(){
		closePopup.setPosition(undefined);
		$('#closePopup').blur();
	}
	
	//关闭弹出框
	this.closeClosePopup = function(){
		closePopup.setPosition(undefined);
		$('#closePopup').blur();
	}
	
	$(".popup-closeBtn").click(function() {
		closePopup.setPosition(undefined);
		$('#closePopup').blur();
	})
	
	//显示简单提示框
	this.showPopup=function(attributes){
		var element = popup.getElement();
		$(element).popover('destroy');
		$(element).popover({
			'placement' : 'top',
			'animation' : false,
			'html' : true,
			'content' : attributes.ENTNAME
		});
		var height = $(element).height();
		popup.setOffset([ 0, -(height + 20) ])
		popup.setPosition(ol.proj.fromLonLat([parseFloat(attributes.LONGITUDE),parseFloat(attributes.LATITUDE)]));
		$(element).popover('show');
	}

	//隐藏简单弹出框
	this.hidePopup=function(){
		var element = popup.getElement();
		$(element).popover('destroy');
	}
	
	this.getPopup=function(){
		return popup;
	}
	
	this.getClosePopup=function(){
		return closePopup;
	}
}