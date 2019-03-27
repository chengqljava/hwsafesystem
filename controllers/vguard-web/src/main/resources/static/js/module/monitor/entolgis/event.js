/**
 * 
 */
$(document).ready(function() {
	//初始化加载企业数据与报警数据
	var datas=monitordatas.getEnterprises('',$("#districtcode").val(),$("#businessinfoid").val());
	if(datas == undefined || datas.length <= 0)return;
		app.dataToMap = new DataToMap(datas);
		var dataLayer = app.dataToMap.getDataLayer();
		app.monitorAlarm = new MonitorAlarm(datas);
		app.monitorAlarm.refreshMonitorDatas();
	
	
	app.map.on('click',function(e){
		 var feature = app.map.forEachFeatureAtPixel(e.pixel, function(feature, layer) {
			 if(layer!=dataLayer)return null;
			 return feature;
	    });
	    if(feature==null){
	    	//app.popPanel.closeClosePopup();
	    	return;
	    }
	    var properties=feature.getProperties();
	    var statistics= monitordatas.loadStateTJ(properties.BUSINESSINFOID);
		if(statistics!=null){
			for(var key in statistics){
				var st=statistics[key];
				if(st.FLAG=="1")properties.HISTORY=st;
				else if(st.FLAG=="2")properties.CURRENT=st;
			}
		}
		feature.setProperties(properties);
		app.popPanel.loadClosePopup(properties);
	})
	
	
	app.map.on('pointermove',function(e){
	    var feature = app.map.forEachFeatureAtPixel(e.pixel, function(feature, layer) {
	    	if(layer!=dataLayer)return null;
	    	return feature;
	    });
	    if(feature==null){
	    	app.popPanel.hidePopup();
	    	return;
	    }
	    app.popPanel.showPopup(feature.getProperties());
	});
	
/*	$('.searchBtn').click(function(){
		
		var searchResult=new SearchResult();
		
		searchResult.search($('.filter').val(),$("#districtcode").val());
		$('.area2').css('display','block');
		$('#grid').css('display','block');
	})*/

	//添加弹出框
	app.popPanel=new popupPanel();
	app.popPanel.init();
	var pop=popPanel.getPopup();
	var closepop=popPanel.getClosePopup();
	app.map.addOverlay(pop);
	app.map.addOverlay(closepop);

})





