import Vue from 'vue';

declare function install(vue: typeof Vue): void;

declare const _default: {
    install: typeof install;

    log: (key :string) => void;
};

export default _default;
export {HelloWorld} from './HelloWorld';
