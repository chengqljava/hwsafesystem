/**  
 * Project Name:xx项目工程(英文名称)
 * File Name:SysOperMapper.java  
 * Package Name:package com.zwsafety.module.system.dao
 * Date:2016年01月14日
 * Copyright (c) 2016 ,zwsafety All Rights Reserved.   
 */
package com.hwsafe.sys.mapper;

import java.util.List;
import java.util.Map;

import org.apache.ibatis.annotations.Param;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.hwsafe.sys.domain.SysOper;



/**
 * @ClassName:SysOperMapper
 * @Description:操作信息Mapper
 * @date:2016年01月14日
 * @author xufeng
 * @version 1.0
 * @since JDK 1.7
 */
public interface SysOperMapper extends BaseMapper<SysOper> {

    /**
     * @Title:loadCountLkOperById
     * @Description TODO(根据权限id数组查询权限操作关联).
     * @date 2016年4月18日
     * @author peijun
     * @param params
     * @return
     * @throws Exception
     */
    public Integer loadCountLkOperById(Map<String, Object> params)
            throws Exception;

    /**
     * @Title:loadOperByPriId
     * @Description TODO(根据权限id查询操作项).
     * @date 2016年4月21日
     * @author peijun
     * @param privid
     *            权限id
     * @return
     * @throws Exception
     */
    public List<SysOper> loadOperByPriId(@Param("privid") String privid)
            throws Exception;

    /**
     * 
     * @Title:loadOperByPrivIds
     * @Description TODO(根据权限id查询权限操作项关联列表).
     * @date 2016年4月28日
     * @author yxx
     * @param privids
     *            权限ID数组
     * @return List<SysOper>
     * @throws Exception
     *             异常
     */
    List<SysOper> loadOperByPrivIds(String[] privids) throws Exception;

    /**
     * 
     * @Title:loadOperByPrivIds
     * @Description TODO(根据权限id查询权限操作项关联列表).
     * @date 2016年05月04日
     * @author yxx
     * @param privids
     *            权限ID数组
     * @param userid
     *            用户ID
     * @return List<SysOper>
     * @throws Exception
     *             异常
     */
    List<SysOper> loadOperByPrivIdsAndUserId(
            @Param("privids") String[] privids, @Param("userid") String userid)
            throws Exception;

}
