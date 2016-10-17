package com.quizGym.dao.impl;

import org.apache.ibatis.session.SqlSession;
import org.apache.ibatis.session.SqlSessionFactory;

import com.quizGym.dao.ITypeDao;
import com.quizGym.entity.Type;

public class TypeDao implements ITypeDao{

	private SqlSessionFactory sqlSessionFactory;
	public void setSqlSessionFactory(SqlSessionFactory sqlSessionFactory) {
		this.sqlSessionFactory = sqlSessionFactory;
	}
	@Override
	public void save(Type type) {
		SqlSession sqlSession = sqlSessionFactory.openSession();
		sqlSession.insert(Type.class.getName() + ".saveType", type);
		sqlSession.close();
	}
	
}
