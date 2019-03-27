$(document).ready(function() {
	
	// 查询
	$.ajax({
		type : "post",
		url : BASE_URL + "ems/emsresshelter/load/"+GetQueryString("shelterid"),
		data : {},
		success : function(data) {
			if (data) {
				var emsShelterTpt = _.template($("#emsShelterTpt").html());
				$("#emsShelterForm").html(emsShelterTpt(data));
				
				SelectTree.loadRescueType("rescuetypecode",{"parentcode":"47"});// 医疗机构节点树
				SelectOption.loadLevel("levelcode");// 级别下拉框
				SelectOption.loadSecrecyclass("classcode");// 密级下拉框
				SelectTree.loadDistrictAllSelect("districtcode");// 行政区域
				
				var validateOpts = {
						rules: {
							sheltername: {
								required: true,
							},
							rescuetypecode: {
								required: true,
							},
							levelcode: {
								required: true,
							},
							postcode: {
								isZipCode: true,
							},
							classcode: {
								required: true,
							},
							districtcode: {
								required: true,
							},
							address: {
								required: true,
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
							},
							dutytel: {
								required: true,
								isPhone:true
							}
						},
						messages: {
							sheltername: {
								required: "避难场所名称不能为空"
							},
							rescuetypecode: {
								required: "医疗机构类型不能为空"
							},
							levelcode: {
								required: "级别不能为空"
							},
							postcode: {
								isZipCode: "邮编格式不正确"
							},
							classcode: {
								required: "密级不能为空"
							},
							districtcode: {
								required: "行政区域不能为空"
							},
							address: {
								required: "地址不能为空"
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
				            },
							dutytel: {
								required: "值班电话不能为空",
								isPhone:"请输入正确手机格式"
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
			    	$("#emsShelterForm").validate(validateOpts);
			    });
			}
		}
	});
});

/* 保存(新增或编辑) */
function save(){
	$.ajax({
		type : 'post',
		url : BASE_URL + 'ems/emsresshelter/save',
		cache : false,
		dataType : 'json',
		data : $("#emsShelterForm").serializeArray(),
		global : false,
		success : function(json) {
			parent.toast(json.msg);// 弹出提示信息
			parent.getActiveIFrame().reloadGrid();// 重新加载
			parent.closeWin();// 关闭弹出框
		},
		error : function() {
			parent.toast("保存失败");
		}
	});
}
function GetQueryString(name)
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
