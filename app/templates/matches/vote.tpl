<main>

<script defer type="text/javascript" src="https://unpkg.com/alpinejs@3.x.x/dist/cdn.min.js"></script>

<h1>Spieler Bewerten: <?=$match['home_team']?> Vs. <?=$match['away_team']?> vom <?=formatDate($match['date'],'d.m.Y')?></h1>

<style>
	form, form button {margin-bottom:0;}
	form button {color:#111;}
	form button[type="submit"]:hover, form button[type="submit"]:focus {background-color:#CECECE}
</style>

<table class="fancy wide" style="margin-bottom:2em;">
<thead><tr>
	<th>Thumb</th>
	<th>Spielername (Nummer)</th>
	<th>Position</th>
	<th>Leserwertung (Stimmen)</th>
	<th>Redaktion (Stimmen)</th>
	<th style="text-align: right;">Redaktionswertung abgeben</th>
	</tr>
</thead>
<tbody>
<?php foreach ($players as $player): ?>
<tr>
	<td style="position:relative">
		<img style="width:50px; " src="<?=$player['thumbnail']?>">
	</td>
	<td>
		<a href="/cms/players/<?=$player['id']?>"><?=$player['firstname']?> <?=$player['lastname']?>
		(<?=$player['number']?>)
		</a>
	</td>	
	<td><?=$player['position']?></td>
	<td><?=$player['score'] ?? '0'?> <small>(<?=$player['votes'] ?? '-'?>)</small></td>
	<td><?=$player['score_internal'] ?? '0'?> <small>(<?=$player['votes_internal'] ?? '-'?>)</small></td>
	<td style="text-align:right">
		<form action="/cms/matches/<?=$match['id']?>/vote/<?=$player['id']?>" method="post" x-data="{ score: 3}">
			<input x-model="score" name="score" type="hidden">
			<button @click="score=1" type="submit" class="score-bg-best">1</button>
			<button @click="score=2" type="submit" class="score-bg-good">2</button>
			<button @click="score=3" type="submit" class="score-bg-neutral">3</button>
			<button @click="score=4" type="submit" class="score-bg-bad">4</button>
			<button @click="score=5" type="submit" class="score-bg-worse">5</button>
			<button @click="score=6" type="submit" class="score-bg-worst">6</button>
		</form>
	</td>

</tr>
<?php endforeach ?>
</tbody>
</table>

<a href="/cms" class="button">zurück zur Übersicht</a>
</main>
