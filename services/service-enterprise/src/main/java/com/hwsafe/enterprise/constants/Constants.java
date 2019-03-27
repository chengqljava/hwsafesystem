/**  
 * Project Name:module_enterprise
 * File Name:Constants.java  
 * Package Name:com.zwsafety.module.enterprise.constants
 * Date:2016年9月15日   
 * Copyright (c) 2016,zwsafety All Rights Reserved.   
 */
package com.hwsafe.enterprise.constants;

/**
 * @ClassName:Constants
 * @Description:TODO(常量类)
 * @date:2016年5月23日
 * @author peijun
 * @version 1.0
 * @since JDK 1.7
 */
public interface Constants {

    /***************** 企业信息数据状态 ******************************/
    /**
     * 已删除
     */
    public static final String ENTERPRISE_BASEINFO_STATUS_NODELETE = "0";

    /**
     * 未删除
     */
    public static final String ENTERPRISE_BASEINFO_STATUS_YESDELETE = "1";

    /***************** 企业信息采集状态 ******************************/
    /**
     * 未填报
     */
    public static final String ENTERPRISE_BASEINFO_STATUS_NOREPORT = "0";

    /**
     * 填报中
     */
    public static final String ENTERPRISE_BASEINFO_STATUS_ONGOING = "1";

    /**
     * 更新中
     */
    public static final String ENTERPRISE_BASEINFO_STATUS_UPDATING = "2";

    /**
     * 已上报
     */
    public static final String ENTERPRISE_BASEINFO_STATUS_YESREPORT = "3";

    /***************** 企业信息审核状态 ******************************/
    /**
     * 审核未通过
     */
    public static final String ENTERPRISE_BASEINFO_STATUS_YESAUDIT = "0";

    /**
     * 审核通过
     */
    public static final String ENTERPRISE_BASEINFO_STATUS_NOAUDIT = "1";

    /***************** 文件上传路径 ******************************/
    /**
     * 企业信息->安全生产管理资料
     */
    public static final String UPLOAD_PATH_ENTERPRISE_SAFEPRODATA = "/enterprise/safeprodata/";

    /**
     * 危化品许可图片上传路径
     * 
     */
    public static final String UPLOAD_PATH_DANEXCLUSIVE_IMAGE = "/enterprise/danexclusive/";

    /**
     * 危险作业文件上传路径
     * 
     */
    public static final String UPLOAD_PATH_ENTHAZARDOUSJOB_FILE = "/enterprise/entHazardousjob/";

    /**
     * 输送管道文件上传路径ENTRUNNINGPIP
     * 
     */
    public static final String UPLOAD_PsATH_ENTRUNNINGPIP_FILE = "/enterprise/entrunningpip/";

    /**
     * 企业平面图上传路径
     * 
     */
    public static final String UPLOAD_PATH_ENTPLAN_IMAGE = "/enterprise/entplan/";

    /**
     * 安全制度管理清单上传路径
     * 
     */
    public static final String UPLOAD_PATH_ENTSAFEMGRPROJ_FILE = "/enterprise/entsafemgrproj/";
    
    /**
     * 企业信息excel导入上传路径
     */
    public static final String UPLOAD_PATH_ENTBUSINESSINFO_EXCEL = "/enterprise/entbusinessinfo/";

    /**
     * 重大危险源备案材料路径
     * 
     */
    public static final String UPLOAD_PATH_DSSCASEATTACH_FILE = "/dangersource/dssCaseattach/";

    /**
     * 安全生产管理机构图
     *
     */
    public static final String UPLOAD_PATH_ENTSAFEORG_ATTACH_FILE = "/enterprise/entsafeorg/";
    /**
     * 消防应急疏散图
     *
     */
    public static final String UPLOAD_PATH_SAFEBUGOUT_ATTACH_FILE = "/enterprise/entfirebugout/";

    /***************** 分类分级状态 ******************************/
    /**
     * 未分级
     */
    public static final String ENTERPRISE_CLASSGRADE_NO = "0";

    /**
     * A级
     */
    public static final String ENTERPRISE_CLASSGRADE_A = "1";

    /**
     * B级
     */
    public static final String ENTERPRISE_CLASSGRADE_B = "2";

    /**
     * C级
     */
    public static final String ENTERPRISE_CLASSGRADE_C = "3";

    /**
     * D级
     */
    public static final String ENTERPRISE_CLASSGRADE_D = "4";

    /**
     * 资格资质证书图片上传路径
     * 
     */
    public static final String UPLOAD_PATH_PERMITPHOTO_IMAGE = "/enterprise/permitphoto/";
    
    
    
    
    /**
     * 执法依据excel导入 notempty:取值true/false,默认值 false,true不可为空 false可以为空
     * length：min,max如果为空,默认为0，类型必须是int型数字 message:返回的错误信息,可以为空
     * type可以为空,默认为String类型 其他字段不可为空 此字段和数据库字段对应 顺序也要和excel表格中的字段顺序一致
     * */
    public static String ENTBUSINESSINFO_VALIDATION = "["
            + "{\"fieldname\":\"entname\",\"type\":\"java.lang.String\",\"notempty\":\"false\"},"
            + "{\"fieldname\":\"entcode\",\"type\":\"java.lang.String\",\"notempty\":\"false\"},"
            + "{\"fieldname\":\"naissancedate\",\"type\":\"java.util.Date\",\"notempty\":\"false\"},"
            + "{\"fieldname\":\"validstartdate\",\"type\":\"java.util.Date\",\"notempty\":\"false\"},"
            + "{\"fieldname\":\"validenddate\",\"type\":\"java.util.Date\",\"notempty\":\"false\"},"
            + "{\"fieldname\":\"address\",\"type\":\"java.lang.String\",\"notempty\":\"false\"},"
            + "{\"fieldname\":\"enttype\",\"type\":\"java.lang.String\",\"notempty\":\"false\"},"
            + "{\"fieldname\":\"legalperson\",\"type\":\"java.lang.String\",\"notempty\":\"false\"},"
            + "{\"fieldname\":\"phone\",\"type\":\"java.lang.String\",\"notempty\":\"false\"},"
            + "{\"fieldname\":\"mainproduct\",\"type\":\"java.lang.String\",\"notempty\":\"false\"}]";

    public static final String UPLOAD_PATH_APTITUDE_FILE = "/enterprise/contractoraptitude/";
    String UPLOAD_PATH_CONTRACTOR_FILE = "/enterprise/contractorexcel/";
    
    
    
    /***************** 企业通讯录用户状态 ******************************/
    /**
     * 正常
     */
    public static final Integer ENTCONTACTS_CONSTATES_NORMAL = 1;

    /**
     * 已删除
     */
    public static final Integer ENTCONTACTS_CONSTATES_DELETE = 2;
    
}
