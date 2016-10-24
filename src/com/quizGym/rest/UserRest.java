package com.quizGym.rest;

import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.util.Date;

import javax.servlet.ServletInputStream;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;
import javax.ws.rs.GET;
import javax.ws.rs.POST;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.core.Context;
import javax.ws.rs.core.MediaType;

import com.quizGym.entity.User;
import com.quizGym.service.IUserService;
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
	@Produces(MediaType.TEXT_PLAIN)
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
        	return "200";
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
		return "200";
	}
}
