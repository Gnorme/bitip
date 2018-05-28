<?php
   $comment= $_POST['comment'];
   $tip = $_POST['tip'];
   $to = $_POST['to'];
   $dir = 'clients/' . $to . '/recent-tips';  
	$file = fopen($dir,'a+');
	$stat = fstat($file);
	ftruncate($file, $stat['size']-1);
	fwrite($file, '"amount":"' . $tip . '", "message":"' . $comment . '"},]');
	fclose($file);
?>