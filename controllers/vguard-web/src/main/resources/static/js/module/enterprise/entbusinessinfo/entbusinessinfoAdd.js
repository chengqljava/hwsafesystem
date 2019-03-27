$(document).ready(function () {
    //加载部门树
    loadOrgTree("orgtree");

    //行政区域(市)下拉框
    SelectOption.loadDistrict("city", {"districtlevel": "0"}); //0:市级

    //SelectOption.loadAddressType("entaddress"); //1:办公地址,2:生产经营地址

    //单位管辖隶属关系
    SelectOption.loadSubjection("subjection");
    //邮政编码
    jQuery.validator.addMethod("postcode", function (value, element) {
        var length = value.length;
        var postcode = /^[0-9]{6}$/;
        return this.optional(element) || (length == 6 && postcode.test(value));
    }, "邮政编码格式错误");

    //手机号码验证
    jQuery.validator.addMethod("mobile", function (value, element) {
        return this.optional(element) || /^\d{11}$/.test(value);
    }, "手机号码格式错误");

    //数字验证
    jQuery.validator.addMethod("num", function (value, element) {
        var num = /^[0-9]+$/;
        return this.optional(element) || (num.test(value));
    }, "请输入数字");

    //经、纬度验证
    jQuery.validator.addMethod("validateitude", function (value, element) {
        var num = /^\d+(\.\d{1,4})?$/;
        return this.optional(element) || (num.test(value));
    }, "请输入数字");

    //时间比对
    jQuery.validator.addMethod("comparedate", function (value, element) {
        var validstartdate = $('#validstartdate').val();
        var validenddate = $('#validenddate').val();
        var datestart = "";
        var dateend = "";
        if (validstartdate != null && validstartdate != "") {
            datestart = new Date(validstartdate.replace(/-/g, "/"));
        }

        if (validenddate != null && validenddate != "") {
            dateend = new Date(validenddate.replace(/-/g, "/"));
        }
        if (dateend != null && dateend != "") {
            return dateend >= datestart;
        } else {
            return true;
        }
    }, "营业期限结束日期必须大于开始日期");

    // 字符验证
    jQuery.validator.addMethod("stringCheck", function (value, element) {
        return this.optional(element) || /^[a-zA-Z0-9]+$/.test(value);
    }, "只能包括字母、数字");

    //行业主管部门不能为空
    jQuery.validator.addMethod("ztreecheck", function (value, element) {
        var treeObj = $.fn.zTree.getZTreeObj("orgtree");
        var nodes = treeObj.getCheckedNodes(true);
        if (nodes.length > 0) {
            return true;
        } else {
            return false;
        }
        return true;
    }, "行业主管部门不能为空");
    
    var validateOpts = {
            rules: {
                entname: {
                    required: true,
                    rangelength: [2, 100],
                    blankcheck: true,
                    isContainsSpecialChar: true,
                    remote: {
                        url: BASE_URL + "/system/sysuser/existsUser",     //后台处理程序
                        type: "post",               //数据发送方式
                        dataType: "json",           //接受数据格式
                        data: {                     //要传递的数据
                            username: function () {
                                return $("#entname").val();
                            }
                        }
                    }
                },
                entcode: {
                    stringCheck: true,
                },
                city: {
                    required: true
                },
                area: {
                    required: true
                },
                street: {
                    required: true
                },
                community: {
                    required: true
                },
                postcode: {
//                    required: true,
                    postcode: true
                },
//                naissancedate: {
//                    required: true
//                },
//                validstartdate: {
//                    required: true
//                },
                validenddate: {
                    comparedate: true
                },
//                address: {
//                    required: true
//                },
//                enttype: {
//                    required: true
//                },
//                legalperson: {
//                    required: true
//                },
                phone: {
//                    required: true,
                    mobile: true
                },
                registernum: {
//                    required: true,
                    stringCheck: true,
                    remote: {
                        url: BASE_URL + '/enterprise/entbusinessinfo/existsRegisternum', //后台处理程序
                        type: "post",
                        dataType: "json",
                        data: {
                            //要传递的数据
                            businessinfoid: function () {
                                return $("#businessinfoid").val();
                            },
                            registernum: function () {
                                return $("#registernum").val();
                            }
                        }
                    }
                },
                registermoney: {
//                    required: true,
                    isNumber: true
                },
//                mainproduct: {
//                    required: true
//                },
//                directortypename: {
//                    required: true,
//                },
//                islittle: {
//                    required: true
//                },
//                isscale: {
//                    required: true
//                },
//                subjection: {
//                    required: true
//                },
                longitude: {
//                    required: true,
                    validateitude: true
                    /*, range: [107.16, 111.53]*/
                },
                latitude: {
//                    required: true,
                    validateitude: true
                    /*, range: [37.64, 41.67]*/
                }
//                , industryorg: {
//                    ztreecheck: true
//                }
            },
            messages: {
                entname: {
                    required: "企业名称不能为空",
                    rangelength: "请输入2-100个字符",
                    remote: "该企业已注册!"
                },
                entcode: {
                    stringCheck: "只能包括字母、数字",
                },
                city: {
                    required: "请选择市"
                },
                area: {
                    required: "请选择区县"
                },
                street: {
                    required: "请选择街道办"
                },
                community: {
                    required: "请选择社区"
                },
                postcode: {
//                    required: "邮政编码不能为空",
                    postcode: "邮政编码格式错误"
                },
//                naissancedate: {
//                    required: "成立日期不能为空"
//                },
//                validstartdate: {
//                    required: "营业期限日期不能为空"
//                },
                validenddate: {
                    comparedate: "营业期限结束日期必须大于开始日期"
                },
//                address: {
//                    required: "注册地址不能为空"
//                },
//                enttype: {
//                    required: "登记注册类型不能为空"
//                },
//                legalperson: {
//                    required: "法定代表人不能为空"
//                },
                phone: {
//                    required: "手机号码不能为空",
                    mobile: "手机号码格式错误"
                },
                registernum: {
//                    required: "注册号/统一社会信用代码不能为空",
                    stringCheck: "只能包括字母、数字",
                    remote: "注册号/统一社会信用代码已存在!"
                },
                registermoney: {
//                    required: "注册资本不能为空",
                    isNumber: "注册资本为整数和浮点数"
                },
//                mainproduct: {
//                    required: "经营范围不能为空"
//                },
//                directortypename: {
//                    required: "行业主管分类不能为空"
//                },
//                islittle: {
//                    required: "请选择是否三小场所"
//                },
//                isscale: {
//                    required: "请选择是否规模企业"
//                },
//                subjection: {
//                    required: "请选择单位管辖隶属关系"
//                },
                longitude: {
//                    required: "经度不能为空",
                    validateitude: "请输入小数且小数位最多4位"/*,
                    range: "经度输入范围在 {107.16} 到 {111.53} 之间的数值"*/
                    //,range:"经度输入范围在 {120.79} 到 {121.31} 之间的数值"
                },
                latitude: {
//                    required: "纬度不能为空",
                    validateitude: "请输入小数且小数位最多4位"/*,
                    ,range: "纬度输入范围在 {30.97} 到 {31.36} 之间的数值"
                    range: "纬度输入范围在 {37.64} 到 {41.67} 之间的数值"*/
                }
            },
            errorPlacement: function (error, element) { //指定错误信息位置
                if (element.is(':radio') || element.is(':checkbox')) { //如果是radio或checkbox
                    var eid = element.attr('name'); //获取元素的name属性
                    error.appendTo($('.' + eid + 'Div')); //将错误信息添加当前元素的父结点后面
                } else {
                    var validstartdate = $('#validstartdate').attr('id'); //获取的开始时间id
                    var validenddate = $('#validenddate').attr('id'); //获取的结束时间id
                    var longitude = $('#longitude').attr('id'); //获取经度
                    var latitude = $('#latitude').attr('id'); //获取纬度
                    var id = element.attr('id');
                    if (validenddate == id || validstartdate == id) {
                        var eid = element.attr('name'); //获取元素的name属性
                        error.appendTo($('.validenddateDiv')); //将错误信息添加当前元素的父结点后面
                    } else if (longitude == id || latitude == id) {
                        var eid = element.attr('name'); //获取元素的name属性
                        error.appendTo($('.' + eid + 'Div')); //将错误信息添加当前元素的父结点后面
                    }
                    else {
                        error.insertAfter(element);
                    }
                }
            },
            submitHandler: function (form) {
                //$('#entbtn').attr('disabled',true);//设置disabled属性为true，按钮不可用
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
    	$("#entbusinessinfoform").validate(validateOpts);
    });
});

var attachfiles = 1;
var InputsWrapper = $(".InputsWrapper");
var AddButton = $("#AddMoreFileBox");
var x = InputsWrapper.length;
$(AddButton).click(function (e) {
    if (attachfiles != 0) {
        $('#trInsert0 td')[0].rowSpan = attachfiles + 1;
        var newRow = attfile.insertRow();
        var col1 = newRow.insertCell(0);
        var col2 = newRow.insertCell(1);
        newRow.setAttribute('id', 'trInsert' + attachfiles);
        col1.innerHTML = '<td><select id="entAddresses[' + attachfiles + '].addresstype" name="entAddresses[' + attachfiles + '].addresstype" class="form-control"><option>请选择</option><option value="1">办公地址</option><option value="2">生产经营地址</option></select></td>';
        col2.innerHTML = '<td><div class="rowtop"><input type="text" id="entAddresses[' + attachfiles + '].addressname" name="entAddresses[' + attachfiles + '].addressname" value="" class="form-control"  maxlength="50" style="width:80%;float:left"><input type="button" class="btn btn-danger" onclick="delInput(trInsert' + attachfiles + ')" value="删除行" style="float:left;margin-left:10px;"/></div></td>';
        col2.colSpan = '2';
        $('#trInsert0').after(newRow);
        attachfiles++;
    }
});

function delInput(id) {
    $(id).empty();
    var ss = $('#trInsert td')[0].rowSpan;
    if (ss > 1) {
        $('#trInsert td')[0].rowSpan = ss - 1;
        ss--;
    } else {
        $('#trInsert td')[0].rowSpan = 1;
    }
};


/**
 * 营业期限结束时间勾选validenddate-error
 */
function enddataclick(obj) {
    //营业结束时间
    if (obj.checked) {
        //无限期
        if ($("#validenddate-error")) {
            $("#validenddate-error").remove();//删除营业时间验证信息
        }
        $("#isvalid").val(0); //表示勾上,无期限
        $("#validenddate").val("");
        $('#validenddate').attr('disabled', true);
    } else {
        $("#isvalid").val(1); //表示没勾上,有期限
        $('#validenddate').attr('disabled', false);
    }
}

/**
 * 选择市
 */
function selectCity() {
    var districtcode = $('#city').val();
    $('#area').empty();
    $('#street').empty();
    $('#community').empty();

    $('#directortypename').attr("disabled", true);
    $('#directortypename').val("");
    $('#directortypename_select').remove();
    if (districtcode != null && districtcode != "") {
        $('#area').attr("disabled", false); //将区县打开
        //行政区域(区县)下拉框
        SelectOption.loadDistrict("area", {"districtlevel": "1", "districtcode": districtcode}); //1:区县
    } else {
        $('#area').attr("disabled", true);
        $('#street').attr("disabled", true);
        $('#community').attr("disabled", true);
        $('#directortypeid').attr("disabled", true);
    }
}

/**
 * 选择区县
 */
function selectArea() {
    var districtcode = $('#area').val();
    $('#street').empty();
    $('#community').attr("disabled", true);
    $('#community').empty();

    $('#directortypename').attr("disabled", true);
    $('#directortypename').val("");
    $('#directortypename_select').remove();
    if (districtcode != null && districtcode != "") {
        $('#street').attr("disabled", false); //将区县打开
        //行政区域(区县)下拉框
        SelectOption.loadDistrict("street", {"districtlevel": "2", "districtcode": districtcode}); //2:区县
    } else {
        $('#street').attr("disabled", true);
        $('#community').attr("disabled", true);
    }
}

/**
 * 选择街道办
 */
function selectStreet() {
    var districtcode = $('#street').val();
    $('#community').empty();

    $('#directortypename').attr("disabled", true);
    $('#directortypename').val("");
    $('#directortypename_select').remove();
    if (districtcode != null && districtcode != "") {
        $('#community').attr("disabled", false);
        //行政区域(区县)下拉框
        SelectOption.loadDistrict("community", {"districtlevel": "3", "districtcode": districtcode}); //3:社区
    } else {
        $('#community').attr("disabled", true);
    }
}

/**
 * 选择社区
 */
function selectCommunity() {
    var districtcode = $('#community').val();

    $('#directortypename').attr("disabled", true);
    $('#directortypename').val("");
    $('#directortypename_select').remove();

    if (districtcode != null && districtcode != "") {
        $('#directortypename').attr("disabled", false);
        SelectTree.loadDirectorTypeAllSelect("directortypename", null, null, function (directortypeid) {
            if (directortypeid != null && directortypeid != "") {
                /*$.ajax( {
                 type : "post",
                 url : BASE_URL+'/system/sysdirectortype/loadDirectorById',
                 dataType : 'json',
                 data:{
                 "directortypeid":directortypeid,
                 "citycode":$('#city').val(),//市
                 "areacode":$('#area').val(),//区县
                 "streetcode":$('#street').val(),//街道办
                 "communitycode":$('#community').val()//社区
                 },
                 global : false,
                 async : false,
                 success : function(json) {
                 if(json!=null){
                 $('#directortypename').val(json.resultname); //行业行政主管分类
                 var datas = eval(json.industrys); //数据
                 if(datas!= undefined && datas!=null && datas.length > 0){
                 var pidArr = new Array(); //所有父id数组
                 for(var i=0;i<datas.length;i++){
                 var pid = datas[i].pId;
                 pidArr.push(pid);
                 }

                 var leavesArr = new Array(); //所有叶子节点数组
                 if(pidArr.length > 0){
                 for(var i=0;i<datas.length;i++){
                 var id =  datas[i].id;
                 if($.inArray(id,pidArr) == -1){ //判断数组是否包含元素(等于-1是不包含)
                 var leavesId = datas[i].id;
                 leavesArr.push(leavesId);
                 }
                 }
                 }

                 var resultOrgname="";
                 if(leavesArr.length > 0){
                 for(var j=0;j<leavesArr.length;j++){
                 var orgname=""; //返回的结果
                 orgname = recursive(orgname,leavesArr[j],datas);
                 orgname = orgname.substring(0,orgname.length-2);//去掉最后的->
                 resultOrgname += orgname+ ","
                 }
                 }
                 if(resultOrgname!=""){
                 $('#deoid').val(resultOrgname);
                 }
                 }else{
                 $('#deoid').val("");
                 }
                 }
                 },
                 error : function() {

                 }
                 });*/
            }
        });
    } else {
        $('#directortypename').attr("disabled", true);
        $('#directortypename').val("");
        $('#directortypename_select').remove();
    }
}

/*保存(新增或编辑)*/
function save() {
    $.ajax({
        type: 'post',
        url: BASE_URL + '/enterprise/entbusinessinfo/save',
        cache: false,
        dataType: 'json',
        data: $("#entbusinessinfoform").serializeArray(),
        global: false,
        success: function (json) {
            if (json.success == true) {
                if ($("#register").val()) {
                    //注册成功
                    window.location.href = BASE_URL + "/login/succeed/" + $('#entname').val();
                } else {
                    //给执法检查填充企业数据
                    var index = parent.getParentIndex();
                    if (typeof(index) != "undefined") {

                        parent.frames["layui-layer-iframe" + index].$('#businessinfoid').val(json.data.businessinfoid);
                        parent.frames["layui-layer-iframe" + index].$('#entname').val(json.data.entname);
                    }

                    //工商信息
                    parent.toast(json.msg);//弹出提示信息
                    parent.getActiveIFrame().reloadGrid();//刷新列表
                    parent.closeWin();// 关闭弹出框
                }

            } else {
                if ($("#register").val()) {
                    //注册失败
                    window.location.href = BASE_URL + "/login/failure";
                } else {
                    parent.toast(json.msg);
                }
            }
        },
        error: function () {
            parent.toast("保存失败");
        }
    });
}

/**
 * 递归
 * @param orgname 关联的机构
 * @param nodeId 节点id
 * @param datas 数据
 * @returns {String}
 */
function recursive(orgname, nodeId, datas) {
    for (var i = 0; i < datas.length; i++) {
        var pid = datas[i].pId;
        var id = datas[i].id;
        var name = datas[i].name;
        if (nodeId == id) {
            orgname = name + "->" + orgname;
            orgname = recursive(orgname, pid, datas);
        }
    }
    return orgname;
}

/**
 * 定位
 */
/*function position(){
 var longitude = encodeURIComponent($('#longitude').val());
 var latitude= encodeURIComponent($('#latitude').val());
 var areaName = encodeURIComponent($('#area').val());
 if($("#register").val()){
 openWin(BASE_URL+"/olgis/gisOperBuss/position?module=gis&type=add&longitude="+longitude+"&latitude="+latitude+"&areaName="+areaName+"&register=register",'地理定位','50%','50%',false);
 }else{
 parent.parent.openWin(BASE_URL+"/olgis/gisOperBuss/position?module=gis&type=add&longitude="+longitude+"&latitude="+latitude+"&areaName="+areaName+"&register=null",'地理定位','50%','50%',false);
 }
 }*/
/**
 * 使用百度在线地图实现地理位置信息采集
 */
function position() {
    parent.parent.openWin(BASE_URL + "/views/module/olgis/maplocation.html", "地理位置", "50%", "50%", true, true);
}


/****************行业部门树***************/
function loadOrgTree(divid) {
    var setting = {
        data: {
            simpleData: {
                enable: true
            }
        },
        check: {
            enable: true, //复选框
            chkStyle: "checkbox",
            chkboxType: {"Y": "", "N": ""}
        },
        view: {
            showIcon: false
        },
        callback: {
            onClick: treeClick,
            onCheck: treeCheck
        }
    };
    $.ajax({
        type: 'POST',
        url: BASE_URL + '/system/sysorg/orgtree',
        cache: false,
        dataType: 'json',
        global: false,
        async: false,
        success: function (map) {
            var tree_map = initTreeMap(map);
            $.fn.zTree.init($("#" + divid), setting, tree_map);
        },
        error: function () {
            parent.toast("网络异常");
        }
    });

    //树图标的初始化
    function initTreeMap(map) {
        var t_map = new Array();
        //遍历子节点
        if (map != null && map.length > 0) {
            var open = false;
            //t_map.push(new Node("-1","","行业主管部门",true,BASE_URL+"/images/tree/org.png"));//根节点
            for (var i = 0; i < map.length; i++) {
                var icon = "";
                var checked = false;
                if (map[i].id != -1) {
                    icon = BASE_URL + "/images/tree/d_icon_tree1.png";
                    var orgid = map[i].id;
                    open = false;
                }
                if (map[i].checked == "true") {
                    checked = true;
                }
                t_map.push(new Node(map[i].id, map[i].pId, map[i].name,
                    open, icon, checked));
            }
        } else {
            t_map = null;
        }
        return t_map;
    }

    //树节点对象
    function Node(id, pId, name, open, icon, checked) {
        this.id = id;
        this.pId = pId;
        this.name = name;
        this.open = open;
        this.icon = icon;
        this.checked = checked;
    }
}

/** 点击树节点 */
function treeClick(event, treeId, treeNode, clickFlag) {
    var treeObj = $.fn.zTree.getZTreeObj("orgtree");
    //treeObj.checkNode(treeNode, !treeNode.checked, true);

    var nodes = treeObj.getCheckedNodes(true);
    var ids = '';
    var names = '';
    for (var i = 0; i < nodes.length; i++) {
        if (ids != '') {
            ids += ',';
        }
        if (names != '') {
            names += ',';
        }
        ids += nodes[i].id;
        names += nodes[i].name;
    }
    $("#industryorg").val(ids);
    $("#industryorgname").val(names);
    //去除 验证的错误信息
    var treeObj = $.fn.zTree.getZTreeObj("orgtree");
    var nodes = treeObj.getCheckedNodes(true);
    if (nodes.length > 0) {
        $("#industryorg").attr("class", "valid");
        $("#industryorg-error").css("display", "none");
    }
}
/**勾选权限树节点*/
function treeCheck(event, treeId, treeNode, clickFlag) {
    treeClick(event, treeId, treeNode, clickFlag);
}