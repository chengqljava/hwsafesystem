var yjdwContent = function(){
	//获取数据
	this.getDate = function(attributes){
		var params=new Array(9);
		var count=0;
		if(attributes.length == 1){
			attributes = attributes[0];
		}
		$.each(attributes, function(key, value) {
			switch(key){
				case 'TEAMTYPEID':
					key='队伍类型';
					var getValue = getteamtypeid(value);
					params[2]=getValue;
					count++;
					break;
				case 'TEAMNAME':
					key='队伍名称';
					count++;
					params[0]=value;
					break;
				case 'TEAMRANK':
					key='队伍级别';
					count++;
					var getValue = getteamrankData(value);
					params[1]=getValue;
					break;
				case 'RESCUEPROFESSION':
					key='队伍救援专业';
					count++;
					var getValue = getrescueprofession(value);
					params[3]=getValue;
					break;
				case 'TEAMQUALIFY':
					key='队伍资质';
					count++;
					var getValue = getteamqualify(value);
					params[4]=getValue;
					break;
				case 'TEAMID':
					count++;
					params[5]=value;
					break;
				case 'TEAMLEVEL':
					key='队伍等级';
					count++;
					var getValue = getteamlevel(value)
					params[6]=getValue;
					break;
				case 'TEAMINDUSTRY':
					key='队伍适用行业';
					count++;
					var getValue = getteamindustry(value);
					params[7]=getValue;
					break;
				case 'DEALTYPE':
					key='擅长处理事故类型';
					count++;
					var getValue = getdealtype(value);
					params[8]=getValue;
					break;
				case 'RESPONSEPER':
					key='主要负责人';
					count++;
					params[9]=value;
					break;
				case 'DUTYTEL':
					key='应急值班电话';
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
	/*	data.push('<div class="p">');
		data.push('<p>队伍名称：'+(params[0]==undefined?"无":params[0])+'</p>');
		data.push('<p>队伍级别：'+(params[1]==undefined?"无":params[1])+'</p>');
		data.push('<p>队伍类型：'+(params[2]==undefined?"无":params[2])+'</p>');
		data.push('<p>队伍救援专业：'+(params[3]==undefined?"无":params[3])+'</p>');
		data.push('<p>队伍资质：'+(params[4]==undefined?"无":params[4])+'</p>');
		data.push('<p>队伍等级：'+(params[6]==undefined?"无":params[6])+'</p>');
		data.push('<p>队伍适用行业：'+(params[7]==undefined?"无":params[7])+'</p>');
		data.push('<p>擅长处理事故类型：'+(params[8]==undefined?"无":params[8])+'</p>');
		data.push('<p>主要负责人：'+(params[9]==undefined?"无":params[9])+'</p>');
		data.push('<p>应急值班电话：'+(params[10]==undefined?"无":params[10])+'</p>');
		url =BASE_URL+"/ems/emsresteam/display/"+params[5];//应急队伍
		data.push("<a href='javascript:void(0)' onclick='openWin(\""+url+"\",\"应急队伍\",\"80%\",\"80%\");'><span>[详细信息]</span>");
		data.push('</div>');*/
		
		/*data.push('<div>');
		data.push('<span>附近</span>');
		data.push("<input type='text' id='range' />");
		data.push('<span>米</span>');
		data.push("<input type='checkbox' id='company' />企业");
		//data.push("<input type='checkbox' id='team' />");
		data.push('</div>');*/
		
		data.push('<div class="tab">');
		data.push('<div class="tab_menu" id="tabMenu"><ul><li class="active">基本信息</li><li>资质等级</li></ul></div>');
		data.push('<div class="tab_box"><div>');
		data.push('<table class="bTable"><tbody>');
		data.push('<tr><td>队伍名称</td><td>'+(params[0]==undefined?"无":params[0])+'</td></tr>');
		data.push('<tr><td>队伍级别</td><td>'+(params[1]==undefined?"无":params[1])+'</td></tr>');
		data.push('<tr><td>队伍类型</td><td>'+(params[2]==undefined?"无":params[2])+'</td></tr>');
		data.push('<tr><td>主要负责人</td><td>'+(params[9]==undefined?"无":params[9])+'</td></tr>');
		data.push('<tr><td>应急值班电话</td><td>'+(params[10]==undefined?"无":params[10])+'</td></tr>');
		data.push('</tbody></table>');
		url =BASE_URL+"/ems/emsresteam/display/"+params[5];//应急队伍
		data.push("<button id='realtimeMonitor' style='padding:0 6px;width: 76px;height: 30px;background-color: #3385ff;border: none;color: #fff;float: right;' onclick='openWin(\""+url+"\",\"应急队伍\",\"80%\",\"80%\");'>[详细信息]</button>");
		data.push('</div>');
		data.push('<div style="display: none;">');
		data.push('<table class="bTable"><tbody>');
		data.push('<tr><td>队伍救援专业</td><td>'+(params[3]==undefined?"无":params[3])+'</td></tr>');
		data.push('<tr><td>队伍资质</td><td>'+(params[4]==undefined?"无":params[4])+'</td></tr>');
		data.push('<tr><td>队伍等级</td><td>'+(params[6]==undefined?"无":params[6])+'</td></tr>');
		data.push('<tr><td>队伍适用行业</td><td>'+(params[7]==undefined?"无":params[7])+'</td></tr>');
		data.push('<tr><td>擅长处理事故类型</td><td>'+(params[8]==undefined?"无":params[8])+'</td></tr>');
		data.push('</tbody></table>');
		data.push('</div>');
		data.push('</div></div>');
		return data.join('');
	}
	
	// 队伍类型
	var teamtypeidArr = [
	                     	{code : 1, name : '油汽类事故处置队', type : 1},
	                     	{code : 2, name : '医疗救护队', type : 1},
	                     	{code : 3, name : '海上搜救队', type : 1},
	                     	{code : 4, name : '危险打捞队', type : 1},
	                     	{code : 5, name : '消防救援队', type : 1},
	                     	{code : 6, name : '危险化学品事故救援队', type : 1},
	                     	{code : 7, name : '防汛机动抢险队', type : 1},
	                     	{code : 8, name : '通讯保障队', type : 1},
	                     	{code : 9, name : '电力抢修队', type : 1},
	                     	{code : 10, name : '供气抢修队', type : 1},
	                     	{code : 11, name : '排水污水处理抢险队', type : 1},
	                     	{code : 12, name : '矿山事故救援队', type : 1},
	                     	{code : 13, name : '地震救援队', type : 1},
	                     	{code : 14, name : '陆地搜寻与救护队', type : 1},
	                     	{code : 15, name : '救援列车队', type : 1},
	                     	{code : 16, name : '抗旱服务队', type : 1},
	                     	{code : 17, name : '重大队伍疫病应急救援队', type : 1},
	                     	{code : 18, name : '专业森林消防队', type : 1},
	                     	{code : 19, name : '林业有害生物灾害应急专业队', type : 1},
	                     	{code : 20, name : '食物中毒事件应急预备队', type : 1},
	                     	{code : 21, name : '路桥抢修队', type : 1},
	                     	{code : 22, name : '园林养护抢险队', type : 1},
	                     	{code : 23, name : '其他专业救援队', type : 1},
	                     	{code : 23, name : '油汽类事故处置', type : 2},
	                     	{code : 24, name : '救捞队', type : 2},
	                     	{code : 25, name : '运输队', type : 2},
	                     	{code : 26, name : '医疗救护队', type : 2},
	                     	{code : 27, name : '危险化学品救援队', type : 2},
	                     	{code : 28, name : '地震救援队', type : 2},
	                     	{code : 29, name : '防汛抗旱队', type : 2},
	                     	{code : 30, name : '抢险抢修队', type : 2},
	                     	{code : 31, name : '其他', type : 2}
	                     ]
	function getCodeName(data,code){
		for(var i=0;i<data.length;i++){
			if(data[i].code==code){
				return data[i].name;
			}
		}
	}
	function getteamtypeid(code){
		if(code==null)
			return "";
		return getCodeName(teamtypeidArr,code);
	}
	
	// 队伍级别
	var teamrankDataArr = [
	                       {code : 1, name : '国家级'},
	                       {code : 2, name : '省级'},
	                       {code : 3, name : '地市级'},
	                       {code : 4, name : '县级'},
	                       {code : 5, name : '企业级'}
	                       ]
	function getteamrankData(code){
		if(code==null)
			return "";
		return getCodeName(teamrankDataArr,code);
	}
	
	// 队伍救援专业
	var rescueprofessionDataArr = [
	                               {code : 1, name : '救援'},
	                               {code : 2, name : '救护'},
	                               {code : 3, name : '掘进'},
	                               {code : 4, name : '通风'},
	                               {code : 5, name : '堵漏'},
	                               {code : 6, name : '其他'}
	                               ]
	function getrescueprofession(code){
		if(code==null)
			return "";
		return getCodeName(rescueprofessionDataArr,code);
	}
	// 队伍适用行业
	var teamindustryDataArr = [
                           {code : 1, name : '煤炭开采'},
                           {code : 2, name : '采矿业'},
                           {code : 3, name : '石油加工'},
                           {code : 4, name : '化学原料制造业'},
                           {code : 5, name : '金属冶炼'}
                           ]
	function getteamindustry(code){
		if(code==null)
			return "";
		return getCodeName(teamindustryDataArr,code);
	}
	// 擅长处置事故类型
	var dealtypeDataArr = [
	                       {code : 1, name : '物体打击'},
	                       {code : 2, name : '车辆伤害'},
	                       {code : 3, name : '机械伤害'},
	                       {code : 4, name : '起重伤害'},
	                       {code : 5, name : '触电'},
	                       {code : 6, name : '淹溺'},
	                       {code : 1, name : '灼烫'},
	                       {code : 2, name : '火灾'},
	                       {code : 3, name : '高处坠落'},
	                       {code : 4, name : '坍塌'},
	                       {code : 5, name : '冒顶片帮'},
	                       {code : 6, name : '透水'},
	                       {code : 3, name : '爆破'},
	                       {code : 4, name : '火药爆照'},
	                       {code : 5, name : '瓦斯爆炸'},
	                       {code : 6, name : '锅炉爆炸'},
	                       {code : 1, name : '容器爆炸'},
	                       {code : 2, name : '其他爆炸'},
	                       {code : 3, name : '中毒和窒息'},
	                       {code : 4, name : '其他伤害'}	                       
	                       ]
	function getdealtype(code){
		if(code==null)
			return "";
		return getCodeName(dealtypeDataArr,code);
	}
	// 队伍资质
	var teamqualifyDataArr = [
	                               {code : 1, name : '一级'},
	                               {code : 2, name : '二级'},
	                               {code : 3, name : '三级'},
	                               {code : 4, name : '四级'},
	                               {code : 5, name : '未知'}
	                               ]
	function getteamqualify(code){
		if(code==null)
			return "";
		return getCodeName(teamqualifyDataArr,code);
	}
	
	
	// 队伍等级
	var teamlevelDataArr = [
                              {code : 1, name : '特级'},
                              {code : 2, name : '一级'},
                              {code : 3, name : '二级'},
                              {code : 4, name : '三级'},
                              {code : 5, name : '未知'}
                              ]
	function getteamlevel(code){
		if(code==null)
			return "";
		return getCodeName(teamlevelDataArr,code);
	}
}