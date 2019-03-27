/**
 * 
 */
var measureSource = new ol.source.Vector();
var id=0;

app.measureLayer = new ol.layer.Vector({
	source : measureSource,
	style : new ol.style.Style({
		fill : new ol.style.Fill({
			color : 'rgba(253, 133, 76, 0.6)'
		}),
		stroke : new ol.style.Stroke({
			color : 'rgba(253, 133, 76, 0.6)',
			lineJoin : 'bevel',
			width : 3
		}),
		image : new ol.style.Circle({
			radius : 7,
			fill : new ol.style.Fill({
				color : '#ffcc33'
			})
		})
	})
});

var sketch;
var helpTooltipElement;
var helpTooltip;
var measureTooltipElement;
var measureTooltip;
var pointerMoveHandler = function(evt) {
	if (evt.dragging) {
		return;
	}
	if (measureType != undefined&&app.isMeasuring) {
		var helpMsg = '单击确定起点';
		if (sketch) {
			var geom = (sketch.getGeometry());
			if (geom instanceof ol.geom.Polygon) {
				if(geom.getCoordinates().toString().split(',').length<6){
					helpMsg='继续单击确定地点';
				}else{
					helpMsg='单击确定地点，双击结束';
				}
				
			} else if (geom instanceof ol.geom.LineString) {
				helpMsg = '单击确定地点，双击结束';
			}
		}
		helpTooltipElement.innerHTML = helpMsg;
		helpTooltip.setPosition(evt.coordinate);

		$(helpTooltipElement).removeClass('hidden');
	}

};
app.map.addLayer(app.measureLayer);
app.map.on('pointermove', pointerMoveHandler);

$(app.map.getViewport()).on('mouseout', function() {
	$(helpTooltipElement).addClass('hidden');
});

var draw;
var projection;
var wgs84Sphere = new ol.Sphere(6378137);
var formatLength = function(line) {
	var length;
	if (projection == "EPSG:4326") {
		var coordinates = line.getCoordinates();
		length = 0;
		for (var i = 0, ii = coordinates.length - 1; i < ii; ++i) {
			var c1 = coordinates[i];
			var c2 = coordinates[i + 1];
			length += wgs84Sphere.haversineDistance(c1, c2);
		}
	} else {
		length = Math.round(line.getLength() * 100) / 100;
	}
	var output;
	if (length > 100) {
		output = (Math.round(length / 1000 * 100) / 100) + ' ' + 'km';
	} else {
		output = (Math.round(length * 100) / 100) + ' ' + 'm';
	}
	return output;
};

var formatArea = function(polygon) {
	var area;
	if (projection == "EPSG:4326") {
		var geom = /** @type {ol.geom.Polygon} */
		(polygon);

		var coordinates = geom.getLinearRing(0).getCoordinates();
		area = Math.abs(wgs84Sphere.geodesicArea(coordinates));
	} else {
		area = polygon.getArea();
	}
	var output;
	if (area > 10000) {
		output = (Math.round(area / 1000000 * 100) / 100) + ' '
				+ 'km<sup>2</sup>';
	} else {
		output = (Math.round(area * 100) / 100) + ' ' + 'm<sup>2</sup>';
	}
	return output;
};
var measureType;
var anchorPoint;
function addInteraction() {
	// if(measureType==undefined)return;
	var type = (measureType == 'area' ? 'Polygon' : 'LineString');
	draw = new ol.interaction.Draw({
		source : measureSource,
		type : /** @type {ol.geom.GeometryType} */
		(type),
		style : new ol.style.Style({
			fill : new ol.style.Fill({
				color : 'rgba(253, 133, 76, 0.5)'
			}),
			stroke : new ol.style.Stroke({
				color : 'rgba(253, 133, 76, 0.5)',
				// lineDash : [ 10, 10 ],
				width : 3
			}),
			image : new ol.style.Circle({
				radius : 5,
				stroke : new ol.style.Stroke({
					color : 'rgba(0, 0, 0, 0.7)'
				}),
				fill : new ol.style.Fill({
					color : 'rgba(255, 255, 0, 0.3)'
				})
			})
		})
	});
	app.map.addInteraction(draw);
	
	var listener;
	draw.on('drawstart', function(evt) {
		sketch = evt.feature;
		sketch.setId(id);
		
		var tooltipCoord = evt.coordinate;
		listener = sketch.getGeometry().on('change', function(evt) {
			var geom = evt.target;
			var output;
			if (geom instanceof ol.geom.Polygon) {
				output = formatArea(geom);
				tooltipCoord = geom.getInteriorPoint().getCoordinates();
			} else if (geom instanceof ol.geom.LineString) {
				output = formatLength(geom);
				tooltipCoord = geom.getLastCoordinate();
			}
			measureTooltipElement.innerHTML = output;
			measureTooltip.setPosition(tooltipCoord);
			anchorPoint=tooltipCoord;
		});
	}, this);

	draw.on('drawend', function(evt) {
		if(helpTooltip!=undefined){
			app.map.removeOverlay(helpTooltip);
			helpTooltip=null;
		}
		if(helpTooltipElement!=undefined){
			helpTooltipElement.blur();
			helpTooltipElement=null;
		}
		
		measureTooltipElement.className = 'tooltip-msg tooltip-static';
		measureTooltip.setOffset([ 0, -7 ]);
		app.map.removeInteraction(draw);
		draw=null;
		//app.map.removeOverlay(measureTooltip);
		sketch = null;
		measureTooltipElement = null;
		measureType=null;
		//createMeasureTooltip();
		ol.Observable.unByKey(listener);
		if(draw==null&&app.isMeasuring==true){
			app.isMeasuring=false;
			var imgDiv=document.createElement('img');
			imgDiv.src=BASE_URL+ '/images/gis/close.png';
			$(imgDiv).css('width','16px');
			$(imgDiv).css('height','16px');
			$(imgDiv).css('background','red');
			$(imgDiv).css('opacity','0.5');
			$(imgDiv).css('cursor','pointer');
			imgDiv.id=id;
			imgDiv.title="清除测量结果";
			var closeOverlyer=new ol.Overlay({
				element : imgDiv,
				offset : [ 0, -30 ],
				positioning : 'bottom-center'
			});
			closeOverlyer.set('id',id);
			id++;
			closeOverlyer.setPosition(anchorPoint);
			app.map.addOverlay(closeOverlyer);
			$(imgDiv).click(function(){
				
				app.map.removeOverlay(app.map.getOverlayById(imgDiv.id));
				$("#"+imgDiv.id).remove();
				app.map.removeOverlay(closeOverlyer);
				var feature=measureSource.getFeatureById(imgDiv.id);
				measureSource.removeFeature(feature);
			});
		}
	}, this);
}

function createHelpTooltip() {
	if (helpTooltipElement) {
		helpTooltipElement.parentNode.removeChild(helpTooltipElement);
	}
	helpTooltipElement = document.createElement('div');
	helpTooltipElement.className = 'tooltip-msg hidden';
	helpTooltip = new ol.Overlay({
		element : helpTooltipElement,
		offset : [ 15, 0 ],
		positioning : 'center-left'
	});
	
	app.map.addOverlay(helpTooltip);
}

function createMeasureTooltip() {
	/*if (measureTooltipElement) {
		measureTooltipElement.parentNode.removeChild(measureTooltipElement);
	}*/
	
	measureTooltipElement = document.createElement('div');
	measureTooltipElement.className = 'tooltip-msg tooltip-measure';
	measureTooltipElement.id=id;
	measureTooltip = new ol.Overlay({
		id:id,
		element : measureTooltipElement,
		offset : [ 0, -15 ],
		positioning : 'bottom-center'
	});
	//measureTooltip.set('id',id);
	app.map.addOverlay(measureTooltip);
}


function measure(typeValue) {
	//destroy();
	measureType = typeValue;
	app.map.removeInteraction(draw);
	createMeasureTooltip();
	createHelpTooltip();
	app.isMeasuring=true;
	projection = app.map.getView().getProjection().getCode();
	addInteraction();
}

//销毁
function destroy(){
	if(helpTooltip!=undefined){
		app.map.removeOverlay(helpTooltip);
		helpTooltip=null;
	}
	if(helpTooltipElement!=undefined){
		helpTooltipElement.blur();
		helpTooltipElement=null;
	}
	
	if(measureTooltip!=undefined){
		app.map.removeOverlay(measureTooltip);
		measureTooltip=null;
	}
	if(measureTooltipElement!=undefined){
		helpTooltipElement.blur();
		measureTooltipElement=null;
	}
}