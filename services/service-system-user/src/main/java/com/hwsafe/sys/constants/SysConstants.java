package com.hwsafe.sys.constants;
/**
 * @ClassName:Constants
 * @Description:TODO(常量类)
 * @date:2015年9月22日
 * @author peijun
 * @version 1.0
 * @since JDK 1.8
 */
public interface SysConstants {
    /**
     * session用户key
     * 
     */
    public static final String SESSION_USER_KEY = "SESSION_KEY_OBJ_USER_BEAN";

    /**
     * session菜单key
     * 
     */
    public static final String SESSION_MENU_KEY = "SESSION_KEY_OBJ_MENU_BEAN";
    
    /**
     * session机构key
     * 
     */
    public static final String SESSION_ORG_KEY = "SESSION_KEY_OBJ_ORG_BEAN";

    /**
     * session行政区域key
     * 
     */
    public static final String SESSION_DISTRICT_KEY = "SESSION_KEY_OBJ_DISTRICT_BEAN";
    /**
     * session企业key
     * 
     */
    public static final String SESSION_ENT_KEY = "SESSION_KEY_OBJ_ENT_BEAN";
    
    /**
     * session用户首次登录
     * 
     */
    public static final String SESSION_LOGIN_KEY = "SESSION_KEY_FIRST_LOGIN_BEAN";
    
    /**
     * session应急值守话务员key
     * 
     */
    public static final String SESSION_IVR_KEY = "SESSION_KEY_OBJ_IVR_BEAN";
    

    /***************** 用户默认密码 ******************************/
    public static final String SYSTEM_USER_DEFAULT_PASSWORD = "123456";

    /***************** 用户类型 ******************************/
    /**
     * 政府用戶
     */
    public static final String SYSTEM_USERTYPE_GOV = "GOV";

    /**
     * 企业用戶
     */
    public static final String SYSTEM_USERTYPE_ENT = "ENT";

    /**
     * 系统用戶
     */
    public static final String SYSTEM_USERTYPE_SYS = "SYS";

    /***************** 是否安委会成员单位 ******************************/
    /**
     * 是安委会成员单位(部门)
     */
    public static final String SYSTEM_ISMEMBER_YES = "1";

    /**
     * 不是安委会成员单位(安委会)
     */
    public static final String SYSTEM_ISMEMBER_NO = "0";

    /***************** 权限菜单级别 ******************************/
    /**
     * 根节点
     */
    public static final String SYSTEM_PRIVLEVEL_ROOT = "0";

    /**
     * 一级菜单
     */
    public static final String SYSTEM_PRIVLEVEL_FIRST = "1";

    /**
     * 二级菜单
     */
    public static final String SYSTEM_PRIVLEVEL_SECOND = "2";

    /**
     * 三级菜单
     */
    public static final String SYSTEM_PRIVLEVEL_THIRD = "3";

    /***************** 行政区域级别 ******************************/
    /**
     * 市级
     */
    public static final String SYSTEM_DISTRICT_CITY = "0";

    /**
     * 区县
     */
    public static final String SYSTEM_DISTRICT_AREA = "1";

    /**
     * 街道办
     */
    public static final String SYSTEM_DISTRICT_STREET = "2";

    /**
     * 社区
     */
    public static final String SYSTEM_DISTRICT_COMMUNITY = "3";

    /***************** 用户审核状态 ******************************/
    /**
     * 未审核
     */
    public static final String SYSTEM_CHECKSTATES_NO = "0";

    /**
     * 已审核
     */
    public static final String SYSTEM_CHECKSTATES_YES = "1";

    /***************** 用户状态 ******************************/
    /**
     * 正常
     */
    public static final String SYSTEM_USERSTATES_NORMAL = "1";

    /**
     * 已删除
     */
    public static final String SYSTEM_USERSTATES_DELETE = "2";
    
    /***************** 链接类型 ******************************/
    /**
     * 内部链接
     */
    public static final String SYSTEM_PRIVURL_INSIDE = "1";

    /**
     * 外部链接
     */
    public static final String SYSTEM_PRIVURL_EXTERNAL = "2";
    
    
    /**
     * 企业用户是否含有区域数据权限标识:是
     */
    public static final String SYSTEM_ENTUSER_AREAPRIFLAG_YSE = "1";
    
    /**
     * 企业用户是否含有区域数据权限标识:否
     */
    public static final String SYSTEM_ENTUSER_AREAPRIFLAG_NO = "0";
    
    
    /*******************app版本常量Start*********************************************/
    /**
     * app类型 Android
     */
    public static final String APP_TYPE_ANDROID = "0";
    /**
     * app类型IOS
     */
    public static final String APP_TYPE_IOS = "1";
    /**
     * app是否发布 1发布
     */
    public static final String ISONLINE_TRUE = "1";
    /**
     * app是否发布 0 不发布
     */
    public static final String ISONLINE_FALSE = "0";
    
    /**
	 *app文件上传路径
	 */
	public static final String UPLOAD_PATH_APP_VERSION = "/appVersion/";
/********************app版本常量End********************************************/
	
	//**********短信状态********************//
	
	/**
	 * 草稿
	 */
	public static final String MESSAGE_STATE_NOSEND = "1";
	
	/**
	 * 发送中
	 */
	public static final String MESSAGE_STATE_SENDING = "2";
	
	/**
	 * 发送失败
	 */
	public static final String MESSAGE_STATE_FAIL = "3";
	
	/**
	 * 发送成功
	 */
	public static final String MESSAGE_STATE_SUCCESS = "4";
	
	/***********************系统消息开始***********************/
	
	/**
	 * A:待办事项     B:证书到期    C:监测预警     D:隐患排查    
	 */
	public static String SYS_REMINDTYPE_INFO = "{\"A\":\"有$条待办事项信息\",\"B\":\"有$张证书到期信息\","
	        + "\"C\":\"有$条监测预警信息\",\"D\":\"有$条隐患排查信息\"}";
	
	
	/***********************系统消息结束***********************/
	
	/***********************系统提醒状态开始***********************/
	
	/**
	 * 已查看  
	 */
	public static String SYS_REMIND_STATE_READ = "0";     
	/**
	 * 未查看 
	 */
	public static String SYS_REMIND_STATE_UNREAD = "1";
	
	/***********************系统提醒状态结束***********************/
	
	//**********消息提醒标题*******************//
	/**
	 * 待办文书提醒
	 */
	public static final String REMAND_TITYLE_WS = "待办文书提醒";
	/**
	 * 应急任务提醒
	 */
	public static final String REMAND_TITYLE_RW = "应急任务提醒";
	/**
	 * 资格资质提醒
	 */
	public static final String REMAND_TITYLE_ZGZZ = "资格资质提醒";
	/**
	 * 安全生产责任人证书提醒
	 */
	public static final String REMAND_TITYLE_ZRRZS = "安全生产责任人证书提醒";
	/**
	 * 安全生产管理人证书提醒
	 */
	public static final String REMAND_TITYLE_GLRZS = "安全生产管理人证书提醒";
	/**
	 * 特种作业人员证书提醒
	 */
	public static final String REMAND_TITYLE_TZZYZS = "特种作业人员证书提醒";
	/**
	 * 特种设备作业人员证书提醒
	 */
	public static final String REMAND_TITYLE_TZSBZYZS = "特种设备作业人员证书提醒";
	/**
	 * 危化品许可证书提醒
	 */
	public static final String REMAND_TITYLE_WHPXKZS = "危化品许可证书提醒";
	/**
	 * 隐患信息提醒
	 */
	public static final String REMAND_TITYLE_YHXX = "隐患信息提醒";
	/**
	 * 隐患整改过期提醒
	 */
	public static final String REMAND_TITYLE_YHZGGQ = "隐患整改过期提醒";
	/**
	 * 监测报警提醒
	 */
	public static final String REMAND_TITYLE_JCBJ = "监测报警提醒";
	/**
	 * 故障报警提醒
	 */
	public static final String REMAND_TITYLE_GZBJ = "故障报警提醒";
}
