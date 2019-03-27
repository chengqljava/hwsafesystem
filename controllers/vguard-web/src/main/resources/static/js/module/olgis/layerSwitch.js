/**
 * 底图切换
 */


var layerSwitch = {};

layerSwitch.setLayersVisibile=function(layerName) {
	layerSwitch.layerSign = layerName;
	layerSwitch.setMapView(layerName);
	var layers = app.map.getLayers();
	var params;
	var flag = false;
	layers.forEach(function(layer) {
		if (layer.get("tile") == undefined)
			return;
		params = layer.getSource().getParams();
		if (params.LAYERS == layerName) {
			layer.setVisible(true);
			flag = true;
		} else {
			layer.setVisible(false);
		}

	});
	if (!flag) {
		switch (layerName) {
		case "shMap":
			app.map.addLayer(app.mapLayer);
			app.mapLayer.setZIndex(-1);
			app.mapLayer.setVisible(true);
			app.map.setView(app.mapLayerView);
			break;
		case "shanghaiImage":
			app.map.addLayer(app.imageLayer);
			app.imageLayer.setZIndex(-2);
			app.imageLayer.setVisible(true);
			app.map.setView(app.imageLayerView);
			break;
		case "zg_google_000":
			app.map.addLayer(app.googleZG);
			app.googleZG.setZIndex(-3);
			app.googleZG.setVisible(true);
			app.map.setView(app.googleZGView);
			break;
		case "wtq_google_dx":
			app.map.addLayer(app.googleWTQ);
			app.googleWTQ.setZIndex(-4);
			app.googleWTQ.setVisible(true);
			app.map.setView(app.googleWTQView);
			break;
		case "wtq_google_yx":
			app.map.addLayer(app.googleImageWTQ);
			app.googleImageWTQ.setZIndex(-5);
			app.googleImageWTQ.setVisible(true);
			app.map.setView(app.googleImageWTQView);
			break;
		/*case "sh_google_111":
			app.map.addLayer(app.googleSH);
			app.googleSH.setZIndex(0);
			app.googleSH.setVisible(true);
			break;*/
		}
	}

}

layerSwitch.setMapView =function(layerName){
	switch (layerName) {
	case "shMap":
		//app.map.setView(app.mapLayerView);
		app.map.setView(new ol.View(mapLayerViewParams));
		break;
	case "shanghaiImage":
		//app.map.setView(app.imageLayerView);
		app.map.setView(new ol.View(imageLayerViewParams));
		break;
	case "zg_google_000":
		//app.map.setView(app.googleZGView);
		app.map.setView(new ol.View(googleZGViewParams));
		break;
	case "sh_google_111":
		//app.map.setView(app.googleSHView);
		app.map.setView(new ol.View(googleSHViewParams));
		break;
	case "wtq_google_dx":
		//app.map.setView(app.googleWTQView);
		app.map.setView(new ol.View(googleWTQViewParams));
		break;
	case "wtq_google_yx":
		//app.map.setView(app.googleImageWTQView);
		app.map.setView(new ol.View(googleImageWTQViewParams));
		break;
		
	}
}
