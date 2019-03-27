var URL_CONFIG = {
	BINGMAP:'//dev.virtualearth.net',
	SCENE2:'http://192.168.88.11:8090/iserver/services/3D-Scene/rest/realspace'
	};
var filePathJson = { "filePath": [{ "name": "园区飞行路线", "value":"http://192.168.88.11:8090/wtqdemo/NewSceneRoutes.fpf"}]};
var fileSelectJson ={ "fileSelect": [{ "name": "港务大厦", "value":"1"},
                                     { "name": "郑和大酒店", "value":"2"},
                                     { "name": "技术服务中心", "value":"3"}
                                    ]};
var attrTreeJson = {"attrTree":[
            					{ "text" : "科技园区",
            					  "id":"ent_001",
        						  "icon" : BASE_URL+"/images/gis/v3d/qy.png",
        						  'state' : {
        					           'opened' : true,
        					           'selected' : true
        					         }, 
        					       "children" : [
        								{ "text" : "港务大厦",
        									 "id":"1",
        								  "icon" : BASE_URL+"/images/gis/v3d/qy.png"},
        								{ "text" : "郑和大酒店",
        									 "id":"2",
        								  "icon" : BASE_URL+"/images/gis/v3d/qy.png" },
        							    { "text" : "港城广场",
         									 "id":"3",
         								  "icon" : BASE_URL+"/images/gis/v3d/qy.png" }
        						]},
        						{ "text" : "仓库园区",
        						  "id":"store_001",
        						  "icon" : BASE_URL+"/images/gis/v3d/ck.png",
        						  "children" : [
        		 						{ "text" : "顺德物流中心",
        		 						  "id":"ck_1",
        		 						  "icon" : BASE_URL+"/images/gis/v3d/ck.png"},
        		 						{ "text" : "新世纪仓库一号",
        		 						  "id":"ck_2",
        		 						  "icon" : BASE_URL+"/images/gis/v3d/ck.png"}
        		 				]},
        						{ "text" : "荷园路路灯",
        		 				  "id":"lud_001",
          						  "icon" : BASE_URL+"/images/gis/v3d/ld.png",
          						  "children" : [
          		 						{ "text" : "ld-001",
          		 						  "id":"ld_1",
          		 						  "icon" : BASE_URL+"/images/gis/v3d/ld.png"},
          		 						{ "text" : "ld-002",
          		 						  "id":"ld_2",
          		 						  "icon" : BASE_URL+"/images/gis/v3d/ld.png"}
          		 				]},
          		 				{ "text" : "花园路口", 
          		 				  "id":"camera_001",
            						  "icon" : BASE_URL+"/images/gis/v3d/sxt.png",
            						  "children" : [
            		 						{ "text" : "sxt-001",
            		 						  "id":"sxt_1",
            		 						  "icon" : BASE_URL+"/images/gis/v3d/sxt.png"},
            		 						{ "text" : "sxt-002",
            		 						  "id":"sxt_2",
            		 						  "icon" : BASE_URL+"/images/gis/v3d/sxt.png"}
            		 				]}
        					]};
var layersTreeJson = {"layersTree":[
            					{ "text" : "图层列表",
        						  "icon" : false,
        						  'state' : {
        					           'opened' : true,
        					           'selected' : true
        					         }, 
        					       "children" : [
        								{  "id":99,
        								"text" : "影像图层",
        								  "icon" : false,
        								  
        								  "children" : [
        		        		 						{ "id":1,"text" : "绿化图层","icon" : false },
        		        		 						{ "id":2,"text" : "底图图层","icon" : false },
        		        		 						{ "id":3,"text" : "监控摄像图层","icon" : false }
        		        		 				]
        								},
        								{ "text" : "S3M图层",
        								  "icon" : false}
        						]}
        					]};