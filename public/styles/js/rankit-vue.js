import { createApp } from 'https://unpkg.com/vue@3/dist/vue.esm-browser.js';


createApp({
	data() {
		return {
			count: 0,
			matchID: 1,
		}
	},

	mounted() {
		//this.matchID = this.$el.getAttribute('data-match-id');
		//console.log(this.$el.getAttribute('class'));
		console.log(this.$el.dataset.matchId);
	},

	template: `
	<div @click="count++">
		You clicked me {{ matchID }} times.
	</div>`,



}).mount('.rankit-app');
