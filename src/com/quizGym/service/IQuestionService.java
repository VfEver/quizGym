package com.quizGym.service;

import java.util.List;

import com.quizGym.entity.Question;

public interface IQuestionService {
	public void saveQuestion(Question question);
	public List<Question> randFindQuestion(int num, String type);
}
