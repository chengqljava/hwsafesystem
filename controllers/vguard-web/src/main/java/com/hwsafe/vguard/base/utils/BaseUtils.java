package com.hwsafe.vguard.base.utils;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;

import org.apache.commons.lang3.StringUtils;

import com.baomidou.mybatisplus.extension.plugins.pagination.Page;

public class BaseUtils {
	public static Page<?> getPageBounds(HttpServletRequest request) throws Exception {
		String currentstr = request.getParameter("page"); // 当前页
		String sizeCountstr = request.getParameter("rows"); // 每页条数
		String[] sidxArr = request.getParameterValues("sidx");// 排序字段
		String[] sordArr = request.getParameterValues("sord");// 排序顺序

		Page<?> page = new Page(0, 0);

		// 封装分页对象
		if (StringUtils.isNotBlank(currentstr) && StringUtils.isNotBlank(sizeCountstr)) {
			Integer current = new Integer(currentstr);
			Integer rowCount = new Integer(sizeCountstr);
			page = new Page(current.intValue(), rowCount.intValue());
		}

		// 封装排序对象
		if (sidxArr != null && sidxArr.length > 0 && sordArr != null && sordArr.length > 0) {
			List<String> ascList=new ArrayList<String>();
			List<String> descList=new ArrayList<String>();
			for (int i = 0; i < sordArr.length; i++) {
				if ("ASC".equals(sordArr[i].toUpperCase())) {
					ascList.add(sidxArr[i]);
				}
				if ("DESC".equals(sordArr[i].toUpperCase())) {
					descList.add(sidxArr[i]);
				}
			}
			if(ascList.size()>0) {
				page.setAscs(ascList);
			}
			if(descList.size()>0) {
				page.setDescs(descList);
			}
		}

		return page;
	}

	/**
	 * @Title:createGrid
	 * @Description TODO(返回grid数据格式).
	 * @date 2015年7月6日 下午2:08:03
	 * @author peijun
	 * @param datas      数据集
	 * @param pageBounds 分页参数
	 * @return Map<String, Object>
	 */
	public static <T> Map<String, Object> createGrid(Page<T> pageBounds) {
		Map<String, Object> results = new HashMap<String, Object>();

		Long records = pageBounds.getTotal();// 数据总条数

		Long currentpage = pageBounds.getCurrent();// 当前页

		Long everypage = pageBounds.getSize();// 每页显示记录

		Long totalpage = pageBounds.getPages();// 获得总页数

		results.put("page", currentpage); // 当前页
		results.put("records", records); // 数据总条数
		results.put("total", totalpage); // 数据总页数
		results.put("datas", pageBounds.getRecords()); // 数据集合
		return results;
	}
}
