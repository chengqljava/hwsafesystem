var attributeSearch = {};

attributeSearch.getAttr = function(data,nodes,scene){
    var parentNodes = data.instance.get_parent(data.node);
    if(parentNodes == "ent_001"){
   	 //alert("公司层");
   	 var layer3d=scene.get_layer3Ds().get_item("buildModel@tcgwh");
	     var selection3d=layer3d.get_selection3D();
	     selection3d.removeAll();
	     if(parseInt(nodes.id)==1){
	    	 utils.flyTo(121.20442630564872,31.627595211834432,500.1651306514382,356.3942564415819,71.05777740038805,scene);
	    	 selection3d.add(6);
	    	 var featrue3D = layer3d.findFeature3DByID(6);
	     }
	     if(parseInt(nodes.id)==2){
	    	 utils.flyTo(121.20471909070745,31.621613904070457,113.57275576516063,116.57189742899405,72.87291986451812,scene);
	    	 selection3d.add(15);//SmID
	    	 var featrue3D = layer3d.findFeature3DByID(15);	 
	     }
	     if(parseInt(nodes.id)==3){
	    	 utils.flyTo(121.201688,31.622759,313.57275576516063,116.57189742899405,72.87291986451812,scene);
	    	 selection3d.add(19);//SmID
	    	 var featrue3D = layer3d.findFeature3DByID(19);	 
	     }
	     fieldInfo = layer3d.getFieldValue(13);
	     infoFlag = 1;
    }
    if(parentNodes == "store_001"){
   	 //alert("仓库层");
   	 var layer3d=scene.get_layer3Ds().get_item("buildModel@tcgwh");
	     var selection3d=layer3d.get_selection3D();
	     selection3d.removeAll();
	     if(nodes.id=="ck_1"){
	    	 utils.flyTo(121.209105,31.624999,500.1651306514382,356.3942564415819,71.05777740038805,scene);
	    	 selection3d.add(110);
	    	 var featrue3D = layer3d.findFeature3DByID(110);
	     }
	     if(nodes.id=="ck_2"){
	    	 utils.flyTo(121.210072,31.624164,113.57275576516063,116.57189742899405,72.87291986451812,scene);
	    	 selection3d.add(105);//SmID
	    	 var featrue3D = layer3d.findFeature3DByID(105);	 
	     }
	     fieldInfo = layer3d.getFieldValue(13);
	     infoFlag = 2;
    }
    if(parentNodes == "lud_001"){
   	 //alert("路灯层");
   	 var layer3d=scene.get_layer3Ds().get_item("ludeng@tcgwh");
	     var selection3d=layer3d.get_selection3D();
	     selection3d.removeAll();
	     if(nodes.id=="ld_1"){
	    	 utils.flyTo(121.205909,31.624902,500.1651306514382,356.3942564415819,71.05777740038805,scene);
	    	 selection3d.add(1);
	    	 var featrue3D = layer3d.findFeature3DByID(1);
	     }
	     if(nodes.id=="ld_2"){
	    	 utils.flyTo(121.205464,31.624524,113.57275576516063,116.57189742899405,72.87291986451812,scene);
	    	 selection3d.add(2);//SmID
	    	 var featrue3D = layer3d.findFeature3DByID(2);	 
	     }
	     fieldInfo = layer3d.getFieldValue(13);
	     infoFlag = 3;
    }
    if(parentNodes == "camera_001"){
   	// alert("摄像头层");
   	 var layer3d=scene.get_layer3Ds().get_item("Camera@tcgwh");
	     var selection3d=layer3d.get_selection3D();
	     selection3d.removeAll();
	     if(nodes.id=="sxt_1"){
	    	 utils.flyTo(121.206567,31.625192,500.1651306514382,356.3942564415819,71.05777740038805,scene);
	    	 selection3d.add(1);
	    	 var featrue3D = layer3d.findFeature3DByID(1);
	     }
	     if(nodes.id=="sxt_2"){
	    	 utils.flyTo(121.205842,31.6258,113.57275576516063,116.57189742899405,72.87291986451812,scene);
	    	 selection3d.add(2);//SmID
	    	 var featrue3D = layer3d.findFeature3DByID(2);	 
	     }
	     fieldInfo = layer3d.getFieldValue(13);
	     infoFlag = 4;
    }
    var res = {"featrue3D":featrue3D,
    		"fieldInfo":fieldInfo,
    		"infoFlag":infoFlag}
    return res;
}