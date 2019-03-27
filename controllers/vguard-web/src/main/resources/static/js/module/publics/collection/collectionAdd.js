
$(function () {		
	var cid = getQueryString("cid");
	var isDisplay = getQueryString("isDisplay");
	
	$("#collectionForm").validate({
		rules: {
			collectname:{
				required:true
			},
			collectcode:{
				required:true
			},
			totalgarbage:{
				required: true,
				isNumber: true,
		    	mRessureCheck:true
			},
			telphone:{
				isPhone:true
			}
		},
		messages: {
			collectname:{
				required: "设施名称不能为空"
			},
			collectcode:{
				required: "设施编号不能为空"
			},
			totalgarbage:{
				required: "生活垃圾总量预测不能为空",
				isNumber: "请输入正确的数字格式",
		        mRessureCheck:"请输入1位整数，至多保留2位小数"
			},
			telphone:{
				isPhone:"请输入正确的手机号码格式"
			}
		},
		submitHandler:function(form){
			save();
		}   
	});
	
	$.ajax({
		type : "post",
		url : BASE_URL + "publics/publiccollection/load/"+cid,
		dataType : "json",
		data :{},
		success : function(data) {
			if (data) {
				
		
				if (data.garbagestation == '0') {
					data.garbagestationType = "是";//是否有垃圾转运站
				}else {
					data.garbagestationType = "否";//是否有垃圾转运站
				}
				
				if (data.washroom == "0") {
					data.washroomType = "是";//是否有公共厕所
				}else{
					data.washroomType = "否";//是否有公共厕所
				}
				
				if (data.garbagecollection=='0') {
					data.garbagecollectionType = "是";//是否有垃圾收集箱
				}else{
					data.garbagecollectionType = "否";//是否有垃圾收集箱
				}
				
				console.log(data);
				var collectionTpt = _.template($("#collectionTpt").html());
				$("#collectionForm").html(collectionTpt(data));
				
				var attachList = data.attachs;//附件
	             var downloadurl = BASE_URL + 'publics/publicattachment/download/';
	             if (isDisplay == "isDisplay") {
	            	 showChooseFiles('fileDiv', attachList, downloadurl, false);
				}else{
					showMultipleInputFile("fileDiv","waterfile","file",attachList, downloadurl, true);
				}
			}
		},
		error : function() {
			parent.toast("加载失败");
		}
	});
		
	

});

function getQueryString(name)
{
     var reg = new RegExp("(^|&)"+ name +"=([^&]*)(&|$)");
     var r = window.location.search.substr(1).match(reg);
     if(r!=null)return  unescape(r[2]); return null;
}

/**
 * 保存
 * @returns
 */
	
function save() {
	var dangerId;
    var uplist = $("input[name^=file]");
    var arrId = [];
    for (var i = 0; i < uplist.length; i++) {
        if (uplist[i].value) {
            arrId[i] = uplist[i].id;
        }
    }
    $.ajaxFileUpload({
        type: "post",
        url: BASE_URL + "publics/publiccollection/save",
        files: arrId,
        async: false,
        data: $("#collectionForm").serializeArray(),
        dataType: "json",
        success: function (data) {
        	if (data.success == true) {
        		parent.toast("保存成功");//弹出提示信息
                parent.getActiveIFrame().reloadGrid();//重新加载
                parent.closeWin();// 关闭弹出框
            } else {
                parent.toast(data.msg);
            }
        },
        error: function (XMLHttpRequest, textStatus, errorThrown) {
        	console.log(textStatus);
            parent.toast("提交失败");
        }
    });
}

/**
 * 定位
 */
function position(){
    var longitude;
    var latitude;
    var isDisplay = $("#isDisplay").val();
    
    //当编辑地图点位时
    if ("0" == isDisplay) {
    	longitude = encodeURIComponent($('#longitude').val());
    	latitude= encodeURIComponent($('#latitude').val());
    	window.top.GEventObject.die("LOAD_BDMAPPT_EVENT");
    	window.top.GEventObject.on("LOAD_BDMAPPT_EVENT", function(param) {
    		$('#longitude').val(param.lng);
    		$('#latitude').val(param.lat);
    	});
    } else {
    	longitude = encodeURIComponent($('#longitude').text());
    	latitude= encodeURIComponent($('#latitude').text());
    }
    parent.parent.openWin(BASE_URL + "/views/module/ems/common/emsMapLoc.html?lng=" + longitude + "&lat=" + latitude + "&isDisplay="+ isDisplay, "地理定位", "50%", "50%", false);
//    parent.parent.openWin(BASE_URL+"/olgis/gisOperBuss/position?module=gis&type=edit&longitude="+longitude+"&latitude="+latitude+"&areaName="+areaName+"&register=null",'地理定位','50%','50%',false);  
}
