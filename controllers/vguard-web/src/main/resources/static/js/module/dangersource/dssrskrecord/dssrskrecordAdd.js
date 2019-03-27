/*新增或编辑场所环境*/
$(function () {

	var rskrecordid = getQueryString("rskrecordid");
	$("#dssRskRecordForm").validate({
		rules: {
			placeareaid:{
                required: true
			},
			postequipid:{
                required: true
			},
            eventcategory:{
                required: true
			},
            riskfactor:{
                required: true
			},
            exitmeasure:{
                required: true
			}
		},
		messages: {
			placeareaid:{
                required: "请填写场所区域"
            },
            postequipid:{
                required: "请填写岗位/设备"
            },
            eventcategory:{
                required: "请选择安全风险"
            },
            riskfactor:{
                required: "请填写危险因素"
            },
            exitmeasure:{
                required: "请填写现有控制措施"
            }
		},
		submitHandler:function(form){
			save();
		}   
	});

	/*保存(新增或编辑)*/
	$.ajax({
		type : "post",
		url : BASE_URL + "dangersource/dssrskrecord/load",
		dataType : "json",
		data :{
            rskrecordid:rskrecordid
		},
		success : function(data) {
			if (data) {
				var dssRskRecordTpt = _.template($("#dssRskRecordTpt").html());
				$("#dssRskRecordForm").html(dssRskRecordTpt(data));
				SelectOption.loadPlacearea("placeareaid");
				$("#postequipid").attr("disabled",true); 
				if($('#placeareaid').attr('selectvalue')!=""){
					$("#postequipid").attr("disabled",false); 
					SelectOption.loadPostequip("postequipid",{"placeareaid":$('#placeareaid').attr('selectvalue')});
				}
				SelectOption.loadRskDic("eventcategory",{rskdictype:"eventcategory"});
			    $("#placeareaid").bind("change",function(){
			        $("#postequipid").html("");
			        if($(this).val()!=""){
						$("#postequipid").attr("disabled",false); 
						SelectOption.loadPostequip("postequipid",{"placeareaid":$(this).val()});
					}
			    });
			}
		},
		error : function() {
			parent.toast("初始化信息加载失败");
		}
	});
});

function formatRepo(repo) {
    if (repo.loading) {
        return repo.text;
    }
    var markup = "<div class='select2-result-repository clearfix'>" + repo.text + "</div>";

    return markup;
}

function formatRepoSelection(repo) {
	if(repo.id) {
        $("#businessinfoid").val(repo.id);
    }

    if(repo.text){
        $("#businessinfoname").val(repo.text);
	}
    return repo.text;
}

function getQueryString(name)
{
     var reg = new RegExp("(^|&)"+ name +"=([^&]*)(&|$)");
     var r = window.location.search.substr(1).match(reg);
     if(r!=null)return  unescape(r[2]); return null;
}

/**
 * 保存
 * @returns
 */
function save(){
	$.ajax({
		type : "post",
		url : BASE_URL + "dangersource/dssrskrecord/save",
		data : $("#dssRskRecordForm").serializeArray(),
		success : function(data) {
			if(data.success==true){
				parent.toast(data.msg);//弹出提示信息
				parent.getActiveIFrame().reloadGrid();//重新加载
				parent.closeWin();// 关闭弹出框
			}else{
				parent.toast(data.msg);
			}
		},
		error : function() {
			parent.toast("编辑失败");
		}
	});
	
}

