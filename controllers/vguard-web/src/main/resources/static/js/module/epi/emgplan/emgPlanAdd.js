/**
 * 新增和修改隐患排查记录信息
 */
$(function () {

    var emgplanid = getQueryString("emgplanid");
    var entid = getQueryString("entid");
    var addPage = getQueryString("addPage");
    
    var isDisplay = getQueryString("isDisplay");
    
    $("#emgplanForm").validate({
        rules: {
        	emgplanno:{
        		required: true
        	},
        	emgplanname:{
        		required: true
            },
            emgplanlevel:{
            	required: true
            },
            emgplantype:{
            	required: true
            }
        },
        messages: {
        	emgplanno:{
        		required: "预案编号不能为空",
        		
        	},
        	emgplanname:{
        		required:"预案名称不能为空"
            },
            emgplanlevel:{
            	required: "预案级别不能为空",
            },
            emgplantype:{
            	required: "预案类型不能为空",
            }
        },
        submitHandler: function (form) {
            save();
        }
    });

    $.ajax({
        type: "post",
        url: BASE_URL + "epi/epiemgplan/load/"+emgplanid,
        dataType: "json",
        data: {},
        success: function (data) {
        	var emgplanTpt = _.template($("#emgplanTpt").html());
            $("#emgplanForm").html(emgplanTpt(data));
            
            var downloadurl = BASE_URL + 'epi/epiemgplan/download/';
            
            if (isDisplay !="isDisplay") {
            	SelectOption.loadEmsPlanLevel("emgplanlevel");//预案级别
            	SelectOption.loadEmsPlanType("emgplantype");//预案类型
            	
            	showMultipleInputFile("epiregimeFile","epiregimeFile","file",data.epiregimeFile, downloadurl, true);
            	showMultipleInputFile("planFile","planFile","file",data.planFile, downloadurl, true);
			}else{
            	showChooseFiles("epiregimeFile",data.epiregimeFile, downloadurl, false);
            	showChooseFiles("planFile",data.planFile, downloadurl, false);
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
        url: BASE_URL + "epi/epiemgplan/save",
        files: arrId,
        async: false,
        data: $("#emgplanForm").serializeArray(),
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