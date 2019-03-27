/**
 * 新增和修改隐患排查记录信息
 */
$(function () {

    var consid = getQueryString("consid");
    var entid = getQueryString("entid");
    var addPage = getQueryString("addPage");
    
    var isDisplay = getQueryString("isDisplay");
    
    $("#contructionForm").validate({
        rules: {
        	projectname:{
        		required: true
        	},
        	constructionname:{
        		required: true
            },
            totalproduct:{
            	isNumber:true
            },
            environmentproduct:{
            	isNumber:true
            },
            factamount:{
            	isNumber:true
            }
        },
        messages: {
        	projectname:{
        		required: "项目名称不能为空",
        		
        	},
        	constructionname:{
        		required:"建设单位不能为空"
            },
            totalproduct:{
            	isNumber:"请输入正确的数字格式"
            },
            environmentproduct:{
            	isNumber:"请输入正确的数字格式"
            },
            factamount:{
            	isNumber:"请输入正确的数字格式"
            }
        },
        submitHandler: function (form) {
            save();
        }
    });

    $.ajax({
        type: "post",
        url: BASE_URL + "epi/epiconstructioninfo/load/"+consid,
        dataType: "json",
        data: {},
        success: function (data) {
        	var contructionTpt = _.template($("#contructionTpt").html());
            $("#contructionForm").html(contructionTpt(data));
            var downloadurl = BASE_URL + 'epi/epiconstructioninfo/download/';
            
            if (isDisplay !="isDisplay") {
            	SelectOption.loadRiverCode("rivercode");//所在流域
            	SelectOption.loadIndustryClass("industryclass");//产业类别
            	SelectOption.loadIndustryPolicy("industrypolicy");//产业政策
            	showMultipleInputFile("threeSameFile","threeSameFile","file",data.threeSameFile, downloadurl, true);
            	showMultipleInputFile("projectFile","projectFile","file",data.projectFile, downloadurl, true);
            	showMultipleInputFile("approveFile","approveFile","file",data.approveFile, downloadurl, true);
            	showMultipleInputFile("checkFile","checkFile","file",data.checkFile, downloadurl, true);
			}else{
				showChooseFiles("threeSameFile",data.threeSameFile, downloadurl, false);
            	showChooseFiles("projectFile",data.projectFile, downloadurl, false);
            	showChooseFiles("approveFile",data.approveFile, downloadurl, false);
            	showChooseFiles("checkFile",data.checkFile, downloadurl, false);
			}
            if (addPage == "addPage") {
            	$("#entid").val(entid);
			}
        },
        error: function () {
        	parent.parent.toast("初始化信息加载失败!");
        }
    });
    
});

function getQueryString(name)
{
    var reg = new RegExp("(^|&)"+ name +"=([^&]*)(&|$)");
    var r = window.location.search.substr(1).match(reg);
    if(r!=null)return  unescape(r[2]); return null;
}

/**保存*/
function save() {
	var dangerId;
    var uplist = $("input[name^=file]");
    var arrId = [];
    for (var i = 0; i < uplist.length; i++) {
        if (uplist[i].value) {
            arrId[i] = uplist[i].id;
        }
    }
    $.ajaxFileUpload({
        type: "post",
        url: BASE_URL + "epi/epiconstructioninfo/save",
        files: arrId,
        async: false,
        data: $("#contructionForm").serializeArray(),
        dataType: "json",
        success: function (data) {
        	if (data.success == true) {
        		parent.parent.toast(data.msg);//弹出提示信息
        		var index = parent.getParentIndex();
 				parent.frames["layui-layer-iframe"+index].frames["contentIframe"].reloadGrid();//刷新列表
 				parent.frames["layui-layer-iframe"+index].$('#ent_safereward').val("true");
 				parent.frames["layui-layer-iframe"+index].loadSafemenutree();
                parent.closeWin();// 关闭弹出框
            } else {
                parent.toast(data.msg);
            }
        },
        error: function (XMLHttpRequest, textStatus, errorThrown) {
        	console.log(textStatus);
        	parent.parent.toast("提交失败");
        }
    });
}