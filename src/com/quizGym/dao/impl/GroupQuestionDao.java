package com.quizGym.dao.impl;

import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

import org.apache.ibatis.session.SqlSession;
import org.apache.ibatis.session.SqlSessionFactory;

import com.quizGym.dao.IGroupQuestionDao;
import com.quizGym.entity.GroupQuestion;

public class GroupQuestionDao implements IGroupQuestionDao {

	private SqlSessionFactory sqlSessionFactory;
	public void setSqlSessionFactory(SqlSessionFactory sqlSessionFactory) {
		this.sqlSessionFactory = sqlSessionFactory;
	}
	
	@Override
	public void saveGroupQuestion(GroupQuestion groupQuestion) {
		SqlSession sqlSession = sqlSessionFactory.openSession();
		sqlSession.insert(GroupQuestion.class.getName() + ".saveGroupQuestion", groupQuestion);
		sqlSession.commit();
		sqlSession.close();
	}

	@Override
	public GroupQuestion findByID(int id) {
		SqlSession sqlSession = sqlSessionFactory.openSession();
		Map<String, Integer> map = new LinkedHashMap<String, Integer>();
		map.put("id", id);
		GroupQuestion result = (GroupQuestion)sqlSession.selectOne(GroupQuestion.class.getName() + "findByID", map);
		sqlSession.close();
		return result;
	}

	@Override
	public int findMaxID() {
		SqlSession sqlSession = sqlSessionFactory.openSession();
		int maxID = sqlSession.selectOne(GroupQuestion.class.getName() + ".findMaxID");
		sqlSession.close();
		return maxID;
	}

	@Override
	public void saveQuestionContent(int groupID, int questionID) {
		SqlSession sqlSession = sqlSessionFactory.openSession();
		Map<String, Integer> map = new LinkedHashMap<String, Integer>();
		map.put("groupID", groupID);
		map.put("questionID", questionID);
		sqlSession.insert(GroupQuestion.class.getName() + ".saveQuestionContent", map);
		sqlSession.commit();
		sqlSession.close();
	}

	@Override
	public List<GroupQuestion> findSpecList(int typeID) {
		SqlSession sqlSession = sqlSessionFactory.openSession();
		List<GroupQuestion> groupList = sqlSession.selectList(GroupQuestion.class.getName() + ".findSpecList", typeID);
		sqlSession.close();
		return groupList;
	}

	@Override
	public List<Integer> findQuestions(int typeID) {
		SqlSession sqlSession = sqlSessionFactory.openSession();
		List<Integer> questionIDs = sqlSession.selectList(GroupQuestion.class.getName() + ".findQuestions", typeID);
		sqlSession.close();
		return questionIDs;
	}

	@Override
	public List<GroupQuestion> findKeyList(String key) {
		SqlSession sqlSession = sqlSessionFactory.openSession();
		List<GroupQuestion> keyList = sqlSession.selectList(GroupQuestion.class.getName() + ".findKeyList", key);
		sqlSession.close();
		return keyList;
	}

}
