<style lang="scss" scoped>
    .jigsaw-panel {
        width: 100%;
        position: relative;

        canvas {
            display: block;
            margin: 0 auto;
        }

        .all {
            width: 100%;
        }

        .part {
            width: 6.35%;
            position: absolute;
            top: 55%;
        }
    }

    .scroll-track {
        position: relative;
        height: 40px;

        .shuttle {
            position: absolute;
            left: 0;
            top: 0;
            bottom: 0;
            width: 6.35%;
            background: #4789ff;
        }
    }
</style>

<template>
    <div class="control-panel">
        <div class="jigsaw-panel">
            <canvas class="all" ref="jigsawCanvas" id="jigsawCanvas" :height="panelHeight" :width="panelWidth"/>
            <canvas class="part"
                    ref="jigsawSlice"
                    :height="jigsaw.jigsawSize"
                    :width="jigsaw.jigsawSize"
                    :style="{left: `${shuttlePosition * 100/jigsawCanvasWidth}%`}"
            />
        </div>
        <div class="scroll-track">
            <span class="shuttle" :style="{left: `${shuttlePosition}px`}"
                  @mousedown="onMousedown"
            />
        </div>
    </div>
</template>

<script lang="ts">

    import {Component, Vue} from 'vue-property-decorator';
    // @ts-ignore
    import puzzle1 from '../assets/puzzle-1.jpg';
    // @ts-ignore
    import puzzle2 from '../assets/puzzle-2.jpg';
    // @ts-ignore
    import puzzle3 from '../assets/puzzle-3.jpeg';
    // @ts-ignore
    import puzzle4 from '../assets/puzzle-4.jpeg';

    const images = [puzzle1, puzzle2, puzzle3, puzzle4];

    // 横向定位最大范围
    const xMax = 0.9;
    // 位移误差范围
    const TOLERANCE = 0.005;

    const originalX = 1600 * xMax;

    @Component({
        name: "JigsawPuzzle",
        components: {},
    })
    export default class extends Vue {

        panelWidth: Number = 1600;
        panelHeight: Number = 900;

        jigsaw = {
            x: 0,
            y: 900 * 0.55,
            jigsawSize: 100
        };

        xPosition: number = 0;

        shuttlePosition: number = 0;

        mouseDown: boolean = false;
        mouseX: number = 0;
        finished: boolean = false;

        jigsawCanvasWidth: number = 0;

        imgUrl: string = '';

        created() {
            window.addEventListener('mouseup', this.onMouseup);
            window.addEventListener('mousemove', this.onMousemove)
        }

        destroyed() {
            window.removeEventListener('mouseup', this.onMouseup);
            window.removeEventListener('mousemove', this.onMousemove)
        }

        init() {
            this.finished = false;
            this.shuttlePosition = 0;
            this.mouseX = 0;

            const random = (Math.random() + 1) / 2;
            this.xPosition = random;
            this.jigsaw.x = random * originalX;

            this.imgUrl = images[Math.ceil(Math.random() * 4) - 1];

            this.drawCanvas();
        }

        mounted() {
            this.init();
        }

        async drawCanvas() {
            const img: any = await this.loadImage(this.imgUrl);

            const canvas: any = this.$refs.jigsawCanvas;
            this.jigsawCanvasWidth = canvas.clientWidth;

            const ctx = canvas.getContext('2d');
            this.createPanel(ctx, this.jigsaw.x, this.jigsaw.y, this.jigsaw.jigsawSize, img);


            const slice: any = this.$refs.jigsawSlice;
            const ctxSlice = slice.getContext('2d');
            this.createSlice(ctxSlice, this.jigsaw.x, this.jigsaw.y, this.jigsaw.jigsawSize, img);
        }

        onMousedown(event: any) {
            if (this.finished) {
                return;
            }
            this.mouseX = event.x;
            this.mouseDown = true;
        }

        onMousemove(event: any) {
            if (this.mouseDown) {
                this.shuttlePosition = Math.max(0, event.x - this.mouseX);
            }
        }

        onMouseup(event: any) {
            if (this.finished) {
                return;
            }

            this.mouseDown = false;
            this.finished = true;

            this.verification();
        }

        /**
         * 校验是否滑动成功
         */
        verification() {
            const currentPercentage = (this.shuttlePosition / this.jigsawCanvasWidth) / xMax;
            const tolerance = Math.abs(this.xPosition - currentPercentage);
            const pass = tolerance <= TOLERANCE;

            this.init();

            this.$emit('result', pass);
        }

        /**
         * 创建带拼图镂空的整体图
         *
         * @param ctx
         * @param x
         * @param y
         * @param size
         * @param img
         */
        async createPanel(ctx: any, x: number, y: number, size: number, img: any) {
            ctx.drawImage(img, 0, 0, img.width, img.height, 0, 0, this.panelWidth, this.panelHeight);
            this.drawPath(ctx, x, y, size, true);
            ctx.fillStyle = '#FFFFFF';
            ctx.fill();

            ctx.restore();
        }

        /**
         * 创建拼图块
         *
         * @param ctx
         * @param x
         * @param y
         * @param size
         * @param img
         */
        async createSlice(ctx: any, x: number, y: number, size: number, img: any) {
            this.drawPath(ctx, x, y, size, false);
            ctx.drawImage(img, x, y, size, size, 0, 0, size, size);

            ctx.restore();
        }

        /**
         * 画出拼图图形
         * 默认计算使用 边长为 1000的正方形
         * 画完后才计算了实际占用大小
         * 实际占用760 × 760
         *
         * @param ctx
         * @param x
         * @param y
         * @param size
         * @param move
         */
        drawPath(ctx: any, x: number, y: number, size: number, move: boolean) {
            function shrink(num: number) {
                return (num) / 760 * size;
            }

            function shrinkX(num: number) {
                return shrink(num - 200) + (move ? x : 0);
            }

            function shrinkY(num: number) {
                return shrink(num - 40) + (move ? y : 0);
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
        }

        /**
         * 根据url加载图片
         *
         * @param url
         */
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
