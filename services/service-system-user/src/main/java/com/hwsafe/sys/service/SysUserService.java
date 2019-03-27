/**  
 * Project Name:module_system
 * File Name:SysUserService.java  
 * Package Name:com.zwsafety.module.system.service
 * Date:2016年01月14日
 * Copyright (c) 2016 ,zwsafety All Rights Reserved.   
 */
package com.hwsafe.sys.service;



import java.util.ArrayList;
import java.util.List;
import java.util.Map;

import org.apache.commons.lang3.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.hwsafe.sys.constants.SysConstants;
import com.hwsafe.sys.domain.SysOrg;
import com.hwsafe.sys.domain.SysUser;
import com.hwsafe.sys.mapper.SysUserMapper;
import com.hwsafe.utils.IDGenerator;


/**
 * @ClassName:SysUserService
 * @Description:用户信息Service
 * @date:2016年01月14日
 * @author xufeng
 * @version 1.0
 * @since JDK 1.7
 */
@Service
public class SysUserService extends ServiceImpl<SysUserMapper, SysUser> {
     @Autowired
     private SysOrgService sysOrgService;
     @Autowired
     private LkUserRoleService lkUserRoleService;
     @Autowired
     private LkUserDataPridimService lkUserDataPridimService;
	   /**
     * @Title loadUserByLoginName
     * @Description TODO(根据工号账号查询用户信息)
     * @date 2016年2月29日
     * @author peijun
     * @param loginname
     *            登录名
     * @return
     * @throws Exception
     */
    public SysUser loadUserByUsername(String loginname) throws Exception {
        return baseMapper.loadUserByUsername(loginname);
    }
    
    /**
     * @Title loadRoleCheckById
     * @Description TODO(根据用户id查询角色是否被选中)
     * @date 2016年4月15日
     * @author luyao
     * @param id
     *            用户id
     * @return List<Map<String,Object>>
     * @throws Exception
     *             异常
     * @see com.zwsafety.module.system.service
     *      .SysUserService#loadRoleCheckById(java.lang.String)
     */
    public List<Map<String, Object>> loadRoleCheckById (
            Map<String, Object> params) throws Exception {
        List<String> list = new ArrayList<String>();
        recursion(params.get("orgids").toString(), list);
        params.put("orgids", list);
        return baseMapper.loadRoleCheckById(params);
    }

    /**
     * @Title:recursion
     * @Description TODO(递归查询机构信息).
     * @date 2016年5月5日
     * @author luyao
     * @param id
     *            机构id
     * @param list
     *            机构集合
     * @return List<String> 机构集合
     */
    public List<String> recursion(String id, List<String> list)
            throws Exception {
        if (StringUtils.isNotBlank(id)) {
            list.add(id);
            List<SysOrg> orgs = sysOrgService.loadByParentIdList(id);
            if (orgs != null && orgs.size() > 0) {
                for (int i = 0; i < orgs.size(); i++) {
                    String orgid = orgs.get(i).getOrgid();
                    recursion(orgid, list);
                }
            } else
                return list;
        }

        return list;
    }

    /**
     * @Title saveUserRole
     * @Description TODO(用户授权(角色分配))
     * @date 2016年4月15日
     * @author luyao
     * @param id
     *            用户id
     * @param ids
     *            角色id数组
     * @throws Exception
     *             异常
     * @see com.zwsafety.module.system.service
     *      .SysUserService#saveUserRole(java.lang.String, java.lang.String[])
     */
    public void saveUserRole(String userid, String[] ids) throws Exception {
        lkUserRoleService.deleteByUserid(userid); // 先删除中间表
        for (String i : ids) {
        	lkUserRoleService.saveUserRole(IDGenerator.OBJECTID.generate(), userid, i);
        }
    }
    
    public void saveUserRole(String createId, String userid, String[] ids,String placeAreas) throws Exception {
        //保存用户最新的用户角色关联信息
    	lkUserRoleService.deleteByUserid(userid); // 先删除中间表
        for (String i : ids) {
        	lkUserRoleService.saveUserRole(IDGenerator.OBJECTID.generate(), userid, i);
        }
        
        //保存用户区域数据权限关联信息
        SysUser sysUser= baseMapper.selectById(userid);
        
        if (SysConstants.SYSTEM_USERTYPE_ENT.equals(sysUser.getUsertype())) {
        	lkUserDataPridimService.deleteByUserId(userid);
        	if(StringUtils.isNotBlank(placeAreas)) {
                lkUserDataPridimService.saveBatch(userid, createId, placeAreas.split(","));
                sysUser.setAreapriflag(Integer.parseInt(SysConstants.SYSTEM_ENTUSER_AREAPRIFLAG_YSE));
            }else {
            	sysUser.setAreapriflag(Integer.parseInt(SysConstants.SYSTEM_ENTUSER_AREAPRIFLAG_NO));
            }
        } 
        baseMapper.updateById(sysUser);
    }
    
    public Integer updateByOrganid(Map<String, Object> params) throws Exception {
    	return baseMapper.updateByOrganid(params);
    }

}
