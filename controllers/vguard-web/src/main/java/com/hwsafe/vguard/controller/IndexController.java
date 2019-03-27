package com.hwsafe.vguard.controller;

import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.RequestMapping;

/**
 * @author chengql
 * 2019-03-25
 * 首页
 *
 */
@Controller
public class IndexController {
	
	@RequestMapping("/welcome")
	public String welcome(Model model) {
		
		model.addAttribute("wrold", "中国");
		return "welcome";
	}
	@RequestMapping("/last")
	public String last(Model model) {
		
		model.addAttribute("wrold", "中国");
		return "index";
	}


}
