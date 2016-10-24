package com.quizGym.service.impl;

import java.util.List;

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

}