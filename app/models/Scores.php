<?php

namespace app\models;
use \flundr\database\SQLdb;
use \flundr\mvc\Model;

class Scores extends Model
{

	public function __construct() {

		$this->db = new SQLdb(DB_SETTINGS);
		$this->db->table = 'scores';

	}


	public function stats_by_day($days = 300, $limit='30') {

		$SQLstatement = $this->db->connection->prepare(
			"SELECT DATE_FORMAT(scores.date, '%Y-%m-%d') as date,
			count(scores.id) as votes, round(avg(score),1) as score
			FROM scores
			LEFT JOIN matches ON scores.match_id = matches.id
			WHERE scores.date >= (CURDATE() - INTERVAL $days DAY)
			AND (creator = 'fan')
			GROUP BY date
			ORDER BY date ASC
			LIMIT $limit"
		);

		$SQLstatement->execute();
		return $SQLstatement->fetchAll(\PDO::FETCH_GROUP|\PDO::FETCH_UNIQUE);

	}

	public function stats($days = 300, $limit = 10) {

		$SQLstatement = $this->db->connection->prepare(
			"SELECT DATE_FORMAT(scores.date, '%Y-%m-%d') as date,
			creator, scores.match_id, count(scores.id) as votes, avg(score) as score
			FROM scores
			LEFT JOIN matches ON scores.match_id = matches.id
			WHERE scores.date >= (CURDATE() - INTERVAL $days DAY)
			GROUP BY date, scores.match_id 
			ORDER BY date desc
			LIMIT $limit"
		);

		$SQLstatement->execute();
		return $SQLstatement->fetchAll(\PDO::FETCH_GROUP);

	}

	public function vote_stats() {

		$SQLstatement = $this->db->connection->prepare(
			"SELECT count(id) as hits FROM scores
			 WHERE date >= (CURDATE() - INTERVAL 1 MONTH)
			 AND (creator = 'fan')"
		);

		$SQLstatement->execute();
		return $SQLstatement->fetch()['hits'];

	}

	public function votes_avg() {

		$SQLstatement = $this->db->connection->prepare(
			"SELECT round(avg(score),1) as hits FROM scores
			 WHERE date >= (CURDATE() - INTERVAL 1 MONTH)
			 AND (creator = 'fan')"
		);

		$SQLstatement->execute();
		return $SQLstatement->fetch()['hits'];

	}


	public function previous_votes($userHash) {

		$SQLstatement = $this->db->connection->prepare(
			"SELECT match_id, player_id
			 FROM scores
			 WHERE hash = :userHash"
		);

		$SQLstatement->execute([':userHash' => $userHash]);
		return $SQLstatement->fetchAll(\PDO::FETCH_GROUP|\PDO::FETCH_COLUMN);

	}

	public function vote_already_cast($userHash, $matchID, $playerID) {

		if (empty($userHash) || $userHash == 'null') {
			$this->throttleIP();
			return false;
		}

		// User might have fiddled with the Cookie
		if (strlen($userHash) != 12) {$this->throttleIP();}

		$previousVotes = $this->previous_votes($userHash);
		if (!isset($previousVotes[$matchID])) {return false;}

		if (in_array($playerID, $previousVotes[$matchID])) {return true;}
		return false;

	}

	public function randomID() {
		$cleanNumber = preg_replace( '/[^0-9]/', '', microtime(false) );
		return str_pad(base_convert($cleanNumber, 10, 36),12,'?');
	}

	public function throttleIP() {
		// needs real IP throtteling :S
		usleep(1000000);
	}

}
