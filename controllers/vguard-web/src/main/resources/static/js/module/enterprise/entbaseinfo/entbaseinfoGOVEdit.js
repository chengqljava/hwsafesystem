$(document).ready(function () {
    //行政区域(市)下拉框
    SelectOption.loadDistrict("city", {"districtlevel": "0"}); //0:市级

    //行政区域(区县)下拉框
    SelectOption.loadDistrict("area", {"districtlevel": "1", "districtcode": $('#city').attr('selectvalue')}); //1:区县级

    //行政区域(街道办)下拉框
    SelectOption.loadDistrict("street", {"districtlevel": "2", "districtcode": $('#area').attr('selectvalue')}); //2:区县级

    //行政区域(街道办)下拉框
    SelectOption.loadDistrict("community", {"districtlevel": "3", "districtcode": $('#street').attr('selectvalue')}); //3:社区

    //地址
    //SelectOption.loadAddressType("entaddress"); //1:办公地址,2:生产经营地址

    //所属行业树
    SelectTree.loadEconindustrySelect("econindustryname");

    //经济类型树
    SelectTree.loadEconomictypeSelect("economictypename");

    //经济类型下拉框
    SelectOption.loadEntscale("entscale");

    //评级
    SelectOption.loadRate("rate");


    $('.addInput').click(function () {
        var html = '';
        html += '<div class="rowtop"><input type="text" id="" name="" value="" class="form-control"  maxlength="100" style="width:80%;float:left">';
        html += '<input type="button" class="delInput" value="删除" style="float:left;margin-left:10px;"/></div>';
        $('.tdInsert').append(html);
    });
    //行政主管分类
    loadDirectorTypeAllSelect(
        $('#city').attr('selectvalue'),
        $('#area').attr('selectvalue'),
        $('#street').attr('selectvalue'),
        $('#community').attr('selectvalue')
    );

    //单位管辖隶属关系
    SelectOption.loadSubjection("subjection");

    /*
     //是否无限期
     var isvalid = $('#isvalid').val();
     if(isvalid == 0){
     $('#validenddate').attr('disabled',true);
     }else if(isvalid ==1){
     $('#validenddate').attr('disabled',false);
     }
     */

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

    //经、纬度验证
    jQuery.validator.addMethod("validateitude", function (value, element) {
        var num = /^\d+(\.\d{1,4})?$/;
        return this.optional(element) || (num.test(value));
    }, "请输入数字");

    // 字符验证
    jQuery.validator.addMethod("stringCheck", function (value, element) {
        return this.optional(element) || /^[a-zA-Z0-9]+$/.test(value);
    }, "只能包括字母、数字");
    
    var validateOpts = {
            rules: {
                entname: {
                    required: true,
                    rangelength: [2, 100]
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
                    stringCheck: true
                },
                registermoney: {
//                    required: true,
                    isNumber: true
                },
//                mainproduct: {
//                    required: true
//                },
                longitude: {
//                    required: true,
                    validateitude: true/*,
                    range:[107.16, 111.53]*/
                },
                latitude: {
//                    required: true,
                    validateitude: true/*,
                    range:[37.64, 41.67]*/
                },
//                econindustryname: {
//                    required: true
//                },
//                economictypename: {
//                    required: true
//                },
//                directortypename: {
//                    required: true
//                },
//                deoid: {
//                    required: true
//                },
//                subjection: {
//                    required: true
//                },
//                entscale: {
//                    required: true
//                },
                placearea: {
//                    required: true,
                    isNumber: true
                },
                empqty: {
//                    required: true,
                    num: true
                },
                insurenumber: {
//                    required: true,
                    num: true
                },
                managenumber: {
//                    required: true,
                    num: true
                },
                holdernumber: {
//                    required: true,
                    num: true
                },
                fixedmoney: {
//                    required: true,
                    isNumber: true
                },
                yearincome: {
//                    required: true,
                    isNumber: true
                }
//                ,
//                isstandard: {
//                    required: true
//                },
//                rate: {
//                    required: true
//                }
            },
            messages: {
                entname: {
                    required: "企业名称不能为空",
                    rangelength: "请输入2-100个字符"
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
//                    required: "营业期限开始日期不能为空"
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
//                    required: "注册号/统计社会信用代码不能为空",
                    stringCheck: "只能包括字母、数字"
                },
                registermoney: {
//                    required: "注册资本不能为空",
                    isNumber: "注册资本为整数和浮点数"
                },
//                mainproduct: {
//                    required: "经营范围不能为空"
//                },
                longitude: {
//                    required: "经度不能为空",
                    validateitude: "请输入小数且小数位最多4位"/*,
                    range:"经度输入范围在 {107.16} 到 {111.53} 之间的数值"*/
                },
                latitude: {
//                    required: "纬度不能为空",
                    validateitude: "请输入小数且小数位最多4位"/*,
                    range: "纬度输入范围在 {37.64} 到 {41.67} 之间的数值"*/
                },
//                econindustryname: {
//                    required: "所属行业不能为空"
//                },
//                economictypename: {
//                    required: "经济类型不能为空"
//                },
//                directortypename: {
//                    required: "行业主管分类不能为空"
//                },
//                deoid: {
//                    required: "行业主管部门不能为空"
//                },
//                subjection: {
//                    required: "请选择单位管辖隶属!"
//                },
//                entscale: {
//                    required: "请选择企业规模!"
//                },
                placearea: {
//                    required: "生产经营场所面积不能为空",
                    isNumber: "生产经营场所面积为整数和浮点数"
                },
                empqty: {
//                    required: "应缴纳工伤保险员工人数不能为空",
                    num: "请输入数字"
                },
                insurenumber: {
//                    required: "实际缴纳员工人数不能为空",
                    num: "请输入数字"
                },
                managenumber: {
//                    required: "安全管理人员人数不能为空",
                    num: "请输入数字"
                },
                holdernumber: {
//                    required: "其中持证人数不能为空",
                    num: "请输入数字"
                },
                fixedmoney: {
//                    required: "固定资产不能为空",
                    isNumber: "固定资产为整数和浮点数"
                },
                yearincome: {
//                    required: "年营业收入不能为空",
                    isNumber: "年营业收入为整数和浮点数"
                }
//                ,
//                isstandard: {
//                    required: "请选择安全生产标准化达标!"
//                },
//                rate: {
//                    required: "请选择评级 ！"
//                }
            },
            errorPlacement: function (error, element) { //指定错误信息位置
                if (element.is(':radio') || element.is(':checkbox')) { //如果是radio或checkbox
                    var eid = element.attr('name'); //获取元素的name属性
                    error.appendTo($('.' + eid + 'Div')); //将错误信息添加当前元素的父结点后面
                } else {
                    var validenddate = $('#validenddate').attr('id'); //获取的结束时间id
                    var id = element.attr('id');
                    if (validenddate == id) {
                        error.appendTo($('.validenddateDiv')); //将错误信息添加当前元素的父结点后面
                    } else {
                        error.insertAfter(element);
                    }
                }
            },
            submitHandler: function (form) {
                $('#city').attr("disabled", false);
                $('#area').attr("disabled", false);
                $('#street').attr("disabled", false);
                $('#community').attr("disabled", false);

                $('#naissancedate').attr("disabled", false);
                $('#validstartdate').attr("disabled", false);
                $('#validenddate').attr("disabled", false);
                $('#isvalid').attr("disabled", false);

                $('#directortypename').attr("disabled", false);
                $('#subjection').attr("disabled", false);

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
    	$("#entform").validate(validateOpts);
    });

    // 隐藏市，区，街道，社区
    $('[id ^= addr]').hide();

});


var addresssize = $('#addresssize').val();
var attachfiles = 1;
if (addresssize != null && addresssize != "") {
    var addresssizeint = parseInt(addresssize);
    if (addresssizeint != 0) {
        attachfiles = addresssizeint;
    }
}
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
        col1.innerHTML = '<td><select id="entAddresses[' + attachfiles + '].addresstype" name="entAddresses[' + attachfiles + '].addresstype" class="form-control" disabled><option>请选择</option><option value="1">办公地址</option><option value="2">生产经营地址</option></select></td>';
        col2.innerHTML = '<td><div class="rowtop"><input type="text" id="entAddresses[' + attachfiles + '].addressname" name="entAddresses[' + attachfiles + '].addressname" value="" class="form-control"  maxlength="50" style="width:80%;float:left" readonly></div></td>';
        col2.colSpan = '2';
        $('#trInsert0').after(newRow);
        attachfiles++;
    }
});

function delInput(id) {
    $('#' + id).empty();
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
        $('#directortypename').attr("disabled", true);
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
        loadDirectorTypeAllSelect($('#city').val(),
            $('#area').val(),
            $('#street').val(),
            $('#community').val()
        );
    } else {
        $('#directortypename').attr("disabled", true);
        $('#directortypename').val("");
        $('#directortypename_select').remove();
    }
}


function loadDirectorTypeAllSelect(city, area, street, community) {
    SelectTree.loadDirectorTypeAllSelect("directortypename", null, null, function (directortypeid) {
        if (directortypeid != null && directortypeid != "") {
            $.ajax({
                type: "post",
                url: BASE_URL + '/system/sysdirectortype/loadDirectorById',
                dataType: 'json',
                data: {
                    "directortypeid": directortypeid,
                    "citycode": city,//市
                    "areacode": area,//区县
                    "streetcode": street,//街道办
                    "communitycode": community//社区
                },
                global: false,
                async: false,
                success: function (json) {
                    if (json != null) {
                        $('#directortypename').val(json.resultname);//行业主管分类
                        $('#managertypename').val(json.managertypename);//监管分类

                        /**
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
                         */
                    }
                },
                error: function () {

                }
            });
        } else {
            $('#directortypename').attr("disabled", true);
            $('#directortypename').val("");
            $('#directortypename_select').remove();
        }
    });
}


/*保存(新增或编辑)*/
function save() {
    $.ajax({
        type: 'post',
        url: BASE_URL + '/enterprise/entbaseinfo/save',
        cache: false,
        dataType: 'json',
        data: $("#entform").serializeArray(),
        global: false,
        success: function (json) {
            if (json.success == true) {
                parent.parent.toast(json.msg);//弹出提示信息
                parent.$('#ent_baseinfo').val("true");	//父页面 		
                parent.loadSafemenutree();
                window.location.reload();
            } else {
                parent.parent.toast(json.msg);
            }
        },
        error: function () {
            parent.parent.toast("保存失败");
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
function position() {
    var longitude = encodeURIComponent($('#longitude').val());
    var latitude = encodeURIComponent($('#latitude').val());
    var areaName = encodeURIComponent($('#area').val());

    //当编辑地图点位时
    window.top.GEventObject.die("LOAD_BDMAPPT_EVENT");
    window.top.GEventObject.on("LOAD_BDMAPPT_EVENT", function (param) {
        console.log(param);
        $('#longitude').val(param.lng);
        $('#latitude').val(param.lat);
    });
    parent.parent.openWin(BASE_URL + "/views/module/ems/common/emsMapLoc.html?lng=" + longitude + "&lat=" + latitude + "&isDisplay=0", "地理定位", "50%", "50%", false);
}