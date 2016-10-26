<script type="text/javascript">
	export default{
		data(){
			return {
				message: 'Hello Vue-ncli'
			}
		},
		created(){
			console.log(test)
		}
	}
</script>
<template>
	<h2>Home Page {{ message }}</h2>
</template>
<style lang="sass">
	h2{color: red;}
	body{
		h2{
			font-size: 30px;
		}
	}
</style>