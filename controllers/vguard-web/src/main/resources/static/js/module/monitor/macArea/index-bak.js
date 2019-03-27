$(function(){
	$('body').on('click','#back',function(){
    	$('.allArea').removeClass('fade')
    	$('.singleArea').removeClass('fadeOn');
    	$('.all_title').removeClass('fade');
    	$('.single_title').removeClass('fadeOn');
    	$('#back').removeClass('fadeOn');
    	$('.tools').removeClass('fade');
	})
	var pointsStr = '';
	$('body').on('mousedown','.areaDiv section',function(e){
		var $class = $(this).attr('class');
		var $this = this;
		var $thisAreaDiv = $(this).parent('.areaDiv');
		var areaDivLeft = $thisAreaDiv.position().left;
		var areaDivTop = $thisAreaDiv.position().top;
		var mouseStartX = e.clientX;
		var mouseStartY = e.clientY;
		var FAwidth = $('#factory_area').width();
		var FAheight = $('#factory_area').height();
		$('body').on('mousemove','#factory_area',function(e){
			var mouseEndX = e.clientX;
			var mouseEndY = e.clientY;
			var points = $thisAreaDiv.find('polygon').attr('data-points');
			console.log(points);
            var allPoint = [];
            points.split(' ').forEach(function(item){
           	 var arr = item.split(',');
           	 allPoint = allPoint.concat(arr);
            });
            var allpoints = [];
            allPoint.forEach(function(item,index){
           	 allpoints.push(parseFloat(parseFloat(item).toFixed(2)));
            })
            switch ($class) {
			case 'p1':
				allpoints[0] = mouseEndX - areaDivLeft;
				allpoints[1] = mouseEndY - areaDivTop;
				$($this).css({
					left:allpoints[0]-5,
					top:allpoints[1]-5
				})
				break;
			case 'p2':
				allpoints[2] = mouseEndX - areaDivLeft;
				allpoints[3] = mouseEndY - areaDivTop;		
				$($this).css({
					left:allpoints[2]-5,
					top:allpoints[3]-5
				})
				break;
			case 'p3':
				allpoints[4] = mouseEndX - areaDivLeft;
				allpoints[5] = mouseEndY - areaDivTop;
				$($this).css({
					left:allpoints[4]-5,
					top:allpoints[5]-5
				})
				break;
			case 'p4':
				allpoints[6] = mouseEndX - areaDivLeft;
				allpoints[7] = mouseEndY - areaDivTop;
				$($this).css({
					left:allpoints[6]-5,
					top:allpoints[7]-5
				})
				break;
			default:
				break;
			}
//            console.log(allpoints);
//            var maxY = 0;
//            var maxX = 0;
//            var minY = 0;
//            var minX = 0;
//            allpoints.forEach(function(item,index){
//            	if(index%2 !=0){
//            		if(item>maxY){
//            			maxY = item;
//            			return;
//            		}
//            		else if(item<minY){
//            			minY = item;
//            		}
//            	}
//            	else{
//            		if(item>maxX){
//            			maxX = item;
//            			return;
//            		}
//            		else if(item<minX){
//            			minX = item;
//            		}
//            	}
//            })
//            var polygonH = maxY - minY;
//            var polygonW = maxX - minX;
//            var polygonL = $thisAreaDiv.find('polygon').position().left;
//            var polygonT = $thisAreaDiv.find('polygon').position().top;
//            $thisAreaDiv.css({
//            	width:polygonW,
//            	height:polygonH,
//            	left:areaDivLeft - minX,
//            	top:areaDivTop - minY
//            });
            $thisAreaDiv.find('polygon')
            .attr('points',allpoints[0]+','+allpoints[1]+' '+allpoints[2]+','+allpoints[3]+' '+allpoints[4]+','+allpoints[5]+' '+allpoints[6]+','+allpoints[7])
            .attr('data-points',allpoints[0]+','+allpoints[1]+' '+allpoints[2]+','+allpoints[3]+' '+allpoints[4]+','+allpoints[5]+' '+allpoints[6]+','+allpoints[7]);
			return false;
		})
		$('body').on('mouseup','#factory_area',function(e){
			var parentDiv = $($this).parent('.areaDiv');
			var $id = parentDiv.data('id');
    		var mouseX = e.originalEvent.x || e.originalEvent.layerX || 0;
    		var mouseY = e.originalEvent.y || e.originalEvent.layerY || 0;
    		if( Math.abs(mouseX - mouseStartX) > 1 || Math.abs(mouseY - mouseStartY) > 1){
//    			var lefts = (($($this).position().left + 75)/$('#factory_area').width()*100).toFixed(4);
//	    		var tops = (($($this).position().top + 91)/$('#factory_area').height()*100).toFixed(4);
    			var lefts = ((parentDiv.position().left)/$('#factory_area').width()*100).toFixed(4);
	    		var tops = ((parentDiv.position().top)/$('#factory_area').height()*100).toFixed(4);

    			$.ajax({
	    			type : "post",
	    			url : BASE_URL + "/dangersource/dssrskplacearea/savearea",
//	    			url : "http://192.168.12.54:8080/ahyjyth/dangersource/dssrskplacearea/savearea",
	    			dataType : "json",
	    			data: {
	    				"placeareaid": $id,
	    				"arealeft": lefts,
	    				"areatop": tops,
	    				'areawidth': 13.0000,
	    				'areaheight': 15.0000,
	    				'points': $thisAreaDiv.find('polygon').attr('points')
	    			},
	    			success: function(data){
	    				if(data.success==true){
	    					parent.toast(data.msg);//弹出提示信息
	    				};
	    			}
	    		});
    		}
			$('body').off('mousemove','#factory_area');
			$('body').off('mouseup','#factory_area');
		})
		return false;
	})
//    var areaData = [];
    $.ajax({
        type: "post",
        url: BASE_URL + "/dangersource/dssrskplacearea/loadallplace",
//        url: "http://192.168.111.193:8080/ahyjyth/monitor/maccontroller/loaddangerresource",
        cache : false,
        data:{'businessinfoid':''},
        dataType: "JSON",
        global : false,
        success: function (res) {
        	var areaHtml = '';
        	res.forEach(function(item){
        		var areaObj = {
        			name:item.PLACEAREANAME,
        			id:item.PLACEAREAID
        		}
        		if(item.AREALEFT == null){
					item.AREALEFT = 50;
				}
				if(item.AREATOP == null){
					item.AREATOP = 50;
				}
//        		areaData.push(areaObj);
        		var state = 'areaZC';
        		var stateName = '正常';
        		var fillColor = 'rgba(47,194,91,0.70)';
				var strokeFillColor = 'rgb(47,194,91)';
        		var gascountlist = item.gascountlist;
				var levelcountlist = item.levelcountlist;
				var presscountlist = item.presscountlist;
				var temcountlist = item.temcountlist;
				var videoList = item.videocounList;
				var dangerinfocountList = item.dangerinfocountList;
				// var videoList = item.videocounList;
				var allList = gascountlist.concat(levelcountlist);
				allList = allList.concat(presscountlist);
				allList = allList.concat(temcountlist);
				allList = allList.concat(videoList);
				allList = allList.concat(dangerinfocountList);
				allList.forEach(function(item){
					if (item.STATE == '3') {
						state = 'areaBJ';
						stateName = '报警';
						return false;
					} else if (item.STATE == '2') {
						state = 'areaGZ';
						stateName = '故障';
						fillColor = 'rgba(255,204,0,0.70)';
						strokeFillColor = 'rgb(255,204,0)';
					}
				});
        		item.state = state;
        		item.stateName = stateName;
        		item.fillColor = fillColor;
        		console.log(item);
				item.strokeFillColor = strokeFillColor;
				var FAwidth = $('#factory_area').width();
				var FAheight = $('#factory_area').height();
				console.log(FAheight,FAwidth);
				var areaH = FAheight * item.AREAHEIGHT/100;
				var areaW = FAwidth * item.AREAWIDTH/100;
				item.POINTS?'':item.POINTS = '0,0 0,100 100,100 100,0';
				var allPoint = [];
				item.POINTS.split(' ').forEach(function(item){
	           	 	var arr = item.split(',');
	           	 	allPoint = allPoint.concat(arr);
	            });
	            var allpoints = [];
	            allPoint.forEach(function(item){
	            allpoints.push(parseFloat(parseFloat(item).toFixed(2)));
	            })
	            console.log(allpoints);
				item.p1X = allpoints[0];
				item.p1Y = allpoints[1];
				item.p2X = allpoints[2];
				item.p2Y = allpoints[3];
				item.p3X = allpoints[4];
				item.p3Y = allpoints[5];
				item.p4X = allpoints[6];
				item.p4Y = allpoints[7];
        		areaHtml +=  _.template($('#area_template').html())(item);
        	})
        	$('#factory_area').append(areaHtml);
        	areaResize();
        }
    })
    $('#factory_area').on('contextmenu','.areaDiv',function(event){
    	event.stopPropagation();
    	var $id = $(this).data('id');
    	var $name = $(this).data('name');
    	var e = event || window.event;
    	var mouseX = e.clientX;
    	var mouseY = e.clientY;

		console.log(mouseX,mouseY);
    	$('#factory_area p').removeClass('hide').css({
    		'left':mouseX+30,
    		'top':mouseY-20
    	})
    	$('body').on('click','#factory_area p',function(){
    		$('.allArea').addClass('fade')
    		$('.singleArea').addClass('fadeOn');
    		$('.all_title').addClass('fade');
    		$('.single_title').addClass('fadeOn');
    		$('#back').addClass('fadeOn');
    		$('#singleAreaIframe').attr('src',BASE_URL + '/views/module/monitor/macprobe/pointDrag.html?id='+$id);
    		$('.single_title').html($name);
    	})
    	return false;
    })
    $('body').click(function(){
    	$('#factory_area p').addClass('hide');
    })
    $('body').contextmenu(function(){
    	$('#factory_area p').addClass('hide');
    	return false;
    })
    $('body').on('mousedown','.areaDiv',function(e){
    	var mouseStartX = e.originalEvent.x || e.originalEvent.layerX || 0;
    	var mouseStartY = e.originalEvent.y || e.originalEvent.layerY || 0;
    	var AMLeft = mouseStartX - $(this).position().left;
    	var AMTop = mouseStartY - $(this).position().top;
    	var $this = this;
    	$('body').on('mousemove',function(e){
    		var mouseX = e.originalEvent.x || e.originalEvent.layerX || 0;
    		var mouseY = e.originalEvent.y || e.originalEvent.layerY || 0;
    		$($this).css({
    			left: (mouseX - AMLeft)<0 ? 0 : (mouseX - AMLeft),
    			top: (mouseY - AMTop)<0 ? 0 : (mouseY - AMTop)
    		})
    	})
    	$('body').on('mouseup','.areaDiv',function(e){
    		$('body').off('mousemove');
    		var $id = $($this).data('id');
    		var mouseX = e.originalEvent.x || e.originalEvent.layerX || 0;
    		var mouseY = e.originalEvent.y || e.originalEvent.layerY || 0;
    		if( Math.abs(mouseX - mouseStartX) > 1 || Math.abs(mouseY - mouseStartY) > 1){
//    			var lefts = (($($this).position().left + 75)/$('#factory_area').width()*100).toFixed(4);
//	    		var tops = (($($this).position().top + 91)/$('#factory_area').height()*100).toFixed(4);
    			var lefts = (($($this).position().left)/$('#factory_area').width()*100).toFixed(4);
	    		var tops = (($($this).position().top)/$('#factory_area').height()*100).toFixed(4);

    			$.ajax({
	    			type : "post",
	    			url : BASE_URL + "/dangersource/dssrskplacearea/savearea",
//	    			url : "http://192.168.12.54:8080/ahyjyth/dangersource/dssrskplacearea/savearea",
	    			dataType : "json",
	    			data: {
	    				"placeareaid": $id,
	    				"arealeft": lefts,
	    				"areatop": tops,
	    				'areawidth': 13.0000,
	    				'areaheight': 15.0000,
	    				'points': $($this).find('polygon').data('points')
	    			},
	    			success: function(data){
	    				if(data.success==true){
	    					parent.toast(data.msg);//弹出提示信息
	    				};
	    			}
	    		});
    		}
    		$('body').off('mouseup','.areaDiv');
    	})
    })
})

function areaResize(){
	$('.placeName').each(function(){
		var left = $(this).parent().width()/2 - $(this).width()/2 - 14;
		$(this).css({
			left: left
		})
		$(this).next().css({
			left: left+$(this).width()+28
		})
		$(this).next().next().css({
			left: left
		})
	})
}

function getAreaId(arr,name){
	arr.forEach(function(item){
		if(item.name == name){
			return item.id;
		}
	});
}


