/**  
 * Project Name:系统管理(module_system)
 * File Name:SysOrgMapper.java  
 * Package Name:package com.zwsafety.module.system.dao
 * Date:2016年04月27日
 * Copyright (c) 2016 ,zwsafety All Rights Reserved.   
 */
package com.hwsafe.sys.mapper;

import java.util.List;
import java.util.Map;


import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.hwsafe.sys.domain.SysOrg;



/**
 * @ClassName:SysOrgMapper
 * @Description:TODO(组织机构Mapper层)
 * @date:2016年04月27日
 * @author peijun
 * @version 1.0
 * @since JDK 1.8
 */

public interface SysOrgMapper extends BaseMapper<SysOrg> {

    /**
     * @Title:loadOrgTree
     * @Description TODO(组织机构树).
     * @date 2016年4月27日
     * @author peijun
     * @return List<Map<String, Object>>
     * @throws Exception
     *             异常
     */
    public List<Map<String, Object>> loadOrgTree() throws Exception;

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
            throws Exception;

    /**
     * @Title:loadCountLkParentById
     * @Description TODO(查询机构子节点数量).
     * @date 2016年4月28日
     * @author peijun
     * @param params
     *            机构id数组
     * @return Integer
     * @throws Exception
     *             异常
     */
    public Integer loadCountLkParentById(Map<String, Object> params)
            throws Exception;

    /**
     * @Title:loadAllOrgTree
     * @Description TODO(组织机构树查询条件).
     * @date 2016年6月12日
     * @author luyao
     * @return List<Map<String, Object>>
     * @throws Exception
     *             异常
     */
    public List<Map<String, Object>> loadAllOrgTree() throws Exception;
    

}
