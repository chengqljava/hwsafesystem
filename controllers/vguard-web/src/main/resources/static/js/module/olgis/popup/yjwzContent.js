var yjwzContent = function(){
	//获取数据
	this.getDate = function(attributes){
		var params=new Array(6);
		var count=0;
		if(attributes.length == 1){
			attributes = attributes[0];
		}
		$.each(attributes, function(key, value) {
			switch(key){
				case 'STOADDRESS':
					key='存储地址';
					params[2]=value;
					count++;
					break;
				case 'MATERIALNAME':
					key='物资设备名称';
					count++;
					params[0]=value;
					break;
				case 'PURPOSE':
					key='用途';
					count++;
					params[1]=value;
					break;
				case 'MODEL':
					key='规格型号';
					count++;
					params[3]=value;
					break;
				case 'NUM':
					key='数量';
					count++;
					params[4]=value;
					break;
				case 'EMSMATERIALID':
					count++;
					params[5]=value;
					break;
				case 'MAXNAME':
					key='大类名称';
					count++;
					params[6]=value;
					break;
			}
			if(count==7) return true;
		});
		return params;

	}
	

	//弹出框里的内容
	this.setPopupContent = function(params){
		var data = new Array();
		var url;
		/*data.push('<div class="p">');
		data.push('<p>物资设备名称：'+(params[0]==undefined?"无":params[0])+'</p>');
		data.push('<p>用途：'+(params[1]==undefined?"无":params[1])+'</p>');
		data.push('<p>存储地址：'+(params[2]==undefined?"无":params[2])+'</p>');
		data.push('<p>规格型号：'+(params[3]==undefined?"无":params[3])+'</p>');
		data.push('<p>数量：'+(params[4]==undefined?"无":params[4])+'</p>');
		data.push('<p>大类名称：'+(params[6]==undefined?"无":params[6])+'</p>');
		url =BASE_URL+"/ems/emsresmaterial/display/"+params[5]+"/null";//应急物资
		data.push("<a href='javascript:void(0)' onclick='openWin(\""+url+"\",\"应急机构\",\"80%\",\"80%\");'><span>[详细信息]</span>");
		data.push('</div>');*/
		
		/*data.push('<div>');
		data.push('<span>附近</span>');
		data.push("<input type='text' id='range' />");
		data.push('<span>米</span>');
		data.push("<input type='checkbox' id='company' />企业");
		//data.push("<input type='checkbox' id='team' />");
		data.push('</div>');*/
		
		data.push('<div class="tab">');
		data.push('<div class="tab_menu" id="tabMenu"><ul><li class="active">基本信息</li></ul></div>');
		data.push('<div class="tab_box"><div>');
		data.push('<table class="bTable"><tbody>');
		data.push('<tr><td>物资设备名称</td><td>'+(params[0]==undefined?"无":params[0])+'</td></tr>');
		data.push('<tr><td>存储地址</td><td>'+(params[2]==undefined?"无":params[2])+'</td></tr>');
		data.push('<tr><td>大类名称</td><td>'+(params[6]==undefined?"无":params[6])+'</td></tr>');
		data.push('<tr><td>用途</td><td>'+(params[1]==undefined?"无":params[1])+'</td></tr>');
		data.push('<tr><td>数量</td><td>'+(params[4]==undefined?"无":params[4])+'</td></tr>');
		data.push('</tbody></table>');
		url =BASE_URL+"/ems/emsresmaterial/display/"+params[5]+"/null";//应急物资
		data.push("<button id='realtimeMonitor' style='padding:0 6px;width: 76px;height: 30px;background-color: #3385ff;border: none;color: #fff;float: right;' onclick='openWin(\""+url+"\",\"应急物资\",\"80%\",\"80%\");'>[详细信息]</button>");
		data.push('</div>');
		data.push('</div></div>');
		return data.join('');
	}
}