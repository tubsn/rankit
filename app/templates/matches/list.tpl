<h1><?=$page['title']?></h1>

<ul>
<?php foreach ($matches as $match): ?>
	<li><a href="/cms/matches/<?=$match['id']?>"><?=$match['home_team']?> VS. <?=$match['away_team']?> | <?=$match['date']?></a>
		<small>(<a href="/cms/matches/<?=$match['id']?>/delete">löschen</a>)</small>
	</li>
<?php endforeach ?>
</ul>

<a class="button" href="/cms/matches/create">Neues Spiel anlegen</a>
&ensp;
<a class="button light" href="/cms">zurück zum CMS</a>
