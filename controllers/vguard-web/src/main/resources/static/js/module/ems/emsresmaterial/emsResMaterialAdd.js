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
    
    SelectOption.loadCapitalsource("capitalsource");//资金来源
    SelectOption.loadMaeUnittype("unittype");//单位类型
    SelectOption.loadRecoverable("recoverable");//是否可回收
    
    SelectOption.loadEquiptypemax("equiptypemaxid");
    var equiptypemaxid = $("#equiptypemaxid").attr("selectvalue");
    if(equiptypemaxid == ""){
        equiptypemaxid = "-1";
    }
    SelectOption.loadEquiptypemin("equiptypeminid",{"materialmaxid":equiptypemaxid});
    $("#equiptypemaxid").bind("change",function(){
        $("#equiptypeminid").html("");
        SelectOption.loadEquiptypemin("equiptypeminid",{"materialmaxid":$(this).val()});
    });
    
    
    //经、纬度验证
//    jQuery.validator.addMethod("validateitude", function(value, element) { 
//        var num =  /^\d+(\.\d{1,4})?$/;
//        return this.optional(element) || (num.test(value)); 
//    }, "请输入数字");
    
    $("#emsresmaterialform").validate({
        rules : {
            materialname : {
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
            equiptypemaxid : {
                required : true
            },
            equiptypeminid : {
                required : true
            },
            model : {
                required : true
            },
            num : {
                required : false,
                isNumber:true
            },
            unittype : {
                required : true
            },
            businessid : {
                required : true
            }/*,
            longitude: {
                required: true,
                validateitude: true,
                range:[107.16, 111.53]
            },
            latitude: {
                required: true,
                validateitude: true,
                range:[37.64, 41.67]
            }*/
        },
        messages : {
            materialnum : {
                required : "物资设备编号不能为空"
            },
            materialname : {
                required : "物资设备名称不能为空"
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
            equiptypemaxid : {
                required : "物资设备类别大类不能为空"
            },
            equiptypeminid : {
                required : "物资设备类别小类不能为空"
            },
            model : {
                required : "规格型号不能为空"
            },
            num : {
                required : "数量不能为空",
                isNumber:"请输入数字"
            },
            unittype : {
                required : "所属单位类型不能为空"
            },
            businessid : {
                required : "所属单位名称不能为空"
            }/*,
            longitude: {
                required: "经度不能为空",
                validateitude: "请输入小数且小数位最多4位",
                range:"经度输入范围在 {107.16} 到 {111.53} 之间的数值"
            },
            latitude: {
                required: "纬度不能为空",
                validateitude: "请输入小数且小数位最多4位",
                range: "纬度输入范围在 {37.64} 到 {41.67} 之间的数值"
            }*/
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
    });
});

/**保存*/
function save() {
    $.ajax({
        type : 'post',
        url : BASE_URL + '/ems/emsresmaterial/save',
        cache : false,
        dataType : 'json',
        data : $("#emsresmaterialform").serializeArray(),
        global : false,
        success : function(json) {
            if (json.success == true) {
                parent.toast(json.msg);
                //弹出提示信息
                var index = parent.getParentIndex();
                try{
                    window.top.frames["layui-layer-iframe"+index].reloadGrid();//刷新列表
                    parent.getActiveIFrame().reloadGrid();
                }catch(e){
                    parent.getActiveIFrame().reloadGrid();
                }
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

function buydatemaxDate(){
    var duetime = $("#duetime").val();// 到期日期
    var availdate = $("#availdate").val();//投入使用日期
    if(duetime == "" && availdate!=""){
        return availdate;     
    }else if(duetime!="" && availdate==""){
         return duetime;   
    }else if(duetime<availdate){
        return duetime;
    }else{
        return availdate;
    }
}

function availMinDate(){
    var buydate = $("#buydate").val();
    var producedate = $("#producedate").val();
     if(buydate == "" && producedate!=""){
        return producedate;     
    }else if(buydate!="" && producedate==""){
         return buydate;   
    }else if(buydate<producedate){
        return producedate;
    }else{
        return buydate;
    }
}

/**
 *每次改变单位类型，清空该值,如果还是应急应急物资类型，重新选择应急物资还会赋值的 
 */
$("#unittype").change(function(){
   $("#emsdeposid").val("");
   $('#unitname').val("");
   $('#businessid').val("");
});

/**
 *点击所属单位名称，根据单位类型，弹出不同单位列表 
 */
$("#unitname").on("click",function(){
    var unittype = $("#unittype").val();
    switch(unittype){
        case "0"://物资设备库  //true 说明弹出框是 选择具体某一条数据的
            loadEmsResDepos();
        break;
        case "1"://企业
            loadEnt();
        break;
        case "2"://救援队伍
           loadEmsresteam();
        break;
    } 
});
/**
 *求援队伍 
 */
function loadEmsresteam(){
    /**
     * 加载企业
     */
    window.top.GEventObject.on('LOAD_ENT_EVENT', function(rowdata) {
        $('#businessid').val(rowdata.TEAMID);
        $('#unitname').val(rowdata.TEAMNAME);
        $('#unitname').blur();
        window.top.GEventObject.die('LOAD_ENT_EVENT');
    });
    parent.openWin(BASE_URL+"/ems/emsresteam/true",' 求援队伍','65%','70%');
}

/**
 *弹出选择企业框 
 */
function loadEnt(){
    /**
     * 加载企业
     */
    window.top.GEventObject.on('LOAD_ENT_EVENT', function(rowdata) {
        $('#businessid').val(rowdata.BUSINESSINFOID);
        $('#unitname').val(rowdata.ENTNAME);
        $('#unitname').blur();
        window.top.GEventObject.die('LOAD_ENT_EVENT');
    });
    parent.openWin(BASE_URL+"/law/lawcheckinfo/entinfo?planid=null",' 企业信息','65%','70%');
}

/**
 *弹出应急仓库列表 选择 
 */
function loadEmsResDepos(){
    /**
     *先执行die方法，在执行on方法，解决 弹出框先关闭，在在打开 选择后不能关闭弹出框bug 
     */
    window.top.GEventObject.die('LOAD_ENT_EVENT');
    window.top.GEventObject.on('LOAD_ENT_EVENT', function(rowdatas) {
        $("#unitname").val(rowdatas.STOREHOUSE);
        $('#businessid').val(rowdatas.EMSDEPOSID);
        $("#emsdeposid").val(rowdatas.EMSDEPOSID);
        $('#unitname').blur();
    });
    parent.openWin(BASE_URL+'/ems/emsresdepos/true','物资设备库','65%','75%');
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
    parent.parent.openWin(BASE_URL+"/olgis/gisOperBuss/position?module=gis&type=edit&longitude="+longitude+"&latitude="+latitude+"&areaName="+areaName+"&register=null",'地理定位','50%','50%',false);  
}