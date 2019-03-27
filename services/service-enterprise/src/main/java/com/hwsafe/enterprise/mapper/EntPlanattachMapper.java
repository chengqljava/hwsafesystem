/**  
 * Project Name:xx项目工程(英文名称)
 * File Name:EntPlanattachMapper.java  
 * Package Name:package com.zwsafety.module.enterprise.dao
 * Date:2016年06月06日
 * Copyright (c) 2016 ,zwsafety All Rights Reserved.   
 */
package com.hwsafe.enterprise.mapper;

import org.apache.ibatis.annotations.Param;
import org.springframework.stereotype.Repository;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.hwsafe.enterprise.domain.EntPlanattach;

import java.util.List;

/**
 * @ClassName:EntPlanattachMapper
 * @Description:TODO(用一句话描述该文件做什么)
 * @date:2016年06月06日
 * @author xufeng
 * @version 1.0
 * @since JDK 1.7
 */
public interface EntPlanattachMapper extends BaseMapper<EntPlanattach> {

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
    EntPlanattach loadByPlanId(@Param("planid") String planid) throws Exception;

    /**
     * 查询企业所有的平面图
     * @param entid
     * @return
     * @throws Exception
     */
    List<EntPlanattach> loadByEntid(@Param("entid") String entid) throws Exception;

}
