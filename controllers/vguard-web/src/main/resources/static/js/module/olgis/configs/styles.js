/**
 * 常用符号样式工具类
 */

var styleUtils=function(url){
	var self=this;
	this._url=url||BASE_URL;
	
	/*
	 * 重大危险源符号
	 * */
	self.getZdwxyStyle=function(){
		return new ol.style.Style({
			image : new ol.style.Icon({
				anchor : [ 0.35, 0.7 ],
				src : self._url + '/images/gis/dtpt/zdwxy.png',
				size : [ 32, 29 ],
				scale : 1
			})
		});
	};
	
	/*
	 * 危险化学品符号
	 * */
	self.getWhqyStyle=function(){
		return new ol.style.Style({
			image : new ol.style.Icon({
				anchor : [ 0.35, 0.7 ],
				src : self._url + '/images/gis/dtpt/whqy.png',
				size : [ 32, 29 ],
				scale : 1
			})
		});
	};
	
	/*
	 * 应急机构符号
	 * */
	self.getYjjgStyle=function(){
		return new ol.style.Style({
			image : new ol.style.Icon({
				anchor : [ 0.32, 0.6 ],
				src : self._url + '/images/gis/dtpt/yjjg.png',
				size : [ 32, 29 ],
				scale : 1
			})
		});
	};
	/*
	 * 应急ck符号
	 * */
	self.getYjckStyle=function(){
		return new ol.style.Style({
			image : new ol.style.Icon({
				anchor : [ 0.32, 0.6 ],
				src : self._url + '/images/gis/dtpt/yjck.png',
				size : [ 32, 29 ],
				scale : 1
			})
		});
	};
	/*
	 * 应急team符号
	 * */
	self.getYjdwStyle=function(){
		return new ol.style.Style({
			image : new ol.style.Icon({
				anchor : [ 0.32, 0.6 ],
				src : self._url + '/images/gis/dtpt/yjdw.png',
				size : [ 32, 29 ],
				scale : 1
			})
		});
	};
	/*
	 * 应急物资符号
	 * */
	self.getYjwzStyle=function(){
		return new ol.style.Style({
			image : new ol.style.Icon({
				anchor : [ 0.32, 0.6 ],
				src : self._url + '/images/gis/dtpt/yjwz.png',
				size : [ 32, 29 ],
				scale : 1
			})
		});
	};
	
	/*
	 * 隐患分布符号
	 * */
	self.getYhfbStyle=function(){
		return new ol.style.Style({
			image : new ol.style.Icon({
				anchor : [ 0.32, 0.6 ],
				src : self._url + '/images/gis/dtpt/yhfb.png',
				size : [ 32, 29 ],
				scale : 1
			})
		});
	};
	/*
	 * 其他正常企业符号
	 * */
	self.getZcqyStyle=function(){
		return new ol.style.Style({
			image : new ol.style.Icon({
				anchor : [ 0.32, 0.6 ],
				src : self._url + '/images/gis/dtpt/zcqy.png',
				size : [ 32, 29 ],
				scale : 1
			})
		});
	};
	/*
	 * 重大危险源危化企业选中符号
	 * */
	self.getSelectStyle=function(){
		return new ol.style.Style({
			image : new ol.style.Icon({
				anchor : [ 0.32, 0.6 ],
				src : self._url + '/images/gis/dtpt/buss.png',
				size : [ 38, 33 ],
				scale : 1
			})
		});
	};
	
	/*
	 * 地区区域符号
	 * */
	self.getAreaStyle=function(){
		return new ol.style.Style({
			fill : new ol.style.Fill({
				color : 'rgba(253, 133, 76, 0.1)'
			}),
			stroke : new ol.style.Stroke({
				color : 'rgba(253, 133, 76, 0.6)',
				width : 3

			})

		});
	};
	
}
