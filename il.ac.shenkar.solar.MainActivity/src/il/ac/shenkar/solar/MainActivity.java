package il.ac.shenkar.solar;

import static il.ac.shenkar.solar.CommonUtilities.DISPLAY_MESSAGE_ACTION;
import static il.ac.shenkar.solar.CommonUtilities.EXTRA_MESSAGE;
import static il.ac.shenkar.solar.CommonUtilities.SENDER_ID;

import java.io.BufferedInputStream;
import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.net.HttpURLConnection;
import java.net.MalformedURLException;
import java.net.URL;
import java.util.ArrayList;

import javax.xml.parsers.DocumentBuilder;
import javax.xml.parsers.DocumentBuilderFactory;
import javax.xml.parsers.ParserConfigurationException;

import org.w3c.dom.Document;
import org.w3c.dom.NamedNodeMap;
import org.xml.sax.SAXException;

import android.app.Activity;
import android.app.AlertDialog;
import android.app.Dialog;
import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.DialogInterface;
import android.content.Intent;
import android.content.IntentFilter;
import android.content.SharedPreferences;
import android.content.res.Configuration;
import android.graphics.drawable.Drawable;
import android.net.Uri;
import android.os.AsyncTask;
import android.os.Bundle;
import android.telephony.TelephonyManager;
import android.util.Log;
import android.view.KeyEvent;
import android.view.LayoutInflater;
import android.view.Menu;
import android.view.MenuInflater;
import android.view.MenuItem;
import android.view.View;
import android.webkit.JsResult;
import android.webkit.WebChromeClient;
import android.webkit.WebView;
import android.webkit.WebViewClient;
import android.widget.EditText;
import android.widget.ImageView;
import android.widget.TextView;
import android.widget.Toast;

import il.ac.shenkar.solar.FirstDataActivity;
import il.ac.shenkar.solar.GeneralData;
import il.ac.shenkar.solar.R;
import il.ac.shenkar.solar.MainActivity.GetWeatherData;
import il.ac.shenkar.solar.MainActivity.JavaScriptInterface;
//import il.ac.shenkar.solar.MainActivity.MyWebChromeClient;
//import il.ac.shenkar.solar.MainActivity.MyWebViewClient;

import il.ac.shenkar.solar.SetTimerActivity;
import il.ac.shenkar.solar.MainActivity.SendToServer;
import com.google.android.gcm.GCMRegistrar;

public class MainActivity extends Activity {

	 public static final String PREFS_NAME = "SolarPrefsFile";
	 private String LOG_TAG = "AndroidWebViewActivity";

	 private WebView myWebView;

	 private String simId;
	 private String houseId;
	 private String housePassword;
	 private GeneralData gd;
	 private Drawable weatherImg;
	 private String outSideTemp;

	
	// label to display gcm messages
	TextView lblMessage;
	
	// Asyntask
	AsyncTask<Void, Void, Void> mRegisterTask;
	
	// Alert dialog manager
	AlertDialogManager alert = new AlertDialogManager();
	
	// Connection detector
	ConnectionDetector cd;
	
	public static String name;
	public static String email;

	@Override
	public void onCreate(Bundle savedInstanceState) {
		super.onCreate(savedInstanceState);

        gd = GeneralData.getInstance(this);
        //
     // Restore preferences
        TelephonyManager phoneManager = (TelephonyManager) 
        	    getApplicationContext().getSystemService(Context.TELEPHONY_SERVICE);
        simId = phoneManager.getSimSerialNumber();

        //need change
        SharedPreferences settings = getSharedPreferences(PREFS_NAME, 0);
        houseId  = settings.getString("houseId", "");
        if (houseId == ""){
        	Intent intent = new Intent(this, FirstDataActivity.class);
            startActivity(intent);        	
            houseId  = settings.getString("houseId", "");
        }
        housePassword  = settings.getString("housePassword", "");
        gd.setHomePage(settings.getString("serverIP",""));
        //simId = settings.getString("simId","");
        gd.setUserNPass("userId="+simId+"&houseId="+houseId+"&housePassword="+housePassword);
        
        gd.populateScenariosList();
        
        setContentView(R.layout.activity_main);

        
        
        myWebView = (WebView) findViewById(R.id.webView1);
         
        //enable Javascript
        myWebView.getSettings().setJavaScriptEnabled(true);
         
        //loads the WebView completely zoomed out
        myWebView.getSettings().setLoadWithOverviewMode(true);
         
        //true makes the Webview have a normal viewport such as a normal desktop browser 
        //when false the webview will have a viewport constrained to it's own dimensions
        myWebView.getSettings().setUseWideViewPort(true);
         
        //override the web client to open all links in the same webview
        myWebView.setWebViewClient(new MyWebViewClient());
        myWebView.setWebChromeClient(new MyWebChromeClient());
         
        //Injects the supplied Java object into this WebView. The object is injected into the 
        //JavaScript context of the main frame, using the supplied name. This allows the 
        //Java object's public methods to be accessed from JavaScript.
        myWebView.addJavascriptInterface(new JavaScriptInterface(this), "Android");
         
        //load the home page URL
        myWebView.clearCache(true);


        String webPage;
        
        if(getResources().getConfiguration().orientation == Configuration.ORIENTATION_PORTRAIT) 
        {
            System.out.println("code to do for Portrait Mode");
            webPage = gd.getHomePage()+"pindex.html?"+gd.getUserNPass();
            new GetWeatherData().execute("");
        } else {
            System.out.println("code to do for Landscape Mode");         
        	webPage = gd.getHomePage()+"lindex.html?"+gd.getUserNPass();
        }

        myWebView.loadUrl(webPage);


		
		
		setContentView(R.layout.activity_main);
		
		cd = new ConnectionDetector(getApplicationContext());

		// Check if Internet present
		if (!cd.isConnectingToInternet()) {
			// Internet Connection is not present
			alert.showAlertDialog(MainActivity.this,
					"Internet Connection Error",
					"Please connect to working Internet connection", false);
			// stop executing code by return
			return;
		}
		
		// Getting name, email from intent
		Intent i = getIntent();
		
//		name = i.getStringExtra("name");
//		email = i.getStringExtra("email");		
		
		// Make sure the device has the proper dependencies.
		GCMRegistrar.checkDevice(this);

		// Make sure the manifest was properly set - comment out this line
		// while developing the app, then uncomment it when it's ready.
		GCMRegistrar.checkManifest(this);

		lblMessage = (TextView) findViewById(R.id.lblMessage);
		
		registerReceiver(mHandleMessageReceiver, new IntentFilter(
				DISPLAY_MESSAGE_ACTION));
		
		// Get GCM registration id
		final String regId = GCMRegistrar.getRegistrationId(this);

		System.out.println("regId:"+regId );
		// Check if regid already presents
		if (regId.equals("")) {
			// Registration is not present, register now with GCM			
			GCMRegistrar.register(this, SENDER_ID);
		} else {
			// Device is already registered on GCM
			if (GCMRegistrar.isRegisteredOnServer(this)) {
				// Skips registration.				
				Toast.makeText(getApplicationContext(), "Already registered with GCM", Toast.LENGTH_LONG).show();
			} else {
				// Try to register again, but not in the UI thread.
				// It's also necessary to cancel the thread onDestroy(),
				// hence the use of AsyncTask instead of a raw thread.
				final Context context = this;
				mRegisterTask = new AsyncTask<Void, Void, Void>() {

					@Override
					protected Void doInBackground(Void... params) {
						// Register on our server
						// On server creates a new user
						ServerUtilities.register(context, name, email, regId);
						return null;
					}

					@Override
					protected void onPostExecute(Void result) {
						mRegisterTask = null;
					}

				};
				mRegisterTask.execute(null, null, null);
			}
		}
	}		

	//customize your web view client to open links from your own site in the 
	 //same web view otherwise just open the default browser activity with the URL
	 private class MyWebViewClient extends WebViewClient {
	     @Override
	     public boolean shouldOverrideUrlLoading(WebView view, String url) {
	         if (Uri.parse(url).getHost().equals(gd.getHomePage())) {
	             return false;
	         }
	         Intent intent = new Intent(Intent.ACTION_VIEW, Uri.parse(url));
	         startActivity(intent);
	         return true;
	     }
	 }
	 private class MyWebChromeClient extends WebChromeClient {
	      
	  //display alert message in Web View
	  @Override
	     public boolean onJsAlert(WebView view, String url, String message, JsResult result) {
	         Log.d(LOG_TAG, message);
	         new AlertDialog.Builder(view.getContext())
	          .setMessage(message).setCancelable(true).show();
	         result.confirm();
	         return true;
	     }
	 }
	 
	/**
	 * Receiving push messages
	 * */
	private final BroadcastReceiver mHandleMessageReceiver = new BroadcastReceiver() {
		@Override
		public void onReceive(Context context, Intent intent) {
			String newMessage = intent.getExtras().getString(EXTRA_MESSAGE);
			// Waking up mobile if it is sleeping
			WakeLocker.acquire(getApplicationContext());
			
			/**
			 * Take appropriate action on this message
			 * depending upon your app requirement
			 * For now i am just displaying it on the screen
			 * */
			
			// Showing received message
			lblMessage.append(newMessage + "\n");			
			Toast.makeText(getApplicationContext(), "New Message: " + newMessage, Toast.LENGTH_LONG).show();
			
			// Releasing wake lock
			WakeLocker.release();
		}
	};
	
	@Override
	protected void onDestroy() {
		if (mRegisterTask != null) {
			mRegisterTask.cancel(true);
		}
		try {
			unregisterReceiver(mHandleMessageReceiver);
			GCMRegistrar.onDestroy(this);
		} catch (Exception e) {
			Log.e("UnRegister Receiver Error", "> " + e.getMessage());
		}
		super.onDestroy();
	}

	 public class JavaScriptInterface {
	     Context mContext;
	 
	     // Instantiate the interface and set the context 
	     JavaScriptInterface(Context c) {
	         mContext = c;
	     }
	      
	     //using Javascript to call the finish activity
	     public void closeMyActivity() {
	         finish();
	     }
	      
	 }

	 //Web view has record of all pages visited so you can go back and forth
	 //just override the back button to go back in history if there is page
	 //available for display
	 @Override
	 public boolean onKeyDown(int keyCode, KeyEvent event) {
	     if ((keyCode == KeyEvent.KEYCODE_BACK) && myWebView.canGoBack()) {
	         myWebView.goBack();
	         return true;
	     }
	     return super.onKeyDown(keyCode, event);
	 }

	 
	 public void saveScenario(View v){
		 	AlertDialog.Builder alertDialogBuilder;
			AlertDialog alertDialog;
	    	LayoutInflater l_Inflater;
	    	View newNameView;
	    	EditText newNameText;
			alertDialogBuilder = new AlertDialog.Builder(this);
			l_Inflater = LayoutInflater.from(this);
			newNameView = l_Inflater.inflate(R.layout.new_scenario_name, null);
			alertDialogBuilder.setView(newNameView)
			.setPositiveButton("save", new DialogInterface.OnClickListener() {
	           public void onClick(DialogInterface dialog, int id) {
	        	   Dialog d = (Dialog) dialog;
	        	   EditText newNameText = (EditText) d.findViewById(R.id.newName);
	        	   new SendToServer().execute("php/saveCurrent.php?name="+newNameText.getText().toString()+gd.getUserNPass());
//	               new GetScenarioFromServer().execute("");
	        	   gd.populateScenariosList();
	           }
	       })
	       .setNegativeButton("cencel", new DialogInterface.OnClickListener() {
	           public void onClick(DialogInterface dialog, int id) {
	               dialog.cancel();
	           }
	       });      
			alertDialog = alertDialogBuilder.create();
			alertDialog.show();
	 }
	 
	 public void chooseScenario(View v){
		AlertDialog.Builder alertDialogBuilder;
		AlertDialog alertDialog;
		ArrayList<String> scenarioslist = gd.getScenariosList();
	 	final CharSequence[] items = new CharSequence[scenarioslist.size()];
	 	for (int i =0; i<  scenarioslist.size();i++) {
				items[i] = scenarioslist.get(i);
			}
	 	alertDialogBuilder = new AlertDialog.Builder(this);
	 	alertDialogBuilder.setTitle("Choose Scenario");
	 	alertDialogBuilder.setItems(items, new DialogInterface.OnClickListener() {
	         public void onClick(DialogInterface dialog, int item) {
	        	 String temp = items[item].toString();
	        	 temp = temp.replaceAll(" ", "%20");
	        	 new SendToServer().execute("php/addOrder.php?scenarionName="+temp+"&"+gd.getUserNPass());
	         }
	     });
	 	alertDialog = alertDialogBuilder.create();
	 	alertDialog.show();

	 }
	 
	 public void newTimer(View v){
		 System.out.println("in herhe");
	  	Intent intent = new Intent(this, SetTimerActivity.class);
	    startActivity(intent);        	

	}

	 
	 public class GetWeatherData extends AsyncTask<String,Integer,String[]>{	
			
		 	@Override	
		 	protected String[] doInBackground(String...urls)	{
		 		String[] response = new String[2];
		 		try
				{
		 			System.out.println("statrt");
		 			// connect to the web site
					URL url = new URL("http://weather.yahooapis.com/forecastrss?w=1968212&u=c");
					HttpURLConnection con = (HttpURLConnection) url.openConnection();
					con.setRequestMethod("GET");
					con.connect();
					InputStream in = con.getInputStream();
		 			System.out.println("statrt2");
					
					// handling the XML
					DocumentBuilderFactory factory = DocumentBuilderFactory.newInstance();
					DocumentBuilder builder = factory.newDocumentBuilder();
					Document doc = builder.parse(in);
					NamedNodeMap attr = doc.getElementsByTagName("yweather:condition").item(0).getAttributes();
							
					weatherImg = LoadImageFromWebOperations(attr.getNamedItem("code").getNodeValue());
					outSideTemp = attr.getNamedItem("temp").getNodeValue();
					
					in.close();
					con.disconnect();
				}
				catch(IOException e)
				{
					e.printStackTrace(); 
				} 
				catch (ParserConfigurationException e) 
				{
					e.printStackTrace();
				} 
				catch (SAXException e) 
				{
					e.printStackTrace();
				}


		 		return (response);
		 		
		 	}	
		 	
		 	protected void onPostExecute(String[] status){

				System.out.println(status[0] + "=" + status[1]);
//				Drawable d = 
			    	TextView nameText = (TextView) findViewById(R.id.weatherText);
			    	nameText.setText(outSideTemp);
			    	
			    	ImageView img = (ImageView)  findViewById(R.id.weatherPhoto);
			    	img.setImageDrawable(weatherImg);
//			    	
//			    	EditText descriptionText = (EditText) findViewById(R.id.editTextDesc);
//			    	descriptionText.setText(task.getDescription());
		 		
		 	}	
	}

		public static Drawable LoadImageFromWebOperations(String imgNumber) {
		    try {
		        InputStream is = (InputStream) new URL("http://l.yimg.com/a/i/us/we/52/"+imgNumber+".gif").getContent();
		        Drawable d = Drawable.createFromStream(is, imgNumber);
		        return d;
		    } catch (Exception e) {
		        return null;
		    }
		}

	 public class SendToServer extends AsyncTask<String,Integer,String>{	
			
	 	@Override	
	 	protected String doInBackground(String...urls)	{
	 		 System.out.println(urls[0]);
	 		 String response;
			response = "";
			if (urls.length > 0){
				try {
					URL url	= new URL(gd.getHomePage()+urls[0]);
					System.out.println(url.getQuery());
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
//		    		try {
//		    			JSONObject jsonResponse	= new JSONObject(response);
//		    			scenarioslist = jsonResponse.getJSONArray("scenarios").;
	//
//		    	    	 jsonResponse.getString("description"));
//		    	
//		    		} catch (JSONException e) {
//		    			e.printStackTrace();
//		    		}
				} catch (MalformedURLException e) {
					e.printStackTrace();
				} catch (IOException e) {
					e.printStackTrace();
				} 					
			}

	 		return (response);
	 		
	 	}	
	 	
	 	protected void onPostExecute(String status){

//		    	EditText nameText = (EditText) findViewById(R.id.editTextName);
//		    	nameText.setText(task.getName());
//		    	
//		    	EditText descriptionText = (EditText) findViewById(R.id.editTextDesc);
//		    	descriptionText.setText(task.getDescription());
	 		
	 	}	
	 }
	 
	 
	 
	 //Menu
	 @Override
	 public boolean onCreateOptionsMenu(Menu menu) {
		    MenuInflater inflater = getMenuInflater();
		    inflater.inflate(R.menu.activity_main, menu);
		    return true;
		}

	 // Handle item selection in the menu
	 @Override
	 public boolean onOptionsItemSelected(MenuItem item) {
	 	AlertDialog.Builder alertDialogBuilder;
	 	LayoutInflater l_Inflater;
	 	View newNameView;
	 	EditText serverIpText,houseIdText,housePassText,simIdText;
	 	AlertDialog alertDialog;

//			tracker.trackEvent("Shopping List Home page", "menu_was_opened", "",null);
	// 	
	 	switch (item.getItemId()) {
	 		// adding new list
	         case R.id.menu_settings: 
	         	Intent intent = new Intent(this, FirstDataActivity.class);
	            startActivity(intent);        	

	        	 // 			alertDialogBuilder = new AlertDialog.Builder(this);
//	 			l_Inflater = LayoutInflater.from(this);
//	 			newNameView = l_Inflater.inflate(R.layout.setting, null);
//	 			serverIpText = (EditText) newNameView.findViewById(R.id.serverIp);
//	 			serverIpText.setText(homePage);
//	 			houseIdText = (EditText) newNameView.findViewById(R.id.houseId);
//	 			houseIdText.setText(houseId);
//	 			housePassText = (EditText) newNameView.findViewById(R.id.housePassward);
//	 			housePassText.setText(housePassword);
//	 			simIdText = (EditText) newNameView.findViewById(R.id.simId);
//	 			simIdText.setText(simId);
//	 			alertDialogBuilder.setView(newNameView)
//	 			.setPositiveButton("save", new DialogInterface.OnClickListener() {
//	                public void onClick(DialogInterface dialog, int id) {
//	             	   Dialog d = (Dialog) dialog;
//	             	   EditText newNameText = (EditText) d.findViewById(R.id.serverIp);
//	             	   homePage = newNameText.getText().toString();
//		               SharedPreferences settings = getSharedPreferences(MainActivity.PREFS_NAME, 0);
//		               SharedPreferences.Editor editor = settings.edit();
//		               	               
//		               EditText simId = (EditText) findViewById(R.id.simId);
//		               
//		               EditText houseId = (EditText) findViewById(R.id.houseId);
//		               
//		               EditText  housePassword = (EditText) findViewById(R.id.housePassward);
//		                
//		               EditText serverIP = (EditText) findViewById(R.id.serverIp);
	//
//		               System.out.println(simId.getText().toString());
//		               editor.putString("simId", simId.getText().toString());
//		               editor.putString("houseId", houseId.getText().toString());
//		               editor.putString("housePassword", housePassword.getText().toString());
//		               editor.putString("serverIP", serverIP.getText().toString());
	//
//		                // Commit the edits!
//		                editor.commit();
	//
//	                }
//	            })
//	            .setNegativeButton("cencel", new DialogInterface.OnClickListener() {
//	                public void onClick(DialogInterface dialog, int id) {
//	                    dialog.cancel();
//	                }
//	            });      
//	 			alertDialog = alertDialogBuilder.create();
//	 			alertDialog.show();
	             return true;
	             
//	     	// rename the list
//	         case R.id.menu_renameList:
//	 			alertDialogBuilder = new AlertDialog.Builder(this);
//	 			l_Inflater = LayoutInflater.from(this);
//	 			newNameView = l_Inflater.inflate(R.layout.change_list_name, null);
//	 			newNameText = (EditText) newNameView.findViewById(R.id.newName);
//	 			newNameText.setText(shoppingList.getCurrentShoppingListName());
//	 			alertDialogBuilder.setView(newNameView)
//	 			.setPositiveButton("שמור", new DialogInterface.OnClickListener() {
//	                public void onClick(DialogInterface dialog, int id) {
//	             	   Dialog d = (Dialog) dialog;
//	             	   EditText newNameText = (EditText) d.findViewById(R.id.newName);
//	             	   shoppingList.updateCurrentListName(newNameText.getText().toString());
//	             	   tracker.trackEvent("Shopping List Home page", "list_renamed", "",null);
//	             	   refreshDisplay();
//	                }
//	            })
//	            .setNegativeButton("בטל", new DialogInterface.OnClickListener() {
//	                public void onClick(DialogInterface dialog, int id) {
//	                    dialog.cancel();
//	                }
//	            });      
//	 			alertDialog = alertDialogBuilder.create();
//	 			alertDialog.show();
//	             return true;
//	             
//	         // choose other list
//	         case R.id.menu_chooseList:
//	         	ArrayList<String> list = shoppingList.getAllShoppingListNames();
//	         	final CharSequence[] items = new CharSequence[list.size()];
//	         	for (int i =0; i<  list.size();i++) {
//						items[i] = list.get(i);
//					}
//	         	alertDialogBuilder = new AlertDialog.Builder(this);
//	         	alertDialogBuilder.setTitle("בחר רשימה");
//	         	alertDialogBuilder.setItems(items, new DialogInterface.OnClickListener() {
//	                 public void onClick(DialogInterface dialog, int item) {
//	                 	shoppingList.replaceCurrentList(items[item].toString());
//	             		tracker.trackEvent("Shopping List Home page", "change_current_list", "",null);
//	                 	refreshDisplay();
//	                 }
//	             });
//	         	alertDialog = alertDialogBuilder.create();
//	         	alertDialog.show();
//	             return true;    
//	             
//	         // create new list base on the current one
//	         case R.id.menu_saveAsList:
//	 			alertDialogBuilder = new AlertDialog.Builder(this);
//	 			l_Inflater = LayoutInflater.from(this);
//	 			newNameView = l_Inflater.inflate(R.layout.change_list_name, null);
//	 			alertDialogBuilder.setView(newNameView)
//	 			.setPositiveButton("שמור", new DialogInterface.OnClickListener() {
//	                public void onClick(DialogInterface dialog, int id) {
//	             	   Dialog d = (Dialog) dialog;
//	             	   EditText newNameText = (EditText) d.findViewById(R.id.newName);
//	             	   shoppingList.saveAsCurrentList(newNameText.getText().toString());
//	             	   tracker.trackEvent("Shopping List Home page", "list_saved_as", "",null);
//	             	   refreshDisplay();
//	                }
//	            })
//	            .setNegativeButton("בטל", new DialogInterface.OnClickListener() {
//	                public void onClick(DialogInterface dialog, int id) {
//	                    dialog.cancel();
//	                }
//	            });      
//	 			alertDialog = alertDialogBuilder.create();
//	 			alertDialog.show();
//	             return true;
//	             
//	         // remove from the list all the products mark as done
//	         case R.id.menu_clearList:
//	         	shoppingList.clearCurrentShoppingList();
//	 	        lv1 = (ListView) findViewById(R.id.listV_main);    	
//	 	        lv1.setAdapter(new ItemListBaseAdapter(this));
//	 			tracker.trackEvent("Shopping List Home page", "list_was_cleared", "",null);    	        
//	             return true;          
//	             
//	         // removeing the list
//	         case R.id.menu_removeList:
//	         	shoppingList.removeCurrentList();
//	             currentNameTextView = (TextView) findViewById(R.id.currentListNameText);
//	             currentNameTextView.setText(shoppingList.getCurrentShoppingListName());
//	 	        lv1 = (ListView) findViewById(R.id.listV_main);    	
//	 	        lv1.setAdapter(new ItemListBaseAdapter(this));
//	 			tracker.trackEvent("Shopping List Home page", "list_was_removed", "",null);
//	             return true;          
	         default:
	             return super.onOptionsItemSelected(item);
	     }
	 }
	
}
