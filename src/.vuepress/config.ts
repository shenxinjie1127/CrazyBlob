import {defineUserConfig} from "vuepress";

import theme from "./theme.js";

export default defineUserConfig({
    base: "/CrazyBlob/",

    lang: "zh-CN",
    title: "CrazyKaiSa",
    description: "沈鑫杰的学习博客",

    theme,

    // 和 PWA 一起启用
    // shouldPrefetch: false,
});
