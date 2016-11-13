package com.quizGym.dao.impl;

import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.apache.ibatis.session.SqlSession;
import org.apache.ibatis.session.SqlSessionFactory;

import com.quizGym.dao.IUserDao;
import com.quizGym.entity.MailBox;
import com.quizGym.entity.User;

public class UserDao implements IUserDao{
	
	private SqlSessionFactory sqlSessionFactory;
	public void setSqlSessionFactory(SqlSessionFactory sqlSessionFactory) {
		this.sqlSessionFactory = sqlSessionFactory;
	}
	
	@Override
	public User findUser(User user) {
		
		SqlSession sqlSession = sqlSessionFactory.openSession();
		User returnUser = sqlSession.selectOne(User.class.getName() + ".findUser", user);
		sqlSession.close();
		return returnUser;
	}
	
	@Override
	public void saveUser(User user) {
		
		SqlSession sqlSession = sqlSessionFactory.openSession();
		sqlSession.insert(User.class.getName() + ".saveUser", user);
		sqlSession.commit();
		sqlSession.close();
	}

	@Override
	public void saveDoneList(int userID, int groupID, int right, int wrong,
			Date time) {

		SqlSession sqlSession = sqlSessionFactory.openSession();
		
		Map<String, String> map = new HashMap<String, String>();
		map.put("userID", ""+userID);
		map.put("groupID", ""+groupID);
		map.put("right", ""+right);
		map.put("wrong", ""+wrong);
		SimpleDateFormat sdf = new SimpleDateFormat("YYYY-MM-dd");
		String date = sdf.format(time);
		map.put("time", date);
		
		sqlSession.insert(User.class.getName() + ".saveDoneList", map);
		sqlSession.commit();
		sqlSession.close();
	}

	@Override
	public void saveDoneQuestion(int userID, int questionID, int status, Date time) {
		
		SqlSession sqlSession = sqlSessionFactory.openSession();
		
		Map<String, Integer> map = new HashMap<String, Integer>();
		map.put("userID", userID);
		map.put("questionID", questionID);
		map.put("status", status);
		SimpleDateFormat sdf = new SimpleDateFormat("yyyyMMdd");
		String date = sdf.format(time);
		map.put("time", Integer.parseInt(date));
		
		sqlSession.insert(User.class.getName() + ".saveDoneQuestion", map);
		sqlSession.commit();
		sqlSession.close();
	}

	@Override
	public User findAccount(String account, String email) {

		SqlSession sqlSession = sqlSessionFactory.openSession();
		Map<String, String> map = new HashMap<String, String>();
		map.put("name", account);
		map.put("email", email);
		User user = sqlSession.selectOne(User.class.getName() + ".findAccount", map);
		sqlSession.close();
		return user;
	}

	@Override
	public int findPower(String username) {
		
		SqlSession sqlSession = sqlSessionFactory.openSession();
		int power = sqlSession.selectOne(User.class.getName() + ".findPower", username);
		sqlSession.close();
		return power;
	}

	@Override
	public List<User> findAllUser() {

		SqlSession sqlSession = sqlSessionFactory.openSession();
		List<User> users = sqlSession.selectList(User.class.getName() + ".findAllUser");
		sqlSession.close();
		
		return users;
	}

	@Override
	public void updateScore(int userID, int score) {

		SqlSession sqlSession = sqlSessionFactory.openSession();
		Map<String, Integer> map = new HashMap<String, Integer>();
		map.put("id", userID);
		map.put("score", score);
		sqlSession.update(User.class.getName() + ".updateScore", map);
		sqlSession.commit();
		sqlSession.close();
		
	}

	@Override
	public void updateType(int userID, int type) {
		
		SqlSession sqlSession = sqlSessionFactory.openSession();
		Map<String, Integer> map = new HashMap<String, Integer>();
		map.put("id", userID);
		map.put("type", type);
		sqlSession.update(User.class.getName() + ".updateType", map);
		sqlSession.commit();
		sqlSession.close();
	}

	@Override
	public List<MailBox> findInfo() {
		
		SqlSession sqlSession = sqlSessionFactory.openSession();
		List<MailBox> informations = sqlSession.selectList(MailBox.class.getName() + ".findInfo");
		sqlSession.close();
		return informations;
	}

	@Override
	public User findUserByID(int id) {
		
		SqlSession sqlSession = sqlSessionFactory.openSession();
		User user = sqlSession.selectOne(User.class.getName() + ".findUserByID", id);
		sqlSession.close();
		return user;
	}

	@Override
	public void updateUserHeadImage(String userID, String imagePath) {

		SqlSession sqlSession = sqlSessionFactory.openSession();
		Map<String, String> map = new HashMap<String, String> ();
		map.put("id", userID);
		map.put("head", imagePath);
		sqlSession.update(User.class.getName() + ".updateUserHeadImage", map);
		sqlSession.close();
	}

	@Override
	public void saveInfo(String username, String information) {
		
		SqlSession sqlSession = sqlSessionFactory.openSession();
		Map<String, String> map = new HashMap<String, String>();
		map.put("username", username);
		map.put("information", information);
		sqlSession.insert(MailBox.class.getName() + ".saveInfo", map);
		sqlSession.close();
		
	}
	
}
