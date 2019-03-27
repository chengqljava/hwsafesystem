$(document).ready(function() {
	//初始化下拉框
	SelectOption.loadSex("sex");//性别
	SelectOption.loadNation("nation");//民族
	SelectOption.loadTechnical("technical");//技术职称
	SelectOption.loadPolitics("politics");//政治面貌
	SelectOption.loadHealth("health");//健康状况
	SelectOption.loadEducation("degree");//最高学历
	SelectOption.loadExpertType("experttype");//专家类别
	SelectOption.loadMajorField("major");//专业领域
	SelectOption.loadExpertLevel("expertlevel");//专家级别
	if($("#unitclass").val()=='ENT')
		SelectTree.loadDistrictAllSelect("districtname");//全部行政区域下拉树 
	if($("#unitclass").val()=='GOV')
		SelectTree.loadSelfDistrictSelect("districtname");//当前机构下行政区域下拉树 

	$("#contendiv div[id^=myfile]").each(function(index, element) {
		var showimage = true;
		var filetype = 'file';
		if($(this).attr('id')=="myfileZP"){
			showimage = false;
			filetype = 'image';
		}
		showUploadFile($(this).attr('id'), filetype, showimage);//显示文件上传控件
	});
	/*$("#contendiv div[id^=fileselect]").each(function(index, element) {
		$(this).css({
			"width" : "90%"
		});
	});
	$("#contendiv div[id^=fileshow]").each(function(index, element) {
		$(this).css({
			"width" : "90%"
		});
	});*/
	
	var validateOpts = {
			rules : {
				name : {
					required : true
				},
				districtcode : {
					required : true
				},
				idcard : {
					isIdCard : true
				},
				longitude: {
		            required: true,
		            validateitude: true/*,
		            range: [107.16, 111.53]*/
		        },
		        latitude: {
		            required: true,
		            validateitude: true/*,
		            range: [37.64, 41.67]*/
		        },
				email : {
					isEmail : true
				},
				hometel : {
					isTel : true
				},
				phone : {
					required : true,
					isTel : true
				},
				officetel : {
					isTel : true
				},
				postcode : {
					isNumber : true
				}
			},
			messages : {
				name : {
					required : "姓名不能为空"
				},
				districtcode : {
					required : "地区不能为空"
				},
				longitude: {
	                required: "经度不能为空",
	                validateitude: "请输入小数且小数位最多4位"/*,
	                range: "经度输入范围在 {107.16} 到 {111.53} 之间的数值"*/
	            },
	            latitude: {
	                required: "纬度不能为空",
	                validateitude: "请输入小数且小数位最多4位"/*,
	                range: "纬度输入范围在 {37.64} 到 {41.67} 之间的数值"*/
	            },
				hometel : {
					isTel : "请输入正确的家庭电话"
				},
				phone : {
					required : "移动电话不能为空",
					isTel : "请输入正确的移动电话"
				},
				officetel : {
					isTel : "请输入正确的办公电话"
				},
				postcode : {
					isNumber : "请输入正确的单位邮政编码"
				}
			},
			 errorPlacement: function (error, element) { //指定错误信息位置
	             var longitude = $('#longitude').attr('id'); //获取经度
	             var latitude = $('#latitude').attr('id'); //获取纬度
	             var id = element.attr('id');
	             if(longitude == id || latitude == id){
	                 var eid = element.attr('name'); //获取元素的name属性
	                 error.appendTo($('.'+eid+'Div')); //将错误信息添加当前元素的父结点后面
	             }else{
	                 error.insertAfter(element);
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
    	$("#emsresexpertform").validate(validateOpts);
    });
});

/*保存(新增或编辑)*/
function save(){
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
		url : BASE_URL+'/ems/emsresexpert/save',
		secureuri:false,
	    files : arrId,
		cache : false,
		dataType : 'json',
		data : $("#emsresexpertform").serializeArray(),
		global : false,
		success : function(json) {
			if(json.success==true){
				parent.toast(json.msg);
				//弹出提示信息
				parent.getActiveIFrame().reloadGrid();
				//刷新列表
				parent.closeWin();
				// 关闭弹出框
			}else{
				parent.toast(json.msg);
				$('#emsresexpertform').data('formValidation').disableSubmitButtons(false);//设置提交按钮disable为false
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
      var areaName = encodeURIComponent($('#area').val());
      var isDisplay = $("#isDisplay").val();
      
      //当编辑地图点位时
      if ("0" == isDisplay) {
      	window.top.GEventObject.die("LOAD_BDMAPPT_EVENT");
      	window.top.GEventObject.on("LOAD_BDMAPPT_EVENT", function(param) {
      		$('#longitude').val(param.lng);
      		$('#latitude').val(param.lat);
      	});
      }
      parent.parent.openWin(BASE_URL + "/views/module/ems/common/emsMapLoc.html?lng=" + longitude + "&lat=" + latitude + "&isDisplay="+ isDisplay, "地理定位", "50%", "50%", false);
//      parent.parent.openWin(BASE_URL+"/olgis/gisOperBuss/position?module=gis&type=edit&longitude="+longitude+"&latitude="+latitude+"&areaName="+areaName+"&register=null",'地理定位','50%','50%',false);  
  }