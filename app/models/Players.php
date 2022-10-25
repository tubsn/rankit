<?php

namespace app\models;
use \flundr\database\SQLdb;
use \flundr\mvc\Model;

class Players extends Model
{

	public function __construct() {

		$this->db = new SQLdb(DB_SETTINGS);
		$this->db->table = 'players';

	}

	public function get($id, $columns = null) {

		$SQLstatement = $this->db->connection->prepare(
			"SELECT players.*, teams.name as team, (
					SELECT avg(score) FROM scores
					WHERE scores.player_id = :ID
					AND scores.date > NOW() - INTERVAL 1 MONTH
				) as score
			 FROM players
			 INNER JOIN teams on teams.team_id = players.id
			 WHERE players.id = :ID
			 "
		);

		$SQLstatement->execute([':ID' => $id]);
		return ($SQLstatement->fetch());


	}

}
