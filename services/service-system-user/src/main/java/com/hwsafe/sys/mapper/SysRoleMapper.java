/**  
 * Project Name:module_system
 * File Name:SysRoleMapper.java  
 * Package Name:package com.zwsafety.module.system.dao
 * Date:2016年04月14日
 * Copyright (c) 2016 ,zwsafety All Rights Reserved.   
 */
package com.hwsafe.sys.mapper;

import java.util.List;
import java.util.Map;

import org.apache.ibatis.annotations.Param;
import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.hwsafe.sys.domain.SysRole;

/**
 * @ClassName:SysRoleMapper
 * @Description:TODO(用一句话描述该文件做什么)
 * @date:2016年4月14日
 * @author yxx
 * @version 1.0
 * @since JDK 1.8
 */
public interface SysRoleMapper extends BaseMapper<SysRole> {

    /**
     * 
     * @Title:loadByName
     * @Description TODO(根据角色名查询).
     * @date 2016年4月14日
     * @author yxx
     * @param rolename
     *            角色名
     * @return SysRole
     * @throws Exception
     *             异常
     */
    SysRole loadByName(String rolename) throws Exception;

    /**
     * @Title:loadPrivByid
     * @Description TODO(查询权限菜单).
     * @date 2016年4月15日
     * @author luyao
     * @param ids
     *            角色id数组
     * @param usertype
     *            用户类型
     * @return List<Map<String,Object>>
     * @throws Exception
     *             异常
     */
    public List<Map<String, Object>> loadPrivByid(Map<String, Object> params)
            throws Exception;
    
    /**  
    * @Title:loadByUsertype
    * @Description TODO(根据类型查询). 
    * @date  2016年5月19日 
    * @author peijun  
    * @param usertype
    * @return 
    */
    public List<Map<String, Object>> loadByUsertype(@Param("usertype")String usertype)
            throws Exception;
}
