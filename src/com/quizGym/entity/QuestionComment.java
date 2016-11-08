package com.quizGym.entity;

import java.sql.Timestamp;

/**
 * 评论实体类
 * @author zys
 *
 */
public class QuestionComment {
	
	private int id;
	private String userName;
	private String commnet;
	private Timestamp time;
	public Timestamp getTime() {
		return time;
	}
	public void setTime(Timestamp time) {
		this.time = time;
	}
	public int getId() {
		return id;
	}
	public void setId(int id) {
		this.id = id;
	}
	public String getUserName() {
		return userName;
	}
	public void setUserName(String userName) {
		this.userName = userName;
	}
	public String getCommnet() {
		return commnet;
	}
	public void setCommnet(String commnet) {
		this.commnet = commnet;
	}
	
}
