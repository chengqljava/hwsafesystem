/*新增或编辑课程管理*/
$(function () {

	var placeid = getQueryString("placeid");
	
	var validateOpts = {
			rules: {
				name: {
					required: true,
					maxlength: 100
				},
				typeid: {
					required: true,
				},
				population: {
					required: true,
					digits: true
				},
				tel: {
					required: true,
					isPhone:true
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
			messages: {
				name: {
					required: "保护场所名称不能为空",
					maxlength: "最多输入100字"
				},
				typeid: {
					required: "场所类型不能为空",
				},
				population: {
					required: "人数不能为空",
					digits: "只能输入整数"
				},
				tel: {
					required: "电话不能为空",
					isPhone: "请输入正确手机格式"
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
			submitHandler:function(form){
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
    	$("#placeForm").validate(validateOpts);
    });
	
	//查询
	$.ajax({
		type : "post",
		url : BASE_URL + "ems/emssucplace/load",
		dataType : "json",
		data :{
			placeid:placeid
		},
		success : function(data) {
			if (data) {
				var placeTpt = _.template($("#placeTpt").html());
				$("#placeForm").html(placeTpt(data));

				SelectOption.loadPlaceType("typeid");//场所类型下拉选

//				 errorPlacement: function(error, element){ //指定错误信息位置
//		             var longitude = $('#longitude').attr('id'); //获取经度
//		             var latitude = $('#latitude').attr('id'); //获取纬度
//		             var id = element.attr('id');
//		             if(longitude == id || latitude == id){
//		                 var eid = element.attr('name'); //获取元素的name属性
//		                 error.appendTo($('.'+eid+'Div')); //将错误信息添加当前元素的父结点后面
//		             }else{
//		                 error.insertAfter(element);
//		             }
//				 },
			}
		},
		error : function() {
			parent.toast("初始化信息加载失败");
		}
	});
});

/*保存(新增或编辑)*/
function save(){
	$.ajax({
		type : "post",
		url : BASE_URL + "ems/emssucplace/save",
		data : $("#placeForm").serializeArray(),
		success : function(data) {
			if(data.success==true){
				parent.toast(data.msg);//弹出提示信息
				parent.getActiveIFrame().reloadGrid();//重新加载
				parent.closeWin();// 关闭弹出框
			}else{
				parent.toast(data.msg);
			}
		},
		error : function() {
			parent.toast("编辑失败");
		}
	});
}

function getQueryString(name)
{
     var reg = new RegExp("(^|&)"+ name +"=([^&]*)(&|$)");
     var r = window.location.search.substr(1).match(reg);
     if(r!=null)return  unescape(r[2]); return null;
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
//    parent.parent.openWin(BASE_URL+"/olgis/gisOperBuss/position?module=gis&type=edit&longitude="+longitude+"&latitude="+latitude+"&areaName="+areaName+"&register=null",'地理定位','50%','50%',false);  
}