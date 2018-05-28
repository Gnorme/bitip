<?php
   $json = $_POST['json'];
   $path = $_POST['path'];
   $dir = 'hubs/' . $path;
   $placeFile = $dir . '/' . $path;
   $recFile = $dir . '/receivers';
   if (json_decode($json) != null) { /* sanity check */
	if (!mkdir($dir, 0700, true)) {
		die('Failed to create folders...');
	} else {
		file_put_contents($placeFile, $json);
		file_put_contents($recFile, '[{"id":"' . $path . '","image":"images/blank.png"}]');
	}
   } else {
     // handle error 
   }
?>