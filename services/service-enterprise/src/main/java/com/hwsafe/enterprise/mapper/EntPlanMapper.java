/**  
 * Project Name:xx项目工程(英文名称)
 * File Name:EntPlanMapper.java  
 * Package Name:package com.zwsafety.module.enterprise.dao
 * Date:2016年06月06日
 * Copyright (c) 2016 ,zwsafety All Rights Reserved.   
 */
package com.hwsafe.enterprise.mapper;

import java.util.List;
import java.util.Map;

import org.apache.ibatis.annotations.Param;
import org.springframework.stereotype.Repository;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.hwsafe.enterprise.domain.EntPlan;

 /**
 * @ClassName:EntPlanMapper
 * @Description:TODO(用一句话描述该文件做什么)
 * @date:2016年06月06日
 * @author xufeng
 * @version 1.0
 * @since JDK 1.7
 */
public interface EntPlanMapper extends BaseMapper<EntPlan> {
	
	 /**
	     * 
	    * @Title:loadByPage
	    * @Description TODO(根据企业id查询平面图及附件). 
	    * TODO(这里描述这个方法适用条件 – 可选).
	    * TODO(这里描述这个方法的执行流程 – 可选).
	    * TODO(这里描述这个方法的使用方法 – 可选).
	    * TODO(这里描述这个方法的注意事项 – 可选).
	    * @date  2017年11月1日 
	    * @author Administrator  
	    * @param entid
	    * @return
	    * @throws Exception
	     */
	    public List<Map<String, Object>> loadByPage(@Param("entid") String entid) throws Exception;
}
