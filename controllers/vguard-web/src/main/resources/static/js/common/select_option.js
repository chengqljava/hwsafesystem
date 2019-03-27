var SelectOption = function() {

};

/**
 * 用户级别 角色管理使用字段
 */
SelectOption.getUserLevelData = function getUserLevelData(){
    var data = [];
    data.push({code:'0',name:'厂区'});
    data.push({code:'1',name:'车间/部门'});
    data.push({code:'2',name:'班组'});
    data.push({code:'3',name:'其他'});
    return data;
};
SelectOption.loadUserLevel = function loadUserLevel(code) {
    var data=SelectOption.getUserLevelData();
    SelectOption.loadBaseCode(data, code);
};
SelectOption.getUserLevel = function getUserLevel(code){
    if(code==null)
        return "";
    return SelectOption.getCodeName(SelectOption.getUserLevelData(),code);
};


/**
 * 人员类别
 */
SelectOption.getContactsTypeData = function getContactsTypeData(){
    var data = [];
    data.push({code:'0',name:'管理员'});
    data.push({code:'1',name:'领导'});
    data.push({code:'2',name:'安全员'});
    return data;
};
SelectOption.loadContactsType = function loadContactsType(code) {
    var data=SelectOption.getContactsTypeData();
    SelectOption.loadBaseCode(data, code);
};
SelectOption.getContactsType = function getContactsType(code){
    if(code==null)
        return "";
    return SelectOption.getCodeName(SelectOption.getContactsTypeData(),code);
};

/**
 * 企业部门类别
 */
SelectOption.getEntOrgTypeData = function getEntOrgTypeData(){
    var data = [];
    data.push({code:'1',name:'部门'});
    data.push({code:'2',name:'车间'});
    return data;
};
SelectOption.loadEntOrgType = function loadEntOrgType(code) {
    var data=SelectOption.getEntOrgTypeData();
    SelectOption.loadBaseCode(data, code);
};
SelectOption.getEntOrgType = function getEntOrgType(code){
    if(code==null)
        return "";
    return SelectOption.getCodeName(SelectOption.getEntOrgTypeData(),code);
};

/**
 * 波特率
 */
SelectOption.getBaudrateData = function getBaudrateData(){
    var data = [];
    data.push({code:'0',name:'2400'});
    data.push({code:'1',name:'4800'});
    data.push({code:'2',name:'7200'});
    data.push({code:'3',name:'9600'});
    data.push({code:'4',name:'19200'});
    data.push({code:'5',name:'38400'});
    data.push({code:'6',name:'57600'});
    data.push({code:'7',name:'115200'});
    return data;
};
SelectOption.loadBaudrate = function loadBaudrate(code) {
    var data=SelectOption.getBaudrateData();
    SelectOption.loadBaseCode(data, code);
};
SelectOption.getBaudrate = function getBaudrate(code){
    if(code==null)
        return "";
    return SelectOption.getCodeName(SelectOption.getBaudrateData(),code);
};

/**
 * 教育培训培训类型
 */
SelectOption.getTranClassData = function getTranClassData(){
    var data = [];
    data.push({code:'0',name:'三级安全生产教育'});
    data.push({code:'1',name:'特种作业教育'});
    data.push({code:'2',name:'岗位人员调换工种教育'});
    data.push({code:'3',name:'现场安全教育'});
    data.push({code:'4',name:'工伤人员复工教育'});
    data.push({code:'5',name:'日常教育'});
    data.push({code:'6',name:'安全考试'});
    data.push({code:'7',name:'事故案例教育'});
    data.push({code:'8',name:'其他'});
    return data;
};
SelectOption.loadTranClass = function loadTranClass(code) {
    var data=SelectOption.getTranClassData();
    SelectOption.loadBaseCode(data, code);
};
SelectOption.getTranClass = function getTranClass(code){
    if(code==null)
        return "";
    return SelectOption.getCodeName(SelectOption.getTranClassData(),code);
};

/**
 * 考试方式(0.优秀 1.良好 2.中等 3.差 4.较差)
 */
SelectOption.getAssessLevelData = function getAssessLevelData() {
    var data=new Array();
    data.push({code:'0',name:'优秀'});
    data.push({code:'1',name:'良好'});
    data.push({code:'2',name:'中等'});
    data.push({code:'3',name:'差'});
    data.push({code:'4',name:'较差'});
    return data;
};
SelectOption.loadAssessLevel = function loadAssessLevel(code) {
    var data=SelectOption.getAssessLevelData();
    SelectOption.loadBaseCode(data, code);
};
SelectOption.getAssessLevel = function getAssessLevel(code){
    if(code==null)
        return "";
    return SelectOption.getCodeName(SelectOption.getAssessLevelData(),code);
};

/**
 * 考试方式(1.设备 2.岗位 3.操作程序 4.能量源)
 */
SelectOption.getExamTypeData = function getExamTypeData() {
    var data=new Array();
    data.push({code:'0',name:'现场问答 '});
    data.push({code:'1',name:'书面试卷 '});
    data.push({code:'2',name:'在线考试 '});
    data.push({code:'3',name:'其他方式'});
    return data;
};
SelectOption.loadExamType = function loadExamType(code) {
    var data=SelectOption.getExamTypeData();
    SelectOption.loadBaseCode(data, code);
};
SelectOption.getExamType = function getExamType(code){
    if(code==null)
        return "";
    return SelectOption.getCodeName(SelectOption.getExamTypeData(),code);
};

/**
 * 培训记录下拉选
 */
/*SelectOption.loadTrnrecord = function loadTrnrecord(code,jsonParam){
    SelectOption.loadBaseCodeFromDB(BASE_URL+"/train/etstrnrecord/loadtrnrecordselect",code,jsonParam);
};*/

/**
 * 场所区域下拉选
 */
SelectOption.loadPlacearea = function loadPlacearea(code,jsonParam){
    SelectOption.loadBaseCodeFromDB(BASE_URL+"/dangersource/dssrskplacearea/loadPlaceSelect",code,jsonParam);
};

/**
 * 岗位/设备下拉选
 */
SelectOption.loadPostequip = function loadPostequip(code,jsonParam){
    SelectOption.loadBaseCodeFromDB(BASE_URL+"/dangersource/dssrskpostequip/loadPosteqipSelect",code,jsonParam);
};

/**
 * 岗位/设备 类型(1.设备 2.岗位 3.操作程序 4.能量源)
 */
SelectOption.getPostequipTypeData = function getPostequipTypeData() {
    var data=new Array();
    data.push({code:'1',name:'设备'});
    data.push({code:'2',name:'岗位'});
    data.push({code:'3',name:'操作程序'});
    data.push({code:'4',name:'能量源'});
    return data;
};
SelectOption.loadPostequipType = function loadPostequipType(code) {
    var data=SelectOption.getPostequipTypeData();
    SelectOption.loadBaseCode(data, code);
};
SelectOption.getPostequipType = function getPostequipType(code){
    if(code==null)
        return "";
    return SelectOption.getCodeName(SelectOption.getPostequipTypeData(),code);
};

/**
 * 二次仪器仪表
 * @param code
 * @param jsonParam
 */
SelectOption.loadContoller = function loadContoller(code,jsonParam){
    SelectOption.loadBaseCodeFromDB(BASE_URL+"/monitor/maccontroller/loadControllerSelect",code,jsonParam);
};


/**
 * 通讯链路
 * @param code
 * @param jsonParam
 */
SelectOption.loadMacSubGatewaySelect = function loadMacSubGatewaySelect(code,jsonParam){
    SelectOption.loadBaseCodeFromDB(BASE_URL+"/monitor/macsubgateway/loadMacSubGatewaySelect",code,jsonParam);
};


/**
 * 通讯网关
 * @param code
 * @param jsonParam
 */
SelectOption.loadMacGatewaySelect = function loadMacGatewaySelect(code,jsonParam){
    SelectOption.loadBaseCodeFromDB(BASE_URL+"/monitor/macgateway/loadMacGatewaySelect",code,jsonParam);
};

/**
 * 设备类型
 * @param code
 * @param jsonParam
 */
SelectOption.loadDevicetype = function loadDevicetype(code,jsonParam){
    SelectOption.loadBaseCodeFromDB(BASE_URL+"/monitor/macdevicetype/loadDeviceTypeSelect",code,jsonParam);
};

/**
 * 品牌系列
 * @param code
 * @param jsonParam
 */
SelectOption.loadMacBrand = function loadMacBrand(code,jsonParam){
    SelectOption.loadBaseCodeFromDB(BASE_URL+"/monitor/macbrand/loadMacBrandSelect",code,jsonParam);
};


/**
 * 威盾视频主机
 * @param code
 * @param jsonParam
 */
SelectOption.loadMacVideoHost = function loadMacBrandType(code,jsonParam){
    SelectOption.loadBaseCodeFromDB(BASE_URL+"/monitor/macvideohost/loadMacVideoHostSelect",code,jsonParam);
};

/**
 * 设备规格型号
 * @param code
 * @param jsonParam
 */
SelectOption.loadMacBrandType = function loadMacBrandType(code,jsonParam){
    SelectOption.loadBaseCodeFromDB(BASE_URL+"/monitor/macbrandtype/loadMacBrandTypeSelect",code,jsonParam);
};

/**
 * 服务器
 * @param code
 * @param jsonParam
 */
SelectOption.loadMacServer = function loadMacServer(code,jsonParam){
    SelectOption.loadBaseCodeFromDB(BASE_URL+"/monitor/macserver/loadMacServerSelect",code,jsonParam);
};

/**
 * 监测主机
 * @param code
 * @param jsonParam
 */
SelectOption.loadMacDcsMaster = function loadMacDcsMaster(code,jsonParam){
    SelectOption.loadBaseCodeFromDB(BASE_URL+"/monitor/macprobehost/loadMacDcsMasterSelect",code,jsonParam);
};


/**
 * 端口类型
 */
SelectOption.getPortTypeData = function getPortTypeData(){
    var data = [];
    data.push({code:'1',name:'RS485'});
    data.push({code:'2',name:'4~20mA'});
    return data;
};
SelectOption.loadPortType = function loadPortType(code) {
    var data=SelectOption.getPortTypeData();
    SelectOption.loadBaseCode(data, code);
};
SelectOption.getPortType = function getPortType(code){
    if(code==null)
        return "";
    return SelectOption.getCodeName(SelectOption.getPortTypeData(),code);
};


/**
 * 上传协议 上传协议
 */
SelectOption.getProtocolData = function getProtocolData(){
    var data = [];
    data.push({code:'TC200',name:'TC200'});
    data.push({code:'KB2200',name:'KB2200'});
    data.push({code:'GC1010',name:'GC1010'});
    data.push({code:'SNE800',name:'SNE800'});
    data.push({code:'M100',name:'M100'});
    data.push({code:'YJ',name:'YJ'});
    data.push({code:'CW',name:'CW'});
    data.push({code:'KB6000III',name:'KB6000III'});
    data.push({code:'GP7000_Intersense',name:'GP7000_Intersense'});
    data.push({code:'KB2100II_Modbus',name:'KB2100II_Modbus'});
    data.push({code:'KB8000',name:'KB8000'});
    data.push({code:'SUPCON',name:'SUPCON'});
    data.push({code:'TON90B',name:'TON90B'});
    data.push({code:'DMC2000',name:'DMC2000'});
    data.push({code:'AEC2300',name:'AEC2300'});
    data.push({code:'SHSAT2020',name:'SHSAT2020'});
    data.push({code:'TC200_Wireless',name:'TC200_Wireless'});
    data.push({code:'QB3100',name:'QB3100'});
    data.push({code:'FS300',name:'FS300'});
    data.push({code:'EDA9015II',name:'EDA9015II'});
    return data;
};
SelectOption.loadProtocol = function loadProtocol(code) {
    var data=SelectOption.getProtocolData();
    SelectOption.loadBaseCode(data, code);
};
SelectOption.getProtocol = function getProtocol(code){
    if(code==null)
        return "";
    return SelectOption.getCodeName(SelectOption.getProtocolData(),code);
};





/**
 * 上传接口 上传接口方式(1.无线GPRS；2.有线局域网；3.有线因特网)
 */
SelectOption.getInterfaceTypeData = function getInterfaceTypeData(){
    var data = [];
    data.push({code:'01',name:'无线GPRS'});
    data.push({code:'02',name:'有线局域网'});
    data.push({code:'03',name:'有线因特网'});
    return data;
};
SelectOption.loadInterfaceType = function loadInterfaceType(code) {
    var data=SelectOption.getInterfaceTypeData();
    SelectOption.loadBaseCode(data, code);
};
SelectOption.getInterfaceType = function getInterfaceType(code){
    if(code==null)
        return "";
    return SelectOption.getCodeName(SelectOption.getInterfaceTypeData(),code);
};


/**
 * 设备基础信息 设备使用状态(1.正常使用；2.备用；3.故障待修；4.报废；5.闲置)
 */
SelectOption.getUsestateData = function getUsestateData(){
    var data = [];

    data.push({code:'1',name:'正常使用'});
    data.push({code:'2',name:'备用'});
    data.push({code:'3',name:'故障待修'});
    data.push({code:'4',name:'报废'});
    data.push({code:'5',name:'闲置'});
    return data;
};
SelectOption.loadUsestate = function loadUsestate(code) {
    var data=SelectOption.getUsestateData();
    SelectOption.loadBaseCode(data, code);
};
SelectOption.getUsestate = function getUsestate(code){
    if(code==null)
        return "";
    return SelectOption.getCodeName(SelectOption.getUsestateData(),code);
};



/**
 * 设备基础信息 设备通信状态(1.正常；2.故障)
 */
SelectOption.getConnectstateData = function getConnectstateData(){
    var data = [];
    data.push({code:'1',name:'正常'});
    data.push({code:'2',name:'故障'});
    return data;
};
SelectOption.loadConnectstate = function loadConnectstate(code) {
    var data=SelectOption.getConnectstateData();
    SelectOption.loadBaseCode(data, code);
};
SelectOption.getConnectstate = function getConnectstate(code){
    if(code==null)
        return "";
    return SelectOption.getCodeName(SelectOption.getConnectstateData(),code);
};

/**
 * 园区公共设施 河道等级(1.班组级 2.车间级 3.公司级)
 */
SelectOption.getRiverLevelData = function getRiverLevelData() {
    var data=new Array();
    data.push({code:'1',name:'一级河道'});
    data.push({code:'2',name:'二级河道'});
    data.push({code:'3',name:'三级河道'});
    data.push({code:'4',name:'四级河道'});
    data.push({code:'5',name:'五级河道'});
    return data;
};
SelectOption.loadRiverLevel = function loadRiverLevel(code) {
    var data=SelectOption.getRiverLevelData();
    SelectOption.loadBaseCode(data, code);
};
SelectOption.getRiverLevel = function getRiverLevel(code){
    if(code==null)
        return "";
    return SelectOption.getCodeName(SelectOption.getRiverLevelData(),code);
};

/**
 * 风险管控 管控层级(1.班组级 2.车间级 3.公司级)
 */
SelectOption.getControlClassData = function getControlClassData() {
    var data=new Array();
    data.push({code:'1',name:'班组级'});
    data.push({code:'2',name:'车间级'});
    data.push({code:'3',name:'公司级'});
    return data;
};
SelectOption.loadControlClass = function loadControlClass(code) {
    var data=SelectOption.getControlClassData();
    SelectOption.loadBaseCode(data, code);
};
SelectOption.getControlClass = function getControlClass(code){
    if(code==null)
        return "";
    return SelectOption.getCodeName(SelectOption.getControlClassData(),code);
};

/**
 * 模拟演练形式
 */
SelectOption.getDrilltypeData = function getDrilltypeData() {
    var data=new Array();
    data.push({code:'1',name:'现场演练'});
    data.push({code:'2',name:'桌面演练'});
    data.push({code:'3',name:'综合演练'});
    data.push({code:'4',name:'专项演练'});
    return data;
};
SelectOption.loadDrilltype = function loadDrilltype(code) {
    var data=SelectOption.getDrilltypeData();
    SelectOption.loadBaseCode(data, code);
};
SelectOption.getDrilltype = function getDrilltype(code){
    if(code==null)
        return "";
    return SelectOption.getCodeName(SelectOption.getDrilltypeData(),code);
};


/**
 * 雪城 报警等级
 */
SelectOption.getHbAlarmLevelData = function getHbAlarmLevelData() {
    var data=new Array();
    data.push({code:'1',name:'一级'});
    data.push({code:'2',name:'二级'});
    data.push({code:'3',name:'三级'});
    data.push({code:'4',name:'四级'});
    return data;
};
SelectOption.loadHbAlarmLevel = function loadHbAlarmLevel(code) {
    var data=SelectOption.getHbAlarmLevelData();
    SelectOption.loadBaseCode(data, code);
};
SelectOption.getHbAlarmLevel = function getHbAlarmLevel(code){
    if(code==null)
        return "";
    return SelectOption.getCodeName(SelectOption.getHbAlarmLevelData(),code);
};

/**
 * 雪城 报警方式
 */
SelectOption.getHbSendModeData = function getHbSendModeData() {
    var data=new Array();
    data.push({code:'1',name:'应用中'});
    data.push({code:'2',name:'短信'});
    data.push({code:'3',name:'邮件'});
    return data;
};
SelectOption.loadHbSendMode = function loadHbSendMode(code) {
    var data=SelectOption.getHbSendModeData();
    SelectOption.loadBaseCode(data, code);
};
SelectOption.getHbSendMode = function getHbSendMode(code){
    if(code==null)
        return "";
    return SelectOption.getCodeName(SelectOption.getHbSendModeData(),code);
};

/**
 * 雪城 报警类型
 */
SelectOption.getHbAlramTypeData = function getHbAlramTypeData() {
    var data=new Array();
    data.push({code:'1',name:'标准站'});
    data.push({code:'2',name:'微型站'});
    data.push({code:'3',name:'工业废气'});
    data.push({code:'4',name:'扬尘'});
    data.push({code:'5',name:'油烟'});
    data.push({code:'6',name:'喷漆房'});
    data.push({code:'7',name:'加油站'});
    data.push({code:'8',name:'工业废水'});
    data.push({code:'9',name:'水质断面'});
    return data;
};
SelectOption.loadHbAlramType = function loadHbAlramType(code) {
    var data=SelectOption.getHbAlramTypeData();
    SelectOption.loadBaseCode(data, code);
};
SelectOption.getHbAlramType = function getHbAlramType(code){
    if(code==null)
        return "";
    return SelectOption.getCodeName(SelectOption.getHbAlramTypeData(),code);
};



/**
 * 隐患类别：1.安全管理，2.现场管理
 */
SelectOption.getHiddendangerTypeData = function getHiddendangerTypeData() {
    var data=new Array();
    data.push({code:1,name:'安全管理'});
    data.push({code:2,name:'现场管理'});
    return data;
};
SelectOption.loadHiddendangerType = function loadHiddendangerType(code) {
    var data=SelectOption.getHiddendangerTypeData();
    SelectOption.loadBaseCode(data, code);
};
SelectOption.getHiddendangerType = function getHiddendangerType(code){
    if(code==null)
        return "";
    return SelectOption.getCodeName(SelectOption.getHiddendangerTypeData(),code);
};

/**
 * 警情类别,警情类别分为四种
 *（1.咨询；2.投诉；3.故障；4.报警）
 */
SelectOption.getWarnAlarmTypeData = function getWarnAlarmTypeData() {
    var data=new Array();
    data.push({code:1,name:'咨询'});
    data.push({code:2,name:'投诉'});
    data.push({code:3,name:'故障'});
    data.push({code:4,name:'报警'});
    return data;
};
SelectOption.loadWarnAlarmType = function loadWarnAlarmType(code) {
    var data=SelectOption.getWarnAlarmTypeData();
    SelectOption.loadBaseCode(data, code);
};
SelectOption.getWarnAlarmType = function getWarnAlarmType(code){
    if(code==null)
        return "";
    return SelectOption.getCodeName(SelectOption.getWarnAlarmTypeData(),code);
};

/**
 * 运输工具-日常用途
 * @return
 */
SelectOption.loadUsualUse = function loadUsualUse(code,jsonParam){
	SelectOption.loadBaseCodeFromDB(BASE_URL+"/ems/emsrestranstoolusualuse/loadTransSelect",code,jsonParam);
};

SelectOption.loadRskDic = function loadRskDic(code,jsonParam){
    SelectOption.loadBaseCodeFromDB(BASE_URL+"/dangersource/dssrskdic/loadRskDic",code,jsonParam);
};



/**
 * 隐患来源
 * 0政府巡查 1.自查自报 2.举报 3.临时抽查
 */
SelectOption.getDangerfromData = function getDangerfromData(obj) {
    var data=new Array();
    if (obj == 1) {
    	data.push({code:0,name:'检查'});
    	data.push({code:1,name:'自查'});
	}
    data.push({code:2,name:'举报'});
    data.push({code:3,name:'抽查'});
    return data;
};
SelectOption.loadDangerfrom = function loadDangerfrom(code) {
    var data=SelectOption.getDangerfromData(0);
    SelectOption.loadBaseCode(data, code);
};
SelectOption.getDangerfrom = function getDangerfrom(code){
    if(code==null)
        return "";
    return SelectOption.getCodeName(SelectOption.getDangerfromData(1),code);
};



/**
 * 预案适宜性评审
 * 预案适宜性评审（1.全部能够执行 2 执行过程不够顺利 3 明显不适宜）
 */
SelectOption.getSuitabilityData = function getSuitabilityData() {
    var data=new Array();
    data.push({code:1,name:'全部能够执行'});
    data.push({code:2,name:'执行过程不够顺利'});
    data.push({code:3,name:'明显不适宜'});
    return data;
};
SelectOption.loadSuitability = function loadSuitability(code) {
    var data=SelectOption.getSuitabilityData();
    SelectOption.loadBaseCode(data, code);
};
SelectOption.getSuitability = function getSuitability(code){
    if(code==null)
        return "";
    return SelectOption.getCodeName(SelectOption.getSuitabilityData(),code);
};

/**
 * 预案充分性评审
 * 预案充分性评审（1 完全满足应急要求 2 基本满足需要完善3 不充分 必须修改）
 */
SelectOption.getAdequacyData = function getAdequacyData() {
    var data=new Array();
    data.push({code:1,name:'完全满足应急要求'});
    data.push({code:2,name:'基本满足需要完善'});
    data.push({code:3,name:'不充分,必须修改'});
    return data;
};
SelectOption.loadAdequacy = function loadAdequacy(code) {
    var data=SelectOption.getAdequacyData();
    SelectOption.loadBaseCode(data, code);
};
SelectOption.getAdequacy = function getAdequacy(code){
    if(code==null)
        return "";
    return SelectOption.getCodeName(SelectOption.getAdequacyData(),code);
};

/**
 * 人员到位情况
 * 人员到位情况（1 迅速准确 2 基本按时到位 3 个别人员不到位 4 重点部位人员不到位）
 */
SelectOption.getPersonsituationData = function getPersonsituationData() {
    var data=new Array();
    data.push({code:1,name:'迅速准确'});
    data.push({code:2,name:'基本按时到位'});
    data.push({code:3,name:'个别人员不到位'});
    data.push({code:4,name:'重点部位人员不到位'});
    return data;
};
SelectOption.loadPersonsituation = function loadPersonsituation(code) {
    var data=SelectOption.getPersonsituationData();
    SelectOption.loadBaseCode(data, code);
};
SelectOption.getPersonsituation = function getPersonsituation(code){
    if(code==null)
        return "";
    return SelectOption.getCodeName(SelectOption.getPersonsituationData(),code);
};


/**
 * 职责与操作情况
 * DUTYSITUATION（1 职责明确，操作熟练 2 职责明确，操作不够熟练 3 职责不明，操作不够熟练）
 */
SelectOption.getDutysituationData = function getDutysituationData() {
    var data=new Array();
    data.push({code:1,name:'职责明确，操作熟练'});
    data.push({code:2,name:'职责明确，操作不够熟练'});
    data.push({code:3,name:'职责不明，操作不够熟练'});
    return data;
};
SelectOption.loadDutysituation = function loadDutysituation(code) {
    var data=SelectOption.getDutysituationData();
    SelectOption.loadBaseCode(data, code);
};
SelectOption.getDutysituation = function getDutysituation(code){
    if(code==null)
        return "";
    return SelectOption.getCodeName(SelectOption.getDutysituationData(),code);
};


/**
 * 现场物资到位情况
 * 现场物资到位情况（1 现场物资充分，全部有效 2 现场准备不充分 3 现场物资严重缺乏）
 */
SelectOption.getMetasituationData = function getMetasituationData() {
    var data=new Array();
    data.push({code:1,name:'现场物资充分，全部有效'});
    data.push({code:2,name:'现场准备不充分'});
    data.push({code:3,name:'现场物资严重缺乏'});
    return data;
};
SelectOption.loadMetasituation = function loadMetasituation(code) {
    var data=SelectOption.getMetasituationData();
    SelectOption.loadBaseCode(data, code);
};
SelectOption.getMetasituation = function getMetasituation(code){
    if(code==null)
        return "";
    return SelectOption.getCodeName(SelectOption.getMetasituationData(),code);
};


/**
 * 个人防护情况
 * 个人防护情况（1 全部人员防护到位 2 个别人员防护不到位 3 大部分人员防护不到位）
 */
SelectOption.getProtectsituationData = function getProtectsituationData() {
    var data=new Array();
    data.push({code:1,name:'全部人员防护到位'});
    data.push({code:2,name:'个别人员防护不到位'});
    data.push({code:3,name:'大部分人员防护不到位'});
    return data;
};
SelectOption.loadProtectsituation = function loadProtectsituation(code) {
    var data=SelectOption.getProtectsituationData();
    SelectOption.loadBaseCode(data, code);
};
SelectOption.getProtectsituation = function getProtectsituation(code){
    if(code==null)
        return "";
    return SelectOption.getCodeName(SelectOption.getProtectsituationData(),code);
};


/**
 * 整体组织协调情况
 * 整体组织协调情况（1 准确、高效 2 协调基本顺利，能满足要求 3 效率低，有待改进）
 */
SelectOption.getAllcoordinatesituationData = function getAllcoordinatesituationData() {
    var data=new Array();
    data.push({code:1,name:'准确、高效'});
    data.push({code:2,name:'协调基本顺利，能满足要求'});
    data.push({code:3,name:'效率低，有待改进'});
    return data;
};
SelectOption.loadAllcoordinatesituation = function loadAllcoordinatesituation(code) {
    var data=SelectOption.getAllcoordinatesituationData();
    SelectOption.loadBaseCode(data, code);
};
SelectOption.getAllcoordinatesituation = function getAllcoordinatesituation(code){
    if(code==null)
        return "";
    return SelectOption.getCodeName(SelectOption.getAllcoordinatesituationData(),code);
};

/**
 * 抢险组组织协调情况
 * 抢险组组织协调情况（1 合理、高效 2 基本合理，能完成任务 3 效率低，没有完成任务）
 */
SelectOption.getRescuesituationData = function getRescuesituationData() {
    var data=new Array();
    data.push({code:1,name:'合理、高效'});
    data.push({code:2,name:'基本合理，能完成任务'});
    data.push({code:3,name:'效率低，没有完成任务'});
    return data;
};
SelectOption.loadRescuesituation = function loadRescuesituation(code) {
    var data=SelectOption.getRescuesituationData();
    SelectOption.loadBaseCode(data, code);
};
SelectOption.getRescuesituation = function getRescuesituation(code){
    if(code==null)
        return "";
    return SelectOption.getCodeName(SelectOption.getRescuesituationData(),code);
};

/**
 * 实际效果评价
 * 实际效果评价（1 达到预期目标 2 基本达到目的，部分环节有待改进 3 没有达到目标，须重新演练）
 */
SelectOption.getEvaluationData = function getEvaluationData() {
    var data=new Array();
    data.push({code:1,name:'达到预期目标'});
    data.push({code:2,name:'基本达到目的，部分环节有待改进'});
    data.push({code:3,name:'没有达到目标，须重新演练'});
    return data;
};
SelectOption.loadEvaluation = function loadEvaluation(code) {
    var data=SelectOption.getEvaluationData();
    SelectOption.loadBaseCode(data, code);
};
SelectOption.getEvaluation = function getEvaluation(code){
    if(code==null)
        return "";
    return SelectOption.getCodeName(SelectOption.getEvaluationData(),code);
};

/**
 * 报告上级
 * 报告上级（1 报告及时 2 联系不上）
 */
SelectOption.getReptosupData = function getReptosupData() {
    var data=new Array();
    data.push({code:1,name:'报告及时'});
    data.push({code:2,name:'联系不上'});
    return data;
};
SelectOption.loadReptosup = function loadReptosup(code) {
    var data=SelectOption.getReptosupData();
    SelectOption.loadBaseCode(data, code);
};
SelectOption.getReptosup = function getReptosup(code){
    if(code==null)
        return "";
    return SelectOption.getCodeName(SelectOption.getReptosupData(),code);
};


/**
 * 消防部门
 * 消防部门（1 按要求协作 2 行动迟缓）
 */
SelectOption.getFireorgData = function getFireorgData() {
    var data=new Array();
    data.push({code:1,name:'按要求协作'});
    data.push({code:2,name:'行动迟缓'});
    return data;
};
SelectOption.loadFireorg = function loadFireorg(code) {
    var data=SelectOption.getFireorgData();
    SelectOption.loadBaseCode(data, code);
};
SelectOption.getFireorg = function getFireorg(code){
    if(code==null)
        return "";
    return SelectOption.getCodeName(SelectOption.getFireorgData(),code);
};

/**
 * 周边政府撤离配合
 * 周边政府撤离配合（1 按要求配合 2 不配合）
 */
SelectOption.getEvacoordinationData = function getEvacoordinationData() {
    var data=new Array();
    data.push({code:1,name:'按要求配合'});
    data.push({code:2,name:'不配合'});
    return data;
};
SelectOption.loadEvacoordination = function loadEvacoordination(code) {
    var data=SelectOption.getEvacoordinationData();
    SelectOption.loadBaseCode(data, code);
};
SelectOption.getEvacoordination = function getEvacoordination(code){
    if(code==null)
        return "";
    return SelectOption.getCodeName(SelectOption.getEvacoordinationData(),code);
};




/**
 * 报警渠道
 * 报警渠道（1电话2 短信3 传真4邮件）
 */
SelectOption.getAlarmChannelData = function getAlarmChannelData() {
    var data=new Array();
    data.push({code:1,name:'电话'});
    data.push({code:2,name:'短信'});
    data.push({code:3,name:'传真'});
    data.push({code:4,name:'邮件'});
    return data;
};
SelectOption.loadAlarmChannel = function loadAlarmChannel(code) {
    var data=SelectOption.getAlarmChannelData();
    SelectOption.loadBaseCode(data, code);
};
SelectOption.getAlarmChannel = function getAlarmChannel(code){
    if(code==null)
        return "";
    return SelectOption.getCodeName(SelectOption.getAlarmChannelData(),code);
};


/**
 * 数据传输方式
 * 数据传输方式(1.gprs 2.lora 3.nb)
 */
SelectOption.getTransModeData = function getTransModeData() {
    var data=new Array();
    data.push({code:1,name:'gprs'});
    data.push({code:2,name:'lora'});
    data.push({code:3,name:'nb'});
    return data;
};
SelectOption.loadTransMode = function loadTransMode(code) {
    var data=SelectOption.getTransModeData();
    SelectOption.loadBaseCode(data, code);
};
SelectOption.getTransMode = function getTransMode(code){
    if(code==null)
        return "";
    return SelectOption.getCodeName(SelectOption.getTransModeData(),code);
};

/**
 * 数据算法
 * 数据算法    0.设备自测数据 1.设备自测-算法（设备必须有数） 2.设备自测算法（设备可无数）
 */
SelectOption.getArithmeticData = function getArithmeticData() {
    var data=new Array();
    data.push({code:0,name:'设备自测数据'});
    data.push({code:1,name:'设备自测算法（设备必须有数）'});
    data.push({code:2,name:'设备自测算法（设备可无数）'});
    return data;
};
SelectOption.loadArithmetic = function loadArithmetic(code) {
    var data=SelectOption.getArithmeticData();
    SelectOption.loadBaseCode(data, code);
};
SelectOption.getArithmetic = function getArithmetic(code){
    if(code==null)
        return "";
    return SelectOption.getCodeName(SelectOption.getArithmeticData(),code);
};

/**
 * 设备状态
 * 设备状态(1.正常 2.故障 3.停用）
 */
SelectOption.getDeviceStatusData = function getDeviceStatusData() {
    var data=new Array();
    data.push({code:1,name:'正常'});
    data.push({code:2,name:'故障'});
    data.push({code:3,name:'停用'});
    return data;
};
SelectOption.loadDeviceStatus = function loadDeviceStatus(code) {
    var data=SelectOption.getDeviceStatusData();
    SelectOption.loadBaseCode(data, code);
};
SelectOption.getDeviceStatus = function getDeviceStatus(code){
    if(code==null)
        return "";
    return SelectOption.getCodeName(SelectOption.getDeviceStatusData(),code);
};

/**
 * 所在流域
 * 所在流域（1 海河流域 2 黄河流域 3 淮河流域 4 长江流域）
 */
SelectOption.getRiverCodeData = function getRiverCodeData() {
    var data=new Array();
    data.push({code:1,name:'海河流域'});
    data.push({code:2,name:'黄河流域'});
    data.push({code:3,name:'淮河流域'});
    data.push({code:4,name:'长江流域'});
    return data;
};
SelectOption.loadRiverCode = function loadRiverCode(code) {
    var data=SelectOption.getRiverCodeData();
    SelectOption.loadBaseCode(data, code);
};
SelectOption.getRiverCode = function getRiverCode(code){
    if(code==null)
        return "";
    return SelectOption.getCodeName(SelectOption.getRiverCodeData(),code);
};

/**
 * 产业类别
 * 产业类别(1 第一产业 2 第二产业 3第三产业)
 */
SelectOption.getIndustryClassData = function getIndustryClassData() {
    var data=new Array();
    data.push({code:1,name:'第一产业'});
    data.push({code:2,name:'第二产业'});
    data.push({code:3,name:'第三产业'});
    return data;
};
SelectOption.loadIndustryClass = function loadIndustryClass(code) {
    var data=SelectOption.getIndustryClassData();
    SelectOption.loadBaseCode(data, code);
};
SelectOption.getIndustryClass = function getIndustryClass(code){
    if(code==null)
        return "";
    return SelectOption.getCodeName(SelectOption.getIndustryClassData(),code);
};

/**
 * 产业政策
 * 产业政策(1鼓励 2允许 3政策)
 */
SelectOption.getIndustryPolicyData = function getIndustryPolicyData() {
    var data=new Array();
    data.push({code:1,name:'鼓励'});
    data.push({code:2,name:'允许'});
    data.push({code:3,name:'政策'});
    return data;
};
SelectOption.loadIndustryPolicy = function loadIndustryPolicy(code) {
    var data=SelectOption.getIndustryPolicyData();
    SelectOption.loadBaseCode(data, code);
};
SelectOption.getIndustryPolicy = function getIndustryPolicy(code){
    if(code==null)
        return "";
    return SelectOption.getCodeName(SelectOption.getIndustryPolicyData(),code);
};



/**
 * 许可证类型
 * 许可证类型(1.正式2.临时）
 */
SelectOption.getLicenceTypeData = function getLicenceTypeData() {
    var data=new Array();
    data.push({code:1,name:'正式'});
    data.push({code:2,name:'临时'});
    return data;
};
SelectOption.loadLicenceType = function loadLicenceType(code) {
    var data=SelectOption.getLicenceTypeData();
    SelectOption.loadBaseCode(data, code);
};
SelectOption.getLicenceType = function getLicenceType(code){
    if(code==null)
        return "";
    return SelectOption.getCodeName(SelectOption.getLicenceTypeData(),code);
};

/**
 * 敏感点类别
 * 负荷等级((1.空气 2.水 3.噪声 4.环境风险)
 */
SelectOption.getSensitiveTypeData = function getSensitiveTypeData() {
    var data=new Array();
    data.push({code:1,name:'空气'});
    data.push({code:2,name:'水'});
    data.push({code:3,name:'噪声'});
    data.push({code:4,name:'环境风险'});
    return data;
};
SelectOption.loadSensitiveType = function loadSensitiveType(code) {
    var data=SelectOption.getSensitiveTypeData();
    SelectOption.loadBaseCode(data, code);
};
SelectOption.getSensitiveType = function getSensitiveType(code){
    if(code==null)
        return "";
    return SelectOption.getCodeName(SelectOption.getSensitiveTypeData(),code);
};

/**
 * 负荷等级
 * 负荷等级(1.一级 2.二级 3.三级)
 */
SelectOption.getLoadlevelData = function getLoadlevelData() {
    var data=new Array();
    data.push({code:1,name:'一级'});
    data.push({code:2,name:'二级'});
    data.push({code:3,name:'三级'});
    return data;
};
SelectOption.loadLoadlevel = function loadLoadlevel(code) {
    var data=SelectOption.getLoadlevelData();
    SelectOption.loadBaseCode(data, code);
};
SelectOption.getLoadlevel = function getLoadlevel(code){
    if(code==null)
        return "";
    return SelectOption.getCodeName(SelectOption.getLoadlevelData(),code);
};

/**
 * 监测监控设备是否可见
 * 状态（0可见 1不可见）
 */
SelectOption.getEqVisibleData = function getEqVisibleData() {
    var data=new Array();
    data.push({code:0,name:'可见'});
    data.push({code:1,name:'不可见'});
    return data;
};
SelectOption.loadEqVisible = function loadEqVisible(code) {
    var data=SelectOption.getEqVisibleData();
    SelectOption.loadBaseCode(data, code);
};
SelectOption.getEqVisible = function getEqVisible(code){
    if(code==null)
        return "";
    return SelectOption.getCodeName(SelectOption.getEqVisibleData(),code);
};


/**
 * 是否上报备案
 * 状态（0未上报 1已上报 2已备案）
 */
SelectOption.getIsreportData = function getIsreportData() {
    var data=new Array();
    data.push({code:0,name:'未上报'});
    data.push({code:1,name:'已上报'});
    data.push({code:2,name:'已备案'});
    return data;
};
SelectOption.loadIsreport = function loadIsreport(code) {
    var data=SelectOption.getEquipmenttypeData();
    SelectOption.loadBaseCode(data, code);
};
SelectOption.getIsreport = function getIsreport(code){
    if(code==null)
        return "";
    return SelectOption.getCodeName(SelectOption.getIsreportData(),code);
};

/**
 * 维修方式
 * 状态（0维修 1.整机更换 2.更换零部件）
 */
SelectOption.getMaintiantypeData = function getMaintiantypeData() {
    var data=new Array();
    data.push({code:0,name:'维修'});
    data.push({code:1,name:'整机更换'});
    data.push({code:2,name:'更换零部件'});
    return data;
};
SelectOption.loadMaintiantype = function loadMaintiantype(code) {
    var data=SelectOption.getMaintiantypeData();
    SelectOption.loadBaseCode(data, code);
};
SelectOption.getMaintiantype=function getMaintiantype(code){
    if(code==null)
        return "";
    return SelectOption.getCodeName(SelectOption.getMaintiantypeData(),code);
};

/**
 * 设备类型
 * 状态（0摄像头1监测探头）
 */
SelectOption.getEquipmenttypeData = function getEquipmenttypeData() {
    var data=new Array();
    data.push({code:0,name:'摄像头'});
    data.push({code:1,name:'监测探头'});
    return data;
};
SelectOption.loadEquipmenttype = function loadEquipmenttype(code) {
    var data=SelectOption.getEquipmenttypeData();
    SelectOption.loadBaseCode(data, code);
};
SelectOption.getEquipmenttype=function getEquipmenttype(code){
    if(code==null)
        return "";
    return SelectOption.getCodeName(SelectOption.getEquipmenttypeData(),code);
};


/**
 * 排查方式
 * 状态（0企业自查1政府巡查）
 */
SelectOption.getIsGovData = function getIsGovData() {
    var data=new Array();
    data.push({code:0,name:'企业自查'});
    data.push({code:1,name:'政府巡查'});
    return data;
};
SelectOption.loadIsGov = function loadIsGov(code) {
    var data=SelectOption.getIsGovData();
    SelectOption.loadBaseCode(data, code);
};
SelectOption.getIsGov=function getIsGov(code){
    if(code==null)
        return "";
    return SelectOption.getCodeName(SelectOption.getIsGovData(),code);
};


/**
 * 整改状态
 * 状态（0不通过1通过）
 */
SelectOption.getRecheckStateData = function getRecheckStateData() {
    var data=new Array();
    data.push({code:0,name:'不通过'});
    data.push({code:1,name:'通过'});
    return data;
};
SelectOption.loadRecheckState = function loadRecheckState(code) {
    var data=SelectOption.getRecheckStateData();
    SelectOption.loadBaseCode(data, code);
};
SelectOption.getRecheckState=function getRecheckState(code){
    if(code==null)
        return "";
    return SelectOption.getCodeName(SelectOption.getRecheckStateData(),code);
};

/**
 * 整改状态
 * 状态（0不通过1通过）
 */
SelectOption.getReformStateData = function getReformStateData() {
    var data=new Array();
    data.push({code:0,name:'待复查'});
    data.push({code:1,name:'通过'});
    data.push({code:2,name:'不通过'});
    return data;
};
SelectOption.loadReformState = function loadReformState(code) {
    var data=SelectOption.getReformStateData();
    SelectOption.loadBaseCode(data, code);
};
SelectOption.getReformState=function getReformState(code){
    if(code==null)
        return "";
    return SelectOption.getCodeName(SelectOption.getReformStateData(),code);
};

/**
 * 整改方式
 * 状态（0限期整改1立即整改2停产停业整改）
 */
SelectOption.getReformTypeData = function getReformTypeData() {
    var data=new Array();
    data.push({code:0,name:'限期整改'});
    data.push({code:1,name:'立即整改'});
    data.push({code:2,name:'停产停业整改'});
    return data;
};
SelectOption.loadReformType = function loadReformType(code) {
    var data=SelectOption.getReformTypeData();
    SelectOption.loadBaseCode(data, code);
};
SelectOption.getReformType=function getReformType(code){
    if(code==null)
        return "";
    return SelectOption.getCodeName(SelectOption.getReformTypeData(),code);
};

/**
 * 隐患状态
 * 状态（0无效 1已过期 2待核查 3待整改 4待复查 5待核销 6已核销）
 */
SelectOption.getHiddangerstateData = function getHiddangerstateData() {
    var data=new Array();
    data.push({code:1,name:'已过期'});
    data.push({code:3,name:'未整改'});
    data.push({code:4,name:'未复查'});
    data.push({code:5,name:'未核销'});
    data.push({code:6,name:'已核销'});
    return data;
};
SelectOption.loadHiddangerstate = function loadHiddangerstate(code) {
    var data=SelectOption.getHiddangerstateData();
    SelectOption.loadBaseCode(data, code);
};
SelectOption.getHiddangerstate=function getHiddangerstate(code){
    if(code==null)
        return "";
    return SelectOption.getCodeName(SelectOption.getHiddangerstateData(),code);
};

/**
 * 隐患级别
 * 状态（0：无隐患 1：一般隐患 2:重大隐患）
 */
SelectOption.getDangerlevelData = function getDangerlevelData() {
    var data=new Array();
    data.push({code:0,name:'无隐患'});
    data.push({code:1,name:'一般隐患'});
    data.push({code:2,name:'重大隐患'});
    return data;
};
SelectOption.loadDangerlevel = function loadDangerlevel(code) {
    var data=SelectOption.getDangerlevelData();
    SelectOption.loadBaseCode(data, code);
};
SelectOption.getDangerlevel=function getDangerlevel(code){
    if(code==null)
        return "";
    return SelectOption.getCodeName(SelectOption.getDangerlevelData(),code);
};

/**
 * 场所类别
 * @return
 */
SelectOption.loadPlaceType = function loadPlaceType(code,jsonParam){
	SelectOption.loadBaseCodeFromDB(BASE_URL+"ems/codeemssucplacetype/loadPlaceTypeSelect",code,jsonParam);
};

/**
 * 危险化工工艺
 */
SelectOption.getCheprocessData = function getCheprocessData() {
    var data=new Array();
    data.push({code:"01",name:'光气及光气化工艺'});
    data.push({code:"02",name:'电解工艺(氯碱)'});
    data.push({code:"03",name:'氯化工艺'});
    data.push({code:"04",name:'硝化工艺'});
    data.push({code:"05",name:'合成氨工艺'});
    data.push({code:"06",name:'裂解(裂化)工艺'});
    data.push({code:"07",name:'氯化工艺'});
    data.push({code:"08",name:'加氢工艺'});
    data.push({code:"09",name:'重氮化工艺'});
    data.push({code:"10",name:'氧化工艺'});
    data.push({code:"11",name:'过氧化工艺'});
    data.push({code:"12",name:'胺基化工艺'});
    data.push({code:"13",name:'磺化工艺'});
    data.push({code:"14",name:'聚合工艺'});
    data.push({code:"15",name:'烷基化工艺'});
    data.push({code:"16",name:'不涉及'});
    return data;
};
SelectOption.loadCheprocess = function loadCheprocess(code) {
    var data=SelectOption.getCheprocessData();
    SelectOption.loadBaseCode(data, code);
};
SelectOption.getCheprocess=function getCheprocess(code){
    if(code==null)
        return "";
    return SelectOption.getCodeName(SelectOption.getCheprocessData(),code);
};

SelectOption.getCheprocessMul=function getCheprocessMul(code){
    if(code==null)
        return "";
    var codes = code.split(",");
    var codename = "";
    for (i=0;i<codes.length ;i++ )
    {
        codename+=SelectOption.getCodeName(SelectOption.getCheprocessData(),codes[i])+"\n";
    }
    return codename;
};

/**
 * 危化品储存介质
 * 状态（0：其他 1：仓库 2:储罐）
 */
SelectOption.getStoragemediumData = function getStoragemediumData() {
    var data=new Array();
    data.push({code:0,name:'其他'});
    data.push({code:1,name:'仓库'});
    data.push({code:2,name:'储罐'});
    return data;
};
SelectOption.loadStoragemedium = function loadStoragemedium(code) {
    var data=SelectOption.getStoragemediumData();
    SelectOption.loadBaseCode(data, code);
};
SelectOption.getStoragemedium=function getStoragemedium(code){
    if(code==null)
        return "";
    return SelectOption.getCodeName(SelectOption.getStoragemediumData(),code);
};




/**
 * 交接状态
 * 状态（0：正常交接 1：交接异常）
 */
SelectOption.getChangeStateData = function getChangeStateData() {
    var data=new Array();
    data.push({code:0,name:'正常交接'});
    data.push({code:1,name:'交接异常'});
    return data;
};
SelectOption.loadChangeState = function loadChangeState(code) {
    var data=SelectOption.getChangeStateData();
    SelectOption.loadBaseCode(data, code);
};
SelectOption.getChangeState=function getChangeState(code){
    if(code==null)
        return "";
    return SelectOption.getCodeName(SelectOption.getChangeStateData(),code);
};


/**
 * 危险化学品类型
 */
SelectOption.getChemicalTypeData = function getChemicalTypeData() {
    var data=new Array();
    data.push({code:"1",name:'许可企业'});
    data.push({code:"2",name:'无需许可的使用危化品企业（啤机）'});
    data.push({code:"3",name:'生产许可'});
    data.push({code:"4",name:'经营许可'});
    data.push({code:"5",name:'运输许可'});
    data.push({code:"6",name:'使用许可'});
    data.push({code:"7",name:'废弃物处置许可'});
    data.push({code:"8",name:'港口（交委）'});
    data.push({code:"9",name:'燃气（住建）'});
    data.push({code:"10",name:'其他危化品（安监）'});
    data.push({code:"11",name:'经营性运输'});
    data.push({code:"12",name:'非经营性运输'});
    data.push({code:"13",name:'仓储经营'});
    data.push({code:"14",name:'其它'});
    data.push({code:"15",name:'仓储经营'});
    data.push({code:"16",name:'其它'});
    data.push({code:"17",name:'成品油'});
    data.push({code:"18",name:'瓶装工业气体'});
    data.push({code:"19",name:'仓储经营'});
    data.push({code:"20",name:'其他'});
    data.push({code:"21",name:'油库'});
    data.push({code:"22",name:'加油站'});
    data.push({code:"23",name:'批发'});
    data.push({code:"24",name:'带储存设施'});
    data.push({code:"25",name:'不带储存设施'});
    return data;
};
SelectOption.loadChemicalType = function loadChemicalType(code) {
    var data=SelectOption.getChemicalTypeData();
    SelectOption.loadBaseCode(data, code);
};
SelectOption.getChemicalType=function getChemicalType(code){
    if(code==null)
        return "";
    return SelectOption.getCodeName(SelectOption.getChemicalTypeData(),code);
};
SelectOption.getChemicalTypeMul=function getChemicalTypeMul(code){
    if(code==null)
        return "";
    var codes = code.split(",");
    var codename = "";
    for (i=0;i<codes.length ;i++ )
    {
        codename+=SelectOption.getCodeName(SelectOption.getChemicalTypeData(),codes[i])+"\n";
    }
    return codename;
};


/**
 * 危险设备
 */
SelectOption.getDanequipTypeData = function getDanequipTypeData() {
    var data=new Array();
    data.push({code:"01",name:'冲剪压机械'});
    data.push({code:"02",name:'冲剪压设备模切压痕机（啤机）'});
    data.push({code:"03",name:'注塑机械'});
    data.push({code:"04",name:'冲剪压设备'});
    data.push({code:"05",name:'金属切削机械'});
    data.push({code:"06",name:'木工机械'});
    data.push({code:"07",name:'建筑施工机械'});
    data.push({code:"08",name:'其他'});
    data.push({code:"09",name:'砂轮机'});
    data.push({code:"10",name:'电焊机'});
    data.push({code:"11",name:'皮带运输机'});
    data.push({code:"12",name:'手持电动工具和移动电器设备'});
    return data;
};
SelectOption.loadDanequipType = function loadDanequipType(code) {
    var data=SelectOption.getDanequipTypeData();
    SelectOption.loadBaseCode(data, code);
};
SelectOption.getDanequipType=function getDanequipType(code){
    if(code==null)
        return "";
    return SelectOption.getCodeName(SelectOption.getDanequipTypeData(),code);
};
SelectOption.getDanequipTypeMul=function getDanequipTypeMul(code){
    if(code==null)
        return "";
    var codes = code.split(",");
    var codename = "";
    for (i=0;i<codes.length ;i++ )
    {
        codename+=SelectOption.getCodeName(SelectOption.getDanequipTypeData(),codes[i])+"\n";
    }
    return codename;
};


/**
 * 特种设备
 */
SelectOption.getSpeequipTypeData = function getSpeequipTypeData() {
    var data=new Array();
    data.push({code:"01",name:'锅炉'});
    data.push({code:"02",name:'压力容器'});
    data.push({code:"03",name:'压力管道'});
    data.push({code:"04",name:'电梯'});
    data.push({code:"05",name:'起重机械'});
    data.push({code:"06",name:'客运索道'});
    data.push({code:"07",name:'大型游乐设施'});
    data.push({code:"08",name:'场（厂）内专用机动车辆'});
    return data;
};
SelectOption.loadSpeequipType = function loadSpeequipType(code) {
    var data=SelectOption.getSpeequipTypeData();
    SelectOption.loadBaseCode(data, code);
};
SelectOption.getSpeequipType=function getSpeequipType(code){
    if(code==null)
        return "";
    return SelectOption.getCodeName(SelectOption.getSpeequipTypeData(),code);
};
SelectOption.getSpeequipTypeMul=function getSpeequipTypeMul(code){
    if(code==null)
        return "";
    var codes = code.split(",");
    var codename = "";
    for (i=0;i<codes.length ;i++ )
    {
        codename+=SelectOption.getCodeName(SelectOption.getSpeequipTypeData(),codes[i])+"\n";
    }
    return codename;
};


/**
 * 课程分类
 * 审核结果（01：初级 02：中级 03:高级）
 */
SelectOption.getFileTypeData = function getFileTypeData() {
    var data=new Array();
    data.push({code:1,name:'照片'});
    data.push({code:2,name:'视频'});
    data.push({code:3,name:'资料'});
    return data;
};
SelectOption.loadFileType = function loadFileType(code) {
    var data=SelectOption.getFileTypeData();
    SelectOption.loadBaseCode(data, code);
};
SelectOption.getFileType=function getFileType(code){
    if(code==null)
        return "";
    return SelectOption.getCodeName(SelectOption.getFileTypeData(),code);
};

/**
 * 建议措施审核状态
 * 审核结果（1：审核同意 2：审核不同意）
 */
SelectOption.getTrainTypeResultData = function getTrainTypeResultData() {
    var data=new Array();
    data.push({code:1,name:'在线培训'});
    data.push({code:2,name:'会议培训'});
    data.push({code:3,name:'在线视频'});
    return data;
};
SelectOption.loadTrainTypeResult = function loadTrainTypeResult(code) {
    var data=SelectOption.getTrainTypeResultData();
    SelectOption.loadBaseCode(data, code);
};
SelectOption.getTrainTypeResult=function getTrainTypeResult(code){
    if(code==null)
        return "";
    return SelectOption.getCodeName(SelectOption.getTrainTypeResultData(),code);
};

/**
 * 监测监控监测类型
 * 监测类型（1：审核同意 2：审核不同意）
 */
SelectOption.getMonitorGatherTypeResultData = function getMonitorGatherTypeResultData() {
    var data=new Array();
    data.push({code:1,name:'可燃气体'});
    data.push({code:2,name:'温度'});
    data.push({code:3,name:'压力'});
    data.push({code:4,name:'液位'});
    data.push({code:5,name:'特殊气体'});
    data.push({code:6,name:'有毒气体'});
    return data;
};
SelectOption.loadMonitorGatherTypeResult = function loadMonitorGatherTypeResult(code) {
    var data=SelectOption.getMonitorGatherTypeResultData();
    SelectOption.loadBaseCode(data, code);
};
SelectOption.getMonitorGatherTypeResult=function getMonitorGatherTypeResult(code){
    if(code==null)
        return "";
    return SelectOption.getCodeName(SelectOption.getMonitorGatherTypeResultData(),code);
};



/**
 * 课程分类
 * 审核结果（01：初级 02：中级 03:高级）
 */
SelectOption.getCourseTypeData = function getCourseTypeData() {
    var data=new Array();
    data.push({code:"01",name:'初级'});
    data.push({code:"02",name:'中级'});
    data.push({code:"03",name:'高级'});
    return data;
};
SelectOption.loadCourseType = function loadCourseType(code) {
    var data=SelectOption.getCourseTypeData();
    SelectOption.loadBaseCode(data, code);
};
SelectOption.getCourseType=function getCourseType(code){
    if(code==null)
        return "";
    return SelectOption.getCodeName(SelectOption.getCourseTypeData(),code);
};

/**
 * 消息提醒
 * 消息状态（01：未读 02：已读）
 */
SelectOption.getRemindStateData = function getRemindState() {
    var data=new Array();
    data.push({code:1,name:'未读'});
    data.push({code:0,name:'已读'});
    return data;
};
SelectOption.loadRemindState = function loadRemindState(code) {
    var data=SelectOption.getRemindStateData();
    SelectOption.loadBaseCode(data, code);
};
SelectOption.getRemindState=function getRemindState(code){
    if(code==null)
        return "";
    return SelectOption.getCodeName(SelectOption.getRemindStateData(),code);
};

/**
 * 建议措施审核状态
 * 审核结果（1：审核同意 2：审核不同意）
 */
SelectOption.getSugAuditResultData = function getSugAuditResultData() {
    var data=new Array();
    data.push({code:1,name:'通过'});
    data.push({code:0,name:'不通过'});
    return data;
};
SelectOption.loadSugAuditResult = function loadSugAuditResult(code) {
    var data=SelectOption.getSugAuditResultData();
    SelectOption.loadBaseCode(data, code);
};
SelectOption.getSugAuditResult=function getSugAuditResult(code){
    if(code==null)
        return "";
    return SelectOption.getCodeName(SelectOption.getSugAuditResultData(),code);
};

/**
 * 复议诉讼状态
 * @return
 */
SelectOption.getLawSuitStatusData = function getLawSuitStatusData() {
	var data=new Array();
	data.push({code:0,name:'受理'});
	data.push({code:1,name:'审核'});
	data.push({code:2,name:'复审'});
	data.push({code:3,name:'审批'});
	return data;
};

SelectOption.loadLawSuitStatus = function loadLawSuitStatus(code) {
	var data=SelectOption.getLawSuitStatusData();
	SelectOption.loadBaseCode(data, code);
};

SelectOption.getLawSuitStatus=function getLawSuitStatus(code){
	return SelectOption.getCodeName(SelectOption.getLawSuitStatusData(),code);
};

/**
 * 菜单级别
 * @return
 */
SelectOption.getPrivLevelData = function getPrivLevelData() {
	var data=new Array();
	data.push({code:1,name:'一级菜单'});
	data.push({code:2,name:'二级菜单'});
	data.push({code:3,name:'三级菜单'});
	return data;
};

SelectOption.loadPrivLevel = function loadPrivLevel(code) {
	var data=SelectOption.getPrivLevelData();
	SelectOption.loadBaseCode(data, code);
};

SelectOption.getPrivLevel=function getPrivLevel(code){
	return SelectOption.getCodeName(SelectOption.getPrivLevelData(),code);
};

/**
 * 行政区域级别
 * @return
 */
SelectOption.getDistrictLevelData = function getDistrictLevelData(){
	var data=new Array();
	data.push({code:1,name:'区县'});
	data.push({code:2,name:'街道办'});
	data.push({code:3,name:'社区居委会'});
	return data;
};

SelectOption.loadDistrictLevel = function loadDistrictLevel(code){
	var data=SelectOption.getDistrictLevelData();
	SelectOption.loadBaseCode(data, code);
};

SelectOption.getDistrictLevel = function getDistrictLevel(code){
	return SelectOption.getCodeName(SelectOption.getDistrictLevelData(),code);
};


/**
 * 行政区域(市、区县、街道办、社区)
 * @return
 */
SelectOption.loadDistrict = function loadDistrict(code,jsonParam){
	SelectOption.loadBaseCodeFromDB(BASE_URL+"/system/sysdistrict/loadDistrictSelect",code,jsonParam);
};

/**
 * 系统部门树
 * @return
 */
SelectOption.loadSysDepart = function loadSysDepart(code,jsonParam){
	SelectOption.loadBaseCodeFromDB(BASE_URL+"/system/sysdepart/departtree",code,jsonParam);
};

/**
 * 行政执法部门
 * @return
 */
SelectOption.loadLawDept = function loadLawDept(code,jsonParam){
	SelectOption.loadBaseCodeFromDB(BASE_URL+"/law/lawdept/lawdeptselect",code,jsonParam);
};

/**
 * 医疗机构级别
 * @return
 */
SelectOption.loadLevel = function loadLevel(code,jsonParam){
	SelectOption.loadBaseCodeFromDB(BASE_URL+"/ems/codebaslevel/levelselect",code,jsonParam);
};

/**
 * 医疗机构级别
 * @return
 */
SelectOption.loadSecrecyclass = function loadSecrecyclass(code,jsonParam){
	SelectOption.loadBaseCodeFromDB(BASE_URL+"/ems/codebassecrecyclass/secrecyclassSelect",code,jsonParam);
};

/**
 * 医疗机构级别
 * @return
 */
SelectOption.loadHospitalGrade = function loadHospitalGrade(code,jsonParam){
	SelectOption.loadBaseCodeFromDB(BASE_URL+"/ems/codebashospitalgrade/hospitalgradeSelect",code,jsonParam);
};

/**
 * 应急专家-专家类别
 * @return
 */
SelectOption.loadExpertType = function loadExpertType(code,jsonParam){
	SelectOption.loadBaseCodeFromDB(BASE_URL+"/ems/emsresexpert/expertypeselect",code,jsonParam);
};

/**
 * 应急专家-专家类别接口
 * @return
 */
SelectOption.loadExpertTypes = function loadExpertTypes(code,jsonParam){
	SelectOption.loadBaseCodeFromDB(BASE_URL+"/mobile/emscountapi/expertypeselect",code,jsonParam);
};

/**
 * 应急专家-专业领域
 * @return
 */
SelectOption.loadMajorField = function loadMajorField(code,jsonParam){
	SelectOption.loadBaseCodeFromDB(BASE_URL+"/ems/emsresexpert/majorfieldselect",code,jsonParam);
};


/**
 * 应急专家-专业领域接口
 * @return
 */
SelectOption.loadMajorFields = function loadMajorFields(code,jsonParam){
	SelectOption.loadBaseCodeFromDB(BASE_URL+"/mobile/emscountapi/majorfieldselect",code,jsonParam);
};
/**
 * 系统管理中执法人员
 * @return
 */
SelectOption.loadSysUser = function loadSysUser(code,jsonParam){
	var url = "/system/govuser/departuserselect";
	SelectOption.loadBaseCodeFromDB(BASE_URL+url,code,jsonParam);
};

/**
 * 提交审批领导
 */
SelectOption.loadLeaderUser = function loadLeaderUser(code,jsonParam){
	var url = "/system/sysuser/leaderuserselect";
	SelectOption.loadBaseCodeFromDB(BASE_URL+url,code,jsonParam);
};

/**
 * 执法人员
 * @return
 */
SelectOption.loadLawUser = function loadLawUser(code,jsonParam){
	var url = "/law/lawuser/lawuserselect";
	SelectOption.loadBaseCodeFromDB(BASE_URL+url,code,jsonParam);
};


/**
 * 隐患信息
 * @return
 */
SelectOption.LoadLawDanger = function LoadLawDanger(code,jsonParam){
	SelectOption.loadBaseCodeFromDB(BASE_URL+"/law/lawdangerinfo/lawdangerselect",code,jsonParam);
};

/**
 * 执法计划
 * @return
 */
SelectOption.loadLawPlan = function loadLawPlan(code,jsonParam){
	SelectOption.loadBaseCodeFromDB(BASE_URL+"/law/lawplan/lawplanselect",code,jsonParam);
};

/**
 * 执法依据类型
 * @return
 */
SelectOption.loadLawBasisType = function loadLawBasisType(code,jsonParam){
	SelectOption.loadBaseCodeFromDB(BASE_URL+"/law/lawbasistype/selectOption",code,jsonParam);
};
/**
 *物资设备大类 
 */
SelectOption.loadEquiptypemax = function loadEquiptypemax(code,jsonParam){
    SelectOption.loadBaseCodeFromDB(BASE_URL+"/ems/emsresmaterial/selectMaterialMax",code,jsonParam);
};
/**
 *物资设备小类 
 */
SelectOption.loadEquiptypemin = function loadEquiptypemin(code,jsonParam){
    SelectOption.loadBaseCodeFromDB(BASE_URL+"/ems/emsresmaterial/selectMaterialMin",code,jsonParam);
};


/**
 * 性别
 * @return
 */
SelectOption.getSexData = function getSexData() {
	var data=new Array();
	data.push({code:0,name:'男'});
	data.push({code:1,name:'女'});
	return data;
};
SelectOption.loadSex = function loadSex(code) {
	var data=SelectOption.getSexData();
	SelectOption.loadBaseCode(data, code);
};
SelectOption.getSex=function getSex(code){
	return SelectOption.getCodeName(SelectOption.getSexData(),code);
};

/**
 * 用户类型
 * @return
 */
SelectOption.getUserTypeData = function getUserTypeData() {
	var data=new Array();
	data.push({code:'SYS',name:'系统'});
	data.push({code:'GOV',name:'政府'});
	data.push({code:'ENT',name:'企业'});
	return data;
};
SelectOption.loadUserType = function loadUserType(code) {
	var data=SelectOption.getUserTypeData();
	SelectOption.loadBaseCode(data, code);
};
SelectOption.getUserType=function getUserType(code){
	if(code==null)
		return "";
	return SelectOption.getCodeName(SelectOption.getUserTypeData(),code);
};


/**
 * 年份
 * @return
 */
SelectOption.getNowYearData = function getNowYearData() {
	var curYear = new Date().getFullYear();
	var data=new Array();
	data.push({code:curYear-2,name:curYear-2});
	data.push({code:curYear-1,name:curYear-1});
	data.push({code:curYear,name:curYear});
	data.push({code:curYear+1,name:curYear+1});
	data.push({code:curYear+2,name:curYear+2});
	return data;
};
SelectOption.loadNowYear = function loadNowYear(code) {
	var data=SelectOption.getNowYearData();
	SelectOption.loadBaseCode(data, code);
};
SelectOption.getNowYear=function getNowYear(code){
	if(code==null)
		return "";
	return SelectOption.getCodeName(SelectOption.getNowYearData(),code);
};

/**
 * 民族
 * @return
 */
SelectOption.getNationData = function getNationData() {
	var data=new Array();
	data.push({code:'汉族',name:'汉族'});
	data.push({code:'壮族',name:'壮族'});
	data.push({code:'满族',name:'满族'});
	data.push({code:'回族',name:'回族'});
	data.push({code:'苗族',name:'苗族'});
	data.push({code:'维吾尔族',name:'维吾尔族'});
	data.push({code:'土家族',name:'土家族'});
	data.push({code:'彝族',name:'彝族'});
	data.push({code:'蒙古族',name:'蒙古族'});
	data.push({code:'藏族',name:'藏族'});
	data.push({code:'布依族',name:'布依族'});
	data.push({code:'侗族',name:'侗族'});
	data.push({code:'瑶族',name:'瑶族'});
	data.push({code:'朝鲜族',name:'朝鲜族'});
	data.push({code:'白族',name:'白族'});
	data.push({code:'哈尼族',name:'哈尼族'});
	data.push({code:'哈萨克族',name:'哈萨克族'});
	data.push({code:'黎族',name:'黎族'});
	data.push({code:'傣族',name:'傣族'});
	data.push({code:'畲族',name:'畲族'});
	data.push({code:'傈僳族',name:'傈僳族'});
	data.push({code:'仡佬族',name:'仡佬族'});
	data.push({code:'东乡族',name:'东乡族'});
	data.push({code:'高山族',name:'高山族'});
	data.push({code:'拉祜族',name:'拉祜族'});
	data.push({code:'水族',name:'水族'});
	data.push({code:'佤族',name:'佤族'});
	data.push({code:'纳西族',name:'纳西族'});
	data.push({code:'羌族',name:'羌族'});
	data.push({code:'土族',name:'土族'});
	data.push({code:'仫佬族',name:'仫佬族'});
	data.push({code:'锡伯族',name:'锡伯族'});
	data.push({code:'柯尔克孜族',name:'柯尔克孜族'});
	data.push({code:'达斡尔族',name:'达斡尔族'});
	data.push({code:'景颇族',name:'景颇族'});
	data.push({code:'毛南族',name:'毛南族'});
	data.push({code:'撒拉族',name:'撒拉族'});
	data.push({code:'布朗族',name:'布朗族'});
	data.push({code:'塔吉克族',name:'塔吉克族'});
	data.push({code:'阿昌族',name:'阿昌族'});
	data.push({code:'普米族',name:'普米族'});
	data.push({code:'鄂温克族',name:'鄂温克族'});
	data.push({code:'怒族',name:'怒族'});
	data.push({code:'京族',name:'京族'});
	data.push({code:'基诺族',name:'基诺族'});
	data.push({code:'德昂族',name:'德昂族'});
	data.push({code:'保安族',name:'保安族'});
	data.push({code:'俄罗斯族',name:'俄罗斯族'});
	data.push({code:'裕固族',name:'裕固族'});
	data.push({code:'乌孜别克族',name:'乌孜别克族'});
	data.push({code:'门巴族',name:'门巴族'});
	data.push({code:'鄂伦春族',name:'鄂伦春族'});
	data.push({code:'独龙族',name:'独龙族'});
	data.push({code:'塔塔尔族',name:'塔塔尔族'});
	data.push({code:'赫哲族',name:'赫哲族'});
	data.push({code:'珞巴族',name:'珞巴族'});
	return data;
};
SelectOption.loadNation = function loadNowYear(code) {
	var data=SelectOption.getNationData();
	SelectOption.loadBaseCode(data, code);
};
SelectOption.getNation=function getNation(code){
	if(code==null)
		return "";
	return SelectOption.getCodeName(SelectOption.getNationData(),code);
};

/**
 * 技术职称
 * @return
 */
SelectOption.getTechnicalData = function getTechnicalData() {
	var data=new Array();
	data.push({code:'01',name:'高工'});
	data.push({code:'02',name:'教授级高工'});
	data.push({code:'03',name:'教授'});
	data.push({code:'04',name:'副教授'});
	data.push({code:'05',name:'院长'});
	data.push({code:'06',name:'研究员'});
	data.push({code:'07',name:'副研究员'});
	data.push({code:'08',name:'其他'});
	return data;
};
SelectOption.loadTechnical = function loadTechnical(code) {
	var data=SelectOption.getTechnicalData();
	SelectOption.loadBaseCode(data, code);
};
SelectOption.getTechnical=function getTechnical(code){
	if(code==null)
		return "";
	return SelectOption.getCodeName(SelectOption.getTechnicalData(),code);
};

/**
 * 政治面貌
 * @return
 */
SelectOption.getPoliticsData = function getPoliticsData() {
	var data=new Array();
	data.push({code:'01',name:'中共党员'});
	data.push({code:'02',name:'中共预备党员'});
	data.push({code:'03',name:'共青团员'});
	data.push({code:'04',name:'民革党员'});
	data.push({code:'05',name:'民盟盟员'});
	data.push({code:'06',name:'民建会员'});
	data.push({code:'07',name:'民进会员'});
	data.push({code:'08',name:'农工党党员'});
	data.push({code:'09',name:'致公党党员'});
	data.push({code:'10',name:'九三学社社员'});
	data.push({code:'11',name:'台盟盟员'});
	data.push({code:'12',name:'无党派人士'});
	data.push({code:'13',name:'群众'});
	return data;
};
SelectOption.loadPolitics = function loadPolitics(code) {
	var data=SelectOption.getPoliticsData();
	SelectOption.loadBaseCode(data, code);
};
SelectOption.getPolitics=function getPolitics(code){
	if(code==null)
		return "";
	return SelectOption.getCodeName(SelectOption.getPoliticsData(),code);
};

/**
 * 健康状况
 * @return
 */
SelectOption.getHealthData = function getHealthData() {
	var data=new Array();
	data.push({code:'1',name:'健康或良好'});
	data.push({code:'2',name:'一般或较弱'});
	data.push({code:'3',name:'有慢性病'});
	data.push({code:'4',name:'有生理缺陷'});
	data.push({code:'5',name:'残废'});
	return data;
};
SelectOption.loadHealth = function loadHealth(code) {
	var data=SelectOption.getHealthData();
	SelectOption.loadBaseCode(data, code);
};
SelectOption.getHealth=function getHealth(code){
	if(code==null)
		return "";
	return SelectOption.getCodeName(SelectOption.getHealthData(),code);
};

/**
 * 专家级别
 * @return
 */
SelectOption.getExpertLevelData = function getExpertLevelData() {
	var data=new Array();
	data.push({code:'1',name:'企业级'});
	data.push({code:'2',name:'县区级'});
	data.push({code:'3',name:'地区/市级'});
	data.push({code:'4',name:'省级'});
	data.push({code:'5',name:'国家级'});
	return data;
};
SelectOption.loadExpertLevel = function loadExpertLevel(code) {
	var data=SelectOption.getExpertLevelData();
	SelectOption.loadBaseCode(data, code);
};
SelectOption.getExpertLevel=function getExpertLevel(code){
	if(code==null)
		return "";
	return SelectOption.getCodeName(SelectOption.getExpertLevelData(),code);
};

/**
 * 预案模板-模板类型
 * @return
 */
SelectOption.getTemplateTypeData = function getTemplateTypeData() {
	var data=new Array();
	data.push({code:'1',name:'总体应急预案模板'});
	data.push({code:'2',name:'专项应急预案模板'});
	data.push({code:'3',name:'部门应急预案'});
	data.push({code:'4',name:'重大活动应急预案'});
	data.push({code:'5',name:'其它省级预案'});
	return data;
};
SelectOption.loadTemplateType = function loadTemplateType(code) {
	var data=SelectOption.getTemplateTypeData();
	SelectOption.loadBaseCode(data, code);
};
SelectOption.getTemplateType=function getTemplateType(code){
	if(code==null)
		return "";
	return SelectOption.getCodeName(SelectOption.getTemplateTypeData(),code);
};


/**
 * 季度
 * @return
 */
SelectOption.getQuarterData = function getQuarterData() {
	var data=new Array();
	data.push({code:'1',name:'第一季度'});
	data.push({code:'2',name:'第二季度'});
	data.push({code:'3',name:'第三季度'});
	data.push({code:'4',name:'第四季度'});
	return data;
};
SelectOption.loadQuarter = function loadQuarter(code) {
	var data=SelectOption.getQuarterData();
	SelectOption.loadBaseCode(data, code);
};
SelectOption.getQuarter=function getQuarter(code){
	if(code==null)
		return "";
	return SelectOption.getCodeName(SelectOption.getQuarterData(),code);
};


/**
 * 月份
 * @return
 */
SelectOption.getMonthData = function getMonthData() {
	var data=new Array();
	data.push({code:'01',name:'1月份'});
	data.push({code:'02',name:'2月份'});
	data.push({code:'03',name:'3月份'});
	data.push({code:'04',name:'4月份'});
	data.push({code:'05',name:'5月份'});
	data.push({code:'06',name:'6月份'});
	data.push({code:'07',name:'7月份'});
	data.push({code:'08',name:'8月份'});
	data.push({code:'09',name:'9月份'});
	data.push({code:'10',name:'10月份'});
	data.push({code:'11',name:'11月份'});
	data.push({code:'12',name:'12月份'});
	return data;
};
SelectOption.loadMonth = function loadMonth(code) {
	var data=SelectOption.getMonthData();
	SelectOption.loadBaseCode(data, code);
};
SelectOption.getMonth=function getMonth(code){
	if(code==null)
		return "";
	return SelectOption.getCodeName(SelectOption.getMonthData(),code);
};

/**
 * 行业类型
 * 工业及危险化学品类、商贸及服务类、交通运输类、工程建设类
 * @return
 */
SelectOption.getIndustryTypeData = function getIndustryTypeData() {
	var data=new Array();
	data.push({code:1,name:'工业及危险化学品类'});
	data.push({code:2,name:'商贸及服务类'});
	data.push({code:3,name:'交通运输类'});
	data.push({code:4,name:'工程建设类'});
	return data;
};
SelectOption.loadIndustryType = function loadIndustryType(code) {
	var data=SelectOption.getIndustryTypeData();
	SelectOption.loadBaseCode(data, code);
};
SelectOption.getIndustryType=function getIndustryType(code){
	if(code==null)
		return "";
	return SelectOption.getCodeName(SelectOption.getIndustryTypeData(),code);
};

/**
 * 行业类型(排查项)
 * 工业及危险化学品类、商贸及服务类、交通运输类、工程建设类、三小场所
 * @return
 */
SelectOption.getCheckIndustryTypeData = function getCheckIndustryTypeData() {
	var data=new Array();
	data.push({code:1,name:'工业及危险化学品类'});
	data.push({code:2,name:'商贸及服务类'});
	data.push({code:3,name:'交通运输类'});
	data.push({code:4,name:'工程建设类'});
	data.push({code:5,name:'三小场所类'});
	return data;
};
SelectOption.loadCheckIndustryType = function loadCheckIndustryType(code) {
	var data=SelectOption.getCheckIndustryTypeData();
	SelectOption.loadBaseCode(data, code);
};
SelectOption.getCheckIndustryType=function getCheckIndustryType(code){
	if(code==null)
		return "";
	return SelectOption.getCodeName(SelectOption.getCheckIndustryTypeData(),code);
};

/**
 * 地址
 * @return
 */
SelectOption.getAddressTypeData = function getAddressTypeData() {
	var data=new Array();
	data.push({code:'1',name:'办公地址'});
	data.push({code:'2',name:'生产经营地址'});
	return data;
};
SelectOption.loadAddressType = function loadAddressType(code) {
	var data=SelectOption.getAddressTypeData();
	SelectOption.loadBaseCode(data, code);
};
SelectOption.getAddressType=function getAddressType(code){
	if(code==null)
		return "";
	return SelectOption.getCodeName(SelectOption.getAddressTypeData(),code);
};


/**
 * 分类分级
 * 未分级、A级、B级、C级、D级
 * @return
 */
SelectOption.getClassGradeData = function getClassGradeData() {
	var data=new Array();
	data.push({code:0,name:'未分级'});
	data.push({code:1,name:'A级'});
	data.push({code:2,name:'B级'});
	data.push({code:3,name:'C级'});
	data.push({code:4,name:'D级'});
	return data;
};
SelectOption.loadClassGradeType = function loadClassGradeType(code) {
	var data=SelectOption.getClassGradeData();
	SelectOption.loadBaseCode(data, code);
};
SelectOption.getClassGrade=function getClassGrade(code){
	if(code==null) return "";
	return SelectOption.getCodeName(SelectOption.getClassGradeData(),code);
};



/**
 * 三小类型
 * 小档口、小作坊、小娱乐场所
 * @return
 */
SelectOption.getThreeTypeData = function getThreeTypeData() {
	var data=new Array();
	data.push({code:1,name:'小档口'});
	data.push({code:2,name:'小作坊'});
	data.push({code:3,name:'小娱乐场所'});
	return data;
};
SelectOption.loadThreeType = function loadThreeType(code) {
	var data=SelectOption.getThreeTypeData();
	SelectOption.loadBaseCode(data, code);
};
SelectOption.getThreeType=function getThreeType(code){
	if(code==null)
		return "";
	return SelectOption.getCodeName(SelectOption.getThreeTypeData(),code);
};

/**
 * 单位管辖隶属关系
 * @return
 */
SelectOption.getSubjectionData = function getSubjectionData() {
	var data=new Array();
	data.push({code:1,name:'市属行业部门管理单位'});
	data.push({code:2,name:'区属行业部门管理单位'});
	data.push({code:3,name:'街镇行业部门管理单位'});
	return data;
};
SelectOption.loadSubjection = function loadSubjection(code) {
	var data=SelectOption.getSubjectionData();
	SelectOption.loadBaseCode(data, code);
};
SelectOption.getSubjection=function getSubjection(code){
	if(code==null)
		return "";
	return SelectOption.getCodeName(SelectOption.getSubjectionData(),code);
};

/**
 * 企业规模
 * @return
 */
SelectOption.getEntscaleData = function getEntscaleData() {
	var data=new Array();
	data.push({code:1,name:'大型'});
	data.push({code:2,name:'中型'});
	data.push({code:3,name:'小型'});
	data.push({code:4,name:'微型'});
	return data;
};
SelectOption.loadEntscale = function loadEntscale(code) {
	var data=SelectOption.getEntscaleData();
	SelectOption.loadBaseCode(data, code);
};
SelectOption.getEntscale=function getEntscale(code){
	if(code==null)
		return "";
	return SelectOption.getCodeName(SelectOption.getEntscaleData(),code);
};

/**
 * 评级
 * @return
 */
SelectOption.getRateData = function getRateData() {
	var data=new Array();
	data.push({code:1,name:'一级'});
	data.push({code:2,name:'二级'});
	data.push({code:3,name:'三级'});
	return data;
};
SelectOption.loadRate = function loadRate(code) {
	var data=SelectOption.getRateData();
	SelectOption.loadBaseCode(data, code);
};
SelectOption.getRate=function getRate(code){
	if(code==null)
		return "";
	return SelectOption.getCodeName(SelectOption.getRateData(),code);
};


/**
 * 安全生产管理资料(资料类型-大类)
 * @return
 */
SelectOption.getDataOneTypeData = function getDataOneTypeData() {
	var data=new Array();
	data.push({code:1,name:'管理文件类'});
	data.push({code:2,name:'资质证书类'});
	data.push({code:3,name:'企业图例'});
	data.push({code:4,name:'其它'});
	return data;
};
SelectOption.loadDataOneType = function loadDataOneType(code) {
	var data=SelectOption.getDataOneTypeData();
	SelectOption.loadBaseCode(data, code);
};
SelectOption.getDataOneType=function getDataOneType(code){
	if(code==null)
		return "";
	return SelectOption.getCodeName(SelectOption.getDataOneTypeData(),code);
};

/**
 * 安全生产管理资料(资料类型-小类)
 * @return
 */
SelectOption.getDataTwoTypeData = function getDataTwoTypeData(onetype) {
	var data=new Array();
	if(onetype == 1){
		data.push({code:1,name:'安全生产责任制'});
		data.push({code:2,name:'安全生产管理制度'});
		data.push({code:3,name:'安全生产操作规范'});
	}else if(onetype == 2){
		data.push({code:1,name:'许可证书类'});
		data.push({code:2,name:'资质证书类(包含个人资质)'});
	}else if(onetype == 3){
		data.push({code:1,name:'企业厂区平面图'});
		data.push({code:2,name:'周围环境图'});
		data.push({code:3,name:'安全生产组织架构图'});
	}
	return data;
};
SelectOption.loadDataTwoType = function loadDataTwoType(code,onetype) {
	var data=SelectOption.getDataTwoTypeData(onetype);
	SelectOption.loadBaseCode(data, code);
};
SelectOption.getDataTwoType=function getDataTwoType(code,onetype){
	if(code==null)
		return "";
	return SelectOption.getCodeName(SelectOption.getDataTwoTypeData(onetype),code);
};



/**
 * 安全生产责任划分
 * @return
 */
SelectOption.getSafeResponsibilityData = function getSafeResponsibilityData() {
	var data=new Array();
	data.push({code:1,name:'主要负责人（第一责任人）'});
	data.push({code:2,name:'分管负责人（直接责任人）'});
	return data;
};
SelectOption.loadSafeResponsibility = function loadSafeResponsibility(code) {
	var data=SelectOption.getSafeResponsibilityData();
	SelectOption.loadBaseCode(data, code);
};
SelectOption.getSafeResponsibility=function getSafeResponsibility(code){
	if(code==null)
		return "";
	return SelectOption.getCodeName(SelectOption.getSafeResponsibilityData(),code);
};


/**
 * 专职兼职
 * @return
 */
SelectOption.getFullTimePartTimeData = function getFullTimePartTimeData() {
	var data=new Array();
	data.push({code:1,name:'专职'});
	data.push({code:2,name:'兼职'});
	return data;
};
SelectOption.loadFullTimePartTime = function loadFullTimePartTime(code) {
	var data=SelectOption.getFullTimePartTimeData();
	SelectOption.loadBaseCode(data, code);
};
SelectOption.getFullTimePartTime=function getFullTimePartTime(code){
	if(code==null)
		return "";
	return SelectOption.getCodeName(SelectOption.getFullTimePartTimeData(),code);
};


/**
 * 安全管理人员类型
 * 初级安全主任、中级安全主任、高级安全主任、注册安全工程师、职业健康管理人员、其他
 * @return
 */
SelectOption.getSafeManagerTypeData = function getSafeManagerTypeData() {
	var data=new Array();
	data.push({code:1,name:'初级安全主任'});
	data.push({code:2,name:'中级安全主任'});
	data.push({code:3,name:'高级安全主任'});
	data.push({code:4,name:'注册安全工程师'});
	data.push({code:5,name:'职业健康管理人员'});
	data.push({code:6,name:'其他'});
	return data;
};
SelectOption.loadSafeManagerType = function loadSafeManagerType(code) {
	var data=SelectOption.getSafeManagerTypeData();
	SelectOption.loadBaseCode(data, code);
};
SelectOption.getSafeManagerType=function getSafeManagerType(code){
	if(code==null)
		return "";
	return SelectOption.getCodeName(SelectOption.getSafeManagerTypeData(),code);
};


/**
 * 是否
 * @return
 */
SelectOption.getTureFalseData = function getTureFalseData() {
	var data=new Array();
	data.push({code:0,name:'否'});
	data.push({code:1,name:'是'});
	return data;
};
SelectOption.loadTureFalse = function loadTureFalse(code) {
	var data=SelectOption.getTureFalseData();
	SelectOption.loadBaseCode(data, code);
};
SelectOption.getTureFalse=function getTureFalse(code){
	return SelectOption.getCodeName(SelectOption.getTureFalseData(),code);
};

SelectOption.loadTureFalseWithParam = function loadTureFalse(data, code) {
	SelectOption.loadBaseCode(data, code);
};

/**
 * 存储场所
 * @return
 */
SelectOption.getReserveSiteData = function getReserveSiteData() {
	var data=new Array();
	data.push({code:0,name:'无'});
	data.push({code:1,name:'储罐区储存'});
	data.push({code:2,name:'专用仓库储存'});
	data.push({code:3,name:'专用场地储存'});
	return data;
};
SelectOption.loadReserveSite = function loadReserveSite(code) {
	var data=SelectOption.getReserveSiteData();
	SelectOption.loadBaseCode(data, code);
};
SelectOption.getReserveSite=function getReserveSite(code){
	return SelectOption.getCodeName(SelectOption.getReserveSiteData(),code);
};

/**
 * 存储方式
 * @return
 */
SelectOption.getReserveWayData = function getReserveWayData() {
	var data=new Array();
	data.push({code:0,name:'无'});
	data.push({code:1,name:'储罐储存'});
	data.push({code:2,name:'分离储存'});
	data.push({code:3,name:'隔离储存'});
	data.push({code:4,name:'隔开储存'});
	return data;
};
SelectOption.loadReserveWay = function loadReserveWay(code) {
	var data=SelectOption.getReserveWayData();
	SelectOption.loadBaseCode(data, code);
};
SelectOption.getReserveWay=function getReserveWay(code){
	return SelectOption.getCodeName(SelectOption.getReserveWayData(),code);
};

/**
 * 存储方式
 * @return
 */
SelectOption.getIndustryTypesData = function getIndustryTypesData() {
	var data=new Array();
	data.push({code:0,name:'电力'});
	data.push({code:1,name:'危化品'});
	data.push({code:2,name:'工商贸'});
	data.push({code:3,name:'其他'});
	return data;
};
SelectOption.loadIndustryTypes = function loadIndustryTypes(code) {
	var data=SelectOption.getIndustryTypesData();
	SelectOption.loadBaseCode(data, code);
};
SelectOption.getIndustryTypes=function getIndustryTypes(code){
	return SelectOption.getCodeName(SelectOption.getIndustryTypesData(),code);
};


/**
 * 用人单位类型
 * @return
 */
SelectOption.getEntTypeData = function getEntTypeData() {
	var data=new Array();
	data.push({code:1,name:'个体工商户'});
	data.push({code:2,name:'产业活动单位'});
	data.push({code:3,name:'企业法人单位'});
	return data;
};
SelectOption.loadEntType = function loadEntType(code) {
	var data=SelectOption.getEntTypeData();
	SelectOption.loadBaseCode(data, code);
};
SelectOption.getEntType=function getEntType(code){
	return SelectOption.getCodeName(SelectOption.getEntTypeData(),code);
};

/**
 * 定期进行健康体检人员比例
 * @return
 */
SelectOption.getPhysicalsData = function getPhysicalsData() {
	var data=new Array();
	data.push({code:1,name:'全部'});
	data.push({code:2,name:'部分'});
	data.push({code:3,name:'无'});
	return data;
};
SelectOption.loadPhysicals = function loadPhysicals(code) {
	var data=SelectOption.getPhysicalsData();
	SelectOption.loadBaseCode(data, code);
};
SelectOption.getPhysicals=function getPhysicals(code){
	return SelectOption.getCodeName(SelectOption.getPhysicalsData(),code);
};

/**
 * 职业危害岗位
 * @return
 */
SelectOption.getProharmPostData = function getProharmPostData() {
	var data=new Array();
	data.push({code:1,name:'自动化'});
	data.push({code:2,name:'机械化'});
	data.push({code:3,name:'手工操作'});
	return data;
};
SelectOption.loadProharmPost = function loadProharmPost(code) {
	var data=SelectOption.getProharmPostData();
	SelectOption.loadBaseCode(data, code);
};
SelectOption.getProharmPost=function getProharmPost(code){
	return SelectOption.getCodeName(SelectOption.getProharmPostData(),code);
};


/**
 * 单位性质
 * @return
 */
SelectOption.getUnitEntnatData = function getUnitEntnatData() {
	var data=new Array();
	data.push({code:1,name:'央企'});
	data.push({code:2,name:'省属企业'});
	data.push({code:3,name:'其他'});
	return data;
};
SelectOption.loadUnitEntnat = function loadUnitEntnat(code) {
	var data=SelectOption.getUnitEntnatData();
	SelectOption.loadBaseCode(data, code);
};
SelectOption.getUnitEntnat=function getUnitEntnat(code){
	return SelectOption.getCodeName(SelectOption.getUnitEntnatData(),code);
};

/**
 * 单位法人性质
 * @return
 */
SelectOption.getUnitPernatData = function getUnitPernatData() {
	var data=new Array();
	data.push({code:1,name:'独立法人'});
	data.push({code:2,name:'非独立法人'});
	return data;
};
SelectOption.loadUnitPernat = function loadUnitPernat(code) {
	var data=SelectOption.getUnitPernatData();
	SelectOption.loadBaseCode(data, code);
};
SelectOption.getUnitPernat=function getUnitPernat(code){
	return SelectOption.getCodeName(SelectOption.getUnitPernatData(),code);
};

/**
 * 运行状态
 * @return
 */
SelectOption.getRunStatusData = function getRunStatusData() {
	var data=new Array();
	data.push({code:1,name:'自动化'});
	data.push({code:2,name:'机械化'});
	data.push({code:3,name:'手工操作'});
	return data;
};
SelectOption.loadRunStatus = function loadRunStatus(code) {
	var data=SelectOption.getRunStatusData();
	SelectOption.loadBaseCode(data, code);
};
SelectOption.getRunStatus=function getRunStatus(code){
	return SelectOption.getCodeName(SelectOption.getRunStatusData(),code);
};


/**
 * 存放物体形态
 * @return
 */
SelectOption.getFormStateData = function getFormStateData() {
	var data=new Array();
	data.push({code:1,name:'固体'});
	data.push({code:2,name:'液体'});
	data.push({code:3,name:'气体'});
	return data;
};
SelectOption.loadFormState = function loadFormState(code) {
	var data=SelectOption.getFormStateData();
	SelectOption.loadBaseCode(data, code);
};
SelectOption.getFormState=function getFormState(code){
	return SelectOption.getCodeName(SelectOption.getFormStateData(),code);
};

/**
 * 储罐类型
 * @return
 */
SelectOption.getStotankTypeData = function getStotankTypeData() {
	var data=new Array();
	data.push({code:1,name:'固体顶储罐'});
	data.push({code:2,name:'浮顶储罐'});
	data.push({code:3,name:'其他类型储罐'});
	return data;
};
SelectOption.loadStotankType = function loadStotankType(code) {
	var data=SelectOption.getStotankTypeData();
	SelectOption.loadBaseCode(data, code);
};
SelectOption.getStotankType=function getStotankType(code){
	return SelectOption.getCodeName(SelectOption.getStotankTypeData(),code);
};

/**
 * 许可预警状态
 * @return
 */
SelectOption.getPermitStatusData = function getPermitStatusData() {
	var data=new Array();
	data.push({code:1,name:'超期'});
	data.push({code:2,name:'预超期'});
	data.push({code:3,name:'正常'});
	return data;
};
SelectOption.loadPermitStatus = function loadPermitStatus(code) {
	var data=SelectOption.getPermitStatusData();
	SelectOption.loadBaseCode(data, code);
};
SelectOption.getPermitStatus=function getPermitStatus(code){
	return SelectOption.getCodeName(SelectOption.getPermitStatusData(),code);
};

/**
 * 重大危险源状态
 */
SelectOption.getDangerSourceStateData = function getDangerSourceStateData() {
	var data=new Array();
	data.push({code:"01",name:'已登记'});
	data.push({code:"02",name:'已上报'});
	data.push({code:"03",name:'同意受理'});
	data.push({code:"04",name:'不同意受理'});
	data.push({code:"05",name:'已备案'});
	data.push({code:"06",name:'不同意备案'});
	data.push({code:"07",name:'核销申请'});
	data.push({code:"08",name:'核销受理'});
	data.push({code:"09",name:'核销受理驳回'});
	data.push({code:"10",name:'已核销'});
	data.push({code:"11",name:'核销审核驳回'});
	return data;
};
SelectOption.loadDangerSourceState = function loadDangerSourceState(code) {
	var data=SelectOption.getDangerSourceStateData();
	SelectOption.loadBaseCode(data, code);
};
SelectOption.getDangerSourceState=function getDangerSourceState(code){
	return SelectOption.getCodeName(SelectOption.getDangerSourceStateData(),code);
};

/**
 * 重大危险源级别
 */
SelectOption.getdangSouLevelData = function getdangSouLevelData() {
	var data=new Array();
	data.push({code:1,name:'一级'});
	data.push({code:2,name:'二级'});
	data.push({code:3,name:'三级'});
	data.push({code:4,name:'四级'});
	return data;
};
SelectOption.loaddangSouLevel = function loaddangSouLevel(code) {
	var data=SelectOption.getdangSouLevelData();
	SelectOption.loadBaseCode(data, code);
};
SelectOption.getdangSouLevel=function getdangSouLevel(code){
	return SelectOption.getCodeName(SelectOption.getdangSouLevelData(),code);
};
/**
 * 是否是重大危险源
 */
SelectOption.getisDangSouData = function getisDangSouData() {
	var data=new Array();
	data.push({code:1,name:'是'});
	data.push({code:0,name:'否'});
	return data;
};
SelectOption.loadisDangSou = function loadisDangSou(code) {
	var data=SelectOption.getisDangSouData();
	SelectOption.loadBaseCode(data, code);
};
SelectOption.getisDangSou=function getisDangSou(code){
	return SelectOption.getCodeName(SelectOption.getisDangSouData(),code);
};


/**
 * 重大危险源类别
 */
SelectOption.getDangerTypeData = function getDangerTypeData() {
	var data=new Array();
	data.push({code:1,name:'危险化学品类'});
	data.push({code:2,name:'燃气类'});
	data.push({code:3,name:'港口类'});
	return data;
};
SelectOption.loadDangerType = function loadDangerType(code) {
	var data=SelectOption.getDangerTypeData();
	SelectOption.loadBaseCode(data, code);
};
SelectOption.getDangerType=function getDangerType(code){
	return SelectOption.getCodeName(SelectOption.getDangerTypeData(),code);
};

/**
 * 排查分类
 */
SelectOption.getCheckItemTypeData = function getCheckItemTypeData() {
	var data=new Array();
	data.push({code:1,name:'通用基础检查项'});
	data.push({code:2,name:'通用现场检查项'});
	data.push({code:3,name:'专用检查项'});
	return data;
};
SelectOption.loadCheckItemType = function loadCheckItemType(code) {
	var data=SelectOption.getCheckItemTypeData();
	SelectOption.loadBaseCode(data, code);
};
SelectOption.getCheckItemType=function getCheckItemType(code){
	return SelectOption.getCodeName(SelectOption.getCheckItemTypeData(),code);
};


/**
 * 隐患上报状态
 * @return
 */
SelectOption.getReportstatusData = function getReportstatusData() {
	var data=new Array();
	data.push({code:'1',name:'已上报'});
	data.push({code:'0',name:'未上报'});
	return data;
};
SelectOption.loadReportstatus = function loadReportstatus(code) {
	var data=SelectOption.getReportstatusData();
	SelectOption.loadBaseCode(data, code);
};
SelectOption.getReportstatus=function getReportstatus(code){
	if(code==null)
		return "";
	return SelectOption.getCodeName(SelectOption.getReportstatusData(),code);
};


/**
 * 巡查人员身份
 */
SelectOption.getPatrollerTypeData = function getPatrollerTypeData() {
	var data=new Array();
	data.push({code:1,name:'巡查登记人员'});
	data.push({code:2,name:'网格管理人员'});
	return data;
};
SelectOption.loadPatrollerType = function loadPatrollerType(code) {
	var data=SelectOption.getPatrollerTypeData();
	SelectOption.loadBaseCode(data, code);
};
SelectOption.getPatrollerType=function getPatrollerType(code){
	return SelectOption.getCodeName(SelectOption.getPatrollerTypeData(),code);
};


/**
 * 隐患排查结果
 */
SelectOption.getCheckResultData = function getCheckResultData() {
	var data=new Array();
	data.push({code:0,name:'无隐患'});
	data.push({code:1,name:'有隐患'});
	return data;
};
SelectOption.loadCheckResult = function loadCheckResult(code) {
	var data=SelectOption.getCheckResultData();
	SelectOption.loadBaseCode(data, code);
};
SelectOption.getCheckResult=function getCheckResult(code){
	return SelectOption.getCodeName(SelectOption.getCheckResultData(),code);
};

/**
 * 危险源备案申请类型
 * @return
 */
SelectOption.getCaseapplytypeData = function getCaseapplytypeData() {
	var data=new Array();
	data.push({code:0,name:'初次备案'});
	data.push({code:1,name:'新项目备案'});
	data.push({code:2,name:'改项目备案'});
	data.push({code:3,name:'扩项目备案'});
	data.push({code:4,name:'更新备案'});
	return data;
};
SelectOption.loadCaseapplytype = function loadCaseapplytype(code) {
	var data=SelectOption.getCaseapplytypeData();
	SelectOption.loadBaseCode(data, code);
};
SelectOption.getCaseapplytype=function getCaseapplytype(code){
	return SelectOption.getCodeName(SelectOption.getCaseapplytypeData(),code);
};

/**
 * 危险化学品单位类型
 * @return
 */
SelectOption.getDangerchemcomptypeData = function getDangerchemcomptypeData() {
	var data=new Array();
	data.push({code:0,name:'生产'});
	data.push({code:1,name:'储存'});
	data.push({code:2,name:'使用'});
	data.push({code:3,name:'经营'});
	data.push({code:4,name:'其他'});
	return data;
};
SelectOption.loadDangerchemcomptype = function loadDangerchemcomptype(code) {
	var data=SelectOption.getDangerchemcomptypeData();
	SelectOption.loadBaseCode(data, code);
};
SelectOption.getDangerchemcomptype=function getDangerchemcomptype(code){
	return SelectOption.getCodeName(SelectOption.getDangerchemcomptypeData(),code);
};

/**
 * 经济类型
 * @return
 */
SelectOption.getEconomytypeData = function getEconomytypeData() {
	var data=new Array();
	data.push({code:0,name:'国有经济'});
	data.push({code:1,name:'集体经济'});
	data.push({code:2,name:'私营经济'});
	data.push({code:3,name:'有限责任公司'});
	data.push({code:4,name:'联营经济'});
	data.push({code:5,name:'股份合作'});
	data.push({code:6,name:'外商投资'});
	data.push({code:7,name:'港澳台投资'});
	data.push({code:8,name:'其他经济'});
	return data;
};
SelectOption.loadEconomytype = function loadEconomytype(code) {
	var data=SelectOption.getEconomytypeData();
	SelectOption.loadBaseCode(data, code);
};
SelectOption.getEconomytype=function getEconomytype(code){
	return SelectOption.getCodeName(SelectOption.getEconomytypeData(),code);
};


/**
 * 企业隐患自查状态
 */
SelectOption.getSelfCheckStateData = function getSelfCheckStateData() {
	var data=new Array();
	data.push({code:1,name:'已自查'});
	data.push({code:2,name:'未自查'});
	data.push({code:3,name:'自查中'});
	return data;
};
SelectOption.loadSelfCheckState = function loadSelfCheckState(code) {
	var data=SelectOption.getSelfCheckStateData();
	SelectOption.loadBaseCode(data, code);
};
SelectOption.getSelfCheckState=function getSelfCheckState(code){
	return SelectOption.getCodeName(SelectOption.getSelfCheckStateData(),code);
};

/**
 * 巡查缘由
 */
SelectOption.getPatrolReasonData = function getPatrolReasonData() {
	var data=new Array();
	data.push({code:1,name:'基层网格巡查'});
	data.push({code:2,name:'部门日常巡查'});
	data.push({code:3,name:'群众举报投诉'});
	data.push({code:4,name:'上级领导督办'});
	data.push({code:5,name:'其它'});
	return data;
};
SelectOption.loadPatrolReason = function loadPatrolReason(code) {
	var data=SelectOption.getPatrolReasonData();
	SelectOption.loadBaseCode(data, code);
};
SelectOption.getPatrolReason=function getPatrolReason(code){
	return SelectOption.getCodeName(SelectOption.getPatrolReasonData(),code);
};

//监测监控 视频主机摄像头的状态
SelectOption.getVideostateData = function getVideostateData() {
	var data=new Array();
	data.push({code:1,name:'在线'});
	data.push({code:2,name:'离线'});
	data.push({code:3,name:'维修'});
	return data;
};
SelectOption.loadVideostate = function loadVideostate(code) {
	var data=SelectOption.getVideostateData();
	SelectOption.loadBaseCode(data, code);
};
SelectOption.getVideostate=function getVideostate(code){
	return SelectOption.getCodeName(SelectOption.getVideostateData(),code);
};

/**
 * 监控视频主机类型
 * 状态（0企业1政府）
 */
SelectOption.getIsGovVideoData = function getIsGovVideoData() {
    var data=new Array();
    data.push({code:0,name:'企业'});
    data.push({code:1,name:'政府'});
    return data;
};
SelectOption.loadIsGovVideo = function loadIsGovVideo(code) {
    var data=SelectOption.getIsGovVideoData();
    SelectOption.loadBaseCode(data, code);
};
SelectOption.getIsGovVideo=function getIsGovVideo(code){
    if(code==null)
        return "";
    return SelectOption.getCodeName(SelectOption.getIsGovVideoData(),code);
};


//监测监控 视频型号类型
SelectOption.getVideoModelStyleData = function getVideoModelStyleData() {
	var data=new Array();
	data.push({code:1,name:'主机'});
	data.push({code:2,name:'摄像头'});
	data.push({code:3,name:'主机和摄像头'});
	return data;
};
SelectOption.loadVideoModelStyle = function loadVideoModelStyle(code) {
	var data=SelectOption.getVideoModelStyleData();
	SelectOption.loadBaseCode(data, code);
};
SelectOption.getVideoModelStyle=function getVideoModelStyle(code){
	return SelectOption.getCodeName(SelectOption.getVideoModelStyleData(),code);
};

//监测监控 监测设备类型
SelectOption.getProbeDeviceTypeData = function getProbeDeviceTypeData() {
	var data=new Array();
	data.push({code:1,name:'主机'});
	data.push({code:2,name:'探头'});
	data.push({code:3,name:'主机和探头'});
	return data;
};
SelectOption.loadProbeDeviceType = function loadProbeDeviceType(code) {
	var data=SelectOption.getProbeDeviceTypeData();
	SelectOption.loadBaseCode(data, code);
};
SelectOption.getProbeDeviceType=function getProbeDeviceType(code){
	return SelectOption.getCodeName(SelectOption.getProbeDeviceTypeData(),code);
};


//监测监控 探测器状态
SelectOption.getProbeStateData = function getProbeStateData() {
	var data=new Array();
	data.push({code:0,name:'正常'});
	data.push({code:2,name:'待标定'});
	data.push({code:3,name:'探头故障'});
	data.push({code:4,name:'预警'});
	data.push({code:7,name:'通讯故障'});
	data.push({code:99,name:'网络故障'});
	data.push({code:100,name:'满量程'});
	data.push({code:101,name:'低报'});
    data.push({code:102,name:'高报'});
    data.push({code:103,name:'超低报'});
    data.push({code:104,name:'超高报'});
	return data;
};
SelectOption.loadProbeState = function loadProbeState(code) {
	var data=SelectOption.getProbeStateData();
	SelectOption.loadBaseCode(data, code);
};
SelectOption.getProbeState=function getProbeState(code){
	return SelectOption.getCodeName(SelectOption.getProbeStateData(),code);
};
SelectOption.loadProbeStateWithParam = function loadProbeState(data, code) {
	SelectOption.loadBaseCode(data, code);
};

//监测监控 是否以消音
SelectOption.getErasureData = function getErasureData() {
	var data=new Array();
	data.push({code:0,name:'未消音'});
	data.push({code:1,name:'已消音'});
	return data;
};
SelectOption.loadErasure = function loadErasure(code) {
	var data=SelectOption.getErasureData();
	SelectOption.loadBaseCode(data, code);
};
SelectOption.getErasure=function getErasure(code){
	return SelectOption.getCodeName(SelectOption.getErasureData(),code);
};

//监测监控 报警处理状态
SelectOption.getAlarmHandleStatusData = function getAlarmHandleStatus() {
	var data=new Array();
	data.push({code:0,name:'未处理'});
	data.push({code:1,name:'已处理'});
	return data;
};
SelectOption.loadAlarmHandleStatus = function loadAlarmHandleStatus(code) {
	var data=SelectOption.getAlarmHandleStatusData();
	SelectOption.loadBaseCode(data, code);
};
SelectOption.getAlarmHandleStatus=function getAlarmHandleStatus(code){
	return SelectOption.getCodeName(SelectOption.getAlarmHandleStatusData(),code);
};

/**
 * 重大危险源 监测监控 主机品牌
 * @return
 */
SelectOption.loadMacVideoBrand = function loadMacVideoBrand(code,jsonParam){
	SelectOption.loadBaseCodeFromDB(BASE_URL+"/monitor/macvideobrand/loadMacvideoBrand",code,jsonParam);
};

/**
 * 承包商
 * @return
 */
SelectOption.loadContractor = function loadContractor(code,jsonParam){
    SelectOption.loadBaseCodeFromDB(BASE_URL+"/enterprise/entcontractor/loadContractorOption",code,jsonParam);
};

/**
 * 重大危险源 监测主机、监测探头品牌
 * @return
 */
SelectOption.loadMacProbeBrand = function loadMacProbeBrand(code,jsonParam){
	SelectOption.loadBaseCodeFromDB(BASE_URL+"/monitor/macprobebrand/loadMacprobeBrand",code,jsonParam);
};

/**
 * 执法人员身份属性
 * 1：执法人员2：审核人员3：审批人员4：督查人员
 */
SelectOption.getExecTypeData = function getExecTypeData() {
	var data=new Array();
	data.push({code:1,name:'执法人员'});
	data.push({code:2,name:'审核人员'});
	data.push({code:3,name:'审批人员'});
	data.push({code:4,name:'督查人员'});
	return data;
};
SelectOption.loadExecType = function loadExecType(code) {
	var data=SelectOption.getExecTypeData();
	SelectOption.loadBaseCode(data, code);
};
SelectOption.getExecType=function getExecType(code){
	if(code==null)
		return "";
	return SelectOption.getCodeName(SelectOption.getExecTypeData(),code);
};

/**
 * 文化程度
 * 1：硕士以上2：大学3：大专4：高中，中专5：初中6：小学7：文盲
 */
SelectOption.getEducationData = function getEducationData() {
	var data=new Array();
	data.push({code:1,name:'硕士以上'});
	data.push({code:2,name:'大学'});
	data.push({code:3,name:'大专'});
	data.push({code:4,name:'高中，中专'});
	data.push({code:5,name:'初中'});
	data.push({code:6,name:'小学'});
	data.push({code:7,name:'文盲'});
	return data;
};
SelectOption.loadEducation = function loadEducation(code) {
	var data=SelectOption.getEducationData();
	SelectOption.loadBaseCode(data, code);
};
SelectOption.getEducation=function getEducation(code){
	if(code==null)
		return "";
	return SelectOption.getCodeName(SelectOption.getEducationData(),code);
};

/**
 * 查看案件范围
 * 1：个人2：部门3：区域
 */
SelectOption.getCaseScopeData = function getCaseScopeData() {
	var data=new Array();
	data.push({code:1,name:'个人'});
	data.push({code:2,name:'部门'});
	data.push({code:3,name:'区域'});
	return data;
};
SelectOption.loadCaseScope = function loadCaseScope(code) {
	var data=SelectOption.getCaseScopeData();
	SelectOption.loadBaseCode(data, code);
};
SelectOption.getCaseScope=function getCaseScope(code){
	if(code==null)
		return "";
	return SelectOption.getCodeName(SelectOption.getCaseScopeData(),code);
};

/**
 * 执法计划类型
 * 1：月计划 2：专项计划
 */
SelectOption.getPlanTypeData = function getPlanTypeData() {
	var data=new Array();
	data.push({code:1,name:'月计划'});
	data.push({code:2,name:'专项计划'});
	data.push({code:3,name:'年度计划'});
	return data;
};
SelectOption.loadPlanType = function loadPlanType(code) {
	var data=SelectOption.getPlanTypeData();
	SelectOption.loadBaseCode(data, code);
};
SelectOption.getPlanType=function getPlanType(code){
	if(code==null)
		return "";
	return SelectOption.getCodeName(SelectOption.getPlanTypeData(),code);
};



/**
 * 待执法企业检查状态
 * 0：未检查 1：已检查
 */
SelectOption.getLawEntStateData = function getLawEntStateData() {
	var data=new Array();
	data.push({code:0,name:'未检查'});
	data.push({code:1,name:'已检查'});
	return data;
};
SelectOption.loadLawEntState = function loadLawEntState(code) {
	var data=SelectOption.getLawEntStateData();
	SelectOption.loadBaseCode(data, code);
};
SelectOption.getLawEntState=function getLawEntState(code){
	if(code==null)
		return "";
	return SelectOption.getCodeName(SelectOption.getLawEntStateData(),code);
};


/**
 * 行政执法-处罚方式
 * 1：当场处罚 2：立案处罚
 */
SelectOption.getLawPunishWayData = function getLawPunishWayData() {
	var data=new Array();
	data.push({code:1,name:'当场处罚'});
	data.push({code:2,name:'立案处罚'});
	return data;
};
SelectOption.loadLawPunishWay = function loadLawPunishWay(code) {
	var data=SelectOption.getLawPunishWayData();
	SelectOption.loadBaseCode(data, code);
};
SelectOption.getLawPunishWay=function getLawPunishWay(code){
	if(code==null)
		return "";
	return SelectOption.getCodeName(SelectOption.getLawPunishWayData(),code);
};

/**
 * 1.应急管理 应急仓库  物资库级别
 */
SelectOption.getMaeDeposGradeData = function getMaeDeposGradeData() {
	var data=new Array();
	data.push({code:0,name:'国家级'});
	data.push({code:1,name:'省级'});
	data.push({code:2,name:'地市级'});
	data.push({code:3,name:'区县级'});
	data.push({code:4,name:'乡镇'});
	return data;
};
SelectOption.loadMaeDeposGrade = function loadMaeDeposGrade(code) {
	var data=SelectOption.getMaeDeposGradeData();
	SelectOption.loadBaseCode(data, code);
};
SelectOption.getMaeDeposGrade=function getMaeDeposGrade(code){
	if(code==null)
		return "";
	return SelectOption.getCodeName(SelectOption.getMaeDeposGradeData(),code);
};

/**
 * 1.应急管理 应急仓库  存储物资库类别
 * materialtype
 */
SelectOption.getMaeMaterialtypeData = function getMaeMaterialtypeData() {
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
};
SelectOption.loadMaeMaterialtype = function loadMaeMaterialtype(code) {
	var data=SelectOption.getMaeMaterialtypeData();
	SelectOption.loadBaseCode(data, code);
};
SelectOption.getMaeMaterialtype=function getMaeMaterialtype(code){
	if(code==null)
		return "";
	return SelectOption.getCodeName(SelectOption.getMaeMaterialtypeData(),code);
};


/**
 * 1.应急管理 应急物资  资金来源
 */
SelectOption.getCapitalsourceData = function getCapitalsourceData() {
    var data=new Array();
    data.push({code:0,name:'政府拨款'});
    data.push({code:1,name:'政府扶持'});
    data.push({code:2,name:'企业自筹'});
    data.push({code:3,name:'其他'});
    return data;
};
SelectOption.loadCapitalsource = function loadCapitalsource(code) {
    var data=SelectOption.getCapitalsourceData();
    SelectOption.loadBaseCode(data, code);
};
SelectOption.getCapitalsource=function getCapitalsource(code){
    if(code==null)
        return "";
    return SelectOption.getCodeName(SelectOption.getCapitalsourceData(),code);
};

/**
 * 1.应急管理 应急物资 所属单位类型 
 */
SelectOption.getMaeUnittypeData = function getMaeUnittypeData() {
    var data=new Array();
    data.push({code:0,name:'物资储备库 '});
    data.push({code:1,name:'企业'});
    data.push({code:2,name:'救援队伍'});
    return data;
};
SelectOption.loadMaeUnittype = function loadMaeUnittype(code) {
    var data=SelectOption.getMaeUnittypeData();
    SelectOption.loadBaseCode(data, code);
};
SelectOption.getMaeUnittype=function getMaeUnittype(code){
    if(code==null)
        return "";
    return SelectOption.getCodeName(SelectOption.getMaeUnittypeData(),code);
};

/**
 * 1.应急管理 应急物资 是否可回收
 * 1.是 0否
 */
SelectOption.getRecoverableData = function getRecoverableData() {
    var data=new Array();
    data.push({code:0,name:'否 '});
    data.push({code:1,name:'是'});
    return data;
};
SelectOption.loadRecoverable = function loadRecoverable(code) {
    var data=SelectOption.getRecoverableData();
    SelectOption.loadBaseCode(data, code);
};
SelectOption.getRecoverable=function getRecoverable(code){
    if(code==null)
        return "";
    return SelectOption.getCodeName(SelectOption.getRecoverableData(),code);
};


/**
 * 1.应急仓库，应急资源状态
 * 1.已填写
 * 2 已上报
 */
SelectOption.getEmsStateData = function getEmsStateData() {
    var data=new Array();
    data.push({code:1,name:'填报中'});
    data.push({code:2,name:'已上报'});
    return data;
};
SelectOption.loadEmsState = function loadEmsState(code) {
    var data=SelectOption.getEmsStateData();
    SelectOption.loadBaseCode(data, code);
};
SelectOption.getEmsState=function getEmsState(code){
    if(code==null)
        return "";
    return SelectOption.getCodeName(SelectOption.getEmsStateData(),code);
};


/**
 * 应急预案类型
 * 预案类型（1：综合预案 2：专项预案 3：应急处置方案）
 */
SelectOption.getEmsPlanTypeData = function getEmsPlanTypeData() {
    var data=new Array();
    data.push({code:1,name:'综合预案'});
    data.push({code:2,name:'专项预案'});
    data.push({code:3,name:'应急处置方案'});
    return data;
};
SelectOption.loadEmsPlanType = function loadEmsPlanType(code) {
    var data=SelectOption.getEmsPlanTypeData();
    SelectOption.loadBaseCode(data, code);
};
SelectOption.getEmsPlanType=function getEmsPlanType(code){
    if(code==null)
        return "";
    return SelectOption.getCodeName(SelectOption.getEmsPlanTypeData(),code);
};


/**
 * 应急预案状态
 * 预案状态（1：登记 2：已上报 3：审核同意 4：审核不同意 ）
 */
SelectOption.getEmsPlanStateData = function getEmsPlanStateData() {
    var data=new Array();
    data.push({code:1,name:'登记'});
    data.push({code:2,name:'已上报'});
    data.push({code:3,name:'审核同意'});
    data.push({code:4,name:'审核不同意'});
    return data;
};
SelectOption.loadEmsPlanState = function loadEmsPlanState(code) {
    var data=SelectOption.getEmsPlanStateData();
    SelectOption.loadBaseCode(data, code);
};
SelectOption.getEmsPlanState=function getEmsPlanState(code){
    if(code==null)
        return "";
    return SelectOption.getCodeName(SelectOption.getEmsPlanStateData(),code);
};


/**
 * 应急预案级别
 * 预案级别（1：国家级 2：省级 3：市级 4：区县级 5：企业）
 */
SelectOption.getEmsPlanLevelData = function getEmsPlanLevelData() {
    var data=new Array();
    data.push({code:1,name:'国家级'});
    data.push({code:2,name:'省级'});
    data.push({code:3,name:'市级'});
    data.push({code:4,name:'区县级'});
    data.push({code:5,name:'企业'});
    return data;
};
SelectOption.loadEmsPlanLevel = function loadEmsPlanLevel(code) {
    var data=SelectOption.getEmsPlanLevelData();
    SelectOption.loadBaseCode(data, code);
};
SelectOption.getEmsPlanLevel=function getEmsPlanLevel(code){
    if(code==null)
        return "";
    return SelectOption.getCodeName(SelectOption.getEmsPlanLevelData(),code);
};

/**
 * 事故类别
 * @return
 */
SelectOption.getAccData = function getAccData() {
	var data=new Array();
	data.push({code:1,name:'煤矿事故'});
	data.push({code:2,name:'金属与非金属矿山事故'});
	data.push({code:3,name:'事故灾难'});
	data.push({code:4,name:'建筑业事故'});
	data.push({code:5,name:'危险化学品事故'});
	data.push({code:6,name:'烟花爆竹和民用爆炸物事故'});
	data.push({code:7,name:'其他工矿商贸事故'});
	data.push({code:8,name:'火灾事故'});
	data.push({code:9,name:'道路交通事故'});
	data.push({code:10,name:'水上交通事故'});
	data.push({code:11,name:'铁路交通事故'});
	data.push({code:12,name:'城市轨道交通事故'});
	data.push({code:13,name:'民用航空器事故'});
	data.push({code:14,name:'特种设备事故'});
	data.push({code:15,name:'基础设施和公用设施事故'});
	data.push({code:16,name:'染和生态破坏事件'});
	data.push({code:17,name:'农业机械事故'});
	data.push({code:18,name:'踩踏事件'});
	data.push({code:19,name:'核与辐射事故'});
	data.push({code:20,name:'能源供应中断事故'});
	data.push({code:21,name:'其他事故灾难'});
	return data;
};
SelectOption.loadAcc = function loadAcc(code) {
	var data=SelectOption.getAccData();
	SelectOption.loadBaseCode(data, code);
};
SelectOption.getAcc=function getAcc(code){
	return SelectOption.getCodeName(SelectOption.getAccData(),code);
};

/**
 * 事故等级
 * @return
 */
SelectOption.getAcclevelData = function getAcclevelData() {
	var data=new Array();
	data.push({code:1,name:'特别重大事故'});
	data.push({code:2,name:'重大事故'});
	data.push({code:3,name:'较大事故'});
	data.push({code:4,name:'一般事故'});
	return data;
};
SelectOption.loadAcclevel = function loadAcclevel(code) {
	var data=SelectOption.getAcclevelData();
	SelectOption.loadBaseCode(data, code);
};
SelectOption.getAcclevel=function getAcclevel(code){
	return SelectOption.getCodeName(SelectOption.getAcclevelData(),code);
};

/**
 * 待办提醒状态
 * @return
 */
SelectOption.getStateData = function getStateData() {
	var data=new Array();
	data.push({code:1,name:'未处理'});
	data.push({code:2,name:'已办'});
	return data;
};
SelectOption.loadState = function loadState(code) {
	var data=SelectOption.getStateData();
	SelectOption.loadBaseCode(data, code);
};
SelectOption.getState=function getState(code){
	return SelectOption.getCodeName(SelectOption.getStateData(),code);
};

/**
 * 密级
 * @return
 */
SelectOption.getDenseData = function getDenseData() {
	var data=new Array();
	data.push({code:1,name:'绝密'});
	data.push({code:2,name:'机密'});
	data.push({code:3,name:'秘密'});
	data.push({code:4,name:'限制'});
	data.push({code:5,name:'公开'});
	data.push({code:6,name:'其他'});
	return data;
};
SelectOption.loadDense = function loadDense(code) {
	var data=SelectOption.getDenseData();
	SelectOption.loadBaseCode(data, code);
};
SelectOption.getDense=function getDense(code){
	return SelectOption.getCodeName(SelectOption.getDenseData(),code);
};


/**
 * 应急求援 事故信息 状态
 * @return
 */
SelectOption.getEmsSucStateData = function getEmsSucStateData() {
   var data=new Array();
   data.push({code:1,name:'填报中'});
   data.push({code:2,name:'已上报'});
   data.push({code:3,name:'已处理'});
   data.push({code:4,name:'已结案'});
   return data;
};

SelectOption.loadEmsSucState = function loadEmsSucState(code) {
   var data=SelectOption.getEmsSucStateData();
   SelectOption.loadBaseCode(data, code);
};

SelectOption.getEmsSucState=function getEmsSucState(code){
   return SelectOption.getCodeName(SelectOption.getEmsSucStateData(),code);
};

/**
 * 应急预案附件类型
 * 附件类型（1：预案电子档 2：救援方案标绘图 3：组织机构图附件 4：通讯录附件 5：平面图附件 6：应急资源情况附件 7：工作流程附件 8：其他附件）
 */
SelectOption.getEmsPlanAttachTypeData = function getEmsPlanAttachTypeData() {
    var data=new Array();
    data.push({code:1,name:'预案电子档'});
    data.push({code:2,name:'救援方案标绘图'});
    data.push({code:3,name:'组织机构图附件'});
    data.push({code:4,name:'通讯录附件'});
    data.push({code:5,name:'平面图附件'});
    data.push({code:6,name:'应急资源情况附件'});
    data.push({code:7,name:'工作流程附件'});
    data.push({code:8,name:'其他附件'});
    return data;
};
SelectOption.loadEmsPlanAttachType = function loadEmsPlanAttachType(code) {
    var data=SelectOption.getEmsPlanAttachTypeData();
    SelectOption.loadBaseCode(data, code);
};
SelectOption.getEmsPlanAttachType=function getEmsPlanAttachType(code){
    if(code==null)
        return "";
    return SelectOption.getCodeName(SelectOption.getEmsPlanAttachTypeData(),code);
};


/**
 * 应急预案审核状态
 * 审核结果（1：审核同意 2：审核不同意）
 */
SelectOption.getEmsPlanAuditResultData = function getEmsPlanAuditResultData() {
    var data=new Array();
    data.push({code:1,name:'审核同意'});
    data.push({code:2,name:'审核不同意'});
    return data;
};
SelectOption.loadEmsPlanAuditResult = function loadEmsPlanAuditResult(code) {
    var data=SelectOption.getEmsPlanAuditResultData();
    SelectOption.loadBaseCode(data, code);
};
SelectOption.getEmsPlanAuditResult=function getEmsPlanAuditResult(code){
    if(code==null)
        return "";
    return SelectOption.getCodeName(SelectOption.getEmsPlanAuditResultData(),code);
};


/**
 * 职业健康 职业病防治 状态
 * @return
 */
SelectOption.getOchCureStateData = function getOchCureStateData() {
   var data=new Array();
   data.push({code:1,name:'填报中'});
   data.push({code:2,name:'已上报'});
   return data;
};

SelectOption.loadOchCureState = function loadOchCureState(code) {
   var data=SelectOption.getOchCureStateData();
   SelectOption.loadBaseCode(data, code);
};

SelectOption.getOchCureState=function getOchCureState(code){
   return SelectOption.getCodeName(SelectOption.getOchCureStateData(),code);
};
/**
 * 职业健康 职业病防治 防治类型
 */
SelectOption.getCureTypeData = function getCureTypeData() {
   var data=new Array();
   data.push({code:1,name:'预防'});
   data.push({code:2,name:'诊断'});
   data.push({code:3,name:'治疗'});
   return data;
};
SelectOption.loadCureType = function loadCureType(code) {
   var data=SelectOption.getCureTypeData();
   SelectOption.loadBaseCode(data, code);
};
SelectOption.getCureType=function getCureType(code){
   return SelectOption.getCodeName(SelectOption.getCureTypeData(),code);
};

/**
 * 职业健康  作业场所名称
 */
SelectOption.getOchWorkPlaceData = function getOchWorkPlaceData() {
   var data=new Array();
   data.push({code:1,name:'生产型作业场所'});
   data.push({code:2,name:'商业型作业场所'});
   data.push({code:3,name:'物流配送型作业场所'});
   data.push({code:4,name:'服务型作业场所'});
   data.push({code:5,name:'脑力活动作业场所'});
   data.push({code:6,name:'实验型作业场所'});
   return data;
};
SelectOption.loadOchWorkPlace = function loadOchWorkPlace(code) {
   var data=SelectOption.getOchWorkPlaceData();
   SelectOption.loadBaseCode(data, code);
};
SelectOption.getOchWorkPlace=function getOchWorkPlace(code){
   return SelectOption.getCodeName(SelectOption.getOchWorkPlaceData(),code);
};


/**
 * 职业健康 防护设备 状态 datatate
 */
/*OchDefend  */
SelectOption.getOchDefendDatatateData = function getOchDefendDatatateData() {
	var data=new Array();
	data.push({code:1,name:'已上报'});
	data.push({code:2,name:'未上报'});
	return data;
};

SelectOption.loadOchDefendDatatate = function loadOchDefendDatatate(code) {
	var data=SelectOption.getOchDefendDatatateData();
	SelectOption.loadBaseCode(data, code);
};

SelectOption.getOchDefendDatatate=function getOchDefendDatatate(code){
	return SelectOption.getCodeName(SelectOption.getOchDefendDatatateData(),code);
};


/**
 * 职业健康 防护设备 防护类型 detype
 * 1.正常运行 2.停止运行 3.维护中 4.报废
 */
SelectOption.getDefendTypeData = function getDefendTypeData() {
   var data=new Array();
   data.push({code:1,name:'正常运行'});
   data.push({code:2,name:'停止运行'});
   data.push({code:3,name:'维护中'});
   data.push({code:4,name:'报废'});
   return data;
};
SelectOption.loadDefendType = function loadDefendType(code) {
   var data=SelectOption.getDefendTypeData();
   SelectOption.loadBaseCode(data, code);
};
SelectOption.getDefendType=function getDefendType(code){
   return SelectOption.getCodeName(SelectOption.getDefendTypeData(),code);
};



SelectOption.getOchWorkerStateData = function getOchWorkerStateData() {
   var data=new Array();
   data.push({code:1,name:'填报中'});
   data.push({code:2,name:'已上报'});
   return data;
};

SelectOption.loadOchWorkerState = function loadOchWorkerState(code) {
   var data=SelectOption.getOchWorkerData();
   SelectOption.loadBaseCode(data, code);
};

SelectOption.getOchWorkerState=function getOchWorkerState(code){
   return SelectOption.getCodeName(SelectOption.getOchWorkerStateData(),code);
};

/**
 * app版本维护,是否发布
 */
SelectOption.getIsOnLineData = function getIsOnLineData() {
    var data=new Array();
    data.push({code:1,name:'发布'});
    data.push({code:0,name:'不发布'});
    return data;
};
SelectOption.loadIsOnLine = function loadIsOnLine(code) {
    var data=SelectOption.getIsOnLineData();
    SelectOption.loadBaseCode(data, code);
};
SelectOption.getIsOnLine=function getIsOnLine(code){
    if(code==null)
        return "";
    return SelectOption.getCodeName(SelectOption.getIsOnLineData(),code);
};
/**
 * app版本维护 app类型 
 */
SelectOption.getAppTypeData = function getAppTypeData() {
    var data=new Array();
    data.push({code:0,name:'android'});
    data.push({code:1,name:'ios'});
    return data;
};
SelectOption.loadAppType = function loadAppType(code) {
    var data=SelectOption.getAppTypeData();
    SelectOption.loadBaseCode(data, code);
};
SelectOption.getAppType=function getAppType(code){
    if(code==null)
        return "";
    return SelectOption.getCodeName(SelectOption.getAppTypeData(),code);
};

/**
 * 获取执法终端设备状态
 * @author 刘晓斌
 * @date 2017-5-3
 * @return
 */
SelectOption.getLawTerStatData = function getLawTerStatData() {
	return [
		{code: 0, name: "启用"},
		{code: 1, name: "禁用"}
	];
};
SelectOption.loadLawTerStat = function loadLawTerStat(code) {
	SelectOption.loadBaseCode(SelectOption.getLawTerStatData(), code);
};


/**
 * 任务事项类别
 * @return
 */
SelectOption.getTaskTypeData = function getTaskTypeData() {
	var data = new Array();
	data.push({code: "01", name: '检查'});
	data.push({code: "02", name: '复查'});
	data.push({code: "03", name: '取证'});
	data.push({code: "04", name: '告知'});
	data.push({code: "05", name: '催缴'});
	return data;
};
SelectOption.loadTaskType = function loadTaskType(code) {
	var data = SelectOption.getTaskTypeData();
	SelectOption.loadBaseCode(data, code);
};
SelectOption.getTaskType=function getTaskType(code){
	if(code==null)
		return "";
	return SelectOption.getCodeName(SelectOption.getTaskTypeData,code);
};

/**
 * 获取任务执行状态
 * @author 刘晓斌
 * @date 2017-5-11
 * @return
 */
SelectOption.getTaskStatData = function getTaskStatData() {
	return [
		{code: 1, name: "未开始"},
		{code: 2, name: "进行中"},
		{code: 3, name: "完成"}
	];
};
SelectOption.loadTaskStat = function loadTaskStat(code) {
	SelectOption.loadBaseCode(SelectOption.getTaskStatData(), code);
};

/**
 * 不良记录处罚种类
 * @author 周磊
 * @date 2017-8-24
 * @return
 */
SelectOption.getPunishtypeData = function getPunishtypeData() {
	return [
		{code: "01", name: "罚金"},
		{code: "02", name: "停业整顿"},
		{code: "03", name: "其他"}
	];
};
SelectOption.loadPunishtype = function loadPunishtype(code) {
	SelectOption.loadBaseCode(SelectOption.getPunishtypeData(), code);
};
SelectOption.getPunishType=function getPunishType(code){
	if(code==null)
		return "";
	return SelectOption.getCodeName(SelectOption.getPunishtypeData(),code);
};

/**
 * 达拉特安监-风险类型管理-风险所属分类
 * @author 刘晓斌
 * @date 2017-9-14
 * @return
 */
SelectOption.getRiskBelongcate = function getRiskBelongcate() {
	return [
		{code: "1", name: "危险化学品"},
		{code: "2", name: "煤矿/非煤矿山"},
		{code: "3", name: "烟花爆竹"},
		{code: "4", name: "涉氨企业"},
		{code: "5", name: "油气管线"},
		{code: "6", name: "电力设施"}
	];
};
SelectOption.loadRiskBelongcate = function loadRiskBelongcate(code) {
	SelectOption.loadBaseCode(SelectOption.getRiskBelongcate(), code);
};

/**
 * 黑名单状态
 */
SelectOption.getBlackStateData = function getBlackStateData() {
	return [
		{code: 1, name: "已上报"},
		{code: 2, name: "已整改"},
		{code: 3, name: "已核查"},
		{code: 4, name: "已移除"}
	];
};
SelectOption.loadBlackState = function loadBlackState(code) {
	SelectOption.loadBaseCode(SelectOption.getBlackStateData(), code);
};

/**
 * 应急知识-知识类型
 */
SelectOption.getKnoTypeData = function getKnoTypeData() {
	return [
		{code: 1, name: "地震知识"},
		{code: 2, name: "海啸知识"},
		{code: 3, name: "防火知识"}
	];
};
SelectOption.loadKnoType = function loadKnoType(code) {
	SelectOption.loadBaseCode(SelectOption.getKnoTypeData(), code);
};

/**
 * 标准及技术规范-标准类型
 */
SelectOption.getStandardTypeData = function getStandardTypeData() {
	return [
		{code: 1, name: "地震标准"},
		{code: 2, name: "危化品泄露标准"}
	];
};
SelectOption.loadStandardType = function loadStandardType(code) {
	SelectOption.loadBaseCode(SelectOption.getStandardTypeData(), code);
};

/**
 * 标准及技术规范-标准等级
 */
SelectOption.getStandardLevelData = function getStandardLevelData() {
	return [
		{code: 1, name: "一级"},
		{code: 2, name: "二级"},
		{code: 3, name: "三级"}
	];
};
SelectOption.loadStandardLevel = function loadStandardLevel(code) {
	SelectOption.loadBaseCode(SelectOption.getStandardLevelData(), code);
};


/**
 * 标准及技术规范-法律效力
 */
SelectOption.getLawForceData = function getLawForceData() {
	return [
		{code: 1, name: "强制性标准"},
		{code: 2, name: "推荐性标准"},
		{code: 3, name: "其他"}
	];
};
SelectOption.loadLawForce = function loadLawForce(code) {
	SelectOption.loadBaseCode(SelectOption.getLawForceData(), code);
};

/**
 * 政策文件-密级
 */
SelectOption.getSecretLevelData = function getSecretLevelData() {
	return [
		{code: 1, name: "绝密"},
		{code: 2, name: "机密"},
		{code: 3, name: "秘密"},
		{code: 4, name: "限制"},
		{code: 5, name: "公开"},
		{code: 6, name: "其他"}
	];
};
SelectOption.loadSecretLevel = function loadSecretLevel(code) {
	SelectOption.loadBaseCode(SelectOption.getSecretLevelData(), code);
};

/**
 * 应急救援查询
 */
SelectOption.getResourceType = function getResourceType() {
	return [
		{code: 1, name: "物资装备"},
		{code: 2, name: "救援队伍"},
		{code: 3, name: "应急专家"},
		{code: 4, name: "避难场所"},
		{code: 5, name: "医疗资源"}
//		{code: 6, name: "其他"}
	];
};
SelectOption.loadResourceType = function loadResourceType(code) {
	SelectOption.loadBaseCode(SelectOption.getResourceType(), code);
};

/**
 * 应急队伍类型
 */

SelectOption.getTeamDate = function getTeamDate() {
	var data=new Array();
	data.push({code : 1, name : "油汽类事故处置队"});
	data.push({code : 2, name : "医疗救护队"});
	data.push({code : 3, name : "海上搜救队"});
	data.push({code : 4, name : "危险打捞队"});
	data.push({code : 5, name : "消防救援队"});
	data.push({code : 6, name : "危险化学品事故救援队"});
	data.push({code : 7, name : "防汛机动抢险队"});
	data.push({code : 8, name : "通讯保障队"});
	data.push({code : 9, name : "电力抢修队"});
	data.push({code : 10, name : "供气抢修队"});
	data.push({code : 11, name : "排水污水处理抢险队"});
	data.push({code : 12, name : "矿山事故救援队"});
	data.push({code : 13, name : "地震救援队"});
	data.push({code : 14, name : "陆地搜寻与救护队"});
	data.push({code : 15, name : "救援列车队"});
	data.push({code : 16, name : "抗旱服务队"});
	data.push({code : 17, name : "重大队伍疫病应急救援队"});
	data.push({code : 18, name : "专业森林消防队"});
	data.push({code : 19, name : "林业有害生物灾害应急专业队"});
	data.push({code : 20, name : "食物中毒事件应急预备队"});
	data.push({code : 21, name : "路桥抢修队"});
	data.push({code : 22, name : "园林养护抢险队"});
	data.push({code : 23, name : "其他专业救援队"});
	data.push({code : 23, name : "油汽类事故处置"});
	data.push({code : 24, name : "救捞队"});
	data.push({code : 25, name : "运输队"});
	data.push({code : 26, name : "医疗救护队"});
	data.push({code : 27, name : "危险化学品救援队"});
	data.push({code : 28, name : "地震救援队"});
	data.push({code : 29, name : "防汛抗旱队"});
	data.push({code : 30, name : "抢险抢修队"});
	data.push({code : 31, name : "其他"})
	return data;
};
SelectOption.loadTeamType = function loadTeamType(code) {
	SelectOption.loadBaseCode(SelectOption.getTeamDate(), code);
};
SelectOption.getTeamType=function getTeamType(code){
	if(code==null)
		return "";
	return SelectOption.getCodeName(SelectOption.getTeamDate(),code);
};

/**
 *  应急队伍级别
 */
SelectOption.getTeamRankData = function getTeamRankData() {
		var data=new Array();
		data.push({code : 1, name : '国家级'});
	    data.push({code : 2, name : '省级'});
	    data.push({code : 3, name : '地市级'});
	    data.push({code : 4, name : '县级'});
	    data.push({code : 5, name : '企业级'});
	    return data;
};
SelectOption.loadTeamRank = function loadTeamRank(code) {
	SelectOption.loadBaseCode(SelectOption.getTeamRankData(), code);
};
SelectOption.getTeamRank=function getTeamRank(code){
	if(code==null)
		return "";
	return SelectOption.getCodeName(SelectOption.getTeamRankData(),code);
};

/**
 *  队伍救援专业
 */
SelectOption.getTeamProfessionalData = function getTeamProfessionalData() {
		var data=new Array();
		data.push({code : 1, name : '救援'});
	    data.push({code : 2, name : '救护'});
	    data.push({code : 3, name : '掘进'});
	    data.push({code : 4, name : '通风'});
	    data.push({code : 5, name : '堵漏'});
	    data.push({code : 6, name : '其他'});
	    return data;
};
SelectOption.loadTeamProfessional = function loadTeamProfessional(code) {
	SelectOption.loadBaseCode(SelectOption.getTeamProfessionalData(), code);
};
SelectOption.getTeamProfessional=function getTeamProfessional(code){
	if(code==null)
		return "";
	return SelectOption.getCodeName(SelectOption.getTeamProfessionalData(),code);
};

//队伍适用行业

SelectOption.getTeamBusinessData = function getTeamBusinessData() {
	var data=new Array();
		data.push({code : 1, name : '煤炭开采'});
        data.push({code : 2, name : '采矿业'});
        data.push({code : 3, name : '石油加工'});
        data.push({code : 4, name : '化学原料制造业'});
        data.push({code : 5, name : '金属冶炼'});
        return data;
};
SelectOption.loadTeamBusiness = function loadTeamBusiness(code) {
	SelectOption.loadBaseCode(SelectOption.getTeamBusinessData(), code);
};
SelectOption.getTeamBusiness=function getTeamBusiness(code){
	if(code==null)
		return "";
	return SelectOption.getCodeName(SelectOption.getTeamBusinessData(),code);
};

//擅长处置事故类型

SelectOption.getTeamDealtypeData = function getTeamDealtypeData() {
	var data=new Array();
		data.push({code : 1, name : '物体打击'});
        data.push({code : 2, name : '车辆伤害'});
        data.push({code : 3, name : '机械伤害'});
        data.push({code : 4, name : '起重伤害'});
        data.push({code : 5, name : '触电'});
        data.push({code : 6, name : '淹溺'});
        data.push({code : 1, name : '灼烫'});
        data.push({code : 2, name : '火灾'});
        data.push({code : 3, name : '高处坠落'});
        data.push({code : 4, name : '坍塌'});
        data.push({code : 5, name : '冒顶片帮'});
        data.push({code : 6, name : '透水'});
        data.push({code : 3, name : '爆破'});
        data.push({code : 4, name : '火药爆照'});
        data.push({code : 5, name : '瓦斯爆炸'});
        data.push({code : 6, name : '锅炉爆炸'});
        data.push({code : 1, name : '容器爆炸'});
        data.push({code : 2, name : '其他爆炸'});
        data.push({code : 3, name : '中毒和窒息'});
        data.push({code : 4, name : '其他伤害'}); 
        return data;
};
SelectOption.loadTeamDealtype = function loadTeamDealtype(code) {
	SelectOption.loadBaseCode(SelectOption.getTeamDealtypeData(), code);
};
SelectOption.getTeamDealtype=function getTeamDealtype(code){
	if(code==null)
		return "";
	return SelectOption.getCodeName(SelectOption.getTeamDealtypeData(),code);
};

//队伍资质
SelectOption.getTeamQualifyYData = function getTeamQualifyYData() {
	var data=new Array();
	data.push({code : 1, name : '一级'});
    data.push({code : 2, name : '二级'});
    data.push({code : 3, name : '三级'});
    data.push({code : 4, name : '四级'});
    data.push({code : 5, name : '未知'});
    return data;
};
SelectOption.loadTeamQualify = function loadTeamQualify(code) {
	SelectOption.loadBaseCode(SelectOption.getTeamQualifyYData(), code);
};
SelectOption.getTeamQualify=function getTeamQualify(code){
	if(code==null)
		return "";
	return SelectOption.getCodeName(SelectOption.getTeamQualifyYData(),code);
};

//队伍等级
SelectOption.getTeamLevelYData = function getTeamLevelYData() {
	var data=new Array();
	data.push({code : 1, name : '特级'});
    data.push({code : 2, name : '一级'});
    data.push({code : 3, name : '二级'});
    data.push({code : 4, name : '三级'});
    data.push({code : 5, name : '未知'});
    return data;
};
SelectOption.loadTeamLevel = function loadTeamLevel(code) {
	SelectOption.loadBaseCode(SelectOption.getTeamLevelYData(), code);
};
SelectOption.getTeamLevel=function getTeamLevel(code){
	if(code==null)
		return "";
	return SelectOption.getCodeName(SelectOption.getTeamLevelYData(),code);
};
/**
 * 达拉特安监-风险类型管理-风险6大分类
 * @author 刘晓斌
 * @date 2017-9-14
 * @return
 */
SelectOption.loadRiskTypeSelect = function loadRiskTypeSelect(code, jsonParam){
	SelectOption.loadBaseCodeFromDB(BASE_URL + "dangersource/dssrsktype/loadRiskTypeTree", code, jsonParam);
};

/**
 * 达拉特安监-应急救援首页GIS-事故模拟类型
 * @author 刘晓斌
 * @date 2017-10-17
 * @return
 */
SelectOption.loadEvnAnaType = function loadEvnAnaType(code, jsonParam){
	SelectOption.loadBaseCodeFromDB(BASE_URL + "ems/codeemsanalysismodtype/loadEvnAnaType", code, jsonParam);
};

/**
 * 达拉特安监-应急救援首页GIS-事故模拟时间
 * @author 刘晓斌
 * @date 2017-10-17
 * @return
 */
SelectOption.getEvnAnaSimtime = function getEvnAnaSimtime() {
	return [
		{code: "5", name: "5"},
		{code: "10", name: "10"},
		{code: "20", name: "20"},
		{code: "30", name: "30"},
		{code: "40", name: "40"},
		{code: "50", name: "50"},
		{code: "60", name: "60"},
		{code: "80", name: "80"},
		{code: "100", name: "100"},
		{code: "120", name: "120"}
	];
};
SelectOption.loadEvnAnaSimtime = function loadEvnAnaSimtime(code) {
	SelectOption.loadBaseCode(SelectOption.getEvnAnaSimtime(), code);
};

/**
 * 达拉特安监-应急救援首页GIS--泄漏类型
 * @author 刘晓斌
 * @date 2017-10-17
 * @return
 */
SelectOption.getEvnAnaLkagetype = function getEvnAnaLkagetype() {
	return [
	        {code: "1", name: "连续泄漏"},
	        {code: "2", name: "瞬时泄漏"}
	        ];
};
SelectOption.loadEvnAnaLkagetype = function loadEvnAnaLkagetype(code) {
	SelectOption.loadBaseCode(SelectOption.getEvnAnaLkagetype(), code);
};

SelectOption.getEvnAnaLkagetypeName = function getEvnAnaLkagetypeName(code) {
    if(code==null)
        return "";
    return SelectOption.getCodeName(SelectOption.getEvnAnaLkagetype(),code);
};

//达拉特安监-应急资源-任务接收-任务环节
SelectOption.getTaskStatus = function getTaskStatus() {
	return [
	        {code: "0", name: "未开始"},
	        {code: "1", name: "进行中"},
	        {code: "2", name: "已完成"}
	        ];
};
SelectOption.loadTaskStatustype = function loadTaskStatustype(code) {
	SelectOption.loadBaseCode(SelectOption.getTaskStatus(), code);
};

SelectOption.getTaskStatusData=function getTaskStatusData(code){
    if(code==null)
        return "";
    return SelectOption.getCodeName(SelectOption.getTaskStatus(),code);
};


//任务接收-所处节点
SelectOption.getTaskNodeNameData = function getTaskNodeNameData() {
	return [
	        {code: "1", name: " 应急响应"},
	        {code: "2", name: "组建指挥部"},
	        {code: "3", name: "次生事件及预警"},
	        {code: "4", name: "事件控制策略"},
	        {code: "5", name: "警戒区"},
	        {code: "6", name: "道路封锁"},
	        {code: "7", name: "撤离路线"},
	        {code: "8", name: "救援路线"},
	        {code: "9", name: "应急仓库"},
	        {code: "10", name: "救援队伍"},
	        {code: "11", name: "运输保障"},
	        {code: "12", name: "应急医疗"},
	        {code: "13", name: "通信保障"},
	        {code: "14", name: "避难场所"}
	        ];
};
SelectOption.loadTaskNodeName = function loadTaskNodeName(code) {
	SelectOption.loadBaseCode(SelectOption.getTaskNodeNameData(), code);
};

SelectOption.getTaskNodeName = function getTaskNodeName(code) {
    if(code==null)
        return "";
    return SelectOption.getCodeName(SelectOption.getTaskNodeNameData(),code);
};

//达拉特安监-一企一档-企业信息-特种设备-压力容器-容器类型
SelectOption.getVesselType = function getVesselType() {
	var data=new Array();
	data.push({code: "01", name: "I类"});
    data.push({code: "02", name: "II类"});
    data.push({code: "03", name: "III类"});
    return data;
};
SelectOption.loadVesselType = function loadVesselType(code) {
	SelectOption.loadBaseCode(SelectOption.getVesselType(), code);
};
SelectOption.loadVesselTypeData=function loadVesselTypeData(code){
	if(code==null)
		return "";
	return SelectOption.getCodeName(SelectOption.getVesselType(),code);
};


//达拉特安监-一企一档-企业信息-特种设备-压力容器-安全等级
SelectOption.getSafetylevel = function getSafetylevel() {
	var data=new Array();
	data.push({code: "01", name: "1级"});
    data.push({code: "02", name: "2级"});
    data.push({code: "03", name: "3级"});
    data.push({code: "04", name: "4级"});
    return data;
};
SelectOption.loadSafetylevel = function loadSafetylevel(code) {
	SelectOption.loadBaseCode(SelectOption.getSafetylevel(), code);
};
SelectOption.loadSafetylevelData=function loadSafetylevelData(code){
	if(code==null)
		return "";
	return SelectOption.getCodeName(SelectOption.getSafetylevel(),code);
};

//达拉特安监-一企一档-企业信息-特种设备-压力容器-是否停用
SelectOption.getPrevesselState = function getPrevesselState() {
	var data=new Array();
	data.push({code: "0", name: "正常使用"});
    data.push({code: "1", name: "停用"});
    return data;
};
SelectOption.loadPrevesselState = function loadPrevesselState(code) {
	SelectOption.loadBaseCode(SelectOption.getPrevesselState(), code);
};
SelectOption.loadPrevesselStateData=function loadPrevesselStateData(code){
	if(code==null)
		return "";
	return SelectOption.getCodeName(SelectOption.getPrevesselState(),code);
};


//达拉特安监-一企一档-企业信息-特种设备-压力容器-检验结果
SelectOption.getTestResult = function getTestResult() {
	var data=new Array();
	data.push({code: "0", name: "合格"});
    data.push({code: "1", name: "不合格"});
    return data;
};
SelectOption.loadTestResult = function loadTestResult(code) {
	SelectOption.loadBaseCode(SelectOption.getTestResult(), code);
};
SelectOption.loadTestResultData=function loadTestResultData(code){
	if(code==null)
		return "";
	return SelectOption.getCodeName(SelectOption.getTestResult(),code);
};

/**
 * 获取政府视频类型
 * @author 刘晓斌
 * @date 2018-2-6
 * @return
 */
SelectOption.getGovVideoTypeData = function getGovVideoTypeData() {
	return [
		{code: 0, name: "园区"},
		{code: 1, name: "高空聊望"}
	];
};
SelectOption.loadGovVideoType = function loadGovVideoType(code) {
	SelectOption.loadBaseCode(SelectOption.getGovVideoTypeData(), code);
};

/**
 * 获取所属海康平台
 * @author 刘晓斌
 * @date 2018-2-6
 * @return
 */
SelectOption.getHikPlatNumData = function getHikPlatNumData() {
	return [
	        {code: "8200", name: "8200"},
	        {code: "8700", name: "8700"},
	        {code: "HY", name: "HY"},
	        {code: "NVR", name: "NVR"}
	        ];
};
SelectOption.loadHikPlatNum = function loadHikPlatNum(code) {
	SelectOption.loadBaseCode(SelectOption.getHikPlatNumData(), code);
};

/************************************************* base start*******************************************************************************/
/**
 * 加载code
 * 
 * @param loadurl
 *            访问地址
 * @param code
 *            界面ID
 * @return
 */
SelectOption.loadBaseCodeFromDB = function loadBaseCodeFromDB(loadurl, code,jsonParam) {
	var value = $('#' + code).attr("selectvalue");
	$.ajax( {
		type : "post",
		cache : false,
		url : loadurl,
		data: jsonParam,
		dataType : 'json',
		success : function(json) {
                $('#' + code).empty();
			if (json.length > 0) {
				var o = new Option('请选择', '');
				$("#" + code)[0].options.add(o);
				for ( var i = 0; i < json.length; i++) {
					var t = new Option(json[i].name, json[i].code);
					if(json[i].attr){//附带属性
						$(t).attr("attr",json[i].attr);
					}
					$("#" + code)[0].options.add(t);
						if (value == json[i].code) {
							$("#" + code).val(value);
						}
				}
			}else{
			    var o = new Option('请选择', '');
			    $("#" + code)[0].options.add(o);
			}
		}
	});
};

/**
 * 加载code
 * 
 * @param data
 *            数据
 * @param code
 *            界面ID
 * @return
 */
SelectOption.loadBaseCode = function loadBaseCode(data, code) {
	var value = $('#' + code).attr("selectvalue");
	if (data.length > 0) {
		var o = new Option('请选择', '');
		$("#" + code)[0].options.add(o);
		for ( var i = 0; i < data.length; i++) {
			var t = new Option(data[i].name, data[i].code);
			$("#" + code)[0].options.add(t);
			if (value) {
				if (value == data[i].code) {
					$("#" + code).val(value);
				}
			}
		}
	}
};


SelectOption.getCodeName=function getCodeName(data,code){
	for(var i=0;i<data.length;i++){
		if(data[i].code==code){
			return data[i].name;
		}
	}
};





/************************************************* base end*******************************************************************************/
