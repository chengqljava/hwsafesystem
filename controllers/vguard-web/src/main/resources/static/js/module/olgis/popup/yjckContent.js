var yjckContent = function(){
	//获取数据
	this.getDate = function(attributes){
		var params=new Array(9);
		var count=0;
		if(attributes.length == 1){
			attributes = attributes[0];
		}
		$.each(attributes, function(key, value) {
			switch(key){
				case 'ADDRESS':
					key='仓库地址';
					params[2]=value;
					count++;
					break;
				case 'STOREHOUSE':
					key='仓库名称';
					count++;
					params[0]=value;
					break;
				case 'MATERIALTYPE':
					key='存储物资类型';
					count++;
					var getValue = getMaeMaterialtype(value);
					params[1]=getValue;
					break;
				case 'GRADE':
					key='物质库级别';
					count++;
					var getValue = getMaeDeposGrade(value);
					params[3]=getValue;
					break;
				case 'CAPACITY':
					key='库容';
					count++;
					params[4]=value;
					break;
				case 'EMSDEPOSID':
					count++;
					params[5]=value;
					break;
				case 'CAPACITYUNIT':
					key='库容单位';
					count++;
					params[6]=value;
					break;
				case 'MEASURE':
					key='所属单位';
					count++;
					params[7]=value;
					break;
				case 'DUTYTEL':
					key='应急值班电话';
					count++;
					params[8]=value;
					break;
				case 'PRINCIPALONE':
					key='第一负责人';
					count++;
					params[9]=value;
					break;
				case 'MOBILEONE':
					key='手机';
					count++;
					params[10]=value;
					break;
			}
			if(count==10) return true;
		});
		return params;

	}
	

	//弹出框里的内容
	this.setPopupContent = function(params){
		var data = new Array();
		var url;
		/*data.push('<div class="p">');
		data.push('<p>仓库名称：'+(params[0]==undefined?"无":params[0])+'</p>');
		data.push('<p>存储物资类型：'+(params[1]==undefined?"无":params[1])+'</p>');
		data.push('<p>仓库地址：'+(params[2]==undefined?"无":params[2])+'</p>');
		data.push('<p>物质库级别：'+(params[3]==undefined?"无":params[3])+'</p>');
		data.push('<p>库容：'+(params[4]==undefined?"无":params[4])+'</p>');
		data.push('<p>库容单位：'+(params[6]==undefined?"无":params[6])+'</p>');
		data.push('<p>所属单位：'+(params[7]==undefined?"无":params[7])+'</p>');
		data.push('<p>应急值班电话：'+(params[8]==undefined?"无":params[8])+'</p>');
		data.push('<p>第一负责人：'+(params[9]==undefined?"无":params[9])+'</p>');
		data.push('<p>手机：'+(params[10]==undefined?"无":params[10])+'</p>');
		url =BASE_URL+"/ems/emsresdepos/display/"+params[5];//应急仓库
		data.push("<a href='javascript:void(0)' onclick='openWin(\""+url+"\",\"应急仓库\",\"80%\",\"80%\");'><span>[详细信息]</span>");
		
		data.push('</div>');*/
		/*data.push('<div>');
		data.push('<span>附近</span>');
		data.push("<input type='text' id='range' />");
		data.push('<span>米</span>');
		data.push("<input type='checkbox' id='company' />企业");
		//data.push("<input type='checkbox' id='team' />");
		data.push('</div>');*/
		
		data.push('<div class="tab">');
		data.push('<div class="tab_menu" id="tabMenu"><ul><li class="active">基本信息</li><li>库容信息</li></ul></div>');
		data.push('<div class="tab_box"><div>');
		data.push('<table class="bTable"><tbody>');
		data.push('<tr><td>仓库名称</td><td>'+(params[0]==undefined?"无":params[0])+'</td></tr>');
		data.push('<tr><td>仓库地址</td><td>'+(params[2]==undefined?"无":params[2])+'</td></tr>');
		data.push('<tr><td>应急值班电话</td><td>'+(params[8]==undefined?"无":params[8])+'</td></tr>');
		data.push('<tr><td>第一负责人</td><td>'+(params[9]==undefined?"无":params[9])+'</td></tr>');
		data.push('<tr><td>手机</td><td>'+(params[10]==undefined?"无":params[10])+'</td></tr>');
		data.push('</tbody></table>');
		url =BASE_URL+"/ems/emsresdepos/display/"+params[5];//应急仓库
		data.push("<button id='realtimeMonitor' style='padding:0 6px;width: 76px;height: 30px;background-color: #3385ff;border: none;color: #fff;float: right;' onclick='openWin(\""+url+"\",\"应急仓库\",\"80%\",\"80%\");'>[详细信息]</button>");
		data.push('</div>');
		data.push('<div style="display: none;">');
		data.push('<table class="bTable"><tbody>');
		data.push('<tr><td>存储物资类型</td><td>'+(params[1]==undefined?"无":params[1])+'</td></tr>');
		data.push('<tr><td>物质库级别</td><td>'+(params[3]==undefined?"无":params[3])+'</td></tr>');
		data.push('<tr><td>库容</td><td>'+(params[4]==undefined?"无":params[4])+'</td></tr>');
		data.push('<tr><td>库容单位</td><td>'+(params[6]==undefined?"无":params[6])+'</td></tr>');
		data.push('<tr><td>所属单位</td><td>'+(params[7]==undefined?"无":params[7])+'</td></tr>');
		data.push('</tbody></table>');
		data.push('</div>');
		data.push('</div></div>');
		return data.join('');
	}
	
	function getMaeMaterialtypeData() {
		var data=new Array();
		data.push({code:0,name:'国家战略性储备物资'});
		data.push({code:1,name:'战略性粮食储备'});
		data.push({code:2,name:'战略性棉花储备'});
		data.push({code:3,name:'战略性食用油储备'});
		data.push({code:4,name:'战略性能源储备'});
		data.push({code:5,name:'战略性医药储备'});
		data.push({code:6,name:'其他战略性储备物资'});
		data.push({code:7,name:'专用应急物资及储备'});
		data.push({code:8,name:'防汛抗旱专用物资'});
		data.push({code:9,name:'防震减灾专用物资'});
		data.push({code:10,name:'防疫应急专用物资'});
		data.push({code:11,name:'有害生物灾害应急防控专用物资'});
		data.push({code:12,name:'危险化学品事故救援专用物资'});
		data.push({code:13,name:'矿山事故救援专用物资'});
		data.push({code:14,name:'其它专项救援物资储备'});
		data.push({code:15,name:'基本生活物资保障'});
		data.push({code:16,name:'粮食'});
		data.push({code:17,name:'除粮食之外的食品'});
		data.push({code:18,name:'食盐'});
		data.push({code:19,name:'食用油'});
		data.push({code:20,name:'食糖'});
		data.push({code:21,name:'肉类'});
		data.push({code:22,name:'衣被'});
		data.push({code:23,name:'饮用水'});
		data.push({code:24,name:'救灾帐篷'});
		data.push({code:25,name:'其它基本生活物资'});
		data.push({code:26,name:'应急装备'});
		return data;
	}
	function getCodeName(data,code){
		for(var i=0;i<data.length;i++){
			if(data[i].code==code){
				return data[i].name;
			}
		}
	}
	function getMaeMaterialtype(code){
		if(code==null)
			return "";
		return getCodeName(getMaeMaterialtypeData(),code);
	}
	
	function getMaeDeposGradeData() {
		var data=new Array();
		data.push({code:0,name:'国家级'});
		data.push({code:1,name:'省级'});
		data.push({code:2,name:'地市级'});
		data.push({code:3,name:'区县级'});
		data.push({code:4,name:'乡镇'});
		return data;
	}
	function getMaeDeposGrade(code){
		if(code==null)
			return "";
		return SelectOption.getCodeName(SelectOption.getMaeDeposGradeData(),code);
	}
}