/*新增或编辑课程管理*/
$(function () {
	var transtoolid = getQueryString("transtoolid");
	$("#transForm").validate({
			rules: {
				transtoolcode: {
					required: true
				},
				transtoolname: {
					required: true
				},
				usecodeid:{
					required: true
				},
				resppertel: {
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
				transtoolcode: {
					required: "运输工具编码不能为空"
				},
				transtoolname: {
					required: "运输工具名称不能为空"
				},
				usecodeid:{
					required: "日常用途不能为空"
				},
				resppertel: {
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
		});
	
	//查询
	$.ajax({
		type : "post",
		url : BASE_URL + "ems/emsrestranstool/load",
		dataType : "json",
		data :{
			transtoolid:transtoolid
		},
		success : function(data) {
			if (data) {
				var transTpt = _.template($("#transTpt").html());
				$("#transForm").html(transTpt(data));
				SelectOption.loadUsualUse("usecodeid");//场所类型下拉选
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
		url : BASE_URL + "ems/emsrestranstool/save",
		data : $("#transForm").serializeArray(),
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