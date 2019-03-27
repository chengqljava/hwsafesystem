$(document).ready(function() {
	
	if($("#unitclass").val()=='ent')
		SelectTree.loadDistrictAllSelect("districtname");//全部行政区域下拉树 
	else if($("#unitclass").val()=='gov')
		SelectTree.loadSelfDistrictSelect("districtname");//当前机构下行政区域下拉树 
	
	var validateOpts = {
	        rules : {
	        	teamname : {required : true, maxlength : 50},
	/*        	businessinfoid : {required : true, maxlength : },*/
	        	teamstats : {required : true, maxlength : 2},
	        	teamtypeid : {required : true, maxlength : 2},
	        	teamrank : {required : true, maxlength : 2},
	        	teamindustry : {required : true, maxlength : 2},
	        	rescueprofession : {required : true, maxlength : 25},
	        	districtid : {required : true, maxlength : 50},
	        	servicearea : {required : true, maxlength : 25},
	/*        	foundedtime : {maxlength : },*/
	        	superadmin : {maxlength : 16},
	        	dealtype : {required : true, maxlength : 2},
	        	longitude : {required : true,  validateitude: true/*,range: [107.16, 111.53]*/ },
	        	latitude : {required : true, validateitude: true/*,range: [37.64, 41.67]*/ },
	        	responseper : {required : true, maxlength : 16},
	        	mobiletel : {required : true, isPhone : true},
	        	officetel : {required : true, isTelephone: true},
	        	dutytel : {required : true, isTelephone: true},
	        	dutyfax : {required : true, isTelephone: true},
	        	entaddress : {required : true, maxlength : 100},
	        	teamqualify : {maxlength : 2},
	        	teamlevel : {maxlength : 2},
	        	standardlev : {maxlength : 2},
	        	certificatenum : {maxlength : 32},
	/*        	awarddate : {required : true, maxlength : },
	        	indate : {required : true, maxlength : },
	        	enddate : {required : true, maxlength : },*/
	        	awardunit : {maxlength : 25},
	        	totalnum : {required : true, digits : true},
	        	commandnum : {required : true, digits : true},
	        	fulltimenum : {digits : true},
	        	parttimenum : {digits : true},
	        	squadronnum : {digits : true},
	        	squadronstay : {digits : true},
	        	squadnum : {digits : true},
	        	supportnum : {digits : true},
	        	vehiclenum : {required : true, digits : true},
	        	equipmentdesc : {maxlength : 250},
	        	professiondesc : {maxlength : 250},
	        	fillorgan : {maxlength : 50},
	        	notes : {maxlength : 250}
	        },
	        messages : {
	        	teamname : {required : "队伍名称不能为空", maxlength : "长度不能超过50"},
	        	/*        	businessinfoid : {required : true, maxlength : },*/
	        	teamstats : {required : "队伍属性不能为空", maxlength : "长度不能超过2"},
	        	teamtypeid : {required : "队伍类型不能为空", maxlength : "长度不能超过2"},
	        	teamrank : {required : "队伍级别不能为空", maxlength : "长度不能超过2"},
	        	teamindustry : {required : "队伍适用行业不能为空", maxlength : "长度不能超过2"},
	        	rescueprofession : {required : "队伍救援专业不能为空", maxlength : "长度不能超过25"},
	        	districtid : {required : "行政区划不能为空", maxlength : "长度不能超过50"},
	        	servicearea : {required : "服务区域不能为空", maxlength : "长度不能超过25"},
	        	/*        	foundedtime : {maxlength : },*/
	        	superadmin : {maxlength : "长度不能超过16"},
	        	dealtype : {required : "擅长处理事故类型不能为空", maxlength : "2"},
	        	longitude : { required: "经度不能为空",  validateitude: "请输入小数且小数位最多4位"/*,range: "经度输入范围在 {107.16} 到 {111.53} 之间的数值"*/},
	        	latitude : {required: "纬度不能为空", validateitude: "请输入小数且小数位最多4位"/*,range: "纬度输入范围在 {37.64} 到 {41.67} 之间的数值"*/ },
	        	responseper : {required : "主要负责人不能为空", maxlength : "长度不能超过16"},
	        	mobiletel : {required : "移动电话不能为空", isPhone : "格式不正确"},
	        	officetel : {required : "办公电话不能为空", isTelephone : "格式不正确"},
	        	dutytel : {required : "应急值班电话不能为空", isTelephone : "格式不正确"},
	        	dutyfax : {required : "传真不能为空", isTelephone : "格式不正确"},
	        	entaddress : {required : "单位地址不能为空", maxlength : "长度不能超过100"},
	        	teamqualify : {maxlength : "长度不能超过2"},
	        	teamlevel : {maxlength : "长度不能超过2"},
	        	standardlev : {maxlength : "长度不能超过2"},
	        	certificatenum : {maxlength : "长度不能超过32"},
	        	/*        	awarddate : {required : true, maxlength : },
	        	        	indate : {required : true, maxlength : },
	        	        	enddate : {required : true, maxlength : },*/
	        	awardunit : {maxlength : "长度不能超过25"},
	        	totalnum : {required : "总人数不能为空", digits : "只能为数字"},
	        	commandnum : {required : "指挥人数不能为空", digits : "只能为数字"},
	        	fulltimenum : {digits : "只能为数字"},
	        	parttimenum : {digits : "只能为数字"},
	        	squadronnum : {digits : "只能为数字"},
	        	squadronstay : {digits : "只能为数字"},
	        	squadnum : {digits : "只能为数字"},
	        	supportnum : {digits : "只能为数字"},
	        	vehiclenum : {required : "车辆数不能为空", digits : "只能为数字"},
	        	equipmentdesc : {maxlength : "长度不能超过250"},
	        	professiondesc : {maxlength : "长度不能超过250"},
	        	fillorgan : {maxlength : "长度不能超过50"},
	        	notes : {maxlength : "长度不能超过250"}        	
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
    	$("#emsresteamform").validate(validateOpts);
    });
});

var delAttachIdArr = [];

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

/**
 * 增加一行附件
 * @param fileid
 */
function addAttach(fileid){
	var td = 'td'+fileid;
	var divlen = $("#"+td+" div.zwUpload").length;

	var divid = '_'+fileid+'_'+divlen;
	var div = '<div class="zwUpload" id="'+divid+'"></div>';
	var bntdelid = divid+'_bnt';
	var btndel = '<button type="button" id="'+bntdelid+'" onclick="delAttach(\''+divid+'\')">删除</button>';
	$('#'+td).append(div).append(btndel);
	showUploadFile(divid,'file',true);//显示文件上传控件	
	// 给input type添加onchange事件 
	// 当附件为空时，显示提示；反之删除提示
	//$("input[name^=file]").on('change',checkAttach(fileid));
	$("#uploadFile"+divid).on('change',function(){
		// 原附件个数
		var len = $("#td"+fileid+" div a").length;

		//获取file的全部id  
		var uplist = $("input[id^=uploadFile_"+fileid+"]");  
		var arrId = [];  
		for (var i=0; i< uplist.length; i++){
			if(uplist[i].value.length>50){
//				console.log($("#"+'_'+fileid+'_'+i+"_bnt").next("#errorMsg").length);
				if($("#"+'_'+fileid+'_'+i+"_bnt").next("#fileNameLen"+fileid+"_"+i).length == 0){
					$("#"+'_'+fileid+'_'+i+"_bnt").after("<div id='fileNameLen"+fileid+"_"+i+"'><font color='red'>文件名称太长</font></div>");
				}
			}else{
				if($("#"+'_'+fileid+'_'+i+"_bnt").next("#fileNameLen"+fileid+"_"+i).length != 0){
					$("#"+'_'+fileid+'_'+i+"_bnt").next().remove();
				}
			}
			if(uplist[i].value){  
				arrId[i] = uplist[i].id;  
			}  
		}
		
	});
}

/**保存*/
function save(){
	
	//删除的附件
	$('#delAttachIds').val(delAttachIdArr);
	
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
		url : BASE_URL + '/ems/emsresteam/save',
		secureuri:false,
	    files : arrId,
		cache : false,
		dataType : 'json',
		data : $("#emsresteamform").serializeArray(),
		global : false,
		success : function(json) {
			if(json.success==true){
				parent.toast(json.msg);//弹出提示信息
//				var index = parent.getParentIndex();
//				parent.frames["layui-layer-iframe"+index].frames["contentIframe"].reloadGrid();//刷新列表
				parent.parent.getActiveIFrame().reloadGrid();//刷新列表
				parent.closeWin();// 关闭弹出框
			}else{
				parent.toast(json.msg);
				$('#fileUploadDiv').empty();
				showUploadFile('fileUploadDiv','file');//显示文件上传控件
			}
		},
		error : function() {
			parent.toast("保存失败");
		}
	});
}


/**
 * 删除数据库中已经保存的附件
 * @param id
 */
function deleteOldAttach(id,fileid){
	$('#'+id).remove();
	delAttachIdArr.push(id);
}

/**
 * 删除附件
 * @param id
 */
function delAttach(id){
	$('#'+id).remove();
	$('#'+id+'_bnt').remove();
}
