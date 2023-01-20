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


	public function get($id, $columns = null) {

		$SQLstatement = $this->db->connection->prepare(
			"SELECT players.*, TIMESTAMPDIFF(YEAR, players.birthday, CURDATE()) AS age, teams.name as team,

				(
					SELECT round(avg(score),1) FROM scores
					WHERE scores.player_id = :ID
					AND creator = 'fan'
					AND scores.date > NOW() - INTERVAL 12 MONTH
				) as score,

				(
					SELECT count(score) FROM scores
					WHERE scores.player_id = :ID
					AND creator = 'fan'
					AND scores.date > NOW() - INTERVAL 12 MONTH
				) as votes,

				(
					SELECT round(avg(score),1) FROM scores
					WHERE scores.player_id = :ID
					AND creator = 'editor'
					AND scores.date > NOW() - INTERVAL 12 MONTH
				) as score_internal,

				(
					SELECT count(score) FROM scores
					WHERE scores.player_id = :ID
					AND creator = 'editor'
					AND scores.date > NOW() - INTERVAL 12 MONTH
				) as votes_internal


			 FROM players
			 LEFT JOIN teams on teams.id = players.team_id
			 WHERE players.id = :ID
			 "
		);

		$SQLstatement->execute([':ID' => $id]);
		return ($SQLstatement->fetch());

	}


	public function development_chartdata($playerID, $leagueID = DEFAULT_LEAGUE_ID) {

		$fanData = $this->development($playerID, 'fan', $leagueID);
		$editorData = $this->development($playerID, 'editor', $leagueID);

		$chart = [];
		foreach ($fanData as $key => $set) {
			$chart['matchID'][$key] = $key;
			$chart['enemy'][$key] = $set['enemy'];
			$chart['gametype'][$key] = $set['gametype'];
			$chart['date'][$key] = $set['date'];
			$chart['fanscore'][$key] = $set['scorediff'];
			$chart['editorscore'][$key] = null;
		}

		foreach ($editorData as $key => $set) {
			$chart['matchID'][$key] = $key;
			$chart['enemy'][$key] = $set['enemy'];
			$chart['gametype'][$key] = $set['gametype'];
			$chart['date'][$key] = $set['date'];
			$chart['editorscore'][$key] = $set['scorediff'];
			if (empty($chart['fanscore'][$key])) {$chart['fanscore'][$key] = null;}
		}

		$chart['matchID'] = array_values($chart['matchID']);
		$chart['gametype'] = array_values($chart['gametype']);
		$chart['date'] = array_values($chart['date']);
		$chart['enemy'] = array_values($chart['enemy']);
		$chart['editorscore'] = array_values($chart['editorscore']);
		$chart['fanscore'] = array_values($chart['fanscore']);

		return json_encode($chart, JSON_NUMERIC_CHECK);

	}

	public function development($playerID, $creator = 'fan', $leagueID = DEFAULT_LEAGUE_ID) {

		$playerID = intval($playerID);
		$leagueID = intval($leagueID);

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
				if (teams.short IS NULL or teams.short = '', teams.name, teams.short) as enemy

			 FROM scores

			 LEFT JOIN matches ON matches.id = scores.match_id
			 LEFT JOIN players ON players.id = scores.player_id

			 LEFT JOIN teams ON teams.id = CASE WHEN players.team_id = matches.home_team_id
			 then matches.away_team_id else matches.home_team_id END

		 	 WHERE scores.player_id = :playerID
			 AND scores.creator = :creator
			 AND matches.league_id = $leagueID

			 GROUP BY scores.match_id
			 ORDER BY date ASC"
		);

		$SQLstatement->execute([':playerID' => $playerID, ':creator' => $creator]);
		return ($SQLstatement->fetchAll(\PDO::FETCH_UNIQUE));

	}


	public function by_match($matchID, $playerIDs) {

		// Query won't work with null IDs
		if (empty($playerIDs)) {$playerIDs = 0;}

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
			 ORDER BY players.lastname
			 "
		);

		$SQLstatement->execute();
		$players = $SQLstatement->fetchAll();
		return $this->group_sort($players);

	}


	public function list() {

		$SQLstatement = $this->db->connection->prepare(
			"SELECT players.*, teams.name as team
			 FROM players
			 LEFT JOIN teams on teams.id = players.team_id"
		);

		$SQLstatement->execute();
		return ($SQLstatement->fetchAll());

	}

	public function team($teamID) {

		$SQLstatement = $this->db->connection->prepare(
			"SELECT players.*, teams.name as team, teams.short as team_short,

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
			 ORDER BY team, players.lastname
			 "
		);

		$SQLstatement->execute();
		$players = $SQLstatement->fetchAll();
		return $this->group_sort($players);

	}


	public function group_sort($players) {

		$positions = ['tor', 'abwehr', 'mittelfeld', 'angriff'];
		$sorted = [];

		foreach ($positions as $position) {

			$set = array_filter($players, function($player) use ($position) {
				if (strTolower($player['position']) == $position) {
					return $player;
				}
			});

			$sorted = array_merge($sorted, $set);

		}

		$rest = array_filter($players, function($player) use ($positions) {
			if (!in_array(strTolower($player['position']), $positions) ) {
				return $player;
			}
		});

		return array_merge($sorted, $rest);

	}

}
