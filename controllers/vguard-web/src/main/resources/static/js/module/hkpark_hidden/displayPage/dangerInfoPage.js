$(function () {
    var hiddendangerid = GetQueryString("hiddendangerid");
  
    $.ajax({
        type: "post",
        url: BASE_URL + "hidden/hidhiddendanger/loadbyid",
        dataType: "json",
        data: {
        	id: hiddendangerid
        },
        success: function (data) {
            if (data) {
                data.BASE_URL = BASE_URL;
                var reforms = data.reformList;
                data.reforms = data.reformList;
                data.rechecks = data.recheckList;
                var hiddendangerTpt = _.template($("#hiddendangerTpt").html());
                $("#hiddendangerForm").html(hiddendangerTpt(data));
                $('#slider-wrap').flexslider({
                    animation: "slide",
                    direction:"horizontal",
                    easing:"swing"
                });
                $('#slider-wrap1').flexslider({
                    animation: "slide",
                    direction:"horizontal",
                    easing:"swing"
                });
                $('#slider-wrap2').flexslider({
                    animation: "slide",
                    direction:"horizontal",
                    easing:"swing"
                });
                SelectTree.loadDeptUserSelect("reformusers");
            }
            var fileFlag = '0';
            //点击编辑按钮可编辑信息
            $("#editBtn").off('click').on('click',function(){
            	if (data.hiddendangerstate == '2') {
            		parent.toast("待确认隐患不可编辑!");
            		return;
				}
            	
            	if (data.hiddendangerstate == '3') {
            		$("#reformusers").removeAttr('disabled');
            		$("#reformresult").removeAttr('disabled');
            		$("#reformway").removeAttr('disabled');
            		$("#endtime").removeAttr('disabled');
            		$("#reformTr").css("display","table-row");
            		$('#yhzgTD').attr("rowspan",Number($('#yhzgTD').attr("rowspan"))+1);
				}
            	
            	if (data.hiddendangerstate == '4') {
            		$("#checkstate1").removeAttr('disabled');
            		$("#checkstate2").removeAttr('disabled');
            		$("#recheckresult").removeAttr('disabled');
            		$("#recheckusers").removeAttr('disabled');
            		$("#rechecktime").removeAttr('disabled');
            		$("#reckedTr").css("display","table-row");
                	$('#yhfcTD').attr("rowspan",Number($('#yhfcTD').attr("rowspan"))+1);
				}
            	
            	if (data.hiddendangerstate == '5') {
            		$("#cancelusers").removeAttr('disabled');
            		$("#canceltime").removeAttr('disabled');
				}
            	
            	if (data.hiddendangerstate == '6') {
            		parent.toast("已核销隐患不可编辑!");
            		return;
				}
//            	$("input,textarea").removeAttr('disabled');
            	$('#saveBtn,#cacelBtn').css('display','inline-block');
            	$('#canlFile').css('display','block');
            	$('#editBtn').css('display','none');
            	
            	var canlAttach = data.canllist;
            	var reformsAttach = reforms.attachs;
            	var downloadurl = BASE_URL + 'hidden/hidattach/download/';
            	if (fileFlag =='0') {
            		if (data.hiddendangerstate == '5') {
            			showMultipleInputFile("canlFile","noticefilepic","file",canlAttach, downloadurl, true);
					}
            		if (data.hiddendangerstate == '3') {
            			showMultipleInputFile("picDiv", "fileReformpic", "image", reformsAttach,downloadurl, true);
					}
            		if (data.hiddendangerstate == '4') {
            			showMultipleInputFile("picCheckDiv", "filerecheckpic", "image", reformsAttach,downloadurl, true);
					}
            		fileFlag ='1';
				}
            });
            
            //取消按钮操作
            $("#cacelBtn").off('click').on('click',function(){
            	$("#reformTr").css("display","none");
        		$("#reckedTr").css("display","none");
        		$('#yhzgTD').attr("rowspan",Number($('#yhzgTD').attr("rowspan"))-1);
        		$('#yhfcTD').attr("rowspan",Number($('#yhfcTD').attr("rowspan"))-1);
            	
            	$("input,textarea").attr('disabled','disabled');
            	$('#canlFile').css('display','none');
            	$('#saveBtn,#cacelBtn').css('display','none');
            	$('#reformusers').val('');
            	$('#editBtn').css('display','block');
            });
            
            $("#saveBtn").off('click').on('click',function(){
            	save();
            });
            //更改隐患状态
            changePic(data.hiddendangerstate);
           
        },
        error: function () {
            parent.toast("数据加载中，请稍后!");
        }
    });
});

function save() {
    var uplist = $("input[name^=file]");
    var arrId = [];
    for (var i = 0; i < uplist.length; i++) {
        if (uplist[i].value) {
            arrId[i] = uplist[i].id;
        }
    }
    
    console.log($("#hiddendangerForm").serializeArray());
//    return;
    $.ajaxFileUpload({
        type: "post",
        url: BASE_URL + "hidden/hidhiddendanger/saveDisplay",
        files: arrId,
        async: false,
        data: $("#hiddendangerForm").serializeArray(),
        dataType: "json",
        success : function(data) {
			if(data.success==true){
				parent.toast(data.msg);//弹出提示信息
				window.location.reload();
				parent.getActiveIFrame().reloadGrid();//重新加载
			}else{
				parent.toast(data.msg);
			}
		},
		error : function() {
			parent.toast("编辑失败");
		} 
    });
}


/**
 * 改变隐患状态
 * @param hiddendangerstate
 */
function changePic(hiddendangerstate){
	if (hiddendangerstate=='0') {
		$("#statePic").attr("class","dangerState ycl");
		$("#editBtn").text("关闭");
		$("#editBtn").off('click').on('click',function(){
			parent.closeWin();
		});
	}else if(hiddendangerstate=='2'){
		$("#statePic").attr("class","dangerState dqr");
		$("#editBtn").text("关闭");
		$("#editBtn").off('click').on('click',function(){
			parent.closeWin();
		});
	}else if (hiddendangerstate=='3') {
    	$("#statePic").attr("class","dangerState dzg");
	}else if(hiddendangerstate=='4'){
		$("#statePic").attr("class","dangerState dfc");
	}else if(hiddendangerstate=='5'){
		$("#statePic").attr("class","dangerState dhx");
	}else if(hiddendangerstate=='6'){
		$("#statePic").attr("class","dangerState yhx");
		$("#editBtn").text("关闭");
		$("#editBtn").off('click').on('click',function(){
			parent.closeWin();
		});
	}
}

function showRecord(hiddendangerid,type){
	if (type == 'yhzg') {
		parent.openWin(BASE_URL + "views/module/hkpark_hidden/displayPage/reformDisplayList.html?hiddendangerid="+hiddendangerid,
	            "隐患整改记录", "50%", "60%");
	}else{
		parent.openWin(BASE_URL + "views/module/hkpark_hidden/displayPage/recheckDisplayList.html?hiddendangerid="+hiddendangerid,
	            "隐患复查记录", "50%", "60%");
	}
	
}



function GetQueryString(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
    var r = window.location.search.substr(1).match(reg);
    if (r != null)return unescape(r[2]);
    return null;
}