$(document).ready(function() {

	// 队伍属性
	var teamstatsDataArr = [
	                        {code : 1, name : '专业应急救援队伍'},
	                        {code : 2, name : '兼职应急救援队伍'},
	                        {code : 3, name : '志愿者应急救援队伍'}
	                        ];
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
	                     ];

	// 队伍级别
	var teamrankDataArr = [
	                       {code : 1, name : '国家级'},
	                       {code : 2, name : '省级'},
	                       {code : 3, name : '地市级'},
	                       {code : 4, name : '县级'},
	                       {code : 5, name : '企业级'}
	                       ];

	// 队伍救援专业
	var rescueprofessionDataArr = [
	                               {code : 1, name : '救援'},
	                               {code : 2, name : '救护'},
	                               {code : 3, name : '掘进'},
	                               {code : 4, name : '通风'},
	                               {code : 5, name : '堵漏'},
	                               {code : 6, name : '其他'}
	                               ];

	// 队伍适用行业
	var teamindustryDataArr = [
                           {code : 1, name : '煤炭开采'},
                           {code : 2, name : '采矿业'},
                           {code : 3, name : '石油加工'},
                           {code : 4, name : '化学原料制造业'},
                           {code : 5, name : '金属冶炼'}
                           ];

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
	                       ];
	
	// 队伍资质
	var teamqualifyDataArr = [
	                               {code : 1, name : '一级'},
	                               {code : 2, name : '二级'},
	                               {code : 3, name : '三级'},
	                               {code : 4, name : '四级'},
	                               {code : 5, name : '未知'}
	                               ];
	
	
	// 队伍等级
	var teamlevelDataArr = [
                              {code : 1, name : '特级'},
                              {code : 2, name : '一级'},
                              {code : 3, name : '二级'},
                              {code : 4, name : '三级'},
                              {code : 5, name : '未知'}
                              ];
	
	// 质量标准化等级
	var standardlevDataArr = [
	                               {code : 1, name : '一级'},
	                               {code : 2, name : '二级'},
	                               {code : 3, name : '三级'},
	                               {code : 4, name : '四级'},
	                               {code : 5, name : '未知'}
	                               ];	
	
	var loadBaseCodeByType = function(data, code, type) {
		$('#' + code).empty();
		var value = $('#' + code).attr("selectvalue");
		if (data.length > 0) {
			var o = new Option('请选择', '');
			$("#" + code)[0].options.add(o);
			for ( var i = 0; i < data.length; i++) {
				if(data[i].type == type) {
					var t = new Option(data[i].name, data[i].code);
					$("#" + code)[0].options.add(t);
					if (value) {
						if (value == data[i].code) {
							$("#" + code).val(value);
						}
					}
				}
			}
		}
		
	};
	
	// select 作为表单录入下拉框和list查询条件下拉框
	// list 查询条件 有些不是list查询条件需要过滤掉
	var selectEleListMap = {
			teamstats : teamstatsDataArr, 
			teamtypeid : teamtypeidArr,
			teamrank : teamrankDataArr, 
			rescueprofession : rescueprofessionDataArr, 
			teamindustry : teamindustryDataArr,
			dealtype : dealtypeDataArr, 
			teamqualify : teamqualifyDataArr,
			teamlevel : teamlevelDataArr,
			standardlev : standardlevDataArr
	};
	
	$.each(selectEleListMap, function(key, value){
		if($('#' + key).length > 0) {
			if(key == 'teamtypeid') {
				loadBaseCodeByType(value, key, $('#teamstats').attr('selectvalue'));
			}
			else
				SelectOption.loadBaseCode(value, key);
		}
			
	});
	

	$('#teamstats').change(function(){
		loadBaseCodeByType(teamtypeidArr, 'teamtypeid', $(this).val());
	});
	
});




