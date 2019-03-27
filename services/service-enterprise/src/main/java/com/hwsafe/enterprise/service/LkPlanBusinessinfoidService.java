/**  
 * Project Name:xx项目工程(英文名称)
 * File Name:LkPlanBusinessinfoidServiceImpl.java  
 * Package Name:com.zwsafety.module.enterprise.service.impl
 * Date:2017年10月12日
 * Copyright (c) 2017 ,zwsafety All Rights Reserved.   
 */
package com.hwsafe.enterprise.service;

import java.util.List;


import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.hwsafe.enterprise.domain.LkPlanBusinessinfoid;
import com.hwsafe.enterprise.mapper.LkPlanBusinessinfoidMapper;


/**
 * @ClassName:LkPlanBusinessinfoidServiceImpl
 * @Description:TODO(用一句话描述该文件做什么)
 * @date:2017年10月12日
 * @author hanwei
 * @version 1.0
 * @since JDK 1.7
 */
@Service
public class LkPlanBusinessinfoidService extends ServiceImpl<LkPlanBusinessinfoidMapper,LkPlanBusinessinfoid>  {
	
	
	/**
	 * 
	 * @Title: loadByBusinessinfoid
	 * @Description TODO(根据企业id获取企业平面图). TODO(这里描述这个方法适用条件 – 可选). TODO(这里描述这个方法的执行流程 –
	 *              可选). TODO(这里描述这个方法的使用方法 – 可选). TODO(这里描述这个方法的注意事项 – 可选).
	 * @date 2017年10月12日
	 * @author admin
	 * @return
	 */
	public LkPlanBusinessinfoid loadByBusinessinfoid(String businessinfoid) throws Exception{
		final List<LkPlanBusinessinfoid> lkPlanBusinessinfoids = baseMapper.loadByBusinessinfoid(businessinfoid);
		if(lkPlanBusinessinfoids !=null && lkPlanBusinessinfoids.size()>0) {
			return lkPlanBusinessinfoids.get(0);
		}
		return new LkPlanBusinessinfoid();
	}
	@Transactional
	public void insert(LkPlanBusinessinfoid entity) {
		baseMapper.insert(entity);
	}
}
