$(document).ready(function() {
	//单位管辖隶属关系
	SelectOption.loadSubjection("subjection");
	
	selectCommunity();
	
	$("#entbusinessinfoform").validate({
		rules: {
			directortypename: {
				required:true,
			},
			deoid: {
				required:true
			},
			islittle: {
				required:true
			},
			isscale: {
				required:true
			},
			subjection: {
				required:true
			}
		},
		messages: {
			directortypename: {
				required: "行业主管分类不能为空"
			},
			deoid: {
				required: "行业主管部门不能为空"
			},
			islittle: {
				required: "请选择是否三小场所"
			},
			isscale: {
				required: "请选择是否规模企业"
			},
			subjection: {
				required: "请选择单位管辖隶属关系"
			}
		},
	    errorPlacement: function (error, element) { //指定错误信息位置
	       if (element.is(':radio') || element.is(':checkbox')) { //如果是radio或checkbox
	         var eid = element.attr('name'); //获取元素的name属性
	         error.appendTo($('.'+eid+'Div')); //将错误信息添加当前元素的父结点后面
	       } else {
	    	 var validenddate = $('#validenddate').attr('id'); //获取的结束时间id
	    	 var id = element.attr('id');
	    	 if(validenddate == id){
	    		 error.appendTo($('.validenddateDiv')); //将错误信息添加当前元素的父结点后面
	    	 }else{
	    		 error.insertAfter(element);
	    	 }
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
		url : BASE_URL+'/enterprise/entbusinessinfo/saveClassify',
		cache : false,
		dataType : 'json',
		data : $("#entbusinessinfoform").serializeArray(),
		global : false,
		success : function(json) {
			if(json.success==true){
				parent.toast(json.msg);//弹出提示信息
				parent.getActiveIFrame().reloadGrid();//重新加载
				parent.closeWin();// 关闭弹出框
			}else{
				parent.toast(json.msg);
			}
		},
		error : function() {
			parent.toast("保存失败");
		}
	});
}

/**
 * 选择社区
 */
function selectCommunity(){
	var districtcode = $('#community').val();
	
	$('#directortypename').attr("disabled",true);
	$('#directortypename').val("");
	$('#directortypename_select').remove();
	
    if(districtcode!=null && districtcode!=""){
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
    }
}

/**
 * 递归
 * @param orgname 关联的机构
 * @param nodeId 节点id
 * @param datas 数据
 * @returns {String}
 */
function recursive(orgname,nodeId,datas){
	for(var i=0;i<datas.length;i++){
		var pid = datas[i].pId;
		var id = datas[i].id;
		var name = datas[i].name;
		if(nodeId==id){
			orgname = name + "->"+ orgname;
			orgname = recursive(orgname,pid,datas);
		}
	}
	return orgname;
}
