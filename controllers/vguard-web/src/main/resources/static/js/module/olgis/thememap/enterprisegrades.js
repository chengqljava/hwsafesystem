/**
 * 企业分级专题图
 */
var EnterpriseGrades=function(){
}

EnterpriseGrades.prototype={
		
		//转换数据格式
		convertData:function(datas){
			var resultData=[],barData=[],regionNames=[],gridData=[],features,regionFeatures=[];
			var regions=dataUtils.getRegionData();
			if(regions==undefined)return null;
			features=regions.features;
			var poly=utils.getRegionPolygon(regions);
			var grades=["未分级","A级","B级","C级","D级"];
			var values={"未分级":[],"A级":[],"B级":[],"C级":[],"D级":[]};
			for(var i in features){
				var feature=features[i];
				datas.every(function(item){
					if(feature.properties.name==item.AREANAME){
						var pt=ol.proj.fromLonLat(turf.centroid(feature).geometry.coordinates);
						regionFeatures.push(new ol.Feature({
							geometry:utils.coords2Polygon(feature.geometry.coordinates[0])
						}));
						var data=[];
						data.push({value:parseFloat(item.ZERONUM),name:"未分级"});
						data.push({value:parseFloat(item.ONENUM),name:"A级"});
						data.push({value:parseFloat(item.TWONUM),name:"B级"});
						data.push({value:parseFloat(item.THREENUM),name:"C级"});
						data.push({value:parseFloat(item.FOURNUM),name:"D级"});
						resultData.push({name:item.AREANAME,point:pt,values:data});
						gridData.push({
							name:item.AREANAME,
							'未分级':item.ZERONUM,
							'A级':item.ONENUM,
							'B级':item.TWONUM,
							'C级':item.THREENUM,
							'D级':item.FOURNUM
						});
						regionNames.push(item.AREANAME);
						values["未分级"].push(parseFloat(parseFloat(item.ZERONUM)));
						values["A级"].push(parseFloat(parseFloat(item.ONENUM)));
						values["B级"].push(parseFloat(parseFloat(item.TWONUM)));
						values["C级"].push(parseFloat(parseFloat(item.THREENUM)));
						values["D级"].push(parseFloat(parseFloat(item.FOURNUM)));
						
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
				name: '未分级',
				type: 'bar',
				stack: '总量',
				label: {
					normal: {
						show: true,
						position: 'insideRight'
					}
				},
				data:datas['未分级']
			},{
				name: 'A级',
				type: 'bar',
				stack: '总量',
				label: {
					normal: {
						show: true,
						position: 'insideRight'
					}
				},
				data:datas['A级']
			},
			{
				name: 'B级',
				type: 'bar',
				stack: '总量',
				label: {
					normal: {
						show: true,
						position: 'insideRight'
					}
				},
				data:datas['B级']
			},{
				name: 'C级',
				type: 'bar',
				stack: '总量',
				label: {
					normal: {
						show: true,
						position: 'insideRight'
					}
				},
				data:datas['C级']
			},{
				name: 'D级',
				type: 'bar',
				stack: '总量',
				label: {
					normal: {
						show: true,
						position: 'insideRight'
					}
				},
				data:datas['D级']
			}
			]
		}
}