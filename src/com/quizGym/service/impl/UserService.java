package com.quizGym.service.impl;

import com.quizGym.dao.IUserDao;
import com.quizGym.entity.User;
import com.quizGym.service.IUserService;

public class UserService implements IUserService {
	private IUserDao userDao;
	public void setUserDao(IUserDao userDao) {
		this.userDao = userDao;
	}
	
	@Override
	public void saveUser(User user) {
		userDao.saveUser(user);
	}

	@Override
	public User findUser(User user) {
		
		return userDao.findUser(user);
	}

}
