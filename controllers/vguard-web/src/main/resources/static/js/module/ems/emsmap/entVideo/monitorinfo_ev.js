var MonitorInfo = function () {
};
MonitorInfo.prototype = {
    loadAlarmStatis: function (dataid) {
        //加载企业基础信息
        var entarr = monitordatas.loadEntByid(dataid, function(entar) {
        	$("#entname").text(entar.entname || "无");
        	$("#legalperson").text(entar.legalperson || "无");
        	$("#phone").text(entar.phone || "无");
        	$("#address").text(entar.address || "无");
        	$("#entcode").text(entar.entcode || "无");
        });
    }
}

function handleNum(num) {
    if(num==null ||num == "null"){
        num = 0;
    }
    return num;
}