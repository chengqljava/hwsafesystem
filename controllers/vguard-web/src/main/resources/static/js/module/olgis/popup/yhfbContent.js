var yhfbContent = function(){
	//获取企业数据
	this.getDate = function(attributes){
		var params=new Array(5);
		var count=0;
		if(attributes.length == 1){
			attributes = attributes[0];
		}
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
					key='法定代表人';
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
			}
			if(count==6) return true;
		});
		return params;

	}
	

	//弹出框里的内容
	this.setPopupContent = function(params){
		var data = new Array();
		var url;
/*		data.push('<div class="p">');
		data.push('<p>企业名称：'+(params[0]==undefined?"无":params[0])+'</p>');
		data.push('<p>组织机构代码：'+(params[1]==undefined?"无":params[1])+'</p>');
		data.push('<p>注册地址：'+(params[2]==undefined?"无":params[2])+'</p>');
		data.push('<p>法定代表人：'+(params[3]==undefined?"无":params[3])+'</p>');
		data.push('<p>手机号码：'+(params[4]==undefined?"无":params[4])+'</p>');
		data.push('</div>');
		data.push("<table class='dyTable'><tbody>");
		data.push('<tr>');
		url=BASE_URL+"/enterprise/entbaseinfo/edit/menuDisplay/"+params[5];
		data.push("<td><a href='javascript:void(0)' onclick='openWin(\""+url+"\",\"企业信息\",\"80%\",\"80%\");'><pan>[企业信息]</span></td>");
		url=BASE_URL+"/enterprise/entdanexclusive/labelpage/menuDisplay/"+params[5]+"/gis";
		//data.push("<td><a target='_blank' href='"+BASE_URL+"/enterprise/entdanexclusive/labelpage/menuDisplay/"+params[5]+"'><pan>[危化品]</span></td>");
		data.push("<td><a href='javascript:void(0)' onclick='openWin(\""+url+"\",\"危化品专属信息\",\"80%\",\"80%\");'><pan>[危化品]</span></td>");
		
		data.push("<td><pan>[重大危险源]</span></td>");
		data.push('</tr>');
		data.push('<tr>');
		data.push("<td><pan>[企业平面图]</span></td>");
		data.push("<td><pan>[监控监测]</span></td>");
		data.push("<td><pan>[自查记录]</span></td>");
		data.push('</tr>');
		data.push('<tr>');
		data.push("<td><pan>[排查记录]</span></td>");
		data.push("<td><pan>[执法记录]</span></td>");
		data.push("<td><pan>[企业预案]</span></td>");
		data.push('</tr>');
		data.push('</tbody><table>');*/
		/*data.push('<div>');
		data.push('<span>附近</span>');
		data.push("<input type='text' id='range' />");
		data.push('<span>米</span>');
		data.push("<input type='checkbox' id='company' />企业");
		//data.push("<input type='checkbox' id='team' />");
		data.push('</div>');*/
		
		data.push('<div class="tab">');
		data.push('<div class="tab_menu" id="tabMenu"><ul><li class="active">基本信息</li><li>功能名称</li></ul></div>');
		data.push('<div class="tab_box"><div>');
		data.push('<table class="bTable"><tbody>');
		data.push('<tr><td>企业名称</td><td>'+(params[0]==undefined?"无":params[0])+'</td></tr>');
		data.push('<tr><td>组织机构代码</td><td>'+(params[1]==undefined?"无":params[1])+'</td></tr>');
		data.push('<tr><td>注册地址</td><td>'+(params[2]==undefined?"无":params[2])+'</td></tr>');
		data.push('<tr><td>法定代表</td><td>'+(params[3]==undefined?"无":params[3])+'</td></tr>');
		data.push('<tr><td>手机号码</td><td>'+(params[4]==undefined?"无":params[4])+'</td></tr>');
		data.push('</tbody></table>');
		data.push('</div>');
		data.push('<div class = "second" style="display: none;">');
		url=BASE_URL+"/enterprise/entbaseinfo/edit/menuDisplay/"+params[5];
		data.push("<a href='javascript:void(0)' onclick='openWin(\""+url+"\",\"企业信息\",\"80%\",\"80%\");'><img src='"+BASE_URL+"/images/gis/popup/qyxx.png'>企业信息</a>");
		url=BASE_URL+"/enterprise/entdanexclusive/labelpage/menuDisplay/"+params[5]+"/gis";
		data.push("<a href='javascript:void(0)' onclick='openWin(\""+url+"\",\"危化品专属信息\",\"80%\",\"80%\");'><img src='"+BASE_URL+"/images/gis/popup/wxp.png'>危化品</a>");
		url =BASE_URL+"/dangersource/dssdangerinfo/dangerinfoList/"+params[5];
		data.push("<a href='javascript:void(0)' onclick='openWin(\""+url+"\",\"重大危险源\",\"80%\",\"80%\");'><img src='"+BASE_URL+"/images/gis/popup/zdwxy.png'>重大危险源</a>");
		url =BASE_URL+"/enterprise/entplan/menuDisplay/"+params[5];
		data.push("<a href='javascript:void(0)' onclick='openWin(\""+url+"\",\"企业平面图\",\"80%\",\"80%\");'><img src='"+BASE_URL+"/images/gis/popup/qypmt.png'>企业平面图</a>");
		url = BASE_URL+"/monitor/macmonitormap/gisMapInto/"+params[5];
		data.push("<a href='javascript:void(0)' onclick='openWin(\""+url+"\",\"监测监控\",\"80%\",\"80%\");'><img src='"+BASE_URL+"/images/gis/popup/jcjl.png'>监测监控</a>");
		url=BASE_URL+"/hiddendanger/hdientinspection/GIS/"+params[5];
		data.push("<a href='javascript:void(0)' onclick='openWin(\""+url+"\",\"自查记录\",\"80%\",\"80%\");'><img src='"+BASE_URL+"/images/gis/popup/zcjl.png'>自查记录</a>");
		url=BASE_URL+"/hiddendanger/hdigovinspection/gis/"+params[5];
		data.push("<a href='javascript:void(0)' onclick='openWin(\""+url+"\",\"巡查记录\",\"80%\",\"80%\");'><img src='"+BASE_URL+"/images/gis/popup/pcjl.png'>巡查记录</a>");
		url = BASE_URL+"/law/lawcase/GIS/"+params[5];
		data.push("<a href='javascript:void(0)' onclick='openWin(\""+url+"\",\"执法记录\",\"80%\",\"80%\");'><img src='"+BASE_URL+"/images/gis/popup/zfjl.png'>执法记录</a>");
		url = BASE_URL+"/ems/emsplaplaninfo/gisentplanlist/"+params[5];
		data.push("<a href='javascript:void(0)' onclick='openWin(\""+url+"\",\"企业预案\",\"80%\",\"80%\");'><img src='"+BASE_URL+"/images/gis/popup/qyya.png'>企业预案</a>");
		data.push('</div></div></div>');
		return data.join('');
	}
}