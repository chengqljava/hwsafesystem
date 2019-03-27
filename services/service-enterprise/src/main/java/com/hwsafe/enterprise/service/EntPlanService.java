/**  
 * Project Name:xx项目工程(英文名称)
 * File Name:EntPlanServiceImpl.java  
 * Package Name:com.zwsafety.module.enterprise.service.impl
 * Date:2016年06月06日
 * Copyright (c) 2016 ,zwsafety All Rights Reserved.   
 */
package com.hwsafe.enterprise.service;

import java.util.Date;
import java.util.Iterator;
import java.util.List;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;

import org.apache.commons.lang3.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.multipart.MultipartHttpServletRequest;

import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.hwsafe.enterprise.domain.EntPlan;
import com.hwsafe.enterprise.domain.EntPlanattach;
import com.hwsafe.enterprise.mapper.EntPlanMapper;
import com.hwsafe.utils.IDGenerator;



/**
 * @ClassName:EntPlanServiceImpl
 * @Description:TODO(用一句话描述该文件做什么)
 * @date:2016年06月06日
 * @author xufeng
 * @version 1.0
 * @since JDK 1.7
 */
@Service
public class EntPlanService extends ServiceImpl<EntPlanMapper, EntPlan>{

    @Autowired
    private EntPlanattachService entPlanattachService;

    /**
     * @Title:saveEntPlan
     * @Description TODO(保存企业平面图).
     * @date 2016年5月23日
     * @author yxx
     * @param entPlan
     *            基本信息
     * @param multipartRequest
     *            附件
     * @throws Exception
     *             异常
     */
    @Transactional
    public void saveEntPlan(EntPlan entPlan,
            MultipartHttpServletRequest multipartRequest,
            HttpServletRequest request) throws Exception {
        if (StringUtils.isEmpty(entPlan.getPlanid())) {
            // 新增
        	entPlan.setPlanid(IDGenerator.OBJECTID.generate());
            baseMapper.insert(entPlan);
        } else {
            // 更新
        	baseMapper.updateById(entPlan);
        }
        Iterator<String> it = multipartRequest.getFileNames();
        if (it.hasNext()) {
            // 删除原文件
            EntPlanattach oldEntPlanattach = entPlanattachService
                    .loadByPlanId(entPlan.getPlanid());
            if (oldEntPlanattach != null) {
            	entPlanattachService.removeById(oldEntPlanattach.getAttachid());
               // FileUtil.delete(request, oldEntPlanattach.getAttachurl());未完成
            }
            // 增加新文件
            while (it.hasNext()) {
                String key = it.next();
                MultipartFile imgFile = multipartRequest.getFile(key);
				/*
				 * String safcontentfile = FileUtil.getUploadPath(
				 * Constants.UPLOAD_PATH_ENTPLAN_IMAGE, imgFile); // 文件子路径
				 * FileUtil.upload(request, safcontentfile, imgFile); // 上传文件
				 */                EntPlanattach entPlanattach = new EntPlanattach();
                entPlanattach.setPlanid(entPlan.getPlanid());
                entPlanattach.setAttachname(imgFile.getOriginalFilename());
                entPlanattach.setAttachurl("未完成");
				/*未完成
				 * entPlanattach.setAttachtype(FileUtil.getFileSuffix(imgFile
				 * .getOriginalFilename()));
				 */
                entPlanattach.setUploadtime(new Date());
                entPlanattach.setAttachid(IDGenerator.OBJECTID.generate());
                entPlanattachService.save(entPlanattach);
            }
        }

    }

    /**
     * @param entPlan 基本信息
     * @param files   附件
     * @param request
     * @throws Exception 异常
     * @Title:saveEntPlan
     * @Description TODO(保存企业平面图).手机端
     * @date 2016年5月23日
     * @author yxx
     */
    @Transactional
    public void saveEntPlan(EntPlan entPlan, MultipartFile[] files, HttpServletRequest request) throws Exception {
        if (StringUtils.isEmpty(entPlan.getPlanid())) {
            // 新增
            entPlan.setPlanid(IDGenerator.OBJECTID.generate());
            baseMapper.insert(entPlan);
        } else {
            // 更新
        	baseMapper.updateById(entPlan);
        }


        if(files != null){
            if (files != null && files.length > 0) {

                EntPlanattach oldEntPlanattach = entPlanattachService
                        .loadByPlanId(entPlan.getPlanid());
                if (oldEntPlanattach != null) {
                	entPlanattachService.removeById(oldEntPlanattach.getAttachid());
                   // FileUtil.delete(request, oldEntPlanattach.getAttachurl());
                }

                for (MultipartFile imgFile : files) {
                    if (imgFile.isEmpty()) {
                        continue;
                    } else {
						/*
						 * String contentfile = FileUtil.getUploadPath(
						 * Constants.UPLOAD_PATH_ENTPLAN_IMAGE, imgFile); // 文件子路径
						 * FileUtil.upload(request, contentfile, imgFile); // 上传文件
						 */                        
                    	EntPlanattach entPlanattach = new EntPlanattach();
                        entPlanattach.setAttachname(imgFile.getOriginalFilename());
                       // entPlanattach.setAttachurl(contentfile);
                        //文件扩展名
                        //String extensionName = FileUtil.getFileSuffix(imgFile.getOriginalFilename());
                        //entPlanattach.setAttachtype(extensionName);

                        entPlanattach.setPlanid(entPlan.getPlanid());
                        entPlanattach.setAttachid(IDGenerator.OBJECTID.generate());

                        // 保存附件信息
                        entPlanattachService.save(entPlanattach);
                    }
                }
            }
        }


    }

	public List<Map<String, Object>> loadByPage(String entid) throws Exception {
		  
			return baseMapper.loadByPage(entid);
		
	}
	
	/**
	 * @param id
	 * 通过主键ID删除
	 */
	public void deleteById(String id) {
		baseMapper.deleteById(id);
	}

}
