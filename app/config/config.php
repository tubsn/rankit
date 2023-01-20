<?php

// Default Liga
$leagueID = file_get_contents(CONFIGPATH .DIRECTORY_SEPARATOR . 'default_league.txt');
if (empty($leagueID)) {$leagueID = 1;}
define('DEFAULT_LEAGUE_ID', $leagueID);
