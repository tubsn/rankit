<?php

namespace app\models;
use \flundr\database\SQLdb;
use \flundr\mvc\Model;

class Matches extends Model
{

	public function __construct() {

		$this->db = new SQLdb(DB_SETTINGS);
		$this->db->table = 'matches';

	}


	public function get($id, $columns = null) {

		$SQLstatement = $this->db->connection->prepare(
			"SELECT matches.*,
			hometeams.name as home_team, awayteams.name as away_team,
			hometeams.short as home_team_short, awayteams.short as away_team_short,
			hometeams.highlight as home_team_highlight, awayteams.highlight as away_team_highlight,
			locations.name as location, locations.city as city,
			leagues.name as league, leagues.season as season,
			 (CASE
				WHEN matches.votemode = 'on' THEN 'vote'
				WHEN matches.votemode = 'off' THEN 'passed'
		        WHEN TIMESTAMPDIFF(MINUTE, matches.date, NOW()) < 0 THEN 'pending'
		        WHEN TIMESTAMPDIFF(MINUTE, matches.date, NOW()) BETWEEN 0 AND 90 THEN 'running'
		        WHEN TIMESTAMPDIFF(MINUTE, matches.date, NOW()) BETWEEN 90 AND 60*24*7 THEN 'vote'
		        ELSE 'passed'
		     END) as status,
			 TIMESTAMPDIFF(MINUTE, matches.date, NOW()) AS timediff,
			 locations.seats as seats
			 FROM matches
			 LEFT JOIN locations on matches.location_id = locations.id
			 LEFT JOIN teams hometeams on matches.home_team_id = hometeams.id
			 LEFT JOIN teams awayteams on matches.away_team_id = awayteams.id
			 LEFT JOIN leagues on matches.league_id = leagues.id
			 WHERE matches.id = :ID"
		);

		$SQLstatement->execute([':ID' => $id]);
		return ($SQLstatement->fetch());
	}

	public function latest($leagueID = DEFAULT_LEAGUE_ID) {

		if ($leagueID) {$leagueID = intval($leagueID);}

		$SQLstatement = $this->db->connection->prepare(
			"SELECT matches.*,
			hometeams.name as home_team, awayteams.name as away_team,
			hometeams.short as home_team_short, awayteams.short as away_team_short,
			locations.name as location, locations.city as city,
			leagues.name as league, leagues.season as season,
			 (CASE
				WHEN matches.votemode = 'on' THEN 'vote'
				WHEN matches.votemode = 'off' THEN 'passed'			 	
		        WHEN TIMESTAMPDIFF(MINUTE, matches.date, NOW()) < 0 THEN 'pending'
		        WHEN TIMESTAMPDIFF(MINUTE, matches.date, NOW()) BETWEEN 0 AND 90 THEN 'running'
		        WHEN TIMESTAMPDIFF(MINUTE, matches.date, NOW()) BETWEEN 90 AND 60*24*7 THEN 'vote'
		        ELSE 'passed'
		     END) as status,
			 TIMESTAMPDIFF(MINUTE, matches.date, NOW()) AS timediff,
			 locations.seats as seats
			 FROM matches
			 LEFT JOIN locations on matches.location_id = locations.id
			 LEFT JOIN teams hometeams on matches.home_team_id = hometeams.id
			 LEFT JOIN teams awayteams on matches.away_team_id = awayteams.id
			 LEFT JOIN leagues on matches.league_id = leagues.id
			 WHERE matches.league_id = $leagueID		 
			 ORDER BY `matches`.`date` DESC LIMIT 1"
		);

		$SQLstatement->execute();
		return ($SQLstatement->fetch());
	}


	public function list($leagueID = DEFAULT_LEAGUE_ID) {

		if ($leagueID) {$leagueID = intval($leagueID);}

		$SQLstatement = $this->db->connection->prepare(
			"SELECT matches.*,
			hometeams.name as home_team, awayteams.name as away_team,
			hometeams.short as home_team_short, awayteams.short as away_team_short,
			locations.name as location, locations.city as city,
			leagues.name as league, leagues.season as season,
			 (CASE
				WHEN matches.votemode = 'on' THEN 'vote'
				WHEN matches.votemode = 'off' THEN 'passed'			 	
		        WHEN TIMESTAMPDIFF(MINUTE, matches.date, NOW()) < 0 THEN 'pending'
		        WHEN TIMESTAMPDIFF(MINUTE, matches.date, NOW()) BETWEEN 0 AND 90 THEN 'running'
		        WHEN TIMESTAMPDIFF(MINUTE, matches.date, NOW()) BETWEEN 90 AND 60*24*7 THEN 'vote'
		        ELSE 'passed'
		     END) as status,
			 TIMESTAMPDIFF(MINUTE, matches.date, NOW()) AS timediff,
			 locations.seats as seats
			 FROM matches
			 LEFT JOIN locations on matches.location_id = locations.id
			 LEFT JOIN teams hometeams on matches.home_team_id = hometeams.id
			 LEFT JOIN teams awayteams on matches.away_team_id = awayteams.id
			 LEFT JOIN leagues on matches.league_id = leagues.id
			 WHERE matches.league_id = $leagueID
			 ORDER BY `matches`.`date` DESC"
		);

		$SQLstatement->execute();
		return ($SQLstatement->fetchAll());
	}



}
