package com.quizGym.rest;

import java.util.Date;

import javax.servlet.http.HttpServletRequest;
import javax.ws.rs.GET;
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
	@GET
	@Path("/saveUser")
	@Produces(MediaType.APPLICATION_JSON)
	public String saveUser(@Context HttpServletRequest request) {
		String username = request.getParameter("username");
		String password = request.getParameter("password");
		
		return "hello";
	}
	
	@GET
	@Path("/findUser")
	@Produces(MediaType.TEXT_PLAIN)
	public String findUser(@Context HttpServletRequest request) {
		
		return "hello";
	}
	
	@GET
	@Path("/loginSuccess")
	@Produces(MediaType.TEXT_PLAIN)
	public String login(@Context HttpServletRequest request) {
		String username = request.getParameter("username");
		String password = request.getParameter("password");
		User user = new User();
		user.setAcount(username);;
		user.setPasswrod(password);
		User returnUser = userService.findUser(user);
		if (returnUser == null) {
			return "-1";
		}
		return "200";
	}
	
	
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
