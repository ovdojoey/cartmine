<?php
echo 'test';

$inputJSON = file_get_contents('php://input');
$input = json_decode($inputJSON, TRUE); //convert JSON into array

echo 'nothing received';
echo $inputJSON;
?>
