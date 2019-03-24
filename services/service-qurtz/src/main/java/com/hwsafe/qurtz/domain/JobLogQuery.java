package com.hwsafe.qurtz.domain;


import java.util.Date;

import com.hwsafe.common.BasePageQuery;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

/**
 * 定时任务日志
 * 
 */
@Getter
@Setter
@NoArgsConstructor
@ToString
public class JobLogQuery extends BasePageQuery  {

    private static final long serialVersionUID = 1L;

    private String            jobId;

    private String            searchBeanName;

    private Date              searchStartDate;
    private Date              searchEndDate;
}
