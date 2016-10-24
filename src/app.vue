<script type="text/javascript">
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
	@import './assets/scss/common.scss';
	.page{
		height: 100%;
	}
</style>
