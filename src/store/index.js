import { store } from 'quasar/wrappers'
import { createStore } from 'vuex';
import auth from './auth'
// import { plugins } from '@vue/eslint-config-prettier/skip-formatting';

export default store(() => {

  const store = createStore({
    modules: {
      auth,
    },
   plugins:[],
  })
  return store
});

