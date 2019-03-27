/**  
 * Project Name:xx项目工程(英文名称)
 * File Name:EntAddressServiceImpl.java  
 * Package Name:com.zwsafety.module.enterprise.service.impl
 * Date:2016年06月21日
 * Copyright (c) 2016 ,zwsafety All Rights Reserved.   
 */
package com.hwsafe.enterprise.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.hwsafe.enterprise.domain.EntAddress;
import com.hwsafe.enterprise.mapper.EntAddressMapper;

 /**
 * @ClassName:EntAddressServiceImpl
 * @Description:TODO(用一句话描述该文件做什么)
 * @date:2016年06月21日
 * @author peijun
 * @version 1.0
 * @since JDK 1.7
 */
@Service
public class EntAddressService extends ServiceImpl<EntAddressMapper, EntAddress>{
	
	


	public List<EntAddress> loadByBusinessinfoId(String businessinfoid)throws Exception{
	    return baseMapper.loadByBusinessinfoId(businessinfoid);
	}
	 public void deleteByBusinessinfoid(String businessinfoid)throws Exception{
		  baseMapper.deleteByBusinessinfoid(businessinfoid);
	 }
}
