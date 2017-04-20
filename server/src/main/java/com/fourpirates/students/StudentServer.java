package com.fourpirates.students;

public class StudentServer {
	/*
	public static void main(String[] args) {
		new StudentServer();
	}

	public StudentServer() {
		try {
			Server server = new Server(8080);

//			HashSessionIdManager idmanager = new HashSessionIdManager();
//			server.setSessionIdManager(idmanager);
			
			ServletContextHandler context = new ServletContextHandler(server,"/", ServletContextHandler.SESSIONS | ServletContextHandler.SECURITY);
			
			context.setResourceBase(".");
			context.setWelcomeFiles(new String[]{ "index.html" });
			context.addServlet(new ServletHolder(new DefaultServlet()), "/");
			
			boolean cors = true;
			if (cors) {
				FilterHolder corsFilter = context.addFilter(CrossOriginFilter.class,"/*",EnumSet.of(DispatcherType.REQUEST));
				corsFilter.setInitParameter(CrossOriginFilter.ALLOWED_ORIGINS_PARAM, "*");
				corsFilter.setInitParameter(CrossOriginFilter.ACCESS_CONTROL_ALLOW_ORIGIN_HEADER, "*");
				corsFilter.setInitParameter(CrossOriginFilter.ALLOWED_METHODS_PARAM, "GET,PUT,POST,HEAD,DELETE");
				corsFilter.setInitParameter(CrossOriginFilter.ALLOWED_HEADERS_PARAM, 
						"Accept,Accept-Version,Authorization,Content-Length,Content-MD5,Content-Type,Date,"
								+ "Origin,X-Access-Token,X-Api-Version,X-CSRF-Token,X-File-Name,X-Requested-With");
			}
			context.addServlet(ItemServlet.class, "/item");
			context.addServlet(StudentServlet.class, "/student");
			context.addServlet(AuthServlet.class, "/auth");
			
			ServletHolder holderEvents = new ServletHolder("ws-events", WsSocketHandler.class);
	        context.addServlet(holderEvents, "/studentws/*");

			server.setHandler(context);

			server.start();
			server.dumpStdErr();
			server.join();

		} catch (Exception e) {
			e.printStackTrace();
		}
	}
*/

}
