package com.fourpirates.students.store;

import java.util.HashMap;
import java.util.Map;
import java.util.Map.Entry;
import java.util.concurrent.ArrayBlockingQueue;
import java.util.concurrent.BlockingQueue;

import org.bson.Document;
import org.bson.types.ObjectId;

import com.mongodb.MongoClient;
import com.mongodb.MongoClientURI;
import com.mongodb.client.MongoCollection;
import com.mongodb.client.MongoDatabase;

public class Store {
	//private Map<String,Map<String,String>> STUDENTS = new HashMap<String,Map<String,String>>();
	private MongoCollection<Document> students;
	private BlockingQueue<String> QUEUE = new ArrayBlockingQueue<String>(5000);

	private static final Store INSTANCE = new Store();
	
	public static Store getInstance(){return INSTANCE;}
	
	private Store() {
		MongoClient mongoClient = new MongoClient(new MongoClientURI("mongodb://localhost:27017"));
		MongoDatabase database = mongoClient.getDatabase("cactus");

		students = database.getCollection("students");
		
	}
	
	public void removeStudent(String id) throws Exception {
		students.findOneAndDelete(new Document().append("_id", new ObjectId(id)));
		//STUDENTS.remove(id);
		QUEUE.put(id);
	}
	public String addStudent(Map<String,String> pstudent) throws Exception {
		Document student = new Document();
		student.putAll(pstudent);
		students.insertOne(student);
		String id = student.getObjectId("_id").toHexString();
		QUEUE.put(id);
		return id;
	}
	public String setStudent(String id,Map<String,String> student) throws Exception {
		//STUDENTS.put(id,student);
		QUEUE.put(id);
		return id;
	}
	
	public String waitUpdate() throws InterruptedException {
		return QUEUE.take();
	}
	
	public Map<String,Map<String,Object>> getStudents() {
		Map<String,Map<String,Object>> returnMap = new HashMap<String,Map<String,Object>>();
		for(Document d:students.find()){
			Map<String,Object> r=new HashMap<String,Object>();
			for (Entry<String, Object> r2:d.entrySet()) {
				r.put(r2.getKey(),r2.getValue());
			}
			returnMap.put(d.getObjectId("_id").toHexString(), r);
		}
		
		return returnMap;
	}
	
}
