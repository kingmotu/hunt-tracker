import { createApp } from 'vue';
import { createPinia } from 'pinia';

import App from './App.vue';
import router from './router';

// Vuetify
import 'vuetify/styles';
import { createVuetify } from 'vuetify';
import * as components from 'vuetify/components';
import * as directives from 'vuetify/directives';

const vuetify = createVuetify({
  components,
  directives,
});

import './assets/main.css';

const app = createApp(App);

app.use(vuetify);
app.use(createPinia());
app.use(router);

app.mount('#app').$nextTick(() => {
  postMessage({ payload: 'removeLoading' }, '*');
});
