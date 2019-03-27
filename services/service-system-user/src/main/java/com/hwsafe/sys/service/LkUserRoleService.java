/**  
 * Project Name:xx项目工程(英文名称)
 * File Name:LkUserRoleServiceImpl.java  
 * Package Name:com.zwsafety.module.system.service.impl
 * Date:2016年01月14日
 * Copyright (c) 2016 ,zwsafety All Rights Reserved.   
 */
package com.hwsafe.sys.service;

import java.util.Arrays;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.apache.commons.lang3.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.hwsafe.sys.constants.SysConstants;
import com.hwsafe.sys.domain.LkUserRole;
import com.hwsafe.sys.mapper.LkUserRoleMapper;
import com.hwsafe.utils.BeanUtil;
import com.hwsafe.utils.IDGenerator;

/**
 * @ClassName:LkUserRoleServiceImpl
 * @Description:TODO(用一句话描述该文件做什么)
 * @date:2016年01月14日
 * @author xufeng
 * @version 1.0
 * @param <LkUserRoleMapper>
 * @since JDK 1.7
 */
@Service
public class LkUserRoleService extends ServiceImpl<LkUserRoleMapper, LkUserRole> {

	@Autowired
	private SysRoleService sysRoleService;

	/**
	 * @Title loadLkRoleById
	 * @Description TODO(关联引用查询(根据用户ids查询用户角色是否有关联引用))
	 * @date 2015年9月22日
	 * @author peijun
	 * @param idarr 用户id数组
	 * @return Integer 数量
	 * @throws Exception 异常
	 * @see com.zwsafety.module.system.service
	 *      .SysUsrRoleService#loadLkRoleById(java.lang.String[])
	 */
	public Integer loadLkRoleById(String[] idarr) throws Exception {
		List<String> list = Arrays.asList(idarr);
		Map<String, Object> params = new HashMap<String, Object>();
		params.put("ids", list); // 根据ids过滤
		return baseMapper.loadLkRoleById(params);
	}

	/**
	 * @Title:saveUserRole
	 * @Description TODO(根据用户id和角色id保存(授权)).
	 * @date 2016年4月15日
	 * @author luyao
	 * @param id 用户id
	 * @param id 角色id
	 * @throws Exception 异常
	 */
	public void saveUserRole(String conid, String uid, String rid) throws Exception {
		baseMapper.saveUserRole(conid, uid, rid);
	}

	/**
	 * 
	 * @Title:setEntAdminRole
	 * @Description TODO(设置企业管理员权限).
	 * @date 2017年11月8日
	 * @author yxx
	 * @param userid
	 * @throws Exception
	 */
	public void setEntAdminRole(String userid) throws Exception {
		// 默认分配企业管理员角色
		List<Map<String, Object>> result = sysRoleService.loadByUsertype(SysConstants.SYSTEM_USERTYPE_ENT); // 企业用户类型角色
		if (result != null && result.size() > 0) {
			for (int i = 0; i < result.size(); i++) {
				String roleaname = BeanUtil.getStringValue(result.get(i), "ROLENAME");
				if ("企业管理员".equals(roleaname)) {
					String roleid = BeanUtil.getStringValue(result.get(i), "ROLEID");
					if (StringUtils.isNotBlank(roleid)) {
						baseMapper.saveUserRole(IDGenerator.OBJECTID.generate(), userid, roleid);
					}
				}
			}
		}
	}

	/**
	 * 
	 * @Title:setEntUserRole
	 * @Description TODO(设置企业用户权限).
	 * @date 2017年11月8日
	 * @author yxx
	 * @param userid
	 * @throws Exception
	 */
	public void setEntUserRole(String userid) throws Exception {
		List<Map<String, Object>> result = sysRoleService.loadByUsertype(SysConstants.SYSTEM_USERTYPE_ENT); // 企业用户类型角色
		if (result != null && result.size() > 0) {
			for (int i = 0; i < result.size(); i++) {
				String roleaname = BeanUtil.getStringValue(result.get(i), "ROLENAME");
				if ("企业用户".equals(roleaname)) {
					String roleid = BeanUtil.getStringValue(result.get(i), "ROLEID");
					if (StringUtils.isNotBlank(roleid)) {
						baseMapper.saveUserRole(IDGenerator.OBJECTID.generate(), userid, roleid);
					}
				}
			}
		}
	}

	public void deleteByUserid(String userid) throws Exception {
		baseMapper.deleteByUserid(userid);
	}

}
