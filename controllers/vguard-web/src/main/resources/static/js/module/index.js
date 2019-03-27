$(function(){
	var iIndex=layer.load();
	//初始化菜单
	initMenu();
	//是政府部门加载行政区域 不是政府们 取值为undefined
	if($("#xzqydiv").html() != undefined){
		loadDistrictTree();
	}
	
	layer.close(iIndex);
	
});
function initMenu(){
    //隐藏所有的二级菜单
    $('li[lid^=menu2_]').each(function(){
    	$(this).hide();
	});
	
	//显示第一个一级菜单
	var fistMenu=$('img',$('.subnav2 li:first'));
	fistMenu.attr('clicked','true');
	var privid= fistMenu.attr('privid');
	//显示第一个一级菜单下的所有二级菜单
	$('li[lid=menu2_'+privid+']').each(function(){
		$(this).show();
		var liClassName = $('.subnav2 li:first').children('a').attr('class');
		//console.log(liClassName);
		$(this).attr("data-type",liClassName);
	});
}

/*点击一级菜单*/
function menuClick1(obj){
	if($('img',obj).attr('clicked')!='true'){
		//隐藏之前的二级菜单
		var oldClick=$('.subnav2 img[clicked=true]');//之前被选中一级菜单
		$('li[lid=menu2_'+oldClick.attr('privid')+']').each(function(){
			$(this).hide();
		});
		oldClick.attr('clicked','false');//取消之前被选中的一级菜单
		//显示二级菜单
		$('li[lid=menu2_'+$('img',obj).attr('privid')+']').each(function(){
			$(this).show();
			var liClassName = $(obj).attr('class');
			//console.log(liClassName);
			$(this).attr("data-type",liClassName);
		});
		//设置当前菜单选中
		$('img',obj).attr('clicked',true);
		//$('#iframe').attr('src',BASE_URL+'/index/welcome');
		$('.subnav').show();
		$('#page-wrapper').css('margin-left','253px');
	}
}

/*修改密码*/
function resetpw(){
	parent.openWin(BASE_URL+'/login/resetpw','密码修改', "25%", "30%");
	
	//调整遮罩层的优先级
    renderTopShade();
}

/* 账户信息 */
var _accountPageFrm = null;
function account(){
    if (_accountPageFrm && document.getElementById("accountFrm")) {
    	_accountPageFrm.show();
    } else {
        var app = window.Mirs.Application.getInstance();
        var cwin = app.getWorkControl().getMdiControl().createChildWindow();
        var iframeEle = document.createElement("iframe");
        iframeEle.src = BASE_URL+'/system/sysuser/account';
        iframeEle.style.width = "100%";
        iframeEle.style.height = "100%";
        iframeEle.id = "accountFrm";
        cwin.setIframeElement(iframeEle);
        cwin.getContainer().appendChild(iframeEle);
        _accountPageFrm = null;
        cwin.setCaption("账户");

        cwin.show();
        _accountPageFrm = cwin;
    }
};

/*系统退出*/
function logout(){
	//弹出提示框
	parent.confirm('确认退出吗?',function(){
		window.location.href=BASE_URL+"/login/logout";
	 });
	
	//调整遮罩层的优先级
    renderTopShade();
}

/*系统退出*/
function logout_mirs(){
	//弹出提示框
	parent.confirm('确认退出吗?',function(){
		window.location.href=BASE_URL+"/login/logout_mirs";
	 });
}

/*地图显示*/
function showMap(obj){
	//openWin(BASE_URL+'/olgis/gispage/addMainPage',"地图平台","100%","100%");
//	obj.href=BASE_URL+'/olgis/gispage/addMainPage';
	obj.href = BASE_URL + "/views/module/onlinegis/portal/portalIndex.html";
}

/**加载行政区域树*/
function loadDistrictTree(){
	var setting = {
		data : {
			simpleData : {
				enable : true
			}
		},
		callback: {
			onClick: treeClick
		}
	};	
	
	$.ajax({
		type :'post',
		url : BASE_URL+'/system/sysdistrict/districtTreeById',
		dataType : 'json',
		global : false,
		async : false,
		success : function(map) {
			var tree_map = initTreeMap(map);
			$.fn.zTree.init($("#districttree"), setting, tree_map);
		},
		error : function() {
			parent.toast("网络异常");
		}
	});
	

	//树图标的初始化
	function initTreeMap(map) {
		var t_map = new Array();
		//遍历子节点
		if (map != null && map.length > 0) {
			var open = false;
			for ( var i = 0; i < map.length; i++) {
				var icon = "";
				if(map[i].districtlevel == 0){
					//根节点(市级)
					icon = BASE_URL+"/images/tree/d_icon_tree1.png";
					var districtcode = map[i].id;
					open = true;
				}else if(map[i].districtlevel == 1){
					//(区县级)
					icon= BASE_URL+"/images/tree/d_icon_tree2.png";
					var districtcode = map[i].id;
//					if($("#districtlevel").val() ==1){//当前用户所在行政区域级别
//						open = true;
//					}else{
//						open = false;
//					}
					open = true;
					
				}else if(map[i].districtlevel == 2){
					//(街道办级别)
					icon= BASE_URL+"/images/tree/d_icon_tree3.png";
					var districtcode = map[i].id;
					if($("#districtlevel").val() ==2){//当前用户所在行政区域级别
						open = true;
					}else{
						open = false;
					}
				}			
				t_map.push(new Node(map[i].id, map[i].pId, map[i].name,
						open,icon,map[i].districtlevel));
			}
		} else {
			t_map = null;
		}
		return t_map;
	}
	
	//树节点对象
	function Node(id, pId, name, open, icon,districtlevel) {
		this.id = id;
		this.pId = pId;
		this.name = name;
		this.open = open;
		this.icon = icon;
		this.districtlevel = districtlevel;
	}
}

/**点击节点*/
function treeClick(event, treeId, treeNode, clickFlag){
	var districtcode = treeNode.id;
	var name = treeNode.name;
	var districtlevel = treeNode.districtlevel;
	getActiveIFrame().searchDistrict(districtcode,name,districtlevel);

}
/**
 * 获取当前iframe
 */
function getActiveIFrame(){
	//通过判断当前默认皮肤来判断版本
	if($('#theme_current').val()){
		var mdi = Mirs.Navigation.MDIControl.getInstance().getActiveMdiChild();
		//debugger;
		var iframe=mdi.children[1].children[0];
		return iframe.contentWindow;
	}else{
		return $(".J_iframe:visible")[0].contentWindow;
	}
}



/*******************************************全局事件 start ***************************************************/

/** 
* 观察者模式实现事件监听
*/
function Observer()
{
	this._eventsList = {}; // 对外发布的事件列表{"connect" : [{fn : null, scope : null}, {fn : null, scope : null}]}
}

Observer.prototype = {
	// 空函数
	_emptyFn : function()
	{
	},
	
	/**
	* 判断事件是否已发布
	* @param eType 事件类型
	* @return Boolean
	*/
	_hasDispatch : function(eType)
	{
		eType = (String(eType) || '').toLowerCase();

		return "undefined" !== typeof this._eventsList[eType];
	},
	
	/**
	* 根据事件类型查对fn所在的索引,如果不存在将返回-1
	* @param eType 事件类型
	* @param fn 事件句柄
	*/
	_indexFn : function(eType, fn)
	{
		if(!this._hasDispatch(eType))
		{
			return -1;
		}

		var list = this._eventsList[eType];
		fn = fn || '';
		for(var i = 0; i < list.length; i++)
		{
			var dict = list[i];
			var _fn  = dict.fn || '';
			if(fn.toString() === _fn.toString())
			{
				return i;
			}
		}

		return -1;
	},

	/**
	* 创建委托
	*/
	createDelegate : function()
	{
		var __method = this;
    	var args     = Array.prototype.slice.call(arguments);
    	var object   = args.shift();
    	return function() {
        	return __method.apply(object, args.concat(Array.prototype.slice.call(arguments)));
		};
	},
	
	/**
	* 发布事件
	*/
	dispatchEvent : function()
	{
		if(arguments.length < 1)
		{
			return false;
		}

		var args = Array.prototype.slice.call(arguments), _this = this;
		$.each(args, function(index, eType){
			if(_this._hasDispatch(eType))
			{
				return true;
			}
			_this._eventsList[eType.toLowerCase()] = [];
		});

		return this;
	},
	
	/**
	* 触发事件
	*/
	fireEvent : function()
	{
		if(arguments.length < 1)
		{
			return false;
		}

		var args = Array.prototype.slice.call(arguments), eType = args.shift().toLowerCase(), _this = this;
		if(this._hasDispatch(eType))
		{
			var list = this._eventsList[eType];
			if (!list)
			{
				return this;
			}

			$.each(list, function(index, dict){
				var fn = dict.fn, scope = dict.scope || _this;
				if(!fn || "function" !== typeof fn)
				{
					fn = _this._emptyFn;
				}
				if(true === scope)
				{
					scope = null;
				}

				fn.apply(scope, args);
			});
		}

		return this;
	},
	
	/**
	* 订阅事件
	* @param eType 事件类型
	* @param fn 事件句柄
	* @param scope
	*/
	on : function(eType, fn, scope)
	{
		eType = (eType || '').toLowerCase();
		if(!this._hasDispatch(eType))
		{
			throw new Error("not dispatch event " + eType);
			return false;
		}

		this._eventsList[eType].push({fn : fn || null, scope : scope || null});

		return this;
	},
	
	/**
	* 取消订阅某个事件
	* @param eType 事件类型
	* @param fn 事件句柄
	*/
	un : function(eType, fn)
	{
		eType = (eType || '').toLowerCase();
		if(this._hasDispatch(eType))
		{
			var index = this._indexFn(eType, fn);
			if(index > -1)
			{
				var list = this._eventsList[eType];
				list.splice(index, 1);
			}
		}

		return this;
	},
	
	/**
	* 取消订阅所有事件
	*/
	die : function(eType)
	{
		eType = (eType || '').toLowerCase();
		if(this._eventsList[eType])
		{
			this._eventsList[eType] = [];
		}

		return this;
	}
};
// end
var GEventObject = new Observer();
GEventObject.dispatchEvent('LOAD_ENT_EVENT');
GEventObject.dispatchEvent('REFERESH_EVENT');
GEventObject.dispatchEvent('LOAD_HID_ITEMS');
GEventObject.dispatchEvent('LOAD_HID_REPORT');
//环保站点
GEventObject.dispatchEvent('LOAD_RPI_STATION');
//*****监测监控设备回调事件****//

GEventObject.dispatchEvent('LOAD_MAC_INFO');

GEventObject.dispatchEvent('LOAD_HID_ReformList');
GEventObject.dispatchEvent('LOAD_HID_RecheckList');

//隐患排查计划
GEventObject.dispatchEvent('LOAD_HID_CHECKTASK');

//系统中所有表单页面弹窗传递GIS经纬度值事件
GEventObject.dispatchEvent('LOAD_BDMAPPT_EVENT');

//应急救援-模拟演练获取演练计划
GEventObject.dispatchEvent('LOAD_EMS_DRILL_PLAN_ENENT');

//应急管理-事故上报-应急救援中涉及到的弹窗回调参数事件
GEventObject.dispatchEvent('LOAD_EMS_AiPLAN_GETHISROW_EVENT');
GEventObject.dispatchEvent('EMS_AiPLAN_TASKNODECLK_EVENT');
GEventObject.dispatchEvent('LOAD_EMS_AiPLAN_ADD_EVENT');
var taskContentInfo = "";

//选择海康平台8700平台视频点位信息
GEventObject.dispatchEvent('LOAD_MONITOR_HIK8700VIDEO_EVENT');

//选择怀业平台视频点位
GEventObject.dispatchEvent('LOAD_MONITOR_HYVIDEO_EVENT');
/*******************************************全局事件 end ***************************************************/