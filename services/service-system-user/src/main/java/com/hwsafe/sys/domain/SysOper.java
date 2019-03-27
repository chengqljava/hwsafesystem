/**  
 * Project Name:xx项目工程(英文名称)
 * File Name:SysOper.java  
 * Package Name:com.zwsafety.module.system.entity
 * Date:2016年01月14日
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
 * @Description:操作实体类
 * @date:2015年7月8日
 * @author peijun
 * @version 1.0
 * @since JDK 1.7
 */
@Data
@TableName(value = "sys_oper")
public class SysOper implements Serializable {
    /**
     * @Fields serialVersionUID:TODO(UID).
     */
    private static final long serialVersionUID = 1L;

    /**
     * @Fields operid:TODO(操作ID).
     */
    @TableId
    private String operid;

    /**
     * @Fields note:TODO(备注).
     */
    private String note;

    /**
     * @Fields opercode:TODO(操作编码).
     */
    private String opercode;

    /**
     * @Fields opername:TODO(操作名称).
     */
    private String opername;

    /**
     * @Fields ordernum:TODO(操作排序).
     */
    private Integer ordernum;

    /**
     * @Fields ordernum:TODO(样式名称).
     */
    private String operstyle;

    /**
     * @Fields updateper:TODO(更新人).
     */
    private String updateper;

    /**
     * @Fields updatetime:TODO(更新时间).
     */
    @DateTimeFormat(pattern = "yyyy-MM-dd")
    private Date updatetime;

    /**
     * @Fields privid:TODO(权限ID).
     */
    private String privid;

    

}
