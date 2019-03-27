/**
 * 新增和修改隐患排查记录信息
 */
$(function () {

    var sewageid = getQueryString("sewageid");
    
    var isDisplay = getQueryString("isDisplay");
    
    $("#swageForm").validate({
        rules: {
        	sewagname:{
        		required: true
        	},
        	sewagcode:{
        		required: true
        	},
        	sewageforecast:{
        		required: true,
        		isNumber:true,
        		wRessureCheck:true
        	},
            plantscale:{
            	isNumber:true,
            	wRessureCheck:true
            }
        },
        messages: {
        	sewagname:{
        		required: "设施名称不能为空"
        	},
        	sewagcode:{
        		required: "设施编号不能为空"
        	},
        	sewageforecast:{
        		required: "污水排放量预测（万立方米/日）不能为空",
        		isNumber:"请输入正确的数字格式",
        		wRessureCheck:"只能输入3位整数，至多保留2位小数"
        	},
            plantscale:{
            	isNumber:"请输入正确的数字格式",
        		wRessureCheck:"只能输入3位整数，至多保留2位小数"
            }
        },
        submitHandler: function (form) {
            save();
        }
    });


    $.ajax({
        type: "post",
        url: BASE_URL + "publics/publicsewage/load/"+sewageid,
        dataType: "json",
        data: {},
        success: function (data) {
            if (data) {
            	if (data.sewageplant == "0") {
            		data.type="是"
				}else{
					data.type="否"
				}
                var swageTpt = _.template($("#swageTpt").html());
                $("#swageForm").html(swageTpt(data));
                var attachList = data.attachList
                var artsList =  data.artsList;
                
                
                var downloadurl = BASE_URL + 'publics/publicattachment/download/';
                
                if (isDisplay == "isDisplay") {
                	showChooseFiles('swageDiv', attachList, downloadurl, false);
//                	initSwageTableText('sewageTable', artsList);
				}else{
					showMultipleInputFile("swageDiv","swageFile","flie",attachList, downloadurl, true);
					initSwageTable('sewageTable', artsList);
				}
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

/**
 * 初始化隐患排查项目列表
 * @param code
 * @param hidCheckItemes
 */
function initSwageTable(code, artsList) {
    if (artsList.length > 0) {
        $.each(artsList, function (n, art) {
            $('#' + code).append(' <tr id="swage' + n + '">' +
                    '<td>' +
                    '<input type="text" class="form-control" name="artname" value="' +art.artname+ '"/>' +
                    '</td>' +
                    '<td>' +
                    '<input type="text" class="form-control" name="artpart" value="' +art.artpart+ '"/>' +
                    '</td>' +
                    '<td>' +
                    '<input type="text" class="form-control" name="artnote" value="' +art.note+ '"/>' +
                    '</td>' +
                    '<td align="center">' +
                    '<a class="btn btn-danger" id="delBtn'+n+'" href="javascript:void(0);" onclick="delRow(\'swage' + n + '\')">删除</a>' +
                    '</td>' +
                    '</tr>'
            );
        });
    }
}

function initSwageTableText(code, artsList) {
    if (artsList.length > 0) {
        $.each(artsList, function (n, art) {
            $('#' + code).append(' <tr id="swage' + n + '">' +
                    '<td>' +
                    	art.artname+ 
                    '</td>' +
                    '<td>' +
                    art.artpart +
                    '</td>' +
                    '<td>' +
                    art.note +
                    '</td>'     
            );
        });
    }
}

//添加一行检查项
function addSewageRow() {
	
	var total = $('#sewageTable').children('tr:last-child').attr("id");
    var num;
    if (total) {
        num = parseInt(total.replace(/[^0-9]/ig, "")) + 1;
    } else {
        num = 0;
    }
    $('#sewageTable').append('<tr id="swage' + num + '">' +
            '<td>' +
            '<input type="text" class="form-control" placeholder="请输入工艺名称" name="artname"/>' +
            '</td>' +
            '<td>' +
            '<input type="text" class="form-control" placeholder="请输入工艺主体" name="artpart"/>' +
            '</td>' +
            '<td>' +
            '<input type="text" class="form-control" placeholder="请输入备注" name="artnote"/>' +
            '</td>' +
            '<td align="center">' +
            '<a class="btn btn-danger" href="javascript:void(0);" onclick="delRow(\'swage' + num + '\')">删除</a>' +
            '</td>' +
            '</tr>'
    );
}

function delRow(code) {
    $('#sewageTable').children('#' + code).remove();
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
    
    var swageArr = [];
    $('#sewageTable').children().each(function () {
        var swage = {};
        var isCanAdd = false;
        $(this).children().children("input").each(function () {
            if ($(this).attr('name') == 'artname') {
                if ($(this).val()) {
                	swage.artname = $(this).val();
                    isCanAdd = true;
                } else {
                    return;
                }
            } else if ($(this).attr('name') == 'artpart') {
            	swage.artpart = $(this).val() || "";
            }
            else if ($(this).attr('name') == 'artnote') {
            	swage.artnote = $(this).val() || "";
            }
        });
        if (isCanAdd) {
        	swageArr.push(swage);
        } else {
            return;
        }
        isCanAdd = false;
    });

    var formData = $("#swageForm").serializeArray();
    var artsList = {name: 'artsList', value: JSON.stringify(swageArr).replace(/\"/g, "'")};//替换双引号为单引号
    formData.push(artsList);
    console.log(formData);
    $.ajaxFileUpload({
        type: "post",
        url: BASE_URL + "publics/publicsewage/save",
        files: arrId,
        data: formData,
        dataType: "json",
        success: function (data) {
            if (data.success == true) {
                parent.toast(data.msg);//弹出提示信息
                parent.getActiveIFrame().reloadGrid();//重新加载
                parent.closeWin();// 关闭弹出框
            } else {
                parent.toast(data.msg);
            }
        },
        error: function (XMLHttpRequest, textStatus, errorThrown) {
        	console.log(textStatus);
            parent.toast("提交失败");
        }   
    });
}

/**
 * 定位
 */
function position(){
    var longitude;
    var latitude;
    var isDisplay = $("#isDisplay").val();
    
    //当编辑地图点位时
    if ("0" == isDisplay) {
    	longitude = encodeURIComponent($('#longitude').val());
    	latitude= encodeURIComponent($('#latitude').val());
    	window.top.GEventObject.die("LOAD_BDMAPPT_EVENT");
    	window.top.GEventObject.on("LOAD_BDMAPPT_EVENT", function(param) {
    		$('#longitude').val(param.lng);
    		$('#latitude').val(param.lat);
    	});
    } else {
    	longitude = encodeURIComponent($('#longitude').text());
    	latitude= encodeURIComponent($('#latitude').text());
    }
    parent.parent.openWin(BASE_URL + "/views/module/ems/common/emsMapLoc.html?lng=" + longitude + "&lat=" + latitude + "&isDisplay="+ isDisplay, "地理定位", "50%", "50%", false);
//    parent.parent.openWin(BASE_URL+"/olgis/gisOperBuss/position?module=gis&type=edit&longitude="+longitude+"&latitude="+latitude+"&areaName="+areaName+"&register=null",'地理定位','50%','50%',false);  
}