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
            var allpointsPercent = [];
            allPoint.forEach(function(item,index){
            	if(index%2 == 0){
            		allpoints.push(item*FAwidth/100);            		
            	}
            	else{
            		allpoints.push(item*FAheight/100);
            	}
            })
            switch ($class) {
			case 'p1':
				allpoints[0] = mouseEndX - areaDivLeft;
				allpoints[1] = mouseEndY - areaDivTop;
				$($this).css({
					left:allpoints[0]-7,
					top:allpoints[1]-7
				})
				break;
			case 'p2':
				allpoints[2] = mouseEndX - areaDivLeft;
				allpoints[3] = mouseEndY - areaDivTop;		
				$($this).css({
					left:allpoints[2]-7,
					top:allpoints[3]-7
				})
				break;
			case 'p3':
				allpoints[4] = mouseEndX - areaDivLeft;
				allpoints[5] = mouseEndY - areaDivTop;
				$($this).css({
					left:allpoints[4]-7,
					top:allpoints[5]-7
				})
				break;
			case 'p4':
				allpoints[6] = mouseEndX - areaDivLeft;
				allpoints[7] = mouseEndY - areaDivTop;
				$($this).css({
					left:allpoints[6]-7,
					top:allpoints[7]-7
				})
				break;
			default:
				break;
			}
            $thisAreaDiv.find('polygon')
            .attr('points',allpoints[0]+','+allpoints[1]+' '+allpoints[2]+','+allpoints[3]+' '+allpoints[4]+','+allpoints[5]+' '+allpoints[6]+','+allpoints[7])
            .attr('data-points',allpoints[0]/FAwidth*100+','+allpoints[1]/FAheight*100+' '+allpoints[2]/FAwidth*100+','+allpoints[3]/FAheight*100+' '+allpoints[4]/FAwidth*100+','+allpoints[5]/FAheight*100+' '+allpoints[6]/FAwidth*100+','+allpoints[7]/FAheight*100);
			return false;
		})
		$('body').on('mouseup','#factory_area',function(e){
			var parentDiv = $($this).parent('.areaDiv');
			var $id = parentDiv.data('id');
    		var mouseX = e.originalEvent.x || e.originalEvent.layerX || 0;
    		var mouseY = e.originalEvent.y || e.originalEvent.layerY || 0;
    		if( Math.abs(mouseX - mouseStartX) > 1 || Math.abs(mouseY - mouseStartY) > 1){
    			var lefts = ((parentDiv.position().left)/$('#factory_area').width()*100).toFixed(4);
	    		var tops = ((parentDiv.position().top)/$('#factory_area').height()*100).toFixed(4);

    			$.ajax({
	    			type : "post",
	    			url : BASE_URL + "/dangersource/dssrskplacearea/savearea",
	    			dataType : "json",
	    			data: {
	    				"placeareaid": $id,
	    				"arealeft": lefts,
	    				"areatop": tops,
	    				'areawidth': 13.0000,
	    				'areaheight': 15.0000,
	    				'points': $thisAreaDiv.find('polygon').attr('data-points')
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
    $.ajax({
        type: "post",
        url: BASE_URL + "/dangersource/dssrskplacearea/loadallplace",
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
				var allList = gascountlist.concat(levelcountlist);
				allList = allList.concat(presscountlist);
				allList = allList.concat(temcountlist);
				allList = allList.concat(videoList);
				allList = allList.concat(dangerinfocountList);
//				allList.forEach(function(item){
//					if (item.STATE == '3') {
//						state = 'areaBJ';
//						stateName = '报警';
//						return false;
//					} else if (item.STATE == '2') {
//						state = 'areaGZ';
//						stateName = '故障';
//						fillColor = 'rgba(255,204,0,0.70)';
//						strokeFillColor = 'rgb(255,204,0)';
//					}
//				});
        		item.state = state;
        		item.stateName = stateName;
        		item.fillColor = fillColor;
				item.strokeFillColor = strokeFillColor;
				var FAwidth = $('#factory_area').width();
				var FAheight = $('#factory_area').height();
				console.log(FAheight,FAwidth);
				var areaH = FAheight * item.AREAHEIGHT/100;
				var areaW = FAwidth * item.AREAWIDTH/100;
				item.POINTS?'':item.POINTS = '0,0 0,20 20,20 20,0';
				var allPoint = [];
				item.POINTS.split(' ').forEach(function(item){
	           	 	var arr = item.split(',');
	           	 	allPoint = allPoint.concat(arr);
	            });
	            var allpoints = [];
	            allPoint.forEach(function(item,index){
	            	if(index%2 == 0){
	            		allpoints.push(item*FAwidth/100);            		
	            	}
	            	else{
	            		allpoints.push(item*FAheight/100);
	            	}
	            })
	            console.log(item.PLACEAREANAME,allpoints);
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
    			var lefts = (($($this).position().left)/$('#factory_area').width()*100).toFixed(4);
	    		var tops = (($($this).position().top)/$('#factory_area').height()*100).toFixed(4);

    			$.ajax({
	    			type : "post",
	    			url : BASE_URL + "/dangersource/dssrskplacearea/savearea",
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
$(window).resize(function() {
	areaResize();
});
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
	var FAwidth = $('#factory_area').width();
	var FAheight = $('#factory_area').height();
	$(".areaDiv svg polygon").each(function (e) {
	   var points = $(this).data('points');
       var allPoint = []; 
       points.split(' ').forEach(function(item){
      	 var arr = item.split(',');
      	 allPoint = allPoint.concat(arr);
       });
       var allpoints = [];
       allPoint.forEach(function(item,index){
    	   if(index%2 == 0){
       			allpoints.push(item*FAwidth/100);            		
	       	}
	       	else{
	       		allpoints.push(item*FAheight/100);
	       	}
       })
       $(this).attr('points',allpoints[0]+','+allpoints[1]+' '+allpoints[2]+','+allpoints[3]+' '+allpoints[4]+','+allpoints[5]+' '+allpoints[6]+','+allpoints[7])
   });
	$('.areaDiv section').each(function(item,index){
		var $class = $(this).attr('class');
		var $this = this;
		var $thisAreaDiv = $(this).parent('.areaDiv');
		var points = $thisAreaDiv.find('polygon').attr('data-points');
        var allPoint = [];
        points.split(' ').forEach(function(item){
        	var arr = item.split(',');
        	allPoint = allPoint.concat(arr);
        });
        var allpoints = [];
        var allpointsPercent = [];
        allPoint.forEach(function(item,index){
        	if(index%2 == 0){
        		allpoints.push(item*FAwidth/100);            		
        	}
        	else{
        		allpoints.push(item*FAheight/100);
        	}
        })
        switch ($class) {
		case 'p1':
			$($this).css({
				left:allpoints[0]-7,
				top:allpoints[1]-7
			})
			break;
		case 'p2':	
			$($this).css({
				left:allpoints[2]-7,
				top:allpoints[3]-7
			})
			break;
		case 'p3':
			$($this).css({
				left:allpoints[4]-7,
				top:allpoints[5]-7
			})
			break;
		case 'p4':
			$($this).css({
				left:allpoints[6]-7,
				top:allpoints[7]-7
			})
			break;
		default:
			break;
		}
	})
}

function getAreaId(arr,name){
	arr.forEach(function(item){
		if(item.name == name){
			return item.id;
		}
	});
}


