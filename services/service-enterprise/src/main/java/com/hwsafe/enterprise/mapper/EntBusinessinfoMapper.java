/**  
 * Project Name:module_enterprise
 * File Name:EntBusinessinfoMapper.java  
 * Package Name:package com.zwsafety.module.enterprise.dao
 * Date:2016年05月13日
 * Copyright (c) 2016 ,zwsafety All Rights Reserved.   
 */
package com.hwsafe.enterprise.mapper;

import java.util.List;
import java.util.Map;

import org.apache.ibatis.annotations.Param;
import org.springframework.stereotype.Repository;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.hwsafe.enterprise.domain.EntBusinessinfo;



/**
 * @ClassName:EntBusinessinfoMapper
 * @Description:TODO(用一句话描述该文件做什么)
 * @date:2016年05月13日
 * @author peijun
 * @version 1.0
 * @since JDK 1.8
 */
public interface EntBusinessinfoMapper extends
        BaseMapper<EntBusinessinfo> {

    /**
     * @Title:loadDangerEntByPage
     * @Description TODO(查询危化品企业).
     * @date 2016年5月24日
     * @author peijun
     * @param params
     * @param pageBonuds
     * @return
     */
    public List<Map<String, Object>> loadDangerEntByPage(
            Map<String, Object> params) throws Exception;

    /**
     * @Title:loadEntSumCountByParam
     * @Description TODO(查询当前季度纳入管理的企业总数).
     * @date 2016年5月28日
     * @author peijun
     * @param params
     * @return List<Map<String,Object>>
     * @throws Exception
     */
    public List<Map<String, Object>> loadEntStatusCountByParam(
            Map<String, Object> params) throws Exception;

    /**
     * @Title:loadDangerEntReport
     * @Description TODO(危化品企业报告).
     * @date 2016年5月30日
     * @author yxx
     * @param date
     *            最大日期
     * @return List<Map<String, Object>>
     * @throws Exception
     *             异常
     */
    public List<Map<String, Object>> loadDangerEntReport(
            Map<String, Object> params) throws Exception;

    /**
     * @Title:loadEntClassCountByParam
     * @Description TODO(根据企业分类查询企业数量).
     * @date 2016年6月1日
     * @author peijun
     * @param params
     * @return
     * @throws Exception
     */
    public List<Map<String, Object>> loadEntClassCountByParam(
            Map<String, Object> params) throws Exception;

    /**
     * @Title:loadEntGradeCountByParam
     * @Description TODO(企业分级统计).
     * @date 2016年6月6日
     * @author peijun
     * @param params
     * @return
     * @throws Exception
     */
    public List<Map<String, Object>> loadEntGradeCountByParam(
            Map<String, Object> params) throws Exception;

    /**
     * @Title:loadEntDistrictCountByParam
     * @Description TODO(根据企业分布统计企业数量).
     * @date 2016年6月1日
     * @author peijun
     * @param params
     * @return
     * @throws Exception
     */
    public List<Map<String, Object>> loadEntDistrictCountByParam(
            Map<String, Object> params) throws Exception;

    /**
     * @Title:loadEntAreaStatusCountByParam
     * @Description TODO(区县区域填报情况统计).
     * @date 2016年6月1日
     * @author peijun
     * @param params
     * @return
     * @throws Exception
     */
    public List<Map<String, Object>> loadEntAreaStatusCountByParam(
            Map<String, Object> params) throws Exception;

    /**
     * @Title:loadEntDistrictClassCountByParam
     * @Description TODO(企业分类情况统计表).
     * @date 2016年6月6日
     * @author peijun
     * @param params
     * @param pageBonuds
     * @return
     * @throws Exception
     */
    public List<Map<String, Object>> loadEntDistrictClassCountByParam(
            Map<String, Object> params) throws Exception;

    /**
     * @Title:loadEntDistrictGradeCountByParam
     * @Description TODO(企业分级情况统计表).
     * @date 2016年6月7日
     * @author peijun
     * @param params
     * @param pageBonuds
     * @return
     * @throws Exception
     */
    public List<Map<String, Object>> loadEntDistrictGradeCountByParam(
            Map<String, Object> params) throws Exception;

    /**
     * @Title:loadByBusinessinfoid
     * @Description TODO(根据企业工商id查询所关联主管部门、主管分类)
     * @date 2016年6月3日
     * @author peijun
     * @param businessinfoid
     * @return
     * @throws Exception
     */
    public EntBusinessinfo loadByBusinessinfoid(
            @Param("businessinfoid") String businessinfoid) throws Exception;

    /**
     * @Title:findExportEntBusinfo
     * @Description TODO(excel导出工商信息).
     * @date 2016年6月14日
     * @author peijun
     * @param params
     * @return
     * @throws Exception
     */
    public List<Map<String, Object>> findExportEntBusinfo(
            Map<String, Object> params) throws Exception;

    /**
     * @Title:loadPatrolObjectByPage
     * @Description TODO(查询巡查对象).
     * @date 2016年7月14日
     * @author yxx
     * @param params
     *            参数map
     * @param pageBounds
     *            分页
     * @return List<Map<String, Object>>
     * @throws Exception
     *             异常
     */
    List<Map<String, Object>> loadPatrolObjectByPage(
            Map<String, Object> params) throws Exception;

    /**
     * @Title:findExportPatrolObject
     * @Description TODO(excel导出巡查对象信息).
     * @date 2016年7月12日
     * @author yxx
     * @param params
     *            参数map
     * @return List<Map<String, Object>>
     * @throws Exception
     *             异常
     */
    List<Map<String, Object>> findExportPatrolObject(Map<String, Object> params)
            throws Exception;

    /**
     * 
     * @Title:updateStatusById
     * @Description TODO(这里用一句话描述这个方法的作用). TODO(这里描述这个方法适用条件 – 可选).
     *              TODO(这里描述这个方法的执行流程 – 可选). TODO(这里描述这个方法的使用方法 – 可选).
     *              TODO(这里描述这个方法的注意事项 – 可选).
     * @date 2017年5月22日
     * @author QYS
     * @param params
     * @throws Exception
     */
    void updateStatusById(Map<String, Object> params) throws Exception;

    /**
     * @Title:loadByInfo
     * @Description TODO(分页查询-数据集).
     * @date 2015年7月14日 下午2:11:43
     * @author luyao
     * @param params
     *            查询参数
     * @param pageBounds
     *            分页参数
     * @return List<Map<String, Object>>
     * @throws Exception
     *             异常
     */
    public List<Map<String, Object>> loadByInfo(Map<String, Object> params) throws Exception;

    /**
     * @Title:loadEntCount
     * @Description TODO(查询企业数量).
     * @date 2015年7月20日
     * @author yxx
     * @param params
     *            查询参数
     * @return Integer
     * @throws Exception
     *             异常
     */
    Integer loadEntCount(Map<String, Object> params) throws Exception;

    /**
     * @Title:loadPatrolEntListByPage
     * @Description TODO(按年份季度展示巡查对象).
     * @date 2016年7月22日
     * @author yxx
     * @param params
     *            参数map
     * @param pageBounds
     *            分页
     * @return List<Map<String, Object>>
     * @throws Exception
     *             异常
     */
    List<Map<String, Object>> loadPatrolEntListByPage(
            Map<String, Object> params) throws Exception;

    /**
     * @Title:loadByPage
     * @Description TODO(根据企业名称 模糊查询 且只 查询有摄像头或探头的企业 监测监控GIS中搜索企业).
     * @date 2016年8月22日
     * @author lzqiangPC
     * @param entName
     * @return
     */
    public List<Map<String, Object>> loadPageByMac(Map<String, Object> params);

    /**
     * @Title:loadEntAllById
     * @Description TODO(手机端企业详细信息). TODO(这里描述这个方法适用条件 – 可选). TODO(这里描述这个方法的执行流程
     *              – 可选). TODO(这里描述这个方法的使用方法 – 可选). TODO(这里描述这个方法的注意事项 – 可选).
     * @date 2016年11月17日
     * @author luyao
     * @param params
     * @return
     * @throws Exception
     */
    Map<String, Object> loadEntAllById(
            @Param("businessinfoid") String businessinfoid) throws Exception;
    
    /**
     * 查询企业简单信息 id和name
    * @Title:loadEntSimpleInfo
    * @Description TODO(这里用一句话描述这个方法的作用). 
    * TODO(这里描述这个方法适用条件 – 可选).
    * TODO(这里描述这个方法的执行流程 – 可选).
    * TODO(这里描述这个方法的使用方法 – 可选).
    * TODO(这里描述这个方法的注意事项 – 可选).
    * @date  2017年9月15日 
    * @author Administrator  
     * @param params 
    * @return
    * @throws Exception
     */
    List<Map<String,Object>> loadEntSimpleInfo(Map<String, Object> params)throws Exception;
    /**
     * 查询企业列表信息
     * @Title:loadByPageList
     * @Description TODO(这里用一句话描述这个方法的作用).
     * TODO(这里描述这个方法适用条件 – 可选).
     * TODO(这里描述这个方法的执行流程 – 可选).
     * TODO(这里描述这个方法的使用方法 – 可选).
     * TODO(这里描述这个方法的注意事项 – 可选).
     * @date  2017年9月15日
     * @author Administrator
     * @param params
     * @return
     * @throws Exception
     */
    List<EntBusinessinfo> loadByPageList(Map<String, Object> params) throws Exception;

    /**
     * 查询企业监测监控情况 根据危险源信息区分
     * @Title:loadEntCountByDangerType
     * @Description TODO(这里用一句话描述这个方法的作用).
     * TODO(这里描述这个方法适用条件 – 可选).
     * TODO(这里描述这个方法的执行流程 – 可选).
     * TODO(这里描述这个方法的使用方法 – 可选).
     * TODO(这里描述这个方法的注意事项 – 可选).
     * @date  2017年9月15日
     * @author Administrator
     * @param params
     * @return
     * @throws Exception
     */
    List<Map<String,Object>> loadEntCountByDangerType(Map<String,Object> params) throws Exception;

    /**
     * 
    * @Title:insertEntDssRsktype
    * @Description TODO(这里用一句话描述这个方法的作用). 
    * TODO(这里描述这个方法适用条件 – 可选).
    * TODO(这里描述这个方法的执行流程 – 可选).
    * TODO(这里描述这个方法的使用方法 – 可选).
    * TODO(这里描述这个方法的注意事项 – 可选).
    * @date  2017年10月30日 
    * @author 刘晓斌 
    * @param paraMap
    * @throws Exception
     */
    public void insertEntDssRsktype(Map<String, Object> paraMap) throws Exception;

    /**
    * @Title:loadEntForHid
    * @Description TODO(手机端获取隐患企业). 
    * @date  2018年2月5日 
    * @author admin  
    * @param params
    * @param pageBounds
    * @return
    * @throws Exception
     */
	public List<Map<String, Object>> loadEntForHid(Map<String, Object> params) throws Exception;

    void updateBase(EntBusinessinfo entBusinessinfo)throws Exception;
    
    EntBusinessinfo loadById(String id);
}
