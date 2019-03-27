/**
* select
**/




//通过Danger(重大危险源)查询所有属性信息
function businessByDanger(str,distCode){
	var data;
	var str =str|| "1";
	var distCode = distCode || "310115";
	var param = {"danger":str,
				 "distCode":distCode
				};
	$.ajax({
		type :'post',
		url : BASE_URL+'/olgis/gisOperBuss/businessByDanger',
		cache : false,
		dataType : 'json',
		data : param,
		global : false,
		async : false,
		success : function(map) {
			if(map.length == 0 || map ==null){
				window.wxc.xcConfirm("该类型内没有企业！", window.wxc.xcConfirm.typeEnum.info);
			}else{
				/*alert(str+"Danger范围内的企业："+map+","+map[0].BUSINESSINFOID+","+map[0].ENTNAME+","+map[0].ENTCODE+","+
						map[0].ADDRESS+","+map[0].LEGALPERSON+","+map[0].PHONE+","+map[0].LONGITUDE+","+
						map[0].LATITUDE+",共有："+map.length+"个");*/
				data = map;
			}
		},
		error : function(err) {
			window.wxc.xcConfirm("服务出错，请与管理员联系！", window.wxc.xcConfirm.typeEnum.warning);
		}
	});
	return data;
}

//通过DangerType(重大危险源类型)查询所有属性信息
function businessByDangerType(str){
	var data;
	var str = str||"2";
	var param = {"dangertype":str};
	$.ajax({
		type :'post',
		url : BASE_URL+'/olgis/gisOperBuss/businessByDangerType',
		cache : false,
		dataType : 'json',
		data : param,
		global : false,
		async : false,
		success : function(map) {
			if(map.length == 0 || map ==null){
				window.wxc.xcConfirm("该类型内没有企业！", window.wxc.xcConfirm.typeEnum.info);
			}else{
				/*alert(str+"范围内的企业："+map+","+map[0].BUSINESSINFOID+","+map[0].ENTNAME+","+map[0].ENTCODE+","+
						map[0].ADDRESS+","+map[0].LEGALPERSON+","+map[0].PHONE+","+map[0].LONGITUDE+","+
						map[0].LATITUDE+",共有："+map.length+"个");*/
				data = map;
			}
		},
		error : function() {
			window.wxc.xcConfirm("服务出错，请与管理员联系！", window.wxc.xcConfirm.typeEnum.warning);
		}
	});
	return data;
}

//通过Chemical(危险化学品)查询所有属性信息
function businessByChemical(str){
	var data;
	var str =str|| "1";
	var param = {"chemical":str};
	$.ajax({
		type :'post',
		url : BASE_URL+'/olgis/gisOperBuss/businessByChemical',
		cache : false,
		dataType : 'json',
		data : param,
		global : false,
		async : false,
		success : function(map) {
			if(map.length == 0 || map ==null){
				window.wxc.xcConfirm("该类型内没有企业！", window.wxc.xcConfirm.typeEnum.info);
			}else{
				/*alert(str+"chemical范围内的企业："+map+","+map[0].BUSINESSINFOID+","+map[0].ENTNAME+","+map[0].ENTCODE+","+
						map[0].ADDRESS+","+map[0].LEGALPERSON+","+map[0].PHONE+","+map[0].LONGITUDE+","+
						map[0].LATITUDE+",共有："+map.length+"个");*/
				data = map;
			}
		},
		error : function(err) {
			window.wxc.xcConfirm("服务出错，请与管理员联系！", window.wxc.xcConfirm.typeEnum.warning);
		}
	});
	return data;
}

//通过chemicaltype(危险化学品种类)查询所有属性信息
function businessByChemicalType(str){
	var data;
	var str =str|| "3";
	var param = {"chemicaltypeid":str};
	$.ajax({
		type :'post',
		url : BASE_URL+'/olgis/gisOperBuss/businessByChemicalType',
		cache : false,
		dataType : 'json',
		data : param,
		global : false,
		async : false,
		success : function(map) {
			if(map.length == 0 || map ==null){
				window.wxc.xcConfirm("该类型内没有企业！", window.wxc.xcConfirm.typeEnum.info);
			}else{
				/*alert(str+"chemicaltypeid范围内的企业："+map+","+map[0].BUSINESSINFOID+","+map[0].ENTNAME+","+map[0].ENTCODE+","+
						map[0].ADDRESS+","+map[0].LEGALPERSON+","+map[0].PHONE+","+map[0].LONGITUDE+","+
						map[0].LATITUDE+",共有："+map.length+"个");*/
				data = map;
			}
		},
		error : function(err) {
			window.wxc.xcConfirm("服务出错，请与管理员联系！", window.wxc.xcConfirm.typeEnum.warning);
		}
	});
	return data;
}

//按企业分类分布查询
function EntClassDistrictCount(){
	var data;

	$.ajax({
		type :'post',
		url : BASE_URL+'/olgis/gisOperBuss/entClassDistrictCount',
		cache : false,
		dataType : 'json',
		global : false,
		async : false,
		success : function(map) {
			data = map;
			/* SHORTNAME:区域名称
			 * INDUSTRYTYPE:: 1: 工业及危险化学品类 ; 2:商贸及服务类; 3:交通运输类; 4:工程建设类
			 * AREANUM:数量*/
		},
		error : function(err) {
			window.wxc.xcConfirm("服务出错，请与管理员联系！", window.wxc.xcConfirm.typeEnum.warning);
		}
	});
	return data;
}

//按企业分级分布查询
function EntGradeDistrictCount(){
	var data;

	$.ajax({
		type :'post',
		url : BASE_URL+'/olgis/gisOperBuss/entGradeDistrictCount',
		cache : false,
		dataType : 'json',
		global : false,
		async : false,
		success : function(map) {
			data = map;
			/* SHORTNAME:区域名称
			 * ALTERGRADE::0:未分级； 1: A级 ; 2: B级; 3:C级; 4:D级
			 * GRADENUM:数量*/
		},
		error : function(err) {
			window.wxc.xcConfirm("服务出错，请与管理员联系！", window.wxc.xcConfirm.typeEnum.warning);
		}
	});
	return data;
}

//按企业填报情况分布查询
function EntStatusDistrictCount(){
	var data;

	$.ajax({
		type :'post',
		url : BASE_URL+'/olgis/gisOperBuss/entStatusDistrictCount',
		cache : false,
		dataType : 'json',
		global : false,
		async : false,
		success : function(map) {
			data = map;
			/* SHORTNAME:区域名称
			 * STATUS::0:未填报; 1: 填报中 ; 2: 更新中; 3:已上报
			 * STATUSNUM:数量*/
		},
		error : function(err) {
			window.wxc.xcConfirm("服务出错，请与管理员联系！", window.wxc.xcConfirm.typeEnum.warning);
		}
	});
	return data;
}

//按危化品许可类型分布查询
function cheLicenceDistrictCount(){
	var data;

	$.ajax({
		type :'post',
		url : BASE_URL+'/olgis/gisOperBuss/cheLicenceDistrictCount',
		cache : false,
		dataType : 'json',
		global : false,
		async : false,
		success : function(map) {
			data = map;
			/* SHORTNAME:区域名称
			 * STATUS::0:无需许可; 1: 生产许可 ; 2:经营许可; 3:运输许可;4：使用许可;5废弃处置许可
			 * STATUSNUM:数量*/
		},
		error : function(err) {
			window.wxc.xcConfirm("服务出错，请与管理员联系！", window.wxc.xcConfirm.typeEnum.warning);
		}
	});
	return data;
}

//按企业采集时间查询
function entAcqTimeCount(str){
	var data;
	var str =str|| "2016_06_12";
	var param = {"updatetime":str};
	$.ajax({
		type :'post',
		url : BASE_URL+'/olgis/gisOperBuss/entAcqTimeCount',
		cache : false,
		dataType : 'json',
		data : param,
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

/*查询有安全隐患的企业*/
function entHiddendanger(){
	var data;
	$.ajax({
		type :'post',
		url : BASE_URL+'/hiddendanger/hdientcount/hdientListGIS',
		data:{districtid:""},
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

/*查询全部企业信息*/
function businessAllList(){
	var data;
	$.ajax({
		type :'post',
		url : BASE_URL+'/olgis/gisOperBuss/businessAllList',
		cache : false,
		dataType : 'json',
		global : false,
		async : false,
		success : function(map) {
			if(map.length == 0 || map ==null){
				window.wxc.xcConfirm("该类型内没有企业！", window.wxc.xcConfirm.typeEnum.info);
			}else{
				/*alert(str+"Danger范围内的企业："+map+","+map[0].BUSINESSINFOID+","+map[0].ENTNAME+","+map[0].ENTCODE+","+
						map[0].ADDRESS+","+map[0].LEGALPERSON+","+map[0].PHONE+","+map[0].LONGITUDE+","+
						map[0].LATITUDE+",共有："+map.length+"个");*/
				data = map;
			}
		},
		error : function(err) {
			window.wxc.xcConfirm("服务出错，请与管理员联系！", window.wxc.xcConfirm.typeEnum.warning);
		}
	});
	return data;
}
