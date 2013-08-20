<?php
	include "dbFunctions.php";

	dbConnect();
	
	$data = getHistoryData(true);

	date_default_timezone_set("Israel"); 
	$phpTime = time();
	$fileTime = date( 'Y-m-d H.i.s', $phpTime );

	$CSVFileName    = '../history/history '.$fileTime.'.csv';
	$FileHandle     = fopen($CSVFileName, 'w') or die("can't open file");
	fclose($FileHandle);
	$fp = fopen($CSVFileName, 'w');
	foreach ($data as $fields) {
		fputcsv($fp, $fields);
	}
	fclose($fp);

?>
	<html><head>
		<link rel="stylesheet" href="../settingStyle.css" type="text/css" />	</head>
	</head><body>
	<br><br><br>
	<a href="../index.html">Back To solar Home</a>
	<br><br>
	<a href="../setting.html">Back To Settings</a>
	</body></html>