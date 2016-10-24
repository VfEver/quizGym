package com.quizGym.service.impl;

import java.util.List;

import com.quizGym.dao.IQuestionDao;
import com.quizGym.entity.Question;
import com.quizGym.service.IQuestionService;

public class QuestionService implements IQuestionService {
	
	private IQuestionDao questionDao;
	public void setQuestionDao(IQuestionDao questionDao) {
		
		this.questionDao = questionDao;
	}
	
	@Override
	public void saveQuestion(Question question) {
		
		questionDao.saveQuestion(question);
	}

	@Override
	public List<Question> randFindQuestion(int num, String type) {
		return questionDao.randFindQuestion(num, type);
	}

	@Override
	public int findMaxID() {

		return questionDao.findMaxID();
	}

	@Override
	public List<Question> findSpec(List<Integer> questionIDs) {
		
		return questionDao.findSpec(questionIDs);
	}

}
