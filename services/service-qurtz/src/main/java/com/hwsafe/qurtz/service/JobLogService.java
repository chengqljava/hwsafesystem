package com.hwsafe.qurtz.service;

import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;

import com.hwsafe.qurtz.domain.JobLog;
import com.hwsafe.qurtz.domain.JobLogQuery;
import com.hwsafe.qurtz.repository.JobLogMapper;
import com.hwsafe.utils.IDGenerator;



@Service("jobLogService")
@Transactional(readOnly = true)
public class JobLogService  extends ServiceImpl<JobLogMapper, JobLog>{

 

    public JobLog get(String id) {
        return baseMapper.selectById(id);
    }

    public List<JobLog> list(JobLogQuery jobLogQuery) {
        return baseMapper.list(jobLogQuery);
    }

    public Page<JobLog> page(JobLogQuery jobLogQuery) {
    	Page<JobLog> page=new Page<>(jobLogQuery.getPage(), jobLogQuery.getSize());
        List<JobLog> list = baseMapper.list(jobLogQuery);
        page.setRecords(list);
        return  page;
    }

    @Transactional
    public void saveJobLog(JobLog jobLog) {
        jobLog.setId(IDGenerator.OBJECTID.generate());
        super.save(jobLog);
    }

}
