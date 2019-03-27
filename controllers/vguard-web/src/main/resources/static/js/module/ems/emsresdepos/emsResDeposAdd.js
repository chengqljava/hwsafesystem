$(document).ready(function() {
    //行政区域(市)下拉框
    SelectOption.loadDistrict("city",{"districtlevel":"0"}); //0:市级
    if($('#city').attr('selectvalue')!=""){
        //行政区域(区县)下拉框
        $('#area').attr("disabled",false); //将区县打开
        SelectOption.loadDistrict("area",{"districtlevel":"1","districtcode":$('#city').attr('selectvalue')}); //1:区县级
    }
    if($('#area').attr('selectvalue')!=""){
         //行政区域(街道办)下拉框
         $('#street').attr("disabled",false); //将区县打开
         SelectOption.loadDistrict("street",{"districtlevel":"2","districtcode":$('#area').attr('selectvalue')}); //2:区县级
    }
    if($('#street').attr('selectvalue')!=""){
        //行政区域(街道办)下拉框
        $('#community').attr("disabled",false); //将区县打开
        SelectOption.loadDistrict("community",{"districtlevel":"3","districtcode":$('#street').attr('selectvalue')}); //3:社区
    }
    SelectOption.loadMaeDeposGrade("grade");//物资库级别
    SelectOption.loadMaeMaterialtype("materialtype");//存储物质库类型
    
    //经、纬度验证
    jQuery.validator.addMethod("validateitude", function(value, element) { 
        var num =  /^\d+(\.\d{1,4})?$/;
        return this.optional(element) || (num.test(value)); 
    }, "请输入数字");
    
    var validateOpts = {
            rules : {
                storehouse : {
                    required : true
                },
                city : {
                    required : true
                },
                area : {
                    required : true
                },
                street : {
                    required : true
                },
                community : {
                    required : true
                },
                address : {
                    required : true
                },
                materialtype : {
                    required : true
                },
                grade : {
                    required : true
                },
                capacity : {
                    required : true,
                    isNumber:true,
                },
                capacityunit : {
                    required : true
                },
                dutytel : {
                    required : true,
                    isTel:true
                },
                longitude: {
                    required: true,
                    validateitude: true
                    /*range:[107.16, 111.53]*/
                },
                latitude: {
                    required: true,
                    validateitude: true
                    /*range:[37.64, 41.67]*/
                },
                principalone : {
                    required : true
                },
                officetelone : {
                    required : true,
                    isTel:true
                },
                mobileone : {
                    required : true,
                    isMobile:true
                },
                postcodeone : {
                    required : true,
                    isEmail:true
                },
                officeteltwo:{
                    required : false,
                    isTel:true
                },
                mobileonetwo:{
                    required : false,
                    isMobile:true
                },
                postcodetwo:{
                    required : false,
                    isEmail:true
                }
            },
            messages : {
                storehouse : {
                    required : "仓库名称不能为空"
                },
                city : {
                    required : "市不能为空"
                },
                area : {
                    required : "区县不能为空"
                },
                street : {
                    required : "街道不能为空"
                },
                community : {
                    required : "社区不能为空"
                },
                address : {
                    required : "仓库地址不能为空"
                },
                materialtype : {
                    required : "存储物质库类型不能为空"
                },
                grade : {
                    required : "物质库级别不能为空"
                },
                capacity : {
                    required : "库容不能为空",
                    isNumber:"请输入数字"
                },
                capacityunit : {
                    required : "库容单位不能为空"
                },
                dutytel : {
                    required : "应急值班电话不能为空",
                    isTel:"电话错误"
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
                principalone : {
                    required : "第一负责人不能为空"
                },
                officetelone : {
                    required : "办公电话不能为空",
                    isTel:"电话错误"
                },
                mobileone : {
                    required : "手机不能为空",
                    isMobile:"手机号错误"
                },
                postcodeone : {
                    required : "邮箱不能为空",
                    isEmail:"邮箱错误"
                },
                officeteltwo:{
                    isTel:"电话错误"
                },
                mobileonetwo:{
                    isMobile:"手机号错误"
                },
                postcodetwo:{
                    isEmail:"邮箱错误"
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
//    	console.log(validateOpts);
    	$("#emsresdeposform").validate(validateOpts);
    });
});

/**保存*/
function save() {
    $.ajax({
        type : 'post',
        url : BASE_URL + '/ems/emsresdepos/save',
        cache : false,
        dataType : 'json',
        data : $("#emsresdeposform").serializeArray(),
        global : false,
        success : function(json) {
            if (json.success == true) {
                parent.toast(json.msg);
                //弹出提示信息
                parent.getActiveIFrame().reloadGrid();
                //刷新列表
                parent.closeWin();
                // 关闭弹出框
            } else {
                parent.toast(json.msg);
            }
        },
        error : function() {
            parent.toast("保存失败");
        }
    });
}


/**
 * 选择市
 */
function selectCity(){
    var districtcode = $('#city').val();
    $('#area').empty();
    $('#street').empty();
    $('#community').empty();
    
    $('#directortypename').attr("disabled",true);
    $('#directortypename').val("");
    $('#directortypename_select').remove();
    if(districtcode!=null && districtcode!=""){
        $('#area').attr("disabled",false); //将区县打开
        //行政区域(区县)下拉框
        SelectOption.loadDistrict("area",{"districtlevel":"1","districtcode":districtcode}); //1:区县
    }else{
        $('#area').attr("disabled",true); 
        $('#street').attr("disabled",true); 
        $('#community').attr("disabled",true); 
        $('#directortypeid').attr("disabled",true);
    }
}

/**
 * 选择区县
 */
function selectArea(){
    var districtcode = $('#area').val();
    $('#street').empty();
    $('#community').attr("disabled",true); 
    $('#community').empty();
    
    $('#directortypename').attr("disabled",true);
    $('#directortypename').val("");
    $('#directortypename_select').remove();
    if(districtcode!=null && districtcode!=""){
        $('#street').attr("disabled",false); //将区县打开
        //行政区域(区县)下拉框
        SelectOption.loadDistrict("street",{"districtlevel":"2","districtcode":districtcode}); //2:区县
    }else{
        $('#street').attr("disabled",true);
        $('#community').attr("disabled",true);
    }
}

/**
 * 选择街道办
 */
function selectStreet(){
    var districtcode = $('#street').val();
    $('#community').empty();
    
    $('#directortypename').attr("disabled",true);
    $('#directortypename').val("");
    $('#directortypename_select').remove();
    if(districtcode!=null && districtcode!=""){
        $('#community').attr("disabled",false);
        //行政区域(区县)下拉框
        SelectOption.loadDistrict("community",{"districtlevel":"3","districtcode":districtcode}); //3:社区
    }else{
        $('#community').attr("disabled",true);
    }
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