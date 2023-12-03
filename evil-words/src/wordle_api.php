<?php

header("Access-Control-Allow-Origin: http://localhost:4200");
header("Access-Control-Allow-Headers: X-Requested-With, Content-Type, Origin, Authorization, Accept, Client-Security-Token, Accept-Encoding");
header("Access-Control-Max-Age: 1000");
header("Access-Control-Allow-Methods: POST, GET, OPTIONS, PUT");

$url = "http://ford.cs.virginia.edu/cs4640-wordlist.txt";
$input = file_get_contents($url);

// Do processing of the data

$output_array = array();
$output_array = explode("\n", $input);

$output = $output_array[array_rand($output_array)];


header("Content-Type: application/json");
echo json_encode($output, JSON_PRETTY_PRINT);