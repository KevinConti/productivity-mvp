import ProductivityApp from './ProductivityApp.svelte';
import "../public/global.css";

const app = new ProductivityApp({
    target: document.body,
    props: {
        title: 'Svelte + Tailwind 2'
    }
});

export default app;
