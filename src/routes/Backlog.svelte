<script lang="ts">
    import AppShell from "../AppShell.svelte";
    import { tasks } from "../store.js";

    // EDIT LOGIC
    let editingIndex : number;
    let editingElement : HTMLElement;
    $: if (editingElement) {
        editingElement.focus();
    }

    // ADD TASK
    let newTaskText : string = "";
    function addTask() {
        tasks.addTask(newTaskText);
        newTaskText = "";
    }
</script>

<AppShell selected="Backlog">
    <h1 class="text-center text-2xl font-black uppercase mt-4">Tasks</h1>
    <!-- This example requires Tailwind CSS v2.0+ -->
    <div class="mt-4 bg-white shadow overflow-hidden sm:rounded-md">
        <ul class="divide-y divide-gray-200">
            {#each $tasks as task, i}
                <li class="px-4 py-4 sm:px-6">
                    {#if editingIndex === i}
                    <div class="flex items-center justify-between">
                        <input bind:value={$tasks[i]} bind:this={editingElement} type="text" class="overflow-visible focus:ring-current"/>
                        <div class="flex justify-betweeen space-x-4">
                            <p on:click={e => editingIndex = null} class="text-blue-500 hover:text-blue-600">Done</p>
                        </div>
                    </div>
                    {:else}
                        <div class="flex items-center justify-between">
                            <p contenteditable={editingIndex === i}>{task}</p>
                            <div class="flex justify-betweeen space-x-4">
                                <p on:click={e => editingIndex = i} class="text-blue-500 hover:text-blue-600">Edit</p>
                                <p on:click={e => tasks.removeTaskAtIndex(i)} class="text-green-500 hover:text-green-600">Complete</p>
                            </div>
                        </div>
                    {/if}
                </li>
            {/each}
            <!-- Add Task Logic -->
            <li class="px-4 py-4 sm:px-6">
                <div class="flex items-center justify-between">
                    <input class="pl-2" placeholder="Add Task" bind:value={newTaskText} />
                    <p on:click={addTask} class="text-green-500 hober:text-green-600">Add</p>
                </div>
            </li>
        </ul>
    </div>
</AppShell>
