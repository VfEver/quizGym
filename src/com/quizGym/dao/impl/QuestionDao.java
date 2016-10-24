package com.quizGym.dao.impl;

import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

import org.apache.ibatis.session.SqlSession;
import org.apache.ibatis.session.SqlSessionFactory;

import com.quizGym.dao.IQuestionDao;
import com.quizGym.entity.Question;

public class QuestionDao implements IQuestionDao {

	private SqlSessionFactory sqlSessionFactory;
	public void setSqlSessionFactory(SqlSessionFactory sqlSessionFactory) {
		this.sqlSessionFactory = sqlSessionFactory;
	}
	
	@Override
	public void saveQuestion(Question question) {
		SqlSession sqlSession = sqlSessionFactory.openSession();
		sqlSession.insert(Question.class.getName() + ".saveQuestion", question);
		sqlSession.commit();
		sqlSession.close();
	}

	@Override
	public List<Question> randFindQuestion(int num, String type) {
		SqlSession sqlSession = sqlSessionFactory.openSession();
		Map<String, Object> map = new LinkedHashMap<>();
		map.put("num", num);
		map.put("type", type);
		List<Question> questions = sqlSession.selectList(Question.class.getName() + ".randFindQuestion", map);
		sqlSession.close();
		return questions;
	}

	@Override
	public int findMaxID() {
		SqlSession sqlSession = sqlSessionFactory.openSession();
		Object maxID = sqlSession.selectOne(Question.class.getName() + ".findMaxID");
		sqlSession.close();
		return (int)maxID;
	}

	@Override
	public List<Question> findSpec(List<Integer> questionIDs) {
		SqlSession sqlSession = sqlSessionFactory.openSession();
		List<Question> questions = sqlSession.selectList(Question.class.getName() + ".findSpec", questionIDs);
		return questions;
	}

}
