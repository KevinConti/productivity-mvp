import ProductivityApp from './ProductivityApp.svelte';
import "../public/global.css";

const app = new ProductivityApp({
    target: document.body,
    props: {
    }
});

export default app;
