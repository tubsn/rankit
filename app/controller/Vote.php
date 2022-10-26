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

		$score = $_POST['score'];
		$matchID = $_POST['match_id'];
		$data = [
			'player_id' => $playerID,
			'match_id' => $matchID,
			'score' => $score,
			'creator' => 'fan',
		];

		$this->Scores->create($data);

		$this->view->redirect('/');

		//$this->view->render('example');

	}


}
