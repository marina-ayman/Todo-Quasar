const routes = [
  {
    // web auth
    path: '/auth',
    component: () => import('layouts/authLayout.vue'),
    meta: { requiresAuth: false },
    children: [
      { path: 'reg', component: () => import('pages/web/auth/RegisterPage.vue') },
      { path: 'login', component: () => import('pages/web/auth/LoginPage.vue') },
    ],
  },
  {
    // web
    path: '/',
    component: () => import('layouts/webLayout.vue'),
    meta: { requiresAuth: true },
    children: [
      { path: 'profile', component: () => import('pages/web/user/profile.vue') },
      { path: 'todos', component: () => import('pages/web/todo/TodoPage.vue') },
    ],
  },

  {
    // dashboard auth
    path: '/dashboard/auth',
    component: () => import('layouts/authLayout.vue'),
    meta: { requiresAuth: false },
    children: [{ path: 'login', component: () => import('pages/dashboard/auth/loginPage.vue') }],
  },

  {
    //dashboard
    path: '/dashboard',
    component: () => import('layouts/MainLayout.vue'),
    meta: { requiresAuth: true },
    children: [
      { path: '', component: () => import('pages/dashboard/UsersPage.vue') },
      { path: 'all_todos', component: () => import('pages/dashboard/TodosPage.vue') },
      { path: 'user_todos/:id', component: () => import('pages/dashboard/UserTodos.vue') },
    ],
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue'),
  },
]

export default routes
