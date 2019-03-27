package com.hwsafe.sys.service;
import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.hwsafe.sys.constants.PridimEnum;
import com.hwsafe.sys.domain.LkUserDataPridim;
import com.hwsafe.sys.mapper.LkUserDataPridimMapper;
import com.hwsafe.utils.IDGenerator;


@Service
public class LkUserDataPridimService extends  ServiceImpl<LkUserDataPridimMapper,LkUserDataPridim> {
  
    
  
    public void saveDataPridim(LkUserDataPridim lkUserDataPridim) {
       //判断是否为空初始化参数
        baseMapper.save(lkUserDataPridim);
    }
    
    /**
     * @param lkUserDataPridims
     * @param userId
               * 批量保存
     */
    @Transactional
    public void saveBatch(List<LkUserDataPridim> lkUserDataPridims,String userId) {
        //先删除再保存
    	baseMapper.deleteByUserId(userId);
    	baseMapper.saveBatch(lkUserDataPridims);
    }
  
    public List<LkUserDataPridim> loadByUseridOrType(String userId,
            Integer datapritype) {
        Map<String,Object> map=new HashMap<>();
        map.put("userId", userId);
        map.put("datapritype", datapritype);
        return baseMapper.loadByUseridOrType(map);
    }

    public void deleteById(String id) {
    	baseMapper.deleteById(id);
    }

    public void deleteByUserId(String userId) {
    	baseMapper.deleteByUserId(userId);
        
    }



  

	@Transactional
	public void saveBatch(String userId, String createId, String[] placeAreaIds) {
		  if(placeAreaIds!=null&&placeAreaIds.length!=0) {
			  List<LkUserDataPridim> lkUserDataPridims=new ArrayList<LkUserDataPridim>();
			  LkUserDataPridim lkUserDataPridim=null;
			  for (String placeAreaId : placeAreaIds) {
		            lkUserDataPridim = new LkUserDataPridim();
		            lkUserDataPridim.setCreatetime(new Date());
		            lkUserDataPridim.setDatapriid(placeAreaId);
		            lkUserDataPridim.setDatapritype(PridimEnum.PLACE.getCode());
		            lkUserDataPridim.setUserid(userId);
		            lkUserDataPridim.setId(IDGenerator.OBJECTID.generate());
		            lkUserDataPridim.setCreaterid(createId);
		            lkUserDataPridims.add(lkUserDataPridim);
		        }
			  baseMapper.saveBatch(lkUserDataPridims);
		  }
	}


}
