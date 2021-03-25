<script>
    import AppShell from '../AppShell.svelte';
    import {link} from 'svelte-spa-router';

    let name;
</script>

<AppShell selected="Tasks">
    <section class="grid grid-cols-12">
        <h1>Hello {name || "Anonymous"}!</h1>
        <a href="/sign-in" use:link>
            <button type="button" class="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                Sign in
            </button>
        </a>
    </section>
</AppShell>