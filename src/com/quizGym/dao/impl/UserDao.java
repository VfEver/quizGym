package com.quizGym.dao.impl;

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
		sqlSession.close();
	}
}
