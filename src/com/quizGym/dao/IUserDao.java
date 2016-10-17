package com.quizGym.dao;

import com.quizGym.entity.User;

/**
 * 用户dao层接口
 * @author zys
 *
 */
public interface IUserDao {
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
}
