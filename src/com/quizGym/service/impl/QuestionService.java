package com.quizGym.service.impl;

import java.util.Date;
import java.util.List;
import java.util.Map;

import com.quizGym.dao.IQuestionDao;
import com.quizGym.entity.Question;
import com.quizGym.entity.QuestionComment;
import com.quizGym.entity.RandomQuestion;
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

	@Override
	public List<Question> findAllQuestion() {

		return questionDao.findAllQuestion();
	}

	@Override
	public int findMaxRandomID() {
		
		return questionDao.findMaxRandomID();
	}

	@Override
	public void saveRandom(List<RandomQuestion> list) {
		
		questionDao.saveRandom(list);
	}

	@Override
	public List<Map<String, Integer>> selectRandomNum(int userID) {

		return questionDao.selectRandomNum(userID);
	}

	@Override
	public void saveRandomInfo(int userID, int randomID, Date time, int rightNum, int wrongNum) {

		questionDao.saveRandomInfo(userID, randomID, time, rightNum, wrongNum);
	}

	@Override
	public int findRandQuestionType(int randomID) {

		return questionDao.findRandQuestionType(randomID);
	}

	@Override
	public void saveComment(QuestionComment questionComment) {
		
		questionDao.saveComment(questionComment);
	}

	@Override
	public List<QuestionComment> findCommentByQuestionID(int questionID) {
		
		return questionDao.findCommentByQuestionID(questionID);
	}

}
