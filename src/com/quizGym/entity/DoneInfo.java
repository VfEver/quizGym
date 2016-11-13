package com.quizGym.entity;

import java.util.Date;

/**
 * 传输给前台的POJO
 * @author zys
 *
 */
public class DoneInfo {
	
	private int type;	//是否为套题
	private int id;	//组题id
	private String name;
	private int accuracy;	//正确率
	private String scopeType;	//类别
	private Date doTime;	//完成时间
	private String createrName;	//创建人
	private int userID;	//做题人ID
	private int rightNum;
	private int wrongNum;

	public int getType() {
		return type;
	}
	public void setType(int type) {
		this.type = type;
	}
	public int getId() {
		return id;
	}
	public void setId(int id) {
		this.id = id;
	}
	public String getName() {
		return name;
	}
	public void setName(String name) {
		this.name = name;
	}
	public int getAccuracy() {
		return accuracy;
	}
	public void setAccuracy(int accuracy) {
		this.accuracy = accuracy;
	}
	public String getScopeType() {
		return scopeType;
	}
	public void setScopeType(String scopeType) {
		this.scopeType = scopeType;
	}
	public Date getDoTime() {
		return doTime;
	}
	public void setDoTime(Date doTime) {
		this.doTime = doTime;
	}
	public String getCreaterName() {
		return createrName;
	}
	public void setCreaterName(String createrName) {
		this.createrName = createrName;
	}
	public int getUserID() {
		return userID;
	}
	public void setUserID(int userID) {
		this.userID = userID;
	}
	public int getRightNum() {
		return rightNum;
	}
	public void setRightNum(int rightNum) {
		this.rightNum = rightNum;
	}
	public int getWrongNum() {
		return wrongNum;
	}
	public void setWrongNum(int wrongNum) {
		this.wrongNum = wrongNum;
	}
}
