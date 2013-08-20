// Setup event handlers
window.onload = function() {
	getScenarios();
	idsAndPassword = "&userId="+"5196300"+"&houseId="+"5196300"+"&housePassword="+"shenkar";
	doXmlhttpRequset('getUsersData.php?kind=json&inHome=false'+idsAndPassword,setDeletedUsersMenu,true);
	doXmlhttpRequset('getLightsScenarions.php?name=&json=true'+idsAndPassword,setDeletedSenariosMenu,true);
}
