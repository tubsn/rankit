<main>

<a style="float:right" class="button light" href="/cms/matches/<?=$match['id']?>/vote">zur Spieler Bewertung</a>

<h1><?=$page['title']?></h1>

<script defer type="text/javascript" src="https://unpkg.com/alpinejs@3.x.x/dist/cdn.min.js"></script>

<script>
document.addEventListener('alpine:init', () => {
	Alpine.data('playerSelectApp', () => ({

		players: [<?=$match['players']?>],
		awayPlayers: [],
		homePlayers: [],
		home_team_id: <?=$match['home_team_id']?>,
		away_team_id: <?=$match['away_team_id']?>,
		selectionToggle: false,

		selectAllPlayers() {

			if (this.players.length > 0) {this.selectionToggle = true;}
			if (this.selectionToggle) {
				this.players = []; 
				this.selectionToggle = !this.selectionToggle;
				return;
			}

			this.players = this.allPlayerIDs();
			this.selectionToggle = !this.selectionToggle;
			
		},

		allPlayerIDs() {
			let extractColumn = (arr, column) => arr.map(x=>x[column]);
			let awayPlayerIDs = extractColumn(this.awayPlayers,'id');
			let homePlayerIDs = extractColumn(this.homePlayers,'id');
			return homePlayerIDs.concat(awayPlayerIDs);
		},

		playerCount() {return this.players.length;},
	}))
})

</script>

<form method="post" action="" x-data="playerSelectApp()" 
x-init="awayPlayers = await (await fetch('/team/'+away_team_id+'/players')).json();
 		homePlayers = await (await fetch('/team/'+home_team_id+'/players')).json()">

<fieldset style="display:flex; gap:2em;">
<label>Datum:
	<input type="date" value="<?=formatDate($match['date'], 'Y-m-d')?>" name="date">
</label>
<label>Uhrzeit:
	<input type="time" value="<?=formatDate($match['date'], 'H:i')?>" name="time">
</label>

<label>Stadion:
<select name="location_id">
	<option value="0">offen</option>
	<?php if ($match['location_id']): ?>
	<option selected value="<?=$match['location_id']?>"><?=$match['location']?> | <?=$match['city']?></option>
	<?php endif ?>
	<?php foreach ($locations as $location): ?>
	<?php if ($match['location_id'] == $location['id']) {continue;} ?>
	<option value="<?=$location['id']?>"><?=$location['name']?> | <?=$location['city']?></option>
	<?php endforeach ?>
</select>
</label>

<label>Liga / Saison:
<select name="league_id">
	<?php if ($match['league_id']): ?>
	<option selected value="<?=$match['league_id']?>"><?=$match['league']?> <?=$match['season']?></option>
	<?php endif ?>
	<?php foreach ($leagues as $league): ?>
	<?php if ($match['league_id'] == $league['id']) {continue;} ?>
	<option value="<?=$league['id']?>"><?=$league['name']?> <?=$league['season']?></option>
	<?php endforeach ?>
</select>
</label>


<label>Bewertungssteuerung:
<select name="votemode">
	<option <?=($match['votemode'] == 'auto') ? 'selected ' : ''?>value="auto">automatik (7Tage)</option>
	<option <?=($match['votemode'] == 'on') ? 'selected ' : ''?>value="on">Voting offen</option>
	<option <?=($match['votemode'] == 'off') ? 'selected ' : ''?>value="off">Voting gesperrt</option>
</select>
</label>




</fieldset>

<fieldset style="display:flex; gap:2em;">

<label>Tore Heimteam:
	<input type="number" value="<?=$match['home_goals']?>" name="home_goals">
</label>

<label>Heimteam:
	<select name="home_team_id" x-model="home_team_id" @change="homePlayers = await (await fetch('/team/'+home_team_id+'/players')).json(); players = []">
	<option value="0">offen</option>
	<?php if ($match['home_team_id']): ?>
	<option selected value="<?=$match['home_team_id']?>" <?php if ($match['home_team_highlight'] == 1): ?> class="highlight"<?php endif ?>><?=$match['home_team']?></option>
	<?php endif ?>
	<?php foreach ($teams as $team): ?>
	<?php if ($match['home_team_id'] == $team['id']) {continue;} ?>
	<option value="<?=$team['id']?>" <?php if ($team['highlight'] == 1): ?> class="highlight"<?php endif ?>><?=$team['name']?></option>
	<?php endforeach; ?>
	</select>
</label>

<label>Auswärtsteam:
	<select name="away_team_id" x-model="away_team_id" @change="awayPlayers = await (await fetch('/team/'+away_team_id+'/players')).json(); players = []">
	<option value="0">offen</option>
	<?php if ($match['away_team_id']): ?>
	<option selected value="<?=$match['away_team_id']?>" <?php if ($match['away_team_highlight'] == 1): ?> class="highlight"<?php endif ?>><?=$match['away_team']?></option>
	<?php endif ?>
	<?php foreach ($teams as $team): ?>
	<?php if ($match['away_team_id'] == $team['id']) {continue;} ?>
	<option value="<?=$team['id']?>" <?php if ($team['highlight'] == 1): ?> class="highlight"<?php endif ?>><?=$team['name']?></option>
	<?php endforeach; ?>
	</select>
</label>



<label>Tore Auswärtsteam:
	<input type="number" value="<?=$match['away_goals']?>" name="away_goals">
</label>

</fieldset>


<fieldset>
<label>Notizen zum Spiel (optional):
	<div class="note-box">
	<textarea name="info" placeholder="z.B. Spieler XY außer Wertung weil eingewechselt..."><?=$match['info']?></textarea>
	</div>
</label>
</fieldset>


<h3 x-text="`Ausgewählte Spieler (${playerCount()}/18):`">Ausgewählte Spieler:</h3>

<fieldset class="player-box">
<button class="select-all-button light" type="button" @click="selectAllPlayers()">alle aktivieren / deaktivieren</button>
	<ul class="player-list">

		<template x-for="player in homePlayers">
			<li class="home-players">
				<label class="js-player"> 
					<input class="js-checkbox" type="checkbox" name="players[]" x-bind:value="player.id" x-model="players">
					<div class="player-container">
						<img class="player-thumbnail" :src="player.thumbnail">
						<div class="player-info">
							<div class="player-number" x-text="`#${player.number} ${player.position}`"></div>
							<div class="player-name" x-text="`${player.firstname} ${player.lastname}`"></div>
							<div class="player-position" x-text="`${player.team_short}`"></div>
						</div>
					</div>
				</label>
			</li>
		</template>

		<template x-for="player in awayPlayers">
			<li>
				<label class="js-player"> 
					<input class="js-checkbox" type="checkbox" name="players[]" x-bind:value="player.id" x-model="players">
					<div class="player-container">
						<img class="player-thumbnail" :src="player.thumbnail">
						<div class="player-info">
							<div class="player-number" x-text="`#${player.number} ${player.position}`"></div>
							<div class="player-name" x-text="`${player.firstname} ${player.lastname}`"></div>
							<div class="player-position" x-text="`${player.team_short}`"></div>
						</div>
					</div>
				</label>
			</li>
	    </template>

	</ul>
</fieldset>


<button type="submit">Spiel speichern</button>
&ensp;
<a class="button light" href="/cms">abbrechen und zurück</a>	

</form>
</main>