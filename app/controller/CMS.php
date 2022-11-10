<?php

namespace app\controller;
use flundr\mvc\Controller;

class CMS extends Controller {

	public function __construct() {
		$this->view('DefaultLayout');
		$this->models('Scores,Matches');
	}

	public function index() {

		$this->view->matches = $this->Matches->list();

		$this->view->title = 'RankIT CMS';
		$this->view->render('cms');
	}

}
