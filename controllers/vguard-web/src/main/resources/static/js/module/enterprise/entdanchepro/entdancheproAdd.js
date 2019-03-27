$(document).ready(function() {
	//初始化下拉框
	SelectOption.loadTureFalse("controlrequire");
	
	$("#entdancheproform").validate({
		rules: {
			dancheproname: {
				required: true
			},
			controlrequire: {
				required: true
			}
		},
		messages: {
			dancheproname: {
				required: "危险化工工艺名称不能为空"
			},
			controlrequire: {
				required: "是否满足国家规定的控制要求不能为空"
			}
		},
		submitHandler:function(form){
			save();
	    }   
	});
});

/*保存(新增或编辑)*/
function save(){
	$.ajax({
		type : 'post',
		url : BASE_URL+'/enterprise/entdanchepro/save',
		cache : false,
		dataType : 'json',
		data : $("#entdancheproform").serializeArray(),
		global : false,
		success : function(json) {
			if(json.success==true){
				parent.toast(json.msg);//弹出提示信息
				var index = parent.getParentIndex();
				parent.frames["layui-layer-iframe"+index].frames["contentIframe"].frames["chemIframe"].reloadGrid();//刷新列表
				parent.closeWin();// 关闭弹出框
			}else{
				parent.toast(json.msg);//弹出提示信息
			}
		},
		error : function() {
			parent.toast("保存失败");
		}
	});
}






/**
 * 选择危险化工工艺目录
 */
function showcatalog(){
	//危化品基础信息id
	var danexclusiveid = $("#danexclusiveid").val();
	//危险化工工艺信息id
	var dancheproid = $("#dancheproid").val();
	//危险化工工艺目录id
	var dcpcatalogid = $("#dcpcatalogid").val();
	window.location = BASE_URL + "/enterprise/entdanchepro/danchelog?danexclusiveid="+danexclusiveid+"&dancheproid="+dancheproid+"&dcpcatalogid="+dcpcatalogid;

	
	/*$('#directortypename').attr("disabled",true);
	$('#directortypename').val("");
	$('#directortypename_select').remove();*/
	
    /*if(districtcode!=null && districtcode!=""){
    	$('#directortypename').attr("disabled",false);
    	SelectTree.loadDirectorTypeAllSelect("directortypename",null,null,function(directortypeid){
    		if(directortypeid!= null && directortypeid!=""){
    			$.ajax( {
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
    			});
    		}
    	});
    }else{
    	$('#directortypename').attr("disabled",true);
    	$('#directortypename').val("");
    	$('#directortypename_select').remove();
    }*/
}


