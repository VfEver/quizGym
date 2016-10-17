package com.quizGym.dao;

import java.util.List;

import com.quizGym.entity.Question;

public interface IQuestionDao {
	/**
	 * 保存题目
	 * @param question
	 */
	public void saveQuestion(Question question);
	/**
	 * 随机查询题目
	 * @param num 查询题目数量
	 * @return 题目列表list
	 */
	public List<Question> randFindQuestion(int num, String type);
}
