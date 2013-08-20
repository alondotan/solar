  <html><head> <title>places table </title>
</head>
<body>
<h1> alon </h1>
<?php

	
// connect to the mysql system and select the database
   $mysite ="localhost";
   $myuser ="root";
   $mypasswd = "";
   mysql_connect($mysite, $myuser, $mypasswd)
      or die("Error connecting to the mySQL .... use the browsers BACK button");
	  
	 // connect to the db
   mysql_select_db("solar")
       or die("Error opening the database .... use the browsers BACK button");

	// $sqlQuery="CREATE TABLE component (name VARCHAR(40),id int,value int,x int,y int,kind int,apndx VARCHAR(20))" ;
	// mysql_query ($sqlQuery) ;
	 
  // $sqlQuery="CREATE TABLE lights_Scenarions (id int,name VARCHAR(40),description VARCHAR(40))" ;
  // mysql_query ($sqlQuery) ;

  // $sqlQuery="CREATE TABLE lights_Scenarions_Components (scenarioId int,componentId int,newValue int)" ;
  // mysql_query ($sqlQuery) ;

  $sqlQuery="CREATE TABLE general_data (houseId int,password VARCHAR(40),nzLong int,nzLat int,timeAfterGoingOut int,lastUpdateTime time)" ;
  mysql_query ($sqlQuery) ;

  mysql_close();
//CREATE TABLE example(id INT NOT NULL AUTO_INCREMENT, PRIMARY KEY(id), name VARCHAR(30),  age INT)
?>


</body>
</html>