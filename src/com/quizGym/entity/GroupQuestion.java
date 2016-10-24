package com.quizGym.entity;

import java.util.Date;

/**
 * 用户的套题信息
 * @author zys
 *
 */
public class GroupQuestion {
	private int id;
	private int typeID;
	private String name;
	private String createrName;
	private Date createTime;
	
	public int getTypeID() {
		return typeID;
	}
	public void setTypeID(int typeID) {
		this.typeID = typeID;
	}
	public int getId() {
		return id;
	}
	public void setCreaterName(String createrName) {
		this.createrName = createrName;
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
	public String getCreaterName() {
		return createrName;
	}
	public Date getCreateTime() {
		return createTime;
	}
	public void setCreateTime(Date createTime) {
		this.createTime = createTime;
	}
	
}
