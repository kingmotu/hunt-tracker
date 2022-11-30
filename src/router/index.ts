import { createRouter, createWebHistory } from 'vue-router';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'startup',
      component: () => import('@/views/Startup/Startup.vue'),
    },
    {
      path: '/record',
      name: 'record',
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import('@/views/RecordView/RecordView.vue'),
    },
    {
      path: '/statistic',
      name: 'statistic',
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import('@/views/StatisticView/StatisticView.vue'),
    },
    {
      path: '/missions/:missionUuid?',
      name: 'missions',
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import('@/views/MissionsView/MissionsView.vue'),
    },
    {
      path: '/players',
      name: 'players',
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import('@/views/PlayersView/PlayersView.vue'),
    },
    {
      path: '/imexport',
      name: 'imexport',
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import('@/views/ImExportView/ImExportView.vue'),
    },
    {
      path: '/:pathMatch(.*)',
      name: 'bad-not-found',
      redirect: '/',
    },
  ],
});

export default router;
