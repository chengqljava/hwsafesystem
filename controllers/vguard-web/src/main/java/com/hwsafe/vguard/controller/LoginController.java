package com.hwsafe.vguard.controller;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;

import org.apache.commons.lang3.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

import com.hwsafe.enterprise.domain.EntBusinessinfo;
import com.hwsafe.enterprise.service.EntBusinessinfoService;
import com.hwsafe.sys.constants.SysConstants;
import com.hwsafe.sys.domain.SysPriv;
import com.hwsafe.sys.domain.SysUser;
import com.hwsafe.sys.service.SysPrivService;
import com.hwsafe.sys.service.SysUserService;
import com.hwsafe.utils.Digests;

@Controller
public class LoginController {

	@Autowired
	private SysUserService sysUserService;
	@Autowired
	private SysPrivService sysPrivService;
	@Autowired
	private EntBusinessinfoService entBusinessinfoService;

	@RequestMapping(value = "login", method = RequestMethod.GET)
	public String login() {
		return "login";
	}

	@RequestMapping(value = "login/validate", method = RequestMethod.POST)
	@ResponseBody
	public Map<String, String> validate(HttpServletRequest request, @RequestParam String username,
			@RequestParam String password, @RequestParam String usertype) {
		Map<String, String> result = new HashMap<String, String>();
		try {
			// AjaxResult<Object> ajaxResult=new AjaxResult<Object>();
//	             usertype = "ENT";
//	             boolean license =
//	             LicenseUtil.validateLicense(LicenseUtil.getLincese(request));
//	             验证license
//	             if (!license) {
//	                 result.put("success", "false");
//	                 result.put("msg","系统未授权，请联系管理员！");
//	                 result.put("code",403+"");
//	                 return result;
//	             }

			if (StringUtils.isNotBlank(username) && StringUtils.isNotBlank(password)) {
				SysUser sysuser = sysUserService.loadUserByUsername(username);
				if (sysuser == null) {
					result.put("success", "false");
					result.put("msg", "用户名或密码错误！");
				} else if (!sysuser.getUsertype().equalsIgnoreCase(usertype)
						&& !sysuser.getUsertype().equalsIgnoreCase("SYS")) {
					result.put("success", "false");
					result.put("msg", "用户类型错误！");
				} else if ("2".equalsIgnoreCase(sysuser.getUserstates())) {
					result.put("success", "false");
					result.put("msg", "用户已删除！");
				} else if ("0".equalsIgnoreCase(sysuser.getCheckstates())) {
					result.put("success", "false");
					result.put("msg", "用户未审核！");
				} else {

					String serverpassword = sysuser.getPassword();
					String encrypt = Digests.encryptMD5(username + password);
					if (!encrypt.equalsIgnoreCase(serverpassword)) {
						result.put("success", "false");
						result.put("msg", "用户名或密码错误！");
					} else {
						// 获取用户菜单
						List<SysPriv> menus = sysPrivService.loadPrivById(sysuser.getUserid(), sysuser.getOrganid());

						// 所在企业
						EntBusinessinfo ent = entBusinessinfoService.loadByBusinessinfoid(sysuser.getOrganid());

						if (menus != null && menus.size() > 0) {
							// 登录成功
							HttpSession session = request.getSession(true);
							if (session != null) {
								// 将登录用户放入session中
								session.setAttribute(SysConstants.SESSION_USER_KEY, sysuser);

								if (ent != null) {
									session.setAttribute(SysConstants.SESSION_ENT_KEY, ent);
								}
								session.setAttribute(SysConstants.SESSION_MENU_KEY, menus);
								session.setAttribute(SysConstants.SESSION_LOGIN_KEY, true);
							}
							result.put("success", "true");
							result.put("msg", "密码正确");
						} else {
							result.put("msg", "没有登录权限！");
							result.put("success", "false");
						}
					}
				}
			} else {
				result.put("success", "false");
				result.put("msg", "用户名或密码不能为空！");
			}
			return result;
		} catch (Exception e) {
			e.printStackTrace();
		}
		return null;
	}

	/**
	 * @Title:logout
	 * @Description (用户退出登录).
	 * @param request 请求参数
	 */
	@RequestMapping("/logout")
	public String logout(HttpServletRequest request) {
		try {
			// saveOperLog(request);
		} catch (Exception e) {
			e.printStackTrace();
		}
		HttpSession session = request.getSession();
		session.invalidate();
		return "login";
	}
}
