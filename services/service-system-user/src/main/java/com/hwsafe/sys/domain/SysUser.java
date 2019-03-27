package com.hwsafe.sys.domain;
/**  
 * Project Name:xx项目工程(英文名称)
 * File Name:SysUser.java  
 * Package Name:com.zwsafety.module.system.entity
 * Date:2016年01月14日
 * Copyright (c) 2016 ,zwsafety All Rights Reserved.   
 */

import java.io.Serializable;
import java.util.Date;

import org.springframework.format.annotation.DateTimeFormat;

import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;

import lombok.Data;

/**
 * @ClassName:SysUser
 * @Description:用户信息实体类
 * @date:2016年1月14日
 * @author xufeng
 * @version 1.0
 * @since JDK 1.8
 */
@Data
@TableName(value="sys_user")
public class SysUser implements Serializable {
    /**
     * @Fields serialVersionUID:TODO(UID).
     */
    private static final long serialVersionUID = 1L;

    /**
     * @Fields userid:TODO(用户id).
     */
    @TableId(value="userid")
    private String userid;

    /**
     * @Fields username:TODO(账号).
     */
    private String username;

    /**
     * @Fields password:TODO(密码).
     */
    private String password;

    /**
     * @Fields newpassword:TODO(新密码).
     */
    private String newpassword;

    /**
     * @Fields nickname:TODO(用户名字).
     */
    private String nickname;

    /**
     * @Fields email:TODO(用户邮箱).
     */
    private String email;

    /**
     * @Fields phone:TODO(移动电话).
     */
    private String phone;

    /**
     * @Fields sex:TODO(性别).
     */
    private String sex;

    /**
     * @Fields birthday:TODO(出生日期).
     */
    @DateTimeFormat(pattern = "yyyy-MM-dd")
    private Date birthday;

    /**
     * @Fields idcard:TODO(身份证).
     */
    private String idcard;

    /**
     * @Fields tel:TODO(办公电话).
     */
    private String tel;

    /**
     * @Fields address:TODO(家庭住址).
     */
    private String address;

    /**
     * @Fields hometel:TODO(家庭电话).
     */
    private String hometel;

    /**
     * @Fields usertype:TODO(用户类型(0:系统管理员)).
     */
    private String usertype;

    /**
     * @Fields updatetime:TODO(更新时间).
     */
    @DateTimeFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    private Date updatetime = new Date();

    /**
     * @Fields updatetime:TODO(更新人).
     */
    private String updateper;

    /**
     * @Fields note:TODO(备注).
     */
    private String note;

    /**
     * @Fields organid:TODO(机构/企业id).
     */
    private String organid;
    /**
     * 机构
     */
    private SysOrg sysOrg;

    /**
     * @Fields sysdepart:TODO(部门表).
     */
    private SysDepart sysdepart;

    /**
     * @Fields sysuser:TODO(用户表).
     */
    private SysUser sysuser;

    /**
     * @Fields orgid:TODO(部门id).
     */
    private String departid;

    /**
     * @Fields checkstates:TODO(审核状态).
     */
    private String checkstates;

    /**
     * @Fields userstates:TODO(用户状态).
     */
    private String userstates;

    /**
     * @Fields jobtype:TODO(职务类型).
     */
    private String jobtype;

    /**
     * @Fields execcode:TODO(执法编号).
     */
    private String execcode;
    
    /**
     * 区域数据权限标识(0:没有区域数据权限， 1：有区域数据权限)
     */
    private Integer areapriflag;

   


}
