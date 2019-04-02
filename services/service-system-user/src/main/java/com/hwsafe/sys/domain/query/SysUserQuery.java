package com.hwsafe.sys.domain.query;

import java.io.Serializable;

import lombok.Data;
@Data
public class SysUserQuery implements Serializable{

	/**
	 * 
	 */
	private static final long serialVersionUID = 1L;
	
	private String username;
	private String nickname;
	private String usertype;
	private String orgid;
	private int page;
	private int rows;
	/**
	 * 升序字段
	 */
	private String[] ascs;
	/**
	 * 降序字段
	 */
	private String[] desc;

}
