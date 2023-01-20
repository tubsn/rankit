<main>

<a style="float:right" class="button" href="/cms/matches/create">Neues Spiel anlegen</a>

<h1><?=$page['title']?></h1>

<table class="fancy wide" style="margin-bottom:3em;">
<tr>
	<th>Datum</th>
	<th>Zeit</th>
	<th>Ansetzung</th>
	<th>Stand</th>
	<th>Stadion</th>
	<th>Bewerten</th>
	<th>Liga</th>
	<th style="text-align: right;">Löschen</th>
</tr>
<?php foreach ($matches as $match): ?>
	<tr>
		<td><?=formatDate($match['date'],'Y-m-d')?></td>
		<td><?=formatDate($match['date'],'H:i')?>&nbsp;Uhr</td>
		<td><a href="/cms/matches/<?=$match['id']?>"><?=$match['home_team']?> vs. <?=$match['away_team']?></a></td>
		<td><?=$match['home_goals'] ?? '-'?> : <?=$match['away_goals'] ?? '-'?></td>
		<td><?=$match['location']?></td>
		<td><a href="/cms/matches/<?=$match['id']?>/vote" class="button light vote-button">Spieler Bewerten</a></td>
		<td><?=$match['league']?> <?=$match['season']?></td>
		<td style="text-align: right;">
			<a id="del-match-<?=$match['id']?>" class="noline pointer"><img class="icon-delete" src="/styles/flundr/img/icon-delete-black.svg"></a>
			<fl-dialog selector="#del-match-<?=$match['id']?>" href="/cms/matches/<?=$match['id']?>/delete">
			<h1>Match: <?=$match['home_team']?> vs. <?=$match['away_team']?> - löschen?</h1>
			<p>Möchten Sie das Match wirklich löschen?</p>
			</fl-dialog>
		</td>
	</tr>
<?php endforeach ?>
</table>

<?php if (empty($matches)): ?>
	<p>- Aktuell sind noch keine Spiele angelegt -</p>
	<hr>
<?php endif ?>

<?php foreach ($leagues as $matches): ?>
<?php if (!empty($matches)): ?>
<h1><?=$matches[0]['league']?> <?=$matches[0]['season']?></h1>

<table class="fancy wide" style="margin-bottom:3em;">
<tr>
	<th>Datum</th>
	<th>Zeit</th>
	<th>Ansetzung</th>
	<th>Stand</th>
	<th>Stadion</th>
	<th>Bewerten</th>
	<th>Liga</th>
	<th style="text-align: right;">Löschen</th>
</tr>
<?php foreach ($matches as $match): ?>

	<tr>
		<td><?=formatDate($match['date'],'Y-m-d')?></td>
		<td><?=formatDate($match['date'],'H:i')?>&nbsp;Uhr</td>
		<td><a href="/cms/matches/<?=$match['id']?>"><?=$match['home_team']?> vs. <?=$match['away_team']?></a></td>
		<td><?=$match['home_goals'] ?? '-'?> : <?=$match['away_goals'] ?? '-'?></td>
		<td><?=$match['location']?></td>
		<td><a href="/cms/matches/<?=$match['id']?>/vote" class="button light vote-button">Spieler Bewerten</a></td>
		<td><?=$match['league']?> <?=$match['season']?></td>
		<td style="text-align: right;">
			<a id="del-match-<?=$match['id']?>" class="noline pointer"><img class="icon-delete" src="/styles/flundr/img/icon-delete-black.svg"></a>
			<fl-dialog selector="#del-match-<?=$match['id']?>" href="/cms/matches/<?=$match['id']?>/delete">
			<h1>Match: <?=$match['home_team']?> vs. <?=$match['away_team']?> - löschen?</h1>
			<p>Möchten Sie das Match wirklich löschen?</p>
			</fl-dialog>
		</td>
	</tr>
<?php endforeach ?>
</table>
<?php endif ?>
<?php endforeach ?>

</main>