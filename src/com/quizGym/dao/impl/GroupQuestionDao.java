package com.quizGym.dao.impl;

import java.util.Date;
import java.util.HashMap;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

import org.apache.ibatis.session.SqlSession;
import org.apache.ibatis.session.SqlSessionFactory;

import com.quizGym.dao.IGroupQuestionDao;
import com.quizGym.entity.GroupQuestion;
import com.quizGym.util.DateUtils;

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
		GroupQuestion result = (GroupQuestion)sqlSession.selectOne(GroupQuestion.class.getName() + ".findByID", map);
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

	@Override
	public List<GroupQuestion> findCheckList() {

		SqlSession sqlSession = sqlSessionFactory.openSession();
		List<GroupQuestion> groups = sqlSession.selectList(GroupQuestion.class.getName() + ".findCheckList");
		sqlSession.close();
		return groups;
	}

	@Override
	public Map<String, String> findDoneInfo(int userID, int typeID) {
		
		SqlSession sqlSession = sqlSessionFactory.openSession();
		Map<String, Integer> map = new HashMap<String, Integer>();
		map.put("typeID", typeID);
		map.put("userID", userID);
		List<Map<String, String>> list = sqlSession.selectList(GroupQuestion.class.getName() + ".findDoneInfo", map);
		return list.get(0);
	}

	@Override
	public List<Map<String, Integer>> findDoneRecent(int userID) {
		
		SqlSession sqlSession = sqlSessionFactory.openSession();
		List<Map<String, Integer>> list = sqlSession.selectList(GroupQuestion.class.getName() + ".findDoneRecent", userID);
		sqlSession.close();
		return list;
	}

	@Override
	public List<Map<String, Integer>> findRandomQuestions(int userID) {

		SqlSession sqlSession = sqlSessionFactory.openSession();
		List<Map<String, Integer>> list = sqlSession.selectList(GroupQuestion.class.getName() + ".findRandomQuestions", userID);
		sqlSession.close();
		return list;
	}

	@Override
	public void passGroupQuesion(int groupQuestionID, int status, String reason) {
		
		SqlSession sqlSession = sqlSessionFactory.openSession();
		Map<String, String> map = new HashMap<> ();
		map.put("id", ""+groupQuestionID);
		map.put("status", ""+status);
		map.put("reason", reason);
		sqlSession.update(GroupQuestion.class.getName() + ".passGroupQuesion", map);
		sqlSession.close();
	}

	@Override
	public List<GroupQuestion> findGroupQuestionByUsername(String username) {
		
		SqlSession sqlSession = sqlSessionFactory.openSession();
		List<GroupQuestion> infoLists = sqlSession.selectList(GroupQuestion.class.getName() + 
				".findGroupQuestionByUsername", username);
		sqlSession.close();
		
		return infoLists;
	}

	@Override
	public void deleteByID(int groupID) {
		
		SqlSession sqlSession = sqlSessionFactory.openSession();
		sqlSession.delete(GroupQuestion.class.getName() + ".deleteByID", groupID);
		sqlSession.close();
		
	}

	@Override
	public void deleteContentByID(int groupID) {
		
		SqlSession sqlSession = sqlSessionFactory.openSession();
		sqlSession.delete(GroupQuestion.class.getName() + ".deleteContentByID", groupID);
		sqlSession.close();
	}

	@Override
	public void updateGroupByID(String groupID, Date date, String status) {
		
		SqlSession sqlSession = sqlSessionFactory.openSession();
		Map<String, String> map = new HashMap<String, String>();
		map.put("createTime", DateUtils.dateToString("yyyy-MM-dd", date));
		map.put("status", "0");
		map.put("id", groupID);
		
		sqlSession.update(GroupQuestion.class.getName() + ".updateGroupByID", map);
		
		sqlSession.close();
	}

	@Override
	public int findRandomQuestionID(int randomID) {

		SqlSession sqlSession = sqlSessionFactory.openSession();
		int id = sqlSession.selectOne(GroupQuestion.class.getName() + ".findRandomQuestionID", randomID);
		sqlSession.close();
		
		return id;
	}

}
