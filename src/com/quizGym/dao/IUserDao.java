package com.quizGym.dao;

import java.util.Date;
import java.util.List;

import com.quizGym.entity.MailBox;
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
	public void saveDoneQuestion(int userID, int questionID, int status, Date time);
	
	/**
	 * 查询账号为account的用户是否存在
	 * @param account
	 * @return
	 */
	public User findAccount(String account);
	
	/**
	 * 查询用户权限
	 * @param username
	 * @return
	 */
	public int findPower(String username);
	
	/**
	 * 查询所有用户
	 * @return
	 */
	public List<User> findAllUser();
	
	/**
	 * 根据用户id更新用户分数
	 * @param userID
	 * @param score
	 */
	public void updateScore(int userID, int score);
	
	/**
	 * 更新用户类别
	 * @param userID
	 * @param type
	 */
	public void updateType(int userID, int type);
	
	/**
	 * 查询信箱内容
	 * @return
	 */
	public List<MailBox> findInfo();
	
	/**
	 * 根据ID查询用户基本信息
	 * @param id
	 * @return
	 */
	public User findUserByID(int id);
	
	/**
	 * 更新用户的头像地址
	 * @param userID
	 * @param imagePath
	 */
	public void updateUserHeadImage(String userID, String imagePath);
	
	/**
	 * 存储通知信息
	 * @param username
	 * @param information
	 */
	public void saveInfo(String username, String information);
}
