var emergContent = function(){
	//获取企业数据
	this.getBusiDate = function(attributes){
		var params=new Array(5);
		var count=0;
		$.each(attributes, function(key, value) {
			switch(key){
				case 'ADDRESS':
					key='注册地址';
					params[2]=value;
					count++;
					break;
				case 'NAME':
					key='企业名称';
					count++;
					params[0]=value;
					break;
				case 'ORGDUTIES':
					key='组织机构职责';
					count++;
					params[1]=value;
					break;
				case 'EMAIL':
					key='邮箱';
					count++;
					params[3]=value;
					break;
				case 'PHONE':
					key='手机号码';
					count++;
					params[4]=value;
					break;
				case 'ID':
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
		data.push('<div class="p">');
		data.push('<p>机构名称：'+(params[0]==undefined?"无":params[0])+'</p>');
		data.push('<p>机构职责：'+(params[1]==undefined?"无":params[1])+'</p>');
		data.push('<p>注册地址：'+(params[2]==undefined?"无":params[2])+'</p>');
		data.push('<p>邮箱：'+(params[3]==undefined?"无":params[3])+'</p>');
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
		data.push('</tbody><table>');
		/*data.push('<div>');
		data.push('<span>附近</span>');
		data.push("<input type='text' id='range' />");
		data.push('<span>米</span>');
		data.push("<input type='checkbox' id='company' />企业");
		//data.push("<input type='checkbox' id='team' />");
		data.push('</div>');*/
		return data.join('');
	}
}