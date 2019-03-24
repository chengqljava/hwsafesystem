package com.hwsafe.qurtz.domain;

import java.io.Serializable;
import java.util.Date;

import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

/**
 * 定时任务日志
 */
@Getter
@Setter
@NoArgsConstructor
@ToString
@EqualsAndHashCode
public class JobLog implements Serializable {

    private static final long serialVersionUID = 1L;

    //任务日志id
    private String            id;
    //任务id
    private String            jobId;
    //spring bean名称
    private String            beanName;
    //方法名
    private String            methodName;
    //参数
    private String            params;
    //任务状态    0：成功    1：失败
    private Integer           status;
    //失败信息
    private String            error;
    //耗时(单位：毫秒)
    private Integer           times;
    //创建时间
    private Date              createTime;

}
