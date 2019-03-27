/**  
 * Project Name:xx项目工程(英文名称)
 * File Name:EntAudit.java  
 * Package Name:com.zwsafety.module.enterprise.entity
 * Date:2016年05月23日
 * Copyright (c) 2016 ,zwsafety All Rights Reserved.   
 */
package com.hwsafe.enterprise.domain;

import java.io.Serializable;
import java.util.Date;

import org.springframework.format.annotation.DateTimeFormat;

import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import com.hwsafe.sys.domain.SysOrg;

import lombok.Data;
 /**  
* @ClassName:SysUser 
* @Description:TODO(用一句话描述该文件做什么) 
* @date:2015年7月8日 
* @author  peijun  
* @version   1.0
* @since  JDK 1.7  
*/
@Data
@TableName(value="ent_audit")
public class EntAudit implements Serializable {
    /**  
    * @Fields serialVersionUID:TODO(UID).  
    */
	private static final long serialVersionUID = 1L;

	/**
	@TableId
    @DateTimeFormat(pattern = "yyyy-MM-dd")
	private Date audittime;
	
	
	
	
}
