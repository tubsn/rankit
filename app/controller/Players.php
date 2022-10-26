<?php

namespace app\controller;
use flundr\mvc\Controller;

class Players extends Controller {

	public function __construct() {
		$this->view('DefaultLayout');
		$this->models('Players,Teams,Matches');
	}

	public function list($id = 1) {
		$this->view->teams = $this->Teams->all();
		$this->view->players = $this->Players->team($id);
		$this->view->render('player-list');
	}

	public function match($id) {
		//$this->view->matches = $this->Matches->all();
		$this->view->players = $this->Players->match($id);
		$this->view->render('player-list');

	}

	public function get($id) {

		dd($this->Players->get($id));

		//$this->view->render('example');
	}

}
