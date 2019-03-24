package com.hwsafe.demo.domain;

import java.io.Serializable;

import lombok.Data;

@Data
public class Person implements Serializable{
	/**
	 * 
	 */
	private static final long serialVersionUID = 1L;
	private String id;
	private String name;
	private Integer age;

}
