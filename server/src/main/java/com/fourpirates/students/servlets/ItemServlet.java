package com.fourpirates.students.servlets;

import java.io.IOException;
import java.util.Map;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import com.fourpirates.students.Util;
import com.fourpirates.students.store.Store;

@SuppressWarnings("serial")
public class ItemServlet extends HttpServlet {

	@Override
	protected void doDelete(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {

		try {
			String id = request.getParameter("id");
			Store.getInstance().removeItem(id);
		} catch (Exception e) {
			e.printStackTrace();
		}
		
		response.setContentType("application/json");
		response.setStatus(HttpServletResponse.SC_OK);
		response.getWriter().println("{\"success\": true}");
	}

	@Override
	protected void doPost( HttpServletRequest request, HttpServletResponse response ) throws ServletException,IOException  {
		Map<String,String> parmMap = Util.getParms(request);
		try {
			if (parmMap.get("id").equals("-1")) {
				Store.getInstance().addItem(parmMap);
			} else {
				Store.getInstance().setItem(parmMap.get("id"),parmMap);
			}
		} catch (Exception e) {
			e.printStackTrace();
		}
		response.setContentType("application/json");
		response.setStatus(HttpServletResponse.SC_OK);
		response.getWriter().println("{\"success\": true}");
	}
/*
	@Override
	protected void doGet( HttpServletRequest request, HttpServletResponse response ) throws ServletException,IOException  {
		response.setContentType("application/json");
		response.setStatus(HttpServletResponse.SC_OK);

		response.getWriter().println("{\"items\": [");


		response.getWriter().println("]}");
		response.getWriter().flush();
	}
*/
}
