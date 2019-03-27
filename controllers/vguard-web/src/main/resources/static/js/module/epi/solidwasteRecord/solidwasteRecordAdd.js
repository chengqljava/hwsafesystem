/**
 * 新增和修改隐患排查记录信息
 */
$(function () {

    var solidwasteid = getQueryString("solidwasteid");
    var entid = getQueryString("entid");
    var addPage = getQueryString("addPage");
    
    var isDisplay = getQueryString("isDisplay");
    
    $("#solidWasterForm").validate({
        rules: {
        	solidwastename:{
        		required: true
        	},
        	gentime:{
        		required: true
            },
            genquantity:{
            	isNumber:true
            },
            handlecapacity:{
            	isNumber:true
            }
        },
        messages: {
        	solidwastename:{
        		required: "固体废物名称不能为空",
        		
        	},
        	gentime:{
        		required:"产生时间不能为空"
            },
            genquantity:{
            	isNumber:"请输入正确的数字格式"
            },
            handlecapacity:{
            	isNumber:"请输入正确的数字格式"
            }
        },
        submitHandler: function (form) {
            save();
        }
    });

    $.ajax({
        type: "post",
        url: BASE_URL + "epi/episolidwasterecord/load/"+solidwasteid,
        dataType: "json",
        data: {},
        success: function (data) {
        	var solidWasterTpt = _.template($("#solidWasterTpt").html());
            $("#solidWasterForm").html(solidWasterTpt(data));
            if (addPage == "addPage") {
            	$("#entid").val(entid);
			}
        },
        error: function () {
            parent.toast("初始化信息加载失败!");
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
    $.ajax({
        type : 'post',
        url : BASE_URL + 'epi/episolidwasterecord/save',
        cache : false,
        dataType : 'json',
        data : $("#solidWasterForm").serializeArray(),
        global : false,
        success : function(json) {
            if (json.success == true) {
                parent.toast(json.msg);
                //弹出提示信息
                var index = parent.getParentIndex();
				parent.frames["layui-layer-iframe"+index].frames["contentIframe"].reloadGrid();//刷新列表
				parent.frames["layui-layer-iframe"+index].$('#ent_safereward').val("true");
				parent.frames["layui-layer-iframe"+index].loadSafemenutree();
                //刷新列表
                parent.closeWin();
                // 关闭弹出框
            } else {
                parent.toast(json.msg);
            }
        },
        error : function() {
            parent.toast("保存失败");
        }
    });
}