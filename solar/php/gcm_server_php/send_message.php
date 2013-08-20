<?php

function sendMessage($regId,$message){

    include_once './gcm_server_php/GCM.php';
    
    $gcm = new GCM();

    $registatoin_ids = array($regId);
    $message = array("price" => $message);

    $result = $gcm->send_notification($registatoin_ids, $message);

//    echo $result;
}

?>
