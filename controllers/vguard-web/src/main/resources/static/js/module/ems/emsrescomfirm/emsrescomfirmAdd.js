/*新增或编辑课程管理*/
$(function () {
	var firmid = getQueryString("firmid");
	$("#comfirmForm").validate({
			rules: {
				firmname: {
					required: true
				},
				typecodeid: {
					required: true
				},
				levelcode:{
					required: true
				},
				classcode: {
					required: true
				},
				districtcode:{
					required: true
				},
				address: {
					required: true
				},
				dutytel:{
					required: true
				},
				postcode: {
					digits: true
				},
				contactmtel: {
					isPhone:true
				},
				commvehnum: {
					digits: true
				},
				powervehnum: {
					digits: true
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
				firmname: {
					required: "企业名称不能为空"
				},
				typecodeid: {
					required: "资源保障类型不能为空"
				},
				levelcode:{
					required: "级别不能为空"
				},
				classcode: {
					required: "密级不能为空"
				},
				districtcode:{
					required: "行政区域不能为空"
				},
				address: {
					required: "地址不能为空"
				},
				dutytel:{
					required: "值班电话不能为空"
				},
				postcode: {
					digits: "请输入正整数"
				},
				contactmtel: {
					isPhone: "请输入正确手机格式"
				},
				commvehnum: {
					digits: "请输入正整数"
				},
				powervehnum: {
					digits: "请输入正整数"
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
		});
	
	//查询
	$.ajax({
		type : "post",
		url : BASE_URL + "ems/emsrescomfirm/load",
		dataType : "json",
		data :{
			firmid:firmid
		},
		success : function(data) {
			if (data) {
				var comfirmTpt = _.template($("#comfirmTpt").html());
				$("#comfirmForm").html(comfirmTpt(data));
				SelectTree.loadComfirmTypeTree("typecodeid");// 通讯保障节点树
				SelectTree.loadDistrictAllSelect("districtcode");// 行政区域
				SelectOption.loadLevel("levelcode");// 级别下拉框
				SelectOption.loadSecrecyclass("classcode");// 密级下拉框
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
		url : BASE_URL + "ems/emsrescomfirm/save",
		data : $("#comfirmForm").serializeArray(),
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