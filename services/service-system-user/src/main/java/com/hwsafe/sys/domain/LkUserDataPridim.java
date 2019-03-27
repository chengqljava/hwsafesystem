package com.hwsafe.sys.domain;
/**  
 * Project Name:xx项目工程(英文名称)
 * File Name:LKUSERDATAPRIDIM.java  
 * Package Name:com.zwsafety.module.demo.entity
 * Date:2019年03月21日
 * Copyright (c) 2019 ,zwsafety All Rights Reserved.   
 */


import java.io.Serializable;
import java.util.Date;

import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;

import lombok.Data;



 /**  
* @ClassName:SysUser 
* @Description:区域角色关联
* @date:2019 03 21
* @author   
* @version   1.0
* @since  JDK 1.8  
*/
@Data
@TableName(value = "LK_USER_DATAPRIDIM")
public class LkUserDataPridim implements Serializable {
    /**  
    * @Fields serialVersionUID:TODO(UID).  
    */
	private static final long serialVersionUID = 1L;

	/**	* @Fields id:TODO(主键ID).	*/	@TableId	private String id;		/**	* @Fields userid:TODO(用户ID).	*/	private String userid;		/**	* @Fields datapriid:TODO(数据权限维度ID（区域表等）).	*/	private String datapriid;		/**	* @Fields datapritype:TODO(数据权限维度标识类型(0:区域)).	*/	private Integer datapritype;		/**	* @Fields createtime:TODO(创建时间).	*/	private Date createtime;		/**	* @Fields createrid:TODO(创建者ID).	*/	private String createrid;	
}

