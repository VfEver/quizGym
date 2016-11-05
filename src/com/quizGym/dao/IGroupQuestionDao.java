package com.quizGym.dao;

import java.util.List;
import java.util.Map;

import com.quizGym.entity.GroupQuestion;

public interface IGroupQuestionDao {
	
	/**
	 * 存储套题相应信息
	 * @param groupQuestion
	 */
	public void saveGroupQuestion(GroupQuestion groupQuestion);
	
	/**
	 * 根据ID查询套题信息
	 * @param id
	 * @return
	 */
	public GroupQuestion findByID(int id);
	
	/**
	 * 查询套题最大的ID
	 * @return
	 */
	public int findMaxID();
	
	/**
	 * 将套题实际内容存入数据库
	 * @param map
	 */
	public void saveQuestionContent(int groupID, int questionID);
	
	/**
	 * 查询特定领域的套题
	 * @param typeID
	 * @return
	 */
	public List<GroupQuestion> findSpecList(int typeID);
	
	/**
	 * 根据套题id查询此套题下的所有问题
	 * @param typeID
	 * @return
	 */
	public List<Integer> findQuestions(int typeID);
	
	/**
	 * 查询包含特定关键字的套题列表
	 * @param key
	 * @return
	 */
	public List<GroupQuestion> findKeyList(String key);
	
	/**
	 * 模糊匹配
	 * @param key
	 * @return
	 */
//	public List<GroupQuestion> fuzzyMatching(String key);
	
	/**
	 * 查询需要审核的题目单列表
	 * @return
	 */
	public List<GroupQuestion> findCheckList();
	
	/**
	 * 查询用户做过的题目正确错误
	 * @param userID
	 * @param typeID
	 * @return
	 */
	public Map<String, String> findDoneInfo(int userID, int typeID);
	
	/**
	 * 根据用户ID查询最近做过的信息
	 * @param userID
	 * @return
	 */
	public List<Map<String, Integer>> findDoneRecent(int userID);
	
	/**
	 * 查询随机生成的套题信息
	 * @param userID
	 * @return
	 */
	public List<Map<String, Integer>> findRandomQuestions(int userID);
}
