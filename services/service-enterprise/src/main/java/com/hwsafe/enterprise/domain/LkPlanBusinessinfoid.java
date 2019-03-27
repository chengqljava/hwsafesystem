/**  
 * Project Name:xx项目工程(英文名称)
 * File Name:LkPlanBusinessinfoid.java  
 * Package Name:com.zwsafety.module.enterprise.entity
 * Date:2017年10月12日
 * Copyright (c) 2017 ,zwsafety All Rights Reserved.   
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
@TableName(value = "lk_plan_businessinfoid")
public class LkPlanBusinessinfoid implements Serializable {
    /**  
    * @Fields serialVersionUID:TODO(UID).  
    */
	private static final long serialVersionUID = 1L;

	/**	* @Fields busplanid:TODO(主键id).	*/	@TableId	private String busplanid;		/**	* @Fields planid:TODO(平面图id).	*/	private String planid;		/**	* @Fields businessinfoid:TODO(企业id).	*/	private String businessinfoid;		
}

