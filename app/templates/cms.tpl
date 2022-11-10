<h1><?=$page['title']?></h1>

<table class="fancy wide">
<tr>
	<th>Datum</th>
	<th>Zeit</th>
	<th>Ansetzung</th>
	<th>Stadion</th>
	<th>Bewerten</th>
	<th>Löschen</th>
</tr>
<?php foreach ($matches as $match): ?>

	<tr>
		<td><?=formatDate($match['date'],'Y-m-d')?></td>
		<td><?=formatDate($match['date'],'H:i')?> Uhr</td>
		<td><a href="/cms/matches/<?=$match['id']?>"><?=$match['home_team']?> Vs. <?=$match['away_team']?></a></td>
		<td><?=$match['location']?></td>
		<td><a href="/cms/matches/<?=$match['id']?>/vote" class="button">Spieler Bewerten</a></td>
		<td><small>(<a href="/cms/matches/<?=$match['id']?>/delete">löschen</a>)</small></td>
	</tr>
<?php endforeach ?>
</table>

<a class="button" href="/cms/matches/create">Neues Spiel anlegen</a>

<hr>


<p>Weitere Optionen</p>

<a href="/cms/teams">Team Verwaltung</a> <br>
<a href="/cms/locations">Stadien Verwaltung</a> <br>
<a href="/cms/players">Spieler Verwaltung</a>

<br><br>

<a class="button" href="/">zur Seite</a>
