
$(function () {		
	$("#hiddendangerForm").validate({
		rules: {
			hiddendangername:{
				required: true
			},
			hiddendangerlevel:{
				required: true
			},
			findtime:{
				required: true
			},
			findsite:{
				required: true
			},
			reformtype:{
				required: true
			},
			hiddendangercontent: {
				required: true,
				maxlength:200
			},
			cause : {
				maxlength:100
			},
			affect:{
				maxlength:100
			},
			checkperson:{
				required: true
			},
			hiddendangertype: {
				required: true
			}/*,
			placeareaid: {
				required: true
			},
			reformusers: {
				required: true
			}*/
		},
		messages: {
			entid:{
				required: "企业名称不能为空"
			},
			hiddendangername:{
				required: "整改项目不能为空"
			},
			hiddendangerlevel:{
				required: "隐患级别不能为空"
			},
			findtime:{
				required: "发现时间不能为空"
			},
			findsite:{
				required: "发现地点不能为空"
			},
			reformtype:{
				required: "整改措施不能为空"
			},
			hiddendangercontent: {
				required: "存在隐患不能为空",
				maxlength:"最多输入200个字"
			},
			cause : {
				maxlength:"最多输入200个字"
			},
			affect : {
				maxlength:"最多输入200个字"
			},
			checkperson:{
				required: "检查人员不能为空"
			},
			hiddendangertype: {
				required: "隐患类别不能为空"
			}/*,
			placeareaid: {
				required: "请选择所在区域"
			},
			reformusers: {
				required: "整改责任人不能为空"
			}*/
		},
		submitHandler:function(form){
			save();
		}   
	});
	
	$.ajax({
		type : "post",
		url : BASE_URL + "hidden/hidhiddendanger/loadBydangerid",
		dataType : "json",
		data :{
			"id":getQueryString('dangerid'),
		},
		success : function(data) {
			if (data) {
				var enttransferTpt = _.template($("#hiddendangerTpt").html());
				$("#hiddendangerForm").html(enttransferTpt(data));
				var usertype = $("#userType").val();
				//如果为企业隐患，显示
				if (usertype != "ENT") {
					if (data.hiddendangertype == '2') {
						$("#checkEnt").css("display","table-row");
						$("#entid").rules("add", {
							required: true,
							messages: {
								required: "企业不能为空"
							}
						});
						$("#placeareaid").rules("remove", "required");
					}else{
					$("#placeareaid").rules("add", {
			            required: true,
			            messages: {
			                required: "所在区域不能为空"
			            }
			        });
					$("#entid").rules("remove", "required");
						$("#checkEnt").css("display","none");
					}
					SelectTree.loadDeptUserSelect("reformusers");
					
					//隐患类别切换
					$("#hiddendangertype").off("change").on("change",function(){
						if ($("#hiddendangertype").val() == 2) {
							$("#checkEnt").css("display","table-row");
							$("#entid").rules("add", {
					            required: true,
					            messages: {
					                required: "企业不能为空"
					            }
					        });
							$("#placeareaid").rules("remove", "required");
							$("#areaLabel,#areaSelect").css("display","none");
						}else{
							$("#placeareaid").rules("add", {
					            required: true,
					            messages: {
					                required: "所在区域不能为空"
					            }
					        });
							$("#checkEnt").css("display","none");
							$("#entid").rules("remove", "required");
							$("#areaLabel,#areaSelect").css("display","table-cell");
						}
					});
				}
				
				//隐患整改期限切换 1立即整改正 0限期整改
				if ($("input[name='reformtype']:checked").val() == 0) {
					$("#reformterm1").show();
					$("#reformterm2").show();
					if(data.reformterm == null || data.reformterm == ""){
						$("#reformterm").val("15");
					}
				}else {
					$("#reformterm1").hide();
					$("#reformterm2").hide();
					$("#reformterm").val("");
				}
				var reform = data.reform;
				if (data.findtime == "" ||  data.findtime == null) {
					$("#findtime").val(getNowFormatDate());
				}
				if (reform.endtime == "" ||reform.endtime == null ) {
					$("#endtime").val(getNowFormatDate());
				}
				if(data.dssRskRecord){
					var dssRskRecord = data.dssRskRecord;
					$("#hiddendangername").val(dssRskRecord.placeareaname+"/"+dssRskRecord.specificname+"隐患排查");
					$("#findsite").val(dssRskRecord.placeareaname+"/"+dssRskRecord.specificname);
				}
				SelectOption.loadDangerfrom("hiddendangerfrom");//隐患来源
				if (getQueryString('isAdd') == '0') {
					SelectOption.loadHiddendangerType("hiddendangertype");//隐患类别
				}
				
				/*************整改方式切换按钮开始***********************/
				if ($("input[name=reformtype]:checked").val() == 0 ) {
					$("#reformlist").hide();
					$("#reformresult").rules("remove", "required");
					$("#reformusers").rules("remove", "required");
				}else{
					$("#reformlist").show();
					$("#reformresult").rules("add", {
			            required: true,
			            messages: {
			                required: "整改措施不能为空"
			            }
			        });
					$("#reformusers").rules("add", {
			            required: true,
			            messages: {
			                required: "整改责任人不能为空"
			            }
			        });0
				}
				$("input[name=reformtype]").change(function(){
					if ($(this).val() == 0) {
						$("#reformlist").hide();
						$("#reformresult").rules("remove", "required");
						$("#reformusers").rules("remove", "required");
					}else{
						$("#reformlist").show();
						
						$("#reformresult").rules("add", {
				            required: true,
				            messages: {
				                required: "整改措施不能为空"
				            }
				        });
						$("#reformusers").rules("add", {
				            required: true,
				            messages: {
				                required: "整改责任人不能为空"
				            }
				        });
					}
				});
				/*************整改方式切换按钮结束***********************/
				var attachList = data.attachList;//图片附件
				var reformAttachList = data.reformAttachList;
	            var downloadurl = BASE_URL + 'hidden/hidattach/download/';
	            showMultipleInputFile("picDiv","filehidcheckpic","image",attachList, downloadurl, true);
	            showMultipleInputFile("reforPicDiv", "fileReformpic", "image", reformAttachList,downloadurl, true);
			}
		},
		error : function() {
			parent.toast("加载失败");
		}
	});
	
});

function reformType(type){
	if(type == "0"){
		$("#reformterm1").show();
		$("#reformterm2").show();
		$("#reformterm").val("15");
	} else {
		$("#reformterm1").hide();
		$("#reformterm2").hide();
		$("#reformterm").val("");
	}
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
	
function save() {
    var uplist = $("input[name^=file]");
    var arrId = [];
    for (var i = 0; i < uplist.length; i++) {
        if (uplist[i].value) {
            arrId[i] = uplist[i].id;
        }
    }
    var formData = $("#hiddendangerForm").serializeArray();
    console.log(formData);
//    formData.push({name:"rskrecordid",value:rskrecordid});
    $.ajaxFileUpload({
        type: "post",
        url: BASE_URL + "hidden/hidhiddendanger/save",
        files: arrId,
        async: false,
        data: formData,
        dataType: "json",
        success: function (data) {
        	if (data.success == true) {
        		dangerId = data.msg;//弹出提示信息
        		parent.toast("保存成功");//弹出提示信息
                parent.getActiveIFrame().reloadGrid();//重新加载
                parent.closeWin();// 关闭弹出框
            } else {
                parent.toast(data.msg);
            }
        },
        error: function (XMLHttpRequest, textStatus, errorThrown) {
            parent.toast("提交失败");
        }
    });
}

function loadEnt(){
	/**
	 * 加载企业
	 */
	window.top.GEventObject.die('LOAD_ENT_EVENT');
	window.top.GEventObject.on('LOAD_ENT_EVENT', function(rowdata) {
		$('#entid').val(rowdata.BUSINESSINFOID);
		$('#entname').val(rowdata.ENTNAME);
		$('#entname').blur();
	});
	var planid = $("#plan option:selected").val();
	window.top.openWin(BASE_URL+"/law/lawcheckinfo/entinfo?planid="+planid,' 企业信息','55%','63%');
}

function loadPlaceArea(){
	/**
	 * 加载区域
	 */
	window.top.GEventObject.die('LOAD_PALCEAREA_EVENT');
	window.top.GEventObject.on('LOAD_PALCEAREA_EVENT', function(rowdata) {
		$('#placeareaid').val(rowdata.PLACEAREAID);
		$('#placeareaname').val(rowdata.PLACEAREANAME);
		$('#placeareaname').blur();
	});
	window.top.openWin(BASE_URL + "views/module/hkpark_hidden/hiddenManager/dssrskplaceareaList.html",'区域信息','55%','63%');
}





function deleteFile(div, fileid) {
    $('#' + div).hide();
    $('#hidCheckAttachPics').append("<input class=\"form-control\" type='hidden' name='delids' value='" + fileid + "'/>");
}