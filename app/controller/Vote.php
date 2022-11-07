<?php

namespace app\controller;
use flundr\mvc\Controller;

class Vote extends Controller {

	public function __construct() {
		$this->view('DefaultLayout');
		$this->models('Scores');
	}

	public function index() {

		$data = [
			'player_id' => 1,
			'match_id' => 1,
			'score' => 13,
			'creator' => 'fan',
		];

		$this->Scores->create($data);


	}

	public function cast($playerID) {

		$score = intval($_POST['score']);
		$matchID = intval($_POST['match_id']);
		$userHash = $_POST['hash'] ?? null;

		$voteInvalid = $this->Scores->vote_already_cast($userHash,$matchID,$playerID);
		if ($voteInvalid || !in_array($score, range(1,6))) {
			throw new \Exception("Vote not accepted", 404);
		}

		if (empty($userHash) || $userHash == 'null') {
			$userHash = $this->Scores->randomID();
		}

		$data = [
			'player_id' => $playerID,
			'match_id' => $matchID,
			'score' => $score,
			'hash' => $userHash,
			'creator' => 'fan',
		];

		$this->Scores->create($data);
		$this->view->json($userHash);

	}


}
