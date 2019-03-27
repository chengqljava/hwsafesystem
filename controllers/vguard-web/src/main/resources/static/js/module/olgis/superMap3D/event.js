//controller
var sceneControl = null;
var scene = null;
var flyManager = null;
var filepath_1=null;
var flylineroute=null;
var fieldInfo=null;
var infoFlag = 1;
var layer3Ds=null;
var nodes=null;
var nodes_1=null;
var bubblemanager=null;
function onPageLoad(){
	try{
		//初始化三维场景控件.....
		sceneControl = new SuperMap.Web.UI.Controls.SceneControl($get("sceneControlDiv"),initCallback,failedCallback);
	}catch (e) {
		//若没有安装插件，则抛出该异常
		if(e.name == SuperMap.Web.Realspace.ExceptionName.PlugInNotInstalled){
			var url = BASE_URL+"/ocx/Setup.exe";
			document.write("<a href = '"+url+"'>未检测到 SuperMap iClient3D for  Plugin 插件，请单击此处下载并安装插件。 </a>");
			return;

		}
		//若使用非IE浏览器，则抛出该异常
		else if(e.name == SuperMap.Web.Realspace.ExceptionName.BrowserNotSupport){
			document.write(" <p>SuperMap iClient3D for  Plugin 目前仅支持 InternetExplorer 浏览器，请更换浏览器后重新尝试加载本页面。 </p>");
				return;
		}
		//抛出其他异常
		else{
			console.log(e.message);
		}
	}
}
//控件初始化完成后的回调函数，初始化完成后才能进行数据加载
function initCallback(){
	scene = sceneControl.get_scene();//获取realspace控件的场景
	var sceneoption=scene.get_sceneOption();
	sceneoption.set_isAtmosphereVisible(true);
	sceneoption.set_isLatLonGridVisible(true);
	layer3Ds = scene.get_layer3Ds();
	
	sceneControl.addEvent("objectSelected",objectSelected);
	sceneControl.addEvent("bubbleInitialize",bubbleInitialize);
	sceneControl.addEvent("bubbleResize",bubbleResize);
	sceneControl.addEvent("bubbleClose",bubbleClose);
	//获取FlyManager对象
    flyManager = scene.get_flyManager();
	var isOpen = scene.open(URL_CONFIG.SCENE2,'Scene');
	//utils.flyTo(104.348,28.708,10288740.0,scene);
	if(isOpen){
		var layer3D = scene.get_layer3Ds().get_item(0); 
		if (layer3D != null)
		{
			//获取图层的地理范围，并飞行到该范围
			var geobound = layer3D.get_bounds();  
			//scene.get_flyingOperator().flyToBounds(geobound);
			var camera = new SuperMap.Web.Realspace.Camera(121.2046717629671, 31.6228374232847, 787.10833104047);
			camera.set_tilt(60.978013297770225);
			scene.get_flyingOperator().flyTo(camera,3000,6);
		}
	}
	
	//动态添加定位飞行下拉框选项
    var fileSelect = fileSelectJson.fileSelect;
	for(var i = 0;i<fileSelect.length;i++){
		$(".select-content ul").append("<li value = "+ fileSelect[i].value+">"+fileSelect[i].name+"</li>");
	}
	$(".select-content ul li").on("click", function() {
		var txt = $(this).text();
		var val = $(this).attr("value");
		$(".select-from input").val(txt);
		$(".select-from input").attr("value",val);
		$(".select-content ul").hide();
	});

	//动态添加航线飞行下拉框选项
	var filePath = filePathJson.filePath;
	for(var i = 0;i<filePath.length;i++){
		$(".sel-dropdown ul").append("<li value = "+ filePath[i].value+">"+filePath[i].name+"</li>");
	}
	$(".sel-dropdown ul li").on("click", function() {
		var txt = $(this).text();
		var val = $(this).attr("value");
		$(".sel-dropdown input").val(txt);
		$(".sel-dropdown input").attr("value",val);
		$(".sel-dropdown ul").hide();
	});
	//加载属性树	
	$('#attr-tree').jstree({
			'core' : {
				'data' : attrTreeJson.attrTree
			},  
            "plugins" : ["search"] 
		});
	$('#attr-tree').on('changed.jstree', function (e, data) {
	     nodes = data.instance.get_node(data.node);
	     var isSelected = data.instance.is_selected(nodes);
	     if(isSelected == false)return;
	     var res = attributeSearch.getAttr(data,nodes,scene);
	     fieldInfo = res.fieldInfo;
	     infoFlag = res.infoFlag;
    	 var point3D = null;
    	 if (!res.featrue3D)return;
    	 point3D = res.featrue3D.get_geometry().get_position();
    	 if(bubblemanager == null){
    		 var option = {"sceneControl":sceneControl,
    				 		"scene":scene};
    		 bubblemanager = new bubbleManager(option);
    	 }
    	 bubble = bubblemanager.createBubble(point3D);
	  }).jstree(); 
	$("#searchDW").click(function() {
		$('#attr-tree').jstree(true).search($('#search_ay').val());
	});
	
	  
	
	//加载图层管理树	
	$('#layers-tree').jstree({
			"checkbox" : {
			    "keep_selected_style" : false,
			    "responsive" : false  
			  },
			  "plugins" : [ "wholerow", "checkbox" , "types"],
			'core' : {
				'data' : layersTreeJson.layersTree
			} 
		});
	$('#layers-tree').on('changed.jstree', function (e, data) {
	    nodes_1 = data.instance.get_node(data.node);
	    var isSelected = data.instance.is_selected(nodes_1);
	    //alert(nodes.id +":"+isSelected);
	    if(nodes_1.id==99){
	    	if(isSelected==true){
	    		for(var i=0;i<3;i++){
	    		var layer3DTree=layer3Ds.get_item(i);
	    		layer3DTree.set_isVisible(true);
	    		}
	    	}
	    	else{
	    		if(isSelected==false){
		    		for(var i=0;i<3;i++){
		    		var layer3DTree=layer3Ds.get_item(i);
		    		layer3DTree.set_isVisible(false);
		    		}
	    	    }
	    	}
	    }
	    else{
	    if(isSelected==true){
	    	  var layer3DTree=layer3Ds.get_item(parseInt(nodes_1.id)-1);
	    	  if(layer3DTree==null)return;
	          layer3DTree.set_isVisible(true);
	    }
	    else{
	    	 var layer3DTree=layer3Ds.get_item(parseInt(nodes_1.id)-1);
	    	 if(layer3DTree==null)return;
	         layer3DTree.set_isVisible(false);
	     }
	    }
	  }).jstree(); 
     
}
//控件初始化失败
function failedCallback(){
	console.log("Realspace初始化失败！");
}

function objectSelected(selected3d){
	var objId = selected3d[0].get_item(0);
	var objInLayer3D = selected3d[0].get_layer3D();
	var featrue3D = objInLayer3D.findFeature3DByID(objId);
	fieldInfo = objInLayer3D.getFieldValue(13);
	var layer3DName = objInLayer3D.get_name();
	switch(layer3DName){
		case "buildModel@tcgwh":
			if(parseInt(objId)<100){
				infoFlag = 1;
			}else{
				infoFlag = 2;
			}
			break;
		case "ludeng@tcgwh":
			infoFlag = 3;
			break;
		case "Camera@tcgwh":
			infoFlag = 4;
			break;
		default:
			infoPage = 1;
			break;
	}
	var point3D = null;
	if (featrue3D) {
		point3D = featrue3D.get_geometry().get_position();
	}
	if(bubblemanager == null){
		var option = {"sceneControl":sceneControl,
		 			  "scene":scene};
		bubblemanager = new bubbleManager(option);
	}
	bubble = bubblemanager.createBubble(point3D);
}

	function bubbleInitialize(bubble){
		bubblemanager.bubbleInitialize(bubble);	
	}
	//重置气泡
	function bubbleResize(bubble){
		bubblemanager.bubbleResize(bubble);
	}
	//关闭气泡
	function bubbleClose(bubble){
		bubblemanager.bubbleClose(bubble);
	}


!function(){
	//平移
	/*$(".zs").click(function() {
		//设置控件的当前操作为漫游
		var panAction = new SuperMap.Web.UI.Action3Ds.Pan(sceneControl);
		sceneControl.set_sceneAction(panAction);
		
	});*/
	//距离量算
	$(".kjjl").click(function() {
		var measure = new Measure(scene,sceneControl);
		measure.measureDis();
	});
	//面积量算
	$(".kjmj").click(function() {
		var measure = new Measure(scene,sceneControl);
		measure.measureArea();
	});
	//高程量算
	$(".gc").click(function() {
		var measure = new Measure(scene,sceneControl);
		measure.measureHeight();
	});
	//水平量算
	$(".spjl").click(function() {
		var measure = new Measure(scene,sceneControl);
		measure.measureLevel();
	});
	//清除
	$(".qc").click(function() {
		var measure = new Measure(scene,sceneControl);
		measure.clearAll();
	});
	
	//路线飞行
     
	$("#flyroute").click(function(){
		filepath_1 = $(".sel-dropdown input").attr("value");
		if(filepath_1 != undefined){
			var speedInput = $(".iptadd");
			var linesCheckbox = $("#route");
			var stopsCheckbox = $("#place");
			var option = {
					"scene":scene,
					"sceneControl":sceneControl,
					"flyManager":flyManager,
					"filepath_1":filepath_1,
					"speedInput":speedInput,
					"linesCheckbox":linesCheckbox,
					"stopsCheckbox":stopsCheckbox
					};
			flylineroute=new flyLineRoute(option);
			flylineroute.play(); 
		}else{
			console.log("请先选择 飞行路线！");
		}  
    });
    
    //暂停飞行
	$("#pause").click(function(){
		flylineroute.pause();   
    });
	
    //停止飞行
    $("#stop").click(function(){
    	flylineroute.stop();
    });
	
	$("#positioning").click(function(){
    	var num = $(".select-from input").attr("value");
    	if (num==1) {//港务大厦
    		var camera = new SuperMap.Web.Realspace.Camera(121.20442630564872,31.627595211834432,500.1651306514382);
    		camera.set_heading(356.3942564415819);
	        camera.set_tilt(71.05777740038805);
	        scene.get_flyingOperator().flyTo(camera,2000,2);
    	}
    	if (num==2) {//郑和大酒店
    		var camera = new SuperMap.Web.Realspace.Camera(121.20471909070745,31.621613904070457,113.57275576516063);
    		camera.set_heading(116.57189742899405);
	        camera.set_tilt(72.87291986451812);
	        scene.get_flyingOperator().flyTo(camera,2000,2);
    	}
    	if (num==3) {//技术服务中心
    		var camera = new SuperMap.Web.Realspace.Camera(121.20095164940058,31.626238218946216,408.78334802940224);
    		camera.set_heading(317.95938227419503);
	        camera.set_tilt(81.85858923549155);
	        scene.get_flyingOperator().flyTo(camera,2000,2);
    	}
    })
}()

		
		
		
	