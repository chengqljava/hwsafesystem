/**  
 * Project Name:系统管理(module_system)
 * File Name:SysOrgServiceImpl.java  
 * Package Name:com.zwsafety.module.system.service.impl
 * Date:2016年04月27日
 * Copyright (c) 2016 ,zwsafety All Rights Reserved.   
 */
package com.hwsafe.sys.service;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.apache.commons.lang3.StringUtils;

import org.springframework.stereotype.Service;

import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.hwsafe.exception.BizException;
import com.hwsafe.sys.domain.SysOrg;
import com.hwsafe.sys.mapper.SysOrgMapper;
import com.hwsafe.utils.RecursiveUtil;
import com.hwsafe.utils.RecursiveUtil.RecursiveBean;

/**
 * @ClassName:SysOrgServiceImpl
 * @Description:TODO(组织机构Service实现)
 * @date:2016年04月27日
 * @author peijun
 * @version 1.0
 * @since JDK 1.7
 */
@Service
public class SysOrgService extends ServiceImpl<SysOrgMapper, SysOrg>  {
	/**
     * @Title loadOrgTree
     * @Description TODO(机构树).
     * @date 2016年4月27日
     * @author peijun
     * @return List<Map<String, Object>>
     * @throws Exception
     *             异常
     * @see com.zwsafety.module.system.service.SysOrgService#loadOrgTree()
     */
    public List<Map<String, Object>> loadOrgTree() throws Exception {
        return baseMapper.loadOrgTree();
    }

    /**
     * @Title:loadOrgTree
     * @Description TODO(是否安委会成员单位树).
     * @date 2016年4月27日
     * @author peijun
     * @return List<Map<String, Object>>
     * @throws Exception
     *             异常
     */
    public List<Map<String, Object>> loadIsMemberTree(Map<String, Object> params)
            throws Exception {
        return baseMapper.loadIsMemberTree(params);
    }

    /**
     * @Title loadCountLkParentById
     * @Description TODO(查询机构子节点数量).
     * @date 2016年4月28日
     * @author peijun
     * @param orgidarr
     *            机构id数组
     * @return Integer
     * @throws Exception
     *             异常
     * @see com.zwsafety.module.system.service.SysOrgService#loadCountLkParentById(java.lang.String[])
     */
    public Integer loadCountLkParentById(String[] orgidarr) throws Exception {
        List<String> list = Arrays.asList(orgidarr);
        Map<String, Object> params = new HashMap<String, Object>();
        params.put("ids", list); // 根据ids过滤
        return baseMapper.loadCountLkParentById(params);
    }

    /**
     * @Title:loadOrgTreeByOrgid
     * @Description TODO(返回指定机构id下的机构树).
     * @date 2016年05月04日
     * @author yxx
     * @param orgid
     *            机构ID
     * @return List<Map<String, Object>>
     * @throws Exception
     *             异常
     */
   
    public List<Map<String, Object>> loadOrgTreeByOrgid(String orgid)
    		throws Exception{
        List<Map<String, Object>> allNodeList = loadOrgTree();
        List<String> idList = new ArrayList<String>();
        idList.add(orgid);
        findSubOrgIds(idList, allNodeList, orgid);
        return findOrgTreeByIds(allNodeList, idList);
    }

    /**
     * 
     * @Title:findSubOrgIds
     * @Description TODO(查找指定机构ID的所有子孙节点).
     * @date 2016年5月4日
     * @author yxx
     * @param idList
     *            所有子孙节点ID
     * @param allNodeList
     *            所有节点
     * @param orgid
     *            指定机构ID
     */
    private void findSubOrgIds(List<String> idList,
            List<Map<String, Object>> allNodeList, String orgid) {
        for (Map<String, Object> map : allNodeList) {
            String pid = map.get("pId").toString();
            // 父节点为orgid
            if (pid.equalsIgnoreCase(orgid)) {
                // 节点id
                String oid = map.get("id").toString();
                if (!idList.contains(oid)) {
                    idList.add(oid);
                    findSubOrgIds(idList, allNodeList, oid);
                }
            }
        }
    }

    /**
     * 
     * @Title:findOrgTreeByIds
     * @Description TODO(查询指定id的节点).
     * @date 2016年5月4日
     * @author yxx
     * @param allNodeList
     *            所有节点
     * @param idList
     *            指定的id
     * @return List<Map<String, Object>>
     */
    private List<Map<String, Object>> findOrgTreeByIds(
            List<Map<String, Object>> allNodeList, List<String> idList) {
        List<Map<String, Object>> resultNodeList = new ArrayList<Map<String, Object>>();
        for (Map<String, Object> map : allNodeList) {
            String oid = map.get("id").toString();
            for (String id : idList) {
                if (oid.equalsIgnoreCase(id)) {
                    resultNodeList.add(map);
                }
            }
        }
        return resultNodeList;
    }

    /**
     * @Title:loadAllOrgTree
     * @Description TODO(组织机构树查询条件).
     * @date 2016年6月12日
     * @author luyao
     * @return List<Map<String, Object>>
     * @throws Exception
     *             异常
     */
    public List<Map<String, Object>> loadAllOrgTree() throws Exception {
        return baseMapper.loadAllOrgTree();
    }

    /**
     * 
     * @Title:loadAllSubOrgids
     * @Description TODO(加载指定机构的所有下属机构).
     * @date 2016年7月4日
     * @author yxx
     * @param orgid
     *            机构id
     * @return List<String>
     * @throws Exception
     *             异常
     */
    public List<String> loadAllSubOrgids(String orgid) throws Exception {
        List<String> resultIds = new ArrayList<String>();
        if (!StringUtils.isEmpty(orgid)) {
        	QueryWrapper<SysOrg>  queryWrapper = new QueryWrapper<SysOrg>();
            queryWrapper.eq("orgid", orgid);
            List<SysOrg> sysOrgs = baseMapper.selectList(queryWrapper);
            if (sysOrgs != null && sysOrgs.size() > 0) {
                List<RecursiveBean> beanList = new ArrayList<RecursiveBean>();
                for (SysOrg sysOrg : sysOrgs) {
                    RecursiveBean bean = new RecursiveBean();
                    bean.setId(sysOrg.getOrgid());
                    bean.setPid(sysOrg.getParentid());
                    beanList.add(bean);
                }
                RecursiveUtil.recursive(beanList, resultIds, orgid);
            }
            resultIds.add(orgid);
        }
        return resultIds;
    }
    
    public List<SysOrg> loadByParentIdList(String parentId){
            if(StringUtils.isBlank(parentId)) {
            	throw new BizException("参数不能为空", parentId);
            }
            QueryWrapper<SysOrg> queryWrapper=new QueryWrapper<SysOrg>();
            queryWrapper.eq("parentid", parentId);
            return baseMapper.selectList(queryWrapper);
    }
}
