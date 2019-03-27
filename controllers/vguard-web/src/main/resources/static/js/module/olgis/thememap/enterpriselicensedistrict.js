/**
 * 危化品企业许可分布专题图
 */
var EnterpriseLicenseDistrict=function(){}

EnterpriseLicenseDistrict.prototype={
		convertData:function(datas){
			var resultData=[],barData=[],regionNames=[],gridData=[],features,regionFeatures=[];
			var regions=dataUtils.getRegionData();
			if(regions==undefined)return null;
			features=regions.features;
			var poly=utils.getRegionPolygon(regions);
			var grades=["无需许可","生产许可","经营许可","运输许可","使用许可","废弃处置许可"];
			var values={"无需许可":[],"生产许可":[],"经营许可":[],"运输许可":[],"使用许可":[],"废弃处置许可":[]};
			for(var i in features){
				var feature=features[i];
				datas.every(function(item){
					if(feature.properties.name==item.AREANAME){
						var pt=ol.proj.fromLonLat(turf.centroid(feature).geometry.coordinates);
						regionFeatures.push(new ol.Feature({
							geometry:utils.coords2Polygon(feature.geometry.coordinates[0])
						}));
						var data=[];
						data.push({value:parseFloat(item.ZERONUM),name:"无需许可"});
						data.push({value:parseFloat(item.ONENUM),name:"生产许可"});
						data.push({value:parseFloat(item.TWONUM),name:"经营许可"});
						data.push({value:parseFloat(item.THREENUM),name:"运输许可"});
						data.push({value:parseFloat(item.FOURNUM),name:"使用许可"});
						data.push({value:parseFloat(item.FIVENUM),name:"废弃处置许可"});
						resultData.push({name:item.AREANAME,point:pt,values:data});
						gridData.push({
							name:item.AREANAME,
							'无需许可':item.ZERONUM,
							'生产许可':item.ONENUM,
							'经营许可':item.TWONUM,
							'运输许可':item.THREENUM,
							'使用许可':item.FOURNUM,
							'废弃处置许可':item.FIVENUM
						});
						regionNames.push(item.AREANAME);
						
						values["无需许可"].push(parseFloat(parseFloat(item.ZERONUM)));
						values["生产许可"].push(parseFloat(parseFloat(item.ONENUM)));
						values["经营许可"].push(parseFloat(parseFloat(item.TWONUM)));
						values["运输许可"].push(parseFloat(parseFloat(item.THREENUM)));
						values["使用许可"].push(parseFloat(parseFloat(item.FOURNUM)));
						values["废弃处置许可"].push(parseFloat(parseFloat(item.FIVENUM)));
						
						return false;
					}
					return true;
					
				});
			}
			barData.push({names:regionNames,grades:grades,values:values});
			return {mapPieData:resultData,barData:barData,gridData:gridData,polygon:poly,regionFeatures:regionFeatures};
		},
		getBarSeries:function(datas){
			return [{
				name: '无需许可',
				type: 'bar',
				stack: '总量',
				label: {
					normal: {
						show: true,
						position: 'insideRight'
					}
				},
				data:datas['无需许可']
			},{
				name: '生产许可',
				type: 'bar',
				stack: '总量',
				label: {
					normal: {
						show: true,
						position: 'insideRight'
					}
				},
				data:datas['生产许可']
			},
			{
				name: '经营许可',
				type: 'bar',
				stack: '总量',
				label: {
					normal: {
						show: true,
						position: 'insideRight'
					}
				},
				data:datas['经营许可']
			},{
				name: '运输许可',
				type: 'bar',
				stack: '总量',
				label: {
					normal: {
						show: true,
						position: 'insideRight'
					}
				},
				data:datas['运输许可']
			},
			{
				name: '使用许可',
				type: 'bar',
				stack: '总量',
				label: {
					normal: {
						show: true,
						position: 'insideRight'
					}
				},
				data:datas['使用许可']
			},{
				name: '废弃处置许可',
				type: 'bar',
				stack: '总量',
				label: {
					normal: {
						show: true,
						position: 'insideRight'
					}
				},
				data:datas['废弃处置许可']
			}]
		}
}