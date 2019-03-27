/**
 * 专题地图
 */	
dojo.require("dijit.registry");
var etTheme,entGrades,entClass,entLicenseDis,entStatusDis,regionLayer,entGather;
$(".carousel ul li a").click(function(){
	//清除地图数据
	utils.clearMapAll(app.map);
	
	//清空数据列表
	var gridWidget=new dijit.registry.byId('grid');
	if(gridWidget!=undefined)gridWidget.setStore(null);
	var text=$(".subTitle").html();
	text=text.substr(text,text.indexOf('('));
	$(".subTitle").html(text + '(' + 0 + ')');
	
	if(this.text=="企业采集时态图"){
		if(etTheme!=undefined&&etTheme.isOpen())etTheme.close();
		if(entGather!==undefined){
			entGather.destroy();
			entGather=null;
		}
		entGather=new EnterpriseGather(app.map);
	}else{
		//其他专题地图
		if(etTheme==undefined){
			etTheme=new EnterpriseTheme(app.map,echarts);
		}else{
			if(etTheme.isOpen())etTheme.close();
		}
		
		var data, mapPieData,barData,gridData,series,title;
		switch(this.text){
			case "企业分级图":
				data=EntGradeDistrictCount();
				if(entGrades==undefined)entGrades=new EnterpriseGrades();
				data=entGrades.convertData(data);
				series=entGrades.getBarSeries(data.barData[0].values);
				//地图上专题图
				etTheme.addMapPieCharts(data.mapPieData);
				title="企业分级图信息";
				break;
			case "企业分类图":
				data=EntClassDistrictCount();
				if(entClass==undefined)entClass=new EnterpriseClass();
				data=entClass.convertData(data);
				series=entClass.getBarSeries(data.barData[0].values);
				//地图上专题图
				etTheme.addMapPieCharts(data.mapPieData);
				title="企业分类图信息";
				break;
			case "企业填报情况图":
				data=EntStatusDistrictCount();
				if(entStatusDis==undefined)entStatusDis=new EnterpriseStatusDistrict();
				data=entStatusDis.convertData(data);
				series=entStatusDis.getBarSeries(data.barData[0].values);
				//地图上专题图
				etTheme.addMapBarCharts(data.mapPieData);
				title="企业填报情况图信息";
				break;
			case "危化品企业许可分布图":
				data=cheLicenceDistrictCount();
				if(entLicenseDis==undefined)entLicenseDis=new EnterpriseLicenseDistrict();
				data=entLicenseDis.convertData(data);
				series=entLicenseDis.getBarSeries(data.barData[0].values);
				//地图上专题图
				etTheme.addMapPieCharts(data.mapPieData);
				title="危化品企业许可分布图信息";
				break;
		}
		
		//弹出框数据列表数据
		etTheme.addGrid(data.mapPieData,data.gridData);
		
		//弹出框柱状图
		etTheme.addBarChart(data.barData[0],series);
		etTheme.setTitle(title);
		
		
		//显示行政区划
		if(regionLayer==undefined){
			regionLayer=new ol.layer.Vector({
				source:new ol.source.Vector()
			});
			regionLayer.getSource().addFeatures(data.regionFeatures);
			app.map.addLayer(regionLayer);
		}else{
			var source=regionLayer.getSource();
			source.clear();
			source.addFeatures(data.regionFeatures);
		}
		//utils.centerPolygon(app.map,data.polygon);
		utils.centerAndZoomPoint(app.map,[13567888.678496234,3645547.9628098924],10);
	}
})


