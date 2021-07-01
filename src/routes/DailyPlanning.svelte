<script lang="ts">
    import AppShell from '../AppShell.svelte';
    import { tasks } from '../store';
    import type { TaskType } from '../store';

    let editingIndex: number;
    let editingElement: HTMLElement;

    let newTaskText: string = "";

    function addTask() {
        tasks.addTask(newTaskText);
        newTaskText = "";
    }

    // DAILY LOGIC
    $: dailyTasks = $tasks.filter((t) => t.isDaily);
</script>

<AppShell selected={"Daily Planning"}>
    <h1 class="text-center text-2xl font-black uppercase mt-8">Daily Planning</h1>

    <!-- Daily Tasks-->
    {#if dailyTasks?.length > 0}
    <h1>Dailies</h1>
    <div class="mt-4 bg-white shadow overflow-hidden sm:rounded-md">
        <ul class="divide-y divide-gray-200">
            {#each $tasks.filter((t) => t.isDaily) as task}
                <li class="px-4 py-4 sm:px-6">
                    <div class="flex items-center justify-between">
                        <p>{task.text}</p>
                        <p on:click={e => task.isDaily = false} class="text-blue-500 hover:text-blue-600 hover:underline">Remove from Dailies</p>
                    </div>
                </li>
            {/each}
        </ul>
    </div>
    {:else}
        <p class="mt-4 font-gray-600 text-lg text-center">No dailies selected yet!</p>
    {/if}
    <!-- Non-daily tasks -->
    <h2 class="mt-4 text-gray-800 text-center text-xl font-semibold">Other tasks</h2>
    <div class="mt-4 bg-white shadow overflow-hidden sm:rounded-md">
        <ul class="divide-y divide-gray-200">
            {#each $tasks.filter((t) => !t.isDaily) as task, i}
                <li class="px-4 py-4 sm:px-6">
                    <div class="flex items-center justify-between">
                        <p contenteditable={editingIndex === i}>{task.text}</p>
                        <div class="flex justify-betweeen space-x-4">
                            <p on:click={e => task.isDaily = true} class="text-blue-500 hover:text-blue-600 hover:underline">Mark as Daily</p>
                        </div>
                    </div>
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