/**  
 * Project Name:module_enterprise
 * File Name:EntBusinessinfo.java  
 * Package Name:com.zwsafety.module.enterprise.entity
 * Date:2016年05月13日
 * Copyright (c) 2016 ,zwsafety All Rights Reserved.   
 */
package com.hwsafe.enterprise.domain;

import java.io.Serializable;
import java.math.BigDecimal;
import java.util.Date;
import java.util.List;

import org.springframework.format.annotation.DateTimeFormat;

import lombok.Data;


/**
 * @Description:(工商信息组合实体)
 * @date:2015年7月8日
 * @author peijun
 * @version 1.0
 * @since JDK 1.7
 */
@Data
public class EntBusinessInfoBO implements Serializable {
    /**
     * @Fields serialVersionUID:TODO(UID).
     */
    private static final long serialVersionUID = 1L;

    /**
     * @Fields longitude:TODO(经度).
     */
    private BigDecimal longitude;

    /**
     * @Fields latitude:TODO(纬度).
     */
    private BigDecimal latitude;

    /**
     * @Fields updateper:TODO(更新人).
     */
    private String updateper;

    /**
     * @Fields updatetime:TODO(更新时间).
     */
    @DateTimeFormat(pattern = "yyyy-MM-dd hh:mm:ss")
    private Date updatetime = new Date();

    /**
     * @Fields notes:TODO(备注).
     */
    private String notes;

    /**
     * @Fields businessinfoid:TODO(主键id).
     */
    private String businessinfoid;

    /**
     * @Fields entname:TODO(企业名称).
     */
    private String entname;

    /**
     * @Fields entcode:TODO(组织机构代码).
     */
    private String entcode;

    /**
     * @Fields districtcode:TODO(行政区域/市).
     */
    private String city;

    /**
     * @Fields area:TODO(行政区域/区县).
     */
    private String area;

    /**
     * @Fields street:TODO(行政区域/街道办).
     */
    private String street;

    /**
     * @Fields community:TODO(行政区域/社区).
     */
    private String community;

    /**
     * @Fields postcode:TODO(邮政编码).
     */
    private String postcode;

    /**
     * @Fields address:TODO(注册地址).
     */
    private String address;

    /**
     * @Fields registerdate:TODO(注册时间).
     */
    @DateTimeFormat(pattern = "yyyy-MM-dd")
    private Date registerdate;

    /**
     * @Fields enttype:TODO(注册类型).
     */
    private String enttype;

    /**
     * @Fields legalperson:TODO(法定代表人).
     */
    private String legalperson;

    /**
     * @Fields phone:TODO(手机号码).
     */
    private String phone;

    /**
     * @Fields registernum:TODO(注册号).
     */
    private String registernum;

    /**
     * @Fields registermoney:TODO(注册资本（万元）).
     */
    private BigDecimal registermoney;

    /**
     * @Fields naissancedate:TODO(成立时间).
     */
    @DateTimeFormat(pattern = "yyyy-MM-dd")
    private Date naissancedate;

    /**
     * @Fields registeruser:TODO(注册用户).
     */
    private String registeruser;

    /**
     * @Fields validstartdate:TODO(营业期限(开始日期)).
     */
    @DateTimeFormat(pattern = "yyyy-MM-dd")
    private Date validstartdate;

    /**
     * @Fields validenddate:TODO(营业期限(结束日期)).
     */
    @DateTimeFormat(pattern = "yyyy-MM-dd")
    private Date validenddate;

    /**
     * @Fields validenddate:TODO(是否无期限).
     */
    private String isvalid;

    /**
     * @Fields mainproduct:TODO(经营范围).
     */
    private String mainproduct;

    /**
     * @Fields directortypeid:TODO(行业主管分类).
     */
    private String directortypeid;

    /**
     * @Fields islittle:TODO(是否"三小场所").
     */
    private String islittle;

    /**
     * @Fields isscale:TODO(是否规模企业).
     */
    private String isscale;

    /**
     * @Fields subjection:TODO(单位管辖隶属关系).
     */
    private String subjection;

    /**
     * @Fields status:TODO(信息状态).
     */
    private String status;

    /**
     * @Fields datastatus:TODO(数据状态0:已删除，1：未删除).
     */
    private String datastatus;

    /**
     * @Fields allorgname:TODO(所关联的行业主管部门).
     */
    private String allorgname;

    /**
     * @Fields gisid:TODO(GIS地理信息id).
     */
    private String gisid;

    /**
     * @Fields allorgname:TODO(所关联的行业主管分类).
     */
    private String directortypename;

    /**
     * @Fields industryorg:TODO(行业主管部门编号).
     */
    private String industryorg;

    /**
     * @Fields industryorg:TODO(行业主管部门名称).
     */
    private String industryorgname;
    
    /************辅助属性开始*************/
    private String cityname;
    
    private String areaname;
    
    private String streetname;
    
    private String communityname;
    
    private List<EntAddress> entAddresses;
    
   
}
