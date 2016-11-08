package com.quizGym.dao.impl;

import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.HashMap;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

import org.apache.ibatis.session.SqlSession;
import org.apache.ibatis.session.SqlSessionFactory;

import com.quizGym.dao.IQuestionDao;
import com.quizGym.entity.Question;
import com.quizGym.entity.QuestionComment;
import com.quizGym.entity.RandomQuestion;
import com.quizGym.util.DateUtils;

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
		sqlSession.close();
		return questions;
	}

	@Override
	public List<Question> findAllQuestion() {
		
		SqlSession sqlSession = sqlSessionFactory.openSession();
		List<Question> questions = sqlSession.selectList(Question.class.getName() + ".findAllQuestion");
		sqlSession.close();
		return questions;
	}

	@Override
	public int findMaxRandomID() {
		
		SqlSession sqlSession = sqlSessionFactory.openSession();
		int maxID = sqlSession.selectOne(RandomQuestion.class.getName() + ".findMaxRandomID");
		sqlSession.close();
		return maxID;
	}

	@Override
	public void saveRandom(List<RandomQuestion> list) {
		
		SqlSession sqlSession = sqlSessionFactory.openSession();
		sqlSession.insert(RandomQuestion.class.getName() + ".saveRandom", list);
		sqlSession.commit();
		sqlSession.close();
	}

	@Override
	public List<Map<String, Integer>> selectRandomNum(int userID) {
		
		SqlSession sqlSession = sqlSessionFactory.openSession();
		List<Map<String, Integer>> list = sqlSession.selectList(RandomQuestion.class.getName() + ".selectRandomNum", userID);
		sqlSession.close();
		return list;
	}

	@Override
	public void saveRandomInfo(int userID, int randomID, Date time, int rightNum, int wrongNum) {
		
		SqlSession sqlSession = sqlSessionFactory.openSession();
		Map<String, Integer> map = new HashMap<>();
		map.put("userID", userID);
		map.put("randomID", randomID);
	
		SimpleDateFormat sdf = new SimpleDateFormat("yyyyMMdd");
		String date = sdf.format(time);
		int real = Integer.parseInt(date);
		
		map.put("doneTime", real);
		map.put("rightNum", rightNum);
		map.put("wrongNum", wrongNum);
		sqlSession.insert(RandomQuestion.class.getName() + ".saveRandomInfo", map);
		sqlSession.commit();
		sqlSession.close();
	}

	@Override
	public int findRandQuestionType(int randomID) {
		
		SqlSession sqlSession = sqlSessionFactory.openSession();
		int typeID = sqlSession.selectOne(Question.class.getName() + ".findRandQuestionType", randomID);
		sqlSession.close();
		return typeID;
	}

	@Override
	public void saveComment(QuestionComment questionComment) {
		
		SqlSession sqlSession = sqlSessionFactory.openSession();
		sqlSession.insert(QuestionComment.class.getName() + ".saveComment", questionComment);
		
		sqlSession.close();
	}

	@Override
	public List<QuestionComment> findCommentByQuestionID(int questionID) {
		
		SqlSession sqlSession = sqlSessionFactory.openSession();
		List<QuestionComment> commentList = sqlSession.selectList(QuestionComment.class.getName() + ".findCommentByQuestionID", questionID);
		sqlSession.close();
		
		return commentList;
	}

}
