package com.quizGym.service;

import java.util.List;

import com.quizGym.entity.GroupQuestion;

/**
 * 套题服务层接口
 * @author zys
 *
 */
public interface IGroupQuestionService {
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
}
