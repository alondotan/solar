package il.ac.shenkar.solar;

import android.os.Bundle;
import android.app.Activity;
import android.content.Context;
import android.content.SharedPreferences;
import android.telephony.TelephonyManager;
import android.view.Menu;
import android.view.View;
import android.widget.EditText;

public class FirstDataActivity extends Activity {

    @Override
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.setting);
        SharedPreferences settings = getSharedPreferences(MainActivity.PREFS_NAME, 0);

        
        EditText serverIP = (EditText) findViewById(R.id.serverIp);
        if (serverIP.getText().toString() == "")
        	serverIP.setText("http://10.0.0.10:802/solar/");
        else 
        	serverIP.setText(settings.getString("serverIP",""));

        EditText simId = (EditText) findViewById(R.id.simId);
        TelephonyManager phoneManager = (TelephonyManager) 
        	    getApplicationContext().getSystemService(Context.TELEPHONY_SERVICE);
        simId.setText(phoneManager.getSimSerialNumber());
        
        EditText houseIdText = (EditText) findViewById(R.id.houseId);
		houseIdText.setText(settings.getString("houseId", ""));
		
		EditText housePassText = (EditText) findViewById(R.id.housePassward);
		housePassText.setText(settings.getString("housePassword", ""));
		        
    }

    @Override
    public boolean onCreateOptionsMenu(Menu menu) {
        getMenuInflater().inflate(R.menu.activity_first_data, menu);
        return true;
    }
    
    public void saveSetting(View v){
    	SharedPreferences settings = getSharedPreferences(MainActivity.PREFS_NAME, 0);
        SharedPreferences.Editor editor = settings.edit();
    	EditText simId = (EditText) findViewById(R.id.simId);
        editor.putString("simId", simId.getText().toString());
    	EditText houseId = (EditText) findViewById(R.id.houseId);
        editor.putString("houseId", houseId.getText().toString());
        
        
        EditText  housePassword = (EditText) findViewById(R.id.housePassward);
        editor.putString("housePassword", housePassword.getText().toString());
        EditText serverIP = (EditText) findViewById(R.id.serverIp);
        editor.putString("serverIP", serverIP.getText().toString());
        

        // Commit the edits!
        editor.commit();
        finish();
    }

    public void cencelSetting(View v){
        
        finish();
    }
}
