$(function () {
	//获取事故信息id
	var eventid = getQueryString("eventid");
	
    //生成现场音视频分页表格
    var colname = ["附件id", "附件名称", "附件路径", "文件类型", "记录id", "创建人", "创建时间", "备注", "操作"],
        colmodel = [{name:'attachid', index:'attachid', width:'5%', hidden : true},
        			{name:'attachname', index:'attachname', width:'15%'},
        			{name:'attachurl', index:'attachurl', width:'5%', hidden : true},
        			{name:'filetype', index:'filetype',width:'5%',align:'center',sortable : false,
        				formatter:function(cellvalue, options, obj) { 
        					if ("1" == cellvalue) {
        						return "图片";
        					} else if ("2" == cellvalue) {
        						return "音频";
        					} else if ("3" == cellvalue) {
        						return "视频";
        					} else {
        						return "其它";
        					}
        				}	
        			},
        			{name:'recordid', index:'recordid', width:'5%', hidden : true},
        			{name:'createid', index:'createid', width:'5%', hidden : true},
        			{name:'createtime', index:'createtime',width:'10%',align:'center',sortable : false,
        				formatter:function(cellvalue, options, obj) { 
        					if (obj.createtime) {
        						return getSmpFormatDateByLong(obj.createtime, true);
        					} else {
        						return "";
        					}   
        				}
        			},
        			{name:'note', index:'note', width:'5%', hidden : true},
        			{name:'', width: '5%', align: 'center', formatter: function(cellvalue, options, obj) { 
        				return '<a href="javascript:void(0);" onclick="displayAttach(\''+obj.attachname+'\',\''+obj.filetype+'\',\''+obj.attachurl+'\',\''+obj.attachid+'\')">预览</a>';
    				}}
        			];
    
	//分页表格响应式处理
    var tableHeight = $(window).height() - $(".pcheck").height() - 122 - 33;
    $(window).resize(function () {
        $("#grid-table").jqGrid("setGridHeight", $(window).height() - $('.pcheck').height() - 122 - 33);
        $("#grid-table").jqGrid("setGridWidth", $(window).width() * 0.9);
    });

    $("#grid-table").jqGrid({
        height: tableHeight,
        url: BASE_URL + "/ems/emssucattach/list",
        datatype: "json",
        cache: false,
        mtype: "POST",
        colNames: colname,
        colModel: colmodel,
        postData: {
        	"eventid": eventid
        },
        sortname: "createtime",
        sortorder: "desc",
        viewrecords: true,
        pager: "#grid-pager",
        jsonReader: {
            root: "datas",
            total: "total",
            page: "page",
            records: "records",
            repeatitems: false
        },
        rowNum: 10,
        rowList: [10, 20, 30],
        altRows: true,
        caption: "现场信息",
        autowidth: true,
        loadComplete: function() {
			if($(window).width() < 400) {
				$('.ui-jqgrid-htable').css({"width":"900"});
				$("#grid-table").css({"width":"900"});
				$("#grid-table").closest(".ui-jqgrid-bdiv").css({ "overflow-x" : "scroll","height":"350"});
				$(".ui-jqgrid-hdiv").css({ "overflow-x" : "scroll"});
			} else {
				$("#grid-table").jqGrid( 'setGridWidth', $(window).width()*0.9 );
			}
		}
//        ondblClickRow:function(rowid,iRow,iCol,e){
//        	var event = $("#grid-table").jqGrid('getRowData',rowid); //选中的一条记录
//        	window.parent.initMapPts(lowerJSONKey(event),"probe");
//        }
    });
});

/**
 * 预览现场APP上传的图片、音视频资源
 */
function displayAttach(attchName, attchType, attchUrl, attachid) {
	$.ajax({
        type: "post",
        url: BASE_URL + "/ems/emssucattach/download/" + attachid,
        data: {},
        success: function (data) {
//        	console.log(JSON.stringify(data));
        	if (!data.success) {
        		parent.toast(data.msg);
        		return;
        	} else {
        		var curAttchUrl = location.protocol + "//" + location.host + "/zwsafe_uploadFiles" + attchUrl;
            	$("#jquery_jplayer_1").jPlayer("destroy");
//            	alert(curAttchUrl);
            	if ("1" == attchType) {
            		//图片
            		$("#jquery_jplayer_1, #jp_container_1").hide();
//            		$("#liveImg img").attr("src", curAttchUrl);
//            		parent.layer.open({
//            			  type: 1,
//            			  title: false,
//            			  closeBtn: 1,
//            			  shadeClose: false,
//            			  area: ["200px", "500px"],
//            			  content: $("#liveImg")
//            		});
            		parent.openWin(BASE_URL + "views/module/ems/map/liveMsg/liveImgIndex.html?imgurl=" + curAttchUrl, 
            					   attchName, "45%", "70%");
            	} else if ("2" == attchType) {
            		//音频
            		$("#jPlayerArea").show();
            		$("#jp_container_1").show();
            		$("#jquery_jplayer_1").hide();
            		var wheight = $(window).height()/2;
            		var areaHeight = $('#jp_container_1').height()/2;
            		$('#jPlayerArea').css('padding-top',wheight - areaHeight)
            		$("#jquery_jplayer_1").jPlayer({
            			ready: function (event) {
            				$(this).jPlayer("setMedia", {
            					title: attchName,
            					mp3: curAttchUrl,
            					wav: curAttchUrl
            				}).jPlayer("play");
            			},
            			swfPath: BASE_URL + "js/lib/jPlayer-master/dist/jplayer",
            			supplied: "mp3, wav",
            			wmode: "window",
            			useStateClassSkin: true,
            			autoBlur: false,
            			smoothPlayBar: true,
            			keyEnabled: true,
            			remainingDuration: true,
            			toggleDuration: false,
            			fullScreen: true,
            			loop: false
//            			sizeFull:{width:"100%",height:"100%",cssClass:"fullvideo"}
//            			size: {"width": ($(window).width() * 0.9 + "px")}
            		});
            		
            		//页面返回最顶部
            		$("html, body").animate({scrollTop: 0}, "slow");
            	} else if ("3" == attchType) {
            		//视频
            		var height = $(window).height();
        			console.log(height);
            		$("#jPlayerArea").show().css('padding-top',0);
            		$("#jquery_jplayer_1, #jp_container_1").show();
            		$("#jquery_jplayer_1").jPlayer({
            			ready: function (event) {
            				$(this).jPlayer("setMedia", {
            					title: attchName,
            					m4v: curAttchUrl
            				}).jPlayer("play");
            			},
            			swfPath: BASE_URL + "js/lib/jPlayer-master/dist/jplayer",
            			supplied: "m4v",
            			wmode: "window",
            			useStateClassSkin: true,
            			autoBlur: false,
            			smoothPlayBar: true,
            			keyEnabled: true,
            			remainingDuration: true,
            			toggleDuration: false,
            			fullScreen: true,
            			loop: false,
            			size:{
            				'width':'100%',
            				'height':'calc(100% - 111px)'
            			}
//            			sizeFull:{width:"100%",height:"100%",cssClass:"fullvideo"}
//            			size: {"width": ($(window).width() * 0.9 + "px")}
            		});
            		
            		//页面返回最顶部
            		$("html, body").animate({scrollTop: 0}, "slow");
            	} else {
            		window.location.href = location.protocol + "//" + location.host + "/zwsafe_uploadFiles" + attchUrl;
            	}
            	
            	//窗口改变时播放器样式的调整
            	$(window).resize(function() {
//            		$("#jquery_jplayer_1").jPlayer("option", "width", ($(window).width() * 0.9 + "px"));
//            		$("#jp_container_1").css({"width": ($(window).width() * 0.9 + "px")});
            		var wheight = $(window).height()/2;
            		var areaHeight = ($('#jquery_jplayer_1').height() + $('#jp_container_1').height())/2;
            		$('#jPlayerArea').css('padding-top',wheight - areaHeight);
            	});
            	
            	//关闭音视频播放
            	$("#closePlayer").click(function(){
            		$("#jquery_jplayer_1").jPlayer("destroy");
            		$("#jPlayerArea").hide();
            	});
        	}
        }
    });
}

/**
 * 获取父级页面传递过来的参数
 * @param name
 * @returns
 */
function getQueryString(name) {
     var reg = new RegExp("(^|&)"+ name +"=([^&]*)(&|$)");
     var r = window.location.search.substr(1).match(reg);
     if(r!=null)return  unescape(r[2]); return null;
}