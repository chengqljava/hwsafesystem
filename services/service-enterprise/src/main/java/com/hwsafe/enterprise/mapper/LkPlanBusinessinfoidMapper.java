/**  
 * Project Name:xx项目工程(英文名称)
 * File Name:LkPlanBusinessinfoidMapper.java  
 * Package Name:package com.zwsafety.module.enterprise.dao
 * Date:2017年10月12日
 * Copyright (c) 2017 ,zwsafety All Rights Reserved.   
 */
package com.hwsafe.enterprise.mapper;

import org.springframework.stereotype.Repository;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.hwsafe.enterprise.domain.LkPlanBusinessinfoid;

import java.util.List;

/**
 * @ClassName:LkPlanBusinessinfoidMapper
 * @Description:TODO(用一句话描述该文件做什么)
 * @date:2017年10月12日
 * @author hanwei
 * @version 1.0
 * @since JDK 1.7
 */
@Repository
public interface LkPlanBusinessinfoidMapper extends BaseMapper<LkPlanBusinessinfoid> {

	/**
	 * 
	 * @Title: loadByBusinessinfoid
	 * @Description TODO(根据企业id获取企业平面图). TODO(这里描述这个方法适用条件 – 可选). TODO(这里描述这个方法的执行流程 –
	 *              可选). TODO(这里描述这个方法的使用方法 – 可选). TODO(这里描述这个方法的注意事项 – 可选).
	 * @date 2017年10月12日
	 * @author admin
	 * @param param
	 * @param pageBounds
	 * @return
	 */
	public List<LkPlanBusinessinfoid> loadByBusinessinfoid(String businessinfoid) throws Exception;
}
