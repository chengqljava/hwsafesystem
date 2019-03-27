/**
 * 监测报警
 */
MonitorAlarm = function () {
    var self = this;
    window.onload = function () {
        self.refreshMonitorDatas();
        clearInterval(app.timeAlarmTicket);
        app.timeAlarmTicket = setInterval(function () {
            self.refreshMonitorDatas();
        }, 55000);

    }
};

MonitorAlarm.prototype = {
    refreshMonitorDatas: function () {
        //app.popPanel.closeClosePopup();
        var table = $('#monitorTable')[0];
        if (table == null)return;
        $(table).empty();
        var districtcode = "null" || $("#districtcode").val();
        $("#alarmCount")[0].innerHTML = monitordatas.getAlarmCount(districtcode);
        var alarmList = monitordatas.loadArarmList(districtcode);
        if (alarmList == null || alarmList.length <= 0)return;
        var items = [];

        var count = 0;
        for (var i = 0; i < alarmList.length; i++) {
            var item = alarmList[i];
            if (items.indexOf(item.BUSINESSINFOID) >= 0)continue;
            count++;
            items.push(item.BUSINESSINFOID);
            var tr = document.createElement('div');
            tr.className = "tr";
            var td = document.createElement('div');
            td.className = "td";
            td.innerHTML = count;
            tr.appendChild(td);
            td = document.createElement('div');
            td.className = "td";
            td.innerHTML = item.ENTNAME;
            tr.appendChild(td);
            td = document.createElement('div');
            td.className = "td";
            var img = document.createElement('img');
            img.style.width = "21px";
            img.style.height = "19px";
            if (item.STATE == "3" || item.STATE == "99" || item.STATE == "7") {
                img.src = BASE_URL + "/images/monitor/gis/bug.png";
                img.title = "故障报警";
            } else if (item.STATE == "100" || item.STATE == "101" || item.STATE == "102") {
                img.src = BASE_URL + "/images/monitor/gis/mesh.png";
                img.title = "监测报警";
            }

            td.appendChild(img);
            tr.appendChild(td);

            var audio;

            td = document.createElement('div');
            td.className = "td";
            var btn = document.createElement('button');
            if (item.ISERASURE == "1") {
                btn.disabled = "disabled";
            } else {
                audio = document.createElement('audio');
                audio.id = "audio" + count;
                audio.controls = "controls";
                audio.style.display = "none";
                audio.src = BASE_URL + "/images/monitor/alarm.mp3";
                tr.appendChild(audio);
                audio.play();
            }
            //btn.innerHTML="消音";
            btn.id = count + ";" + item.BUSINESSINFOID;
            btn.onclick = function (e) {
                if (e.stopPropagation) {
                    e.stopPropagation();
                } else {
                    e.cancelBubble = true;
                }
                this.disabled = "disabled";
                var params = this.id.split(';');
                $('#audio' + params[0])[0].pause();
                //audio.pause();
                monitordatas.updateErsure(params[1]);
            }
            td.appendChild(btn);
            tr.appendChild(td);

            td = document.createElement('div');
            td.className = "td";
            td.innerHTML = item.LONGITUDE;
            td.style.display = "none";
            tr.appendChild(td);

            td = document.createElement('div');
            td.className = "td";
            td.innerHTML = item.LATITUDE;
            td.style.display = "none";
            tr.tag = item;
            tr.appendChild(td);
            tr.onclick = function () {
                var data = this.tag;
                //弹出
                // alert(JSON.stringify(data));
                openInfo(data);
                // $(".entName").empty();
                // $(".entName").append(data.ENTNAME);
                // $('.wrapper').show();
                // $('#mapfrm').attr("src",BASE_URL+"/olgis/gispage/addjcjkAlarm/"+data.BUSINESSINFOID);
                // $('#alarminfo').attr("href",BASE_URL+"/olgis/gispage/addjcjkAlarm/"+data.BUSINESSINFOID);
                // $('#videoinfo').attr("href",BASE_URL+"/olgis/gispage/addjcjkVideoAll/"+data.BUSINESSINFOID);
                // $('#datainfo').attr("href",BASE_URL+"/olgis/gispage/addjcjkDataAll/"+data.BUSINESSINFOID);
                // var statistics= monitordatas.loadStateTJ(data.BUSINESSINFOID);
                // if(statistics!=null){
                //     for(var key in statistics){
                //         var st=statistics[key];
                //         if(st.FLAG=="1")data.HISTORY=st;
                //         else if(st.FLAG=="2")data.CURRENT=st;
                //     }
                // }
                // $(this).addClass('trCur').siblings().removeClass('trCur');
            };
            table.appendChild(tr);
        }
    }
};

/**
 * 打开企业窗口
 * @param entInfo
 */
function openInfo(entInfo) {


    $(".entName").empty();
    $(".entName").append(data.ENTNAME);
    $('.wrapper').show();
    $('#mapfrm').attr("src",BASE_URL+"/olgis/gispage/addjcjkAlarm/"+data.BUSINESSINFOID);
    $('#alarminfo').attr("href",BASE_URL+"/olgis/gispage/addjcjkAlarm/"+data.BUSINESSINFOID);
    $('#videoinfo').attr("href",BASE_URL+"/olgis/gispage/addjcjkVideoAll/"+data.BUSINESSINFOID);
    $('#datainfo').attr("href",BASE_URL+"/olgis/gispage/addjcjkDataAll/"+data.BUSINESSINFOID);


    window.map.centerAndZoom(new BMap.Point(entInfo.LONGITUDE, entInfo.LATITUDE));
    var point = new BMap.Point(entInfo.LONGITUDE, entInfo.LATITUDE);
    var infoWindow = new BMap.InfoWindow(entInfo.ENTNAME, opts);  // 创建信息窗口对象
    map.openInfoWindow(infoWindow, point); //开启信息窗口

    //
    // openWin(BASE_URL + "views/module/monitor/monitorIndex/entInfo.html?businessinfoid="+entInfo.BUSINESSINFOID, entInfo.ENTNAME, "90%", "90%");
}

