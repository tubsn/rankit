<?php

namespace app\controller;
use flundr\mvc\Controller;

class Home extends Controller {

	public function __construct() {
		$this->view('DefaultLayout');
	}

	public function index() {
		$this->view->redirect('/frontend');
	}

}
