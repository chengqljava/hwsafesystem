package com.hwsafe.demo.service;

import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.hwsafe.demo.domain.Person;
import com.hwsafe.demo.mapper.PersonMapper;
import com.hwsafe.utils.IDGenerator;
/**
 * @author chengql
 * service 进行字段判断
 */
@Service
public class PersonService  extends ServiceImpl<PersonMapper, Person>{
	public Page<Person> selectPersonPage(Page<Person> page) {
        page.setRecords(baseMapper.selectList(page));
        return page;
    }
	
	public List<Person> list() {
       
        return  baseMapper.list();
    }
	
	public Page<Person> selectPersonPage(Page<Person> page,String name) {
        page.setRecords(baseMapper.selectListByName(page,name));
        return page;
    }
	public Page<Person> selectPersonPageWrapper(Page<Person> page,String name) {
		QueryWrapper<Person> queryWrapper = new QueryWrapper<>();
        queryWrapper.like("name", name);
        IPage<Person> ipage=baseMapper.selectPage(page, queryWrapper);
        return (Page)ipage;
    }
	@Transactional
	public Person save(String name,Integer age){
		Person person=new Person();
		person.setName(name);
		person.setAge(age);
		person.setId(IDGenerator.OBJECTID.generate());
		super.save(person);
		return person;
	}
	
	@Transactional
	public Person update(String name,Integer age,String id){
		Person person=new Person();
		person.setName(name);
		person.setAge(age);
		person.setId(id);
		 super.updateById(person);
		return person;
	}
}
