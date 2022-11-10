class RankItApp {

	constructor(container, matchID) {
		this.matchID = matchID || null;
		this.apiPath = 'https://rankit.lr-digital.de';
		this.container = container;
		this.scrollContainer = null;
		this.header = null;
		this.main = null;
		this.footer = null;
		this.matchdata = [];
		this.matches = [];
		this.playerdata = [];
		this.dateParser = new FlundrDateParser();
		this.prefix = 'ri-';
		this.castVotes = [];
		this.voteCookie = null;
		this.voteCookieName = 'rankit';
		this.voteCookieDuration = 7;
		this.userHash = null;

		this.init();
	}

	async init() {

		this.prepareContainer();
		this.checkCookie();

		await this.loadMatches();
		await this.loadMatchData(this.matchID);

		this.fillContainer();
		this.refreshMain();

	}

	fillContainer() {

		this.header = this.createHeader();
		this.main = this.createMain();
		this.footer = this.createFooter();

		this.header.appendChild(this.matchlist());

		this.container.appendChild(this.header);
		this.container.appendChild(this.main);
		this.container.appendChild(this.footer);

	}

	prepareContainer() {
		this.container.classList.add(this.prefix + 'app');
		if (this.matchID) {this.container.id = this.prefix + 'match-' + this.matchID;}
	}


	refreshMain() {

		let scrollPosition = 0;
		if (this.scrollContainer) {scrollPosition = this.scrollContainer.scrollTop;}

		this.main.innerHTML = '';
		this.main.appendChild(this.matchDetail());

		if (this.scrollContainer) {this.scrollContainer.scrollTop = scrollPosition;}

	}

	matchlist() {

		let el = document.createElement('ul');
		el.classList.add(this.prefix + 'match-list-container');

		this.matches.forEach((match) => {

			let entryElement = document.createElement('li');
			entryElement.classList.add(this.prefix + 'match-list-entry');
			if (this.matchID == match.id) {entryElement.classList.add(this.prefix + 'match-active');}

			entryElement.dataset.id = match.id;
			entryElement.innerHTML = `
			<span class="${this.prefix}match-date">${this.gsd(match.date)}</span>
			<span class="${this.prefix}match-teams" title="${match.home_team} vs. ${match.away_team}">${match.home_team} vs. ${match.away_team}</span>
			`;

			entryElement.addEventListener('click', () => {
				if (entryElement.dataset.id == this.matchID) {
					this.refreshMain();
					return;
				}
				this.loadMatchData(entryElement.dataset.id).then(() => { this.refreshMain()	})

				el.childNodes.forEach((child) => { child.classList.remove(this.prefix + 'match-active')});
				entryElement.classList.add(this.prefix + 'match-active');
			})

			el.appendChild(entryElement);
		});

		return el;

	}

	matchDetail() {

		let info = '';
		let match = this.matchdata;
		let el = document.createElement('article');
		el.classList.add(this.prefix + 'match-detail');

		if (match.info != null && match.info != '') {
			info = `<p class="${this.prefix}match-info">${match.info}</p>`;
		}

		el.innerHTML = `
		<div class="${this.prefix}match-header">
			<h1>${match.home_team} <span class="${this.prefix}versus">vs.</span> ${match.away_team}</h1>
			<p>${match.location || 'Spielort offen'} <span class="${this.prefix}bar">|</span> ${this.gd(match.date)} ${this.time(match.date)} Uhr</p>
			${info} 
		</div>`;

		el.appendChild(this.playerList());

		this.scrollContainer = el;
		return el;

	}


	playerList() {

		let players = this.matchdata.players;
		let el = document.createElement('div');
		el.classList.add(this.prefix + 'player-list');

		players.forEach((player) => {
			let entryElement = document.createElement('div');
			entryElement.classList.add(this.prefix + 'player-list-entry');
			entryElement.dataset.id = player.id;
			entryElement.appendChild(this.playerTPL(player));
			el.appendChild(entryElement);
		});

		return el;

	}


	playerTPL(player, voting) {

		let number;
		if (player.number == 0) { number = '';}
		else {number = '#' + player.number;}

		if (!player.thumbnail) {player.thumbnail = 'https://rankit.lr-digital.de/assets/default.svg';}

		let el = document.createElement('div');
		el.classList.add(this.prefix + 'player-box');
		el.innerHTML = `

		<figure class="${this.prefix}player-image"><img src="${player.thumbnail}"></figure>
		<div class="${this.prefix}player-info">
			<div class="${this.prefix}player-name">${player.firstname} ${player.lastname}&nbsp;<small>${number}</small></div>
			<div class="${this.prefix}player-stats">Position: <span class="${this.prefix}player-position">${player.position || 'keine'}</span> Alter: ${player.age}</div>
			<div class="${this.prefix}player-verein">Verein: ${player.team}</div>
		</div>

		<div class="${this.prefix}player-score">
			<div class="${this.prefix}player-score-number ${this.scoreClass(player.score)}">${player.score || '-'}</div>
			<div>Leserwertung</div>
			<div class="${this.prefix}player-score-votes">Stimmen: ${player.votes || 'keine'}</div>
		</div>

		<div class="${this.prefix}player-score ${this.prefix}player-score-editor">
			<div class="${this.prefix}player-score-number ${this.scoreClass(player.score_internal)}">${player.score_internal || '-'}</div>
			<div>Redaktion</div>
		</div>

		`;

		el.addEventListener('click', (e) => {
			if (e.target.classList.contains(`${this.prefix}player-name`)) {
				this.playerStatsTPL(player.id);
			}
		})

		el.appendChild(this.voteTPL(player.id));
		return el;

	}


	async playerStatsTPL(id) {

		await this.loadPlayerData(id)
		let player = this.playerdata;

		let number;
		if (player.number == 0) { number = '';}
		else {number = '#' + player.number;}

		let tpl = `<div class="${this.prefix}player-detail">
		<h3>Wertung der letzten Spiele:</h3>

		<div class="ri-player-list-entry" style="margin-bottom:.5em;">

		<div class="${this.prefix}player-box">
		<figure class="${this.prefix}player-image"><img src="${player.thumbnail}"></figure>
		<div class="${this.prefix}player-info">
			<div class="${this.prefix}player-name">${player.firstname} ${player.lastname}&nbsp;<small>${number}</small></div>
			<div class="${this.prefix}player-stats">Position: <span class="${this.prefix}player-position">${player.position || 'keine'}</span> Alter: ${player.age}</div>
			<div class="${this.prefix}player-verein">Verein: ${player.team}</div>
		</div>

		<div class="${this.prefix}player-score">
			<div class="${this.prefix}player-score-number ${this.scoreClass(player.score)}">${player.score || '-'}</div>
			<div>Leserwertung</div>
			<div class="${this.prefix}player-score-votes">Stimmen: ${player.votes || 'keine'}</div>
		</div>

		<div class="${this.prefix}player-score ${this.prefix}player-score-editor">
			<div class="${this.prefix}player-score-number ${this.scoreClass(player.score_internal)}">${player.score_internal || '-'}</div>
			<div>Redaktion</div>
		</div>
		</div>

		</div>

		<div class="ri-player-list-entry" style="margin-bottom:1em;">
		<div class="chart" style="width:90%; margin:0 auto; " id="chart"></div>
		</div>

		</div>

		`;

		this.main.innerHTML = tpl;

		this.testchart();

	}



	scoreClassWithBackground(score) {return this.scoreClass(score,true);}

	scoreClass(score, bg = false) {

		let color = `${this.prefix}score-`;
		if (bg) {color += 'bg-';}

		if (score > 0 && score < 1.5) {color += 'best';}
		else if (score >= 1.5 && score <= 2.5) {color += 'good';}
		else if (score > 2.5 && score <= 3.5) {color += 'neutral';}
		else if (score > 3.5 && score < 4.5) {color += 'bad';}
		else if (score >= 4.5 && score <= 5.5) {color += 'worse';}
		else if (score >= 5.5 && score <= 10) {color += 'worst';}
		else {color = '';}

		return color;

	}


	voteNotAvailable() {

		let matchDate = new Date(this.matchdata.date);
		let now = new Date();

		if (matchDate > now) {return true;}
		return false;

	}

	voteTimePassed() {

		let matchDate = new Date(this.matchdata.date);
		let date = new Date();
		date.setDate(date.getDate() - 7);

		if (matchDate < date) {return true;}
		return false;

	}

	voteTPL(playerID) {

		let el = document.createElement('div');
		el.classList.add(this.prefix + 'vote-container');

		if (this.voteTimePassed()) {
			el.innerHTML = `<div class="${this.prefix}vote-denied">Zeitraum abgelaufen</div>`; return el;
		}

		if (this.voteNotAvailable()) {
			el.innerHTML = `<div class="${this.prefix}vote-denied">Wertung noch nicht möglich</div>`; return el;
		}

		if (this.castVotes[this.matchID] && this.castVotes[this.matchID].includes(playerID)) {
			el.innerHTML = `<div class="${this.prefix}vote-is-cast">Bewertung gespeichert</div>`; return el;
		}

		el.title = 'Schulnoten: 1 super - 6 schlecht'
		let voteOptions = [1,2,3,4,5,6];

		voteOptions.forEach((value) => {
			let button = document.createElement('button');
			button.classList.add(this.prefix + 'vote-button');
			button.classList.add(this.scoreClassWithBackground(value));
			button.innerText = value;
			button.dataset.playerId = playerID;
			button.dataset.value = value;

			button.addEventListener('click', () => {
				this.castVote(playerID, value, el);
			})

			el.appendChild(button);
		});

		return el;

	}


	async castVote(playerID, value, voteContainer) {

		let voteFailed = false;
		let requestURL = this.apiPath + '/vote/' + playerID;

		let postData = new FormData();
		postData.append('match_id', this.matchID);
		postData.append('hash', this.userHash);
		postData.append('score', value);

		let voteHash;
		await axios.post(requestURL,postData)
		.then(function (response) {
			voteHash = response.data;
		}).catch(err => {
			console.log('RankIT - Vote already Cast: ' + err.message);
			voteContainer.innerHTML = `<div class="${this.prefix}vote-error">Sie haben bereits abgestimmt</div>`;
			voteFailed = true;
		})

		if (voteFailed) {return false;}

		if (!this.userHash) {
			this.voteCookie.content = voteHash;
			this.userHash = voteHash;
		}

		if (!this.castVotes[this.matchID]) {this.castVotes[this.matchID] = [];}
		this.castVotes[this.matchID].push(playerID);

		this.loadMatchData(this.matchID).then(() => {this.refreshMain()})

	}


	checkCookie() {

		if (this.voteCookie == null) {
			this.voteCookie = new FlundrCookieManager(this.voteCookieName, this.voteCookieDuration);
		}

		if (this.voteCookie.exists) {
			this.userHash = this.voteCookie.content;
		}

	}

	async loadMatches() {

		let matches = [];
		await axios.get(this.apiPath + '/matches')
		.then(function (response) {
			matches = response.data;
		})
		.catch(err => {console.error('RankIT - Error: Matches konnten nicht geladen werden (' + err.message +')');})

		this.matches = matches;

	}


	async loadMatchData(id) {

		let matchdata;

		let requestURL = this.apiPath + '/match';
		if (id) {requestURL = this.apiPath + '/match/' + id;}

		await axios.get(requestURL)
		.then(function (response) {matchdata = response.data;})

		this.matchID = matchdata.id;
		this.matchdata = matchdata;

	}

	async loadPlayerData(id) {

		let playerdata;

		let requestURL = this.apiPath + '/player';
		if (id) {requestURL = this.apiPath + '/player/' + id;}

		await axios.get(requestURL)
		.then(function (response) {playerdata = response.data;})

		this.playerdata = playerdata;

	}



	createHeader() {
		let el = document.createElement('header');
		el.classList.add(this.prefix + 'header')

		//el.innerHTML = `<h1>RankIT!</h1>`;
		el.innerHTML = `<h1><img src="${this.apiPath}/frontend/soon.png"></h1>`;

		return el;
	}
	createMain() {
		let el = document.createElement('main');
		el.classList.add(this.prefix + 'main')
		return el;
	}
	createFooter() {
		let el = document.createElement('footer');
		el.classList.add(this.prefix + 'footer')

		el.innerHTML = `<footer class="${this.prefix}footer">powered by flundr - portraits by FC Energie Cottbus e.V.</footer>`

		el.addEventListener('click', () => {
			let main = document.querySelector(`.${this.prefix}match-detail`);
			main.style.maxHeight = 'inherit';
		})

		return el;
	}

	gd(date) {return this.dateParser.gdate(date);}
	gsd(date) {return this.dateParser.gsdate(date);}
	ed(date) {return this.dateParser.edate(date);}
	time(date) {return this.dateParser.time(date);}


	/*
	alpineStuff() {

        Alpine.data('overview', () => ({ match: this.matchdata }))
		this.container.innerHTML = this.template();

	}

	template() {
		return `<div x-data="overview">
		    <h1 x-text="match.home_team + ' - ' + match.away_team"></h1>

		</div>`
	}
	*/



	testchart() {

let options = {
	series: [
				{
			name: 'Score', color: '#5ad9a4',
			data: [2.1,3.2,5.4,1.4,4.3],
		},
			],
	chart: {
		height: 300,
		type: 'area',
		toolbar: {show:false},
		zoom: {enabled:false},
		animations: {enabled: true},
		sparkline: {enabled: false},
		stacked: false,

	},

	tooltip: {enabled: false,},
	
	legend: {show:false,},
	
	stroke: {curve: 'smooth'},
	dataLabels: {enabled: true,},

	xaxis: {
		categories: ['2022-10-10','2022-10-11','2022-10-12','2022-10-13','2022-10-14'],
		crosshairs: {show: false},
		labels: {
			show: true,
			style: {
				colors: '#ffffff',
				fontSize: '13px',
			},
		},
	},

	yaxis: {
		//tickAmount: 4,
		labels: {rotate: 0, show: false,},
	},

	states: {active: {allowMultipleDataPointsSelection: false}},
	grid: {show:false,},

}

let chart = new ApexCharts(document.querySelector("#chart"), options);
chart.render();

	}




}

class FlundrDateParser {

	format(datestring, format) {
		let date = new Date(datestring);
		let day = date.getDate();
		let month = date.getMonth()+1;
		let year = date.getFullYear();

		day = day.toString().padStart(2,0);
		month = month.toString().padStart(2,0);

		switch (format) {
			case 'de':
				return `${day}.${month}.${year}`; break;
			case 'de-no-year':
				return `${day}.${month}.`; break;
			default:
				return `${year}-${month}-${day}`;
		}

	}

	time(datestring) {

		let date = new Date(datestring);
		let minutes = date.getMinutes().toString().padEnd(2,0);
		let hours = date.getHours().toString().padStart(2,0);

		return `${hours}:${minutes}`;

	}

	gdate(datestring) {
		return this.format(datestring, 'de');
	}

	gsdate(datestring) {
		return this.format(datestring, 'de-no-year');
	}

	edate(datestring) {
		return this.format(datestring);
	}

}

class FlundrCookieManager {

	// Usage: create new Instance e.g. myCookie = new FlundrCookieManager('cookiename', '30');
	// First parameter is the Cookies name, second is the Expiretime in Days
	// get Cookie data with: myCookie.content;
	// set Cookie data with: myCookie.content = 'Value';

	constructor(cookieName = 'fl-default-cookie', expireDays = 365) {
		this.cookieName = cookieName;
		this.expireDays = expireDays;
	}

	get content() {return this.get_content();}
	set content(data) {this.set_content(data);}

	get expire() {return this.expireDays;}
	set expire(days) {this.expireDays = days;}

	get name() {return this.expireDays;}
	set name(cookieName) {this.cookieName = cookieName;}

	get isset() {return this.is_active();}
	get exists() {return this.is_active();}

	get_content() {
		let content = document.cookie.split('; ');

		content = content.find(row => row.startsWith(this.cookieName+'='));

		if (!content) {return;}
		content = content.split('=')[1];

		if (content.startsWith('{')) {content = JSON.parse(content);}
		return content;
	}

	set_content(data) {

		if (typeof(data) === 'object') {
			data = JSON.stringify(data);
		}

		let expire = '';
		if (this.expireDays) {
			expire = this.expire_from_now(this.expireDays);
			expire = new Date(expire).toUTCString();
			expire = ` expires=${expire};`;
		}

		let cookieString = `${this.cookieName}=${data}; SameSite=Lax; ${expire} ${this.secure()};path=/`;
		document.cookie = cookieString;
	}

	is_active() {
		if (document.cookie.split(';').some((item) => item.trim().startsWith(this.cookieName + '='))) {
			return true;
		}
		return false;
	}

	secure() {
		if (location.protocol === 'https:') { return 'Secure';}
		return '';
	}

	check_value(cookieName, cookieValue) {
		return document.cookie.split(';').some((item) => item.includes(cookieName+'='+cookieValue));
	}

	min_to_ms(minutes) {return minutes*60*1000;}
	days_to_ms(days) {return days*24*60*60*1000;}

	expire_from_now(amountOfTime, timeFrame = 'days') {
		let date = new Date();
		let expireTime = this.days_to_ms(amountOfTime);

	    date.setTime(date.getTime() + expireTime);
		return date.toLocaleString("en-US", {timeZone: "Europe/Berlin"})
		//return date.toUTCString();
	}

	delete() {
		let cookieString = `${this.cookieName}=''; expires=Thu, 01 Jan 1970 00:00:00 GMT; ${this.secure()}`;
		document.cookie = cookieString;
	}

}

class RankItLoader {

	constructor(matchID) {
		this.app;
		this.matchID = matchID;
		this.container = this.createContainerNode();
		this.init();
	}

	init() {

		this.loadCSS('https://rankit.lr-digital.de/styles/css/rankit.css');
		this.requirePackages()
			.then(() => {
				this.app = new RankItApp(this.container, this.matchID);
			})
			.catch(err => {
				console.error('RankIT - Error while loading Dependencies: ' + err.message);
			})
	}

	async requirePackages() {

		let packages = [];
		if (window.Alpine === undefined) {
			packages.push(this.loadScript('https://unpkg.com/alpinejs@3.x.x/dist/cdn.min.js'));
		}

		if (window.axios === undefined) {
			packages.push(this.loadScript('https://unpkg.com/axios/dist/axios.min.js'));
		}


		if (window.ApexCharts === undefined) {
			packages.push(this.loadScript('https://cdn.jsdelivr.net/npm/apexcharts'));
		}

		await Promise.all(packages)
	}

	createContainerNode() {

		const currentScript = document.currentScript;
		const container = document.createElement('div');
		currentScript.parentNode.insertBefore(container, currentScript.nextSibling);
		return container;

	}

	loadCSS(src) {

		const el = document.createElement('link')
		const container = document.head || document.body

		el.type = 'text/css';
		el.rel = 'stylesheet';
		el.media = 'all';
		el.href = src;

		container.appendChild(el)

	}


	loadScript(src, async = true, type = 'text/javascript') {

		// By https://attacomsian.com/blog/javascript-load-script-async
		return new Promise((resolve, reject) => {

			try {

				const el = document.createElement('script')
				const container = document.head || document.body

				el.type = type
				el.async = async
				el.src = src

				el.addEventListener('load', () => { resolve({ status: true }) })
				el.addEventListener('error', () => {
					reject({ status: false, message: `Failed to load ${src}` })
				})

				container.appendChild(el)

			}

			catch (err) {reject(err)}

		})

	}


}
