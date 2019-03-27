/**  
 * Project Name:module_system
 * File Name:SysRole.java  
 * Package Name:com.zwsafety.module.system.entity
 * Date:2016年04月13日
 * Copyright (c) 2016 ,zwsafety All Rights Reserved.   
 */
package com.hwsafe.sys.domain;

import java.io.Serializable;
import java.util.Date;

import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;

import lombok.Data;


/**
 * 
 * @ClassName:SysRole
 * @Description:角色信息实体类
 * @date:2016年4月13日
 * @author yxx
 * @version 1.0
 * @since JDK 1.8
 */
@Data
@TableName(value = "sys_role")
public class SysRole implements Serializable {
    /**
     * @Fields serialVersionUID:TODO(UID).
     */
    private static final long serialVersionUID = 1L;

    /**
     * @Fields roleid:TODO(角色主键).
     */
    @TableId(value="roleid")
    private String roleid;

    /**
     * @Fields rolename:TODO(角色名称).
     */
    private String rolename;

    /**
     * @Fields note:TODO(备注).
     */
    private String note;

    /**
     * @Fields updateTime:TODO(更新时间).
     */
    private Date updatetime;

    /**
     * @Fields updatePer:TODO(更新人).
     */
    private String updateper;

    /**
     * @Fields userType:TODO(用户类型).
     */
    private String usertype;

    /**
     * @Fields orgid:TODO(组织机构ID).
     */
    private String orgid;

    /**
     * @Fields ismember:TODO(是否成员单位).
     */
    private String ismember;

    /**
     * @Fields ismember:TODO(用户级别).
     */
    private String userlevel;
    
    /**
     * @return the roleid
     */
    public String getRoleid() {
        return this.roleid;
    }

    /**
     * @param roleid
     *            the roleid to set
     */
    public void setRoleid(String roleid) {
        this.roleid = roleid;
    }

    /**
     * @return the rolename
     */
    public String getRolename() {
        return this.rolename;
    }

    /**
     * @param rolename
     *            the rolename to set
     */
    public void setRolename(String rolename) {
        this.rolename = rolename;
    }

    /**
     * @return the note
     */
    public String getNote() {
        return this.note;
    }

    /**
     * @param note
     *            the note to set
     */
    public void setNote(String note) {
        this.note = note;
    }

    /**
     * @return the updatetime
     */
    public Date getUpdatetime() {
        return updatetime;
    }

    /**
     * @param updatetime
     *            the updatetime to set
     */
    public void setUpdatetime(Date updatetime) {
        this.updatetime = updatetime;
    }

    /**
     * @return the updateper
     */
    public String getUpdateper() {
        return updateper;
    }

    /**
     * @param updateper
     *            the updateper to set
     */
    public void setUpdateper(String updateper) {
        this.updateper = updateper;
    }

    /**
     * @return the usertype
     */
    public String getUsertype() {

        return usertype;
    }

    
}
