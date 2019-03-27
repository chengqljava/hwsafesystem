package com.hwsafe.vguard.base.utils;

import com.hwsafe.sys.domain.SysUser;

public class Context {

   
    private static ThreadLocal<SysUser>  USER               = new ThreadLocal<SysUser>();

    public static void setUser(SysUser user) {
    	USER.set(user);
    }

    public static SysUser getUser() {
        return USER.get();
    }
    
    public static void remove(){
    	USER.remove();
    }

   
}
