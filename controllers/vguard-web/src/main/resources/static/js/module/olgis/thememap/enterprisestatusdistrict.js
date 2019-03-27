/**
 * 企业填报情况分布专题图
 */
var EnterpriseStatusDistrict=function(){}

EnterpriseStatusDistrict.prototype={
		convertData:function(datas){
			var resultData=[],barData=[],regionNames=[],gridData=[],features,regionFeatures=[];
			var regions=dataUtils.getRegionData();
			if(regions==undefined)return null;
			features=regions.features;
			var poly=utils.getRegionPolygon(regions);
			var grades=["未填报","填报中","更新中","已上报"];
			var values={"未填报":[],"填报中":[],"更新中":[],"已上报":[]};
			for(var i in features){
				var feature=features[i];
				datas.every(function(item){
					if(feature.properties.name==item.AREANAME){
						var pt=ol.proj.fromLonLat(turf.centroid(feature).geometry.coordinates);
						regionFeatures.push(new ol.Feature({
							geometry:utils.coords2Polygon(feature.geometry.coordinates[0])
						}));
						var data=[];
						data.push({value:parseFloat(item.ZERONUM),name:"未填报"});
						data.push({value:parseFloat(item.ONENUM),name:"填报中"});
						data.push({value:parseFloat(item.TWONUM),name:"更新中"});
						data.push({value:parseFloat(item.THREENUM),name:"已上报"});
						resultData.push({name:item.AREANAME,point:pt,values:data});
						gridData.push({
							name:item.AREANAME,
							'未填报':item.ZERONUM,
							'填报中':item.ONENUM,
							'更新中':item.TWONUM,
							'已上报':item.THREENUM
						});
						regionNames.push(item.AREANAME);
						
						values["未填报"].push(parseFloat(parseFloat(item.ZERONUM)));
						values["填报中"].push(parseFloat(parseFloat(item.ONENUM)));
						values["更新中"].push(parseFloat(parseFloat(item.TWONUM)));
						values["已上报"].push(parseFloat(parseFloat(item.THREENUM)));
						
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
				name: '未填报',
				type: 'bar',
				stack: '总量',
				label: {
					normal: {
						show: true,
						position: 'insideRight'
					}
				},
				data:datas['未填报']
			},{
				name: '填报中',
				type: 'bar',
				stack: '总量',
				label: {
					normal: {
						show: true,
						position: 'insideRight'
					}
				},
				data:datas['填报中']
			},
			{
				name: '更新中',
				type: 'bar',
				stack: '总量',
				label: {
					normal: {
						show: true,
						position: 'insideRight'
					}
				},
				data:datas['更新中']
			},{
				name: '已上报',
				type: 'bar',
				stack: '总量',
				label: {
					normal: {
						show: true,
						position: 'insideRight'
					}
				},
				data:datas['已上报']
			}]
		},
		//地图上柱状图
		getMapBarSeries:function(datas){
			return [{
				name: '未填报',
				type: 'bar',
				data:datas['未填报']
			},{
				name: '填报中',
				type: 'bar',
				data:datas['填报中']
			},
			{
				name: '更新中',
				type: 'bar',
				data:datas['更新中']
			},{
				name: '已上报',
				type: 'bar',
				data:datas['已上报']
			}]
		}
}