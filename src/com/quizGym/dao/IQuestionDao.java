package com.quizGym.dao;

import java.util.Date;
import java.util.List;
import java.util.Map;

import com.quizGym.entity.Question;
import com.quizGym.entity.QuestionComment;
import com.quizGym.entity.RandomQuestion;

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
	
	/**
	 * 查询当前数据库中最大的id
	 * @return
	 */
	public int findMaxID();
	
	/**
	 * 根据一组id查询题目
	 * @param questionIDs
	 * @return
	 */
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
	
}
