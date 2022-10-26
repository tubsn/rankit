<h1><?=$page['title']?></h1>

<ul>
<?php foreach ($matches as $match): ?>
	<li><a href="/match/<?=$match['id']?>/<?=urlencode($match['home_team'].'-vs-'.$match['away_team'])?>"><?=$match['home_team']?> VS. <?=$match['away_team']?> | <?=$match['date']?></a>
	</li>
<?php endforeach ?>
</ul>


<a class="button" href="/cms">Admin</a>
