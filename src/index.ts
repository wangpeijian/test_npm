import Vue from 'vue';
import HelloWorld from './components/';
const components: { [propsName: string]: typeof Vue } = {
    HelloWorld,
};

const install = (vue: typeof Vue): void => {
    // 安装全部的插件
    Object.keys(components).forEach((key) => {
        vue.component(key, components[key]);
    });
};

const API = {
    install,
     ...components
};

const HelloWorld2 = HelloWorld;

export {HelloWorld2}
export * from './components/HelloWorld.vue';

export function test() {
    console.log("test log")
}

export default API;


