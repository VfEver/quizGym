package com.quizGym.rest;

import java.util.List;

import javax.servlet.http.HttpServletRequest;
import javax.ws.rs.GET;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.core.Context;
import javax.ws.rs.core.MediaType;

import net.sf.json.JSONArray;
import net.sf.json.JSONObject;

import com.quizGym.entity.Question;
import com.quizGym.service.IQuestionService;

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
	
	//查出题目最大id
	@GET
	@Path("/findMax")
	@Produces(MediaType.TEXT_PLAIN)
	public String findMax(@Context HttpServletRequest request) {
		return ""+questionService.findMaxID();
	}
}
