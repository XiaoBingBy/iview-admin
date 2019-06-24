const Main = () => import('@/components/main')
const ParentView = () => import('@/components/parent-view')
const Login = () => import('@/view/login/login.vue')
const Home = () => import('@/view/single-page/home')
const Error401 = () => import('@/view/error-page/401.vue')
const Error404 = () => import('@/view/error-page/404.vue')
const Error500 = () => import('@/view/error-page/500.vue')
const Markdown = () => import('@/view/components/markdown/markdown.vue')
const Editor = () => import('@/view/components/editor/editor.vue')
const JoinPage = () => import('@/view/join-page.vue')
/* UPMS */
const user = () => import('@/view/upms/user/user.vue')
const role = () => import('@/view/upms/role/role.vue')
const permission = () => import('@/view/upms/permission/permission.vue')
const dict = () => import('@/view/upms/dict/dict.vue')


export const routerMap = {
  Main,
  ParentView,
  Login,
  Home,
  Error401,
  Error404,
  Error500,
  Markdown,
  Editor,
  JoinPage,
  user,
  role,
  permission,
  dict
}

export const staticRouters = [
  {
    path: '/login',
    name: 'login',
    meta: {
      title: 'Login - 登录',
      hideInMenu: true
    },
    component: routerMap['Login']
  },
  {
    path: '/',
    name: '_home',
    redirect: '/home',
    component: routerMap['Main'],
    meta: {
      hideInMenu: true,
      notCache: true
    },
    children: [
      {
        path: '/home',
        name: 'home',
        meta: {
          hideInMenu: true,
          title: '首页',
          notCache: true,
          icon: 'md-home'
        },
        component: routerMap['Home']
      }
    ]
  },
  // {
  //   path: '/admin/upms',
  //   name: 'upms',
  //   meta: {
  //     icon: 'md-settings',
  //     title: '系统管理'
  //   },
  //   component: Main,
  //   children: [
  //     {
  //       path: 'user',
  //       name: 'user',
  //       meta: {
  //         icon: 'md-person',
  //         title: '用户管理'
  //       },
  //       component: () => import('@/view/upms/user/user.vue')
  //     },
  //     {
  //       path: 'role',
  //       name: 'role',
  //       meta: {
  //         icon: 'md-people',
  //         title: '角色管理'
  //       },
  //       component: () => import('@/view/upms/role/role.vue')
  //     },
  //     {
  //       path: 'permission',
  //       name: 'permission',
  //       meta: {
  //         icon: 'md-menu',
  //         title: '权限管理'
  //       },
  //       component: () => import('@/view/upms/permission/permission.vue')
  //     },
  //     {
  //       path: 'dict',
  //       name: 'dict',
  //       meta: {
  //         icon: 'ios-book',
  //         title: '字典管理'
  //       },
  //       component: () => import('@/view/upms/dict/dict.vue')
  //     },
  //   ]
  // },
  {
    path: '/401',
    name: 'error_401',
    meta: {
      hideInMenu: true
    },
    component: routerMap['Error401']
  },
  {
    path: '/500',
    name: 'error_500',
    meta: {
      hideInMenu: true
    },
    component: routerMap['Error500']
  },
  {
    path: '*',
    name: 'error_404',
    meta: {
      hideInMenu: true
    },
    component: routerMap['Error404']
  }
]
