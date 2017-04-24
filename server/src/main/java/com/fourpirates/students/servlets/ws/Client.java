package com.fourpirates.students.servlets.ws;

import java.util.HashMap;
import java.util.Map;

import javax.websocket.Session;

public class Client {
	private Session session;
	private String id;
	private boolean hasDisconnected = false;
	private long lastActivity;
	private Map<String,String> currentFilters = new HashMap<String,String>(); 
	
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
	public void setFilter(String forType,String filter) {
		if (filter == null || filter.trim().length()==0)
			currentFilters.remove(forType);
		else
			currentFilters.put(forType, filter);
	}
	public String getFilterFor(String forType) {
		return currentFilters.get(forType);
	}
}
