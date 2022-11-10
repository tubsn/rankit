<?php

namespace app\models;
use \flundr\database\SQLdb;
use \flundr\mvc\Model;

class Players extends Model
{

	public function __construct() {

		$this->db = new SQLdb(DB_SETTINGS);
		$this->db->table = 'players';
		$this->db->orderby = 'lastname';

	}

	public function only_rankable() {

		$SQLstatement = $this->db->connection->prepare(
			"SELECT players.*, teams.rankable as rankable FROM players
			 LEFT JOIN teams on teams.id = players.team_id
			WHERE rankable = 1
			ORDER BY players.number"
		);

		$SQLstatement->execute();
		return ($SQLstatement->fetchAll());
	}

	public function get($id, $columns = null) {

		$SQLstatement = $this->db->connection->prepare(
			"SELECT players.*, TIMESTAMPDIFF(YEAR, players.birthday, CURDATE()) AS age, teams.name as team, 

				(
					SELECT round(avg(score),1) FROM scores
					WHERE scores.player_id = :ID
					AND creator = 'fan'
					AND scores.date > NOW() - INTERVAL 1 MONTH
				) as score,

				(
					SELECT count(score) FROM scores
					WHERE scores.player_id = :ID
					AND creator = 'fan'
					AND scores.date > NOW() - INTERVAL 1 MONTH
				) as votes,

				(
					SELECT round(avg(score),1) FROM scores
					WHERE scores.player_id = :ID
					AND creator = 'editor'
					AND scores.date > NOW() - INTERVAL 1 MONTH
				) as score_internal,

				(
					SELECT count(score) FROM scores
					WHERE scores.player_id = :ID
					AND creator = 'editor'
					AND scores.date > NOW() - INTERVAL 1 MONTH
				) as votes_internal				


			 FROM players
			 LEFT JOIN teams on teams.id = players.team_id
			 WHERE players.id = :ID
			 "
		);

		$SQLstatement->execute([':ID' => $id]);
		return ($SQLstatement->fetch());

	}


	public function by_match($matchID, $playerIDs) {

		$SQLstatement = $this->db->connection->prepare(
			"SELECT players.*, teams.name as team, TIMESTAMPDIFF(YEAR, players.birthday, CURDATE()) AS age,

				round((
					SELECT avg(score) FROM scores
					WHERE scores.player_id = players.id
					AND creator = 'fan'
					AND match_id = $matchID

				),1) as score,
				(
					SELECT count(score) FROM scores
					WHERE scores.player_id = players.id
					AND creator = 'fan'
					AND match_id = $matchID
				) as votes,

				round((
					SELECT avg(score) FROM scores
					WHERE scores.player_id = players.id
					AND creator = 'editor'
					AND match_id = $matchID

				),1) as score_internal,
				(
					SELECT count(score) FROM scores
					WHERE scores.player_id = players.id
					AND creator = 'editor'
					AND match_id = $matchID
				) as votes_internal

			 FROM players
			 LEFT JOIN teams on teams.id = players.team_id
			 WHERE players.id IN ($playerIDs)
			 ORDER BY players.number
			 "
		);

		$SQLstatement->execute();
		return ($SQLstatement->fetchAll());

	}





	public function team($teamID) {

		$SQLstatement = $this->db->connection->prepare(
			"SELECT players.*, teams.name as team,

				round((
					SELECT avg(score) FROM scores
					WHERE scores.player_id = players.id
				),1) as score,

				(
					SELECT count(score) FROM scores
					WHERE scores.player_id = players.id
				) as votes


			 FROM players
			 LEFT JOIN teams on teams.id = players.team_id
			 WHERE teams.id = $teamID
			 "
		);

		$SQLstatement->execute();
		return ($SQLstatement->fetchAll());

	}




}
