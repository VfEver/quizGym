package com.quizGym.service;

import java.util.Date;
import java.util.List;
import java.util.Map;

import com.quizGym.entity.Question;
import com.quizGym.entity.QuestionComment;
import com.quizGym.entity.RandomQuestion;

public interface IQuestionService {
	public void saveQuestion(Question question);
	public List<Question> randFindQuestion(int num, String type);
	public int findMaxID();
	public List<Question> findSpec(List<Integer> questionIDs);
	/**
	 * 查询所有题目
	 * @return
	 */
	public List<Question> findAllQuestion();
	
	/**
	 * 查询随机题目组成的套题最大ID
	 * @return
	 */
	public int findMaxRandomID();
	
	/**
	 * 插入随机题目组成套题
	 * @param list
	 */
	public void saveRandom(List<RandomQuestion> list);
	
	/**
	 * 查询出用户的随机历史
	 * @param userID
	 * @return
	 */
	public List<Map<String, Integer>> selectRandomNum(int userID);
	
	/**
	 * 存储用户随机做过的题目组成的套题信息
	 */
	public void saveRandomInfo(int userID, int randomID, Date time, int rightNum, int wrongNum);
	
	/**
	 * 查询随机题目的类型（多表连接查询）
	 * @param randomID
	 * @return
	 */
	public int findRandQuestionType(int randomID);
	
	/**
	 * 存贮用户对题目的评论信息
	 * @param username
	 * @param comment
	 * @param date
	 */
	public void saveComment(QuestionComment questionComment);
	
	/**
	 * 根据题目id查询题目的评论信息
	 * @param questionID
	 * @return
	 */
	public List<QuestionComment> findCommentByQuestionID(int questionID);
	
	/**
	 * 根据一系列id删除题目
	 * @param questionIDs
	 */
	public void deleteQestion(List<Integer> questionIDs);
	
	/**
	 * 根据id更新问题信息
	 * @param name
	 * @param answerA
	 * @param answerB
	 * @param answerC
	 * @param answerD
	 * @param right
	 * @param reason
	 * @param id
	 */
	public void updateQuestionByID(String name, String answerA, 
			String answerB, String answerC, String answerD, 
			String right, String reason, String id);
}
