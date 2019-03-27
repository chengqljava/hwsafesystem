/*查询应急机构*/
function emergerByOrgan(){
	var data;
	$.ajax({
		type :'post',
		url : BASE_URL+'/ems/emsresorg/loadList',
		cache : false,
		dataType : 'json',
		global : false,
		async : false,
		success : function(map) {
			data = map;
		},
		error : function(err) {
			window.wxc.xcConfirm("服务出错，请与管理员联系！", window.wxc.xcConfirm.typeEnum.warning);
		}
	});
	return data;
}
/*查询应急仓库*/
function emergerByDepos(){
	var data;
	$.ajax({
		type :'post',
		url : BASE_URL+'/ems/emsresdepos/loadList',
		cache : false,
		dataType : 'json',
		global : false,
		async : false,
		success : function(map) {
			data = map;
		},
		error : function(err) {
			window.wxc.xcConfirm("服务出错，请与管理员联系！", window.wxc.xcConfirm.typeEnum.warning);
		}
	});
	return data;
}
/*查询应急队伍*/
function emergerByTeam(){
	var data;
	$.ajax({
		type :'post',
		url : BASE_URL+'/ems/emsresteam/loadList',
		cache : false,
		dataType : 'json',
		global : false,
		async : false,
		success : function(map) {
			data = map;
		},
		error : function(err) {
			window.wxc.xcConfirm("服务出错，请与管理员联系！", window.wxc.xcConfirm.typeEnum.warning);
		}
	});
	return data;
}
/*查询应急物资*/
function emergerByMaterial(){
	var data;
	$.ajax({
		type :'post',
		url : BASE_URL+'/ems/emsresmaterial/loadList',
		cache : false,
		dataType : 'json',
		global : false,
		async : false,
		success : function(map) {
			data = map;
		},
		error : function(err) {
			window.wxc.xcConfirm("服务出错，请与管理员联系！", window.wxc.xcConfirm.typeEnum.warning);
		}
	});
	return data;
}
/*查询全部的应急资源*/
function emergerByAll(){
	var data;
	$.ajax({
		type :'post',
		url : BASE_URL+'/ems/emsresorg/loadresource',
		cache : false,
		dataType : 'json',
		global : false,
		async : false,
		success : function(map) {
			data = map;
		},
		error : function(err) {
			window.wxc.xcConfirm("服务出错，请与管理员联系！", window.wxc.xcConfirm.typeEnum.warning);
		}
	});
	return data;
}