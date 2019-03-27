/**
 * Project Name:module_enterprise
 * File Name:EntBusinessinfoServiceImpl.java
 * Package Name:com.zwsafety.module.enterprise.service.impl
 * Date:2016年05月13日
 * Copyright (c) 2016 ,zwsafety All Rights Reserved.
 */
package com.hwsafe.enterprise.service;

import java.math.BigDecimal;
import java.util.*;

import org.apache.commons.beanutils.BeanUtils;
import org.apache.commons.lang3.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.multipart.MultipartHttpServletRequest;

import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.hwsafe.enterprise.constants.Constants;
import com.hwsafe.enterprise.domain.EntAddress;
import com.hwsafe.enterprise.domain.EntBusinessInfoBO;
import com.hwsafe.enterprise.domain.EntBusinessinfo;
import com.hwsafe.enterprise.domain.EntPlan;
import com.hwsafe.enterprise.domain.EntPlanattach;
import com.hwsafe.enterprise.domain.LkPlanBusinessinfoid;
import com.hwsafe.enterprise.mapper.EntBusinessinfoMapper;
import com.hwsafe.sys.constants.SysConstants;
import com.hwsafe.sys.domain.SysUser;
import com.hwsafe.sys.service.LkUserRoleService;
import com.hwsafe.sys.service.SysRoleService;
import com.hwsafe.sys.service.SysUserService;
import com.hwsafe.utils.BeanMapper;
import com.hwsafe.utils.BeanUtil;
import com.hwsafe.utils.DateUtil;
import com.hwsafe.utils.Digests;
import com.hwsafe.utils.GpsUtil;
import com.hwsafe.utils.IDGenerator;
import com.hwsafe.validate.Check;

/**
 * @author peijun
 * @version 1.0
 * @ClassName:EntBusinessinfoServiceImpl
 * @Description:TODO(工商信息接口实现)
 * @date:2016年05月13日
 * @since JDK 1.8
 */
@Service
public class EntBusinessinfoService extends
        ServiceImpl<EntBusinessinfoMapper,EntBusinessinfo>  {

    
    @Autowired
    private SysUserService sysUserService;

    @Autowired
    private SysRoleService sysRoleService;

    @Autowired
    private LkUserRoleService lkUserRoleService;

    @Autowired
    private EntAuditService entAuditService;

    @Autowired
    private EntAddressService entAddressService;
    @Autowired
    private EntPlanattachService entPlanattachService;
    @Autowired
    private EntPlanService entPlanService;
    @Autowired
    private LkPlanBusinessinfoidService lkPlanBusinessinfoidService;


    /**
     * @param params
     * @param pageBonuds
     * @return
     * @Title loadDangerEntByPage
     * @Description TODO(查询危化品企业)
     * @date 2016年5月24日
     * @author peijun
     * 是否分页
     */
    public List<Map<String, Object>> loadDangerEntByPage(
            Map<String, Object> params) throws Exception {
        return baseMapper.loadDangerEntByPage(params);
    }

    /**
     * @param params
     * @return List<Map       <       String       ,       Object>>
     * @throws Exception
     * @Title loadEntSumCountByParam
     * @Description TODO(根据采集状态查询企业数量).
     * @date 2016年5月28日
     * @author peijun
     */
    public List<Map<String, Object>> loadEntStatusCountByParam(
            Map<String, Object> params) throws Exception {
        return baseMapper.loadEntStatusCountByParam(params);
    }

    /**
     * @param params
     * @return List<Map       <       String       ,       Object>>
     * @throws Exception
     * @Title:loadEntClassCountByParam
     * @Description TODO(根据企业分类查询企业数量).
     * @date 2016年6月1日
     * @author peijun
     */
    public List<Map<String, Object>> loadEntClassCountByParam(
            Map<String, Object> params) throws Exception {
        return baseMapper.loadEntClassCountByParam(params);
    }

    /**
     * @param params
     * @return
     * @throws Exception
     * @Title loadEntGradeCountByParam
     * @Description TODO(企业分级统计).
     * @date 2016年6月6日
     * @author peijun
     * @see com.zwsafety.module.enterprise.service.EntBusinessinfoService#loadEntGradeCountByParam(java.util.Map)
     */
    public List<Map<String, Object>> loadEntGradeCountByParam(
            Map<String, Object> params) throws Exception {
        return baseMapper.loadEntGradeCountByParam(params);
    }

    /**
     * @param params
     * @return
     * @throws Exception
     * @Title loadEntDistrictCountByParam
     * @Description TODO(根据企业分布统计企业数量).
     * @date 2016年6月1日
     * @author peijun
     * @see com.zwsafety.module.enterprise.service.EntBusinessinfoService#loadEntDistrictCountByParam(java.util.Map)
     */
    public List<Map<String, Object>> loadEntDistrictCountByParam(
            Map<String, Object> params) throws Exception {
        return baseMapper.loadEntDistrictCountByParam(params);
    }

    /**
     * @param params
     * @return
     * @throws Exception
     * @Title loadEntAreaStatusCountByParam
     * @Description TODO(区县区域填报情况统计).
     * @date 2016年6月1日
     * @author peijun
     */
    public List<Map<String, Object>> loadEntAreaStatusCountByParam(
            Map<String, Object> params) throws Exception {
        return baseMapper.loadEntAreaStatusCountByParam(params);
    }

    /**
     * @param params
     * @param pageBonuds
     * @return
     * @throws Exception
     * @Title loadEntDistrictClassCountByParam
     * @Description TODO(企业分类情况统计表).
     * @date 2016年6月6日
     * @author peijun
     */
    public List<Map<String, Object>> loadEntDistrictClassCountByParam(
            Map<String, Object> params) throws Exception {
        return baseMapper.loadEntDistrictClassCountByParam(params);
    }

    /**
     * @param params
     * @param pageBonuds
     * @return
     * @throws Exception
     * @Title loadEntDistrictGradeCountByParam
     * @Description TODO(企业分级情况统计表).
     * @date 2016年6月7日
     * @author peijun
     */
    public List<Map<String, Object>> loadEntDistrictGradeCountByParam(
            Map<String, Object> params) throws Exception {
        return baseMapper.loadEntDistrictGradeCountByParam(params);
    }

    /**
     * @param businessinfoid
     * @return
     * @throws Exception
     * @Title loadByBusinessinfoid
     * @Description TODO(根据企业工商id查询所关联主管部门 、 主管分类)
     * @date 2016年6月3日
     * @author peijun
     */
    public EntBusinessinfo loadByBusinessinfoid(String businessinfoid)
            throws Exception {
        return baseMapper.loadByBusinessinfoid(businessinfoid);
    }

    /**
     * @param entBusinessinfo
     * @throws Exception
     * @Title save
     * @Description TODO(保存工商信息记录 - 默认分配企业管理员)
     * @date 2016年5月26日
     * @author peijun
     */
    public void save(EntBusinessInfoBO entBusinessinfoBO) throws Exception {
        // GIS空间数据保存
        /*
         * Map<String, Object> gisParams = null; String gisid = ""; if
         * (entBusinessinfo.getLongitude() != null &&
         * entBusinessinfo.getLatitude() != null) { gisParams = new
         * HashMap<String, Object>(); gisParams.put("id", "");
         * gisParams.put("x", entBusinessinfo.getLongitude());
         * gisParams.put("y", entBusinessinfo.getLatitude());
         * olgAddrMapper.save(gisParams); gisid =
         * BeanUtil.getStringValue(gisParams, "id"); if
         * (StringUtils.isNotBlank(gisid)) { entBusinessinfo.setGisid(gisid); }
         * }
         */
        // 保存工商信息
    	EntBusinessinfo  entBusinessinfo=BeanMapper.map(entBusinessinfoBO, EntBusinessinfo.class);
        String entBusinessinfoId = entBusinessinfoBO.getBusinessinfoid();
        if (null == entBusinessinfoId || "".equals(entBusinessinfoId)) {
            entBusinessinfo.setBusinessinfoid(IDGenerator.OBJECTID.generate());
        }
        baseMapper.insert(entBusinessinfo);

        // 公司地址
        List<EntAddress> entAddresses = entBusinessinfoBO.getEntAddresses();
        if (entAddresses != null && entAddresses.size() > 0) {
            for (EntAddress ea : entAddresses) {
                if (StringUtils.isNotBlank(ea.getAddressname())) {
                    EntAddress eaddress = new EntAddress();
                    eaddress.setAddressname(ea.getAddressname());
                    eaddress.setAddresstype(ea.getAddresstype());
                    eaddress.setBusinessinfoid(entBusinessinfo
                            .getBusinessinfoid());
                    eaddress.setAddressid(IDGenerator.OBJECTID.generate());
                    entAddressService.save(eaddress);
                }
            }
        }

        // 默认分配企业管理员用户
        SysUser sysUser = new SysUser();
        // 账号-企业名称
        sysUser.setUsername(entBusinessinfo.getEntname()); // 账号
        sysUser.setNickname(entBusinessinfo.getEntname()); // 用户为企业账号
        String encrypt = Digests.encryptMD5(entBusinessinfo.getEntname()
                + SysConstants.SYSTEM_USER_DEFAULT_PASSWORD);
        sysUser.setPassword(encrypt); // 默认密码
        sysUser.setUsertype(SysConstants.SYSTEM_USERTYPE_ENT);// 企业用户
        sysUser.setOrganid(entBusinessinfo.getBusinessinfoid()); // 所对应的企业
        sysUser.setCheckstates(SysConstants.SYSTEM_CHECKSTATES_NO);// 用户未审核
        sysUser.setUserstates(SysConstants.SYSTEM_USERSTATES_NORMAL);// 正常用户
        sysUser.setUserid(IDGenerator.OBJECTID.generate());
        sysUserService.save(sysUser);

        // 企业注册时创建用户为当前注册用户
        if (entBusinessinfo.getRegisteruser() == null) {
            EntBusinessinfo businessinfo = new EntBusinessinfo();
            businessinfo = baseMapper.selectById(entBusinessinfo
                    .getBusinessinfoid());
            businessinfo.setRegisteruser(sysUser.getUserid());
            baseMapper.updateById(businessinfo);
        }

        // 默认分配企业管理员角色
        List<Map<String, Object>> result = sysRoleService
                .loadByUsertype(SysConstants.SYSTEM_USERTYPE_ENT); // 企业用户类型角色
        if (result != null && result.size() > 0) {
            for (int i = 0; i < result.size(); i++) {
                String roleaname = BeanUtil.getStringValue(result.get(i),
                        "ROLENAME");
                if ("企业管理员".equals(roleaname)) {
                    String roleid = BeanUtil.getStringValue(result.get(i),
                            "ROLEID");
                    if (StringUtils.isNotBlank(roleid)) {
                        lkUserRoleService.saveUserRole(IDGenerator.OBJECTID.generate(),
                                sysUser.getUserid(), roleid);
                    }
                }
            }
        }

        // 为当前企业用户新增默认的六大风险类型
        String curLogUserId = "", curDatatime = DateUtil.format_yyyyMMddHHmmss(new Date()), businessinfoid = entBusinessinfo
                .getBusinessinfoid();

        // 维修作业活动
        Map<String, Object> paraMap1 = new HashMap<String, Object>();
        paraMap1.put("typeid", IDGenerator.OBJECTID.generate());
        paraMap1.put("parentid", "-1");
        paraMap1.put("typename", "维修作业活动");
        paraMap1.put("typecode", "1");
        paraMap1.put("ordernum", "1");
        paraMap1.put("notes", "维修作业活动");
        paraMap1.put("belongcate", "1");
        paraMap1.put("belongent", businessinfoid);
        paraMap1.put("creater", curLogUserId);
        paraMap1.put("ceatetime", curDatatime);
        paraMap1.put("typelvl", "1");
        baseMapper.insertEntDssRsktype(paraMap1);

        // 设备设施
        Map<String, Object> paraMap2 = new HashMap<String, Object>();
        paraMap2.put("typeid", IDGenerator.OBJECTID.generate());
        paraMap2.put("parentid", "-1");
        paraMap2.put("typename", "设备设施");
        paraMap2.put("typecode", "2");
        paraMap2.put("ordernum", "1");
        paraMap2.put("notes", "设备设施");
        paraMap2.put("belongcate", "1");
        paraMap2.put("belongent", businessinfoid);
        paraMap2.put("creater", curLogUserId);
        paraMap2.put("ceatetime", curDatatime);
        paraMap2.put("typelvl", "1");
        baseMapper.insertEntDssRsktype(paraMap2);

        // 工艺过程
        Map<String, Object> paraMap3 = new HashMap<String, Object>();
        paraMap3.put("typeid", IDGenerator.OBJECTID.generate());
        paraMap3.put("parentid", "-1");
        paraMap3.put("typename", "工艺过程");
        paraMap3.put("typecode", "3");
        paraMap3.put("ordernum", "1");
        paraMap3.put("notes", "工艺过程");
        paraMap3.put("belongcate", "1");
        paraMap3.put("belongent", businessinfoid);
        paraMap3.put("creater", curLogUserId);
        paraMap3.put("ceatetime", curDatatime);
        paraMap3.put("typelvl", "1");
        baseMapper.insertEntDssRsktype(paraMap3);

        // 操作程序
        Map<String, Object> paraMap4 = new HashMap<String, Object>();
        paraMap4.put("typeid", IDGenerator.OBJECTID.generate());
        paraMap4.put("parentid", "-1");
        paraMap4.put("typename", "操作程序");
        paraMap4.put("typecode", "4");
        paraMap4.put("ordernum", "1");
        paraMap4.put("notes", "操作程序");
        paraMap4.put("belongcate", "1");
        paraMap4.put("belongent", businessinfoid);
        paraMap4.put("creater", curLogUserId);
        paraMap4.put("ceatetime", curDatatime);
        paraMap4.put("typelvl", "1");
        baseMapper.insertEntDssRsktype(paraMap4);

        // 场所环境
        Map<String, Object> paraMap5 = new HashMap<String, Object>();
        paraMap5.put("typeid", IDGenerator.OBJECTID.generate());
        paraMap5.put("parentid", "-1");
        paraMap5.put("typename", "场所环境");
        paraMap5.put("typecode", "5");
        paraMap5.put("ordernum", "1");
        paraMap5.put("notes", "场所环境");
        paraMap5.put("belongcate", "1");
        paraMap5.put("belongent", businessinfoid);
        paraMap5.put("creater", curLogUserId);
        paraMap5.put("ceatetime", curDatatime);
        paraMap5.put("typelvl", "1");
        baseMapper.insertEntDssRsktype(paraMap5);

        // 生产作业活动
        Map<String, Object> paraMap6 = new HashMap<String, Object>();
        paraMap6.put("typeid", IDGenerator.OBJECTID.generate());
        paraMap6.put("parentid", "-1");
        paraMap6.put("typename", "生产作业活动");
        paraMap6.put("typecode", "6");
        paraMap6.put("ordernum", "1");
        paraMap6.put("notes", "生产作业活动");
        paraMap6.put("belongcate", "1");
        paraMap6.put("belongent", businessinfoid);
        paraMap6.put("creater", curLogUserId);
        paraMap6.put("ceatetime", curDatatime);
        paraMap6.put("typelvl", "1");
        baseMapper.insertEntDssRsktype(paraMap6);
    }

    /**
     * @param entBusinessinfo
     * @throws Exception
     * @Title update
     * @Description TODO(更新工商信息)
     * @date 2016年6月7日
     * @author peijun
     */
    public void update(EntBusinessinfo entBusinessinfo) throws Exception {
        // GIS空间数据保存
        /*
         * Map<String, Object> gisParams = new HashMap<String, Object>(); String
         * gisid = ""; if (StringUtils.isNotBlank(entBusinessinfo.getGisid())) {
         * gisParams.put("id", entBusinessinfo.getGisid()); gisParams.put("x",
         * entBusinessinfo.getLongitude()); gisParams.put("y",
         * entBusinessinfo.getLatitude()); olgAddrMapper.update(gisParams); }
         * else { if (entBusinessinfo.getLongitude() != null &&
         * entBusinessinfo.getLatitude() != null) { gisParams.put("id", "");
         * gisParams.put("x", entBusinessinfo.getLongitude());
         * gisParams.put("y", entBusinessinfo.getLatitude());
         * olgAddrMapper.save(gisParams); gisid =
         * BeanUtil.getStringValue(gisParams, "id");
         * entBusinessinfo.setGisid(gisid); } }
         */

        /*
         * SysUser sysUser = sysUserMapper.loadUserByOrganid(entBusinessinfo
         * .getBusinessinfoid()); if (sysUser != null) { String entname =
         * entBusinessinfo.getEntname(); // 修改了企业名称 String username =
         * sysUser.getUsername(); if (!entname.equalsIgnoreCase(username)) {
         * sysUser.setNickname(entname); sysUser.setUsername(entname); String
         * encrypt = Encrypter .encrypt(entBusinessinfo.getEntname() +
         * Constants.SYSTEM_USER_DEFAULT_PASSWORD, Encrypter.MD5);
         * sysUser.setPassword(encrypt); // 密码重置
         * sysUser.setCheckstates(com.zwsafety
         * .module.enterprise.constants.Constants
         * .ENTERPRISE_BASEINFO_STATUS_YESAUDIT); // 企业未审核
         * sysUserMapper.update(sysUser); } }
         */

    	baseMapper.updateById(entBusinessinfo);

        // 公司地址
        entAddressService.deleteByBusinessinfoid(entBusinessinfo
                .getBusinessinfoid()); // 先删除以前的

        List<EntAddress> entAddresses = null;
        		
        		//entBusinessinfo.getEntAddresses();
        if (entAddresses != null && entAddresses.size() > 0) {
            for (EntAddress ea : entAddresses) {
                if (StringUtils.isNotBlank(ea.getAddressname())) {
                    EntAddress eaddress = new EntAddress();
                    eaddress.setAddressname(ea.getAddressname());
                    eaddress.setAddresstype(ea.getAddresstype());
                    eaddress.setBusinessinfoid(entBusinessinfo
                            .getBusinessinfoid());
                    // 保存新的
                    eaddress.setAddressid(IDGenerator.OBJECTID.generate());
                    entAddressService.save(eaddress);
                }
            }
        }
    }

    /**
     * @param params
     * @throws Exception
     * @Title updateStatusById
     * @Description TODO 简单描述重写方法的实现功能（可选）.
     * @date 2017年5月22日
     * @author QYS
     * @see com.zwsafety.module.enterprise.service.EntBusinessinfoService#updateStatusById(java.util.Map)
     */
    public void updateStatusById(Map<String, Object> params) throws Exception {
    	baseMapper.updateStatusById(params);
    }

    /**
     * @param entBusinessinfo
     * @throws Exception
     * @Title updateReportBusinessinfo
     * @Description TODO()
     * @date 2016年5月26日
     * @author peijun
     * @see com.zwsafety.module.enterprise.service.EntBusinessinfoService#updateReportBusinessinfo(com.zwsafety.module.enterprise.entity.EntBusinessinfo)
     */
    public void updateReportBusinessinfo(EntBusinessinfo entBusinessinfo)
            throws Exception {
    	baseMapper.updateById(entBusinessinfo);// 先更新工商信息

        // 删除企业工商所对应的审核信息
        entAuditService.deleteByBusinessinfoid(entBusinessinfo
                .getBusinessinfoid());

    }

    /**
     * @param id 工商信息id
     * @throws Exception
     * @Title:delete
     * @Description TODO(删除工商信息逻辑删除).
     * @date 2016年5月19日
     * @author peijun
     */
    public void delete(String id) throws Exception {
        EntBusinessinfo entBusinessinfo = baseMapper.selectById(id);
        entBusinessinfo
                .setDatastatus(Constants.ENTERPRISE_BASEINFO_STATUS_NODELETE);
        baseMapper.updateById(entBusinessinfo); // 设置状态

        List<String> list = Arrays.asList(id);
        Map<String, Object> params = new HashMap<String, Object>();
        params.put("ids", list); // 根据ids过滤
        params.put("checknum", SysConstants.SYSTEM_CHECKSTATES_NO);// 未审核
        params.put("userstates", SysConstants.SYSTEM_USERSTATES_DELETE);// 已删除

        sysUserService.updateByOrganid(params);
    }

    /**
     * @param params
     * @return
     * @throws Exception
     * @Title findExportEntBusinfo
     * @Description TODO(excel导出工商信息)
     * @date 2016年6月14日
     * @author peijun
     */
    public List<Map<String, Object>> findExportEntBusinfo(
            Map<String, Object> params) throws Exception {
        return baseMapper.findExportEntBusinfo(params);
    }

    /**
     * @param params     参数map
     * @param pageBounds 分页
     * @return List<Map       <       String       ,               Object>>
     * @throws Exception 异常
     * @Title:loadPatrolObjectByPage
     * @Description TODO(查询巡查对象).
     * @date 2016年7月12日
     * @author yxx
     */
    public List<Map<String, Object>> loadPatrolObjectByPage(
            Map<String, Object> params) throws Exception {
        return baseMapper.loadPatrolObjectByPage(params);
    }

    /**
     * @param params 参数map
     * @return List<Map       <       String       ,               Object>>
     * @throws Exception 异常
     * @Title:findExportPatrolObject
     * @Description TODO(excel导出巡查对象信息).
     * @date 2016年7月12日
     * @author yxx
     */
    public List<Map<String, Object>> findExportPatrolObject(
            Map<String, Object> params) throws Exception {
        return baseMapper.findExportPatrolObject(params);
    }

    /**
     * @param params     查询参数
     * @param pageBounds 分页参数
     * @return List<Map       <       String       ,               Object>>
     * @throws Exception 异常
     * @Title:loadByInfo
     * @Description TODO(分页查询 - 数据集).
     * @date 2015年7月14日 下午2:11:43
     * @author luyao
     */
    public List<Map<String, Object>> loadByInfo(Map<String, Object> params) throws Exception {
        return baseMapper.loadByInfo(params);
    }

    /**
     * @param entBusinessinfo
     * @throws Exception
     * @Title saveClassify
     * @Description TODO(保存企业分类信息)
     * @date 2016年7月29日
     * @author lzqiangPC
     */
    public void saveClassify(EntBusinessinfo entBusinessinfo) throws Exception {
        EntBusinessinfo businessinfo = baseMapper
                .selectById(entBusinessinfo.getBusinessinfoid());
        BeanUtils.copyProperty(businessinfo, "directortypeid",
                entBusinessinfo.getDirectortypeid());// 行业主管分类
        BeanUtils.copyProperty(businessinfo, "islittle",
                entBusinessinfo.getIslittle());// 是否三小场所
        BeanUtils.copyProperty(businessinfo, "isscale",
                entBusinessinfo.getIsscale());// 是否规模企业
        BeanUtils.copyProperty(businessinfo, "subjection",
                entBusinessinfo.getSubjection());// 单位管辖隶属关系
        baseMapper.updateById(businessinfo);
    }

    /**
     * @param ids
     * @throws Exception
     * @Title:checkEnt
         (审核企业信息).
     * @date 2016年7月30日
     * @author luyao
     * TODO 无意义
     */
    public void checkEnt(String[] ids) throws Exception {
        for (int i = 0; i < ids.length; i++) {
            EntBusinessinfo entBusinessinfo = baseMapper
                    .selectById(ids[i]);

        }
    }

    /**
     * @param entName
     * @return
     * @Title:loadByPage
     * @Description TODO(根据企业名称 模糊查询 且只 查询有摄像头或探头的企业 监测监控GIS中搜索企业).
     * @date 2016年8月22日
     * @author lzqiangPC
     */
    public List<Map<String, Object>> loadPageByMac(String entName) {
        Map<String, Object> params = new HashMap<String, Object>();
        params.put("entname", entName);
        return baseMapper.loadPageByMac(params);
    }

    public List<Map<String, Object>> loadPageByMac(String entName,
                                                   String districtcode, String businessinfoid) throws Exception {
        Map<String, Object> params = new HashMap<String, Object>();
        params.put("entname", entName);
        params.put("districtcode", districtcode);
        params.put("businessinfoid", businessinfoid);
        return baseMapper.loadPageByMac(params);
    }

    public Map<String, Object> loadEntAllById(String businessinfoid)
            throws Exception {
        return baseMapper.loadEntAllById(businessinfoid);
    }

    /**
     * @param list
     * @throws Exception
     * @Title:save
     * @Description TODO(保存Excel导入数据). TODO(这里描述这个方法适用条件 – 可选).
     * TODO(这里描述这个方法的执行流程 – 可选). TODO(这里描述这个方法的使用方法 – 可选).
     * TODO(这里描述这个方法的注意事项 – 可选).
     * @date 2017年7月27日
     * @author luyao
     */
    public void saveEnt(List<?> list) throws Exception {
        if (list != null && list.size() > 0) {
            EntBusinessinfo entBusinessinfo;
            for (int i = 0; i < list.size(); i++) {
                entBusinessinfo = (EntBusinessinfo) list.get(i);
                entBusinessinfo.setBusinessinfoid(IDGenerator.OBJECTID.generate());
                entBusinessinfo
                        .setStatus(Constants.ENTERPRISE_BASEINFO_STATUS_NOREPORT);// 未填报
                entBusinessinfo
                        .setDatastatus(Constants.ENTERPRISE_BASEINFO_STATUS_YESDELETE);// 数据状态(未删除)
                // 默认为上海市-青浦区
                entBusinessinfo.setCity("310000000000");
                entBusinessinfo.setArea("1112330388BB46C9814F56A6D6C2324A");

                super.save(entBusinessinfo);
            }
        }

    }

    public List<Map<String, Object>> loadEntSimpleInfo(
            Map<String, Object> params) throws Exception {

        // TODO Auto-generated method stub
        return baseMapper.loadEntSimpleInfo(params);

    }

    public List<EntBusinessinfo> loadByList(Map<String, Object> params) throws Exception {
        return baseMapper.loadByPageList(params);
    }

    /**
     * 获取周边企业信息
     *
     * @param longitude
     * @param latitude
     * @param miles
     * @return
     * @throws Exception
     */
    public List<EntBusinessinfo> selectEntByNear(BigDecimal longitude,
                                                 BigDecimal latitude, BigDecimal miles) throws Exception {

        // 查询出所有的企业信息
        List<EntBusinessinfo> entBusinessinfos = baseMapper.selectList(new QueryWrapper<EntBusinessinfo>());
        List<EntBusinessinfo> results = new ArrayList<>();

        for (EntBusinessinfo entBusinessinfo : entBusinessinfos) {
            if (entBusinessinfo.getLatitude() != null
                    && entBusinessinfo.getLongitude() != null) {
                double v = GpsUtil.calculateLineDistance(entBusinessinfo
                                .getLongitude().doubleValue(), entBusinessinfo
                                .getLatitude().doubleValue(), longitude.doubleValue(),
                        latitude.doubleValue());

                if (BigDecimal.valueOf(v).compareTo(miles) == -1) {
                    results.add(entBusinessinfo);
                }
            }
        }

        return results;
    }

    /**
     * 查询企业监测监控情况 根据危险源信息区分
     *
     * @param params
     * @return
     * @throws Exception
     * @Title:loadEntCountByDangerType
     * @Description TODO(这里用一句话描述这个方法的作用). TODO(这里描述这个方法适用条件 – 可选).
     * TODO(这里描述这个方法的执行流程 – 可选). TODO(这里描述这个方法的使用方法 – 可选).
     * TODO(这里描述这个方法的注意事项 – 可选).
     * @date 2017年9月15日
     * @author Administrator
     */
    public List<Map<String, Object>> loadEntCountByDangerType(
            Map<String, Object> params) throws Exception {
        return baseMapper.loadEntCountByDangerType(params);
    }

    /**
     * @param paraMap
     * @throws Exception
     * @Title insertEntDssRsktype
     * @Description TODO 简单描述重写方法的实现功能（可选）.
     * @date 2017年10月30日
     * @author 刘晓斌
     * @see com.zwsafety.module.enterprise.service.EntBusinessinfoService#insertEntDssRsktype(java.util.Map)
     */

    public void insertEntDssRsktype(Map<String, Object> paraMap)
            throws Exception {
    	baseMapper.insertEntDssRsktype(paraMap);
    }

    public List<Map<String, Object>> loadEntForHid(Map<String, Object> params) throws Exception {
        return baseMapper.loadEntForHid(params);
    }

    public void updateBase(EntBusinessinfo entBusinessinfo) throws Exception {
    	baseMapper.updateBase(entBusinessinfo);
    }
    @Transactional
    public void saveBase(EntBusinessinfo entBusinessinfo, MultipartHttpServletRequest multipartRequest, String delids) throws Exception {
        if (StringUtils.isEmpty(entBusinessinfo.getBusinessinfoid())) {
            // 新增
            entBusinessinfo.setUpdatetime(new Date());
            entBusinessinfo.setBusinessinfoid(IDGenerator.OBJECTID.generate());
            baseMapper.insert(entBusinessinfo);
        } else {
            // 更新
            entBusinessinfo.setUpdatetime(new Date());
            baseMapper.updateBase(entBusinessinfo);

            // 删除原文件
            if (!StringUtils.isEmpty(delids)) {
                EntPlanattach entPlanattach;
                String[] ids = delids.split(",");
                for (int i = 0; i < ids.length; i++) {
                    entPlanattach = entPlanattachService.selectById(ids[i]);
                    entPlanattachService.deleteById(entPlanattach.getAttachid());
                   // FileUtil.delete(multipartRequest, entPlanattach.getAttachurl());
                    entPlanService.deleteById(entPlanattach.getPlanid());
                }
            }
        }

        Iterator<?> it = multipartRequest.getFileNames();
        while (it.hasNext()) {
            String key = (String) it.next();
            List<MultipartFile> files = multipartRequest.getFiles(key);

            for (MultipartFile file : files) {
                // Constant.UPLOAD_PATH_ENTHAZARDOUSJOB_FILE 是一个配置文件路径
                EntPlan entPlan = new EntPlan();
                entPlan.setPlanid(IDGenerator.OBJECTID.generate());
                entPlan.setEntid(entBusinessinfo.getBusinessinfoid());
                entPlan.setPlanname(file.getOriginalFilename());
                entPlanService.save(entPlan);
				/*
				 * String safcontentfile = FileUtil.getUploadPath(
				 * Constants.UPLOAD_PATH_ENTPLAN_IMAGE, file); // 文件子路径
				 * FileUtil.upload(multipartRequest, safcontentfile, file); // 上传文件
				 */              
                EntPlanattach entPlanattach = new EntPlanattach();
                entPlanattach.setPlanid(entPlan.getPlanid());
                entPlanattach.setAttachname(file.getOriginalFilename());
                //entPlanattach.setAttachurl(safcontentfile);
               // entPlanattach.setAttachtype(FileUtil.getFileSuffix(file
                //        .getOriginalFilename()));
                entPlanattach.setUploadtime(new Date());
                entPlanattach.setAttachid(IDGenerator.OBJECTID.generate());
                entPlanattachService.save(entPlanattach);

                LkPlanBusinessinfoid lkPlanBusinessinfoid = new LkPlanBusinessinfoid();
                lkPlanBusinessinfoid.setBusplanid(IDGenerator.OBJECTID.generate());
                lkPlanBusinessinfoid.setBusinessinfoid(entBusinessinfo.getBusinessinfoid());
                lkPlanBusinessinfoid.setPlanid(entPlan.getPlanid());
                lkPlanBusinessinfoidService.insert(lkPlanBusinessinfoid);


            }
        }
    }
    
    /**
     * @param id
     * @return EntBusinessinfo
     * 通过ID获得
     * 
     */
    public EntBusinessinfo loadById(String id) {
    	   Check.checkNotNullAndNotEmpty(id, "参数不能为空");
    	   
    	   return baseMapper.selectById(id);
    }
}
