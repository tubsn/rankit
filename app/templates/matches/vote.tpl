<h1>Spieler Bewerten: <?=$match['home_team']?> Vs. <?=$match['away_team']?></h1>


<table class="fancy wide">
<thead><tr>
	<th>Nummer</th>
	<th>Name</th>
	<th>Position</th>
	<th>Leserwertung</th>
	<th>Stimmen</th>
	<th>Redaktion (Stimmen)</th>
	<th>Benoten</th>
	</tr>
</thead>
<tbody>
<?php foreach ($players as $player): ?>
<tr>
	<td><?=$player['number']?></td>
	<td><?=$player['firstname']?> <?=$player['lastname']?></td>
	<td><?=$player['position']?></td>
	<td><?=$player['score'] ?? '0'?></td>
	<td><?=$player['votes'] ?? '0'?></td>
	<td><?=$player['score_internal'] ?? '0'?> (<?=$player['votes_internal'] ?? '0'?>)</td>
	<td>
		<form action="/cms/matches/<?=$match['id']?>/vote/<?=$player['id']?>" method="post" x-data="{ score: 3}">
			<input x-model="score" name="score" type="hidden">
			<button @click="score=1" type="submit" class="mb">1</button>
			<button @click="score=2" type="submit" class="mb">2</button>
			<button @click="score=3" type="submit" class="mb">3</button>
			<button @click="score=4" type="submit" class="mb">4</button>
			<button @click="score=5" type="submit" class="mb">5</button>
			<button @click="score=6" type="submit" class="mb">6</button>
		</form>
	</td>

</tr>
<?php endforeach ?>
</tbody>
</table>

<a href="/cms" class="button">zurück zur Übersicht</a>