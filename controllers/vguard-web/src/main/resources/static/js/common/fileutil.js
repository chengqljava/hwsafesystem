/**
 * 显示图片信息
 * @param filediv
 * @param filetype类型 图片或者文件
 * @param isnotpreview是否不显示预览
 * @param isdel 是否显示删除按钮(默认显示)
 */
function showUploadFile(filediv, filetype, ispreview, isdel) {
    if ($('#' + filediv).attr("id")) {
        //初始化
        $('#' + filediv).append($("<div id='fileshow" + filediv + "' style='display:none;'/>"));
        $('#' + filediv).append($("<div id='fileselect" + filediv + "' style='display:none;'/>"));

        //显示文件名
        var filename = $('#' + filediv).attr("filename");
        //文件id
        var fileid = $('#' + filediv).attr("fileid");
        //文件地址
        var fileurl = $('#' + filediv).attr("fileurl");

        var location = $('#'+filediv).attr("location");

        var issetlocation = $('#'+filediv).attr("issetlocation");

        if(issetlocation == 'true'){
            $('#fileshow' + filediv).append($(" <input type='text' value='"+location+"'/> "));
        }

        if (filename) {


            //存在文件名称
            if (filetype == "image") {
                $('#fileshow' + filediv).append($("<img style='width:50%;height:200px;' href='javascript:void(0);' src='" + fileurl + "' >"));
                if (isdel == null) {
                    $('#fileshow' + filediv).append($(" <input type='button' class='btn btn-primary btn-sm' value='删除' onclick=deleteFile('" + filediv + "','" + filetype + "'," + ispreview + ",'" + fileid + "')   /> "));
                } else {
                    if (isdel)
                        $('#fileshow' + filediv).append($(" <input type='button' class='btn btn-primary btn-sm' value='删除' onclick=deleteFile('" + filediv + "','" + filetype + "'," + ispreview + ",'" + fileid + "')   /> "));
                }
            } else {
                //		$('#fileshow'+filediv).append($("<input class=\"form-control\" id=\"uploadFile"+filediv+"\" value="+filename+" name=\"filemyfileA\" data-show-preview=\"false\" type=\"file\" multiple data-min-file-count=\"1\"><input type='button' class='btn btn-primary btn-sm' value='删除' onclick=deleteFile('"+filediv+"','"+filetype+"',"+ispreview+")   />"));
                $('#fileshow' + filediv).append($("<a href='javascript:void(0);' onclick=downloadFile('" + fileurl + "') >" + filename + "</a>"));
                if (isdel == null) {
                    $('#fileshow' + filediv).append($(" <input type='button' class='btn btn-primary btn-sm' value='删除' onclick=deleteFile('" + filediv + "','" + filetype + "'," + ispreview + ",'" + fileid + "')   /> "));
                } else {
                    if (isdel)
                        $('#fileshow' + filediv).append($(" <input type='button' class='btn btn-primary btn-sm' value='删除' onclick=deleteFile('" + filediv + "','" + filetype + "'," + ispreview + ",'" + fileid + "')   /> "));
                }
            }
            $('#fileshow' + filediv).show();
        } else {
            if (ispreview) {
                $('#fileselect' + filediv).append($("<input class=\"form-control\" id=\"uploadFile" + filediv + "\" name=\"file" + filediv + "\" data-show-preview=\"false\"  class=\"file\" type=\"file\" multiple data-min-file-count=\"1\">"));
            } else {
                $('#fileselect' + filediv).append($("<input class=\"form-control\" id=\"uploadFile" + filediv + "\" name=\"file" + filediv + "\" class=\"file\" type=\"file\" multiple data-min-file-count=\"1\">"));
            }
            $('#fileselect' + filediv).show();
        }
        showFileSelect("uploadFile" + filediv, filetype);
    }
}

function deleteFile(filediv, filetype, ispreview, fileid) {
    $('#fileshow' + filediv).hide();
    if (ispreview) {
        $('#fileselect' + filediv).append($("<input class=\"form-control\" id=\"uploadFile" + filediv + "\" name=\"file" + filediv + "\"  data-show-preview=\"false\" class=\"file\" type=\"file\" multiple data-min-file-count=\"1\">"));
    } else {
        $('#fileselect' + filediv).append($("<input class=\"form-control\" id=\"uploadFile" + filediv + "\" name=\"file" + filediv + "\" class=\"file\" type=\"file\" multiple data-min-file-count=\"1\">"));
    }
    $('#fileselect' + filediv).show();
    $('#' + filediv).append($("<input class=\"form-control\" type='hidden' name='delids' value='" + fileid + "'/>"));
    showFileSelect("uploadFile" + filediv, filetype);
}

/**
 *
 * @param code 控件id
 * @param list 附件列表 必须包含attachname  attachid
 * @param downurl
 * @param isDel
 */
function showChooseFiles(code, list, downurl, isDel) {

    if(list){//如果datas不为空判断类型
        if(list instanceof Array){
            //如果为数组
            $.each(list,function (i,item) {
                if(!item.hasOwnProperty("attachid")||!item.hasOwnProperty("attachname")){
                    //如果没有这两个属性表示返回的数据不符合规则
                	console.log("返回的数据不符合规则");
                    return;
                }
            });
        }else {
        	console.log("datas不是数组");
            return;
        }
    }


    var showDiv = code + "show";
    $("#" + code).before("<div id='" + showDiv + "' style='display: none'></div>");
    if (list && list.length > 0) {
        $('#' + showDiv).show();
        $.each(list, function (i, item) {
            var itemDiv = showDiv + i;
            $('#' + showDiv).append("<div id='" + itemDiv + "' style='margin-top: 3px;margin-bottom: 3px'><a href='javascript:void(0);' class='btn btn-link' onclick=downloadFile('" + downurl + item.attachid + "')>" + item.attachname + "</a></div>");
            if (isDel) {
                $('#' + itemDiv).prepend("<button type='button' class='btn btn-danger' style='float: right' onclick=deleteShowFile('" + itemDiv + "','" + item.attachid + "')>删除</button>")
            }
        });
    } else {
        $('#' + showDiv).hide();
    }
}

function deleteShowFile(div, fileid) {
    $('#' + div).hide();
    $('#' + div).append("<input class=\"form-control\" type='hidden' name='delids' value='" + fileid + "'/>");
}


/**
 *下载附件
 */
function downloadFile(attachurl) {
	console.log(attachurl);
    $.ajax({
        type: 'post',
        url: attachurl,
        cache: false,
        dataType: 'json',
        success: function (data) {
            if (data.success == true) {
                window.location.href = attachurl;
            } else {
                parent.toast(data.msg);
            }
        },
        error: function () {
            parent.toast("网络异常");
        }
    });
}

function showFileSelect(uploadFile, filetype) {
    var defaultparams = {
        language: 'zh',
        showUpload: false,
        showCaption: true,
        browseClass: "btn btn-primary",
        previewFileIcon: "<i class='glyphicon glyphicon-king'></i>"
    };
    if (typeof filetype != "object") {
        filetype = {allowedFileTypes: [filetype]};
    }
    $.extend(defaultparams, filetype);
    //文件上传
    $('#' + uploadFile).fileinput(defaultparams);
}


/**
 * 初始化多文件上传插件
 * @param code 初始化div的id
 * @param prefix 前缀 子div的idd的前缀 方便后台对其处理
 *      后台获取文件方式
 *       String filetype;
 if (key.contains("trainpic")) {  trainpic,trainvideo 就是前缀
                filetype = "1";
            } else if (key.contains("trainvideo")) {
                filetype = "2";
            } else {
                filetype = "3";
            }
 *
 * @param filetype
 * @param datas [{attachid:"",attachname:""},{attachid:"",attachname:""}]
 * @param urlpre
 * @param isDel
 */
function showMultipleInputFile(code, prefix, filetype, datas, urlpre,isDel) {

    //在之前添加预览div 默认不显示
    $("#" + code).before("<div style='display: none' id='" + code + "Pre'></div>");

    //添加第一个inputDiv
    $("#" + code).append("<div id='" + prefix + "0'>" +
        "<button type='button' style='float: right' class='btn btn-success'" +
        "onclick='addFileInput(\"" + code + "\",\"" + prefix + "\")'>添加行</button>" +
        "</div>");
    //如果是图片添加备注
    if (filetype === "image") {
        $("#" + code).after("<font style='color:red'>提示：图片附件支持的格式有：jpg、png、bmp、jpeg</font>");
    }

    showUploadFile(prefix + "0", filetype, true);

    showChooseFiles(code,datas,urlpre,isDel);
}

function addFileInput(code, prefix) {
    var total = $("#" + code).children("div:last-child").attr("id");
    var num;
    if (total) {
        num = parseInt(total.replace(/[^0-9]/ig, "")) + 1;
    } else {
        num = 0;
    }
    $("#" + code).append("<div id='" + prefix + num + "' ></div>");

    showUploadFile(prefix + num, "file", true);
    $("#" + prefix + num).prepend("<button type=\"button\" style=\"float: right\" class=\"btn btn-danger\" onclick=\"removeFileInput('" + prefix + num + "')\">删除行</button>");
}

function removeFileInput(code) {
    $("#" + code).remove();
}


