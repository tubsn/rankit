<?php

namespace app\controller;
use flundr\mvc\Controller;

class Home extends Controller {

	public function __construct() {
		$this->view('DefaultLayout');
		$this->models('Players');
	}

	public function index() {

		dd($this->Players->get(1,1));

		$this->view->render('example');
	}

}
