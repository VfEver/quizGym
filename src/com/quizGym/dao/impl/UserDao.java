package com.quizGym.dao.impl;

import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;

import org.apache.ibatis.session.SqlSession;
import org.apache.ibatis.session.SqlSessionFactory;

import com.quizGym.dao.IUserDao;
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
	public void saveDoneQuestion(int userID, int questionID, int status) {
		
		SqlSession sqlSession = sqlSessionFactory.openSession();
		
		Map<String, Integer> map = new HashMap<String, Integer>();
		map.put("userID", userID);
		map.put("questionID", questionID);
		map.put("status", status);
		
		sqlSession.insert(User.class.getName() + ".saveDoneQuestion", map);
		sqlSession.commit();
		sqlSession.close();
	}
	
	
}
