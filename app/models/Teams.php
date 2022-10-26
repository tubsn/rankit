<?php

namespace app\models;
use \flundr\database\SQLdb;
use \flundr\mvc\Model;

class Teams extends Model
{

	public function __construct() {
		$this->db = new SQLdb(DB_SETTINGS);
		$this->db->table = 'teams';
	}

	public function get($id, $columns = null) {

		$SQLstatement = $this->db->connection->prepare(
			"SELECT teams.*, locations.name as location
			 FROM teams
			 LEFT JOIN locations on locations.id = teams.location_id
			 WHERE teams.id = :ID"
		);

		$SQLstatement->execute([':ID' => $id]);
		return ($SQLstatement->fetch());
	}

}
