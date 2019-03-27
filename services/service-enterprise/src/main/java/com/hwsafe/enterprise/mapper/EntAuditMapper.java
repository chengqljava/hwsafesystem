/**  
 * Project Name:xx项目工程(英文名称)
 * File Name:EntAuditMapper.java  
 * Package Name:package com.zwsafety.module.enterprise.dao
 * Date:2016年05月23日
 * Copyright (c) 2016 ,zwsafety All Rights Reserved.   
 */
package com.hwsafe.enterprise.mapper;


import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.hwsafe.enterprise.domain.EntAudit;


 /**
 * @ClassName:EntAuditMapper
 * @Description:TODO(用一句话描述该文件做什么)
 * @date:2016年05月23日
 * @author peijun
 * @version 1.0
 * @since JDK 1.7
 */
public interface EntAuditMapper extends BaseMapper<EntAudit> {
	
    /**  
    * @Title:deleteByBusinessinfoid
    * @Description TODO(根据工商信息id删除审核信息). 
    * @date  2016年6月1日 
    * @author peijun  
    * @param businessinfoid
    * @throws Exception 
    */
    public void deleteByBusinessinfoid(String businessinfoid)throws Exception;
     
}
