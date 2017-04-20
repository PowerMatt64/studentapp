package com.fourpirates.students.servlets.ws;

import javax.websocket.Session;

public class Client {
	private Session session;
	private String id;
	private boolean hasDisconnected = false;
	private long lastActivity;
	
	public Client(String id, Session session) {
		this.session = session;
		this.id = id;
		this.lastActivity = System.currentTimeMillis();
	}
	public void disconnect() {
		hasDisconnected = true;
	}
	public boolean isDisconnected() {
		return hasDisconnected;
	}
	public Session getSession() {
		return session;
	}
	public String getId() {
		return id;
	}
	public long getLastActivity() {
		return lastActivity;
	}
}
