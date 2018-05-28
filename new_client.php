<?php
   $json = $_POST['json'];
   $path = $_POST['clID'];
   $dir = 'clients/' . $path;
   $infoeFile = $dir . '/' . $path;
   if (json_decode($json) != null) { /* sanity check */
	if (!mkdir($dir, 0700, true)) {
		die('Failed to create folders...');
	} else {
		file_put_contents($infoFile, $json);
	}
   } else {
     // handle error 
   }
?>