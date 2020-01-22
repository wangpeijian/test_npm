<style lang="scss" scoped>
    .jigsaw-panel {
        width: 100%;

        canvas {
            display: block;
            margin: 0 auto;
        }

        .all {
            width: 100%;
        }

        .part {
            height: 64px;
            width: 64px;
        }

        .shape {
            width: 90px;
            height: 90px;
        }
    }
</style>

<template>
    <div class="jigsaw-panel">
        <canvas class="all" ref="jigsawCanvas" :height="height" :width="width"/>
        <canvas class="part" ref="jigsawSlice" :height="64" :width="64"/>
        <br>
        <canvas class="shape" ref="shape" :height="1000" :width="1000"/>

    </div>
</template>

<script lang="ts">

    import {Component, Vue} from 'vue-property-decorator';
    // @ts-ignore
    import puzzle1 from '../assets/puzzle-1.jpg';

    const jigsaw = {
        x: 0,
        y: 0,

        height: 100,
        width: 100,
    };

    @Component({
        name: "JigsawPuzzle",
        components: {},
    })
    export default class extends Vue {

        width: Number = 1600;
        height: Number = 900;

        async mounted() {
            this.test();
            console.log('begin');
            const canvas: any = this.$refs.jigsawCanvas;
            console.log('canvas:', canvas);
            const ctx = canvas.getContext('2d');
            console.log('image:', puzzle1);

            const img: any = await this.loadImage(puzzle1);
            ctx.drawImage(img, 0, 0, img.width, img.height, 0, 0, this.width, this.height);

            this.createSlice(ctx, jigsaw.x, jigsaw.y, jigsaw.width, img, false);


            // const slice: any = this.$refs.jigsawSlice;
            // const ctxSlice = slice.getContext('2d');
            // ctxSlice.drawImage(img, jigsaw.x, jigsaw.y, jigsaw.width, jigsaw.height, 0, 0, 64, 64);

            // this.createSlice(ctxSlice, jigsaw.x, jigsaw.y, jigsaw.width, img, true);
        }

        async createSlice(ctx: any, x : number, y: number , size: number, img: any, slice: boolean){

            function shrink(num: number){
                return (num)/ 1000 * size;
            }

            function shrinkX(num: number){
                return shrink(num) + x;
            }

            function shrinkY(num: number){
                return shrink(num) + y;
            }

            ctx.save();

            ctx.beginPath();

            // 上边
            ctx.moveTo(shrinkX(200), shrinkY(200));
            ctx.lineTo(shrinkX(450), shrinkY(200));
            ctx.lineTo(shrinkX(450), shrinkY(200));

            // 第一个凸起
            ctx.arc(shrinkX(450), shrinkY(180), shrink(20), Math.PI * 0.5, Math.PI * 1.7, true);
            ctx.arc(shrinkX(500), shrinkY(110), shrink(70), Math.PI * 0.8, Math.PI * 0.2, false);
            ctx.arc(shrinkX(550), shrinkY(180), shrink(20), Math.PI * 1.3, Math.PI * 0.5, true);
            ctx.lineTo(shrinkX(800), shrinkY(200));

            // 右边
            ctx.lineTo(shrinkX(800), shrinkY(450));

            // 第二个凸起
            ctx.arc(shrinkX(820), shrinkY(450), shrink(20), Math.PI, Math.PI * 0.2, true);
            ctx.arc(shrinkX(890), shrinkY(500), shrink(70), Math.PI * 1.3, Math.PI * 0.7, false);
            ctx.arc(shrinkX(820), shrinkY(550), shrink(20), Math.PI * 1.7, Math.PI, true);
            ctx.lineTo(shrinkX(800), shrinkY(800));

            // 下边
            ctx.lineTo(shrinkX(550), shrinkY(800));

            // 第三个凸起
            ctx.arc(shrinkX(550), shrinkY(780), shrink(20), Math.PI * 0.5, Math.PI * 1.3, false);
            ctx.arc(shrinkX(500), shrinkY(710), shrink(70), Math.PI * 0.2, Math.PI * 0.8, true);
            ctx.arc(shrinkX(450), shrinkY(780), shrink(20), Math.PI * 1.7, Math.PI * 0.5, false);
            ctx.lineTo(shrinkX(200), shrinkY(800));


            // 左边
            ctx.lineTo(shrinkX(200), shrink(550));

            // 第四个凸起
            ctx.arc(shrinkX(220), shrinkY(550), shrink(20), Math.PI, Math.PI * 1.8, false);
            ctx.arc(shrinkX(290), shrinkY(500), shrink(70), Math.PI * 0.7, Math.PI * 1.3, true);
            ctx.arc(shrinkX(220), shrinkY(450), shrink(20), Math.PI * 0.3, Math.PI, false);
            ctx.lineTo(shrinkX(200), shrinkY(200));

            ctx.closePath();
            ctx.clip();

            if(slice){
                ctx.drawImage(img, x, y, size, size, 200, 40, 760, 760);
            }else {
                ctx.fillStyle = '#fff';
                ctx.fill();
            }

            ctx.restore();
        }

        async test() {
            const img: any = await this.loadImage(puzzle1);
            const canvas: any = this.$refs.shape;
            const ctx = canvas.getContext('2d');

            ctx.beginPath();

            // 上边
            ctx.moveTo(200, 200);
            ctx.lineTo(450, 200);
            ctx.lineTo(450, 200);

            // 第一个凸起
            ctx.arc(450, 180, 20, Math.PI * 0.5, Math.PI * 1.7, true);
            ctx.arc(500, 110, 70, Math.PI * 0.8, Math.PI * 0.2, false);
            ctx.arc(550, 180, 20, Math.PI * 1.3, Math.PI * 0.5, true);
            ctx.lineTo(800, 200);

            // 右边
            ctx.lineTo(800, 450);

            // 第二个凸起
            ctx.arc(820, 450, 20, Math.PI, Math.PI * 0.2, true);
            ctx.arc(890, 500, 70, Math.PI * 1.3, Math.PI * 0.7, false);
            ctx.arc(820, 550, 20, Math.PI * 1.7, Math.PI, true);
            ctx.lineTo(800, 800);

            // 下边
            ctx.lineTo(550, 800);

            // 第三个凸起
            ctx.arc(550, 780, 20, Math.PI * 0.5, Math.PI * 1.3, false);
            ctx.arc(500, 710, 70, Math.PI * 0.2, Math.PI * 0.8, true);
            ctx.arc(450, 780, 20, Math.PI * 1.7, Math.PI * 0.5, false);
            ctx.lineTo(200, 800);


            // 左边
            ctx.lineTo(200, 550);

            // 第四个凸起
            ctx.arc(220, 550, 20, Math.PI, Math.PI * 1.8, false);
            ctx.arc(290, 500, 70, Math.PI * 0.7, Math.PI * 1.3, true);
            ctx.arc(220, 450, 20, Math.PI * 0.3, Math.PI, false);
            ctx.lineTo(200, 200);

            ctx.closePath();
            ctx.clip();

            ctx.drawImage(img, jigsaw.x, jigsaw.y, jigsaw.width, jigsaw.height, 200, 40, 760, 760);
        }

        loadImage(url: string) {
            if (url.indexOf('http') === 0) {
                return new Promise((resolve, reject) => {
                    const xhr = new XMLHttpRequest();
                    xhr.open('get', url, true);
                    xhr.responseType = 'blob';
                    xhr.onload = function () {
                        if (this.status === 200) {
                            const blob = this.response;
                            const fileReader = new FileReader();
                            fileReader.onloadend = function (e) {
                                //@ts-ignore
                                const result = e.target.result;

                                const image = new Image();
                                image.onload = function () {
                                    resolve(image);
                                };
                                image.src = `${result}`;
                            };
                            fileReader.readAsDataURL(blob)
                        }
                    };
                    xhr.onerror = function () {
                        reject()
                    };
                    xhr.send()
                })
            } else {
                return new Promise(resolve => {
                    const image = new Image();
                    image.onload = function () {
                        resolve(image);
                    };
                    image.src = url;
                });
            }
        }
    }

</script>
