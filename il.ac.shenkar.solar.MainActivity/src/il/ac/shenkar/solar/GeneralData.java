package il.ac.shenkar.solar;
import java.io.BufferedInputStream;
import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.net.HttpURLConnection;
import java.net.MalformedURLException;
import java.net.URL;
import java.util.ArrayList;
import java.util.Arrays;


import android.content.Context;
import android.os.AsyncTask;

public class GeneralData {

	private	static GeneralData	instance = null;	
	private	Context	context;
	
	private ArrayList<String> scenarioslist;
	private String homePage;
	private String userNPassText;
	private String senderID = "238967351"; 
	
	
	private	GeneralData(Context context)	{
		this.context = context;
		
	}
		
	public static GeneralData getInstance(Context context)	{	
		if(instance	== null) {	
			instance = new GeneralData(context);	
		}
		return instance;
	}
		
	public void populateScenariosList(){
        new GetScenarioFromServer().execute("");
	}
	
	public void setHomePage(String homePage){
		this.homePage = homePage;
	}

	public void setUserNPass(String userNPassText){
		this.userNPassText = userNPassText;
	}

	public String getHomePage(){
		return this.homePage;
	}

	public String getGCServer(){
		return this.homePage+"gcm_server_php/register.php";
	}

	public String getUserNPass(){
		return this.userNPassText;
	}

	public String getSenderId(){
		return this.senderID;
	}
	public ArrayList<String> getScenariosList(){
		return scenarioslist;
	}
	
	public class GetScenarioFromServer extends AsyncTask<String,Integer,String>{	
			
		 	@Override	
		 	protected String doInBackground(String...urls)	{
		 		 System.out.println(urls[0]);
//		 		System.out.println(housePassword);
		 		 String response;
				response = "";
				if (urls.length > 0){
					try {
						URL url	= new URL(homePage+"php/getLightsScenarions.php?name=&"+userNPassText);
						HttpURLConnection urlConnection	= (HttpURLConnection) url.openConnection();	
						InputStream in = new BufferedInputStream (urlConnection.getInputStream());	
						InputStreamReader inReader = new InputStreamReader(in);	
						BufferedReader bufferedReader =	new	BufferedReader(inReader);	
						StringBuilder responseBuilder = new	StringBuilder();	
						for	(String	line=bufferedReader.readLine();	line!=null;	line=bufferedReader.readLine()){	
							responseBuilder.append(line);	
						}	
						response = responseBuilder.toString().replace("\"","");
						response = response.replace("[","");
						response = response.replace("]","");

						System.out.println("================="+response);
					} catch (MalformedURLException e) {
						e.printStackTrace();
					} catch (IOException e) {
						e.printStackTrace();
					} 					
				}

		 		return (response);
		 		
		 	}	
		 	
		 	protected void onPostExecute(String response){
		 		scenarioslist = new  ArrayList<String>(Arrays.asList(response.split(",")));	 		
		 	}	
		 }

}