/**  
 * Project Name:系统管理(module_system)
 * File Name:SysPriv.java  
 * Package Name:com.zwsafety.module.system.entity
 * Date:2016年01月14日
 * Copyright (c) 2016 ,zwsafety All Rights Reserved.   
 */
package com.hwsafe.sys.domain;

import java.io.Serializable;
import java.util.Date;
import java.util.List;

import org.springframework.format.annotation.DateTimeFormat;

import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;

import lombok.Data;
 /**  
* @ClassName:SysUser 
* @Description:权限信息实体类
* @date:2016年1月14日 
* @author  xufeng  
* @version   1.0
* @since  JDK 1.8 
*/
@Data
@TableName(value = "sys_priv")
public class SysPriv implements Serializable {
    /**  
    * @Fields serialVersionUID:TODO(UID).  
    */
	private static final long serialVersionUID = 1L;

	/**	* @Fields privid:TODO(权限主键).	*/
	@TableId	private String privid;		/**	* @Fields privname:TODO(权限名称).	*/	private String privname;	
	/**  
	* @Fields privcode:TODO(权限编码).  
	*/
	private String privcode;
	
	/**  
	* @Fields usertype:TODO(用户类型(常量定义暂定：企业：ENT，政府:GOV，系统:SYS)).  
	*/
	private String usertype;
	
	/**	* @Fields privurl:TODO(权限url链接).	*/	private String privurl;		/**	* @Fields privimg:TODO(权限图片).	*/	private String privimg;		/**	* @Fields privlevel:TODO(权限级别).	*/	private String privlevel;		/**	* @Fields parentid:TODO(权限父菜单).	*/	private String parentid;		/**	* @Fields ordernum:TODO(顺序号).	*/	private Integer ordernum;		/**  
	* @Fields updateper:TODO(更新人).  
	*/
	private String updateper;
	
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
	 * @Fields privtype:TODO(权限类型).
	 * @author ly
	 * 权限类型（1：系统内部权限，权限url链接是/模块名开头的
     *         2：跨域权限，权限url链接是http开头的）).
	 */
	private String privtype;
	
	/**  
	* @Fields parentname:TODO(父权限名称).  
	*/
	private String parentname;
	
	/**  
	* @Fields sysOpers:TODO(操作项).  
	*/
	private List<SysOper> sysOpers;
	
	
    
}

