<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">

</style>

<template>
    <div class="hello">
        <h1>{{ msg }}</h1>
        <p>
            For a guide and recipes on how to configure / customize this project,<br>
            check out the
            <a href="https://cli.vuejs.org" target="_blank" rel="noopener">vue-cli documentation</a>.
        </p>
    </div>
</template>

<script lang="ts">
    import {Component, Prop, Vue} from 'vue-property-decorator';

    @Component({
        name: 'hello-world'
    })
    export default class extends Vue {
        @Prop() private msg!: string;

        created(){
            console.log("123")
        }
    }
</script>
