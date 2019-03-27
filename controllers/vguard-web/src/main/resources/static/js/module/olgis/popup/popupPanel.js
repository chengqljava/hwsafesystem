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
		var content = createTable(attributes,attributes.POPFLAG);
		$(element).css('height', 'auto');
		$(element).css('visibility', 'visible');
		$(".popup-bubbleContent").html(content);
		$(".popup-bubleTitle").html(attributes.NAME);
		closePopup.setPosition(ol.proj.fromLonLat([parseFloat(attributes.LONGITUDE),parseFloat(attributes.LATITUDE)]));
		var height = $(element).height();
		var width = $(element).width();
		closePopup.setOffset([ 18, -(height + 40) ]);
		//popup弹出框tab页切换js
		changeTab();
		
	}
	
	//创建弹出框面板
	var createTable = function(attributes,popFlag){
		var content;
		if(popFlag == "ent"){
			var entcontent = new entContent();
			var BusiDate = entcontent.getBusiDate(attributes.PROPER);
			content = entcontent.setPopupContent(BusiDate);
		}else if(popFlag == "yjjg"){
			var yjjgcontent =new yjjgContent();
			var yjjgDate = yjjgcontent.getDate(attributes.PROPER);
			content = yjjgcontent.setPopupContent(yjjgDate);
		}else if(popFlag == "yjck"){
			var yjckcontent =new yjckContent();
			var yjckDate = yjckcontent.getDate(attributes.PROPER);
			content = yjckcontent.setPopupContent(yjckDate);
		}else if(popFlag == "yjdw"){
			var yjdwcontent =new yjdwContent();
			var yjdwDate = yjdwcontent.getDate(attributes.PROPER);
			content = yjdwcontent.setPopupContent(yjdwDate);
		}else if(popFlag == "yjwz"){
			var yjwzcontent =new yjwzContent();
			var yjwzDate = yjwzcontent.getDate(attributes.PROPER);
			content = yjwzcontent.setPopupContent(yjwzDate);
		}else if(popFlag == "yhfb"){
			var yhfbcontent =new yhfbContent();
			var yhfbDate = yhfbcontent.getDate(attributes.PROPER);
			content = yhfbcontent.setPopupContent(yhfbDate);
		}
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
			'content' : attributes.NAME
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