/**  
 * Project Name:xx项目工程(英文名称)
 * File Name:SysOperServiceImpl.java  
 * Package Name:com.zwsafety.module.system.service.impl
 * Date:2016年01月14日
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

import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.fasterxml.jackson.core.type.TypeReference;
import com.hwsafe.sys.domain.SysOper;
import com.hwsafe.sys.mapper.SysOperMapper;
import com.hwsafe.utils.IDGenerator;
import com.hwsafe.utils.JSONUtil;


/**
 * @ClassName:SysOperServiceImpl
 * @Description:TODO(用一句话描述该文件做什么)
 * @date:2016年01月14日
 * @author xufeng
 * @version 1.0
 * @since JDK 1.8
 */
@Service
public class SysOperService extends ServiceImpl<SysOperMapper, SysOper>
{

 
    /**
     * @Title loadCountLkOperById
     * @Description TODO(根据权限id数组查询权限操作关联)
     * @date 2016年4月18日
     * @author peijun
     * @param prividarr
     *            权限id数组
     * @return
     * @throws Exception
     * @see com.zwsafety.module.system.service.SysOperService#loadCountLkOperById(java.lang.String[])
     */
    public Integer loadCountLkOperById(String[] prividarr) throws Exception {
        List<String> list = Arrays.asList(prividarr);
        Map<String, Object> params = new HashMap<String, Object>();
        params.put("ids", list); // 根据ids过滤
        return baseMapper.loadCountLkOperById(params);
    }

    /**
     * @Title saveOper
     * @Description TODO(保存列表操作项)
     * @date 2016年4月20日
     * @author peijun
     * @param sOpers
     *            操作项字符串
     * @param privid
     *            权限id
     * @throws Exception
     * @see com.zwsafety.module.system.service.SysOperService#saveOper(java.lang.String)
     */
    public void saveOper(String sOpers, String privid) throws Exception {
        List<SysOper> operList = baseMapper.loadOperByPriId(privid);// 查询该权限下以前的操作项
        List<String> operids = null;// 临时变量,存储操作项id
        if (operList != null && operList.size() > 0) {
            operids = new ArrayList<String>();
            for (SysOper op : operList) {
                operids.add(op.getOperid());
            }
        }

        List<String> operidList = new ArrayList<String>();// 编辑后的数据
        List<SysOper> sOperList = JSONUtil.json2list(sOpers,
                new TypeReference<List<SysOper>>() {
                });// 新的操作项
        if (sOperList != null && sOperList.size() > 0) {
            for (SysOper sysOper : sOperList) {
                if (sysOper != null) {
                    if (StringUtils.isNotBlank(sysOper.getOperid())) {
                        if (operids != null && operids.size() > 0) {
                            if (operids.contains(sysOper.getOperid())) {
                            	baseMapper.updateById(sysOper); // 更新编辑后的数据
                                operidList.add(sysOper.getOperid());
                            }
                        }
                    } else {
                        sysOper.setOperid(IDGenerator.OBJECTID.generate());
                        sysOper.setPrivid(privid);// 所属的权限
                        baseMapper.insert(sysOper);
                    }
                }
            }
        }

        if (operids != null && operids.size() > 0) {
            for (String id : operids) {
                if (operidList != null) {
                    if (!operidList.contains(id)) {
                    	baseMapper.deleteById(id);// 删除操作项
                    }
                }
            }
        }

    }
    
    List<SysOper> loadOperByPrivIdsAndUserId(
             String[] privids,  String userid)
            throws Exception{
    	return baseMapper.loadOperByPrivIdsAndUserId(privids, userid);
    	
    }
    
    List<SysOper> loadOperByPrivIds(String[] privids) throws Exception{
		return baseMapper.loadOperByPrivIds(privids);
    	
    }
}
