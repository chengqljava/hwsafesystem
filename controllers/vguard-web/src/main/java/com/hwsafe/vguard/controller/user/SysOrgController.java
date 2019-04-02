package com.hwsafe.vguard.controller.user;

import java.util.List;
import java.util.Map;

import org.apache.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;

import com.hwsafe.sys.service.SysOrgService;
@Controller
@RequestMapping("/system/sysorg")
public class SysOrgController {
    private static final Logger LOG = Logger.getLogger(SysOrgController.class);
    @Autowired
    private SysOrgService sysOrgService;

	 /**
     * @Title:orgtree
     * @Description TODO(所有机构树).
     * @date 2016年04月27日
     * @author peijun
     * @return List<Map<String,Object>>
     */
    @RequestMapping(value = "/orgtree", method = RequestMethod.POST)
    @ResponseBody
    public List<Map<String, Object>> loadOrgTree() {
        try {
            return sysOrgService.loadOrgTree();
        } catch (Exception e) {
            LOG.error(e.getMessage());
            e.printStackTrace();
        }
        return null;
    }

}
