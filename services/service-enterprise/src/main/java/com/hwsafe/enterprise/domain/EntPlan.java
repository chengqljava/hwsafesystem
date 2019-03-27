/**  
 * Project Name:xx项目工程(英文名称)
 * File Name:EntPlan.java  
 * Package Name:com.zwsafety.module.enterprise.entity
 * Date:2016年06月06日
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
@TableName(value="ent_plan")
public class EntPlan implements Serializable {
    /**  
    * @Fields serialVersionUID:TODO(UID).  
    */
	private static final long serialVersionUID = 1L;

	/**	* @Fields planid:TODO(主键id).	*/
	@TableId	private String planid;		/**	* @Fields planname:TODO(平面图名称).	*/	private String planname;		/**	* @Fields entid:TODO(企业id).	*/	private String entid;			
}

