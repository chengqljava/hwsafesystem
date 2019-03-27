package com.hwsafe.vguard.filter;

import java.io.IOException;
import java.io.PrintWriter;

import javax.servlet.FilterChain;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.springframework.http.HttpStatus;
import org.springframework.web.filter.OncePerRequestFilter;

import com.hwsafe.sys.constants.SysConstants;
import com.hwsafe.sys.domain.SysUser;
import com.hwsafe.vguard.base.utils.Context;



public class LoginFilter  extends OncePerRequestFilter{

	@Override
	protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
			throws ServletException, IOException {
		
		// 不过滤的uri
        String[] notFilter = { "/images/", "/js/", "/css/", "/fonts/",
                "/login", "/orgtree", "/upload", "/static"
        };
        
        // 请求的uri
        String uri = request.getRequestURI();
        // 是否过滤
        boolean doFilter = true;
        for (String s : notFilter) {
            if (uri.contains(s)) {
                // 如果uri中包含不过滤的uri，则不进行过滤
                doFilter = false;
                break;
            }
        }
        if (doFilter) {
        	//MirsUserSetSession(request);
            // 执行过滤
            // 从session中获取登录者实体
            Object obj = request.getSession().getAttribute(
                    SysConstants.SESSION_USER_KEY);
            if (null == obj) {
                boolean isAjaxRequest = isAjaxRequest(request);
                if (isAjaxRequest) {
                    response.setCharacterEncoding("UTF-8");
                    response.sendError(HttpStatus.UNAUTHORIZED.value(),
                            "您已经太长时间没有操作,请刷新页面");
                    return;
                }
//                response.sendRedirect(request.getContextPath() + "/login");
                PrintWriter printWriter = response.getWriter();
                printWriter.println("<html>");      
                printWriter.println("<script>");      
                printWriter.println("window.open('" + request.getContextPath() + "/login', '_top');");      
                printWriter.println("</script>");      
                printWriter.println("</html>");   
                return;
            } else {
                // 如果session中存在登录者实体，则继续
            	//获取UserSet
            	Context.setUser((SysUser)obj);
                filterChain.doFilter(request, response);
                //移出用户
                Context.remove();
            }
        } else {
            // 如果不执行过滤，则继续
            filterChain.doFilter(request, response);
        }
        
	}
	  /**
     * @Title:isAjaxRequest
     * @Description TODO(判断是否为Ajax请求).
     * @date 2015年7月6日 下午2:47:36
     * @author peijun
     * @param request
     *            请求对象
     * @return boolean 是true, 否false
     */
    public static boolean isAjaxRequest(HttpServletRequest request) {
        String header = request.getHeader("X-Requested-With");
        if (header != null && "XMLHttpRequest".equals(header)) {
            return true;
        } else {
            return false;
        }
    }
   
	
   
}
