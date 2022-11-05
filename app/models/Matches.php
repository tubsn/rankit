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
			"SELECT matches.*, hometeams.name as home_team, awayteams.name as away_team, locations.name as location, locations.city as city, locations.seats as seats
			 FROM matches
			 LEFT JOIN locations on matches.location_id = locations.id
			 LEFT JOIN teams hometeams on matches.home_team_id = hometeams.id
			 LEFT JOIN teams awayteams on matches.away_team_id = awayteams.id
			 WHERE matches.id = :ID"
		);

		$SQLstatement->execute([':ID' => $id]);
		return ($SQLstatement->fetch());
	}

	public function latest() {

		$SQLstatement = $this->db->connection->prepare(
			"SELECT matches.*, hometeams.name as home_team, awayteams.name as away_team, locations.name as location, locations.city as city, locations.seats as seats
			 FROM matches
			 LEFT JOIN locations on matches.location_id = locations.id
			 LEFT JOIN teams hometeams on matches.home_team_id = hometeams.id
			 LEFT JOIN teams awayteams on matches.away_team_id = awayteams.id
			 ORDER BY `matches`.`date` DESC LIMIT 1"
		);

		$SQLstatement->execute();
		return ($SQLstatement->fetch());
	}


	public function list($limit = 100000) {

		$limit = intval($limit);

		$SQLstatement = $this->db->connection->prepare(
			"SELECT matches.*, hometeams.name as home_team, awayteams.name as away_team, locations.name as location, locations.city as city, locations.seats as seats
			 FROM matches
			 LEFT JOIN locations on matches.location_id = locations.id
			 LEFT JOIN teams hometeams on matches.home_team_id = hometeams.id
			 LEFT JOIN teams awayteams on matches.away_team_id = awayteams.id
			 ORDER BY `matches`.`date` DESC LIMIT $limit"
		);

		$SQLstatement->execute();
		return ($SQLstatement->fetchAll());
	}



}
