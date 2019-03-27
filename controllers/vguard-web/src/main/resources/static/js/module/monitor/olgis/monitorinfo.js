var MonitorInfo = function(){
};
MonitorInfo.prototype = {
		
		loadAlarmStatis : function(dataid) {
			//加载企业基础信息
			var entarr = monitordatas.loadEntByid(dataid, function(entar) {
				var oneRow = "<tr><td>企业名称</td><td>"+(entar.entname==undefined?"无":entar.entname)+"</td><td>组织机构代码</td><td>"
							 +(entar.entcode==undefined?"无":entar.entcode)+"</td></tr><tr><td>安全责任人</td><td>"+(entar.legalperson==undefined?"无":entar.legalperson)+"</td><td>手机号码</td><td>"
							 +(entar.phone==undefined?"无":entar.phone)+"</td></tr><tr><td>注册地址</td><td>"+(entar.address==undefined?"无":entar.address)+"</td><td colspan="+2+"></td></tr>";
				$('.table').append(oneRow);
				
				//当前故障报警
				var dqgzurl=BASE_URL+"/monitor/macalarmfault/GOV_ZDSXYJCJK_SSJCJK_GZBJ?businessinfoid="+dataid+"&handleStatus=0";
				$('#dqgzlj').click(function () {
					parent.openWin(dqgzurl,"当前故障报警信息","90%","80%");
			    }); 
				
				//当前监测报警
				var dqjcurl=BASE_URL+"/monitor/macalarmmonitor/GOV_ZDSXYJCJK_SSJCJK_JCBJ?businessinfoid="+dataid+"&handleStatus=0";
				$('#dqjclj').click(function () {
					parent.openWin(dqjcurl,"当前监测报警信息","90%","80%");
			    }); 
				
				//历史故障报警
				var lsgzurl=BASE_URL+"/monitor/macalarmfault/GOV_ZDSXYJCJK_SSJCJK_GZBJ?businessinfoid="+dataid;
				$('#lsgzlj').click(function () {
					parent.openWin(lsgzurl,"历史故障报警信息","90%","80%");
			    }); 
				
				//历史监测报警
				//var lsjcurl=BASE_URL+"/monitor/macalarmmonitor/GOV_ZDSXYJCJK_SSJCJK_JCBJ?businessinfoid="+dataid+"&handleStatus=0";
				var lsjcurl=BASE_URL+"/monitor/macalarmmonitor/GOV_ZDSXYJCJK_SSJCJK_JCBJ?businessinfoid="+dataid;
				$('#lsjclj').click(function () {
			   		parent.openWin(lsjcurl,"历史监测报警信息","90%","80%");
			    }); 
				
				//加载企业报警统计信息
				var TJarr = monitordatas.loadStateTJ(dataid);
				//当前故障报警
				$("#dqttgz").html(TJarr[1].TTGZ);
				$("#dqwlgz").html(TJarr[1].WLGZ);
				$("#dqtxgz").html(TJarr[1].TXGZ);
				$("#dqgzbj").html(TJarr[1].TTGZ+TJarr[1].WLGZ+TJarr[1].TXGZ);
				//当前监测报警
				$("#dqgb").html(TJarr[1].GB);
				$("#dqdb").html(TJarr[1].DB);
				$("#dqmlc").html(TJarr[1].MLC);
				$("#dqcgb").html(TJarr[1].CGB);
				$("#dqcdb").html(TJarr[1].CDB);
				$("#dqjcbj").html(TJarr[1].GB+TJarr[1].DB+TJarr[1].MLC+TJarr[1].CGB+TJarr[1].CDB);
				//历史故障报警
				$("#lsttgz").html(TJarr[0].TTGZ);
				$("#lswlgz").html(TJarr[0].WLGZ);
				$("#lstxgz").html(TJarr[0].TXGZ);
				$("#lsgzbj").html(TJarr[0].TTGZ+TJarr[0].WLGZ+TJarr[0].TXGZ);
				//历史监测报警
				$("#lsgb").html(TJarr[0].GB);
				$("#lsdb").html(TJarr[0].DB);
				$("#lsmlc").html(TJarr[0].MLC);
				$("#lscgb").html(TJarr[0].CGB);
				$("#lscdb").html(TJarr[0].CDB);
				$("#lsjcbj").html(TJarr[0].GB+TJarr[0].DB+TJarr[0].MLC+TJarr[0].CGB+TJarr[0].CDB);
			});
		}
		
}