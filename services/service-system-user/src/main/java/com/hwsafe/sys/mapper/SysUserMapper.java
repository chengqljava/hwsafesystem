/**  
 * Project Name:xx项目工程(英文名称)
 * File Name:SysUserMapper.java  
 * Package Name:package com.zwsafety.module.system.dao
 * Date:2016年01月14日
 * Copyright (c) 2016 ,zwsafety All Rights Reserved.   
 */
package com.hwsafe.sys.mapper;

import java.util.List;
import java.util.Map;

import org.apache.ibatis.annotations.Param;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.hwsafe.sys.domain.SysUser;
import com.hwsafe.sys.domain.query.SysUserQuery;


/**
 * @ClassName:SysUserMapper
 * @Description:用户信息Mapper
 * @date:2016年1月14日
 * @author xufeng
 * @version 1.0
 * @since JDK 1.8
 */

public interface SysUserMapper extends BaseMapper<SysUser> {

    /**
     * 根据账号查询用户信息
     * 
     * @author peijun
     * @date 2015-05-21 20:59:17
     * @param username
     *            用户登录名
     * @return Map<String,Object> 用户集合
     * @throws Exception
     */
    public SysUser loadUserByUsername(@Param("username") String username)
            throws Exception;

    /**
     * @Title:loadRoleCheckById
     * @Description TODO(根据用户id查询角色是否被选中).
     * @date 2016年4月15日
     * @author luyao
     * @param id
     *            用户id
     * @return List<Map<String,Object>>
     * @throws Exception
     *             异常
     */
    public List<Map<String, Object>> loadRoleCheckById(
            Map<String, Object> params) throws Exception;

    /**
     * @Title:loadCountLkUserById
     * @Description TODO(根据机构id查询关联用户数量).
     * @date 2016年4月28日
     * @author peijun
     * @param params
     *            机构id数组
     * @return Integer
     * @throws Exception
     *             异常
     */
    public Integer loadCountLkUserByOrgId(Map<String, Object> params)
            throws Exception;

    /**
     * @Title:loadUserByOrganid
     * @Description TODO(根据企业或机构id查询用户).
     * @date 2016年6月15日
     * @author peijun
     * @param organid
     * @return
     * @throws Exception
     */
    public SysUser loadUserByOrganid(@Param("organid") String organid)
            throws Exception;

    /**
     * @Title:loadUserByOrgidSelect
     * @Description TODO(根据企业或机构id查询用户树).
     * @date 2016年7月1日
     * @author yxx
     * @param orgid
     *            机构id
     * @return List<Map<String, Object>>
     * @throws Exception
     *             异常
     */
    List<Map<String, Object>> loadUserByOrgidSelect(@Param("orgid") String orgid)
            throws Exception;

    /**
     * @Title:updateByOrganid
     * @Description TODO(根据机构id修改用户审核状态).
     * @date 2016年7月30日
     * @author luyao
     * @param params
     *            机构id数组
     * @return Integer
     * @throws Exception
     *             异常
     */
    public Integer updateByOrganid(Map<String, Object> params) throws Exception;

    /**
     * @Title:loadByEntList
     * @Description TODO(查询所有结果).
     * @date 2015年7月31日 下午2:14:09
     * @author luyao
     * @param params
     *            查询参数
     * @return List<T>
     * @throws Exception
     *             异常
     */
    public List<SysUser> loadByEntList(Map<String, Object> params)
            throws Exception;

    /**
     * @Title:loadOtherUserByOrgidSelect
     * @Description TODO(其他需要根据企业或机构id查询用户树， 如巡查对象、执法人员等不需要显示已经选择的用户).
     * @date 2016年8月24日
     * @author yxx
     * @param params
     *            参数
     * @return List<Map<String, Object>>
     * @throws Exception
     *             异常
     */
    List<Map<String, Object>> loadOtherUserByOrgidSelect(
            Map<String, Object> params) throws Exception;

    /**
     * @Title:loadLawUserSelect
     * @Description TODO(根据部门加载执法人员). TODO(这里描述这个方法适用条件 – 可选).
     *              TODO(这里描述这个方法的执行流程 – 可选). TODO(这里描述这个方法的使用方法 – 可选).
     *              TODO(这里描述这个方法的注意事项 – 可选).
     * @date 2017年5月11日
     * @author luyao
     * @param params
     * @return
     * @throws Exception
     */
    List<Map<String, Object>> loadDepartUserSelect(Map<String, Object> params)
            throws Exception;

    /**
     * 
     * @Title:loadLeaderUserSelect
     * @Description TODO(根据当前用户查询上级领导). TODO(这里描述这个方法适用条件 – 可选).
     *              TODO(这里描述这个方法的执行流程 – 可选). TODO(这里描述这个方法的使用方法 – 可选).
     *              TODO(这里描述这个方法的注意事项 – 可选).
     * @date 2017年5月20日
     * @author Administrator
     * @param params
     * @return
     * @throws Exception
     */
    List<Map<String, Object>> loadLeaderUserSelect(Map<String, Object> params)
            throws Exception;

    /**
     * 
     * @Title:loadzfuserlist
     * @Description TODO(这里用一句话描述这个方法的作用). TODO(这里描述这个方法适用条件 – 可选).
     *              TODO(这里描述这个方法的执行流程 – 可选). TODO(这里描述这个方法的使用方法 – 可选).
     *              TODO(这里描述这个方法的注意事项 – 可选).
     * @date 2017年5月31日
     * @author QYS
     * @param params
     * @return
     * @throws Exception
     */
    List<Map<String, Object>> loadzfuserlist(Map<String, Object> params)
            throws Exception;

    /**
     * 
     * @Title:loadUseridByPhone
     * @Description TODO(根据用户手机号查询用户id). TODO(这里描述这个方法适用条件 – 可选).
     *              TODO(这里描述这个方法的执行流程 – 可选). TODO(这里描述这个方法的使用方法 – 可选).
     *              TODO(这里描述这个方法的注意事项 – 可选).
     * @date 2017年6月1日
     * @author Administrator
     * @param params
     * @return
     * @throws Exception
     */
    List<Map<String, Object>> loadUseridByPhone(Map<String, Object> params)
            throws Exception;

    /**
     * 
     * @Title:loadEntNameByUserid
     * @Description TODO(根据用户userid获取企业名称). TODO(这里描述这个方法适用条件 – 可选).
     *              TODO(这里描述这个方法的执行流程 – 可选). TODO(这里描述这个方法的使用方法 – 可选).
     *              TODO(这里描述这个方法的注意事项 – 可选).
     * @date 2017年10月30日
     * @author yxx
     * @param orgid
     * @return
     * @throws Exception
     */
    String loadEntNameByUserid(@Param("userid") String userid) throws Exception;
    
    /**
     * 
     * 查询企业信息
     * @return
     * @throws Exception          
     * @author 软件部03
     * @create_time 2017年11月13日下午5:55:24
     */
    List<Map<String, Object>> loadEntinfo() throws Exception;
    
    /**
     * 
     * 查询有效的企业数据
     * @return
     * @throws Exception          
     * @author 软件部03
     * @create_time 2017年11月13日下午8:41:20
     */
    List<Map<String, Object>> loadValidEntinfo() throws Exception;

    public List<Map<String, Object>> loadUserSelect(Map<String, Object> param
                                                    ) throws Exception;

    /**
     * 获取个数
     * @param params
     * @return
     * @throws Exception
     */
    int loadCount(Map<String, Object> params) throws Exception;
    
    public SysUser loadUserByUserId(@Param("userid") String userid)
            throws Exception;
    
    List<Map<String, Object>>  loadByPage(Page page,@Param("username")String username,@Param("nickname")String nickname,@Param("usertype")String usertype,@Param("orgid") String orgid);
}
