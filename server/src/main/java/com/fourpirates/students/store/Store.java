package com.fourpirates.students.store;

import java.text.SimpleDateFormat;
import java.util.Date;
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

	private MongoCollection<Document> students;
	private MongoCollection<Document> items;

	private BlockingQueue<String> QUEUE = new ArrayBlockingQueue<String>(5000);

	private static final Store INSTANCE = new Store();
	
	public static Store getInstance(){return INSTANCE;}
	
	private Store() {
		MongoClient mongoClient = new MongoClient(new MongoClientURI("mongodb://127.0.0.1:27017"));
		MongoDatabase database = mongoClient.getDatabase("cactus");

		students = database.getCollection("students");
		items = database.getCollection("items");
		
	}

	public void removeItem(String id) throws Exception {
		items.findOneAndDelete(new Document().append("_id", new ObjectId(id)));
		QUEUE.put("item");
	}
	
	public void removeStudent(String id) throws Exception {
		students.findOneAndDelete(new Document().append("_id", new ObjectId(id)));
		QUEUE.put("student");
	}
	
	public String addStudent(Map<String,String> pstudent) throws Exception {
		Document student = new Document();
		student.putAll(pstudent);
		SimpleDateFormat sdf = new SimpleDateFormat("yyyy/MM/dd HH:mm:ss");
		student.put("last_login", sdf.format(new Date()));
		students.insertOne(student);
		String id = student.getObjectId("_id").toHexString();
		QUEUE.put("student");
		return id;
	}

	public String addItem(Map<String,String> pitem) throws Exception {
		Document item = new Document();
		item.putAll(pitem);
		items.insertOne(item);
		String id = item.getObjectId("_id").toHexString();
		QUEUE.put("item");
		return id;
	}
	public void updateClient(String clientId) throws Exception {
		QUEUE.put("updateClient:"+clientId);
	}	
	
	public String waitUpdate() throws InterruptedException {
		return QUEUE.take();
	}
	
	public String setStudent(String id,Map<String,String> student) throws Exception {
		Document updatedStudent = new Document();
		updatedStudent.putAll(student);
		return setStudent(id,updatedStudent);
	}
	public String setStudent(String id,Document student) throws Exception {
		students.findOneAndReplace(new Document().append("_id", new ObjectId(id)),student);
		QUEUE.put("student");
		return id;
	}

	public String setItem(String id,Map<String,String> item) throws Exception {
		Document updatedItem = new Document();
		updatedItem.putAll(item);
		items.findOneAndReplace(new Document().append("_id", new ObjectId(id)),updatedItem);
		QUEUE.put("item");
		return id;
	}
	
	public Map<String,Map<String,Object>> getStudents() {
		return getCollection(students);
	}
	public Map<String,Map<String,Object>> getLeaderboard() {
		return getCollection(students);
	}
	public Map<String,Map<String,Object>> getItems() {
		return getCollection(items);
	}
	
	private Map<String,Map<String,Object>> getCollection(MongoCollection<Document> collection) {
		Map<String,Map<String,Object>> returnMap = new HashMap<String,Map<String,Object>>();
		for(Document d:collection.find()){
			Map<String,Object> r=new HashMap<String,Object>();
			for (Entry<String, Object> r2:d.entrySet()) {
				r.put(r2.getKey(),r2.getValue());
			}
			r.put("id", d.getObjectId("_id").toHexString());
			returnMap.put(d.getObjectId("_id").toHexString(), r);
		}
		
		return returnMap;
	}
	
	public Document getStudentByEmail(String email) {
		for (Document s:students.find(new Document().append("email", email))) {
			return s;
		}
		return null;
	}
	
}
