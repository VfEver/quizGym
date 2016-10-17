package com.quizGym.rest;

import javax.servlet.http.HttpServletRequest;
import javax.ws.rs.GET;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.core.Context;
import javax.ws.rs.core.MediaType;

import com.quizGym.entity.Type;
import com.quizGym.service.ITypeService;

/**
 * restful层
 * @author zys
 *
 */
@Path("/typerest")
public class TypeRest {
	
	private ITypeService typeService;
	public void setTypeService(ITypeService typeService) {
		this.typeService = typeService;
	}
	
	@GET
	@Path("/addType")
	@Produces(MediaType.TEXT_PLAIN)
	public String addType(@Context HttpServletRequest request) {
		String type = request.getParameter("type");
		Type types = new Type();
		types.setName(type);
		typeService.save(types);
		return type;
	}
}
