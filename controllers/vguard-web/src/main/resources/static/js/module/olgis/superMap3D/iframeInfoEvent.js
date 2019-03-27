var cameraObj ;
window.onload = function(){
	//前端模擬實時溫度
		var otemp = 25;
		setInterval(function(){
			otemp++;
			while(otemp > 35){
				otemp = 25;
			}
			setTemp(otemp);
		},1000);
		function setTemp(ootemp){
			var temp = document.getElementById("temp");
			temp.innerHTML = ootemp + "℃";
		}
		
		//開關控制
		var div2=document.getElementById("eqClose");
        var div1=document.getElementById("eqOpen");
        div2.onclick=function(){
          div1.className=(div1.className=="close1")?"open1":"close1";
          div2.className=(div2.className=="close2")?"open2":"close2";
        }
        
        
        cameraObj = $("#plugin").loadCamera({
			"ip":"192.168.88.165",
			"port":"37777",
			"username":"zwtest",
			"password":"zw123456",
			"channel":"0",
			"brand":"0",
			"width":430,
			"height":230
			});	
    	
		
	}
	/**
	 * 播放
	 */
/*	var result = false;
	function onPlay(){
		if(!result){
			window.setTimeout(function(){
				result = cameraObj.play();//播放
			},500);
		}
	}
	
	function setosd(){
		cameraObj.setosd(0,"",20,80);
		cameraObj.setosd(1,"",20,120);
		cameraObj.setosd(2,"",20,160);
		cameraObj.setosd(3,"",20,210);
	}*/
	
	//弹出框内容加载
	function popupContent(flag,fieldInfo){
		var divEnt = document.getElementById("divEnt");
		var divStore = document.getElementById("divStore");
		var divCamera = document.getElementById("divCamera");
		var divEquip = document.getElementById("divEquip");
		if(flag == 1){
			//企业弹出框
			divStore.style.display = "none";
			divCamera.style.display = "none";
			divEquip.style.display = "none";
	        divEnt.style.display = "block";
	        $("#td1").html(fieldInfo);
	        $("#entImg").attr("src", BASE_URL+"/images/gis/v3d/bg02.png"); 
		}
		if(flag == 2){
			//仓库弹出框
	        divEnt.style.display = "none";
			divCamera.style.display = "none";
			divEquip.style.display = "none";
	        //divStore.style.display = "block";
	        //document.write(longi);
	       // document.getElementById("divStore").innerHTML=fieldInfo;
	        divStore.style.display = "block";
	        $("#storeImg").attr("src", BASE_URL+"/images/gis/v3d/bg01.png");
		}
		if(flag == 3){
			//路灯弹出框
	        divEnt.style.display = "none";
	        divStore.style.display = "none";
	        divCamera.style.display = "none";
	        divEquip.style.display = "block";
	        
		}
		if(flag == 4){
			//摄像头弹出框
	        divEnt.style.display = "none";
	        divStore.style.display = "none";
	        divEquip.style.display = "none";
	        divCamera.style.display = "block";
			
			/*var cameraObj = $("#plugin").loadCamera({
					"ip":data[0].IPADDR,
					"port":data[0].PORT,
					"username":data[0].USERNAME,
					"password":data[0].PASSWORD,
					"channel":data[0].VIDEONUM,
					"brand":data[0].BRAND,
					"width":($(window).width() - 205),
					"height":($(window).height()*0.6 - 38)
				});
			*/	
	        //("192.168.88.164",8000,"admin","hk123456",1,1)
	        try{
	        	if(!cameraObj.isInstall()){
					layer.confirm("插件没有安装,请下载安装", {
			            btn: ['下载','取消'], //按钮
			            shade: false //不显示遮罩
			        }, function(index){
			            window.location.href = BASE_URL+"/monitor/macmonitormap/downloadWebComponentsZW";
			            layer.close(index);
			        });
					return;
				}
	        	cameraObj.play();
	        }catch (e) {
	        	if(!cameraObj.isInstall()){
					layer.confirm("插件没有安装,请下载安装", {
			            btn: ['下载','取消'], //按钮
			            shade: false //不显示遮罩
			        }, function(index){
			            window.location.href = BASE_URL+"/monitor/macmonitormap/downloadWebComponentsZW";
			            layer.close(index);
			        });
					return;
				}
	        }
			
	        
		}
	} 

	