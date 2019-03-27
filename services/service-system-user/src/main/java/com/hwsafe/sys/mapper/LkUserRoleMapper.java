/**  
 * Project Name:xx项目工程(英文名称)
 * File Name:LkUserRoleMapper.java  
 * Package Name:package com.zwsafety.module.system.dao
 * Date:2016年01月14日
 * Copyright (c) 2016 ,zwsafety All Rights Reserved.   
 */
package com.hwsafe.sys.mapper;

import java.util.List;
import java.util.Map;

import org.apache.ibatis.annotations.Param;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.hwsafe.sys.domain.LkUserRole;
import com.hwsafe.sys.domain.SysRole;


/**
 * @ClassName:LkUserRoleMapper
 * @Description:用户角色关联信息Mapper
 * @date:2016年01月14日
 * @author xufeng
 * @version 1.0
 * @since JDK 1.7
 */
public interface LkUserRoleMapper extends BaseMapper<LkUserRole> {

    /**
     * @Title:loadLkRoleById
     * @Description TODO(关联引用查询(根据用户ids查询用户角色是否有关联引用)).
     * @date 2016年4月15日
     * @author luyao
     * @param params
     *            用户id数组
     * @return Integer 数量
     * @throws Exception
     *             异常
     */
    public Integer loadLkRoleById(Map<String, Object> params) throws Exception;

    /**
     * @Title:deleteByUserid
     * @Description TODO(根据用户id删除用户角色中间表数据).
     * @date 2016年4月15日
     * @author luyao
     * @param id
     *            用户id
     * @throws Exception
     *             异常
     */
    public void deleteByUserid(String id) throws Exception;

    /**
     * @Title:saveUserRole
     * @Description TODO(根据用户id和角色id保存(授权)).
     * @date 2016年4月15日
     * @author luyao
     * @param id
     *            用户id
     * @param id
     *            角色id
     * @throws Exception
     *             异常
     */
    public void saveUserRole(@Param("conid") String conid,
            @Param("userid") String userid, @Param("roleid") String roleid)
            throws Exception;

    /**
     * @Title:loadLkUserRolesByRoleIds
     * @Description TODO(关联引用查询(根据角色id查询用户角色是否有关联引用)).
     * @date 2016年4月27日
     * @author yxx
     * @param roleIds
     *            用户id数组
     * @return Integer 数量
     * @throws Exception
     *             异常
     */
    public Integer loadLkUserRolesByRoleIds(String[] roleIds) throws Exception;

    /**
     * 通过userid 获取role
     * @param userid
     * @return
     * @throws Exception
     */
    public List<SysRole> loadRoleByUserId(String userid) throws Exception;
}
