package com.quizGym.rest;

import java.io.BufferedReader;
import java.io.FileOutputStream;
import java.io.InputStreamReader;
import java.io.OutputStream;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.Map;

import javax.servlet.ServletInputStream;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;
import javax.ws.rs.GET;
import javax.ws.rs.POST;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.core.Context;
import javax.ws.rs.core.MediaType;

import sun.misc.BASE64Decoder;
import net.sf.json.JSONArray;
import net.sf.json.JSONObject;

import com.quizGym.entity.DoneInfo;
import com.quizGym.entity.GroupQuestion;
import com.quizGym.entity.MailBox;
import com.quizGym.entity.RandomQuestion;
import com.quizGym.entity.User;
import com.quizGym.service.IGroupQuestionService;
import com.quizGym.service.IQuestionService;
import com.quizGym.service.IUserService;
import com.quizGym.util.TypeUtils;
/**
 * user rest服务层
 * @author zys
 *
 */
@Path("/userrest")
public class UserRest {
	
	private IUserService userService;
	public void setUserService(IUserService userService) {
		this.userService = userService;
	}
	
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
	 * 查询用户
	 * @param request
	 * @return
	 */
	@GET
	@Path("/findUser")
	@Produces(MediaType.TEXT_PLAIN)
	public String findUser(@Context HttpServletRequest request) {
		
		return "hello";
	}
	
	/**
	 * 查看是否登录成功
	 * @param request
	 * @return
	 * @throws Exception
	 */
	@POST
	@Path("/loginSuccess")
	@Produces(MediaType.APPLICATION_JSON)
	public String login(@Context HttpServletRequest request) throws Exception {
		BufferedReader br = new BufferedReader(
						new InputStreamReader(
						(ServletInputStream) request.getInputStream()));  
        String line = null;  
        StringBuilder sb = new StringBuilder();  
        while ((line = br.readLine()) != null) {  
            sb.append(line);  
        }
        if (sb.length() != 0 || !(sb.toString().equals(""))) {
        	
        	String[] infos = sb.toString().split("&");
        	
        	String username = infos[0].split("=")[1];
        	String password = infos[1].split("=")[1];
        	
        	User user = new User();
        	user.setAcount(username);;
        	user.setPasswrod(password);
        	User returnUser = userService.findUser(user);
        	if (returnUser == null) {
        		return "-1";
        	}
        	
        	//将username存入session
        	HttpSession session = request.getSession();
        	session.setAttribute("username", username);
        	JSONObject json = new JSONObject();
        	json.put("username", returnUser.getName());
        	json.put("userid", returnUser.getId());
        	return json.toString();
        }
		return "-1";
	}
	
	/**
	 * 注册
	 * @param request
	 * @return
	 */
	@GET
	@Path("/signup")
	@Produces(MediaType.TEXT_PLAIN)
	public String register(@Context HttpServletRequest request) {
		
		String username = request.getParameter("username");
		String password = request.getParameter("password");
		String mailBox = request.getParameter("email");
		User user = new User();
		user.setName(username);
		user.setCreateTime(new Date());
		user.setMailBox(mailBox);
		user.setPasswrod(password);
		user.setAcount(username);
		userService.saveUser(user);
		User returnUser = userService.findUser(user);
		
		JSONObject json = new JSONObject();
    	json.put("username", returnUser.getName());
    	json.put("userid", returnUser.getId());
    	return json.toString();
	}
	
	/**
	 * 用户做完套题后，存贮做过的套题信息
	 * @param request
	 * @return
	 */
	@GET
	@Path("/savedonelist")
	@Produces(MediaType.TEXT_PLAIN)
	public String saveDoneList (@Context HttpServletRequest request) {
		
		String userID = request.getParameter("user_id");
		String groupID = request.getParameter("quiz_id");
		String right = request.getParameter("correct_num");
		String wrong = request.getParameter("worng_num");
		Date time = new Date();
		userService.saveDoneList(Integer.parseInt(userID), 
								Integer.parseInt(groupID), 
								Integer.parseInt(right), 
								Integer.parseInt(wrong), time);
		int score = Integer.parseInt(right) * 3;
		userService.updateScore(Integer.parseInt(userID), score);
		
		return "200";
	}
	
	/**
	 * 用户做完随机题目后，存贮做过的随机题目
	 * @param request
	 * @return
	 * @throws Exception
	 */
	@POST
	@Path("/savedonequestion")
	@Produces(MediaType.TEXT_PLAIN)
	public String saveDoneQuestion (@Context HttpServletRequest request) throws Exception {
		
		BufferedReader br = new BufferedReader(new InputStreamReader(
				(ServletInputStream) request.getInputStream()));
		String line = null;
		StringBuilder sb = new StringBuilder();
		while ((line = br.readLine()) != null) {
			sb.append(line);
		}
		JSONObject json = JSONObject.fromObject(sb.toString());
		int userID = Integer.parseInt(json.getString("user_id"));
		
		JSONArray array = JSONArray.fromObject(json.get("questionInfo"));
		int len = array.size();
		int right = 0;
		int wrong = 0;
		
		int randomID = questionService.findMaxRandomID() + 1;
		List<RandomQuestion> list = new ArrayList<RandomQuestion>();
		
		for (int i = 0; i != len; ++i) {
			JSONObject o = array.getJSONObject(i);
			int questionID = Integer.parseInt(o.getString("questionId"));
			int status = Integer.parseInt(o.getString("result"));
			if (status == 1) {
				++right;
			} else {
				++wrong;
			}
			
			RandomQuestion random = new RandomQuestion();
			random.setRandomID(randomID);
			random.setQuestionID(questionID);
			list.add(random);
			Date time = new Date();
			userService.saveDoneQuestion(userID, questionID, status, time);
		}
		
		//更新分数信息
		userService.updateScore(userID, right*3);
		
		//存储随机出现的题目
		questionService.saveRandom(list);
		
		//保存用户随机出现的套题
		questionService.saveRandomInfo(userID, randomID, new Date(), right, wrong);
		
		return "200";
	}
	
	/**
	 * 判断用户名是否存在
	 * @param request
	 * @return
	 */
	@GET
	@Path("/judgeone")
	@Produces(MediaType.TEXT_PLAIN)
	public String judgeOne(@Context HttpServletRequest request) {
		
		String username = request.getParameter("username");
		User user = null;
		
		if (username != null || !"".equals(username)) {
			user = userService.findAccount(username);
		}
		
		if (user == null) {
			
			return "200";
		} else {
			
			return "-1";
		}
		
	}
	
	/**
	 * 判断用户权限
	 * @param request
	 * @return
	 */
	@GET
	@Path("/haspower")
	@Produces(MediaType.TEXT_PLAIN)
	public String hasPower(@Context HttpServletRequest request) {
		
		HttpSession session = request.getSession();
		String username = (String)session.getAttribute("username");
		
		int power = 0;
		power = userService.findPower(username);
		if (power != 0) {
			if (power == 1) {
				return "200";
			} else if (power == 2) {
				return "300";
			}
		}
		
		return "-1";
		
	}
	
	/**
	 * 查询所有用户
	 * @param request
	 * @return
	 */
	@GET
	@Path("/findalluser")
	@Produces(MediaType.APPLICATION_JSON)
	public String findAllUser(@Context HttpServletRequest request) {
		
//		List<User> users = userService.findAllUser();
		
		return "";
	}
	
	/**
	 * 更新用户类型，成为prouser
	 * @param request
	 * @return
	 */
	@GET
	@Path("/updatetype")
	@Produces(MediaType.TEXT_PLAIN)
	public String updateType(@Context HttpServletRequest request) {
		
		return "";
	}
	
	/**
	 * 查询管理员信箱
	 * @param request
	 * @return
	 */
	@GET
	@Path("/findinfo")
	@Produces(MediaType.APPLICATION_JSON)
	public String findInfo(@Context HttpServletRequest request) {
		
		JSONArray result = new JSONArray();
		List<MailBox> informations = userService.findInfo();
		for (MailBox mailBox : informations) {
			JSONObject json = new JSONObject();
			json.put("username", mailBox.getUsername());
			json.put("information", mailBox.getInfomation());
			result.add(json);
		}
		return result.toString();
	}
	
	@GET
	@Path("/finduserinfo")
	@Produces(MediaType.APPLICATION_JSON)
	public String findUserInfo(@Context HttpServletRequest request) {
		
		String userID = request.getParameter("userId");
		
		User user = userService.findUserByID(Integer.parseInt(userID));
		JSONObject json = new JSONObject();
		json.put("username", user.getName());
		SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd");
		String time = sdf.format(user.getCreateTime());
		json.put("createTime", time);
		json.put("email", user.getMailBox());
		json.put("userIconUrl", user.getHeadImage());
		
		//获取每类下的情况
		List<Map<String, String>> list = new ArrayList<Map<String, String>> ();
		for (int i = 1; i != 6; ++i) {
			Map<String, String> result = groupQuestionService.findDoneInfo(Integer.parseInt(userID), i);
			list.add(result);
		}
		
		//查询出随机的题目
		List<Map<String, Integer>> randList = questionService.selectRandomNum(Integer.parseInt(userID));
		
		int photo = 0;
		int music = 0;
		int sport = 0;
		int film = 0;
		int science = 0;
		
		for (Map<String, Integer> map : randList) {
			switch(map.get("id")) {
			case 1: 
				sport = Integer.parseInt(String.valueOf(map.get("num")));
				break;
			case 2:
				photo = Integer.parseInt(String.valueOf(map.get("num")));
				break;
			case 3:
				music = Integer.parseInt(String.valueOf(map.get("num")));
				break;
			case 4:
				science = Integer.parseInt(String.valueOf(map.get("num")));
				break;
			case 5:
				film = Integer.parseInt(String.valueOf(map.get("num")));
				break;
			default : break;
			}
		}
		
		//
		List<Long> rate = new ArrayList<Long>();
		rate.add(Long.parseLong(String.valueOf(list.get(1).get("w"))) + 
				Long.parseLong(String.valueOf(list.get(1).get("r"))) + photo);
		rate.add(Long.parseLong(String.valueOf(list.get(2).get("w"))) + 
				Long.parseLong(String.valueOf(list.get(2).get("r"))) + music);
		rate.add(Long.parseLong(String.valueOf(list.get(0).get("w"))) + 
				Long.parseLong(String.valueOf(list.get(0).get("r"))) + sport);
		rate.add(Long.parseLong(String.valueOf(list.get(4).get("w"))) + 
				Long.parseLong(String.valueOf(list.get(4).get("r"))) + film);
		rate.add(Long.parseLong(String.valueOf(list.get(3).get("w"))) + 
				Long.parseLong(String.valueOf(list.get(3).get("r"))) + science);
		json.put("filedRate", rate);
		
		//最近做过的题组
		List<DoneInfo> doneInfos = new ArrayList<>();
		
		List<Integer> recent = new ArrayList<Integer>();
		List<Map<String, Integer>> recentDone = groupQuestionService.findDoneRecent(Integer.parseInt(userID));
		
		for (Map<String, Integer> map : recentDone) {
			int temp = map.get("r")*100/(map.get("r") + map.get("w"));
			recent.add(temp);
			
			DoneInfo doneInfo = new DoneInfo();
			doneInfo.setType(1);
			doneInfo.setAccuracy(temp);
			doneInfo.setId(map.get("groupID"));
			
			String str = String.valueOf(map.get("time"));
			sdf= new SimpleDateFormat("yyyy-MM-dd");
			Date t;
			try {
				t = sdf.parse(str);
				doneInfo.setDoTime(t);
			} catch (ParseException e) {
				e.printStackTrace();
			}
			
			GroupQuestion group = groupQuestionService.findByID(map.get("groupID"));
			doneInfo.setCreaterName(group.getCreaterName());
			doneInfo.setScopeType(TypeUtils.getTypeName(group.getId()));
			doneInfo.setName(group.getName());
			doneInfo.setUserID(map.get("userID"));
			doneInfos.add(doneInfo);
		}
		
		List<Map<String, Integer>> randomRecentDone = groupQuestionService.findRandomQuestions(Integer.parseInt(userID));
		for (Map<String, Integer> map : randomRecentDone) {
			DoneInfo doneInfo = new DoneInfo();
			
			int temp = map.get("r")*100/(map.get("r") + map.get("w"));
			doneInfo.setAccuracy(temp);
			doneInfo.setType(0);
			doneInfo.setId(map.get("randomID"));
			
			String str = String.valueOf(map.get("time"));
			sdf= new SimpleDateFormat("yyyy-MM-dd");
			Date t;
			try {
				t = sdf.parse(str);
				doneInfo.setDoTime(t);
			} catch (ParseException e) {
				e.printStackTrace();
			}
			
			doneInfo.setScopeType("");
			doneInfos.add(doneInfo);
		}
		
		json.put("accuracy", recent);
		
		JSONArray array = new JSONArray();
		for (DoneInfo doneInfo : doneInfos) {
			JSONObject j = new JSONObject();
			if (doneInfo.getType() == 1) {
				
				j.put("listName", doneInfo.getName());
				j.put("scopeType", doneInfo.getScopeType());
				j.put("createrName", doneInfo.getCreaterName());
				
				sdf = new SimpleDateFormat("yyyy-MM-dd");
				String t = sdf.format(doneInfo.getDoTime());
				j.put("doneTime", t);
				
				j.put("accuracy", doneInfo.getAccuracy());
				j.put("userId", doneInfo.getUserID());
				j.put("type", 1);
			} else {
				
				sdf = new SimpleDateFormat("yyyy-MM-dd");
				String t = sdf.format(doneInfo.getDoTime());
				j.put("doneTime", t);
				j.put("accuracy", doneInfo.getAccuracy());
				j.put("type", 0);
				j.put("scopeType", TypeUtils.getTypeName(
						questionService.findRandQuestionType(
								doneInfo.getId())));
			}
			array.add(j);
		} 
		json.put("quizRecord", array);
		return json.toString();
	}
	
	/**
	 * 获取用户头像并存储在磁盘，数据库存头像地址
	 * @param request
	 * @return
	 * @throws Exception
	 */
	@POST
	@Path("/saveuserImage")
	@Produces(MediaType.TEXT_PLAIN)
	public String saveUserImage (@Context HttpServletRequest request) throws Exception {
		
		BufferedReader br = new BufferedReader(new InputStreamReader(
				(ServletInputStream) request.getInputStream()));
		String line = null;
		StringBuilder sb = new StringBuilder();
		while ((line = br.readLine()) != null) {
			sb.append(line);
		}
		JSONObject json = JSONObject.fromObject(sb.toString());
		
		int userID = Integer.parseInt(json.getString("user_id"));
		
		//获取图片base64二进制流
		String image = json.getString("image");
		//图片文件地址
		String imagePath = null;
		
		if (image != null) {
			BASE64Decoder decoder = new BASE64Decoder();
			try {
					// Base64解码
					byte[] b = decoder.decodeBuffer(image);
					for (int i = 0; i < b.length; ++i) {
						if (b[i] < 0) {// 调整异常数据
						b[i] += 256;
					}
					imagePath = "/quizGym/userIcon/" + System.currentTimeMillis() + ".jpg";
					OutputStream os = new FileOutputStream(imagePath);
					os.write(b);
					os.flush();
					os.close();
				}
			} catch (Exception e) {
				imagePath = "/quizGym/userIcon/head.jpg";
				e.printStackTrace();
			}
		} else {
			imagePath = "/quizGym/userIcon/head.jpg";
		}
		
		//存贮用户头像地址进入数据库
		userService.updateUserHeadImage(String.valueOf(userID), imagePath);
		
		return imagePath;
	}
	
	@GET
	@Path("/test")
	@Produces(MediaType.TEXT_HTML)
	public String test(@Context HttpServletRequest request) {
		return new UserRest().findUserInfo(request);
	}
}
