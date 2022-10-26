<h1><?=$page['title']?></h1>

<ul>
<?php foreach ($locations as $location): ?>
	<li><a href="/cms/locations/<?=$location['id']?>"><?=$location['name']?></a> 
		<small>(<a href="/cms/locations/<?=$location['id']?>/delete">löschen</a>)</small>
	</li>
<?php endforeach ?>
</ul>

<a class="button" href="/cms/locations/create">Neues Stadion anlegen</a>
&ensp;
<a class="button light" href="/cms">zurück zum CMS</a>