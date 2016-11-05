package com.quizGym.entity;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;

/**
 * 用户实体类
 * @author zys
 *
 */
public class User {
	private int id;
	private String account;
	private String password;
	private String name;
	private String mailBox;
	private Date createTime;//用户创建账户时间
	private int score = 0;//用户答题分数，总分
	private int type = 0;//用户类型，0为普通用户，1为普通管理员
	private String headImage;
	public String getPassword() {
		return password;
	}
	public void setPassword(String password) {
		this.password = password;
	}
	public String getHeadImage() {
		return headImage;
	}
	public void setHeadImage(String headImage) {
		this.headImage = headImage;
	}
	public void setAccount(String account) {
		this.account = account;
	}
	private List<Integer> done = new ArrayList<>();
	private List<Integer> collect = new ArrayList<>();
	public int getId() {
		return id;
	}
	public void setId(int id) {
		this.id = id;
	}
	public String getAccount() {
		return account;
	}
	public void setAcount(String account) {
		this.account = account;
	}
	public String getPasswrod() {
		return password;
	}
	public void setPasswrod(String password) {
		this.password = password;
	}
	public String getName() {
		return name;
	}
	public void setName(String name) {
		this.name = name;
	}
	public String getMailBox() {
		return mailBox;
	}
	public void setMailBox(String mailBox) {
		this.mailBox = mailBox;
	}
	public Date getCreateTime() {
		return createTime;
	}
	public void setCreateTime(Date createTime) {
		this.createTime = createTime;
	}
	public int getScore() {
		return score;
	}
	public void setScore(int score) {
		this.score = score;
	}
	public int getType() {
		return type;
	}
	public void setType(int type) {
		this.type = type;
	}
	List<Integer> getDone() {
		return done;
	}
	void setDone(List<Integer> done) {
		this.done = done;
	}
	List<Integer> getCollect() {
		return collect;
	}
	void setCollect(List<Integer> collect) {
		this.collect = collect;
	}
	
}
