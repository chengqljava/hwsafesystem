/**  
 * Project Name:module_system
 * File Name:LkRolePrivServiceImpl.java  
 * Package Name:com.zwsafety.module.system.service.impl
 * Date:2016年04月13日
 * Copyright (c) 2016 ,zwsafety All Rights Reserved.   
 */
package com.hwsafe.sys.service;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.hwsafe.sys.domain.LkRolePriv;
import com.hwsafe.sys.domain.SysOper;
import com.hwsafe.sys.domain.SysPriv;
import com.hwsafe.sys.domain.SysRole;
import com.hwsafe.sys.mapper.LkRolePrivMapper;
import com.hwsafe.utils.IDGenerator;


/**
 * @ClassName:LkRolePrivServiceImpl
 * @Description:TODO(用一句话描述该文件做什么)
 * @date:2016年01月14日
 * @author xufeng
 * @version 1.0
 * @since JDK 1.7
 */
@Service
public class LkRolePrivService extends ServiceImpl<LkRolePrivMapper, LkRolePriv> {



    /**
     * @Fields sysOperMapper:TODO(用一句话描述这个变量表示什么).
     */
    @Autowired
    private SysOperService sysOperService;

    /**
     * @Fields sysRoleMapper:TODO(用一句话描述这个变量表示什么).
     */
    @Autowired
    private SysRoleService sysRoleService;
    @Autowired
    private SysPrivService sysPrivService;

  

   

    /**
     * @Title loadCountLkRoleById
     * @Description TODO(根据权限id查询角色权限关联).
     * @date 2016年4月15日
     * @author peijun
     * @param prividarr
     *            String[]
     * @return Integer
     * @throws Exception
     *             异常
     * @see com.zwsafety.module.system.service.
     *      LkRolePrivService#loadCountLkRoleById(java.lang.String[])
     */
    public Integer loadCountLkRoleById(String[] prividarr) throws Exception {
        List<String> list = Arrays.asList(prividarr);
        Map<String, Object> params = new HashMap<String, Object>();
        params.put("ids", list); // 根据ids过滤
        return baseMapper.loadCountLkRoleById(params);
    }

    /**
     * 
     * @Title:loadPrivTree
     * @Description TODO(根据角色ID加载对应的权限树).
     * @date 2016年4月15日
     * @author yxx
     * @param roleids
     *            角色ID数组
     * @return List<Map<String, Object>> 权限树
     * @throws Exception
     *             异常
     */
    public List<Map<String, Object>> loadPrivTree(String[] roleids)
            throws Exception {
        SysRole sysRole = sysRoleService.loadById(roleids[0]);
        // 1、加载该角色对应的权限
        List<SysPriv> sysPrivList = sysPrivService.loadByUserTypeList(sysRole.getUsertype());
        // 2、加载该角色对应的权限操作
        String[] privids = getPrivIds(sysPrivList);
        List<SysOper> sysOperList = null;
        if (privids != null && privids.length != 0) {
            sysOperList = sysOperService.loadOperByPrivIds(privids);
        }
        // 生成权限树
        List<Map<String, Object>> treeList = buildTree(sysPrivList, sysOperList);
        // 3、加载角色已有权限
        List<LkRolePriv> rolePrivList = baseMapper
                .loadRolePrivsByRoleIds(roleids);
        // 给权限树设置默认选中项
        treeList = setTreeDefaultSelected(treeList, rolePrivList);
        return treeList;
    }

    /**
     * 
     * @Title:loadPrivTreeByUserId
     * @Description TODO(根据角色ID加载对应的权限树).
     * @date 2016年4月15日
     * @author yxx
     * @param roleids
     *            角色ID数组
     * @param userid
     *            授权人id
     * @return List<Map<String, Object>> 权限树
     * @throws Exception
     *             异常
     */
    public List<Map<String, Object>> loadPrivTreeByUserId(String[] roleids,
            String userid) throws Exception {
        // 1、加载该用户对应的权限
        List<SysPriv> sysPrivList = sysPrivService.loadPrivByUserId(userid);
        // 2、加载该用户对应的权限操作
        String[] privids = getPrivIds(sysPrivList);
        List<SysOper> sysOperList = null;
        if (privids != null && privids.length != 0) {
            sysOperList = sysOperService.loadOperByPrivIdsAndUserId(privids,
                    userid);
        }
        // 生成权限树
        List<Map<String, Object>> treeList = buildTree(sysPrivList, sysOperList);
        // 3、加载角色已有权限
        List<LkRolePriv> rolePrivList = baseMapper
                .loadRolePrivsByRoleIds(roleids);
        // 给权限树设置默认选中项
        treeList = setTreeDefaultSelected(treeList, rolePrivList);
        return treeList;
    }

    /**
     * 
     * @Title:getPrivIds
     * @Description TODO(根据权限List获取对应的权限ID).
     * @date 2016年4月28日
     * @author yxx
     * @param sysPrivList
     *            权限集合
     * @return String[] 权限ID数组
     */
    private String[] getPrivIds(List<SysPriv> sysPrivList) {
        String[] privids = null;
        if (sysPrivList != null) {
            privids = new String[sysPrivList.size()];
            for (int i = 0; i < sysPrivList.size(); i++) {
                SysPriv sysPriv = sysPrivList.get(i);
                privids[i] = sysPriv.getPrivid();
            }
        }
        return privids;
    }

    /**
     * 
     * @Title:saveRolePriv
     * @Description TODO(角色授权).
     * @date 2016年4月18日
     * @author yxx
     * @param ids
     *            权限数组
     * @param roleids
     *            角色ID
     * @throws Exception
     *             异常
     */
    public void saveRolePriv(String[] ids, String roleids) throws Exception {
        String[] rids = roleids.split(",");
        // 删除角色原来的权限
        baseMapper.deleteByRoleids(rids);
        // 给角色设置新权限
        for (String roleid : rids) {
            for (String id : ids) {
                LkRolePriv lkRolePriv = new LkRolePriv();
                lkRolePriv.setConid(IDGenerator.OBJECTID.generate());
                lkRolePriv.setRoleid(roleid);
                // 是否是权限树中的操作项
                // 权限树中权限的操作项的privid设为 poid:privid_operid
                boolean isOper = id.startsWith("poid:") ? true : false;
                if (isOper) {
                    String[] tempIds = id.split("_");
                    String privid = tempIds[0].split(":")[1];
                    String operid = tempIds[1];
                    lkRolePriv.setPrivid(privid);
                    lkRolePriv.setOperid(operid);
                } else {
                    lkRolePriv.setPrivid(id);
                }
                baseMapper.insert(lkRolePriv);
            }
        }
    }

    /**
     * 
     * @Title:buildTree
     * @Description TODO(生成权限树).
     * @date 2016年4月18日
     * @author yxx
     * @param sysPrivList
     *            权限List
     * @param sysOperList
     *            权限操作List
     * @return List<Map<String, Object>>
     * @throws Exception
     *             异常
     */
    private List<Map<String, Object>> buildTree(List<SysPriv> sysPrivList,
            List<SysOper> sysOperList) throws Exception {
        List<Map<String, Object>> treeList = new ArrayList<Map<String, Object>>();
        if (sysPrivList != null) {
            for (SysPriv sysPriv : sysPrivList) {
                Map<String, Object> map = new HashMap<String, Object>();
                map.put("parentid", sysPriv.getParentid());
                map.put("privid", sysPriv.getPrivid());
                map.put("privname", sysPriv.getPrivname());
                map.put("privlevel", sysPriv.getPrivlevel());
                map.put("checked", false);
                treeList.add(map);
            }
        }
        if (sysOperList != null) {
            for (SysOper sysOper : sysOperList) {
                if (sysOper.getPrivid() != null
                        && !"".equals(sysOper.getPrivid())) {
                    Map<String, Object> operMap = new HashMap<String, Object>();
                    operMap.put("parentid", sysOper.getPrivid());
                    // 权限树中操作权限的privid设为 poid:privid_operid
                    operMap.put("privid", "poid:" + sysOper.getPrivid() + "_"
                            + sysOper.getOperid());
                    operMap.put("privname", sysOper.getOpername());
                    operMap.put("checked", false);
                    treeList.add(operMap);
                }
            }
        }
        return treeList;
    }

    /**
     * 
     * @Title:setTreeDefaultSelected
     * @Description TODO(给权限树设置默认选中项).
     * @date 2016年4月15日
     * @author yxx
     * @param treeList
     *            权限树
     * @param rolePrivList
     *            角色权限
     * @return List<Map<String, Object>>
     */
    private List<Map<String, Object>> setTreeDefaultSelected(
            List<Map<String, Object>> treeList, List<LkRolePriv> rolePrivList) {
        List<Map<String, Object>> resultTreeList = new ArrayList<Map<String, Object>>();
        if (rolePrivList == null || rolePrivList.size() == 0) {
            return treeList;
        } else {
            for (Map<String, Object> treeNodeMap : treeList) {
                String privid = treeNodeMap.get("privid").toString();
                // 是否是权限树中的操作项
                // 权限树中权限的操作项的privid设为 poid:privid_operid
                boolean isOper = privid.startsWith("poid:") ? true : false;
                // 如果是操作项，获取它的操作id
                String operid = isOper ? privid.split("_")[1] : "";
                for (LkRolePriv lkRolePriv : rolePrivList) {
                    if ((isOper && operid.equalsIgnoreCase(lkRolePriv
                            .getOperid())) // 设置权限的操作项选中
                            || privid.equalsIgnoreCase(lkRolePriv.getPrivid())) { // 设置权限项选中
                        treeNodeMap.put("checked", true);
                    }
                }
                resultTreeList.add(treeNodeMap);
            }
        }
        return resultTreeList;
    }

    /**
    * @Title:getRole
    * @Description TODO(根据登录人获取权限). 
    * @date  2018年7月5日 
    * @author admin  
    * @param userid
    * @return
    * @throws Exception
     */
	public List<SysRole> getRole(String userid) throws Exception {
		return baseMapper.getRole(userid);
	}
	
	 public Integer loadCountPrivsByUsertype(Map<String, Object> params)
	            throws Exception{
		 return baseMapper.loadCountPrivsByUsertype(params);
	 }

}
