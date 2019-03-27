var pointUtil = new MapUtil();
// pointUtil.put("Pwxy", 1);
pointUtil.put("Pqt", 1);
pointUtil.put("Psp", 1);
pointUtil.put("Pyl", 1);
pointUtil.put("Pyw", 1);
pointUtil.put("Pwd", 1);
var selectedPointId = '';
var searchName = '';
var pointData = [];
$(function() {
    var Jiframe = window.parent.document.getElementsByTagName('iframe')[0];
    var id = $(Jiframe).attr('src').split('=')[1];
	$(".factory_area_img").attr("src",BASE_URL+"dangersource/dssrskareaattach/downloadByPlacearea/"+id);
	
	$("body").keydown(function(e){
		if(e.keyCode == "13"){
			$("#searchDiv").trigger("click");
		}
	});

	$('.menu').on('click', '.close', function() {
		var $id = $(this).data('id');
		var $state = $(this).data('state');
		if ($state == '1') {
			$('.menu').animate({
				left : -300
			});
			$(this).find('span').html('>')
			$(this).data('state', '0');
		} else {
			$('.menu').animate({
				left : 0
			});
			$(this).find('span').html('<')
			$(this).data('state', '1');
		}
		scrollResize();
	})
	reloadMonitorList();
	$('body').on('click','#searchDiv',function(){
		searchName = $('#probeName').val();
//		selectedPointId = '';
		reloadMonitorList();
		scrollResize();
	})
	$('#factory_search_input').on( 'input', function() {
		var selectedArr = [];
		$('#seach_name').html('');
		var name = $(this).val();
		console.log(pointData,name);
		if (name == '') {
			$('#seach_name').html('');
		} else {
			pointData.forEach(function(item) {
				var entName = item.name;
				if (entName.indexOf(name) != -1) {
					selectedArr.push(item);
				}
			})
		}
		var liHtml = '';
		selectedArr.forEach(function(item) {
			liHtml += "<li data-name="+item.name+">" + item.name + "</li>"
		});
		$('#seach_name').html(liHtml);
		$('#seach_name').on('click', 'li', function() {
			var $val = $(this).data('name');
			$('#factory_search_input').val($val);
			$('#seach_name').html('');
		})
	})
	$('#factory_search_btn').click(function() {
		var $id = '';
		var $type = '';
		var iName = $(
				'#factory_search_input')
				.val();
		pointData.forEach(function(item) {
			if (item.name == iName) {
				$id = item.id;
				$type = item.type;
			}
		})
		console.log($id,$type);
		if ($id == '') {
			toast('请输入完整的点位名称！')
		} else {
//			$('.allArea').addClass('fade')
//			$('.singleArea').addClass(
//					'fadeOn');
//			$('.all_title')
//					.addClass('fade');
//			$('.single_title').addClass(
//					'fadeOn');
//			$('#back').addClass('fadeOn');
			selectedPointId = $id;
			reloadMonitorList();
			$('.menu_warning_allkind li').removeClass('active');
			$('.menu_warning_allkind li.'+$type).addClass('active');
			$('.list').removeClass('show');
			$('.' + $type + '_list').addClass('show');
		}
	})
	/**
	 * 定时刷新列表
	 */
	window.setInterval(function() {
		reloadMonitorList();
	}, 5000);

	// 左侧顶部菜单的点击事件
	$('.menu_top').on(
			'click',
			'.single_menu',
			function() {
				var $id = $(this).data('id');
				if ($(this).hasClass('active')) {
					$('.P' + $id).addClass('hide');
					pointUtil.put('P' + $id, 0);
				} else {
					$('.P' + $id).removeClass('hide');
					pointUtil.put('P' + $id, 1);
				}
				$('.list_content .tr').removeClass('active');
				$('.point').removeClass('active');
				selectedPointId = '';
				$(this).toggleClass('active');
				reloadMonitorList();
				scrollResize()
			})
	$('.menu_warning_allkind').on('click', 'li', function() {
		var $id = $(this).data('id');
		$('.menu_warning_allkind li').removeClass('active');
		$(this).addClass('active');
		$('.list').removeClass('show');
		$('.' + $id + '_list').addClass('show');
		scrollResize()
	})
	$('body').on('input','#probeName',function(){
		if($(this).val() == ''){
			$('#delDiv').addClass('hide');
		}
		else{
			$('#delDiv').removeClass('hide');
		}
		return false;
	})
	$('body').on('click','#delDiv',function(){
		$('#probeName').val('');
		selectedPointId = '';
		$("#searchDiv").trigger("click");
	})
	$('body').on('click','#monitor_points div section>span',function(){
		var type = $(this).data('type');
		if (type == 'wxy') {
			parent.openWin(BASE_URL
					+ "dangersource/dssdangerinfo/pageTab/"
					+ $(this).data('id'), $(this).data('name'),
					'75%', '75%');
		} else if (type == 'sp') {
			openWin(
					BASE_URL
							+ 'views/module/monitor/monitorpage/monitorVideo.html?videoid='
							+ $(this).data('id'), $(this).data(
							'name'), '70%', '80%');
		} else {
			openWin(
					BASE_URL
							+ 'views/module/monitor/macArea/macAreaInfo.html?id='
							+ $(this).data('id'), $(this).data(
							'name'), '80%', '90%');
		}
	})
	$('body')
			.on(
					'click',
					'#monitor_points div',
					function() {
						var $type = $(this).data('type');
						$('.menu_warning_allkind li').removeClass('active');
						$('.menu_warning_allkind li.'+$type).addClass('active');
						$('.list').removeClass('show');
						$('.' + $type + '_list').addClass('show');
						selectedPointId = $(this).data('id');
						$('#monitor_points div').removeClass('active');
						$(this).addClass('active');
						$('.list_content div.tr').removeClass('active');
						$('.list_content div.tr').each(function(index,item){
							if($(item).data('id') == selectedPointId){
								$(item).addClass('active');
								return false;
							}
						});
					})
	$('body')
			.on(
					'click',
					'.list_content div.tr',
					function() {
						selectedPointId = $(this).data('id');
						$('.list_content div.tr').removeClass('active');
						$(this).addClass('active');
						$('.point').removeClass('active');
						$('.point').each(function(index,item){
							if($(item).data('id') == selectedPointId){
								$(item).addClass('active');
								return false;
							}
						});
						/*var type = $(this).data('type');
						if (type == 'wxy') {
							parent.openWin(BASE_URL
									+ "/dangersource/dssdangerinfo/pageTab/"
									+ $(this).data('id'), $(this).data('name'),
									'75%', '75%');
						} else if (type == 'sp') {
							openWin(
									BASE_URL
											+ 'views/module/monitor/monitorpage/monitorVideo.html?videoid='
											+ $(this).data('id'), $(this).data(
											'name'), '70%', '80%');
						} else {
							openWin(
									BASE_URL
											+ 'views/module/monitor/macArea/macAreaInfo.html?id='
											+ $(this).data('id'), $(this).data(
											'name'),  '80%', '90%');
						}*/
					})
	scrollResize();
	// 渲染dom节点
	function renderDom(data, id) {
		var dom = '';
		data.forEach(function(item) {
			var rand = Math.floor(Math.random() * 10000);
			item.rand = rand;
			dom += _.template($('#' + id).html())(item);
		});
		return dom;
	}
	$('#factory_area').imgZoomAndDrog({maxi:5,mini:1,callback:function(imgRealHeight,imgRealWidth,n,placeId,placeName,id){
		if(n > 4.9 && placeId != ''){
			$('.allArea').addClass('fade')
			$('.all_title').addClass('fade');
			$('.tools').addClass('fade');
			$('#loading').addClass('fadeOn');
			setTimeout(function(){
				$('#loading').removeClass('fadeOn');
				$('.single_title').addClass('fadeOn');
				$('#back').addClass('fadeOn');
				$('.singleArea').addClass('fadeOn');
			}, 1000);
			$('#singleAreaIframe')
					.attr(
							'src',
							BASE_URL
									+ '/views/module/monitor/macArea/macAreaIndex.html?id='
									+ placeId);
			$('.single_title').html(placeName).attr('data-id',placeId).attr('data-name',placeName);
			return false;
		}
		if( n < 1.1 && id){
			$(".single_title", window.parent.document).removeClass('fadeOn');
			$("#back", window.parent.document).removeClass('fadeOn');
			$(".singleArea", window.parent.document).removeClass('fadeOn');
			$("#loading", window.parent.document).addClass('fadeOn');
			setTimeout(function(){
				$("#loading", window.parent.document).removeClass('fadeOn');
				$(".allArea", window.parent.document).removeClass('fade');
				$(".all_title", window.parent.document).removeClass('fade');
				$(".tools", window.parent.document).removeClass('fade');
			}, 1000);
			return false;
		}
	}});
})


function reloadMonitorList() {
	pointData = []
	var wxyInfo = [];
	var qtInfo = [];
	var spInfo = [];
	var ylInfo = [];
	var ywInfo = [];
	var wdInfo = [];
	var Jiframe = window.parent.document.getElementsByTagName('iframe')[0];
	var id = $(Jiframe).attr('src').split('=')[1];
	$.ajax({
		type : "get",
		url : BASE_URL + "dangersource/dssrskplacearea/getProbesOnline",
		// url:
		// "http://192.168.111.193:8080/ahyjyth/monitor/maccontroller/loaddangerresource",
		cache : false,
		data : {
			'areaid' : id,
			'probetype' : '1,2,3,4,7,8'
		},
		dataType : "JSON",
		global : false,
		success : function(res) {
			console.log(searchName,selectedPointId);
			res.data.forEach(function(item) {
				
				if(item.LEFT == null){
					item.LEFT = 50;
				}
				if(item.TOP == null){
					item.TOP = 50;
				}
				switch (item.PROBETYPE) {
					case '1':
					case '5':
					case '6':
					qtInfo.push(item);
					pointData.push({
						id:item.ID,
						name:item.DEVICENAME,
						type:'qt'
					})
					break;
				case '2':
					wdInfo.push(item);
					pointData.push({
						id:item.ID,
						name:item.DEVICENAME,
						type:'wd'
					})
					break;
				case '3':
					ylInfo.push(item);
					pointData.push({
						id:item.ID,
						name:item.DEVICENAME,
						type:'yl'
					})
					break;
				case '4':
					ywInfo.push(item);
					pointData.push({
						id:item.ID,
						name:item.DEVICENAME,
						type:'yw'
					})
					break;
				case '7':
					spInfo.push(item);
					pointData.push({
						id:item.ID,
						name:item.DEVICENAME,
						type:'sp'
					})
					break;
				case '8':
//					wxyInfo.push(item);
//					pointData.push({
//						id:item.ID,
//						name:item.DEVICENAME,
//						type:'wxy'
//					})
					break;
				default:
					break;
				}
			})
			point = '';

			wxyHtml = '';
			wxyPoint = '';
			qtHtml = '';
			spHtml = '';
			ylHtml = '';
			ywHtml = '';
			wdHtml = '';

			if (wxyInfo.length == 0) {
				wxyHtml = "";
			} else {
				wxyInfo.forEach(function(item, index) {
                    item.index = index + 1;
                    item.selected = '';
					if(item.ID == selectedPointId){
						item.selected = 'active'
					}
				    item.type='wxy';
				    item.CHROVAL = '';
				    item.level = getLevelName(item.DANGERLEVEL);
				    item.state = 'zc';
                    if (pointUtil.get("Pwxy") == 1) {
                        point += _.template($('#point_template').html())(item);
                    }
					// wxyHtml += _.template($('#wxy_template').html())(item);
				})
			}
			$('.wxy_list_content').html(wxyHtml);

			if (spInfo.length == 0) {
				spHtml = "";
			} else {
				spInfo.forEach(function(item, index) {
					item.index = index + 1;
					item.selected = '';
					if(item.ID == selectedPointId){
						item.selected = 'active'
					}
					item.type = 'sp';
					item.title = '视频';
					item.CHROVAL = '-';
					item.UNIT = '';
					item.level = getStatuName(item.STATE).level;
					item.stateName = getStatuName(item.STATE).name;
					item.state = getStatuName(item.STATE).state;
					if(searchName == ''){
						if (pointUtil.get("Psp") == 1) {
							point += _.template($('#point_template').html())(item);
							spHtml += _.template($('#probe_template').html())(item);
						}
					}
					else{
						if(item.DEVICENAME.indexOf(searchName) != -1){
							if (pointUtil.get("Psp") == 1) {
								point += _.template($('#point_template').html())(item);
								spHtml += _.template($('#probe_template').html())(item);
							}
						}
						else{
							return;
						}
					}
				})
			}

//			$('.sp_list_content').html(spHtml);

			if (qtInfo.length == 0) {
				qtHtml = "";
			} else {
				qtInfo.forEach(function(item, index) {
					item.index = index + 1;
					item.selected = '';
					if(item.ID == selectedPointId){
						item.selected = 'active'
					}
					item.stateName = getStatuName(item.STATE).name;
					item.level = getStatuName(item.STATE).level;
					item.type = 'qt';
					item.title = '气体';
					item.state = getStatuName(item.STATE).state;
					if(searchName == ''){
						if (pointUtil.get("Pqt") == 1) {
							point += _.template($('#point_template').html())(item);
							qtHtml += _.template($('#probe_template').html())(item);
						}
					}
					else{
						if(item.DEVICENAME.indexOf(searchName) != -1){
							if (pointUtil.get("Pqt") == 1) {
								point += _.template($('#point_template').html())(item);
								qtHtml += _.template($('#probe_template').html())(item);
							}
						}
						else{
							return;
						}
					}
					
				})
			}

//			$('.qt_list .probe_list_content').html(qtHtml);

			if (wdInfo.length == 0) {
				wdHtml = "";
			} else {
				wdInfo.forEach(function(item, index) {
					item.index = index + 1;
					item.selected = '';
					if(item.ID == selectedPointId){
						item.selected = 'active'
					}
					item.stateName = getStatuName(item.STATE).name;
					item.level = getStatuName(item.STATE).level;
					item.type = 'wd';
					item.title = '温度';
					item.state = getStatuName(item.STATE).state;
					if(searchName == ''){
						if (pointUtil.get("Pwd") == 1) {
							point += _.template($('#point_template').html())(item);
							wdHtml += _.template($('#probe_template').html())(item);
						}
					}
					else{
						if(item.DEVICENAME.indexOf(searchName) != -1){
							if (pointUtil.get("Pwd") == 1) {
								point += _.template($('#point_template').html())(item);
								wdHtml += _.template($('#probe_template').html())(item);
							}
						}
						else{
							return;
						}
					}
					
				})
			}

//			$('.wd_list .probe_list_content').html(wdHtml);

			if (ylInfo.length == 0) {
				ylHtml = "";
			} else {
				ylInfo.forEach(function(item, index) {
					item.index = index + 1;
					item.selected = '';
					if(item.ID == selectedPointId){
						item.selected = 'active'
					}
					item.stateName = getStatuName(item.STATE).name;
					item.level = getStatuName(item.STATE).level;
					item.type = 'yl';
					item.title = '压力';
					item.state = getStatuName(item.STATE).state;
					if(searchName == ''){
						if (pointUtil.get("Pyl") == 1) {
							point += _.template($('#point_template').html())(item);
							ylHtml += _.template($('#probe_template').html())(item);
						}
					}
					else{
						if(item.DEVICENAME.indexOf(searchName) != -1){
							if (pointUtil.get("Pyl") == 1) {
								point += _.template($('#point_template').html())(item);
								ylHtml += _.template($('#probe_template').html())(item);
							}
						}
						else{
							return;
						}
					}
					
				})
			}

//			$('.yl_list .probe_list_content').html(ylHtml);

			if (ywInfo.length == 0) {
				ywHtml = "";
			} else {
				ywInfo.forEach(function(item, index) {
					item.index = index + 1;
					item.selected = '';
					if(item.ID == selectedPointId){
						item.selected = 'active'
					}
					item.stateName = getStatuName(item.STATE).name;
					item.level = getStatuName(item.STATE).level;
					item.type = 'yw';
					item.title = '液位';
					item.state = getStatuName(item.STATE).state;
					if(searchName == ''){
						if (pointUtil.get("Pyw") == 1) {
							point += _.template($('#point_template').html())(item);
							ywHtml += _.template($('#probe_template').html())(item);
						}
					}
					else{
						if(item.DEVICENAME.indexOf(searchName) != -1){
							if (pointUtil.get("Pyw") == 1) {
								point += _.template($('#point_template').html())(item);
								ywHtml += _.template($('#probe_template').html())(item);
							}
						}
						else{
							return;
						}
					}
					
				})
			}
			$('#monitor_points').html(point);
			$('.probe_list_content').html((qtHtml+spHtml+ylHtml+ywHtml+wdHtml) == ''?"<div>暂无数据！</div>":(qtHtml+ylHtml+spHtml+ywHtml+wdHtml));
			scrollResize();
		}
	})
}

function getLevelName(num){
    var name = '';
    switch (num){
        case '0':
            name='未分级';
            break;
        case '1':
            name='一级';
            break;
        case '2':
            name='二级';
            break;
        case '3':
            name='三级';
            break;
        case '4':
            name='四级';
            break;
    }
    return name;
}

function getStatuName(num) {
	var statusName = '';
	var stateLevel = '';
	var state = '';
	switch (num) {
	case '0':
		statusName = '正常';
		stateLevel = '0';
		state = 'zc';
		break;
	case '1':
		statusName = '正常';
		stateLevel = '0';
		state = 'zc';
		break;
	case '2':
		statusName = '在线';
		stateLevel = '0';
		state = 'zc';
		break;
	case '3':
		statusName = '故障';
		stateLevel = '2';
		state = 'gz';
		break;
	case '4':
		statusName = '预警';
		stateLevel = '1';
		state = 'bj';
		break;
	case '7':
		statusName = '通讯故障';
		stateLevel = '2';
		state = 'gz';
		break;
	case '99':
		statusName = '网络故障';
		stateLevel = '2';
		state = 'gz';
		break;
	case '100':
		statusName = '满量程';
		stateLevel = '1';
		state = 'bj';
		break;
	case '101':
		statusName = '低报';
		stateLevel = '1';
		state = 'bj';
		break;
	case '102':
		statusName = '高报';
		stateLevel = '1';
		state = 'bj';
		break;
	case '103':
		statusName = '超低报';
		stateLevel = '1';
		state = 'bj';
		break;
	case '104':
		statusName = '超高报';
		stateLevel = '1';
		state = 'bj';
		break;
	default:
		statusName = '未知故障';
		stateLevel = '2';
		state = 'gz';
		break;
	}
	return {
		'name' : statusName,
		'level' : stateLevel,
		'state' : state,
	};
}
function scrollResize() {
	$('.list_content').niceScroll({
		cursorborder : "#4d86d6",
		cursorcolor : "#4d86d6",
		background : false,
		horizrailenabled : false,
		autohidemode : false
	}).show().resize();
}
function areaResize(){
}