/**
 * 地理定位
 */
var MapLocate={
		create:function(map,x,y){
			//var self=this;
			_x=x;
			_y=y;
			var maplocate={};
			
			//要素集合
			var features=new ol.Collection();
			
			//样式
			var styles={
			    'feature':new ol.style.Style({
					image:new ol.style.Icon({
						anchor : [ 0.32, 1],
						src : BASE_URL + '/images/gis/buss.png',
						size : [ 32, 29 ],
						scale : 1
					})
				}),
				'select':new ol.style.Style({
					image : new ol.style.Circle({
						radius : 0,
						fill : new ol.style.Fill({
							color : 'white'
						})
					})
				})
			};
			
			//定位要素
			var locateSource=new ol.source.Vector();
			
			//定位图层
			var locateLayer=new ol.layer.Vector({
				source:new ol.source.Vector({
					features:features
				}),
				style:styles['feature']
			}) ;
			locateLayer.setMap(map);
			
			var draw;
			
			
			//新增要素
		/*	if((x==undefined||y==undefined)||(x==""||y=="")){
				addInteracton();
				//绘制结束
				draw.on('drawend', function(evt) {
					var feature=evt.feature;
					if(feature==undefined||feature.getGeometry()==undefined)return;
					map.removeInteraction(draw);
					draw=null;
				}, this);
			}else{*/
				var feature=new ol.Feature();
				feature.setGeometry(new ol.geom.Point([x,y]));
				features.push(feature);
			//}
			
			//添加绘制功能
/*			function addInteracton(){
				draw=new ol.interaction.Draw({
					features:features,
					type:'Point',
					style:styles['feature']
				});
				map.addInteraction(draw);
			}*/
			
			//修改要素
			var modify=new ol.interaction.Modify({
				features:features,
				pixelTolerance:20,
				style:styles['select']
			});
			
			map.on('pointermove',function(evt){
		        var pixel = map.getEventPixel(evt.originalEvent);
		        var hit = map.forEachFeatureAtPixel(pixel, function(feature, layer) {
		            if (feature !=undefined) {
		                return true;
		            }
		            return false;
		        },this,function(layer){
		        	if(layer==locateLayer)return true;
		        	return false;
		        });
		        if (hit) {
		            map.getViewport().style.cursor = 'pointer';
		        } else {
		            map.getViewport().style.cursor = 'default';
		        }
		        
			});
			
			var dragtipEle=$('.big_map_bottom_drag');
			var savetipEle=$('.big_map_bottom');
			if(type=='add'){
				dragtipEle.hide();
				savetipEle.show();
			}else{
				$('.big_map_bottom_button_white').html('回原位置');
				dragtipEle.show();
				savetipEle.hide();
			}
			
			
			//监听修改开始事件
			modify.on('modifystart',function(evt){
				dragtipEle.show();
				savetipEle.hide();
			})
			
			modify.on('modifyend',function(evt){
				dragtipEle.hide();
				$('.big_map_bottom_button_white').html('回原位置');
				if(type=='add'){
					$('.big_map_bottom_button_white').hide();
					
				}else{
					$('.big_map_bottom_button_white').show();
				}
				savetipEle.show();
			})
			
			//添加修改功能
			map.addInteraction(modify);
			
			//获得坐标信息
			maplocate.getCoordinates=function(){
				if(features.getLength()<1)return null;
				return features.getArray()[0].getGeometry().getCoordinates();
			}
			
			//回原位
			maplocate.reset=function(){
				features.pop();
				var feature=new ol.Feature();
				feature.setGeometry(new ol.geom.Point([_x,_y]));
				features.push(feature);
			}
			
			//保存
			maplocate.save=function(){
				if(features.getLength()<1)return null;
				var coordinates=features.getArray()[0].getGeometry().getCoordinates();
				_x=coordinates[0];
				_y=coordinates[1];
				return ol.proj.transform([parseFloat(_x),parseFloat(_y)],'EPSG:3857','EPSG:4326');
			}
			
			return maplocate;
		}
};