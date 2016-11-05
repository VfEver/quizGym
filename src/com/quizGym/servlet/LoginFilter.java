package com.quizGym.servlet;

import java.io.IOException;

import javax.servlet.Filter;
import javax.servlet.FilterChain;
import javax.servlet.FilterConfig;
import javax.servlet.ServletException;
import javax.servlet.ServletRequest;
import javax.servlet.ServletResponse;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

public class LoginFilter extends HttpServlet implements Filter {

	private static final long serialVersionUID = 1L;

	@Override
	public void doFilter(ServletRequest req, ServletResponse resp,
			FilterChain chain) throws IOException, ServletException {
		
		HttpServletRequest request = (HttpServletRequest) req;
		HttpServletResponse response = (HttpServletResponse) resp;
		HttpSession session = request.getSession(false);
		String url = request.getRequestURL().toString();
		System.out.println(url);
		System.out.println(request.getQueryString());
		if (url.contains("login") || url.contains("logout")) {
			chain.doFilter(request, response);
			return ;
		}
		
		String path = "#/userlogin";
		if (session != null) {
			String username = (String)session.getAttribute("username");
			if (username == null) {
				request.getRequestDispatcher(path).forward(request, response);
			} else {
				chain.doFilter(request, response);
			}
		} else {
			request.getRequestDispatcher(path).forward(request, response);
		}
		
	}

	@Override
	public void init(FilterConfig arg0) throws ServletException {
		super.init();
	}

}
