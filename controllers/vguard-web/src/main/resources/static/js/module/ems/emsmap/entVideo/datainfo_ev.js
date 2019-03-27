var DataInfo = function () {};
DataInfo.prototype = {
    loadVideoPlayer: function (videoids) {
        if (videoids == "null" || videoids == "") {
            $('.videoFrm').css('display', 'none');
            $('.vidCenter').addClass('nosp');
        } else {
            var videoid = videoids.split(',');
            var data = monitordatas.loadVideoInfo(videoid[0]);
            $('.videoPop').attr('ip', JSON.stringify(data));
            $('.videoPop').show("slow", "linear", function () {
                VideoInfo.cameraObj = $("#plugin").loadCamera({
                    "ip": data[0].IPADDR,
                    "port": data[0].PORT,
                    "username": data[0].USERNAME,
                    "password": data[0].PASSWORD,
                    "channel": data[0].VIDEONUM,
                    "brand": data[0].BRAND,
                    "width": ($(window).width() - 205),
                    "height": ($(window).height() * 0.6 - 38)
                });
                /*
                 VideoInfo.cameraObj = $("#plugin").loadCamera({
                 "ip":"192.168.88.164",
                 "port":"8000",
                 "username":"admin",
                 "password":"hk123456",
                 "channel":"1",
                 "brand":"1",
                 "width":($(window).width() - 205),
                 "height":($(window).height()*0.6 - 38)
                 });
                 */
                if (!VideoInfo.cameraObj.isInstall()) {
                    layer.confirm("插件没有安装,请下载安装", {
                        btn: ['下载', '取消'], //按钮
                        shade: false //不显示遮罩
                    }, function (index) {
                        window.location.href = BASE_URL + "/monitor/macmonitormap/downloadWebComponentsZW";
                        layer.close(index);
                    });
                    return;
                }
                VideoInfo.cameraObj.play();//播放
            });
        }
    }
}

Date.prototype.format = function (fmt) {
    var o = {
        "M+": this.getMonth() + 1,                 //月份
        "d+": this.getDate(),                    //日
        "H+": this.getHours(),                   //小时
        "m+": this.getMinutes(),                 //分
        "s+": this.getSeconds(),                 //秒
        "q+": Math.floor((this.getMonth() + 3) / 3), //季度
        "S": this.getMilliseconds()             //毫秒
    };
    if (/(y+)/.test(fmt))
        fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
    for (var k in o)
        if (new RegExp("(" + k + ")").test(fmt))
            fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
    return fmt;
}