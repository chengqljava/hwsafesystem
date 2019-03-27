var SelectTree = function() {

};

SelectTree.loadEntOrgTree = function loadEntOrgTree(code,param,defValue) {
    SelectTree.loadBaseSelect(BASE_URL+"/enterprise/entorg/loadEntOrgTree",code,param,defValue);
}


/**
 * 加载通讯保障类型分类树
 * code:定义选择后的ID值
 * defValue 默认值
 */
SelectTree.loadComfirmTypeTree = function loadComfirmTypeTree(code,param,defValue){
	SelectTree.loadBaseSelect(BASE_URL+"/ems/emsrescomfirmtypecode/resconfirmtypetree",code,param,defValue);
}

/**
 * 加载安全风险与危险源信息分类树
 * code:定义选择后的ID值
 * defValue 默认值
 */
SelectTree.loadRiskTypeTree = function loadRiskTypeTree(code,param,defValue){
	SelectTree.loadBaseSelect(BASE_URL+"/dangersource/dssrsktype/loadRiskTypeTree",code,param,defValue);
}


/**
 * 加载安委会机构
 * code:定义选择后的ID值
 * defValue 默认值
 */
SelectTree.loadIsMemberSelect = function loadIsMemberSelect(code,param,defValue){
	SelectTree.loadBaseSelect(BASE_URL+"/system/sysorg/isMemberTree",code,param,defValue);
}


/**
 * 加载组织机构
 * code:定义选择后的ID值
 * defValue 默认值
 */
SelectTree.loadOrgSelect = function loadOrgSelect(code,param,defValue){
	SelectTree.loadBaseSelect(BASE_URL+"/system/sysorg/orgtree",code,param,defValue);
}

/**
 * 根据组织机构ID加载它下面的组织机构
 * code:定义选择后的ID值
 * defValue 默认值
 */
SelectTree.loadOrgByOrgidSelect = function loadOrgSelect(code,param,defValue,fn){
	SelectTree.loadBaseSelect(BASE_URL+"/system/sysorg/orgtreeByOrgid",code,param,defValue,fn);
}

/**
 * 加载企业详细信息树
 * 
 */
SelectTree.loadBaseInfoSelect = function loadBaseInfoSelect(code,param,defValue,fn){
	SelectTree.loadBaseSelect(BASE_URL+"/enterprise/entsafeinfomenu/safemenutree",code,param,defValue,fn);
}

/**
 * 加载排除项树
 * 
 */
SelectTree.loadHdiCheckitemSelect = function loadHdiCheckitemSelect(code,param,defValue,fn){
	SelectTree.loadBaseSelect(BASE_URL+"/hiddendanger/hdicheckitem/checkitementtree",code,param,defValue,fn);
}

/**
 * 任务文书下拉树
 * 
 */
SelectTree.loadDocmenuTree = function loadDocmenuTree(code,param,defValue,fn){
	SelectTree.loadBaseSelect(BASE_URL+"/law/lawmydoc/docmenutree",code,param,defValue,fn);
}

/**
 * 加载文书信息树
 * 
 */
SelectTree.loadLawDocInfoSelect = function loadLawDocInfoSelect(code,param,defValue,fn){
	SelectTree.loadBaseSelect(BASE_URL+"/law/lawdocinfo/lawmenutree",code,param,defValue,fn);
}

/**
 * 加载部门
 * code:定义选择后的ID值
 * defValue 默认值
 */
SelectTree.loadDepartSelect = function loadDepartSelect(code,param,defValue) {
	SelectTree.loadBaseSelect(BASE_URL+"/system/sysdepart/departtree",code,param,defValue);
};


/**
 * 查询权限树(权限管理)
 * code:定义选择后的ID值
 * defValue 默认值
 */ 
SelectTree.loadDistrictSelect = function loadDistrictSelect(code,param,defValue) {
	SelectTree.loadBaseSelect(BASE_URL+"/system/sysdistrict/districttree",code,param,defValue);
};


/**
 * 加载行政区域(所有节点)
 * code:定义选择后的ID值
 * defValue 默认值
 */ 
SelectTree.loadDistrictAllSelect = function loadDistrictAllSelect(code,param,defValue) {
	SelectTree.loadBaseSelect(BASE_URL+"/system/sysdistrict/districtalltree",code,param,defValue);
};

/**
 * 加载行政区域(查询当前用户所在机构下的所属行政区域)
 * code:定义选择后的ID值
 * defValue 默认值
 */ 
SelectTree.loadSelfDistrictSelect = function loadSelfDistrictSelect(code,param,defValue) {
	SelectTree.loadBaseSelect(BASE_URL+"/system/sysdistrict/districtTreeById",code,param,defValue);
};

/**
 * 加载系统权限
 * code:定义选择后的ID值
 * defValue 默认值
 */ 
SelectTree.loadPrivIdSelect = function loadPrivIdSelect(code,param,defValue) {
	SelectTree.loadBaseSelect(BASE_URL+"/system/syspriv/privtree",code,param,defValue);
};

/**
 * 加载国民经济行业分类(所属行业)
 * code:定义选择后的ID值
 * defValue 默认值
 */ 
SelectTree.loadEconindustrySelect = function loadEconindustrySelect(code,param,defValue) {
	SelectTree.loadBaseSelect(BASE_URL+"/system/syseconindustry/econindustrytree",code,param,defValue);
};

/**
 * 医疗机构类别
 * @return
 */
SelectTree.loadRescueType = function loadRescueType(code,param,defValue){
	SelectTree.loadBaseSelect(BASE_URL+"/ems/codebasresourcetype/rescuetypetree",code,param,defValue);
};

/**
 * 医疗机构类别
 * @return
 */
SelectTree.loadRescueTypeBNCS = function loadRescueTypeBNCS(code,param,defValue){
	SelectTree.loadBaseSelect(BASE_URL+"/ems/codebasresourcetype/rescuetypeBNCStree",code,param,defValue);
};
/**
 * 获取整改责任人
 * code:定义选择后的ID值
 * defValue 默认值
 */
SelectTree.loadDeptUserSelect = function loadDeptUserSelect(code,param,defValue) {
    SelectTree.loadBaseDeptSelect(BASE_URL+"enterprise/entorg/getOrgUserTree",code,param,defValue);
};

/**
 * 加载经济类型 
 * code:定义选择后的ID值
 * defValue 默认值
 */ 
SelectTree.loadEconomictypeSelect = function loadEconomictypeSelect(code,param,defValue) {
	SelectTree.loadBaseSelect(BASE_URL+"/system/syseconomictype/economictypetree",code,param,defValue);
};


/**
 * 加载监管分类
 * code:定义选择后的ID值
 * defValue 默认值
 */ 
SelectTree.loadManagerTypeSelect = function loadManagerTypeSelect(code,param,defValue) {
	SelectTree.loadBaseSelect(BASE_URL+"/system/sysmanagertype/managertypetree",code,param,defValue);
};

/**
 * 加载行业主管分类-隐藏叶子节点
 * code:定义选择后的ID值
 * defValue 默认值
 */ 
SelectTree.loadDirectorTypeSelect = function loadDirectorTypeSelect(code,param,defValue) {
	SelectTree.loadBaseSelect(BASE_URL+"/system/sysdirectortype/directortypetree",code,param,defValue);
};

/**
 * 加载行业主管分类-全部
 * code:定义选择后的ID值
 * defValue 默认值
 */ 
SelectTree.loadDirectorTypeAllSelect = function loadDirectorTypeAllSelect(code,param,defValue,fn) {
	SelectTree.loadBaseSelect(BASE_URL+"/system/sysdirectortype/directorTypeAllTree",code,param,defValue,fn);
};

/**
 * 加载特种作业岗位树
 * code:定义选择后的ID值
 * defValue 默认值
 */ 
SelectTree.loadSpecialPositionSelect = function loadSpecialPositionSelect(code,param,defValue,fn) {
	SelectTree.loadBaseSelect(BASE_URL+"/enterprise/entoperator/specialpositiontree",code,param,defValue,fn);
};

/**
 * 加载特种设备作业岗位树
 * code:定义选择后的ID值
 * defValue 默认值
 */ 
SelectTree.loadSpecialEquipPositionSelect = function loadSpecialEquipPositionSelect(code,param,defValue,fn) {
	SelectTree.loadBaseSelect(BASE_URL+"/enterprise/entequipoperator/specialequippositiontree",code,param,defValue,fn);
};

/**
 * 加载危险设备类型树
 * code:定义选择后的ID值
 * defValue 默认值
 */ 
SelectTree.loadDangerEquipTypeSelect = function loadDangerEquipTypeSelect(code,param,defValue,fn) {
	SelectTree.loadBaseSelect(BASE_URL+"/enterprise/entdangerequip/dangerequiptypetree",code,param,defValue,fn);
};

/**
 * 加载安全生产投入领域类型树
 * code:定义选择后的ID值
 * defValue 默认值
 */ 
SelectTree.loadInvestFieldSelect = function loadInvestFieldSelect(code,param,defValue,fn) {
	SelectTree.loadBaseSelect(BASE_URL+"/enterprise/entsafeinvestinfo/investfieldtree",code,param,defValue,fn);
};

/**
 * 加载安全生产许可证照类型树
 * code:定义选择后的ID值
 * defValue 默认值
 */ 
SelectTree.loadPermitTypeSelect = function loadPermitTypeSelect(code,param,defValue,fn) {
	SelectTree.loadBaseSelect(BASE_URL+"/enterprise/entpermitphoto/permittypetree",code,param,defValue,fn);
};

/**
 * 加载职业危害因素树
 * code:定义选择后的ID值
 * defValue 默认值
 */ 
SelectTree.loadHarmFactorSelect = function loadHarmFactorSelect(code,param,defValue,fn) {
	SelectTree.loadBaseSelect(BASE_URL+"/enterprise/entproharmctrl/harmfactortree",code,param,defValue,fn);
};

/**
 * 加载危化品企业类型树(所有节点)
 * code:定义选择后的ID值
 * defValue 默认值
 */ 
SelectTree.loadChemicalEntTypeAllSelect = function loadChemicalEntTypeAllSelect(code,param,defValue) {
	SelectTree.loadBaseSelect(BASE_URL+"/enterprise/entchemicaltype/chemicaltypeAllTree",code,param,defValue);
};


/**
 * 加载危险化工工艺目录
 * code:定义选择后的ID值
 * defValue 默认值
 */
SelectTree.loadDancatalogSelect = function loadDancatalogSelect(code,param,defValue) {
	SelectTree.loadBaseSelect(BASE_URL+"/enterprise/sysdancheprocatalog/dancatalogtree",code,param,defValue);
};

/**
 * 加载危化品目录
 * code:定义选择后的ID值
 * defValue 默认值
 */
SelectTree.loadChecatalogSelect = function loadChecatalogSelect(code,param,defValue) {
	SelectTree.loadBaseSelect(BASE_URL+"/knowledge/knochemicalcatal/checatalogtree",code,param,defValue);
};

/**
 * 加载排查项
 * code:定义选择后的ID值
 * defValue 默认值
 */
SelectTree.loadCheckitemSelect = function loadCheckitemSelect(code,param,defValue) {
	SelectTree.loadBaseSelect(BASE_URL+"/hiddendanger/hdicheckitem/checkitemtree",code,param,defValue);
};

/**
 * 加载巡查人员
 * code:定义选择后的ID值
 * defValue 默认值
 */
SelectTree.loadPatrollerSelect = function loadPatrollerSelect(code,param,defValue) {
	SelectTree.loadBaseSelect(BASE_URL+"/hiddendanger/hdipatroller/patrolleTree",code,param,defValue);
};

/**
 * 加载 重大危险源 监测监控 主机型号
 * code:定义选择后的ID值
 * defValue 默认值
 */
SelectTree.loadMacVideoBrandTypeSelect = function loadMacVideoBrandTypeSelect(code,param,defValue) {
	SelectTree.loadBaseSelect(BASE_URL+"/monitor/macvideobrandtype/loadMacVideoBrandTypeTree",code,param,defValue);
};

/**
 * 加载 重大危险源 监测监控 监测主机型号
 * code:定义选择后的ID值
 * defValue 默认值
 */
SelectTree.loadMacProbeBrandTypeSelect = function loadMacProbeBrandTypeSelect(code,param,defValue) {
	SelectTree.loadBaseSelect(BASE_URL+"/monitor/macprobebrandtype/loadMacProbeBrandTypeTree",code,param,defValue);
};

/**
 * 加载执法部门
 * code:定义选择后的ID值
 * defValue 默认值
 */ 
SelectTree.loadLawDeptSelect = function loadLawDeptSelect(code,param,defValue) {
	SelectTree.loadBaseSelect(BASE_URL+"/law/lawdept/lawdepttree",code,param,defValue);
};

/**
 * 加载应急机构
 * code:定义选择后的ID值
 * defValue 默认值
 */ 
SelectTree.loadEmsResOrgSelect = function loadEmsResOrgSelect(code,param,defValue) {
	SelectTree.loadBaseSelect(BASE_URL+"/ems/emsresorg/emsresorgtree",code,param,defValue);
};

/**
 * 加载应急资源-应急知识-事件类型
 */
SelectTree.loadEventTypeSelect = function loadEventTypeSelect(code,param,defValue){
	SelectTree.loadBaseSelect(BASE_URL+"/ems/emsknogenekno/loadEventTypeTree",code,param,defValue);
}

/**
 * 预案模板元素(所有节点)
 * code:定义选择后的ID值
 * defValue 默认值
 */
SelectTree.loadPlanElementAllSelect = function loadPlanElementAllSelect(code,param,defValue){
	SelectTree.loadBaseSelect(BASE_URL+"/ems/emsplaelement/planelementtree",code,param,defValue);
};

/**
 * 加载事故类型树(所有节点)
 * code:定义选择后的ID值
 * defValue 默认值
 */ 
SelectTree.loadEventTypeAllTreeSelect = function loadEventTypeAllTreeSelect(code,param,defValue) {
	SelectTree.loadBaseSelect(BASE_URL+"/ems/emsplaproacc/loadEventTypeAllTree",code,param,defValue);
};

/**
 * 加载应急救援-综合预测信息树
 * 
 */
SelectTree.loadForecastInfoSelect = function loadForecastInfoSelect(code,param,defValue,fn){
	SelectTree.loadBaseSelect(BASE_URL+"/ems/emssucigrforecast/forecastmenutree",code,param,defValue,fn);
}

/**
 * 加载应急救援GIS-智能方案-下发任务目标机构树
 */
SelectTree.loadAiPlanTskOrgSelect = function loadAiPlanTskOrgSelect(code, param, defValue, fn){
	SelectTree.loadBaseSelect(BASE_URL + "ems/emssucisstask/tskorgmenutree", code, param, defValue, fn);
}
/**
 * 加载弹出树
 * loadurl:弹出树请求地址
 * code:定义选择后的ID值
 * defValue 默认值
 */
SelectTree.loadBaseDeptSelect = function loadBaseDeptSelect(loadurl,code,jsonParam,defValue,fn) {
    // 生成树的DIV
    $('#'+code).attr("readOnly","true");

    if(defValue!=null&&defValue!=""&&defValue!=undefined){
        $('#'+code).val(defValue);
    }

    //获取是否多选
    var isMuti=$('#'+code).attr("selectmulti");
    if(isMuti=='true'||isMuti==true){
        isMuti=true;
    }else{
        isMuti=false;
    }

    //获取父节点是否可点
    var rootclick =$('#'+code).attr('rootclick');
    if(rootclick=='true'||rootclick==true){
        rootclick=true;
    }else{
        rootclick=false;
    }

    //弹出框宽度
    var selectwidth =$('#'+code).attr('selectwidth');
    if(!selectwidth){
        selectwidth=174;
    }
    //弹出框高度
    var selectheight =$('#'+code).attr('selectheight');
    if(!selectheight){
        selectheight=200;
    }

    //获取附加属性
    var alias=$('#'+code).attr('alias');

    var hide_div='hide_div_tree'+code;
    var hide_tree='hide_tree_id'+code;

    var treeDIV = $('<div id='+hide_div+' class="dropdown-menu" style="display:none; position: absolute;z-index: 9000;"><ul id='+hide_tree+' class="ztree" style="margin-top:0; width:'+selectwidth+';height:'+selectheight+';overflow:auto"></ul></div>"');
    $(document.body).append(treeDIV);

    var resultcode=code+"_select";
    var resultname=$('#'+code).attr("selectname");
    if(resultname==""||resultname==undefined){
        console.log(code+"未定义selectname");
        return;
    }

    var hideIdDIV = $('<input id="'
        + resultcode
        + '"  name="'
        + resultname
        + '" type="text" readonly value="" style="width:120px; display: none"/>');
    $("#" + code).after(hideIdDIV);
    $("#" + code)
        .bind(
            "click",
            function() {
                var nameObj = $("#" + code);
                var nameObjOffset = $("#" + code).offset();
                $("#"+hide_div).css(
                    {
                        left : nameObjOffset.left + "px",
                        top : nameObjOffset.top
                        + nameObj.outerHeight() + "px"
                    }).slideDown("fast");
                $("body")
                    .bind(
                        "mousedown",
                        function(event) {
                            if (!(event.target.id == "menuBtn"
                                    || event.target.id == hide_div || $(
                                        event.target).parents(
                                        "#"+hide_div).length > 0)) {
                                $("#"+hide_div).fadeOut(
                                    "fast");
                                $("body")
                                    .unbind(
                                        "mousedown",
                                        function(event) {
                                            SelectTree
                                                .onBodyDown(event,code);
                                        });
                            }
                        });
            });

    var setting = {
        check : {
            enable : isMuti
        },
        view : {
            dblClickExpand : false
        },
        data : {
            simpleData : {
                enable : true
            }
        },
        callback : {
            beforeClick : function(treeId, treeNode) {
                if(rootclick){
                    return true;
                }else{
                    if(treeNode && treeNode.isParent){
                        return false;
                    }else{
                        return true;
                    }
                }
            },
            onCheck : function() {
                var zTree = $.fn.zTree.getZTreeObj(hide_tree), nodes = zTree
                    .getCheckedNodes(true), v = "";
                var eventId = "";
                nodes.sort(function compare(a, b) {
                    return a.id - b.id;
                });
                for ( var i = 0, l = nodes.length; i < l; i++) {
                    if (!nodes[i].isParent) {
                        v += nodes[i][alias] + ",";
                        eventId += nodes[i].id + ",";
                    }

                }
                if (v.length > 0)
                    v = v.substring(0, v.length - 1);
                if (eventId.length > 0)
                    eventId = eventId.substring(0, eventId.length - 1);
                $("#" + code).val(v);
                $('#'+code).attr("selectvalue",eventId);
                $('#' + resultcode).val(eventId);

            },
            onClick : function(event, treeId, treeNode, clickFlag) {

                console.log(treeNode);
                //不能点击部门，只能选择员工
                if (treeNode.icon !=null) {
                    return;
                }
                //其它逻辑处理
                $("#" + code).val();
                $("#" + resultcode).val();
                if(alias){
                    $("#" + code).val(treeNode[alias]);
                }else{
                    $("#" + code).val(treeNode.name);
                }
                $("#" + resultcode).val(treeNode.id);
                $('#'+code).attr("selectvalue",treeNode.id);
                if(fn != undefined){
                    fn(treeNode);
                }
                $('#'+code).focus();
                SelectTree.hideMenu(event,code);
            }
        }
    };

    $.ajax( {
        type : "post",
        url : loadurl,
        dataType : 'json',
        data:jsonParam,
        global : false,
        async : false,
        success : function(json) {
            var nodes = initTreeMap(json)

            var tree = $.fn.zTree.init($("#"+hide_tree), setting, nodes);
            tree.expandAll(true);
            var selnames="";
            var selIds = $('#' + code).attr('selectvalue');
            $("#" + resultcode).val(selIds);

            if(selIds==""||selIds==null||selIds=='null'){
                selnames=defValue;
            }else{
                if(isMuti){
                    if (selIds != null && selIds != "" && tree.setting.check.enable) {
                        var ids = selIds.split(",");
                        if (ids.length > 0) {
                            for ( var i = 0; i < ids.length; i++) {
                                var id = ids[i];
                                var node = tree.getNodeByParam("id", id, null);
                                tree.checkNode(node, true, false);
                                if(attr){
                                    selnames+=','+node[alias];
                                }else{
                                    selnames+=','+node.name;
                                }
                            }
                        }

                    }
                }else{
                    var node = tree.getNodeByParam("id", selIds, null);
                    if(node != null){
                        if(alias){
                            selnames+=','+node[alias];
                        }else{
                            selnames+=','+node.name;
                        }
                    }else{
                        selnames=",";
                    }
                }
                selnames=selnames.substring(1);
            }
            $('#'+code).val(selnames);
            //返回函数
            if(fn != undefined){
                fn(selIds);
            }
        },
        error : function() {

        }
    });
};

/**
 * 加载弹出树
 * loadurl:弹出树请求地址
 * code:定义选择后的ID值
 * defValue 默认值
 */
SelectTree.loadBaseSelect = function loadBaseSelect(loadurl,code,jsonParam,defValue,fn) {
	// 生成树的DIV
	$('#'+code).attr("readOnly","true");
	
	if(defValue!=null&&defValue!=""&&defValue!=undefined){
		$('#'+code).val(defValue);
	}
	
	//获取是否多选
	var isMuti=$('#'+code).attr("selectmulti");
	if(isMuti=='true'||isMuti==true){
		isMuti=true;
	}else{
		isMuti=false;
	}
	
	//获取父节点是否可点
	var rootclick =$('#'+code).attr('rootclick');
	if(rootclick=='true'||rootclick==true){
		rootclick=true;
	}else{
		rootclick=false;
	}
	
	//弹出框宽度
	var selectwidth =$('#'+code).attr('selectwidth');
	if(!selectwidth){
		selectwidth=174;
	}
	//弹出框高度
	var selectheight =$('#'+code).attr('selectheight');
	if(!selectheight){
		selectheight=200;
	}
	
	//获取附加属性
	var alias=$('#'+code).attr('alias');
	
	var hide_div='hide_div_tree'+code;
	var hide_tree='hide_tree_id'+code;
	
	var treeDIV = $('<div id='+hide_div+' class="dropdown-menu" style="display:none; position: absolute;z-index: 9000;"><ul id='+hide_tree+' class="ztree" style="margin-top:0; width:'+selectwidth+';height:'+selectheight+';overflow:auto"></ul></div>"');
	$(document.body).append(treeDIV);

	var resultcode=code+"_select";
	var resultname=$('#'+code).attr("selectname");
	if(resultname==""||resultname==undefined){
		console.log(code+"未定义selectname");
		return;
	}

	var hideIdDIV = $('<input id="'
			+ resultcode
			+ '"  name="'
			+ resultname
			+ '" type="text" readonly value="" style="width:120px; display: none"/>');
	$("#" + code).after(hideIdDIV);
	$("#" + code)
			.bind(
					"click",
					function() {
						var nameObj = $("#" + code);
						var nameObjOffset = $("#" + code).offset();
						$("#"+hide_div).css(
								{
									left : nameObjOffset.left + "px",
									top : nameObjOffset.top
											+ nameObj.outerHeight() + "px"
								}).slideDown("fast");
						$("body")
								.bind(
										"mousedown",
										function(event) {
											if (!(event.target.id == "menuBtn"
													|| event.target.id == hide_div || $(
													event.target).parents(
													"#"+hide_div).length > 0)) {
												$("#"+hide_div).fadeOut(
														"fast");
												$("body")
														.unbind(
																"mousedown",
																function(event) {
																	SelectTree
																			.onBodyDown(event,code);
																});
											}
										});
    });
	
	var setting = {
		check : {
			enable : isMuti
		},
		view : {
			dblClickExpand : false
		},
		data : {
			simpleData : {
				enable : true
			}
		},
		callback : {
			beforeClick : function(treeId, treeNode) {
				if(rootclick){
					return true;
				}else{
					if(treeNode && treeNode.isParent){
						return false;
					}else{
						return true;
					}
				}
			},
			onCheck : function() {
				var zTree = $.fn.zTree.getZTreeObj(hide_tree), nodes = zTree
						.getCheckedNodes(true), v = "";
				var eventId = "";
				nodes.sort(function compare(a, b) {
					return a.id - b.id;
				});
				for ( var i = 0, l = nodes.length; i < l; i++) {
					if (!nodes[i].isParent) {
						v += nodes[i][alias] + ",";
						eventId += nodes[i].id + ",";
					}

				}
				if (v.length > 0)
					v = v.substring(0, v.length - 1);
				if (eventId.length > 0)
					eventId = eventId.substring(0, eventId.length - 1);
				$("#" + code).val(v);
				$('#'+code).attr("selectvalue",eventId);
				$('#' + resultcode).val(eventId);

			},
			onClick : function(event, treeId, treeNode, clickFlag) {
				$("#" + code).val();
				$("#" + resultcode).val();
				if(alias){
					$("#" + code).val(treeNode[alias]);
				}else{
					$("#" + code).val(treeNode.name);
				}
				$("#" + resultcode).val(treeNode.id);
				$('#'+code).attr("selectvalue",treeNode.id);
				if(fn != undefined){
					fn(treeNode);
				}
				$('#'+code).focus();
				SelectTree.hideMenu(event,code);
			}
		}
	};
	
	$.ajax( {
		type : "post",
		url : loadurl,
		dataType : 'json',
  		data:jsonParam,
		global : false,
		async : false,
		success : function(json) {
			var tree = $.fn.zTree.init($("#"+hide_tree), setting, json);
			tree.expandAll(true);
			var selnames="";
			var selIds = $('#' + code).attr('selectvalue');
			$("#" + resultcode).val(selIds);
			
			if(selIds==""||selIds==null||selIds=='null'){
				selnames=defValue;
			}else{
				if(isMuti){
					if (selIds != null && selIds != "" && tree.setting.check.enable) {
						var ids = selIds.split(",");
						if (ids.length > 0) {
							for ( var i = 0; i < ids.length; i++) {
								var id = ids[i];
								var node = tree.getNodeByParam("id", id, null);
								tree.checkNode(node, true, false);
								if(attr){
									selnames+=','+node[alias];
								}else{
									selnames+=','+node.name;
								}
							}
						}
		
					}
				}else{
					var node = tree.getNodeByParam("id", selIds, null);
					if(node != null){
						if(alias){
							selnames+=','+node[alias];
						}else{
							selnames+=','+node.name;
						}
					}else{
						selnames=",";
					}
				}
				selnames=selnames.substring(1);
			}
			$('#'+code).val(selnames);
			//返回函数
			if(fn != undefined){
				fn(selIds);
			}
		},
		error : function() {

		}
	});
};

//树节点对象
function Node(id, pId, name, open, icon,datatype,url, tablename, doccode) {
	this.id = id;
	this.pId = pId;
	this.name = name;
	this.open = open;
	this.icon = icon;
	this.datatype=datatype;
	this.url = url; 
	this.tablename = tablename;
	this.doccode = doccode;
}

SelectTree.hideMenu = function hideMenu(event,code) {
	$("#hide_div_tree"+code).fadeOut("fast");
	$("body").unbind("mousedown", SelectTree.onBodyDown(event,code));
};
SelectTree.onBodyDown = function onBodyDown(event,code) {
	if (!(event.target.id == "menuBtn" || event.target.id == "hide_div_tree"+code || $(
			event.target).parents("#hide_div_tree"+code).length > 0)) {
		SelectTree.hideMenu(event,code);
	}
};
//树图标的初始化
function initTreeMap(map,porgid) {
    var t_map = new Array();
    if (map !=null) {
        console.log(map);
        t_map.push(new Node(map.entorgid,porgid,map.entorgname,true,BASE_URL+"/images/tree/org.png"));//根节点
        var orgs = map.orgs;
        var contacts = map.contactsList;
        //遍历子节点部门
        if (orgs && orgs.length > 0) {
            for ( var i = 0; i < orgs.length; i++) {
                var tempMap = initTreeMap(orgs[i],orgs[i].pentorgid);
                for(var j = 0;j<tempMap.length;j++){
                    t_map.push(tempMap[j]);
                }
            }
        }
        if (contacts && contacts.length > 0) {
            for (var int = 0; int < contacts.length; int++) {
                t_map.push(new Node(contacts[int].contactsid,contacts[int].entorgid,contacts[int].contactsname,false,null));//人员树
            }
        }
    }else {
        t_map = null;
    }

    console.log(t_map);
    return t_map;
}
//树节点对象
function Node(id, pId, name, open, icon) {
    this.id = id;
    this.pId = pId;
    this.name = name;
    this.open = open;
    this.icon = icon;
}