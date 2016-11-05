package com.quizGym.entity;

/**
 * 用户随机做题实体类
 * @author zys
 *
 */
public class RandomQuestion {
	
	private int randomID;
	private int questionID;
	public int getRandomID() {
		return randomID;
	}
	public void setRandomID(int randomID) {
		this.randomID = randomID;
	}
	public int getQuestionID() {
		return questionID;
	}
	public void setQuestionID(int questionID) {
		this.questionID = questionID;
	}
}
