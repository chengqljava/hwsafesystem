/**
 * 
 */
var ClusterLayer={
		create:function(options){
			var vectorLayer;
			
			var field=options.name||"ENTNAME";
			var features=options.features||[];
			var distance=options.distance||40;
			var imgsrc=options.imgsrc;
			var map=options.map;
			var datas=options.datas;
			var popPanel=options.popPanel;
			
			//初始化数据列表
			var datatree=new DataTree({
				map:map,
				datas:datas,
				popPanel:popPanel
			});
			features=datatree.getFeatures();
			
			var fillStyle = new ol.style.Fill({
				// color: 'rgba(255, 153, 0, 0.8)'
				color : 'rgba(59,143,196,0.8)'
			});
			var strokeStyle = new ol.style.Stroke({
				color : 'rgba(255, 204, 0, 0.2)',
				width : 1
			});
			var textFill = new ol.style.Fill({
				color : '#fff'
			});
			var textStroke = new ol.style.Stroke({
				color : 'rgba(0, 0, 0, 0.6)',
				width : 3
			});
			var invisibleFill = new ol.style.Fill({
				color : 'rgba(255, 255, 255, 0.01)'
			});
			
			function createStyle(feature){
				var name=feature.get(field);
				var magnitude = parseFloat(name.substr(2));
				var radius = 5 + 20 * (magnitude - 5);
				return new ol.style.Style({
					geometry : feature.getGeometry(),
					image: new ol.style.Icon({
			            anchor: [0.35, 0.7],
			            src: imgsrc,
			            size:[24, 23],
			            scale:1
			        })
				});
			}
			
			var maxFeatureCount;
			function calculateClusterInfo(resolution) {
				maxFeatureCount = 0;
				var feats = vectorLayer.getSource().getFeatures();
				var feature, radius;
				for (var i = feats.length - 1; i >= 0; --i) {
					feature = feats[i];
					var originalFeatures = feature.get('features');
					var extent = ol.extent.createEmpty();
					var j, jj;
					for (j = 0, jj = originalFeatures.length; j < jj; ++j) {
						ol.extent.extend(extent, originalFeatures[j].getGeometry()
								.getExtent());
					}
					maxFeatureCount = Math.max(maxFeatureCount, jj);
					radius = 0.5
							* (ol.extent.getWidth(extent) + ol.extent.getHeight(extent))
							/ resolution;
					feature.set('radius', radius);
				}
			}

			var currentResolution;
			function styleFunction(feature, resolution) {
				if (resolution != currentResolution) {
					calculateClusterInfo(resolution);
					currentResolution = resolution;
				}
				var styles = [];
				var size = feature.get('features').length;
				var label = size.toString();
				var radius = (label.length+3) * 6;
				// var radius=feature.get('radius');
				if (size > 1) {
					styles = [ new ol.style.Style({
						image : new ol.style.Circle({
							radius : radius * 0.9, // feature.get('radius'),
							fill : new ol.style.Fill({
								// color: [255, 153, 0, Math.min(0.8, 0.4 + (size /
								// maxFeatureCount))]
								color : [ 59, 143, 196, 0.4 ]
							})
						}),
						text : new ol.style.Text({
							text : label,
							fill : textFill,
							stroke : textStroke
						// offsetY:-4,
						// offsetX:1
						})
					}), new ol.style.Style({
						image : new ol.style.Circle({
							radius : radius * 0.6, // feature.get('radius')+7,
							fill : new ol.style.Fill({
								color : [ 59, 143, 196, 0.8 ]
							})
						})
					}) ];
				} else {
					var originalFeature = feature.get('features')[0];
					var style = createStyle(originalFeature);
					styles.push(style);
				}
				return styles;
			}

			function selectStyleFunction(feature) {
				var styles = [ new ol.style.Style({
					image : new ol.style.Circle({
						radius : feature.get('radius'),
						fill : invisibleFill
					})
				}) ];
				var originalFeatures = feature.get('features');
				var originalFeature;
				for (var i = originalFeatures.length - 1; i >= 0; --i) {
					originalFeature = originalFeatures[i];
					styles.push(createStyle(originalFeature));
				}
				return styles;
			}

			vectorLayer = new ol.layer.Vector({
				source : new ol.source.Cluster({
					distance : distance, // 40,
					source : new ol.source.Vector({
						features:features
					})
				}),
				style : styleFunction
			});
			
			var styleutils=new styleUtils();
			var selectStyle=styleutils.getSelectStyle();
			
			//鼠标移动事件
			var selectPointerMove = new ol.interaction.Select({
				condition : ol.events.condition.pointerMove,
				style : selectStyle,
				filter : function(feature, layer) {
					return (layer === vectorLayer && feature.get('features').length == 1);
				}
			});

			map.addInteraction(selectPointerMove);
			selectPointerMove.on('select', function(evt) {
				selectPointerMoveFun(evt)
			});
			
			function selectPointerMoveFun(evt) {
				var feature = evt.selected[0];
				if (feature != undefined) {
					popPanel.showPopup(feature.get('features')[0].getProperties());
				} else {
					popPanel.hidePopup();
				}
			}

			/*
			 * 鼠标单击地图
			 * */
			var selectClick = new ol.interaction.Select({
				condition : ol.events.condition.click,
				style : selectStyle,
				filter : function(feature, layer) {
					return (layer === vectorLayer && feature.get('features').length == 1);
				}
			});
			map.addInteraction(selectClick);
			selectClick.on('select', function(evt) {
				selectClickFun(evt)
			});

			function selectClickFun(evt) {
				var feature = evt.selected[0];
				if (feature != undefined) {
					popPanel.loadClosePopup(feature.get('features')[0].getProperties());
				}
			}

			//释放资源
			vectorLayer.destroy=function(){
				features=null;
				map.removeInteraction(selectClick);
				map.removeInteraction(selectPointerMove);
				selectClick=null;
				selectPointerMove=null;
				//datatree.destroy();
				datatree=null;
				map.removeLayer(vectorLayer);
			}
			
			vectorLayer.getFeaturesCount=function(){
				if(features==undefined||features<=0)return 0;
				return features.length;
			}
			
			//清除选择的要素
			vectorLayer.clearSelection=function(){
				if(selectClick==undefined)return;
				selectClick.getFeatures().clear();
			}
			
			//移除鼠标事件
			vectorLayer.removeInteraction=function(){
				map.removeInteraction(selectClick);
				map.removeInteraction(selectPointerMove);
				selectPointerMove=null;
				selectClick=null;
			}
			
			return vectorLayer;
		}
};

