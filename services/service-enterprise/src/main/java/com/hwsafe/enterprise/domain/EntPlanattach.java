/**  
 * Project Name:xx项目工程(英文名称)
 * File Name:EntPlanattach.java  
 * Package Name:com.zwsafety.module.enterprise.entity
 * Date:2016年06月06日
 * Copyright (c) 2016 ,zwsafety All Rights Reserved.   
 */
package com.hwsafe.enterprise.domain;

import java.io.Serializable;
import java.util.Date;

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
@TableName(value="ent_planattach")
public class EntPlanattach implements Serializable {
    /**
     * @Fields serialVersionUID:TODO(UID).
     */
    private static final long serialVersionUID = 1L;

    /**
     * @Fields attachid:TODO(主键id).
     */
    @TableId
    private String attachid;

    /**
     * @Fields attachurl:TODO(附件url).
     */
    private String attachurl;

    /**
     * @Fields attachtype:TODO(附件类型).
     */
    private String attachtype;

    /**
     * @Fields uploadtime:TODO(上传时间).
     */
    private Date uploadtime;

    /**
     * @Fields attachname:TODO(附件名称).
     */
    private String attachname;

    /**
     * @Fields planid:TODO(平面图id).
     */
    private String planid;

   

  

}
