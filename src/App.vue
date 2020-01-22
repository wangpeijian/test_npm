<style lang="scss">
    * {
        box-sizing: border-box;
        margin: 0;
        padding: 0;
    }
</style>

<template>
    <div id="app">
        <!--<img alt="Vue logo" src="./assets/logo.png">
        <HelloWorld msg="Welcome to Your Vue.js + TypeScript App"/>-->

        <JigsawPuzzle @result="onResult"></JigsawPuzzle>
    </div>
</template>

<script lang="ts">
    import {Component, Vue} from 'vue-property-decorator';
    import HelloWorld from './components/HelloWorld.vue';
    import JigsawPuzzle from './components/JigsawPuzzle.vue';

    @Component({
        components: {
            HelloWorld,
            JigsawPuzzle,
        },
    })
    export default class App extends Vue {

        onResult(pass: boolean){
            console.log("结果是：", pass)
        }

    }
</script>
