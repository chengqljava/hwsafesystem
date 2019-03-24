package com.hwsafe.qurtz.service;

import java.util.Date;
import java.util.List;

import javax.annotation.PostConstruct;

import org.quartz.CronTrigger;
import org.quartz.Scheduler;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springside.modules.utils.collection.ListUtil;

import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;

import com.hwsafe.qurtz.JobConstants;
import com.hwsafe.qurtz.domain.Job;
import com.hwsafe.qurtz.domain.JobQuery;
import com.hwsafe.qurtz.repository.JobMapper;
import com.hwsafe.qurtz.utils.ScheduleUtil;
import com.hwsafe.utils.IDGenerator;

@Service("jobService")
@Transactional(readOnly = true)
public class JobService extends ServiceImpl<JobMapper, Job> {

	@Autowired
	private Scheduler scheduler;

	/**
	 * 项目启动时，初始化定时器
	 */
	@PostConstruct
	public void init() {
		List<Job> jobList = baseMapper.list(new JobQuery());
		if (ListUtil.isNotEmpty(jobList)) {
			for (Job job : jobList) {
				CronTrigger cronTrigger = ScheduleUtil.getCronTrigger(scheduler, job.getId());
				if (cronTrigger == null) {
					ScheduleUtil.createScheduleJob(scheduler, job);
				} else {
					ScheduleUtil.updateScheduleJob(scheduler, job);
				}
			}
		}
	}

	public Job get(String id) {
		QueryWrapper<Job> queryWrapper = new QueryWrapper<>();
		queryWrapper.eq("id", id);
		return super.getOne(queryWrapper);
	}

	public List<Job> list(JobQuery jobQuery) {
		return baseMapper.list(jobQuery);
	}

	public Page<Job> page(JobQuery jobQuery) {

		Page<Job> jobPage = new Page<>(jobQuery.getPage(), jobQuery.getSize());
		jobPage.setRecords(baseMapper.list(jobQuery));
		return jobPage;
	}

	/**
	 * 添加任务
	 * @param job
	 */
	@Transactional
	public void saveJob(Job job) {
		job.setId(IDGenerator.OBJECTID.generate());
		job.setCreateTime(new Date());
		job.setStatus(JobConstants.ScheduleStatus.NORMAL.getValue());
		super.save(job);

		ScheduleUtil.createScheduleJob(scheduler, job);
	}

	/**
	 * 更新任务
	 * @param job
	 */
	@Transactional
	public void updateJob(Job job) {
		super.updateById(job);
		ScheduleUtil.updateScheduleJob(scheduler, job);
	}

	/**
	 * 删除任务
	 * @param id
	 */
	@Transactional
	public void delete(String id) {
		baseMapper.deleteById(id);

		ScheduleUtil.deleteScheduleJob(scheduler, id);
	}

	/**
	 * 执行任务
	 * @param id
	 */
	@Transactional
	public void run(String id) {
		ScheduleUtil.run(scheduler, get(id));
	}

	/**
	 * 暂停任务
	 * @param id
	 */
	@Transactional
	public void pause(String id) {
		ScheduleUtil.pauseJob(scheduler, id);
		Job job = get(id);
		job.setStatus(JobConstants.ScheduleStatus.PAUSE.getValue());
		super.updateById(job);
	}

	/**
	 * 恢复设置
	 * @param id
	 */
	@Transactional
	public void resume(String id) {
		ScheduleUtil.resumeJob(scheduler, id);

		Job job = get(id);
		job.setStatus(JobConstants.ScheduleStatus.NORMAL.getValue());
		super.updateById(job);

	}
}
