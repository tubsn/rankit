<?php

namespace app\controller;
use flundr\mvc\Controller;

class CMS extends Controller {

	public function __construct() {
		$this->view('DefaultLayout');
		$this->models('Scores');
	}

	public function index() {

		/*
		$votes = $this->Scores->previous_votes('4xlbrn9ktxmh');

		dump($votes);

		if (in_array(6, $votes[3])) {

			echo "jo";

		}
		*/

		//dd(strlen($this->Scores->randomID()));



		$this->view->title = 'RankIT CMS';
		$this->view->render('cms');
	}

}
