/**  
 * Project Name:xx项目工程(英文名称)
 * File Name:EntAuditServiceImpl.java  
 * Package Name:com.zwsafety.module.enterprise.service.impl
 * Date:2016年05月23日
 * Copyright (c) 2016 ,zwsafety All Rights Reserved.   
 */
package com.hwsafe.enterprise.service;

import org.springframework.stereotype.Service;

import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.hwsafe.enterprise.domain.EntAudit;
import com.hwsafe.enterprise.mapper.EntAuditMapper;

/**
 * @ClassName:EntAuditServiceImpl
 * @Description:TODO(用一句话描述该文件做什么)
 * @date:2016年05月23日
 * @author peijun
 * @version 1.0
 * @since JDK 1.7
 */
@Service
public class EntAuditService extends ServiceImpl<EntAuditMapper, EntAudit> {
	public void deleteByBusinessinfoid(String businessinfoid) throws Exception {
		baseMapper.deleteByBusinessinfoid(businessinfoid);
	}

}
