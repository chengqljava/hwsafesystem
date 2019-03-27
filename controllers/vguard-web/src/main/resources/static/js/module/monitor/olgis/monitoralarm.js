/**
 * 监测报警
 */
MonitorAlarm = function(){
	this.dataLayer;
	var self = this;
	window.onload=function(){
		self.refreshMonitorDatas();
		clearInterval(app.timeAlarmTicket);
		app.timeAlarmTicket= setInterval(function (){
			self.refreshMonitorDatas();
		}, 5000);
		
	}
};

MonitorAlarm.prototype = {
	refreshMonitorDatas : function(){
		//app.popPanel.closeClosePopup();
		var table=$('#monitorTable')[0];
		if(table==null)return;
		$(table).empty();
		var districtcode = "" || $("#districtcode").val();
		$("#alarmCount")[0].innerHTML=monitordatas.getAlarmCount(districtcode);
		var alarmList=monitordatas.loadArarmList($("#districtcode").val());
		if(alarmList==null||alarmList.length<=0)return;
		var items=[];
		var overlays=app.map.getOverlays();
		overlays.forEach(function(overlay){
			if(overlay.get('tiled')=='tiled')
				app.map.removeOverlay(overlay);
		})
		var count=0;
		for(var i=0;i<alarmList.length;i++){
			var item=alarmList[i];
			if(items.indexOf(item.BUSINESSINFOID)>=0)continue;
			count++;
			items.push(item.BUSINESSINFOID);
			var tr=document.createElement('div');
			tr.className="tr";
			var td=document.createElement('div');
			td.className="td";
			td.innerHTML=count;
			tr.appendChild(td);
			td=document.createElement('div');
			td.className="td";
			td.innerHTML=item.ENTNAME;
			tr.appendChild(td);
			td=document.createElement('div');
			td.className="td";
			var img=document.createElement('img');
			img.style.width="21px";
			img.style.height="19px";
			if(item.STATE=="3"||item.STATE=="99"||item.STATE=="7"){
				img.src=BASE_URL+"/images/monitor/gis/bug.png";
				img.title="故障报警";
			}else if(item.STATE=="100"||item.STATE=="101"||item.STATE=="102"||item.STATE=="103"||item.STATE=="104"){
				img.src=BASE_URL+"/images/monitor/gis/mesh.png";
				img.title="监测报警";
			}
			
			td.appendChild(img);
			tr.appendChild(td);
			
			var audio;
			
			td=document.createElement('div');
			td.className="td";
			var btn=document.createElement('button');
			if(item.ISERASURE=="1"){
				btn.disabled="disabled";
			}else{
				audio=document.createElement('audio');
				audio.id="audio"+count;
				audio.controls="controls";
				audio.style.display="none";
				audio.src=BASE_URL+"/images/monitor/alarm.mp3";
				tr.appendChild(audio);
				audio.play();
			}
			//btn.innerHTML="消音";
			btn.id=count+";"+item.BUSINESSINFOID;
			btn.onclick=function(e){
				if (e.stopPropagation) {
	                e.stopPropagation();
	            } else {
	                e.cancelBubble = true;
	            }
				this.disabled="disabled";
				var params=this.id.split(';');
				$('#audio'+params[0])[0].pause();
				//audio.pause();
				monitordatas.updateErsure(params[1]);
			}
			td.appendChild(btn);
			tr.appendChild(td);
			
			td=document.createElement('div');
			td.className="td";
			td.innerHTML=item.LONGITUDE;
			td.style.display="none";
			tr.appendChild(td);
			
			td=document.createElement('div');
			td.className="td";
			td.innerHTML=item.LATITUDE;
			td.style.display="none";
			tr.tag=item;
			tr.appendChild(td);
			tr.onclick=function(){
				var data=this.tag;
				
				$(".entName").empty();
				$(".entName").append(data.ENTNAME);
				$('.wrapper').show();
				$('#mapfrm').attr("src",BASE_URL+"/olgis/gispage/addjcjkAlarm/"+data.BUSINESSINFOID);
				$('#alarminfo').attr("href",BASE_URL+"/olgis/gispage/addjcjkAlarm/"+data.BUSINESSINFOID); 
				$('#videoinfo').attr("href",BASE_URL+"/olgis/gispage/addjcjkVideoAll/"+data.BUSINESSINFOID); 
				$('#datainfo').attr("href",BASE_URL+"/olgis/gispage/addjcjkDataAll/"+data.BUSINESSINFOID); 
				//$('.area2').css('display','none');
				//$('#grid').css('display','none');
				//$('.filter').val(data.ENTNAME);
				var statistics= monitordatas.loadStateTJ(data.BUSINESSINFOID);
				if(statistics!=null){
					for(var key in statistics){
						var st=statistics[key];
						if(st.FLAG=="1")data.HISTORY=st;
						else if(st.FLAG=="2")data.CURRENT=st;
					}
				}
				$(this).addClass('trCur').siblings().removeClass('trCur');
				//dataLayer.getSource().clear();
				//dataLayer.getSource().addFeature(feature);
				app.popPanel.loadClosePopup(data);
				var coords=ol.proj.transform([parseFloat(data.LONGITUDE),parseFloat(data.LATITUDE)],'EPSG:4326','EPSG:3857');
				
				var coordsmove=ol.proj.transform([parseFloat(data.LONGITUDE)+0.22,parseFloat(data.LATITUDE)+0.1],'EPSG:4326','EPSG:3857');
			    
				app.map.getView().setCenter(coords);
			    app.map.getView().setZoom(11);
			    utils.mapPan(app.map,coordsmove);
			}
			table.appendChild(tr);

			if(item.LONGITUDE==null||item.LATITUDE==null)continue;
			var feature=new ol.Feature();
			var point=new ol.geom.Point(ol.proj.transform([parseFloat(item.LONGITUDE),parseFloat(item.LATITUDE)],'EPSG:4326','EPSG:3857'));
			feature.setGeometry(point);
	
			//var point_div = document.getElementById("css_animation");
			var point_div=document.createElement('div');
			point_div.className="css_animation";
			point_div.id=count;
			$('.map').append(point_div);
			if(point_div==null){
				point_div=document.createElement('div');
				point_div.className="css_animation";
				point_div.id=count;
				document.getElementsByTagName("body")[0].appendChild(point_div);
			}
	
			var point_overlay = new ol.Overlay({
				id:count,
				element: point_div,
				positioning: 'center-center',
				stopEvent: false
			});
			//insertFirst:false,
			point_overlay.set("tiled","tiled");
			app.map.addOverlay(point_overlay);
			point_overlay.setPosition(point.getCoordinates());
			
			if(this.dataLayer==null){
				this.dataLayer=new ol.layer.Vector({
					source:new ol.source.Vector(),
					style:new ol.style.Style({
						image : new ol.style.Icon({
							anchor : [ 0.32, 0.6 ],
							src : BASE_URL + '/images/gis/buss.png',
							size : [ 32, 29 ],
							scale : 1
						})
					})
				});
			//	this.dataLayer.setZIndex(1);
				app.map.addLayer(this.dataLayer);
				/*app.map.on('click',function(e){
				    var feature = app.map.forEachFeatureAtPixel(e.pixel, function(feature, layer) {
				    //if(layer!=dataLayer)return null;
				      return feature;
				    });
				    if(feature==null){
				    	app.popPanel.closeClosePopup();
				    	return;
				    }
				    app.popPanel.loadClosePopup(feature.getProperties());
				});*/
			}
			
			var statistics= monitordatas.loadStateTJ(tr.tag.BUSINESSINFOID);
			if(statistics!=null){
				for(var key in statistics){
					var st=statistics[key];
					if(st.FLAG=="1")tr.tag.HISTORY=st;
					else if(st.FLAG=="2")tr.tag.CURRENT=st;
				}
			}
			feature.setProperties(tr.tag);
			app.alarmDataSource = this.dataLayer.getSource();
			app.alarmDataSource.addFeature(feature);
			//dataLayer.getSource().addFeature(feature);
		}
	}


}
/*$('.popup-closeBtn').click(function(){
	if(dataLayer!=null){
		dataLayer.getSource().clear();
	}
});*/

