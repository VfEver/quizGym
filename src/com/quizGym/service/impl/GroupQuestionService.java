package com.quizGym.service.impl;

import java.util.Date;
import java.util.List;
import java.util.Map;

import com.quizGym.dao.IGroupQuestionDao;
import com.quizGym.entity.GroupQuestion;
import com.quizGym.service.IGroupQuestionService;

public class GroupQuestionService implements IGroupQuestionService {
	
	private IGroupQuestionDao groupQuestionDao;
	public void setGroupQuestionDao(IGroupQuestionDao groupQuestionDao) {
		this.groupQuestionDao = groupQuestionDao;
	}
	
	@Override
	public void saveGroupQuestion(GroupQuestion groupQuestion) {
		
		groupQuestionDao.saveGroupQuestion(groupQuestion);
	}

	@Override
	public GroupQuestion findByID(int id) {
		
		return groupQuestionDao.findByID(id);
	}

	@Override
	public int findMaxID() {
		
		return groupQuestionDao.findMaxID();
	}

	@Override
	public void saveQuestionContent(int groupID, int questionID) {
		
		groupQuestionDao.saveQuestionContent(groupID, questionID);
	}

	@Override
	public List<GroupQuestion> findSpecList(int typeID) {

		return groupQuestionDao.findSpecList(typeID);
	}

	@Override
	public List<Integer> findQuestions(int typeID) {
		
		return groupQuestionDao.findQuestions(typeID);
	}

	@Override
	public List<GroupQuestion> findKeyList(String key) {
		
		return groupQuestionDao.findKeyList(key);
	}

	@Override
	public List<GroupQuestion> findCheckList() {
		
		return groupQuestionDao.findCheckList();
	}

	@Override
	public Map<String, String> findDoneInfo(int userID, int typeID) {

		return groupQuestionDao.findDoneInfo(userID, typeID);
	}

	@Override
	public List<Map<String, Integer>> findDoneRecent(int userID) {

		return groupQuestionDao.findDoneRecent(userID);
	}

	@Override
	public List<Map<String, Integer>> findRandomQuestions(int userID) {

		return groupQuestionDao.findRandomQuestions(userID);
	}

	@Override
	public void passGroupQuesion(int groupQuestionID, int status, String reason) {
		
		groupQuestionDao.passGroupQuesion(groupQuestionID, status, reason);
	}

	@Override
	public List<GroupQuestion> findGroupQuestionByUsername(String username) {

		return groupQuestionDao.findGroupQuestionByUsername(username);
	}

	@Override
	public void deleteByID(int groupID) {

		groupQuestionDao.deleteByID(groupID);
	}

	@Override
	public void deleteContentByID(int groupID) {

		groupQuestionDao.deleteContentByID(groupID);
	}

	@Override
	public void updateGroupByID(String groupID, Date date, String status) {

		groupQuestionDao.updateGroupByID(groupID, date, status);
	}

	@Override
	public int findRandomQuestionID(int randomID) {

		return groupQuestionDao.findRandomQuestionID(randomID);
	}

}
