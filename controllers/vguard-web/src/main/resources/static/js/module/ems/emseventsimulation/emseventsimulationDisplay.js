/*新增或编辑课程管理*/
$(function () {

    var simulationid = getQueryString("simulationid");

    //查询
    $.ajax({
        type: "post",
        url: BASE_URL + "ems/emseventsimulation/load",
        dataType: "json",
        data: {
            simulationid: simulationid
        },
        success: function (data) {
            if (data) {
//                var eventsimulationTpt = _.template($("#eventsimulationTpt").html());
//                $("#eventsimulationForm").html(eventsimulationTpt(data));
            	$("#drillname").text(data.drillname);
            	$("#planname").text(data.planname);
            	$("#simulationno").text(data.simulationno);
            	$("#simulationaddress").text(data.simulationaddress);
            	$("#orgdepnames").text(data.orgdepnames);
            	$("#headquarter").text(data.headquarter);
            	$("#simulationtime").text(getSmpFormatDateByLong(data.simulationtime,true));
            	$("#joinorgnames").text(data.joinorgnames);
            	$("#simulationcontent").text(data.simulationcontent);
            	$("#preparesituation").text(data.preparesituation);
            	$("#simulationdesc").text(data.simulationdesc);
            	$("#suitability").text(SelectOption.getSuitability(data.suitability));
            	$("#adequacy").text(SelectOption.getAdequacy(data.adequacy));
            	$("#personsituation").text(SelectOption.getPersonsituation(data.personsituation));
            	$("#dutysituation").text(SelectOption.getDutysituation(data.dutysituation));
            	$("#metasituation").text(SelectOption.getMetasituation(data.metasituation));
            	$("#protectsituation").text(SelectOption.getProtectsituation(data.protectsituation));
            	$("#allcoordinatesituation").text(SelectOption.getAllcoordinatesituation(data.allcoordinatesituation));
            	$("#rescuesituation").text(SelectOption.getRescuesituation(data.rescuesituation));
            	$("#evaluation").text(SelectOption.getEvaluation(data.evaluation));
            	$("#reptosup").text(SelectOption.getReptosup(data.reptosup));
            	$("#fireorg").text(SelectOption.getFireorg(data.fireorg));
            	$("#resuceorg").text(SelectOption.getFireorg(data.resuceorg));
            	$("#evacoordination").text(SelectOption.getEvacoordination(data.evacoordination));
            	$("#problems").text(data.problems);
            	$("#impmeasures").text(data.impmeasures);
            	$("#editplancontent").text(data.editplancontent);
            	
            	_.each(data.attachPics,function(attachPic){
            		var picli = 
            			'<li><img src="'+BASE_URL+'ems/emssimulationattachment/download/'+attachPic.attachid+'"'+
                         'alt="'+attachPic.attachname+'"></li>';
            		$("#becomeBig").append(picli);
            	});
            	
                var attachFiles = data.attachFiles;//资料附件
                showChooseFiles('attachfile', attachFiles, BASE_URL + 'ems/emssimulationattachment/download/', false);
                
                $('#becomeBig').viewer({
                    'toolbar': false,
                    'title': false
                });
                
                if(data.attachVideos.length>0 ){                	
                	var title;
                	var url;
                	var type;
                	for(var attach in data.attachVideos){
                		title=data.attachVideos[attach].attachname;
                		url=data.attachVideos[attach].attachurl;
                		type=data.attachVideos[attach].filetype;
                	}
                	var videourl = location.protocol + "//" + location.host + "/"+"zwsafe_uploadFiles"+url;
                	playVideo(title,videourl,type);
                } else {
                	$("#playControl").hide();
                }
            }
        },
        error: function () {
            parent.toast("初始化信息加载失败");
        }
    });
});


function getQueryString(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
    var r = window.location.search.substr(1).match(reg);
    if (r != null) return unescape(r[2]);
    return null;
}

function playVideo(title,url,type){
	console.log(url);
	 //播放器
	var wheight = $("#videoplay").height()/2;
	var areaHeight = $('#jp_container_1').height()/2;
	$('#jPlayerArea').css('padding-top',wheight - areaHeight);
	$("#jquery_jplayer_1").jPlayer({
		ready: function (event) {
			$(this).jPlayer("setMedia", {
				title: title,				
				m4v: url, 
				ogv: url,
				webmv: url
			}).jPlayer("play");
		},
		swfPath: BASE_URL + "js/lib/jPlayer-master/dist/jplayer",
		supplied: "m4v,ogv,webmv",
		wmode: "window",
		useStateClassSkin: true,
		autoBlur: false,
		smoothPlayBar: true,
		keyEnabled: true,
		remainingDuration: true,
		toggleDuration: true,
		fullScreen: true,
//		noFullWindow: {
//			  msie: /msie [0-6]\./,
//			  ipad: /ipad.*?os [0-4]\./,
//			  iphone: /iphone/,
//			  ipod: /ipod/,
//			  android_pad: /android [0-3]\.(?!.*?mobile)/,
//			  android_phone: /android.*?mobile/,
//			  blackberry: /blackberry/,
////			  windows_ce: /windows ce/,
//			  iemobile: /iemobile/,
//			  webos: /webos/
//			},
		loop: false
//		sizeFull:{width:"100%",height:"100%",cssClass:"fullvideo"}
//		size: {"width": ($(window).width() * 0.9 + "px")}
	}).jPlayer("play").jPlayer("repeat");
}

