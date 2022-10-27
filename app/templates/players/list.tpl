<h1><?=$page['title']?></h1>

<ul>
<?php foreach ($players as $player): ?>
	<li><a href="/cms/players/<?=$player['id']?>"><?=$player['firstname']?> <?=$player['lastname']?></a> 
		<small>(<a href="/cms/players/<?=$player['id']?>/delete">löschen</a>)</small>
	</li>
<?php endforeach ?>
</ul>

<a class="button" href="/cms/players/create">Neuen Spieler anlegen</a>
&ensp;
<a class="button light" href="/cms">zurück zum CMS</a>