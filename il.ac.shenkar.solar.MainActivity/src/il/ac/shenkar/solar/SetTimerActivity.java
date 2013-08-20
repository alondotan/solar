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
import java.util.Calendar;
import java.util.List;

import il.ac.shenkar.solar.GeneralData.GetScenarioFromServer;

import android.os.AsyncTask;
import android.os.Bundle;
import android.app.Activity;
import android.view.Menu;
import android.view.View;
import android.widget.ArrayAdapter;
import android.widget.Button;
import android.widget.Spinner;
import android.widget.TextView;
import android.widget.TimePicker;

public class SetTimerActivity extends Activity {

	private GeneralData gd;
	private TextView tvDisplayTime;
	private TimePicker timePicker1;
	private Button btnChangeTime;
	private Spinner spinner;
	 
	private int hour;
	private int minute;
 
	String params= "";
	static final int TIME_DIALOG_ID = 999;
 
	@Override
	public void onCreate(Bundle savedInstanceState) {
		super.onCreate(savedInstanceState);
		setContentView(R.layout.activity_set_timer);
 
		gd = GeneralData.getInstance(this);
		setCurrentTimeOnView();
		addItemsOnSpinner();
//		addListenerOnButton();
 
	}
 
	// display current time
	public void setCurrentTimeOnView() {
 
//		tvDisplayTime = (TextView) findViewById(R.id.tvTime);
		timePicker1 = (TimePicker) findViewById(R.id.timePicker1);
 
		final Calendar c = Calendar.getInstance();
		hour = c.get(Calendar.HOUR_OF_DAY);
		minute = c.get(Calendar.MINUTE);
 
//		// set current time into textview
//		tvDisplayTime.setText(
//                    new StringBuilder().append(pad(hour))
//                                       .append(":").append(pad(minute)));
// 
		// set current time into timepicker
		timePicker1.setCurrentHour(hour);
		timePicker1.setCurrentMinute(minute);
 
	}
 
	public void addItemsOnSpinner() {
		 
		spinner = (Spinner) findViewById(R.id.senarios_spinner);
		List<String> list = new ArrayList<String>();
		list.add("list 1");
		list.add("list 2");
		list.add("list 3");
		ArrayList<String> scenarioslist = gd.getScenariosList();
		
		ArrayAdapter<String> dataAdapter = new ArrayAdapter<String>(this,
			android.R.layout.simple_spinner_item, scenarioslist);
		dataAdapter.setDropDownViewResource(android.R.layout.simple_spinner_dropdown_item);
		spinner.setAdapter(dataAdapter);
	  }
	
	
	public void setTimer(View v){
		timePicker1 = (TimePicker) findViewById(R.id.timePicker1);
		hour = timePicker1.getCurrentHour();
		minute = timePicker1.getCurrentMinute();
		spinner = (Spinner) findViewById(R.id.senarios_spinner);
		
		params = "time="+hour+":"+minute+"&name=" + String.valueOf(spinner.getSelectedItem());
		params = params.replaceAll(" ", "%20");
      	 
		 System.out.println("urls[1]");
        new SetNewTimerOnServer().execute("");

	}
 
	public class SetNewTimerOnServer extends AsyncTask<String,Integer,String>{	
		
	 	@Override	
	 	protected String doInBackground(String...urls)	{
	 		 System.out.println(params);
	 		 String response;
			response = "";
			if (urls.length > 0){
				try {
					URL url	= new URL(gd.getHomePage()+"php/newTimer.php?"+params+"&"+gd.getUserNPass());
					HttpURLConnection urlConnection	= (HttpURLConnection) url.openConnection();	
					InputStream in = new BufferedInputStream (urlConnection.getInputStream());	
					InputStreamReader inReader = new InputStreamReader(in);	
					BufferedReader bufferedReader =	new	BufferedReader(inReader);	
					StringBuilder responseBuilder = new	StringBuilder();	
					for	(String	line=bufferedReader.readLine();	line!=null;	line=bufferedReader.readLine()){	
						responseBuilder.append(line);	
					}	
					response = responseBuilder.toString();
					System.out.println(response);
				} catch (MalformedURLException e) {
					e.printStackTrace();
				} catch (IOException e) {
					e.printStackTrace();
				} 					
			}

	 		return (response);
	 		
	 	}	
	 	
	 	protected void onPostExecute(String response){
	 		System.out.println(response);
	        finish();

	 	}	
	 }

}
