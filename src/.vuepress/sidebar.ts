import {sidebar} from 'vuepress-theme-hope'
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
      text: '项目实战积累',
      icon: 'eos-icons:project',
      prefix: 'Project/',
      link: 'Project/',
      children: 'structure',
    },
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
      icon: 'vscode-icons:file-type-vue',
      prefix: 'Vue3/',
      link: 'Vue3/',
      children: 'structure',
    },
    {
      text: 'React',
      icon: 'vscode-icons:file-type-reactjs',
      prefix: 'React/',
      link: 'React/',
      children: 'structure',
    },
    {
      text: 'NestJS',
      icon: 'vscode-icons:file-type-nestjs',
      prefix: 'NestJS/',
      link: 'NestJS/',
      children: 'structure',
    },
    {
      text: 'Webpack',
      icon: 'vscode-icons:file-type-webpack',
      prefix: 'Webpack/',
      link: 'Webpack/',
      children: 'structure',
    },
    {
      text: 'Git',
      icon: 'vscode-icons:file-type-git',
      prefix: 'Git/',
      link: 'Git/',
      children: 'structure',
    }
  ]
})
