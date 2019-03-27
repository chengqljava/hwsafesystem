/*新增或编辑课程管理*/
$(function () {
	var policeofficerseat = getQueryString("policeofficerseat");
	var alarmphone = getQueryString("alarmphone");
	var callid = getQueryString("callid");
//	var callid = $("#callid").val();
	$("#policeofficerseat").val(policeofficerseat);
	$("#alarmphone").val(alarmphone);
	$("#callid").val(callid);
	$("#alarmtime").val(getNowFormatTime());
	
    $("#dutyalarmForm").validate({
        rules: {
            warnalarmtitle: {
                required: true,
                maxlength: 50
            },
            policeofficerseat: {
            	required: true
            },
            warnalarmtype:{
            	required: true
            },
            alarmperson: {
                required: true,
                maxlength: 25
            },
            alarmphone: {
                required: true
//                ,
//                isPhone:true
            },
            alarmtime: {
                required: true
            },
            alarmchannel: {
                required: true
            },
            alarmunit: {
                required: true
            },
            longitude: {
                required: true
            },
            latitude: {
                required: true
            },
            pollutionmsg:{
            	required: true
            },
            alarmcontent: {
                required: true
            }
        },
        messages: {
            warnalarmtitle: {
                required: "标题不能为空",
                maxlength: "最多输入50字"
            },
            policeofficerseat: {
            	required: "坐席号不能为空"
            },
            warnalarmtype:{
            	required: "报警类别不能为空"
            },
            alarmperson: {
                required: "报警人不能为空",
                maxlength: "最多输入25个字"
            },
            alarmphone: {
                required: "报警人电话不能为空"
//                	,
//                isPhone: "请输入正确的电话号码"
            },
            alarmtime: {
                required: "接警时间不能为空"
            },
            alarmchannel: {
                required: "报警渠道不能为空"
            },
            alarmunit: {
                required: "报警单位不能为空"
            },
            longitude: {
                required: "请选择警情地点"
            },
            latitude: {
                required: "请选择警情地点"
            },
            pollutionmsg:{
            	required: "关键词不能为空"
            },
            alarmcontent: {
                required: "警情内容不能为空"
            }
        },
        submitHandler: function (form) {
            save();
//        	parent.confirm("保存后自动关闭本页面", function() {
//        		save()
//    		});
        }
    });
//    if(callid != null){    	
//    	//查询
//    	$.ajax({
//    		type: "post",
//    		url: BASE_URL + "ems/emsdutyalarm/loadcallid",
//    		dataType: "json",
//    		data: {
//    			callid: callid
//    		},
//    		success: function (data) {
//    			if (data) {
//    				if(data.message != null){            		
//    					parent.toast(data.message);//弹出提示信息
//    				}
//    			}
//    		},
//    		error: function () {
//    			parent.toast("初始化信息加载失败");
//    		}
//    	});
//    }
    
    SelectOption.loadWarnAlarmType("warnalarmtype");
    selBusinessinfo($("#entname"), BASE_URL + "enterprise/entbusinessinfo/searchEntSimpleInfo");
    selEvent($("#eventname"), BASE_URL + "ems/emssucevent/list");
});

/*保存(新增或编辑)*/
function save() {
	var source = "callalarm";
	var sourceData = {name: 'source', value: source};
	var dataForm =  $("#dutyalarmForm").serializeArray();
	dataForm.push(sourceData);
    $.ajax({
        type: "post",
        url: BASE_URL + "ems/emsdutyalarm/save",
        data: dataForm,
        success: function (data) {
            if (data.success == true) {
            	parent.toast(data.msg);//弹出提示信息
//                parent.getActiveIFrame().reloadGrid();//重新加载
                parent.closeWin();// 关闭弹出框
//                setTimeout(function(){
//                	window.opener=null;
//                	window.open('','_self');
//                	window.close();
//                	},1000);
            } else {
            	parent.toast(data.msg);//弹出提示信息
            }
        },
        error: function () {
            parent.toast("编辑失败");
        }
    });
}

function closePhoneRecord(){
	console.log(1);
	window.opener=null;
	window.open('','_self');
	window.close();
}

function getQueryString(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
    var r = window.location.search.substr(1).match(reg);
    if (r != null) return unescape(r[2]);
    return null;
}

/**
 * 查询企业
 * @param $ajax
 * @param url
 */
function selBusinessinfo($ajax, url) {
    $ajax.select2({
        ajax: {
            type: "post",
            url: url,
            dataType: 'json',
            delay: 250,
            data: function (params) {

                return {
                    entname: params.term, // search term
                    rows: "10",
                    page: params.page || 1
                };
            },
            processResults: function (data, params) {
                // parse the results into the format expected by Select2
                // since we are using custom formatting functions we do not need to
                // alter the remote JSON data, except to indicate that infinite
                // scrolling can be used
                params.page = params.page || 1;

                var itemList = [];
                for (var i = 0; i < data.length; i++) {
                    itemList.push({
                            id: data[i].ID,
                            text: data[i].TEXT,
                            longitude: data[i].LONGITUDE,
                            latitude: data[i].LATITUDE
                        }
                    )
                }

                return {
                    results: itemList,
                    pagination: {
                        more: params.page < data.totalpage
                    }
                };
            },
            cache: true
        },
        escapeMarkup: function (markup) {
            return markup;
        }, // let our custom formatter work
        minimumInputLength: 1,
        allowClear: true,//允许删除
        placeholder: "请选择",
        language: "zh-CN",
        templateResult: formatRepo, // omitted for brevity, see the source of this page
        templateSelection: formatEntSelection // omitted for brevity, see the source of this page
    });
}


/**
 * 查询企业
 * @param $ajax
 * @param url
 */
function selEvent($ajax, url) {
    $ajax.select2({
        ajax: {
            type: "post",
            url: url,
            dataType: 'json',
            delay: 250,
            data: function (params) {

                return {
                    name: params.term, // search term
                    stime: "", // search term
                    etime: "", // search term
                    rows: "10",
                    page: params.page || 1
                };
            },
            processResults: function (data, params) {
                // parse the results into the format expected by Select2
                // since we are using custom formatting functions we do not need to
                // alter the remote JSON data, except to indicate that infinite
                // scrolling can be used
                params.page = params.page || 1;

                var itemList = [];
                for (var i = 0; i < data.datas.length; i++) {
                    itemList.push({
                            id: data.datas[i].EVENTID,
                            text: data.datas[i].EVENTNAME,
                            data: data.datas[i]
                        }
                    )
                }

                return {
                    results: itemList,
                    pagination: {
                        more: params.page < data.totalpage
                    }
                };
            },
            cache: true
        },
        escapeMarkup: function (markup) {
            return markup;
        }, // let our custom formatter work
        minimumInputLength: 1,
        allowClear: true,//允许删除
        placeholder: "请选择",
        language: "zh-CN",
        templateResult: formatEventRepo, // omitted for brevity, see the source of this page
        templateSelection: formatEventSelection // omitted for brevity, see the source of this page
    });
}


/**
 * 格式化查询结果
 * @param repo
 */
function formatRepo(repo) {
    console.log(repo);
    if (repo.loading) return repo.text;

    var markup = "<div class='select2-result-repository clearfix'>" + repo.text + "</div>";

    return markup;
}

/**
 * 格式化查询结果
 * @param repo
 */
function formatEventRepo(repo) {
    console.log(repo);
    if (repo.loading) return repo.text;

    var markup = "<div class='select2-result-repository clearfix'>" + repo.text + "</div>" +
        "事故类型:" + repo.data.EVENTTYPENAME + "\n" +
        "事故地点:" + repo.data.ADDRESS;

    return markup;
}

/**
 * 格式化选择结果
 * @param repo
 * @returns {*}
 */
function formatEventSelection(repo) {
    console.log(repo);
    $("#eventid").val(repo.id);
    return repo.text;
}

/**
 * 格式化选择结果
 * @param repo
 * @returns {*}
 */
function formatEntSelection(repo) {
    console.log(repo);
    if(repo.longitude){
        $("#longitude").val(repo.longitude);
        $("#latitude").val(repo.latitude);
    }
    $("#businessinfoid").val(repo.id);
    return repo.text;
}

/**
 * 定位
 */
function position(){
    var longitude = encodeURIComponent($('#longitude').val()),
    	latitude = encodeURIComponent($('#latitude').val()),
    	isDisplay = "0";
    
    //当编辑地图点位时
    if ("0" == isDisplay) {
    	window.top.GEventObject.die("LOAD_BDMAPPT_EVENT");
    	window.top.GEventObject.on("LOAD_BDMAPPT_EVENT", function(param) {
            $('#longitude').val(param.lng);
            $('#latitude').val(param.lat);
        });
    }
    openWin(BASE_URL + "/views/module/ems/common/emsMapLoc.html?lng=" + longitude + "&lat=" + latitude + "&isDisplay="+ isDisplay, "地理定位", "50%", "100%", false);
}

/*******************************************全局事件(当汉威弹屏签入乐科系统时解开注释) start ***************************************************/
/** 
* 观察者模式实现事件监听
*/
//function Observer() {
//	this._eventsList = {}; // 对外发布的事件列表{"connect" : [{fn : null, scope : null}, {fn : null, scope : null}]}
//}
//
//Observer.prototype = {
//	// 空函数
//	_emptyFn : function()
//	{
//	},
//	
//	/**
//	* 判断事件是否已发布
//	* @param eType 事件类型
//	* @return Boolean
//	*/
//	_hasDispatch : function(eType)
//	{
//		eType = (String(eType) || '').toLowerCase();
//
//		return "undefined" !== typeof this._eventsList[eType];
//	},
//	
//	/**
//	* 根据事件类型查对fn所在的索引,如果不存在将返回-1
//	* @param eType 事件类型
//	* @param fn 事件句柄
//	*/
//	_indexFn : function(eType, fn)
//	{
//		if(!this._hasDispatch(eType))
//		{
//			return -1;
//		}
//
//		var list = this._eventsList[eType];
//		fn = fn || '';
//		for(var i = 0; i < list.length; i++)
//		{
//			var dict = list[i];
//			var _fn  = dict.fn || '';
//			if(fn.toString() === _fn.toString())
//			{
//				return i;
//			}
//		}
//
//		return -1;
//	},
//
//	/**
//	* 创建委托
//	*/
//	createDelegate : function()
//	{
//		var __method = this;
//    	var args     = Array.prototype.slice.call(arguments);
//    	var object   = args.shift();
//    	return function() {
//        	return __method.apply(object, args.concat(Array.prototype.slice.call(arguments)));
//		};
//	},
//	
//	/**
//	* 发布事件
//	*/
//	dispatchEvent : function()
//	{
//		if(arguments.length < 1)
//		{
//			return false;
//		}
//
//		var args = Array.prototype.slice.call(arguments), _this = this;
//		$.each(args, function(index, eType){
//			if(_this._hasDispatch(eType))
//			{
//				return true;
//			}
//			_this._eventsList[eType.toLowerCase()] = [];
//		});
//
//		return this;
//	},
//	
//	/**
//	* 触发事件
//	*/
//	fireEvent : function()
//	{
//		if(arguments.length < 1)
//		{
//			return false;
//		}
//
//		var args = Array.prototype.slice.call(arguments), eType = args.shift().toLowerCase(), _this = this;
//		if(this._hasDispatch(eType))
//		{
//			var list = this._eventsList[eType];
//			if (!list)
//			{
//				return this;
//			}
//
//			$.each(list, function(index, dict){
//				var fn = dict.fn, scope = dict.scope || _this;
//				if(!fn || "function" !== typeof fn)
//				{
//					fn = _this._emptyFn;
//				}
//				if(true === scope)
//				{
//					scope = null;
//				}
//
//				fn.apply(scope, args);
//			});
//		}
//
//		return this;
//	},
//	
//	/**
//	* 订阅事件
//	* @param eType 事件类型
//	* @param fn 事件句柄
//	* @param scope
//	*/
//	on : function(eType, fn, scope)
//	{
//		eType = (eType || '').toLowerCase();
//		if(!this._hasDispatch(eType))
//		{
//			throw new Error("not dispatch event " + eType);
//			return false;
//		}
//
//		this._eventsList[eType].push({fn : fn || null, scope : scope || null});
//
//		return this;
//	},
//	
//	/**
//	* 取消订阅某个事件
//	* @param eType 事件类型
//	* @param fn 事件句柄
//	*/
//	un : function(eType, fn)
//	{
//		eType = (eType || '').toLowerCase();
//		if(this._hasDispatch(eType))
//		{
//			var index = this._indexFn(eType, fn);
//			if(index > -1)
//			{
//				var list = this._eventsList[eType];
//				list.splice(index, 1);
//			}
//		}
//
//		return this;
//	},
//	
//	/**
//	* 取消订阅所有事件
//	*/
//	die : function(eType)
//	{
//		eType = (eType || '').toLowerCase();
//		if(this._eventsList[eType])
//		{
//			this._eventsList[eType] = [];
//		}
//
//		return this;
//	}
//};

////系统中所有表单页面弹窗传递GIS经纬度值事件
//window.GEventObject = new Observer();
//window.GEventObject.dispatchEvent("LOAD_BDMAPPT_EVENT");