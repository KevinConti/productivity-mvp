<script>
    import AppShell from '../AppShell.svelte';
    let name;
</script>

<AppShell selected="Tasks">
    <section class="grid grid-cols-12">
        Hello {name || "Anonymous"}!
    </section>
</AppShell>