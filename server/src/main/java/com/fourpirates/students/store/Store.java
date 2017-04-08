package com.fourpirates.students.store;

import java.util.HashMap;
import java.util.Map;
import java.util.UUID;
import java.util.concurrent.ArrayBlockingQueue;
import java.util.concurrent.BlockingQueue;

public class Store {
	private Map<String,Map<String,String>> STUDENTS = new HashMap<String,Map<String,String>>();
	private BlockingQueue<String> QUEUE = new ArrayBlockingQueue<String>(5000);

	private static final Store INSTANCE = new Store();
	
	public static Store getInstance(){return INSTANCE;}
	
	private Store() {
		// load dummy data
		Map<String,String> s = new HashMap<String,String>();
		s.put("first_name", "Dave");
		s.put("last_name", "Evans");
		String id = UUID.randomUUID().toString();
		STUDENTS.put(id,s);
	}
	
	public void removeStudent(String id) throws Exception {
		STUDENTS.remove(id);
		QUEUE.put(id);
	}
	public String addStudent(Map<String,String> student) throws Exception {
		String id = UUID.randomUUID().toString();
		STUDENTS.put(id,student);
		QUEUE.put(id);
		return id;
	}
	public String setStudent(String id,Map<String,String> student) throws Exception {
		STUDENTS.put(id,student);
		QUEUE.put(id);
		return id;
	}
	
	public String waitUpdate() throws InterruptedException {
		return QUEUE.take();
	}
	
	public Map<String,Map<String,String>> getStudents() {
		return STUDENTS;
	}
	
}
