<script type="text/javascript">
	import './assets/scss/common.scss';
	export default {
		data(){
			return {
				message: 'Hello World!'
			}
		}
	}
</script>
<template>
	<div class="page">
		<router-view></router-view>	
	</div>
</template>
<style lang="sass">
	.page{
		height: 100%;
	}
</style>
