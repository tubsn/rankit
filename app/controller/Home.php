<?php

namespace app\controller;
use flundr\mvc\Controller;

class Home extends Controller {

	public function __construct() {
		$this->view('DefaultLayout');
		$this->models('Players,Teams,Matches');
	}

	public function index() {

		$this->view->redirect('/frontend');
		/*
		$this->view->matches = $this->Matches->list();
		$this->view->title = 'Spielübersicht';
		$this->view->render('index');
		*/
	}

}
