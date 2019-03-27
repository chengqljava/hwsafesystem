/**  
 * Project Name:xx项目工程(英文名称)
 * File Name:EntAddressMapper.java  
 * Package Name:package com.zwsafety.module.enterprise.dao
 * Date:2016年06月21日
 * Copyright (c) 2016 ,zwsafety All Rights Reserved.   
 */
package com.hwsafe.enterprise.mapper;

import java.util.List;

import org.springframework.stereotype.Repository;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.hwsafe.enterprise.domain.EntAddress;



 /**
 * @ClassName:EntAddressMapper
 * @Description:TODO(用一句话描述该文件做什么)
 * @date:2016年06月21日
 * @author peijun
 * @version 1.0
 * @since JDK 1.7
 */
 @Repository
public interface EntAddressMapper extends BaseMapper<EntAddress> {
	
     public List<EntAddress> loadByBusinessinfoId(String businessinfoid)throws Exception;
     
     public void deleteByBusinessinfoid(String businessinfoid)throws Exception;
}
