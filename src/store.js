import { writable } from "svelte/store";

const dark = writable(false); // dark mode
const user = writable({
    tokens: null
});
export { user };
