package com.quizGym.rest;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.text.SimpleDateFormat;
import java.util.Date;
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

import com.quizGym.entity.GroupQuestion;
import com.quizGym.entity.Question;
import com.quizGym.service.IGroupQuestionService;
import com.quizGym.service.IQuestionService;
import com.quizGym.util.TypeUtils;

/**
 * GroupQuestionRest rest服务层
 * 
 * @author zys
 *
 */
@Path("/groupquestionrest")
public class GroupQuestionRest {

	private IGroupQuestionService groupQuestionService;

	public void setGroupQuestionService(
			IGroupQuestionService groupQuestionService) {
		this.groupQuestionService = groupQuestionService;
	}

	private IQuestionService questionService;

	public void setQuestionService(IQuestionService questionService) {
		this.questionService = questionService;
	}

	/**
	 * 保存套题
	 * 
	 * @param request
	 * @return
	 * @throws IOException 
	 */
	@POST
	@Path("/saveall")
	@Produces(MediaType.TEXT_PLAIN)
	public String save(@Context HttpServletRequest request) throws IOException {

		BufferedReader br = new BufferedReader(new InputStreamReader(
				(ServletInputStream) request.getInputStream()));
		String line = null;
		StringBuilder sb = new StringBuilder();
		while ((line = br.readLine()) != null) {
			sb.append(line);
		}
		
		JSONObject jsonObject = JSONObject.fromObject(sb.toString());
		
		String username = jsonObject.getString("createrName");
		String typeName = jsonObject.getString("scopeType");
		int id = TypeUtils.getTypeID(typeName);
		
		String groupName = jsonObject.getString("listName");
		GroupQuestion groupQuestion = new GroupQuestion();
		Date date = new Date();
		groupQuestion.setName(groupName);
		groupQuestion.setCreaterName(username);
		groupQuestion.setCreateTime(date);
		groupQuestion.setTypeID(id);
		//存储套题信息
		groupQuestionService.saveGroupQuestion(groupQuestion);
		
		JSONArray questions = jsonObject.getJSONArray("questions");	
		int num = 0;
		for (int i = 0; i != questions.toArray().length; ++i ) {
			++num;
			Question question = new Question();
			JSONObject json = questions.getJSONObject(i);
			String name = json.getString("question");
			String rightAnswer = json.getString("correctAnswer");
			String reason = json.getString("reason");
			JSONArray options = json.getJSONArray("options");
			String answerA = (String)options.get(0);
			String answerB = (String)options.get(1);
			String answerC = (String)options.get(2);
			String answerD = (String)options.get(3);
			question.setAnswerA(answerA);
			question.setAnswerB(answerB);
			question.setAnswerC(answerC);
			question.setAnswerD(answerD);
			question.setName(name);
			question.setReason(reason);
			question.setRightAnswer(rightAnswer);
			question.setTypeID(id);
			questionService.saveQuestion(question);
		}

		int cur_id = groupQuestionService.findMaxID();
		int questionID = questionService.findMaxID();
		for (int i = 0; i != num; ++i) {
			groupQuestionService.saveQuestionContent(cur_id, questionID - i);
		}
		return "200";
	}
	
	/**
	 * 根据request的请求类别返回相应的套题名字
	 * @param request
	 * @return 此类别下的套题列表
	 */
	@GET
	@Path("/findgrouplist")
	@Produces(MediaType.APPLICATION_JSON)
	public String findGroupList(@Context HttpServletRequest request) {
		
		String typeName = request.getParameter("scopeType");
		int typeID = TypeUtils.getTypeID(typeName);
		List<GroupQuestion> groupList = groupQuestionService.findSpecList(typeID);
		
		JSONArray arrays = new JSONArray();
		for (GroupQuestion groupQuestion : groupList) {
			JSONObject json = new JSONObject();
			json.put("id", groupQuestion.getId());
			json.put("listName", groupQuestion.getName());
			json.put("createrName", groupQuestion.getCreaterName());
			json.put("scopeType", typeName);
			Date date = groupQuestion.getCreateTime();
			SimpleDateFormat sdf = new SimpleDateFormat("YYYY-MM-dd");
			String createTime = sdf.format(date);
			json.put("createTime", createTime);
			arrays.add(json);
		}
		
		return arrays.toString();
	}
	
	/**
	 * 查询此套题中的所有题目
	 * @param request
	 * @return 题目
	 */
	@GET
	@Path("/findquestions")
	@Produces(MediaType.APPLICATION_JSON)
	public String findQuestion(@Context HttpServletRequest request) {
		
		String groupID = request.getParameter("questionId");
		int typeID = Integer.parseInt(groupID);
		List<Integer> questionIDs = groupQuestionService.findQuestions(typeID);
		List<Question> questions = questionService.findSpec(questionIDs);
		JSONArray result = new JSONArray();
		int index = 1;
		for (Question question : questions) {
			JSONObject json = new JSONObject();
			json.put("index", index);
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
	 * 模糊匹配
	 * @param request
	 * @return
	 */
	@GET
	@Path("/findKeyList")
	@Produces(MediaType.APPLICATION_JSON)
	public String findKeyList(@Context HttpServletRequest request) {
		
		String key = request.getParameter("key");
		key = "%" + key + "%";
		List<GroupQuestion> groupList = groupQuestionService.findKeyList(key);
		JSONArray arrays = new JSONArray();
		for (GroupQuestion groupQuestion : groupList) {
			JSONObject json = new JSONObject();
			json.put("id", groupQuestion.getId());
			json.put("listName", groupQuestion.getName());
			json.put("createrName", groupQuestion.getCreaterName());
			String typeName = TypeUtils.getTypeName(groupQuestion.getTypeID());
			json.put("scopeType", typeName);
			Date date = groupQuestion.getCreateTime();
			SimpleDateFormat sdf = new SimpleDateFormat("YYYY-MM-dd");
			String createTime = sdf.format(date);
			json.put("createTime", createTime);
			arrays.add(json);
		}
		
		return arrays.toString();
	}
	
	/**
	 * 查询需要审核的题目单
	 * @param request
	 * @return
	 */
	@GET
	@Path("/findchecklist")
	@Produces(MediaType.APPLICATION_JSON)
	public String findCheckList(@Context HttpServletRequest request) {
		JSONArray result = new JSONArray();
		List<GroupQuestion> groups = groupQuestionService.findCheckList();
		for (GroupQuestion groupQuestion : groups) {
			JSONObject json = new JSONObject();
			json.put("id", groupQuestion.getId());
			json.put("listName", groupQuestion.getName());
			json.put("createrName", groupQuestion.getCreaterName());
			SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM--dd");
			String time = sdf.format(groupQuestion.getCreateTime());
			json.put("createTime", time);
			int typeID = groupQuestion.getTypeID();
			json.put("scope", TypeUtils.getTypeName(typeID));
			result.add(json);
		}
		return result.toString();
	}
	
}
