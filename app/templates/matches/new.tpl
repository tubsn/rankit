<main>
<h1><?=$page['title']?></h1>

<script defer type="text/javascript" src="https://unpkg.com/alpinejs@3.x.x/dist/cdn.min.js"></script>

<script>
document.addEventListener('alpine:init', () => {
	Alpine.data('playerSelectApp', () => ({

		players: [],
		awayPlayers: [],
		homePlayers: [],
		home_team_id: null,
		away_team_id: null,
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


<form method="post" action="" x-data="playerSelectApp()">

	<fieldset style="display:flex; gap:2em;">
	<label>Datum:
		<input type="date" value="" name="date">
	</label>
	<label>Uhrzeit:
		<input type="time" value="" name="time">
	</label>

	<label>Stadion:
	<select name="location_id">
		<option value="0">offen</option>
		<?php foreach ($locations as $location): ?>
		<option value="<?=$location['id']?>"><?=$location['name']?> | <?=$location['city']?></option>
		<?php endforeach ?>
	</select>
	</label>

	<label>Liga / Saison:
	<select name="league_id">
		<?php foreach ($leagues as $league): ?>
		<option <?php if ($league['id'] == DEFAULT_LEAGUE_ID): ?>selected <?php endif ?>value="<?=$league['id']?>"><?=$league['name']?> <?=$league['season']?></option>
		<?php endforeach ?>
	</select>
	</label>

	<label>Bewertungssteuerung:
	<select name="votemode">
		<option value="auto">automatik (7Tage)</option>
		<option value="on">Voting offen</option>
		<option value="off">Voting gesperrt</option>
	</select>
	</label>

	</fieldset>

	<fieldset style="display:flex; gap:2em;">

	<label>Tore Heimteam:
		<input type="number" name="home_goals">
	</label>

	<label>Heimteam:
		<select name="home_team_id" x-model="home_team_id" @change="homePlayers = await (await fetch('/team/'+home_team_id+'/players')).json(); players = []">
		<option value="0">offen</option>
		<?php foreach ($teams as $team): ?>
		<option value="<?=$team['id']?>" <?php if ($team['highlight'] == 1): ?> class="highlight"<?php endif ?>><?=$team['name']?></option>
		<?php endforeach; ?>
		</select>
	</label>

	<label>Auswärtsteam:
		<select name="away_team_id" x-model="away_team_id" @change="awayPlayers = await (await fetch('/team/'+away_team_id+'/players')).json(); players = []">
		<option value="0">offen</option>
		<?php foreach ($teams as $team): ?>
		<option value="<?=$team['id']?>" <?php if ($team['highlight'] == 1): ?> class="highlight"<?php endif ?>><?=$team['name']?></option>
		<?php endforeach; ?>
		</select>
	</label>

	<label>Tore Auswärtsteam:
		<input type="number" name="away_goals">
	</label>

	</fieldset>

	<label>Notizen zum Spiel
		<div class="note-box">
			<textarea name="info" placeholder="z.B. Spieler XY außer Wertung weil eingewechselt..."></textarea>
		</div>
	</label>





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
							<div class="player-number" x-text="`${player.number}. ${player.position}`"></div>
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
							<div class="player-number" x-text="`${player.number}. ${player.position}`"></div>
							<div class="player-name" x-text="`${player.firstname} ${player.lastname}`"></div>
							<div class="player-position" x-text="`${player.team_short}`"></div>
						</div>
					</div>
				</label>
			</li>
	    </template>
	</ul>
</fieldset>

<button type="submit">Spiel anlegen</button>
&ensp;
<a class="button light" href="/cms">abbrechen und zurück</a>

</form>
</main>