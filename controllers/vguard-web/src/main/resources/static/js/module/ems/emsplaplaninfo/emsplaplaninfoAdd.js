$(document).ready(function() {

	SelectOption.loadEmsPlanLevel("planlevel");
	SelectOption.loadEmsPlanType("plantype");
	//预案模板
	SelectOption.loadBaseCodeFromDB(BASE_URL+"/ems/emsplatemplate/plantemplateselect","plantemplate");
	//行业类型
	SelectTree.loadEconindustrySelect("industryname");
	
	showUploadFile("file_0",'file',true);//显示文件上传控件
	
	$("#planform").validate({
		rules: {
			planno: {
				required: true,
				remote:{
				    url: BASE_URL+'/ems/emsplaplaninfo/existsPlanno',     //后台处理程序
				    type: "post",               //数据发送方式
				    dataType: "json",           //接受数据格式   
				    data: {                     //要传递的数据
				    	planid: function() {
				            return $("#planid").val();
				        },
				        planno: function() {
				            return $("#planno").val();
				        }
				    }
				}
			},
			planname: {
				required: true
			},
			districtname: {
				required: true
			},
			planlevel: {
				required: true
			},
			plantype: {
				required: true
			},
			plantemplate: {
				required: true
			},
			releasetime: {
				required: true
			}
		},
		messages: {
			planno: {
				required: "预案编号不能为空",
				remote: "预案编号已存在!"
			},
			planname: {
				required: "预案名称不能为空"
			},
			districtname: {
				required: "所在区域不能为空"
			},
			planlevel: {
				required: "预案级别不能为空"
			},
			plantype: {
				required: "预案类型不能为空"
			},
			plantemplate: {
				required: "预案模板不能为空"
			},
			releasetime: {
				required: "发布时间不能为空"
			}
		},
		submitHandler:function(form){
	    	save();
	    }   
	});
});


/**保存
function save(){
	$.ajax({
		type : 'post',
		url : BASE_URL+'/ems/emsplaplaninfo/save',
		cache : false,
		dataType : 'json',
		data : $("#planform").serializeArray(),
		global : false,
		success : function(json) {
			if(json.success==true){
				parent.toast(json.msg);//弹出提示信息
				parent.getActiveIFrame().reloadGrid();//刷新列表
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
*/

/*保存(新增或编辑)*/
function save(){
	//获取file的全部id  
    var uplist = $("input[name^=file]");  
	var arrId = [];  
	for (var i=0; i< uplist.length; i++){  
	    if(uplist[i].value){  
	        arrId[i] = uplist[i].id;  
	    }  
    }
	$("#deleteids").val(deleteids);
	$.ajaxFileUpload({
		type : 'post',
		url : BASE_URL+'/ems/emsplaplaninfo/save',
		secureuri:false,
	    files : arrId,
		cache : false,
		dataType : 'json',
		data : $("#planform").serializeArray(),
		global : false,
		success : function(json) {
			if(json.success==true){
				try{
					parent.parent.toast(json.msg);//弹出提示信息
					parent.parent.getActiveIFrame().reloadGrid();//刷新列表
					parent.parent.closeWin();// 关闭弹出框
				}catch(e){
					parent.toast(json.msg);//弹出提示信息
					parent.getActiveIFrame().reloadGrid();//刷新列表
					parent.closeWin();// 关闭弹出框
				}
			}else{
				try{
					parent.parent.toast(json.msg);					
				}catch(e){
					parent.toast(json.msg);										
				}
			}
		},
		error : function(data,status,e) {
			parent.toast("保存失败");
		}
	});
}

/**
 * 将要删除的附件（数据库中已经保存的附件）
 */
var deleteids = new Array();

function createSelect(trid){
	//<select id="attachtype_$attach.attachid" name="attachtype_$attach.attachid" class="form-control text-center" selectvalue="$attach.attachtype" disabled></select>
	var selectEle = document.createElement("select"); 
	selectEle.id = "select_"+trid;
	selectEle.name = "select_"+trid;
	selectEle.className = "form-control text-center";
	selectEle.options.add(new Option("预案电子档","1")); 
	selectEle.options.add(new Option("救援方案标绘图","2")); 
	selectEle.options.add(new Option("组织机构图附件","3")); 
	selectEle.options.add(new Option("通讯录附件","4")); 
	selectEle.options.add(new Option("平面图附件","5")); 
	selectEle.options.add(new Option("应急资源情况附件","6")); 
	selectEle.options.add(new Option("工作流程附件","7")); 
	selectEle.options.add(new Option("其他附件","8")); 
	return selectEle;
}

function createUploadFile(trid){
  var divEle = document.createElement("div");   
  divEle.id="file_"+trid;
  return divEle;
}

function createDelBtn(trid){
	var bElement=document.createElement("input");  
	bElement.type="button";
	bElement.className="btn btn-primary";
	bElement.onclick=Function("deleteRow("+trid+")");  
	bElement.value="删除行";
	return bElement;
}

function createRow(){ 
	var table = document.getElementById("planattachs");
    var tr = table.insertRow(table.rows.length);
    var time= new Date().getTime();
    tr.id = time;
	var select = createSelect(time);
	var filediv = createUploadFile(time);
	var delBtn = createDelBtn(time);
	
    var td1 = tr.insertCell();
	td1.appendChild(select);
    var td2 = tr.insertCell();
	td2.appendChild(filediv);
    var td3 = tr.insertCell();
	td3.appendChild(delBtn);
	
	showUploadFile("file_"+time,'file',true);//显示文件上传控件
}

function deleteRow(trid){
	var index = "";
	var trs = $("#planattachs tr");
	$.each(trs,function(n,value) {  
		if(trid==value.id){
			index = n;
		}      
    });  
	if(index){
		var table = document.getElementById("planattachs");
		table.deleteRow(index);
	}
}

/**
 * 删除数据库中已经保存的附件
 * @param id
 */
function deleteOldAttach(id){
	deleteRow(id);
	deleteids.push(id);
}

