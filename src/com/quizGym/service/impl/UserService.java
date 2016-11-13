package com.quizGym.service.impl;

import java.util.Date;
import java.util.List;

import com.quizGym.dao.IUserDao;
import com.quizGym.entity.MailBox;
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
	public void saveDoneQuestion(int userID, int questionID, int status, Date time) {
		
		userDao.saveDoneQuestion(userID, questionID, status, time);
	}

	@Override
	public User findAccount(String account, String email) {

		return userDao.findAccount(account, email);
	}

	@Override
	public int findPower(String username) {
		
		return userDao.findPower(username);
	}

	@Override
	public List<User> findAllUser() {

		return userDao.findAllUser();
	}

	@Override
	public void updateScore(int userID, int score) {
		
		userDao.updateScore(userID, score);
	}

	@Override
	public void updateType(int userID, int type) {

		userDao.updateType(userID, type);
	}

	@Override
	public List<MailBox> findInfo() {

		return userDao.findInfo();
	}

	@Override
	public User findUserByID(int id) {

		return userDao.findUserByID(id);
	}

	@Override
	public void updateUserHeadImage(String userID, String imagePath) {
		
		userDao.updateUserHeadImage(userID, imagePath);
	}

	@Override
	public void saveInfo(String username, String information) {
		
		userDao.saveInfo(username, information);
	}

}
