/**  
 * Project Name:xx项目工程(英文名称)
 * File Name:LkUserRole.java  
 * Package Name:
 * Date:2016年01月14日
 * Copyright (c) 2016 ,zwsafety All Rights Reserved.   
 */
package com.hwsafe.sys.domain;

import java.io.Serializable;

import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
 /**  
* @ClassName:SysUser 
* @Description:用户角色关联实体类
* @date:2016年1月14日 
* @author  xufeng  
* @version   1.0
* @since  JDK 1.8  
*/
@TableName(value = "lk_user_role")
public class LkUserRole implements Serializable {
    /**  
    * @Fields serialVersionUID:TODO(UID).  
    */
	private static final long serialVersionUID = 1L;

	/**	* @Fields conid:TODO().	*/
	@TableId(value="deoid")	private String conid;		/**	* @Fields roleid:TODO(角色主键).	*/	private String roleid;		/**	* @Fields userid:TODO(用户id).	*/	private String userid;			/**	* @return the conid	*/	public String getConid() {	    return this.conid;	}		/**	* @param conid the conid to set	*/	public void setConid(String conid) {	    this.conid = conid;	}		/**	* @return the roleid	*/	public String getRoleid() {	    return this.roleid;	}		/**	* @param roleid the roleid to set	*/	public void setRoleid(String roleid) {	    this.roleid = roleid;	}		/**	* @return the userid	*/	public String getUserid() {	    return this.userid;	}		/**	* @param userid the userid to set	*/	public void setUserid(String userid) {	    this.userid = userid;	}	
}

