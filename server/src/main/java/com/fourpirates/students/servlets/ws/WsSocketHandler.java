package com.fourpirates.students.servlets.ws;

import java.util.Collection;
import java.util.Map;
import java.util.Map.Entry;
import java.util.concurrent.ConcurrentHashMap;

import com.fourpirates.students.store.Store;
import com.google.gson.Gson;
import com.google.gson.GsonBuilder;

public class WsSocketHandler implements Runnable {

	private static final WsSocketHandler INSTANCE = new WsSocketHandler();
	
	public static WsSocketHandler getInstance(){return INSTANCE;}
	
	private ConcurrentHashMap<String,Client> clients = new ConcurrentHashMap<String,Client>();
	private Gson gson = new GsonBuilder().create();

	public WsSocketHandler() {
		Thread t = new Thread(this);
		t.start();	
	}
	public void run() {
		boolean isRunning = true;

		try {
			while (isRunning) {
				try {

					String type = Store.getInstance().waitUpdate();

					for (Client s : clients.values()) {

						if (s.getSession().isOpen()) {
							if (type.equalsIgnoreCase("item"))
								s.getSession().getBasicRemote().sendText(getItems());
							else if (type.equalsIgnoreCase("student")){
								s.getSession().getBasicRemote().sendText(getStudents());
								s.getSession().getBasicRemote().sendText(getLeaderboard());
							}else if (type.startsWith("updateClient") && s.getId().equals(type.substring(13))) {
								s.getSession().getBasicRemote().sendText(getStudents());
								s.getSession().getBasicRemote().sendText(getLeaderboard());
								s.getSession().getBasicRemote().sendText(getItems());
							} else
								System.out.println("Unknown Queue Event");
						} else {
							if ((System.currentTimeMillis() - s.getLastActivity())>2*60*1000 ) {// kill unauth session>2 mins old
								clients.remove(s.getId());
								System.out.println("Killing Session For Access "+s.getId());
							}
						}
					}

					Thread.sleep(2000);
				} catch (Exception e) {
					isRunning = false;
				}
			}

		} catch (Exception e) {
			e.printStackTrace();
		}
	}

	public Collection<Client> getClients() {
		return clients.values();
	}

	public void addClient(String clientId, Client client) {
		clients.put(clientId, client);
	}
	public void removeClient(String clientId,boolean loggedOut) {
		if (loggedOut)
			clients.remove(clientId);
		else
			clients.get(clientId).disconnect();
	}

	private String getStudents() {
		return getMapAsJson("students",Store.getInstance().getStudents());
	}
	private String getLeaderboard() {
		return getMapAsJson("leaderboard",Store.getInstance().getLeaderboard());
	}
	private String getItems() {
		return getMapAsJson("items",Store.getInstance().getItems());
	}

	private String getMapAsJson(String typeName, Map<String, Map<String, Object>> emap) {
		StringBuilder map = new StringBuilder();
		map.append("{\"a\":\""+typeName+"\",\"items\":[");
		int c=0;
		for (Entry<String, Map<String, Object>> se:emap.entrySet()) {
			if (c>0) map.append(',');
			map.append(gson.toJson(se.getValue()));
			c++;
		}
		map.append("]}");
		return map.toString();
	}

}
