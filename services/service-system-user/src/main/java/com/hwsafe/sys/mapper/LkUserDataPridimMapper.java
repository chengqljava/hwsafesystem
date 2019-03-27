/**  
 * Project Name:xx项目工程(英文名称)
 * File Name:LKUSERDATAPRIDIMMapper.java  
 * Package Name:package com.zwsafety.module.demo.dao
 * Date:2019年03月21日
 * Copyright (c) 2019 ,zwsafety All Rights Reserved.   
 */
package com.hwsafe.sys.mapper;

import java.util.List;
import java.util.Map;

import org.apache.ibatis.annotations.Param;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.hwsafe.sys.domain.LkUserDataPridim;


 /**
 * @ClassName:LKUSERDATAPRIDIMMapper
 * @Description:区域关系
 * @date:2019年03月21日
 * @author chengql
 * @version 1.0
 * @since JDK 1.7
 */
public interface LkUserDataPridimMapper extends BaseMapper<LkUserDataPridim> {
	/**
	 * @param lkUserDataPridim
	   *   新增
	 */
	void save(LkUserDataPridim lkUserDataPridim);
	
	/**
	 * @param userId 用户ID
	 * @param type 类型
	 * @return 列表数据
	 */
	List<LkUserDataPridim> loadByUseridOrType(Map<String,Object> params);
	
	/**
	 * @param id
	 *ID 删除指定数据
	 */
	void deleteById(@Param("id")String id);
	
	/**
	 * @param userId 用户ID
	      * 通过用户ID 删除数据
	 */
	void deleteByUserId(@Param("userId")String userId);
	
	/**
	 * @param lkUserDataPridims
	 * 批量添加
	 */
	void saveBatch(List<LkUserDataPridim> lkUserDataPridims);
	
}
