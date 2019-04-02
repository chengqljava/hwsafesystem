package com.hwsafe.vguard.controller.user;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;

import org.apache.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

import com.baomidou.mybatisplus.extension.plugins.PaginationInterceptor;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.hwsafe.sys.domain.query.SysUserQuery;
import com.hwsafe.sys.service.SysUserService;
import com.hwsafe.vguard.base.utils.BaseUtils;

/**
 * @author chengql
 *
 */
@Controller
@RequestMapping("/system/sysuser")
public class SysUserController {
	
    private static final Logger LOG = Logger.getLogger(SysUserController.class);


	@Autowired
	private SysUserService sysUserService;

	/**
	 * @Title:intoMainPage
	 * @Description (进入首页).
	 * @date 2016年01月14日
	 * @author xufeng
	 * @param privcode 权限编码
	 * @return String
	 */
	@RequestMapping(value = "/{privcode}")
	public String intoMainPage(@PathVariable("privcode") String privcode, Model model) {
		model.addAttribute("privcode", privcode);
		return "sysuser/sysuserList";
	}

	/**
	 * @Title:loadByPage
	 * @Description (根据条件查询数据结果集).
	 * @date 2016年01月14日
	 * @author xufeng
	 * @param username 账户
	 * @param nickname 用户名
	 * @param model    model对象
	 * @param request  请求对象
	 * @return Map<String, Object> 返回数据结果集
	 */
	@RequestMapping(value = "/list", method = RequestMethod.POST)
	@ResponseBody
	public Map<String, Object> loadByPage(SysUserQuery sysUserQuery) {
		try {
			
			// 系统用户
			sysUserQuery.setUsertype("SYS");
			Page<Map<String, Object>> page = sysUserService.loadByPage(sysUserQuery);
			// 返回数据结果集
			Map<String, Object> results = BaseUtils.createGrid( page);
			return results;
		} catch (Exception e) {
			LOG.error(e.getMessage());
			e.printStackTrace();
		}
		return null;
	}
}
