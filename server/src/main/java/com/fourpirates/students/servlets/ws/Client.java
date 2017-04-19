package com.fourpirates.students.servlets.ws;

import org.eclipse.jetty.websocket.api.Session;

public class Client {
	private Session session;
	private String accessToken;
	private String id;
	private boolean hasDisconnected = false;
	
	public Client(String id, Session session) {
		this.session = session;
		this.id = id;
	}
	public void disconnect() {
		hasDisconnected = true;
	}
	public boolean isDisconnected() {
		return hasDisconnected;
	}
	public void setAccessToken(String accessToken) {
		this.accessToken=accessToken;
	}
	public boolean isAuthenticated() {
		if (accessToken!=null)
			return true;
		return false;
	}
	public String getAccessToken() {
		return accessToken;
	}
	public Session getSession() {
		return session;
	}
	public String getId() {
		return id;
	}

}
