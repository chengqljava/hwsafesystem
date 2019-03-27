$(document).ready(function() {
    $("#contendiv div[id^=myfile]").each(function(index, element) {		
		showUploadFile($(this).attr('id'));//显示文件上传控件
	});
    
    var validateOpts = {
            rules : {
                eventname : {
                    required : true
                },
                time : {
                    required : true
                },
                address : {
                    required : true
                },
                eventtypeid : {
                    required : true
                },
                eventlevel : {
                    required : true
                },
                reason : {
                    required : true
                },
                content : {
                    required : true
                },
                casualty : {
                    required : true
                },
                longitude: {
                    required: true,
                    validateitude: true/*,
                    range:[107.16, 111.53]*/
                },
                latitude: {
                    required: true,
                    validateitude: true/*,
                    range:[37.64, 41.67]*/
                }
                
            },
            messages : {
                eventname : {
                    required : "事故名称不能为空"
                },
                time : {
                    required : "发生时间不能为空"
                },
                address : {
                    required : "发生地址不能为空"
                },
                eventtypeid : {
                    required : "事故类型不能为空"
                },
                eventlevel : {
                    required : "事故等级不能为空"
                },
                reason : {
                    required : "事故原因不能为空"
                },
                content : {
                    required : "事故概述不能为空"
                },
                casualty : {
                    required : "伤亡情况不能为空"
                },
                longitude: {
                    required: "经度不能为空",
                    validateitude: "请输入小数且小数位最多4位"/*,
                    range:"经度输入范围在 {107.16} 到 {111.53} 之间的数值"*/
                },
                latitude: {
                    required: "纬度不能为空",
                    validateitude: "请输入小数且小数位最多4位"/*,
                    range: "纬度输入范围在 {37.64} 到 {41.67} 之间的数值"*/
                }
            },
            submitHandler : function(form) {
                save();
            }
        };
    
    //获取最新经纬度限制范围
    $.getJSON(BASE_URL + "/config/gisPtAreaRange.json", function(data) {
    	if (data && 0 != data.lngStart) {
    		validateOpts.rules.longitude.range = [data.lngStart, data.lngEnd];
    		validateOpts.rules.latitude.range = [data.latStart, data.latEnd];
    		validateOpts.messages.longitude.range = "经度输入范围在 {" + data.lngStart + "} 到 {" + data.lngEnd + "} 之间的数值";
    		validateOpts.messages.latitude.range = "纬度输入范围在 {" + data.latStart + "} 到 {" + data.latEnd + "} 之间的数值";
    	}
    	$("#emssuceventform").validate(validateOpts);
    });
});

/**保存*/
function save() {
	//获取file的全部id  
    var uplist = $("input[name^=file]");  
	var arrId = [];  
	for (var i=0; i< uplist.length; i++){  
	    if(uplist[i].value){  
	        arrId[i] = uplist[i].id;  
	    }  
    }
	$.ajaxFileUpload({
		type : 'post',
		url : BASE_URL+'/ems/emssucevent/saveinfo',
		secureuri:false,
	    files : arrId,
		cache : false,
		dataType : 'json',
		data : $("#emssuceventform").serializeArray(),
		global : false,
		success : function(json) {
			if (json.success == true){
				parent.toast(json.msg);
				//弹出提示信息
				parent.getActiveIFrame().reloadGrid();
				//刷新列表
				parent.closeWin();
				// 关闭弹出框
			}else{
				parent.toast(json.msg);
			}
		},
		error : function() {
			parent.toast("保存失败");
		}
	});
}

var attachname = "";
var i=1;
function addInput(fileid){
	attachname = fileid;
    if(i>0){
          var attach = attachname + i ;
          createInput(attach,fileid);
          var div = document.getElementById("fileselect"+fileid+i);
          div.style.width = "90%";
          var ss = document.getElementById(attach);
          ss.style.float = "left";
          ss.style.width="100%";
          ss.style.paddingTop="6px";
          i=i+1;
    }
} 
function deleteInput(id){
  if(i>1){
    if(!removeInput(id))
        i=i+1;
  }
} 
function createInput(nm,fileid){   
	//var element = "<div id="+nm+"></div><input type='button' value='删除t'/>";
	var bElement=document.createElement("input");  
	bElement.type="button";
	bElement.className="btn btn-primary";
	bElement.onclick=Function("deleteInput("+nm+")");  
	bElement.value="删除行";
	bElement.style.float = "right";
	bElement.style.marginTop = "2px";
	bElement.style.marginLeft = "3px";
		
    var  aElement=document.createElement("div");   
    aElement.id=nm;
     
    document.getElementById(fileid).appendChild(aElement);
    document.getElementById(nm).appendChild(bElement);

    showUploadFile(nm,'file',true);//显示文件上传控件

  }  

function removeInput(id){
	$(id).remove()
}  

/**
 * 定位
 */
function position(){
    var longitude = encodeURIComponent($('#longitude').val());
    var latitude= encodeURIComponent($('#latitude').val());
    var areaName = encodeURIComponent($('#districtid').val());
    
    window.top.GEventObject.die("LOAD_BDMAPPT_EVENT");
    window.top.GEventObject.on("LOAD_BDMAPPT_EVENT", function (param) {
        $('#longitude').val(param.lng);
        $('#latitude').val(param.lat);
    });
    parent.parent.openWin(BASE_URL + "/views/module/ems/common/emsMapLoc.html?lng=" + longitude + "&lat=" + latitude + "&isDisplay=0", "地理定位", "50%", "50%", false);    
//    parent.parent.openWin(BASE_URL+"/olgis/gisOperBuss/position?module=gis&type=edit&longitude="+longitude+"&latitude="+latitude+"&areaName="+areaName+"&register=null",'地理定位','50%','50%',false);  
}