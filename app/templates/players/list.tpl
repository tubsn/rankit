<main>

<a class="button fright" href="/cms/players/create">Neuen Spieler anlegen</a>

<h1><?=$page['title']?></h1>


<table class="fancy wide">
<tr>
	<th>ID</th>
	<th>Spielername</th>
	<th>Verein</th>
	<th>Position</th>
	<th>Trikotnummer</th>
	<th>Geburtstag</th>
	<th style="text-align: right;">Löschen</th>
</tr>
<?php foreach ($players as $player): ?>
	<tr>
		<td><?=$player['id']?></td>
		<td><a href="/cms/players/<?=$player['id']?>"><?=$player['firstname']?> <?=$player['lastname']?></td>
		<td><?=$player['team']?></a></td>
		<td><?=$player['position']?></a></td>
		<td><?=$player['number']?></a></td>
		<td><?=$player['birthday']?></a></td>
		<td style="text-align: right;">
			<a id="del-player-<?=$player['id']?>" class="noline pointer"><img class="icon-delete" src="/styles/flundr/img/icon-delete-black.svg"></a>
			<fl-dialog selector="#del-player-<?=$player['id']?>" href="/cms/players/<?=$player['id']?>/delete">
				<h1><?=$player['firstname']?> <?=$player['lastname']?> - löschen?</h1>
				<p>Möchten Sie den Spieler wirklich löschen?</p>
			</fl-dialog>
		</td>
	</tr>
<?php endforeach ?>
</table>


</main>