/**
 * 企业分类专题图
 */
var EnterpriseClass=function(){}

EnterpriseClass.prototype={
		convertData:function(datas){
			var resultData=[],barData=[],regionNames=[],gridData=[],features,regionFeatures=[];
			var regions=dataUtils.getRegionData();
			if(regions==undefined)return null;
			features=regions.features;
			var poly=utils.getRegionPolygon(regions);
			var grades=["工业及危险化学品类","商贸及服务类","交通运输类","工程建设类"];
			var values={"工业及危险化学品类":[],"商贸及服务类":[],"交通运输类":[],"工程建设类":[]};
			for(var i in features){
				var feature=features[i];
				datas.every(function(item){
					if(feature.properties.name==item.AREANAME){
						var pt=ol.proj.fromLonLat(turf.centroid(feature).geometry.coordinates);
						regionFeatures.push(new ol.Feature({
							geometry:utils.coords2Polygon(feature.geometry.coordinates[0])
						}));
						var data=[];
						data.push({value:parseFloat(item.ONENUM),name:"工业及危险化学品类"});
						data.push({value:parseFloat(item.TWONUM),name:"商贸及服务类"});
						data.push({value:parseFloat(item.THREENUM),name:"交通运输类"});
						data.push({value:parseFloat(item.FOURNUM),name:"工程建设类"});
						resultData.push({name:item.AREANAME,point:pt,values:data});
						
						gridData.push({
							name:item.AREANAME,
							'工业及危险化学品类':item.ONENUM,
							'商贸及服务类':item.TWONUM,
							'交通运输类':item.THREENUM,
							'工程建设类':item.FOURNUM
						});
						
						regionNames.push(item.AREANAME);
						values["工业及危险化学品类"].push(parseFloat(parseFloat(item.ONENUM)));
						values["商贸及服务类"].push(parseFloat(parseFloat(item.TWONUM)));
						values["交通运输类"].push(parseFloat(parseFloat(item.THREENUM)));
						values["工程建设类"].push(parseFloat(parseFloat(item.FOURNUM)));
						
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
				name: '工业及危险化学品类',
				type: 'bar',
				stack: '总量',
				label: {
					normal: {
						show: true,
						position: 'insideRight'
					}
				},
				data:datas['工业及危险化学品类']
			},{
				name: '商贸及服务类',
				type: 'bar',
				stack: '总量',
				label: {
					normal: {
						show: true,
						position: 'insideRight'
					}
				},
				data:datas['商贸及服务类']
			},
			{
				name: '交通运输类',
				type: 'bar',
				stack: '总量',
				label: {
					normal: {
						show: true,
						position: 'insideRight'
					}
				},
				data:datas['交通运输类']
			},{
				name: '工程建设类',
				type: 'bar',
				stack: '总量',
				label: {
					normal: {
						show: true,
						position: 'insideRight'
					}
				},
				data:datas['工程建设类']
			}]
		}
}