/**  
 * Project Name:module_system
 * File Name:LkRolePrivMapper.java  
 * Package Name:package com.zwsafety.module.system.dao
 * Date:2016年04月13日
 * Copyright (c) 2016 ,zwsafety All Rights Reserved.   
 */
package com.hwsafe.sys.mapper;

import java.util.List;
import java.util.Map;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.hwsafe.sys.domain.LkRolePriv;
import com.hwsafe.sys.domain.SysRole;


/**
 * @ClassName:LkRolePrivMapper
 * @Description:TODO(用一句话描述该文件做什么)
 * @date:2016年4月13日
 * @author yxx
 * @version 1.0
 * @since JDK 1.8
 */
public interface LkRolePrivMapper extends BaseMapper<LkRolePriv> {

    /**
     * 
     * @Title:loadRolePrivsByRoleIds
     * @Description TODO(根据roleids查找对应的权限信息).
     * @date 2016年4月15日
     * @author yxx
     * @param roleids
     *            角色ID数组
     * @return List<LkRolePriv>
     * @throws Exception
     *             异常
     */
    List<LkRolePriv> loadRolePrivsByRoleIds(String[] roleids) throws Exception;

    /**
     * 
     * @Title:deleteByRoleids
     * @Description TODO(删除角色对应的权限).
     * @date 2016年4月18日
     * @author yxx
     * @param roleids
     *            角色ID数组
     * @throws Exception
     *             异常
     */
    void deleteByRoleids(String[] roleids) throws Exception;

    /**
     * @Title:loadCountLkRoleById
     * @Description TODO(根据权限id查询角色权限关联).
     * @date 2016年4月15日
     * @author peijun
     * @param params
     *            存放权限id数组
     * @return Integer
     * @throws Exception
     *             异常
     */
    public Integer loadCountLkRoleById(Map<String, Object> params)
            throws Exception;

    /**
     * 
     * @Title:loadCountPrivsByUsertype
     * @Description TODO(查询角色的非指定角色类型的权限数量).
     * @date 2016年4月28日
     * @author yxx
     * @param params
     *            roleid、usertype
     * @return Integer
     * @throws Exception
     *             异常
     */
    Integer loadCountPrivsByUsertype(Map<String, Object> params)
            throws Exception;

    /**
    * @Title:getRole
    * @Description TODO(根据登陆人获取权限). 
    * @date  2018年7月5日 
    * @author admin  
    * @param userid
    * @return
    * @throws Exception
     */
    public List<SysRole> getRole(String userid)throws Exception;

}
