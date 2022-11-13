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


	public function development_chartdata($playerID) {

		$data = [];

		$fanData = $this->development($playerID, 'fan');
		$data['fan']['matches'] = $fanData;
		$data['fan']['chart']['dimension'] = array_column($fanData, 'enemy');
		$data['fan']['chart']['metric'] = array_column($fanData, 'scorediff');

		$editorData = $this->development($playerID, 'editor');
		$data['editor']['matches'] = $editorData;
		$data['editor']['chart']['dimension'] = array_column($editorData, 'enemy');
		$data['editor']['chart']['metric'] = array_column($editorData, 'scorediff');

		return json_encode($data, JSON_NUMERIC_CHECK);

	}

	public function development($playerID, $creator = 'fan') {

		$playerID = intval($playerID);

		$allowedCreators = ['fan','editor'];
		if (!in_array($creator, $allowedCreators)) {throw new \Exception("Creator not Allowed", 404);}

		$SQLstatement = $this->db->connection->prepare(
			"SELECT scores.match_id, count(scores.id) as votes,
				round(avg(scores.score),1) as score,
				DATE_FORMAT(matches.date, '%Y-%m-%d') as date,
				if(players.team_id = matches.home_team_id, 'home', 'away') as gametype,

				if (avg(scores.score) > 3.5,
					(round(avg(scores.score),1)-3.5)*-1,
					((round(avg(scores.score),1)-3.5)*-1)
				) as scorediff,
				if (teams.short, teams.short, teams.name) as enemy

			 FROM scores

			 LEFT JOIN matches ON matches.id = scores.match_id
			 LEFT JOIN players ON players.id = scores.player_id

			 LEFT JOIN teams ON teams.id = CASE WHEN players.team_id = matches.home_team_id
			 then matches.away_team_id else matches.home_team_id END

		 	 WHERE scores.player_id = :playerID
			 AND scores.creator = :creator
			 GROUP BY scores.match_id
			 ORDER BY date DESC"
		);

		$SQLstatement->execute([':playerID' => $playerID, ':creator' => $creator]);
		return ($SQLstatement->fetchAll(\PDO::FETCH_UNIQUE));

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
