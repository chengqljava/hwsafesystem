/**  
 * Project Name:系统管理(module_system)
 * File Name:SysPrivMapper.java  
 * Package Name:package com.zwsafety.module.system.dao
 * Date:2016年01月14日
 * Copyright (c) 2016 ,zwsafety All Rights Reserved.   
 */
package com.hwsafe.sys.mapper;

import java.util.List;
import java.util.Map;

import org.apache.ibatis.annotations.Param;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.hwsafe.sys.domain.SysPriv;


/**
 * @ClassName:SysPrivMapper
 * @Description:权限信息Mapper
 * @date:2016年1月14日
 * @author xufeng
 * @version 1.0
 * @since JDK 1.7
 */
public interface SysPrivMapper extends BaseMapper<SysPriv> {

    /**
     * @Title:loadPrivById
     * @Description TODO(根据用户id查询对应的权限菜单).
     * @date 2016年2月29日
     * @author peijun
     * @param userid
     *            用户id
     * @param organid
     *            所属政府/企业机构
     * @return List<SysPriv>
     * @throws Exception
     *             异常
     */
    public List<SysPriv> loadPrivById(@Param("userid") String userid,
            @Param("organid") String organid) throws Exception;

    /**
     * @Title:loadPrivTree
     * @Description TODO(放回左侧权限树).
     * @date 2016年4月14日
     * @author peijun
     * @param usertype
     *            用户类型
     * @return List<Map<String, Object>>
     * @throws Exception
     *             异常
     */
    public List<Map<String, Object>> loadPrivTree(
            @Param("usertype") String usertype) throws Exception;

    /**
     * @Title:loadCountLkParentById
     * @Description TODO(查询权限子节点数量).
     * @date 2016年4月26日
     * @author peijun
     * @param params
     *            权限id数组
     * @return Integer
     * @throws Exception
     *             异常
     */
    public Integer loadCountLkParentById(Map<String, Object> params)
            throws Exception;

    /**
     * 
     * @Title:loadPrivByUserId
     * @Description TODO(根据用户ID查询权限).
     * @date 2016年5月4日
     * @author yxx
     * @param userid
     *            用户ID
     * @return List<SysPriv>
     * @throws Exception
     *             异常
     */
    List<SysPriv> loadPrivByUserId(String userid) throws Exception;
}
