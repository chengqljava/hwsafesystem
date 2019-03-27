/**  
 * Project Name:xx项目工程(英文名称)
 * File Name:EntAddress.java  
 * Package Name:com.zwsafety.module.enterprise.entity
 * Date:2016年06月21日
 * Copyright (c) 2016 ,zwsafety All Rights Reserved.   
 */
package com.hwsafe.enterprise.domain;

import java.io.Serializable;

import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;

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
@TableName(value="ent_address")
public class EntAddress implements Serializable {
    /**  
    * @Fields serialVersionUID:TODO(UID).  
    */
	private static final long serialVersionUID = 1L;

	/**	* @Fields addressid:TODO(企业地址id).	*/
	@TableId	private String addressid;		/**	* @Fields addressname:TODO(地址名称).	*/	private String addressname;		/**	* @Fields businessinfoid:TODO(企业工商信息id).	*/	private String businessinfoid;		/**	* @Fields addresstype:TODO(地址类型).	*/	private String addresstype;			
}

