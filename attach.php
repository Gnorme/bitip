<?php
   $json = $_POST['json'];
	$url = $_POST['URL'];
   
     $file = fopen($url,'a+');
	 $stat = fstat($file);
	 ftruncate($file, $stat['size']-1);
     fwrite($file, "," . $json . "]");
     fclose($file);
?>