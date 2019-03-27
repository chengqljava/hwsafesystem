/**  
 * Project Name:module_system
 * File Name:LkRolePriv.java  
 * Package Name:
 * Date:2016年04月13日
 * Copyright (c) 2016 ,zwsafety All Rights Reserved.   
 */
package com.hwsafe.sys.domain;

import java.io.Serializable;

import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;

import lombok.Data;



/**
 * 
 * @ClassName:LkRolePriv
 * @Description:角色权限关联实体类
 * @date:2016年4月13日
 * @author yxx
 * @version 1.0
 * @since JDK 1.7
 */
@Data
@TableName(value = "lk_role_priv")
public class LkRolePriv implements Serializable {
    /**
     * @Fields serialVersionUID:TODO(UID).
     */
    private static final long serialVersionUID = 1L;

    /**
     * @Fields conid:TODO().
     */
    @TableId(value="conid")
    private String conid;

    /**
     * @Fields roleid:TODO(角色主键).
     */
    private String roleid;

    /**
     * @Fields privid:TODO(菜单主键).
     */
    private String privid;

    /**
     * @Fields operid:TODO(操作ID).
     */
    private String operid;


}
