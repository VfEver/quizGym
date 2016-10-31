package com.quizGym.service.impl;

import java.util.Date;

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

	@Override
	public void saveDoneList(int userID, int groupID, int right, int wrong,
			Date time) {
		
		userDao.saveDoneList(userID, groupID, right, wrong, time);
	}

	@Override
	public void saveDoneQuestion(int userID, int questionID, int status) {
		
		userDao.saveDoneQuestion(userID, questionID, status);
	}

}
