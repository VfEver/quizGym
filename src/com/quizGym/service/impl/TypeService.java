package com.quizGym.service.impl;

import com.quizGym.dao.ITypeDao;
import com.quizGym.entity.Type;
import com.quizGym.service.ITypeService;

public class TypeService implements ITypeService {

	private ITypeDao typeDao;
	public void setTypeDao(ITypeDao typeDao) {
		this.typeDao = typeDao;
	}
	
	@Override
	public void save(Type type) {
		typeDao.save(type);
	}

}
