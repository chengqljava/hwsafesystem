package com.hwsafe.enterprise.controller.demo;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.hwsafe.demo.domain.Person;
import com.hwsafe.demo.service.PersonService;

/**
 * @author chengql 测试例子
 *
 */
@RestController
@RequestMapping("/simple")
public class SimpleDemoController {
	@Autowired
	private PersonService personService;

	@RequestMapping("/save/{name}/{age}")
	public Person save(@PathVariable("name") String name, @PathVariable("age") Integer age) {
		return personService.save(name, age);
	}

	@RequestMapping("/update/{name}/{age}/{id}")
	public Person update(@PathVariable("name") String name, @PathVariable("age") Integer age,
			@PathVariable("id") String id) {
		return personService.update(name, age, id);
	}

	@RequestMapping("/delete/{id}")
	public Boolean delete(@PathVariable("id") String id) {
		return personService.removeById(id);
	}

	@RequestMapping("/list")
	public List<Person> list() {
		return personService.list();
	}

	@RequestMapping("/list/{pageNumber}/{size}")
	public Page<Person> listPage(@PathVariable("pageNumber") Integer pageNumber,
			@PathVariable("size") Integer size) {
		Page<Person> page = new Page<>(pageNumber, size);
		return personService.selectPersonPage(page);
	}

	@RequestMapping("/list/page/{name}")
	public Page<Person> listPageName(
			@RequestParam(value = "pageNumber", defaultValue = "1", required = true) Integer pageNumber,
			@RequestParam(value = "size", defaultValue = "15", required = true) Integer size,
			@PathVariable("name") String name) {
		Page<Person> page = new Page<>(pageNumber, size);
		return personService.selectPersonPage(page, name);
	}
	
	/**
	 * @param pageNumber
	 * @param size
	 * @param name
	 * @return
	 * 通过wrapper实现查找
	 */
	@RequestMapping("/list/page/wrapper/{name}")
	public Page<Person> listPageWrapper(
			@RequestParam(value = "pageNumber", defaultValue = "1", required = true) Integer pageNumber,
			@RequestParam(value = "size", defaultValue = "15", required = true) Integer size,
			@PathVariable("name") String name) {
		Page<Person> page = new Page<>(pageNumber, size);
		return personService.selectPersonPageWrapper(page, name);
	}


	@RequestMapping("/hello")
	public String hello() {
		return "hello";
	}

}
