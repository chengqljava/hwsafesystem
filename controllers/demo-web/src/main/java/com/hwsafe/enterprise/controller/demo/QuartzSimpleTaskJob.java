package com.hwsafe.enterprise.controller.demo;

import org.springframework.scheduling.annotation.EnableScheduling;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

@Component("quartzSimpleTaskJob")
public class QuartzSimpleTaskJob {
	@Scheduled(fixedRate=5000)
	public void fiveSecond(){
		System.err.println("quartz 定时任务不带参数 5秒一次");
	}
	@Scheduled(cron="*/5 * * * ?")
	public void fiveParamSecond(String param){
		System.err.println(param+"quartz 定时任务 带参数 5秒一次");
	}


}
