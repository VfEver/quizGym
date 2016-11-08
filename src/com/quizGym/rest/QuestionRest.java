package com.quizGym.rest;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.sql.Timestamp;
import java.util.List;

import javax.servlet.ServletInputStream;
import javax.servlet.http.HttpServletRequest;
import javax.ws.rs.GET;
import javax.ws.rs.POST;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.core.Context;
import javax.ws.rs.core.MediaType;

import net.sf.json.JSONArray;
import net.sf.json.JSONObject;

import com.quizGym.entity.Question;
import com.quizGym.entity.QuestionComment;
import com.quizGym.service.IQuestionService;
import com.quizGym.service.IUserService;
import com.quizGym.util.DateUtils;

/**
 * question rest服务层
 * @author zys
 *
 */
@Path("/questionrest")
public class QuestionRest {
	
	private IQuestionService questionService;
	public void setQuestionService(IQuestionService questionService) {
		this.questionService = questionService;
	}
	
	private IUserService userService;
	public void setUserService(IUserService userService) {
		this.userService = userService;
	}
	
	/**
	 * 保存题目
	 * @param request
	 * @return
	 */
	@GET
	@Path("/saveQuestion")
	@Produces(MediaType.TEXT_PLAIN)
	public String saveQuestion(@Context HttpServletRequest request) {
		
		return "hello";
	}
	
	/**
	 * 随机查询一定数量的题目
	 * @param request
	 * @return
	 */
	@GET
	@Path("/randFindQuestion")
	@Produces(MediaType.APPLICATION_JSON)
	public String randFindQuestion(@Context HttpServletRequest request) {
		
		String type = request.getParameter("scopeType");
		String num = request.getParameter("quizNumber");
		
		List<Question> questions = questionService.randFindQuestion(Integer.parseInt(num), type);
		JSONArray result = new JSONArray();
		int index = 1;
		for (Question question : questions) {
			JSONObject json = new JSONObject();
			json.put("index", index);
			json.put("questionId", question.getId());
			json.put("question", question.getName());
			String[] ans = new String[4];
			ans[0]="A、" + question.getAnswerA();
			ans[1]="B、" + question.getAnswerB();
			ans[2]="C、" + question.getAnswerC();
			ans[3]="D、" + question.getAnswerD();
			json.put("answer", ans);
			json.put("result", question.getRightAnswer());
			json.put("reason", question.getReason());
			++index;
			result.add(json);
		}
		return result.toString();
	}
	
	//查出题目最大id
	@GET
	@Path("/findMax")
	@Produces(MediaType.TEXT_PLAIN)
	public String findMax(@Context HttpServletRequest request) {
		return ""+questionService.findMaxID();
	}
	
	/**
	 * 查询所有题目
	 * @param request
	 * @return
	 */
	@GET
	@Path("/findallquestion")
	@Produces(MediaType.APPLICATION_JSON)
	public String findAllQuestion(@Context HttpServletRequest request) {
		
		JSONArray result = new JSONArray();
		List<Question> questions = questionService.findAllQuestion();
		int index = 1;
		for (Question question : questions) {
			JSONObject json = new JSONObject();
			json.put("index", index);
			json.put("questionID", question.getId());
			json.put("question", question.getName());
			String[] ans = new String[4];
			ans[0]="A、" + question.getAnswerA();
			ans[1]="B、" + question.getAnswerB();
			ans[2]="C、" + question.getAnswerC();
			ans[3]="D、" + question.getAnswerD();
			json.put("answer", ans);
			json.put("result", question.getRightAnswer());
			json.put("reason", question.getReason());
			++index;
			result.add(json);
		}
		
		return result.toString();
	}
	
	/**
	 * 保存评论并且返回评论信息
	 * @param request
	 * @return
	 * @throws IOException
	 */
	@POST
	@Path("/savecomment")
	@Produces(MediaType.TEXT_PLAIN)
	public String saveComment(@Context HttpServletRequest request) throws IOException {
		
		//读取post过来的数据
		BufferedReader br = new BufferedReader(
				new InputStreamReader(
				(ServletInputStream) request.getInputStream()));  
		String line = null;  
		StringBuilder sb = new StringBuilder();  
		while ((line = br.readLine()) != null) {  
		    sb.append(line);  
		}
		String questionID = "1";
		if (sb != null && sb.length() != 0) {
			//转化为json对象
			JSONObject json = JSONObject.fromObject(sb.toString());
			questionID = json.getString("questionId");
			String username = json.getString("userName");
			String comment = json.getString("content");
			
			QuestionComment questionComment = new QuestionComment();
			questionComment.setId(Integer.parseInt(questionID));
			questionComment.setCommnet(comment);
			questionComment.setUserName(username);
			Timestamp time = new Timestamp(System.currentTimeMillis());
			questionComment.setTime(time);
			
			questionService.saveComment(questionComment);
		}
		
		JSONObject result = new JSONObject();
		result.put("state", "200");
		JSONArray array = new JSONArray();
		
		List<QuestionComment> commentList = questionService.findCommentByQuestionID(Integer.parseInt(questionID));
		for (QuestionComment questionComment : commentList) {
			JSONObject json = new JSONObject();
			json.put("userName", questionComment.getUserName());
			json.put("content", questionComment.getCommnet());
			
			String imagePath = userService.findAccount(questionComment.getUserName()).getHeadImage();
			json.put("imageIcon", imagePath);
			
			json.put("time", DateUtils.dateToString("yyyy-MM-dd HH:mm:ss", questionComment.getTime()));
			array.add(json);
		}
		result.put("commentData", array);
		
		return result.toString();
	}
	
	/**
	 * 根据题目id查询此题目的所有评论
	 * @param request
	 * @return
	 */
	@GET
	@Path("/findcomments")
	@Produces(MediaType.APPLICATION_JSON)
	public String findCommentByQuestionID(@Context HttpServletRequest request) {
		
		String questionID = request.getParameter("questionId");
		
		JSONArray array = new JSONArray();
		
		List<QuestionComment> commentList = questionService.findCommentByQuestionID(Integer.parseInt(questionID));
		for (QuestionComment questionComment : commentList) {
			JSONObject json = new JSONObject();
			json.put("userName", questionComment.getUserName());
			json.put("content", questionComment.getCommnet());
			
			String imagePath = userService.findAccount(questionComment.getUserName()).getHeadImage();
			json.put("imageIcon", imagePath);
			
			json.put("time", DateUtils.dateToString("yyyy-MM-dd HH:mm:ss", questionComment.getTime()));
			array.add(json);
		}
		
		return array.toString();
	}
	
}
