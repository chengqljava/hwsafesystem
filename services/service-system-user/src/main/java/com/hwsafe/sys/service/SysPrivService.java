/**  
 * Project Name:系统管理(module_system)
 * File Name:SysPrivServiceImpl.java  
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

import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.fasterxml.jackson.core.type.TypeReference;
import com.hwsafe.sys.domain.SysOper;
import com.hwsafe.sys.domain.SysPriv;
import com.hwsafe.sys.mapper.SysPrivMapper;
import com.hwsafe.utils.IDGenerator;
import com.hwsafe.utils.JSONUtil;

/**
 * @ClassName:SysPrivServiceImpl
 * @Description:TODO(权限Service实现层)
 * @date:2016年01月14日
 * @author xufeng
 * @version 1.0
 * @since JDK 1.7
 */
@Service
public class SysPrivService extends ServiceImpl<SysPrivMapper, SysPriv> {

	/**
	 * @Fields sysPrivMapper:TODO(用一句话描述这个变量表示什么).
	 */
	@Autowired
	private SysPrivMapper sysPrivMapper;

	/**
	 * @Fields sysOperMapper:TODO(用一句话描述这个变量表示什么).
	 */
	@Autowired
	private SysOperService sysOperMapper;


	/**
	 * @Title loadPrivById
	 * @Description TODO(根据用户id查询对应的权限菜单)
	 * @date 2016年2月29日
	 * @author peijun
	 * @param userid  用户id
	 * @param organid 所属政府/企业机构
	 * @return List<SysPriv>
	 * @throws Exception 异常
	 * @see com.zwsafety.module.system.service.
	 *      SysPrivService#loadPrivById(java.lang.String, java.lang.String)
	 */
	public List<SysPriv> loadPrivById(String userid, String organid) throws Exception {
		return baseMapper.loadPrivById(userid, organid);
	}

	/**
	 * @Title loadPrivTree
	 * @Description TODO(返回左侧权限树)
	 * @date 2016年4月14日
	 * @author peijun
	 * @param usertype 授权人类型
	 * @return List<Map<String, Object>>
	 * @throws Exception 异常
	 * @see com.zwsafety.module.system.service.SysPrivService#loadPrivTree()
	 */
	public List<Map<String, Object>> loadPrivTree(String usertype) throws Exception {
		return baseMapper.loadPrivTree(usertype);
	}

	/**
	 * @Title:save
	 * @Description TODO(保存权限及关联的操作项).
	 * @date 2016年4月20日
	 * @author peijun
	 * @param sPriv  权限字符串
	 * @param sOpers 操作项字符串
	 * @throws Exception 异常
	 */
	public void savePriv(String sPriv, String sOpers) throws Exception {
		if (StringUtils.isNotBlank(sPriv)) {
			// 先保存权限
			SysPriv sysPriv = JSONUtil.json2obj(sPriv, SysPriv.class);

			if (sysPriv != null) {
				sysPriv.setPrivid(IDGenerator.OBJECTID.generate());
				baseMapper.insert(sysPriv);
				// 后保存操作项
				if (StringUtils.isNotBlank(sOpers)) {
					List<SysOper> sOperList = JSONUtil.json2list(sOpers, new TypeReference<List<SysOper>>() {
					});
					if (sOperList != null && sOperList.size() > 0) {
						for (SysOper sysOper : sOperList) {
							sysOper.setOperid(IDGenerator.OBJECTID.generate());
							sysOper.setPrivid(sysPriv.getPrivid());
							sysOperMapper.save(sysOper);
						}
					}
				}
			}
		}
	}

	/**
	 * @Title loadCountLkParentById
	 * @Description TODO(查询权限子节点数量).
	 * @date 2016年4月26日
	 * @author peijun
	 * @param prividarr 权限id数组
	 * @return Integer
	 * @throws Exception 异常
	 * @see com.zwsafety.module.system.service.
	 *      SysPrivService#loadCountLkParentById(java.lang.String[])
	 */
	public Integer loadCountLkParentById(String[] prividarr) throws Exception {
		List<String> list = Arrays.asList(prividarr);
		Map<String, Object> params = new HashMap<String, Object>();
		params.put("ids", list); // 根据ids过滤
		return sysPrivMapper.loadCountLkParentById(params);
	}
	
	/**
	 * @param userType
	 * @return
	 * 通过userType获得
	 */
	public List<SysPriv> loadByUserTypeList(String userType){
		QueryWrapper<SysPriv> queryWrapper=new QueryWrapper<SysPriv>();
		queryWrapper.eq("usertype", userType);
		return baseMapper.selectList(queryWrapper);
	}
	
	public List<SysPriv> loadPrivByUserId(String userid) throws Exception{
		return baseMapper.loadPrivByUserId(userid);
	}
}
