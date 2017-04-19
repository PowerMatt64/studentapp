package com.fourpirates.students.servlets.ws;

import java.util.Map;
import java.util.UUID;

import org.eclipse.jetty.websocket.api.Session;
import org.eclipse.jetty.websocket.api.WebSocketAdapter;

import com.fourpirates.students.store.Store;
import com.google.gson.Gson;
import com.google.gson.GsonBuilder;
import com.google.gson.internal.LinkedTreeMap;


public class WsSocket extends WebSocketAdapter {

	private String id;
	private Gson gson = new GsonBuilder().create();
	private Client client;

	@Override
	public void onWebSocketConnect(Session sess) {
		super.onWebSocketConnect(sess);
		id = UUID.randomUUID().toString();
		System.out.println("Socket Connected: " + sess);
		this.client = new Client(id,sess);
		WsSocketHandler.addClient(id, this.client);
		
		System.out.println("sc:"+WsSocketHandler.getClients());
	}

	@Override
	public void onWebSocketText(String message)  {
		System.out.println("Received TEXT message: " + message);
		super.onWebSocketText(message);
		try {
			Map<String,Object> var = new LinkedTreeMap<String,Object>();
			var = gson.fromJson(message, Map.class);

			// this is a login event
			Object accessToken = var.get("access_token");
			if (accessToken != null) {
				this.client.setAccessToken((String)accessToken);
				Store.getInstance().updateClient(id);
			}

			// this is a logout event
			Object logout = var.get("logout");
			if (logout != null) {
				WsSocketHandler.removeClientByAccessToken((String)logout);
			}

		
		} catch (Exception e) {
			e.printStackTrace();
		}
	}

	@Override
	public void onWebSocketClose(int statusCode, String reason) {
		super.onWebSocketClose(statusCode,reason);
		System.out.println("Socket Closed: [" + statusCode + "] " + reason);
		WsSocketHandler.removeClient(id,false);
	}

	@Override
	public void onWebSocketError(Throwable cause) {
		super.onWebSocketError(cause);
		cause.printStackTrace(System.err);
	}
}
