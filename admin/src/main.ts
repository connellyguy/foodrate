import { createApp } from 'vue';

import PrimeVue from 'primevue/config';
import ToastService from 'primevue/toastservice';
import Aura from '@primevue/themes/aura';
import 'primeicons/primeicons.css';

import App from '@/App.vue';
import router from '@/router';
import { useAuth } from '@/composables/useAuth';

const app = createApp(App);

app.use(PrimeVue, {
    theme: {
        preset: Aura,
        options: {
            darkModeSelector: '.app-dark',
        },
    },
});
app.use(ToastService);
app.use(router);

const { init } = useAuth();
init().then(() => {
    app.mount('#app');
});
