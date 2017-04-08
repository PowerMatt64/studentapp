package com.fourpirates.students;

import java.io.IOException;
import java.lang.reflect.Type;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;

import com.google.gson.Gson;
import com.google.gson.reflect.TypeToken;

public class Util {
	public static Map<String,String> getParms(HttpServletRequest request) throws IOException {
		StringBuilder sb = new StringBuilder();
		String l = request.getReader().readLine();
		while (l!=null) {
			sb.append(l);
			l = request.getReader().readLine();
		}
		Type mapType = new TypeToken<Map<String,String>>(){}.getType();
		Gson gson = new Gson();
		return gson.fromJson(sb.toString(), mapType);
	}

}
