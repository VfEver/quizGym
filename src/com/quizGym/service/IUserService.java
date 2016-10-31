package com.quizGym.service;

import java.util.Date;

import com.quizGym.entity.User;

/**
 * 用户服务层接口
 * @author zys
 *
 */
public interface IUserService {
	/**
	 * 用户注册
	 * @param user
	 */
	public void saveUser(User user);
	/**
	 * 用户登录验证
	 * @return
	 */
	public User findUser(User user);
	
	/**
	 * 存储用户做过的套题
	 * @param userID
	 * @param groupID
	 * @param right
	 * @param wrong
	 * @param time
	 */
	public void saveDoneList(int userID, int groupID, int right, int wrong, Date time);
	
	/**
	 * 存储用户随机做过的题目
	 * @param userID
	 * @param questionID
	 * @param status
	 */
	public void saveDoneQuestion(int userID, int questionID, int status);
}
