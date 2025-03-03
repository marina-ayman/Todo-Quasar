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
      {
        path: '',
        component: () => import('pages/dashboard/UsersPage.vue'),
        meta: { requiredPermissions: ['view_users'] },
      },
      {
        path: 'all_todos',
        component: () => import('pages/dashboard/TodosPage.vue'),
        meta: { requiredPermissions: ['view_todos'] },
      },
      {
        path: 'user_todos/:id/:name',
        component: () => import('pages/dashboard/UserTodos.vue'),
        meta: { requiredPermissions: ['view_user_todos'] },
      },

    
      {
        path: 'roles',
        component: () => import('pages/dashboard/rolesPage.vue'),
        meta: { requiredPermissions: ['view_roles'] },
      },
      {
        path: 'add_role',
        component: () => import('pages/dashboard/addRole.vue'),
        meta: { requiredPermissions: ['create_role'] },
      },
      {
        path: 'edit_role/:id',
        component: () => import('pages/dashboard/editRole.vue'),
        meta: { requiredPermissions: ['update_role'] },
      },
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
