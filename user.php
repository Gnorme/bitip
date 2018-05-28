<?php
   $json = $_POST['json'];
	$prefix = '{"success":true,"user":';
   if (json_decode($json) != null) { /* sanity check */
	if (substr($json, 0, strlen($prefix)) == $prefix) {
		$json = substr($json, strlen($prefix));
		$json = str_replace("},",",",$json);
		$file = fopen('users/userlist','a');
		fwrite($file, $json . ",\n");
		fclose($file);
	} 
   } else {
     // handle error 
   }
?>