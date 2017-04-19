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
	}

	@Override
	public void onWebSocketText(String message)  {
		System.out.println("Received TEXT message: " + message);
		super.onWebSocketText(message);
		try {
			Map<String,String> var = new LinkedTreeMap<String,String>();
			var = gson.fromJson(message, Map.class);
			String accessToken = var.get("access_token");

			// this is a login event
			if (accessToken != null) {
				this.client.setAccessToken(accessToken);
				Store.getInstance().updateClient(id);
			}
		} catch (Exception e) {
			e.printStackTrace();
		}
	}

	@Override
	public void onWebSocketClose(int statusCode, String reason) {
		super.onWebSocketClose(statusCode,reason);
		System.out.println("Socket Closed: [" + statusCode + "] " + reason);
		WsSocketHandler.removeClient(id);
	}

	@Override
	public void onWebSocketError(Throwable cause) {
		super.onWebSocketError(cause);
		cause.printStackTrace(System.err);
	}
}
