var PopupContent = function(){
	//获取企业数据
	this.getBusiData = function(attributes){
		var params=new Array(6);
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
			}
			if(count==6) return true;
		});
		return params;

	}
	

	//弹出框里的内容
	this.setPopupContent = function(params){
		var data = new Array();
		var url;
		/*data.push('<div class="p">');
		data.push('<p><span style="width:210px;float:left;"><strong>企业名称：</strong>'+(params[0]==undefined?"无":params[0])+'</span><span style="width:210px;"><strong>组织机构代码：</strong>'+(params[1]==undefined?"无":params[1])+'</span></p>');
		data.push('<p><span style="width:210px;float:left;"><strong>安全责任人：</strong>'+(params[3]==undefined?"无":params[3])+'</span><span style="width:210px;"><strong>手机号码：</strong>'+(params[4]==undefined?"无":params[4])+'</span></p>');
		data.push('<p><strong>注册地址：</strong>'+(params[2]==undefined?"无":params[2])+'</p>');
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
		data.push('</div></div></div>');
		return data.join('');
	}
	
}