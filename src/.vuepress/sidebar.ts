import { sidebar } from 'vuepress-theme-hope'
// https://icon-sets.iconify.design/
export default sidebar({
    '/': [
        '',
        {
            text: '如何使用',
            icon: 'laptop-code',
            prefix: 'demo/',
            link: 'demo/',
            children: 'structure',
        },
        {
            text: '文章',
            icon: 'book',
            prefix: 'posts/',
            children: 'structure',
        },
        'intro',
        {
            text: '幻灯片',
            icon: 'person-chalkboard',
            link: 'https://ecosystem.vuejs.press/zh/plugins/markdown/revealjs/demo.html',
        },
    ],
    '/learn/': [
        {
            text: 'JavaScript',
            icon: 'vscode-icons:file-type-js-official',
            prefix: 'JavaScript/',
            link: 'JavaScript/',
            children: 'structure',
        },
        {
            text: 'TypeScript',
            icon: 'vscode-icons:file-type-typescript-official',
            prefix: 'TypeScript/',
            link: 'TypeScript/',
            children: 'structure',
        },
        {
            text: 'Vue3',
            icon: 'logos:vue',
            prefix: 'Vue3/',
            link: 'Vue3/',
            children: 'structure',
        }
    ]
})
