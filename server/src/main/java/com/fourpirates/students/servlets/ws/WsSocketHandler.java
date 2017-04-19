package com.fourpirates.students.servlets.ws;

import java.util.Map;
import java.util.Map.Entry;
import java.util.concurrent.ConcurrentHashMap;

import javax.servlet.annotation.WebServlet;

import org.eclipse.jetty.websocket.servlet.WebSocketServlet;
import org.eclipse.jetty.websocket.servlet.WebSocketServletFactory;

import com.fourpirates.students.store.Store;
import com.google.gson.Gson;
import com.google.gson.GsonBuilder;

@SuppressWarnings("serial")
@WebServlet(name = "Ws WebSocket Servlet", urlPatterns = { "/ws" })
public class WsSocketHandler extends WebSocketServlet implements Runnable {

	private static ConcurrentHashMap<String,Client> clients = new ConcurrentHashMap<String,Client>();
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
						if (s.getSession().isOpen() && s.isAuthenticated()) {
							if (type.equalsIgnoreCase("item"))
								s.getSession().getRemote().sendString(getItems());
							else if (type.equalsIgnoreCase("student"))
								s.getSession().getRemote().sendString(getStudents());
							else if (type.startsWith("updateClient") && s.getId().equals(type.substring(13))) {
								s.getSession().getRemote().sendString(getStudents());
								s.getSession().getRemote().sendString(getItems());
							} else
								System.out.println("Unknown Queue Event");
						} else {
							System.out.println("Removing "+s);
							clients.remove(s);
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

	@Override
	public void configure(WebSocketServletFactory factory) {
		factory.register(WsSocket.class);
	}

	public static void addClient(String clientId, Client client) {
		clients.put(clientId, client);
	}
	public static void removeClient(String clientId) {
		clients.remove(clientId);
	}
	private String getStudents() {
		return getMapAsJson("students",Store.getInstance().getStudents());
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
