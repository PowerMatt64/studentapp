package com.fourpirates.students.servlets;

import java.io.IOException;
import java.util.Map;
import java.util.Map.Entry;
import java.util.concurrent.CopyOnWriteArrayList;

import javax.servlet.annotation.WebServlet;

import org.eclipse.jetty.client.HttpClient;
import org.eclipse.jetty.websocket.api.Session;
import org.eclipse.jetty.websocket.api.WebSocketListener;
import org.eclipse.jetty.websocket.servlet.ServletUpgradeRequest;
import org.eclipse.jetty.websocket.servlet.ServletUpgradeResponse;
import org.eclipse.jetty.websocket.servlet.WebSocketCreator;
import org.eclipse.jetty.websocket.servlet.WebSocketServlet;
import org.eclipse.jetty.websocket.servlet.WebSocketServletFactory;

import com.fourpirates.students.store.Store;
import com.google.gson.Gson;
import com.google.gson.GsonBuilder;

@SuppressWarnings("serial")
@WebServlet(name = "Ws WebSocket Servlet", urlPatterns = { "/ws" })
public class WsSocket extends WebSocketServlet implements WebSocketListener,Runnable {

	private Gson gson = new GsonBuilder().create();
	private CopyOnWriteArrayList<Session> clients = new CopyOnWriteArrayList<Session>();

	private String lastSent;

	public WsSocket() {

		Thread t = new Thread(this);
		t.start();		
	}

	@Override
	public void configure(WebSocketServletFactory factory) {
		factory.setCreator(new WebSocketCreator() {

			public Object createWebSocket(ServletUpgradeRequest req, ServletUpgradeResponse resp) {
				// resp.setAcceptedSubProtocol("binary");
				return WsSocket.this;
			}
		});
	}

	public void run() {
		boolean isRunning = true;

		HttpClient httpClient = new HttpClient();
		httpClient.setFollowRedirects(false);

		try {
			httpClient.start();
			while (isRunning) {
				try {

					String newId = Store.getInstance().waitUpdate();

					for (Session s : clients) {
						if (s.isOpen()) {
							s.getRemote().sendString(getStudents());
							//s.getRemote().sendString("{\"a\":\"update\",\"id\":\""+newId+"\"}");
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
			httpClient.stop();
		} catch (Exception e) {
			e.printStackTrace();
		}
	}

	public void onWebSocketClose(int paramInt, String reason) {
		System.out.println("onWebSocketClose:"+paramInt+"("+reason+")");
	}

	private String getStudents() {
		StringBuilder map = new StringBuilder();
		map.append("{\"a\":\"load\",\"items\":[");
		int c=0;
		for (Entry<String, Map<String, String>> se:Store.getInstance().getStudents().entrySet()) {
			if (c>0) map.append(',');
			map.append("{");
			map.append("\"id\":"+gson.toJson(se.getKey())+",");
			map.append("\"first_name\":"+gson.toJson(se.getValue().get("first_name"))+",");
			map.append("\"last_name\":"+gson.toJson(se.getValue().get("last_name")));
			map.append("}");
			c++;
		}
		map.append("]}");
		return map.toString();
	}
	
	public void onWebSocketConnect(Session session) {
		try {
			session.getRemote().sendString(getStudents());
		} catch (IOException e) {
			e.printStackTrace();
		}
		clients.add(session);
	}

	public void onWebSocketError(Throwable err) {
		err.printStackTrace();
	}

	public void onWebSocketBinary(byte[] arg0, int arg1, int arg2) {
		System.out.println("onWebSocketBinary");
	}

	public void onWebSocketText(String text) {
		System.out.println("onWebSocketText:"+text);
	}
}
