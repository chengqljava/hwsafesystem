/**  
 * Project Name:xx项目工程(英文名称)
 * File Name:EntPlanattachServiceImpl.java  
 * Package Name:com.zwsafety.module.enterprise.service.impl
 * Date:2016年06月06日
 * Copyright (c) 2016 ,zwsafety All Rights Reserved.   
 */
package com.hwsafe.enterprise.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.hwsafe.enterprise.domain.EntPlanattach;
import com.hwsafe.enterprise.mapper.EntPlanattachMapper;

import java.util.List;

/**
 * @ClassName:EntPlanattachServiceImpl
 * @Description:TODO(用一句话描述该文件做什么)
 * @date:2016年06月06日
 * @author xufeng
 * @version 1.0
 * @since JDK 1.7
 */
@Service
public class EntPlanattachService extends
        ServiceImpl<EntPlanattachMapper, EntPlanattach> {

  
    /**
     * 
     * @Title:loadByPlanId
     * @Description TODO(根据平面图id查询附件).
     * @date 2016年6月6日
     * @author yxx
     * @param planid
     *            平面图id
     * @return EntPlanattach
     * @throws Exception
     *             异常
     */
    public EntPlanattach loadByPlanId(String planid) throws Exception {
        return baseMapper.loadByPlanId(planid);
    }

    /**
     * 根据企业id查询企业平面图
     *
     * @param entid
     * @return
     * @throws Exception
     */
    public List<EntPlanattach> loadByEntid(String entid) throws Exception {
        return baseMapper.loadByEntid(entid);
    }
    
    public EntPlanattach selectById(String id) {
    	return baseMapper.selectById(id);
    }
    
    public void deleteById(String id) {
    	 baseMapper.deleteById(id);
    }

}
