package com.fourpirates.students.store;

import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Map.Entry;
import java.util.concurrent.ArrayBlockingQueue;
import java.util.concurrent.BlockingQueue;

import org.bson.Document;
import org.bson.types.ObjectId;

import com.mongodb.BasicDBObject;
import com.mongodb.MongoClient;
import com.mongodb.MongoClientURI;
import com.mongodb.client.FindIterable;
import com.mongodb.client.MongoCollection;
import com.mongodb.client.MongoDatabase;
import com.mongodb.client.model.Sorts;

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
		student.put("credits", new Integer(0));
		students.insertOne(student);
		String id = student.getObjectId("_id").toHexString();
		QUEUE.put("student");
		return id;
	}

	public String addItem(Map<String,String> pitem) throws Exception {
		Document item = new Document();
		item.putAll(pitem);
		item.put("owner", "House");
		item.put("current_bid", 0);
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
		// earlier versions had credits as string - 
		Object credits = student.get("credits");
		if (credits instanceof String)
			student.put("credits", new Integer((String)credits));
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
	
	public List<Map<String,Object>> getStudents(String filterString) throws Exception{
		BasicDBObject filter = new BasicDBObject();
		if (filterString!=null) {
			List<BasicDBObject> orItems = new ArrayList<BasicDBObject>();
			orItems.add(new BasicDBObject("first_name", new BasicDBObject("$regex", ".*"+filterString+".*").append("$options", "i")));
			orItems.add(new BasicDBObject("last_name", new BasicDBObject("$regex", ".*"+filterString+".*").append("$options", "i")));
			orItems.add(new BasicDBObject("email", new BasicDBObject("$regex", ".*"+filterString+".*").append("$options", "i")));
			filter.put("$or", orItems);
		}
		return getCollection(students,filter,"email",true);
	}
	public List<Map<String,Object>> getLeaderboard(String filterString) throws Exception{
		BasicDBObject filter = new BasicDBObject();
		return getCollection(students,filter, "credits",false);
	}
	public List<Map<String,Object>> getItems(String filterString) throws Exception{
		BasicDBObject filter = new BasicDBObject();
		if (filterString!=null) {
			filter.put("name", new BasicDBObject("$regex", ".*"+filterString+".*").append("$options", "i"));
		}
		return getCollection(items,filter);
	}
	public List<Map<String,Object>> getAuction(String filterString) throws Exception{
		BasicDBObject filter = new BasicDBObject();
		if (filterString!=null) {
			filter.put("name", new BasicDBObject("$regex", ".*"+filterString+".*").append("$options", "i"));
		}
		return getCollection(items,filter);
	}
	
	private List<Map<String,Object>> getCollection(MongoCollection<Document> collection, BasicDBObject filter) throws Exception{
		return getCollection(collection,filter, null,null);
	}
	private List<Map<String,Object>> getCollection(MongoCollection<Document> collection,BasicDBObject filter, String sortField, Boolean isAscending) throws Exception {
		List<Map<String,Object>> returnMap = new ArrayList<Map<String,Object>>();
		FindIterable<Document> findResults = null;
		System.out.println("getting collection");
		if (sortField==null) {
			findResults = collection.find(filter);
		} else {
			if (isAscending)
				findResults = collection.find(filter).sort(Sorts.ascending(sortField));
			else
				findResults = collection.find(filter).sort(Sorts.descending(sortField));
		}
		for(Document d:findResults){
			System.out.println("got:"+d);
			Map<String,Object> r=new HashMap<String,Object>();
			for (Entry<String, Object> r2:d.entrySet()) {
				r.put(r2.getKey(),r2.getValue());
			}
			r.put("id", d.getObjectId("_id").toHexString());
			returnMap.add(r);
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
