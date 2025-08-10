import { navbar } from 'vuepress-theme-hope'

export default navbar([
    '/',
    // "/demo/",
    '/learn/',
    {
        text: '官方文档',
        icon: 'line-md:link',
        // prefix: '/posts/',
        children: [
            {
                text: 'MDN Web',
                icon: 'simple-icons:mdnwebdocs',
                link: 'https://developer.mozilla.org/zh-CN/'
            },
            {
                text: 'TypeScript',
                icon: 'skill-icons:typescript',
                link: 'https://developer.mozilla.org/zh-CN/'
            },
            {
                text: '组件库',
                icon: 'oui:nav-ui',
                // prefix: 'banana/',
                children: [
                    {
                        text: 'Element-Vue2',
                        icon: 'logos:element',
                        link: 'https://element.eleme.cn/#/zh-CN'
                    },
                    {
                        text: 'Element Plus-Vue3',
                        icon: 'logos:element',
                        link: 'https://element-plus.org/zh-CN/'
                    },
                    {
                        text: 'Vant4-Vue3',
                        icon: 'vscode-icons:file-type-vlang',
                        link: 'https://vant4.ylhtest.com/#/zh-CN'
                    },
                    {
                        text: 'Ant Design5-React',
                        icon: 'devicon:antdesign',
                        link: 'https://ant-design.antgroup.com/index-cn?locale=zh-CN&tab=design'
                    },
                    {
                        text: 'Ant Design Vue',
                        icon: 'devicon:antdesign',
                        link: 'https://www.antdv.com/docs/vue/getting-started-cn'
                    },
                ],
            },
            {
                text: '图标库',
                children: [
                    {
                        text: 'ECharts',
                        icon: 'ix:piechart-filled',
                        link: 'https://echarts.apache.org/zh/index.html'
                    },
                    {
                        text: 'Vue Data Ui',
                        icon: 'solar:chart-bold',
                        link: 'https://vue-data-ui.graphieros.com/'
                    }
                ]
            }
        ],
    },
    // {
    //     text: 'V2 文档',
    //     icon: 'book',
    //     link: 'https://theme-hope.vuejs.press/zh/',
    // },
])
