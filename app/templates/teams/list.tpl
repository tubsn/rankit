<h1><?=$page['title']?></h1>

<ul>
<?php foreach ($teams as $team): ?>
	<li><a href="/cms/teams/<?=$team['id']?>"><?=$team['name']?></a> 
		<small>(<a href="/cms/teams/<?=$team['id']?>/delete">löschen</a>)</small>
	</li>
<?php endforeach ?>
</ul>

<a class="button" href="/cms/teams/create">Neues Team anlegen</a>
&ensp;
<a class="button light" href="/cms">zurück zum CMS</a>