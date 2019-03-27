var MonitorInfo = function () {
};
MonitorInfo.prototype = {

    loadAlarmStatis: function (dataid) {
        //加载企业基础信息
        var entarr = monitordatas.loadEntByid(dataid, function(entar) {
        	$("#entname").text(entar.entname || "无").attr('title',entar.entname || "无");
        	$("#legalperson").text(entar.legalperson || "无").attr('title',entar.legalperson || "无");
        	$("#phone").text(entar.phone || "无").attr('title',entar.phone || "无");
        	$("#address").text(entar.address || "无").attr('title',entar.address || "无");
        	$("#entcode").text(entar.entcode || "无").attr('title',entar.entcode || "无");
        	
        	//当前故障报警
            var dqgzurl = BASE_URL + "/monitor/macalarmfault/GOV_ZDSXYJCJK_SSJCJK_GZBJ?businessinfoid=" + dataid + "&handleStatus=0";
            $('#dqgzlj').click(function () {
                parent.openWin(dqgzurl, "当前故障报警信息", "90%", "80%");
            });

            //当前监测报警
            var dqjcurl = BASE_URL + "/monitor/macalarmmonitor/GOV_ZDSXYJCJK_SSJCJK_JCBJ?businessinfoid=" + dataid + "&handleStatus=0";
            $('#dqjclj').click(function () {
                parent.openWin(dqjcurl, "当前监测报警信息", "90%", "80%");
            });

            //历史故障报警
            var lsgzurl = BASE_URL + "/monitor/macalarmfault/GOV_ZDSXYJCJK_SSJCJK_GZBJ?businessinfoid=" + dataid;
            $('#lsgzlj').click(function () {
                parent.openWin(lsgzurl, "历史故障报警信息", "90%", "80%");
            });

            //历史监测报警
            var lsjcurl = BASE_URL + "/monitor/macalarmmonitor/GOV_ZDSXYJCJK_SSJCJK_JCBJ?businessinfoid=" + dataid;
            $('#lsjclj').click(function () {
                parent.openWin(lsjcurl, "历史监测报警信息", "90%", "80%");
            });

            //加载企业报警统计信息
            var TJarr = monitordatas.loadStateTJ(dataid);
            if(TJarr[0].TTGZ==null ||TJarr[0].TTGZ == "null"){
                TJarr[0].TTGZ = 0;
            }
            //当前故障报警
            $("#dqttgz").html("("+handleNum(TJarr[0].TTGZ)+")");
            $("#dqwlgz").html("("+handleNum(TJarr[0].WLGZ)+")");
            $("#dqtxgz").html("("+handleNum(TJarr[0].TXGZ)+")");
            var dqgzbj = TJarr[0].TTGZ + TJarr[0].WLGZ + TJarr[0].TXGZ;
            $("#dqgzbj").html("("+handleNum(dqgzbj)+")");
            //当前监测报警
            $("#dqgb").html("("+handleNum(TJarr[0].GB)+")");
            $("#dqdb").html("("+handleNum(TJarr[0].DB)+")");
            $("#dqmlc").html("("+handleNum(TJarr[0].MLC)+")");
            $("#dqcgb").html("("+handleNum(TJarr[0].CGB)+")");
            $("#dqcdb").html("("+handleNum(TJarr[0].CDB)+")");
            var dqjcbj = TJarr[0].GB + TJarr[0].DB + TJarr[0].MLC+TJarr[0].CGB+TJarr[0].CDB;
            $("#dqjcbj").html("("+handleNum(dqjcbj)+")");
//            //历史故障报警
//            $("#lsttgz").html("("+handleNum(TJarr[0].TTGZ)+")");
//            $("#lswlgz").html("("+handleNum(TJarr[0].WLGZ)+")");
//            $("#lstxgz").html("("+handleNum(TJarr[0].TXGZ)+")");
//            var lsgzbj = TJarr[0].TTGZ + TJarr[0].WLGZ + TJarr[0].TXGZ;
//            $("#lsgzbj").html("("+handleNum(lsgzbj)+")");
//            //历史监测报警
//            $("#lsgb").html("("+handleNum(TJarr[0].GB)+")");
//            $("#lsdb").html("("+handleNum(TJarr[0].DB)+")");
//            $("#lsmlc").html("("+handleNum(TJarr[0].MLC)+")");
//            $("#lscgb").html("("+handleNum(TJarr[0].CGB)+")");
//            $("#lscdb").html("("+handleNum(TJarr[0].CDB)+")");
//            var lsjcbj = TJarr[0].GB + TJarr[0].DB + TJarr[0].MLC+TJarr[0].CGB+TJarr[0].CDB;
//            $("#lsjcbj").html("("+handleNum(lsjcbj)+")");
        });
    }

}

function handleNum(num) {
    if(num==null ||num == "null"){
        num = 0;
    }
    return num;
}