/**  
 * Project Name:xx项目工程(英文名称)
 * File Name:SysOrg.java  
 * Package Name:com.zwsafety.module.system.entity
 * Date:2016年04月27日
 * Copyright (c) 2016 ,zwsafety All Rights Reserved.   
 */
package com.hwsafe.sys.domain;

import java.io.Serializable;
import java.util.Date;



import org.springframework.format.annotation.DateTimeFormat;

import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;

import lombok.Data;

/**
 * @ClassName:SysUser
 * @Description:TODO(用一句话描述该文件做什么)
 * @date:2015年7月8日
 * @author peijun
 * @version 1.0
 * @since JDK 1.7
 */
@Data
@TableName(value = "sys_org")
public class SysOrg implements Serializable {
    /**
     * @Fields serialVersionUID:TODO(UID).
     */
    private static final long serialVersionUID = 1L;

    /**
     * @Fields orgid:TODO(机构主键).
     */
    @TableId
    private String orgid;

    /**
     * @Fields districtcode:TODO(行政区域代码).
     */
    private String districtcode;

    /**
     * @Fields parentid:TODO(上级机构主键).
     */
    private String parentid;

    /**
     * @Fields orgname:TODO(机构名称).
     */
    private String orgname;

    /**
     * @Fields address:TODO(联系地址).
     */
    private String address;

    /**
     * @Fields orgcode:TODO(单位组织机构代码).
     */
    private String orgcode;

    /**
     * @Fields postcode:TODO(邮政代码).
     */
    private String postcode;

    /**
     * @Fields principal:TODO(主要负责人).
     */
    private String principal;

    /**
     * @Fields fax:TODO(传真).
     */
    private String fax;

    /**
     * @Fields principalotel:TODO(负责人办公电话).
     */
    private String principalotel;

    /**
     * @Fields principalmtel:TODO(负责人移动电话).
     */
    private String principalmtel;

    /**
     * @Fields updatetime:TODO(更新时间).
     */
    @DateTimeFormat(pattern = "yyyy-MM-dd")
    private Date updatetime;

    /**
     * @Fields note:TODO(备注).
     */
    private String note;

    /**
     * @Fields updateper:TODO(更新人).
     */
    private String updateper;

    /**
     * @Fields ismember:TODO(是否安委会成员单位).
     */
    private String ismember;
    /**
     * @Fields parentmember:TODO(上级单位).
     */
    private String parentmember;
    /**
     * @Fields ordernum:TODO(顺序号).
     */
    private Integer ordernum;
    /**
     * @Fields ordernum:TODO(安监办名称).
     */
    private String membername;

    

}
