/**  
 * Project Name:module_system
 * File Name:SysRoleServiceImpl.java  
 * Package Name:com.zwsafety.module.system.service.impl
 * Date:2016年4月13日 
 * Copyright (c) 2016 ,zwsafety All Rights Reserved.   
 */
package com.hwsafe.sys.service;

import java.util.Arrays;
import java.util.List;
import java.util.Map;

import org.apache.commons.lang3.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.hwsafe.sys.domain.LkRolePriv;
import com.hwsafe.sys.domain.SysRole;
import com.hwsafe.sys.mapper.SysRoleMapper;

/**
 * @ClassName:SysRoleServiceImpl
 * @Description:TODO(用一句话描述该文件做什么)
 * @date:2016年4月13日
 * @author yxx
 * @version 1.0
 * @param <SysRoleMapper>
 * @since JDK 1.7
 */
@Service
public class SysRoleService extends ServiceImpl<SysRoleMapper,SysRole> {

	/**
	 * @Fields lkRolePrivMapper:TODO(角色权限关联Mapper).
	 */
	@Autowired
	private LkRolePrivService lkRolePrivService;

	/**
	 * @Fields lkRolePrivMapper:TODO(用户角色关联Mapper).
	 */
	@Autowired
	private LkUserRoleService lkUserRoleService;

	/**
	 * 
	 * @Title deleteRoles
	 * @Description TODO 根据角色ID数组，批量删除角色
	 * @date 2016年4月14日
	 * @author yxx
	 * @param ids 角色ID数组
	 * @return boolean 是否删除成功。true：删除成功 false：未删除成功
	 * @throws Exception 异常
	 * @see com.zwsafety.module.system.service.
	 *      SysRoleService#deleteRoles(java.lang.String[])
	 */
	public boolean deleteRoles(String[] ids) throws Exception {
		boolean flag = false;
		if (ids.length > 0) {
			if (!hasRelation(ids)) {
				baseMapper.deleteBatchIds(Arrays.asList(ids));
				flag = true;
			}
		}
		return flag;
	}

	/**
	 * 
	 * @Title:hasRelation
	 * @Description TODO(判断角色是否和用户、权限还有关联。).
	 * @date 2016年4月14日
	 * @author yxx
	 * @param ids 角色ID数组
	 * @return boolean true：有关联 false：无关联
	 * @throws Exception 异常
	 */
	public boolean hasRelation(String[] ids) throws Exception {
		boolean flag = false;
		List<LkRolePriv> list = lkRolePrivService.getBaseMapper().loadRolePrivsByRoleIds(ids);
		// 判断角色是否有权限信息
		if (list != null && list.size() > 0) {
			flag = true;
		} else {
			int count = lkUserRoleService.getBaseMapper().loadLkUserRolesByRoleIds(ids);
			if (count > 0) {
				flag = true;
			}
		}
		return flag;
	}

	/**
	 * 
	 * @Title:existsRole
	 * @Description TODO(查询角色名是否存在).
	 * @date 2016年4月14日
	 * @author yxx
	 * @param roleid   角色ID
	 * @param rolename 角色名
	 * @return boolean 是否存在 true：存在 false：不存在
	 * @throws Exception 异常
	 */
	public boolean existsRole(String roleid, String rolename) throws Exception {
		boolean flag = false;
		SysRole sysRole = baseMapper.loadByName(rolename);
		// 新增
		if (StringUtils.isBlank(roleid)) {
			if (sysRole != null) {
				flag = true;
			}
		} else { // 编辑
			if (sysRole != null && !sysRole.getRoleid().equalsIgnoreCase(roleid)) {
				flag = true;
			}
		}
		return flag;
	}

	/**
	 * @Title loadPrivByid
	 * @Description TODO(查询权限菜单)
	 * @date 2016年4月15日
	 * @author luyao
	 * @param ids      角色id数组
	 * @param usertype 用户类型
	 * @return List<Map<String,Object>>
	 * @throws Exception 异常
	 * @see com.zwsafety.module.system.service
	 *      .SysRoleService#loadPrivByid(java.lang.String)
	 */
	public List<Map<String, Object>> loadPrivByid(Map<String, Object> params) throws Exception {
		return baseMapper.loadPrivByid(params);
	}

	/**
	 * 
	 * @Title:hasPrivsByUsertype
	 * @Description TODO(查询角色是否有非目标角色类型的权限).
	 * @date 2016年4月28日
	 * @author yxx
	 * @param params roleid、usertype
	 * @return boolean 有：返回true 没有：返回false
	 * @throws Exception 异常
	 */
	public boolean hasPrivsByUsertype(Map<String, Object> params) throws Exception {
		int count = lkRolePrivService.loadCountPrivsByUsertype(params);
		if (count > 0) {
			return true;
		}
		return false;

	}
	public SysRole loadById(String roleId) {
		return baseMapper.selectById(roleId);
	}
	
	
	 /**
	 * @param usertype
	 * @return 
	 * @throws Exception
	 * 根据类型查询
	 */
	public List<Map<String, Object>> loadByUsertype(String usertype)
	            throws Exception{
		 return baseMapper.loadByUsertype(usertype);
	 }
}
