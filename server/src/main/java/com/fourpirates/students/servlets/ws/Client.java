package com.fourpirates.students.servlets.ws;

import org.eclipse.jetty.websocket.api.Session;

public class Client {
	private Session session;
	private String accessToken;
	private String id;
	
	public Client(String id, Session session) {
		this.session = session;
		this.id = id;
	}
	public void setAccessToken(String accessToken) {
		this.accessToken=accessToken;
	}
	public boolean isAuthenticated() {
		if (accessToken!=null)
			return true;
		return false;
	}
	public Session getSession() {
		return session;
	}
	public String getId() {
		return id;
	}

}
