<?php

namespace app\views;
use \flundr\mvc\views\htmlView;

class DefaultLayout extends htmlView {

	// Page Header Information is available in the Templates
	// as a $page Array. It can be accessed via $page['title']

	public $title = 'RankIT-CMS';
	public $description = 'Spielerranking';
	public $css = ['/styles/flundr/css/defaults.css', '/styles/css/ri-backend.css'];
	public $fonts = 'https://fonts.googleapis.com/css?family=Fira+Sans:400,400i,600|Fira+Sans+Condensed:400,600';
	public $js = '/styles/js/rankit-backend.js';
	public $framework = ['/styles/flundr/components/fl-dialog.js', 'https://cdn.jsdelivr.net/npm/apexcharts'];
	//'https://unpkg.com/alpinejs@3.x.x/dist/cdn.min.js'

	public $meta = [
		'author' => 'flundr',
		'robots' => 'index, follow',
		'favicon' => '/styles/flundr/img/flundr-logo.svg',
	];

	// Place the Templateblocks to build your Page here.
	// The "main" Section is usually overwritten in the Controller in the Render function.
	// You can add as many template Blocks as you like or none, if you are just using one "main" template.

	public $templates = [
		'tinyhead' => 'layout/html-doc-header',
		'header' => 'layout/nav',
		'main' => null,
		'footer' => 'layout/footer',
		'tinyfoot' => 'layout/html-doc-footer',
	];

}
