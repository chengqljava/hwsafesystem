/*
 * 功能
 * 
 * */

//初始化时加载下拉框内容
$(document).ready(function() {
//	app.map.once('postrender',function(){
		//区域编码
		//var distCode="310100";
		//操作功能名称
		//var operateText="重大危险源";
		var operateText="所有企业";
		//初始化范围
		var initExtent;
		//所有企业图层
//		var allListLayer;
		//重大危险源图层
//		var zdwxyLayer;
		//危化企业图层
//		var whqyLayer;	
		//应急资源图层
//		var yjzyLayer;
		//应急机构图层
//		var yjjgLayer;
		//应急仓库图层
//		var yjckLayer;
		//应急队伍图层
//		var yjdwLayer;
		//应急物资图层
//		var yjwzLayer;
		//安全隐患图层
//		var yhfbLayer;
		//数据展示面板
		var dataPanel;
		//执行查询的图层的标志
		var flag='syqy';
		
		
		//初始化加载企业
		(function initGridData(){
			//var datas = businessByDanger("1");
			//var datas = businessAllList();
			dataPanel = new DataPanel();
			
			/*if(zdwxyLayer==undefined){
				zdwxyLayer=new EnterpriseVectorLayer({
					map:app.map,
					type:operateText
				});
			}*/
			
//			if(allListLayer==undefined){
//				allListLayer=new EnterpriseVectorLayer({
//					map:app.map,
//					type:operateText
//				});
//				allListLayer.addInteraction();
//			}
			
			
			$('.subnav').css('display','none');
			/*var num=0;
			num=zdwxyLayer.getFeaturesCount();
			$(".subTitle").html('重大危险源' + '(' + num + ')');*/
			/*initExtent=polygon.getExtent();*/
		})();

		/*
		 * 初始位置
		 * */
//		$("#initExtent").click(function() {
//			if(layerSwitch.layerSign == undefined ){
//				app.map.setView(new ol.View(app.googleWTQViewParams));
//			}else{
//				layerSwitch.setMapView(layerSwitch.layerSign);
//			}
//			/*if (app.app.measureLayer != undefined) {
//				app.map.removeLayer(app.app.measureLayer);
//			}*/
//		});
		
		 /*
		  * 鹰眼
		  * */
//		$("#ovMap").click(function() {
//			app.ovMap.setCollapsed(!app.ovMap.getCollapsed());
//		});

		/*底图切换*/
//		$(".bubbleContent ul li a").click(function() {
//			var id = $(this).attr('id');
//			layerSwitch.setLayersVisibile(id);
//		});
		
		/*关闭弹出框*/
		$(".popup-closeBtn").click(function() {
			clearSelection();
		})
		
		/*
		 * 一级目录功能
		 * */
		$('.gn-menu').children('li').children('a').slice(0).click(function() {
			clearSource();
			$('.subnav2').css('display','none');
			$('.subnav').css('display','block');
			$("#inputSearch").val('');
			var text = $(this).text();
			operateText=text;
			var num=0;
			var extent;
			switch (text) {
				case "所有企业":
//					if(allListLayer!=undefined){
//						allListLayer.addInteraction();
//						/*if(flag!='zdwxy'){
//							zdwxyLayer.addInteraction();
//						}*/
//						allListLayer.setData(text);
//					}else{
//						allListLayer=new EnterpriseVectorLayer({
//							map:app.map,
//							type:operateText
//						});
//					}
//					num=allListLayer.getFeaturesCount();
//					extent=allListLayer.getExtent();
					flag='syqy';
					break;
				case "重大危险源":
//					if(zdwxyLayer!=undefined){
//						zdwxyLayer.addInteraction();
//						/*if(flag!='zdwxy'){
//							zdwxyLayer.addInteraction();
//						}*/
//						zdwxyLayer.setData(text);
//					}else{
//						zdwxyLayer=new EnterpriseVectorLayer({
//							map:app.map,
//							type:operateText
//						});
//					}
//					num=zdwxyLayer.getFeaturesCount();
//					extent=zdwxyLayer.getExtent();
					flag='zdwxy';
					break;
				case "危化企业":
//					if(whqyLayer!=undefined){
//						whqyLayer.addInteraction();
//						/*if(flag!='whqy'){
//							whqyLayer.addInteraction();
//						}*/
//						whqyLayer.setData(text);
//					}else{
//						whqyLayer=new EnterpriseVectorLayer({
//							map:app.map,
//							type:operateText
//						});
//					}
//					num=whqyLayer.getFeaturesCount();
//					extent=whqyLayer.getExtent();
					flag='whqy';
					break;
				case "安全隐患":
					flag='aqyh';
					break;
				case "应急资源":
					flag='yjzy';
					break;
			}
			
			//图层中没有要素，获得不到范围
//			if(isFinite(extent[0])){
//				
//				app.map.getView().fit(extent, app.map.getSize());
//				app.map.getView().setZoom(12);
//			}
			$(".subTitle").html(text + '(<span style="color:red;">' + num + '</span>)');
		});

		/*
		 * 二级功能菜单
		 * */ 
		$(".gn-submenu li a").click(function() {
			$('.subnav2').css('display','none');
			$('.subnav').css('display','block');
			clearSource();
			$("#inputSearch").val('');
			var text = $(this).text();
			operateText=text;
			var num=0;
			switch (text) {
				case "危险化学品":
				case "燃气类":
				case "港口":
//					if(zdwxyLayer!=undefined){
//						zdwxyLayer.addInteraction();
//						/*if(flag!='zdwxy'){
//							zdwxyLayer.addInteraction();
//						}*/
//						zdwxyLayer.setData(text);
//					}else{
//						zdwxyLayer=new EnterpriseVectorLayer({
//							map:app.map,
//							type:operateText
//						});
//					}
//					num=zdwxyLayer.getFeaturesCount();
//					extent=zdwxyLayer.getExtent();
					flag='zdwxy';
					break;
				case "生产":
				case "经营":
				case "运输":
				case "使用":
				case "废弃物处置":
				case "无需许可":
//					if(whqyLayer!=undefined){
//						whqyLayer.addInteraction();
//						/*if(flag!='whqy'){
//							whqyLayer.addInteraction();
//						}*/
//						whqyLayer.setData(text);
//					}else{
//						whqyLayer=new EnterpriseVectorLayer({
//							map:app.map,
//							type:operateText
//						});
//					}
//					num=whqyLayer.getFeaturesCount();
//					extent=whqyLayer.getExtent();
					flag='whqy';
					break;
				case "应急机构":
//					if(yjjgLayer != undefined){
//						if(flag != 'yjjg'){
//							yjjgLayer.addInteraction();
//						}
//						yjjgLayer.setData(text);
//					}else{
//						yjjgLayer = new EnterpriseVectorLayer({
//							map:app.map,
//							type:operateText
//						});
//					}
//					num=yjjgLayer.getFeaturesCount();
//					extent=yjjgLayer.getExtent();
					flag='yjjg';
					break;
				case "应急仓库":
//					if(yjckLayer != undefined){
//						if(flag != 'yjck'){
//							yjckLayer.addInteraction();
//						}
//						yjckLayer.setData(text);
//					}else{
//						yjckLayer = new EnterpriseVectorLayer({
//							map:app.map,
//							type:operateText
//						});
//					}
//					num=yjckLayer.getFeaturesCount();
//					extent=yjckLayer.getExtent();
					flag='yjck';
					break;
				case "应急队伍":
//					if(yjdwLayer != undefined){
//						if(flag != 'yjdw'){
//							yjdwLayer.addInteraction();
//						}
//						yjdwLayer.setData(text);
//					}else{
//						yjdwLayer = new EnterpriseVectorLayer({
//							map:app.map,
//							type:operateText
//						});
//					}
//					num=yjdwLayer.getFeaturesCount();
//					extent=yjdwLayer.getExtent();
					flag='yjdw';
					break;
				case "应急物资":
//					if(yjwzLayer != undefined){
//						if(flag != 'yjwz'){
//							yjwzLayer.addInteraction();
//						}
//						yjwzLayer.setData(text);
//					}else{
//						yjwzLayer = new EnterpriseVectorLayer({
//							map:app.map,
//							type:operateText
//						});
//					}
//					num=yjwzLayer.getFeaturesCount();
//					extent=yjwzLayer.getExtent();
					flag='yjwz';
					break;
				case "隐患分布":
//					if(yhfbLayer != undefined){
//						if(flag != 'yhfb'){
//							yhfbLayer.addInteraction();
//						}
//						yhfbLayer.setData(text);
//					}else{
//						yhfbLayer = new EnterpriseVectorLayer({
//							map:app.map,
//							type:operateText
//						});
//					}
//					num=yhfbLayer.getFeaturesCount();
//					extent=yhfbLayer.getExtent();
					flag='yhfb';
					break;
				
			}
			
			//图层中没有要素，获得不到范围
//			if(isFinite(extent[0])){
//				app.map.getView().fit(extent, app.map.getSize());
//				app.map.getView().setZoom(12);
//			}
			$(".subTitle").html(text + '(<span style="color:red;">' + num + '</span>)');
		})

		/*
		 * 条件查询
		 * */
		$(".searchBtn").click(function(){
			clearSource();
			// 查询条件
			var filter = $(".inputSearch").val();
			
			// 设置DataGrid的查询条件
			var index=$(".subTitle").html().indexOf('(');
			var text=$(".subTitle").html().substr(0,index);
			var num=0;
			$(".subTitle").html(text + '('+num+')');
			var extent;
			if(flag=='syqy'){
				//从聚合第一次执行查询
//				if(allListLayer==undefined){
//					allListLayer=new EnterpriseVectorLayer({
//						map:app.map,
//						type:operateText
//					});
//				}
//				allListLayer.search(filter);
//				num=allListLayer.getFeaturesCount();
//				extent=allListLayer.getExtent();
			}else if(flag=='zdwxy'){
//				zdwxyLayer.search(filter);
//				num=zdwxyLayer.getFeaturesCount();
//				extent=zdwxyLayer.getExtent();
			}else if(flag=='whqy'){
//				whqyLayer.search(filter);
//				num=whqyLayer.getFeaturesCount();
//				extent=whqyLayer.getExtent();
			}else if(flag=='yjjg'){
//				yjjgLayer.search(filter);
//				num=yjjgLayer.getFeaturesCount();
//				extent=yjjgLayer.getExtent();
			}else if(flag=='yjck'){
//				yjckLayer.search(filter);
//				num=yjckLayer.getFeaturesCount();
//				extent=yjckLayer.getExtent();
			}else if(flag=='yjdw'){
//				yjdwLayer.search(filter);
//				num=yjdwLayer.getFeaturesCount();
//				extent=yjdwLayer.getExtent();
			}else if(flag=='yjwz'){
//				yjwzLayer.search(filter);
//				num=yjwzLayer.getFeaturesCount();
//				extent=yjwzLayer.getExtent();
			}else if(flag=='yhfb'){
//				yhfbLayer.search(filter);
//				num=yhfbLayer.getFeaturesCount();
//				extent=yhfbLayer.getExtent();
			}
			
			//图层中没有要素，获得不到范围
//			if(isFinite(extent[0])){
//				app.map.getView().fit(extent, app.map.getSize());
//				app.map.getView().setZoom(12);
//			}
			$(".subTitle").html(text + '(<span style="color:red;">' + num + '</span>)');
		})
		
		/*
		 * 清除
		 * */
		function clearSource(){
//			if(allListLayer!=undefined){
//				allListLayer.clearFeatures();
//				allListLayer.clearPopup();
//				allListLayer.removeInteraction();
//			}
//			if(zdwxyLayer!=undefined){
//				zdwxyLayer.clearFeatures();
//				zdwxyLayer.clearPopup();
//				zdwxyLayer.removeInteraction();
//			}
//			if(whqyLayer!=undefined){
//				whqyLayer.clearFeatures();
//				whqyLayer.clearPopup();
//				whqyLayer.removeInteraction();
//			}
//			if(yjzyLayer != undefined){
//				yjzyLayer.clearFeatures();
//				yjzyLayer.clearPopup();
//				yjzyLayer.removeInteraction();
//			}
//			if(yjjgLayer != undefined){
//				yjjgLayer.clearFeatures();
//				yjjgLayer.clearPopup();
//				yjjgLayer.removeInteraction();
//			}
//			if(yjckLayer != undefined){
//				yjckLayer.clearFeatures();
//				yjckLayer.clearPopup();
//				yjckLayer.removeInteraction();
//			}
//			if(yjdwLayer != undefined){
//				yjdwLayer.clearFeatures();
//				yjdwLayer.clearPopup();
//				yjdwLayer.removeInteraction();
//			}
//			if(yjwzLayer != undefined){
//				yjwzLayer.clearFeatures();
//				yjwzLayer.clearPopup();
//				yjwzLayer.removeInteraction();
//			}
//			if(yhfbLayer != undefined){
//				yhfbLayer.clearFeatures();
//				yhfbLayer.clearPopup();
//				yhfbLayer.removeInteraction();
//			}
			//清除弹出框
			//popPanel.closeClosePopup();
			clearSelection();
		}

		/*
		 * 清除选择的要素
		 * */
		function clearSelection(){
			if(flag == 'syqy'){
//				allListLayer.clearSelection();
			}else if(flag=='zdwxy'){
//				zdwxyLayer.clearSelection();
			}else if(flag=='whqy'){
//				whqyLayer.clearSelection();
			}else if(flag == 'yjzy'){
//				yjzyLayer.clearSelection();
			}else if(flag == 'yjjg'){
//				yjjgLayer.clearSelection();
			}else if(flag == 'yjck'){
//				yjckLayer.clearSelection();
			}else if(flag == 'yjdw'){
//				yjdwLayer.clearSelection();
			}else if(flag == 'yjwz'){
//				yjwzLayer.clearSelection();
			}else if(flag == 'yjfb'){
//				yhfbLayer.clearSelection();
			} 
		}
	
//	})
	
});


	