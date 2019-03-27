var PopupContent = function(){
	//获取企业数据
	this.getBusiData = function(attributes){
		var params=new Array(22);
		var count=0;
		$.each(attributes, function(key, value) {
			switch(key){
				case 'ADDRESS':
					key='注册地址';
					params[2]=value;
					count++;
					break;
				case 'ENTNAME':
					key='企业名称';
					count++;
					params[0]=value;
					break;
				case 'ENTCODE':
					key='组织机构代码';
					count++;
					params[1]=value;
					break;
				case 'LEGALPERSON':
					key='安全责任人';
					count++;
					params[3]=value;
					break;
				case 'PHONE':
					key='手机号码';
					count++;
					params[4]=value;
					break;
				case 'BUSINESSINFOID':
					count++;
					params[5]=value;
					break;
				case 'HISTORY':
					count+=8;
					params[6]=value.GB==null?0:value.GB;
					params[7]=value.DB==null?0:value.DB;
					params[8]=value.MLC==null?0:value.MLC;
					params[9]=value.TTGZ==null?0:value.TTGZ;
					params[10]=value.WLGZ==null?0:value.WLGZ;
					params[11]=value.TXGZ==null?0:value.TXGZ;
					params[12]=params[9]+params[10]+params[11];
					params[13]=params[6]+params[7]+params[8];
					break;
				case 'CURRENT':
					count+=8;
					params[14]=value.GB==null?0:value.GB;
					params[15]=value.DB==null?0:value.DB;
					params[16]=value.MLC==null?0:value.MLC;
					params[17]=value.TTGZ==null?0:value.TTGZ;
					params[18]=value.WLGZ==null?0:value.WLGZ;
					params[19]=value.TXGZ==null?0:value.TXGZ;
					params[20]=params[17]+params[18]+params[19];
					params[21]=params[16]+params[14]+params[15];
					break;
			}
			if(count==22) return true;
		});
		return params;

	}
	

	//弹出框里的内容
	this.setPopupContent = function(params){
		var data = new Array();
		var url;
	/*	data.push('<div class="p">');
		data.push('<p><span style="width:210px;float:left;"><strong>企业名称：</strong>'+(params[0]==undefined?"无":params[0])+'</span><span style="width:210px;"><strong>组织机构代码：</strong>'+(params[1]==undefined?"无":params[1])+'</span></p>');
		data.push('<p><span style="width:210px;float:left;"><strong>安全责任人：</strong>'+(params[3]==undefined?"无":params[3])+'</span><span style="width:210px;"><strong>手机号码：</strong>'+(params[4]==undefined?"无":params[4])+'</span></p>');
		data.push('<p><strong>注册地址：</strong>'+(params[2]==undefined?"无":params[2])+'</p>');
		data.push("<p style='margin-bottom: 6px; '><button id='realtimeMonitor' style='padding:0 6px;' onclick='showVideoAndProbe(\""+params[5]+"\",\""+params[0]+"\");'>实时监控</button></p>");
		data.push('</div>');
		data.push("<table class='dyTable'><tbody>");
		data.push('<tr>');
		data.push("<td colspan='2' align='center'><span>历史报警<span></td>");
		data.push("<td colspan='2' align='center'><span>当前报警<span></td>");
		data.push('</tr>');
		data.push('<tr>');
		url=BASE_URL+"/monitor/macalarmfault/GOV_ZDSXYJCJK_SSJCJK_GZBJ?businessinfoid="+params[5];
		data.push("<td rowspan='3'><a href='javascript:void(0)' onclick='openWin(\""+url+"\",\"历史故障报警信息\",\"60%\",\"60%\");'><span>故障报警(<span style='color: red;'>"+params[12]+"</span>)</span></td>");
		data.push("<td>探头故障(<span style='color: red;'>"+params[9]+"</span>)</td>");
		url=BASE_URL+"/monitor/macalarmfault/GOV_ZDSXYJCJK_SSJCJK_GZBJ?businessinfoid="+params[5]+"&handleStatus=0";
		data.push("<td rowspan='3'><a href='javascript:void(0)' onclick='openWin(\""+url+"\",\"当前故障报警信息\",\"60%\",\"60%\");'><span>故障报警(<span style='color: red;'>"+params[20]+"</span>)</span></td>");
		data.push("<td>探头故障(<span style='color: red;'>"+params[17]+"</span>)</td>");
		data.push('</tr>');
		data.push('<tr>');
		data.push("<td>网络故障(<span style='color: red;'>"+params[10]+"</span>)</td>");
		data.push("<td>网络故障(<span style='color: red;'>"+params[18]+"</span>)</td>");
		data.push('</tr>');
		data.push('<tr>');
		data.push("<td>通讯故障(<span style='color: red;'>"+params[11]+"</span>)</td>");
		data.push("<td>通讯故障(<span style='color: red;'>"+params[19]+"</span>)</td>");
		data.push('</tr>');
		data.push('<tr>');
		url=BASE_URL+"/monitor/macalarmmonitor/GOV_ZDSXYJCJK_SSJCJK_JCBJ?businessinfoid="+params[5];
		data.push("<td rowspan='3'><a href='javascript:void(0)' onclick='openWin(\""+url+"\",\"历史监测报警信息\",\"60%\",\"60%\");'><span>监测报警(<span style='color: red;'>"+params[13]+"</span>)</span></td>");
		data.push("<td>高报(<span style='color: red;'>"+params[6]+"</span>)</td>");
		url=BASE_URL+"/monitor/macalarmmonitor/GOV_ZDSXYJCJK_SSJCJK_JCBJ?businessinfoid="+params[5]+"&handleStatus=0";
		data.push("<td rowspan='3'><a href='javascript:void(0)' onclick='openWin(\""+url+"\",\"当前监测报警信息\",\"60%\",\"60%\");'><span>监测报警(<span style='color: red;'>"+params[21]+"</span>)</span></td>");
		data.push("<td>高报(<span style='color: red;'>"+params[14]+"</span>)</td>");
		data.push('</tr>');
		data.push('<tr>');
		data.push("<td>低报(<span style='color: red;'>"+params[7]+"</span>)</td>");
		data.push("<td>低报(<span style='color: red;'>"+params[15]+"</span>)</td>");
		data.push('</tr>');
		data.push('<tr>');
		data.push("<td>满量程(<span style='color: red;'>"+params[8]+"</span>)</td>");
		data.push("<td>满量程(<span style='color: red;'>"+params[16]+"</span>)</td>");
		data.push('</tr>');*/
		
		/*data.push('<tr>');
		url=BASE_URL+"/enterprise/entbaseinfo/edit/menuDisplay/"+params[5];
		data.push("<td colspan='2'><a href='javascript:void(0)' onclick='openWin(\""+url+"\",\"报警信息\",\"80%\",\"80%\");'><pan>[报警信息]</span></td>");
		url=BASE_URL+"/enterprise/entdanexclusive/labelpage/menuDisplay/"+params[5]+"/gis";
		//data.push("<td><a target='_blank' href='"+BASE_URL+"/enterprise/entdanexclusive/labelpage/menuDisplay/"+params[5]+"'><pan>[危化品]</span></td>");
		data.push("<td colspan='2'><a href='javascript:void(0)' onclick='openWin(\""+url+"\",\"历史报警信息\",\"80%\",\"80%\");'><pan>[历史报警信息]</span></td>");
		data.push('</tr>');*/
		/*data.push('</tbody><table>');*/
		
		data.push('<div class="tab">');
		data.push('<div class="tab_menu" id="tabMenu"><ul><li class="active">基本信息</li><li>功能名称</li><li>报警统计</li></ul></div>');
		data.push('<div class="tab_box"><div>');
		data.push('<table class="bTable"><tbody>');
		data.push('<tr><td>企业名称</td><td>'+(params[0]==undefined?"无":params[0])+'</td></tr>');
		data.push('<tr><td>组织机构代码</td><td>'+(params[1]==undefined?"无":params[1])+'</td></tr>');
		data.push('<tr><td>注册地址</td><td>'+(params[2]==undefined?"无":params[2])+'</td></tr>');
		data.push('<tr><td>法定代表</td><td>'+(params[3]==undefined?"无":params[3])+'</td></tr>');
		data.push('<tr><td>手机号码</td><td>'+(params[4]==undefined?"无":params[4])+'</td></tr>');
		data.push('</tbody></table>');
		data.push("<button id='realtimeMonitor' style='padding:0 6px;width: 76px;height: 30px;background-color: #3385ff;border: none;color: #fff;float: right;' onclick='showVideoAndProbe(\""+params[5]+"\",\""+params[0]+"\");'>实时监控</button>");
		data.push('</div>');
		data.push('<div class="second" style="display: none;">');
		url=BASE_URL+"/enterprise/entbaseinfo/edit/menuDisplay/"+params[5];
		data.push("<a href='javascript:void(0)' onclick='openWin(\""+url+"\",\"企业信息\",\"80%\",\"80%\");'><img src='"+BASE_URL+"/images/gis/popup/qyxx.png'>企业信息</a>");
		url=BASE_URL+"/enterprise/entdanexclusive/labelpage/menuDisplay/"+params[5]+"/gis";
		data.push("<a href='javascript:void(0)' onclick='openWin(\""+url+"\",\"危化品专属信息\",\"80%\",\"80%\");'><img src='"+BASE_URL+"/images/gis/popup/wxp.png'>危化品</a>");
		url =BASE_URL+"/dangersource/dssdangerinfo/dangerinfoList/"+params[5];
		data.push("<a href='javascript:void(0)' onclick='openWin(\""+url+"\",\"重大危险源\",\"80%\",\"80%\");'><img src='"+BASE_URL+"/images/gis/popup/zdwxy.png'>重大危险源</a>");
		url =BASE_URL+"/enterprise/entplan/menuDisplay/"+params[5];
		data.push("<a href='javascript:void(0)' onclick='openWin(\""+url+"\",\"企业平面图\",\"80%\",\"80%\");'><img src='"+BASE_URL+"/images/gis/popup/qypmt.png'>企业平面图</a>");
		url=BASE_URL+"/hiddendanger/hdientinspection/GIS/"+params[5];
		data.push("<a href='javascript:void(0)' onclick='openWin(\""+url+"\",\"自查记录\",\"80%\",\"80%\");'><img src='"+BASE_URL+"/images/gis/popup/zcjl.png'>自查记录</a>");
		url=BASE_URL+"/hiddendanger/hdigovinspection/gis/"+params[5];
		data.push("<a href='javascript:void(0)' onclick='openWin(\""+url+"\",\"巡查记录\",\"80%\",\"80%\");'><img src='"+BASE_URL+"/images/gis/popup/pcjl.png'>巡查记录</a>");
		url = BASE_URL+"/law/lawcase/GIS/"+params[5];
		data.push("<a href='javascript:void(0)' onclick='openWin(\""+url+"\",\"执法记录\",\"80%\",\"80%\");'><img src='"+BASE_URL+"/images/gis/popup/zfjl.png'>执法记录</a>");
		url = BASE_URL+"/ems/emsplaplaninfo/gisentplanlist/"+params[5];
		data.push("<a href='javascript:void(0)' onclick='openWin(\""+url+"\",\"企业预案\",\"80%\",\"80%\");'><img src='"+BASE_URL+"/images/gis/popup/qyya.png'>企业预案</a>");
		data.push('</div>');
		data.push('<div style="display: none;">');
		data.push("<table class='dyTable'><tbody>");
		data.push('<tr>');
		data.push("<td colspan='2' align='center' style='font-weight: bold;text-align: center;'><span>历史报警<span></td>");
		data.push("<td colspan='2' align='center' style='font-weight: bold;text-align: center;'><span>当前报警<span></td>");
		data.push('</tr>');
		data.push('<tr>');
		url=BASE_URL+"/monitor/macalarmfault/GOV_ZDSXYJCJK_SSJCJK_GZBJ?businessinfoid="+params[5];
		data.push("<td rowspan='3'><a href='javascript:void(0)' style='text-decoration: underline; color:#0a98f4;' onclick='openWin(\""+url+"\",\"历史故障报警信息\",\"60%\",\"60%\");'><span>故障报警(<span style='color: red;'>"+params[12]+"</span>)</span></td>");
		data.push("<td>探头故障(<span style='color: red;'>"+params[9]+"</span>)</td>");
		url=BASE_URL+"/monitor/macalarmfault/GOV_ZDSXYJCJK_SSJCJK_GZBJ?businessinfoid="+params[5]+"&handleStatus=0";
		data.push("<td rowspan='3'><a href='javascript:void(0)' style='text-decoration: underline; color:#0a98f4;' onclick='openWin(\""+url+"\",\"当前故障报警信息\",\"60%\",\"60%\");'><span>故障报警(<span style='color: red;'>"+params[20]+"</span>)</span></td>");
		data.push("<td>探头故障(<span style='color: red;'>"+params[17]+"</span>)</td>");
		data.push('</tr>');
		data.push('<tr>');
		data.push("<td>网络故障(<span style='color: red;'>"+params[10]+"</span>)</td>");
		data.push("<td>网络故障(<span style='color: red;'>"+params[18]+"</span>)</td>");
		data.push('</tr>');
		data.push('<tr>');
		data.push("<td>通讯故障(<span style='color: red;'>"+params[11]+"</span>)</td>");
		data.push("<td>通讯故障(<span style='color: red;'>"+params[19]+"</span>)</td>");
		data.push('</tr>');
		data.push('<tr>');
		url=BASE_URL+"/monitor/macalarmmonitor/GOV_ZDSXYJCJK_SSJCJK_JCBJ?businessinfoid="+params[5];
		data.push("<td rowspan='3'><a href='javascript:void(0)' style='text-decoration: underline; color:#0a98f4;' onclick='openWin(\""+url+"\",\"历史监测报警信息\",\"60%\",\"60%\");'><span>监测报警(<span style='color: red;'>"+params[13]+"</span>)</span></td>");
		data.push("<td>高报(<span style='color: red;'>"+params[6]+"</span>)</td>");
		url=BASE_URL+"/monitor/macalarmmonitor/GOV_ZDSXYJCJK_SSJCJK_JCBJ?businessinfoid="+params[5]+"&handleStatus=0";
		data.push("<td rowspan='3'><a href='javascript:void(0)' style='text-decoration: underline; color:#0a98f4;' onclick='openWin(\""+url+"\",\"当前监测报警信息\",\"60%\",\"60%\");'><span>监测报警(<span style='color: red;'>"+params[21]+"</span>)</span></td>");
		data.push("<td>高报(<span style='color: red;'>"+params[14]+"</span>)</td>");
		data.push('</tr>');
		data.push('<tr>');
		data.push("<td>低报(<span style='color: red;'>"+params[7]+"</span>)</td>");
		data.push("<td>低报(<span style='color: red;'>"+params[15]+"</span>)</td>");
		data.push('</tr>');
		data.push('<tr>');
		data.push("<td>满量程(<span style='color: red;'>"+params[8]+"</span>)</td>");
		data.push("<td>满量程(<span style='color: red;'>"+params[16]+"</span>)</td>");
		data.push('</tr>');
		data.push('</tbody><table>');
		data.push('</div></div></div>');
		
		
		return data.join('');
	}
	
}