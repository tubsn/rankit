<h1>Teams</h1>


<?php foreach ($teams as $team): ?>
<a href="/team/<?=$team['id']?>"><?=$team['name']?></a><br/>
<?php endforeach ?>

<h1>Spielerliste</h1>


<section style="display:flex; gap:3em;">

<?php foreach ($players as $player): ?>

<article style="max-width:300px" x-data="{ score: 3}">
<h2><?=$player['firstname']?> <?=$player['lastname']?></h2>
<?=dump($player)?>

<form action="/vote/<?=$player['id']?>" method="post">
<input x-model="score" class="range-slider" type="range" min="1" max="6" name="score"/>
<input x-model="score" type="number" min="1" max="6">

<button type="submit" class="mb">Vote</button>
</form>

</article>

<?php endforeach ?>

</section>

<script>
</script>

<style>
input[type=range].range-slider {width: 100%; margin: 5.5px 0; border:0; margin-bottom:1em; background-color: transparent; -webkit-appearance: none; margin-bottom:0;}
input[type=range].range-slider:focus {outline: none;}
input[type=range].range-slider::-webkit-slider-runnable-track {background: rgb(181, 181, 181); width: 100%; height: 7px; cursor: pointer; border-radius: 50px;}
input[type=range].range-slider::-webkit-slider-thumb {margin-top: -5.6px; width: 25px; height: 25px; background: #213e5e; border: 0; border-radius: 50px; cursor: pointer; -webkit-appearance: none;}
input[type=range].range-slider:focus::-webkit-slider-runnable-track {background: #45241f;}
input[type=range].range-slider::-moz-range-track {background: rgb(181, 181, 181); width: 100%; height: 7px; cursor: pointer; border-radius: 50px;}
input[type=range].range-slider::-moz-range-thumb {width: 25px; height: 25px; background: #213e5e; border: 0; border-radius: 50px; cursor: pointer;}
</style>