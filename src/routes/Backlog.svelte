<script lang="ts">
    import AppShell from "../AppShell.svelte";
    import { tasks } from "../store";
    import type { TaskType } from "../store";

    // EDIT LOGIC
    let editingId : string;
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
    <!-- Daily Tasks-->
    {#if $tasks.filter(t => t.isDaily)?.length > 0}
    <h1 class="text-center text-2xl font-black uppercase mt-4">Dailies</h1>
    <div class="mt-4 bg-white shadow overflow-hidden sm:rounded-md">
        <ul class="divide-y divide-gray-200">
            {#each $tasks.filter((t) => t.isDaily) as task}
                <li class="px-4 py-4 sm:px-6">
                    <div class="flex items-center justify-between">
                        <p>{task.text}</p>
                        <div class="flex justify-betweeen space-x-4">
                            <p on:click={e => tasks.removeTask(task.id)} class="text-green-500 hover:text-green-600">Complete</p>
                        </div>
                    </div>
                </li>
            {/each}
        </ul>
    </div>
    {:else}
        <p class="mt-4 font-gray-600 text-lg text-center">No dailies selected yet!</p>
    {/if}

    <h1 class="text-center text-2xl font-black uppercase mt-4">Tasks</h1>
    <!-- This example requires Tailwind CSS v2.0+ -->
    <div class="mt-4 bg-white shadow overflow-hidden sm:rounded-md">
        <ul class="divide-y divide-gray-200">
            <!-- Can't just use .filter() here as it creates a copy of the array, ruining binding. -->
            {#each $tasks as task}
                {#if (!task.isDaily)}
                <li class="px-4 py-4 sm:px-6">
                    {#if editingId === task.id}
                    <div class="flex items-center justify-between">
                        <input bind:value={task.text} bind:this={editingElement} type="text" class="overflow-visible focus:ring-current"/>
                        <div class="flex justify-betweeen space-x-4">
                            <p on:click={e => editingId = null} class="text-blue-500 hover:text-blue-600">Done</p>
                        </div>
                    </div>
                    {:else}
                        <div class="flex items-center justify-between">
                            <p contenteditable={editingId === task.id}>{task.text}</p>
                            <div class="flex justify-betweeen space-x-4">
                                <p on:click={e => editingId = task.id} class="text-blue-500 hover:text-blue-600">Edit</p>
                                <p on:click={e => tasks.removeTask(task.id)} class="text-green-500 hover:text-green-600">Complete</p>
                            </div>
                        </div>
                    {/if}
                </li>
                {/if}
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
