package com.hwsafe.qurtz.domain;

import java.io.Serializable;
import java.util.Date;

import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

/**
 * 定时任务
 */
@Getter
@Setter
@NoArgsConstructor
@ToString
@EqualsAndHashCode
public class Job implements Serializable {

    private static final long serialVersionUID = 1L;

    //任务id
    private String            id;
    //spring bean名称
    private String            beanName;
    //方法名
    private String            methodName;
    //参数
    private String            params;
    //cron表达式
    private String            cronExpression;
    //任务状态  0：正常  1：暂停
    private Integer           status;
    //备注
    private String            remark;
    //创建时间
    private Date              createTime;

}
