/**  
 * Project Name:xx项目工程(英文名称)
 * File Name:SysUser.java  
 * Package Name:
 * Date:2016年01月14日
 * Copyright (c) 2016 ,zwsafety All Rights Reserved.   
 */
package com.hwsafe.sys.domain;

import java.io.Serializable;
import java.util.Date;



import org.springframework.format.annotation.DateTimeFormat;

import com.baomidou.mybatisplus.annotation.TableName;

import lombok.Data;

/**
 * @ClassName:SysDepart
 * @Description:部门信息实体类
 * @date:2016年4月15日
 * @author luyao
 * @version 1.0
 * @since JDK 1.8
 */
@Data
@TableName(value = "sys_depart")
public class SysDepart implements Serializable {
    /**
     * @Fields serialVersionUID:TODO(UID).
     */
    private static final long serialVersionUID = 1L;

    /**
     * @Fields userid:TODO(部门id).
     */
    private String departid;

    /**
     * @Fields username:TODO(部门名称).
     */
    private String departname;

    /**
     * @Fields password:TODO(部门编码).
     */
    private String departcode;

    /**
     * @Fields newpassword:TODO(上级部门主键).
     */
    private String parentid;

    /**
     * @Fields nickname:TODO(主要负责人).
     */
    private String principal;

    /**
     * @Fields email:TODO(负责人办公电话).
     */
    private String principalotel;

    /**
     * @Fields phone:TODO(负责人移动电话).
     */
    private String principalmtel;

    /**
     * @Fields sex:TODO(传真).
     */
    private String fax;

    /**
     * @Fields updatetime:TODO(更新时间).
     */
    @DateTimeFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    private Date updatetime = new Date();

    /**
     * @Fields note:TODO(备注).
     */
    private String note;
    

    /**
     * @Fields orgid:TODO(所属机构).
     */
    private String orgid;

    
    
    public String getOrgid() {
        
        return orgid;
    }
    
    public void setOrgid(String orgid) {
        
        this.orgid = orgid;
    }
    public String getDepartid() {
        return departid;
    }

    public void setDepartid(String departid) {
        this.departid = departid;
    }

    public String getDepartname() {
        return departname;
    }

    public void setDepartname(String departname) {
        this.departname = departname;
    }

    public String getDepartcode() {
        return departcode;
    }

    public void setDepartcode(String departcode) {
        this.departcode = departcode;
    }

    public String getParentid() {
        return parentid;
    }

    public void setParentid(String parentid) {
        this.parentid = parentid;
    }

    public String getPrincipal() {
        return principal;
    }

    public void setPrincipal(String principal) {
        this.principal = principal;
    }

    public String getPrincipalotel() {
        return principalotel;
    }

    public void setPrincipalotel(String principalotel) {
        this.principalotel = principalotel;
    }

    public String getPrincipalmtel() {
        return principalmtel;
    }

    public void setPrincipalmtel(String principalmtel) {
        this.principalmtel = principalmtel;
    }

    public String getFax() {
        return fax;
    }

    public void setFax(String fax) {
        this.fax = fax;
    }

    public Date getUpdatetime() {
        return updatetime;
    }

    public void setUpdatetime(Date updatetime) {
        this.updatetime = updatetime;
    }

    public String getNote() {
        return note;
    }

    public void setNote(String note) {
        this.note = note;
    }

}
