package com.fourpirates.students.servlets;

import java.io.IOException;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import com.fourpirates.students.servlets.ws.Client;
import com.fourpirates.students.servlets.ws.WsSocketHandler;

public class AuthServlet extends HttpServlet {
	@Override
	protected void doGet( HttpServletRequest request, HttpServletResponse response ) throws ServletException,IOException  {
		String accessToken = request.getParameter("at");
		String returnJson = "{\"iv\":false}";
		if (accessToken!=null) {
			System.out.println(WsSocketHandler.getClients());
			for (Client c:WsSocketHandler.getClients()) {
				System.out.println("client: "+c.getAccessToken());
				if (c.getAccessToken().equals(accessToken)) {
					returnJson = "{\"iv\":true}";
				}
			}
		}
		response.setContentType("application/json");
		response.setStatus(HttpServletResponse.SC_OK);
		response.getWriter().println(returnJson);
		response.getWriter().flush();
	}
}
