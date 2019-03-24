package com.hwsafe.qurtz.repository;

import java.util.List;



import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.hwsafe.qurtz.domain.Job;
import com.hwsafe.qurtz.domain.JobQuery;


/**
 * 定时任务
 */

public interface JobMapper extends BaseMapper<Job>{

    List<Job> list(JobQuery jobQuery);
}
