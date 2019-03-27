$(document).ready(function () {
    /**
     * 加载安全信息树
     */
    if ($(window).width() < 700) {
        $('.divClick').css({"display": "block"});
        $('.div_left').css({"display": "none"});
        $('.upDown').css({"display": "none"});
        $('.div_right').css({"margin-left": "0", "width": "100%"});
    } else {
        $('.divClick').css({"display": "none"});
        $('.div_left').css({"display": "block"});
        $('.upDown').css({"display": "block"});
    }
    SelectTree.loadBaseInfoSelect("entinfomenu", {"businessinfoid": $('#businessinfoid').val()}, null,
        function (treeNode) {
            if (treeNode.tId) {
                console.log(treeNode);
                var ent_baseinfo = $('#ent_baseinfo').val(); //基础信息(必填)
                var tid = treeNode.tId;
                $("li #" + tid + " a").attr("target", "contentIframe");
                $("li #" + tid + " a").attr("href", "javascript:void(0)");

                if (treeNode.id == -1) {
                    return false;
                }

                if (treeNode.url == "undefined" || treeNode.url == null) {
                    return false;
                }

                if (treeNode.tablename != "ent_baseinfo" && treeNode.tablename != "introduction") {
                    if (ent_baseinfo == "false") {
                        //必须先填写企业基础信息，才能填写下面的菜单栏
                        parent.parent.toast("请先填写企业基础信息");
                        return false;
                    }
                }
                $('#menuname').html(treeNode.name); //菜单名称
                var businessinfoid = $('#businessinfoid').val();
                var nodeurl = "";
                if (treeNode.url != "undefined" && treeNode.url != null)
                    nodeurl = treeNode.url;
                var url = BASE_URL + nodeurl + "/menuEdit/" + businessinfoid; //进入编辑页面\
                //如果是html直接接入参数
                if(nodeurl.endWith("html"))
                    url = BASE_URL+nodeurl +"?businessinfoid="+businessinfoid;
                if (treeNode.tablename == "ent_danexclusive")
                    url = BASE_URL + nodeurl + "/menuEdit/" + businessinfoid + "/entinfo"; //从企业基础信息进行危化品专属信息
                $("#contentIframe").attr("src", url);
            }
        });
    var flag = 1;
    $('.upDown').click(function () {
        if (flag == 1) {
            $('.div_left').hide();
            $('.div_right').css({'margin-left': '0px', 'width': '100%'});
            $(this).css('left', '0.5%');
            $('.upDown').addClass('downUp');
            flag = 0;
        } else {
            $('.div_left').show();
            $('.div_right').css({'margin-left': '19.6%', 'width': '80.4%'});
            $(this).css('left', '16%');
            $('.upDown').removeClass('downUp');
            flag = 1;
        }
    });

    $('#menuname').html("企业简介");
    loadSafemenutree();
});

/**
 * 加载安全信息树
 */
function loadSafemenutree() {
    var setting = {
        data: {
            simpleData: {
                enable: true
            }
        },
        callback: {
            onClick: treeClick
        }
    };
    var paramJson = $('#businessinfoid').val();
    var param = {"businessinfoid": paramJson};
    $.ajax({
        type: 'post',
        url: BASE_URL + '/enterprise/entsafeinfomenu/safemenutree',
        cache: false,
        data: param,
        dataType: 'json',
        global: false,
        async: false,
        success: function (map) {
            console.log(map);
            var tree_map = initTreeMap(map);
            $.fn.zTree.init($("#safeinfomenu"), setting, tree_map);
        },
        error: function () {
        	console.log("网络异常");
        }
    });

    //树图标的初始化
    function initTreeMap(map) {
        var ent_baseinfo = $('#ent_baseinfo').val(); //基础信息(必填)
        var ent_safeorg = $('#ent_safeorg').val(); //安全生产管理机构(必填)
        var ent_dangerchara = $('#ent_dangerchara').val(); //危险特性(必填)
        var ent_safeperson = $('#ent_safeperson').val(); //安全生产责任人(必填)
        var ent_safemanager = $('#ent_safemanager').val(); // 安全生产管理人员(必填)

        var ent_operator = $('#ent_operator').val(); //特种作业人员
        var ent_equipoperator = $('#ent_equipoperator').val();  //特种设备作业人员
        var ent_permitphoto = $('#ent_permitphoto').val(); //许可证照
        var ent_saferiskinfo = $('#ent_saferiskinfo').val(); //安全风险较大作业信息
        var ent_safeinvestinfo = $('#ent_safeinvestinfo').val(); //安全生产投入信息
        var ent_safestandard = $('#ent_safestandard').val(); //安全生产标准化建设信息
        var ent_safereward = $('#ent_safereward').val(); //安全生产获奖信息
        var ent_safepunish = $('#ent_safepunish').val();  //安全生产行政处罚信息
        var ent_safeprodata = $('#ent_safeprodata').val(); //安全生产管理资料
        var ent_danexclusive = $('#ent_danexclusive').val(); //危化品专属信息
        var ent_dangerequip = $('#ent_dangerequip').val(); //危险设备
        var ent_proharm = $('#ent_proharm').val(); //职业病危害信息
        var ent_plan = $('#ent_plan').val(); //企业平面图
        var ent_safemgrproj = $('#ent_safemgrproj').val(); //安全制度管理清单
        var ent_event = $("#ent_event").val();
        var ent_worker = $("#ent_worker").val();
        var ent_hid = $("#ent_hid").val();
        var ent_equipprevessel = $("#ent_equipprevessel").val();//压力容器
        var ent_equipconduit = $("#ent_equipconduit").val();//压力管道
        var ent_equipsafevalve = $("#ent_equipsafevalve").val();//安全阀
        var ent_equipforkfilt = $("#ent_equipforkfilt").val();//叉车
        var ent_equipbolier = $("#ent_equipbolier").val();//锅炉
        var ent_equipliftingmac = $("#ent_equipliftingmac").val();//起重机械
        var ent_equipelevator = $("#ent_equipelevator").val();//电梯
        var epi_emg_plan = $("#epi_emg_plan").val();//环保应急预案
        var epi_construction_info = $("#epi_construction_info").val();//环评及行政许可
        var epi_solidwaste_record = $("#epi_solidwaste_record").val();//固体废物记录
        var epi_sewage_licence = $("#epi_sewage_licence").val();//排污许可证信息
        var epi_sensitive_record = $("#epi_sensitive_record").val();//环境敏感点记录
        var ent_safeorgattach = $("#ent_safeorgattach").val();//安全生产管理机构图
        var ent_firebugoutattach = $("#ent_firebugoutattach").val();//消防应急疏散图
        var t_map = new Array();
        //遍历子节点
        if (map != null && map.length > 0) {
            var open = false;
            for (var i = 0; i < map.length; i++) {
                var icon = "";
                var url = map[i].url;
                var tablename = "";
                if (map[i].pId == null || map[i].pId == "") {
                    //根节点
                    icon = BASE_URL + "/images/tree/d_icon_tree1.png";
                    open = true;
                } else {
                    //业务表名称
                    tablename = map[i].tablename;
                    if (map[i].tablename == "ent_baseinfo") {
                        if (ent_baseinfo == "true") {
                            icon = BASE_URL + "/images/tree/yes.png";
                        } else {
                            icon = BASE_URL + "/images/tree/no.png";
                        }
                    } else if (map[i].tablename == "ent_safeorg") {
                        if (ent_safeorg == "true") {
                            icon = BASE_URL + "/images/tree/yes.png";
                        } else {
                            icon = BASE_URL + "/images/tree/no.png";
                        }
                    } else if (map[i].tablename == "ent_dangerchara") {
                        if (ent_dangerchara == "true") {
                            icon = BASE_URL + "/images/tree/yes.png";
                        } else {
                            icon = BASE_URL + "/images/tree/no.png";
                        }
                    } else if (map[i].tablename == "ent_safeperson") {
                        if (ent_safeperson == "true") {
                            icon = BASE_URL + "/images/tree/yes.png";
                        } else {
                            icon = BASE_URL + "/images/tree/no.png";
                        }
                    } else if (map[i].tablename == "ent_safemanager") {
                        if (ent_safemanager == "true") {
                            icon = BASE_URL + "/images/tree/yes.png";
                        } else {
                            icon = BASE_URL + "/images/tree/no.png";
                        }
                    } else if (map[i].tablename == "ent_operator") {
                        if (ent_operator == "true") {
                            icon = BASE_URL + "/images/tree/yes.png";
                        } else {
                            icon = BASE_URL + "/images/tree/no.png";
                        }
                    } else if (map[i].tablename == "ent_equipoperator") {
                        if (ent_equipoperator == "true") {
                            icon = BASE_URL + "/images/tree/yes.png";
                        } else {
                            icon = BASE_URL + "/images/tree/no.png";
                        }
                    } else if (map[i].tablename == "ent_permitphoto") {
                        if (ent_permitphoto == "true") {
                            icon = BASE_URL + "/images/tree/yes.png";
                        } else {
                            icon = BASE_URL + "/images/tree/no.png";
                        }
                    } else if (map[i].tablename == "ent_saferiskinfo") {
                        if (ent_saferiskinfo == "true") {
                            icon = BASE_URL + "/images/tree/yes.png";
                        } else {
                            icon = BASE_URL + "/images/tree/no.png";
                        }
                    } else if (map[i].tablename == "ent_safeinvestinfo") {
                        if (ent_safeinvestinfo == "true") {
                            icon = BASE_URL + "/images/tree/yes.png";
                        } else {
                            icon = BASE_URL + "/images/tree/no.png";
                        }
                    } else if (map[i].tablename == "ent_safestandard") {
                        if (ent_safestandard == "true") {
                            icon = BASE_URL + "/images/tree/yes.png";
                        } else {
                            icon = BASE_URL + "/images/tree/no.png";
                        }
                    } else if (map[i].tablename == "ent_safereward") {
                        if (ent_safereward == "true") {
                            icon = BASE_URL + "/images/tree/yes.png";
                        } else {
                            icon = BASE_URL + "/images/tree/no.png";
                        }
                    } else if (map[i].tablename == "ent_safepunish") {
                        if (ent_safepunish == "true") {
                            icon = BASE_URL + "/images/tree/yes.png";
                        } else {
                            icon = BASE_URL + "/images/tree/no.png";
                        }
                    } else if (map[i].tablename == "ent_safeprodata") {
                        if (ent_safeprodata == "true") {
                            icon = BASE_URL + "/images/tree/yes.png";
                        } else {
                            icon = BASE_URL + "/images/tree/no.png";
                        }
                    } else if (map[i].tablename == "ent_danexclusive") {
                        if (ent_danexclusive == "true") {
                            icon = BASE_URL + "/images/tree/yes.png";
                        } else {
                            icon = BASE_URL + "/images/tree/no.png";
                        }
                    } else if (map[i].tablename == "ent_dangerequip") {
                        if (ent_dangerequip == "true") {
                            icon = BASE_URL + "/images/tree/yes.png";
                        } else {
                            icon = BASE_URL + "/images/tree/no.png";
                        }
                    } else if (map[i].tablename == "ent_proharm") {
                        if (ent_proharm == "true") {
                            icon = BASE_URL + "/images/tree/yes.png";
                        } else {
                            icon = BASE_URL + "/images/tree/no.png";
                        }
                    } else if (map[i].tablename == "ent_plan") {
                        if (ent_plan == "true") {
                            icon = BASE_URL + "/images/tree/yes.png";
                        } else {
                            icon = BASE_URL + "/images/tree/no.png";
                        }
                    } else if (map[i].tablename == "ent_safemgrproj") {
                        if (ent_safemgrproj == "true") {
                            icon = BASE_URL + "/images/tree/yes.png";
                        } else {
                            icon = BASE_URL + "/images/tree/no.png";
                        }
                    } else if (map[i].tablename == "ent_event") {
                        console.log(ent_event);
                        if (ent_event == "true") {
                            icon = BASE_URL + "/images/tree/yes.png";
                        } else {
                            icon = BASE_URL + "/images/tree/no.png";
                        }
                    } else if (map[i].tablename == "ent_worker") {
                        console.log("ent_worker:" + ent_worker)
                        if (ent_worker == "true") {
                            icon = BASE_URL + "/images/tree/yes.png";
                        } else {
                            icon = BASE_URL + "/images/tree/no.png";
                        }
                    } else if (map[i].tablename == "ent_hid") {
                        if (ent_hid == "true") {
                            icon = BASE_URL + "/images/tree/yes.png";
                        } else {
                            icon = BASE_URL + "/images/tree/no.png";
                        }
                    } else if (map[i].tablename == "ent_equipprevessel") {
                        if (ent_equipprevessel == "true") {
                            icon = BASE_URL + "/images/tree/yes.png";
                        } else {
                            icon = BASE_URL + "/images/tree/no.png";
                        }
                    } else if (map[i].tablename == "ent_equipconduit") {
                        if (ent_equipconduit == "true") {
                            icon = BASE_URL + "/images/tree/yes.png";
                        } else {
                            icon = BASE_URL + "/images/tree/no.png";
                        }
                    } else if (map[i].tablename == "ent_equipsafevalve") {
                        if (ent_equipsafevalve == "true") {
                            icon = BASE_URL + "/images/tree/yes.png";
                        } else {
                            icon = BASE_URL + "/images/tree/no.png";
                        }
                    } else if (map[i].tablename == "ent_equipforkfilt") {
                        if (ent_equipforkfilt == "true") {
                            icon = BASE_URL + "/images/tree/yes.png";
                        } else {
                            icon = BASE_URL + "/images/tree/no.png";
                        }
                    } else if (map[i].tablename == "ent_equipbolier") {
                        if (ent_equipbolier == "true") {
                            icon = BASE_URL + "/images/tree/yes.png";
                        } else {
                            icon = BASE_URL + "/images/tree/no.png";
                        }
                    } else if (map[i].tablename == "ent_equipliftingmac") {
                        if (ent_equipliftingmac == "true") {
                            icon = BASE_URL + "/images/tree/yes.png";
                        } else {
                            icon = BASE_URL + "/images/tree/no.png";
                        }
                    } else if (map[i].tablename == "ent_equipelevator") {
                        if (ent_equipelevator == "true") {
                            icon = BASE_URL + "/images/tree/yes.png";
                        } else {
                            icon = BASE_URL + "/images/tree/no.png";
                        }
                    } else if (map[i].tablename == "epi_emg_plan") {
                        if (epi_emg_plan == "true") {
                            icon = BASE_URL + "/images/tree/yes.png";
                        } else {
                            icon = BASE_URL + "/images/tree/no.png";
                        }
                    }else if (map[i].tablename == "epi_construction_info") {
                        if (epi_construction_info == "true") {
                            icon = BASE_URL + "/images/tree/yes.png";
                        } else {
                            icon = BASE_URL + "/images/tree/no.png";
                        }
                    }else if (map[i].tablename == "epi_solidwaste_record") {
                        if (epi_solidwaste_record == "true") {
                            icon = BASE_URL + "/images/tree/yes.png";
                        } else {
                            icon = BASE_URL + "/images/tree/no.png";
                        }
                    } else if (map[i].tablename == "epi_sewage_licence") {
                        if (epi_sewage_licence == "true") {
                            icon = BASE_URL + "/images/tree/yes.png";
                        } else {
                            icon = BASE_URL + "/images/tree/no.png";
                        }
                    }else if (map[i].tablename == "epi_sensitive_record") {
                        if (epi_sensitive_record == "true") {
                            icon = BASE_URL + "/images/tree/yes.png";
                        } else {
                            icon = BASE_URL + "/images/tree/no.png";
                        }
                    }else if (map[i].tablename == "ent_safeorgattach") {
                        if (ent_safeorgattach == "true") {
                            icon = BASE_URL + "/images/tree/yes.png";
                        } else {
                            icon = BASE_URL + "/images/tree/no.png";
                        }
                    }else if (map[i].tablename == "ent_firebugoutattach") {
                        if (ent_firebugoutattach == "true") {
                            icon = BASE_URL + "/images/tree/yes.png";
                        } else {
                            icon = BASE_URL + "/images/tree/no.png";
                        }
                    } else if (map[i].tablename == "introduction") {//如果没有对应的表名，则默认为必填
                        icon = BASE_URL + "/images/tree/yes.png";
                    } else if (map[i].id == "26") {
                        if (ent_safeinvestinfo == "true" && ent_safereward == "true") {
                            icon = BASE_URL + "/images/tree/yes.png";
                        } else {
                            icon = BASE_URL + "/images/tree/no.png";
                        }
                    } else if (map[i].id == "27") {
                        if (ent_safestandard == "true" && ent_safeprodata == "true" && ent_safemgrproj == "true") {
                            icon = BASE_URL + "/images/tree/yes.png";
                        } else {
                            icon = BASE_URL + "/images/tree/no.png";
                        }
                    } else if (map[i].id == "31") {
                        if (ent_prevessel == "true" && ent_bolior == "true" && ent_forkfilt == "true"
                            && ent_conduit == "true" && ent_safevalve == "true") {
                            icon = BASE_URL + "/images/tree/yes.png";
                        } else {
                            icon = BASE_URL + "/images/tree/no.png";
                        }
                    }
//					else if(map[i].tablename == ""||map[i].tablename == null){//如果没有对应的表名，则默认为必填
//						open = true;
//						icon= BASE_URL+"/images/tree/no.png";
//						
//					}
//					open = false;
                }
                t_map.push(new Node(map[i].id, map[i].pId, map[i].name,
                    open, icon, url, tablename));
            }
        } else {
            t_map = null;
        }
        return t_map;
    }

    //树节点对象
    function Node(id, pId, name, open, icon, url, tablename) {
        this.id = id;
        this.pId = pId;
        this.name = name;
        this.open = open;
        this.icon = icon;
        this.url = url;
        this.tablename = tablename;
    }
}

/**点击权限树节点*/
function treeClick(event, treeId, treeNode, clickFlag) {
    var ent_baseinfo = $('#ent_baseinfo').val(); //基础信息(必填)
    var tid = treeNode.tId;
    $("li #" + tid + " a").attr("target", "contentIframe");
    $("li #" + tid + " a").attr("href", "javascript:void(0)");

    if (treeNode.id == -1) {
        return false;
    }
    if (treeNode.url == "undefined" || treeNode.url == null) {
        return false;
    }

    if (treeNode.tablename != "ent_baseinfo" && treeNode.tablename != "introduction") {
        if (ent_baseinfo == "false") {
            //必须先填写企业基础信息，才能填写下面的菜单栏
            parent.parent.toast("请先填写企业基础信息");
            return false;
        }
    }

    $('#menuname').html(treeNode.name); //菜单名称
    var businessinfoid = $('#businessinfoid').val();
    var nodeurl = "";
    if (treeNode.url != "undefined" && treeNode.url != null)
        nodeurl = treeNode.url;
    var url = BASE_URL + nodeurl + "/menuEdit/" + businessinfoid; //进入编辑页面
    if(nodeurl.endWith("html"))
        url = BASE_URL+nodeurl +"?businessinfoid="+businessinfoid;
    if (treeNode.tablename == "ent_danexclusive")
        url = BASE_URL + nodeurl + "/menuEdit/" + businessinfoid + "/entinfo"; //从企业基础信息进行危化品专属信息
    if (treeNode.name != "标准化制度及资料" && treeNode.name != "安全生产信息" && treeNode.name != "安全生产人员信息" && treeNode.name != "特种设备") {
        $("#contentIframe").attr("src", url);
    }

}
String.prototype.endWith=function(str){
    var reg=new RegExp(str+"$");
    return reg.test(this);
}