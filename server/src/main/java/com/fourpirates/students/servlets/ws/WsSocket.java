package com.fourpirates.students.servlets.ws;

import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;
import java.util.UUID;

import javax.websocket.OnClose;
import javax.websocket.OnError;
import javax.websocket.OnMessage;
import javax.websocket.OnOpen;
import javax.websocket.Session;
import javax.websocket.server.ServerEndpoint;

import org.bson.Document;

import com.fourpirates.students.store.Store;
import com.google.gson.Gson;
import com.google.gson.GsonBuilder;
import com.google.gson.internal.LinkedTreeMap;
import com.idmworks.security.google.api.GoogleOAuthPrincipal;

@ServerEndpoint(value = "/studentws")
public class WsSocket {

	private String id;
	private Gson gson = new GsonBuilder().create();
	private Client client;



	@OnOpen
	public void start(Session sess) {
		id = UUID.randomUUID().toString();
		this.client = new Client(id,sess);
		WsSocketHandler.getInstance().addClient(id, this.client);
	}
	@OnClose
	public void end() {
		WsSocketHandler.getInstance().removeClient(id,false);
	}



	@OnMessage
	public void incoming(String message) {
		System.out.println("Received TEXT message: " + message+" from :"+client.getSession().getUserPrincipal());
		try {
			Map<String,Object> var = new LinkedTreeMap<String,Object>();
			var = gson.fromJson(message, Map.class);

			// this is a login event
			Object clientMessage = var.get("msg");
			if (clientMessage != null && clientMessage.equals("hello")) {
				GoogleOAuthPrincipal principal = (GoogleOAuthPrincipal)client.getSession().getUserPrincipal();
				System.out.println("hello from "+principal);
				Store.getInstance().updateClient(id);
				
				Document s = Store.getInstance().getStudentByEmail(principal.getGoogleUserInfo().getEmail());
				if (s==null) {
					Map<String,String> student = new HashMap<String,String>();
					student.put("first_name", principal.getGoogleUserInfo().getGivenName());
					student.put("last_name", principal.getGoogleUserInfo().getFamilyName());
					student.put("email", principal.getGoogleUserInfo().getEmail());
					student.put("credits", "0");
					student.put("grade", "0");
					Store.getInstance().addStudent(student);
				} else {
					SimpleDateFormat sdf = new SimpleDateFormat("yyyy/MM/dd HH:mm:ss");
					s.put("last_login", sdf.format(new Date()));
					String id = s.getObjectId("_id").toHexString();
					Store.getInstance().setStudent(id, s);
				}

			}
/*
			// this is a logout event
			Object logout = var.get("logout");
			if (logout != null) {
				WsSocketHandler.removeClientByAccessToken((String)logout);
			}
*/

		} catch (Exception e) {
			e.printStackTrace();
		}
	}

	@OnError
	public void onError(Throwable t) throws Throwable {
		t.printStackTrace(System.err);
	}
	
}
