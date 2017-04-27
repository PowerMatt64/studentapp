package com.fourpirates.students.servlets.ws;

import java.util.Collection;
import java.util.List;
import java.util.Map;
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
					System.out.println("update recvd");
					try {
						String items = getItems(null);
						String auction = getAuction(null);
						String students = getStudents(null);
						String leaderBoard = getLeaderboard(null);
						for (Client s : clients.values()) {
							if (s.getSession().isOpen()) {
								if (s.getFilterFor("items")!=null) items = getItems(s.getFilterFor("items"));
								if (s.getFilterFor("students")!=null) students = getStudents(s.getFilterFor("students"));
								if (s.getFilterFor("auction")!=null) auction = getAuction(s.getFilterFor("auction"));
								if (type.equalsIgnoreCase("item"))
									s.getSession().getBasicRemote().sendText(items);
								else if (type.equalsIgnoreCase("auction")){
									s.getSession().getBasicRemote().sendText(auction);
								} else if (type.equalsIgnoreCase("student")){
									s.getSession().getBasicRemote().sendText(students);
									s.getSession().getBasicRemote().sendText(leaderBoard);
								}else if (type.startsWith("updateClient") && s.getId().equals(type.substring(13))) {
									s.getSession().getBasicRemote().sendText(students);
									s.getSession().getBasicRemote().sendText(auction);
									s.getSession().getBasicRemote().sendText(leaderBoard);
									s.getSession().getBasicRemote().sendText(items);
								} else
									System.out.println("Unknown Queue Event");
							} else {
								if ((System.currentTimeMillis() - s.getLastActivity())>2*60*1000 ) {// kill unauth session>2 mins old
									clients.remove(s.getId());
									System.out.println("Killing Session For Access "+s.getId());
								}
							}
						}
					} catch (Exception e) {
						e.printStackTrace();
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

	private String getAuction(String filter) throws Exception {
		return getListAsJson("auction",Store.getInstance().getAuction(filter));
	}
	private String getStudents(String filter) throws Exception {
		return getListAsJson("students",Store.getInstance().getStudents(filter));
	}
	private String getLeaderboard(String filter) throws Exception{
		return getListAsJson("leaderboard",Store.getInstance().getLeaderboard(filter));
	}
	private String getItems(String filter) throws Exception {
		return getListAsJson("items",Store.getInstance().getItems(filter));
	}

	private String getListAsJson(String typeName, List<Map<String, Object>> emap) {
		StringBuilder map = new StringBuilder();
		map.append("{\"a\":\""+typeName+"\",\"items\":[");
		int c=0;
		for (Map<String, Object> se:emap) {
			if (c>0) map.append(',');
			map.append(gson.toJson(se));
			c++;
		}
		map.append("]}");
		return map.toString();
	}

}
