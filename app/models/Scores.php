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

		if (empty($userHash)) {return false;}


		$previousVotes = $this->previous_votes($userHash);
		if (!isset($previousVotes[$matchID])) {return false;}


		if (in_array($playerID, $previousVotes[$matchID])) {return true;}
		return false;

	}

	public function randomID () {
		$cleanNumber = preg_replace( '/[^0-9]/', '', microtime(false) );
		return base_convert($cleanNumber, 10, 36);
	}

}
