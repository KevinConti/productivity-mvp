<script lang="typescript">
    import { fade } from "svelte/transition";
    import { getReward } from "../Rewards.svelte";
    import AppShell from "../AppShell.svelte";
    import dateFormat from "dateformat";
    import { tasks, TaskTypes } from "../store";
    import type { TaskType } from "../store";
    import Experience from "../Experience.svelte";
    import { onMount } from "svelte";

    // DEV-VARIABLES
    const speedUpPomodoro = false;

    // TYPES
    type minutes = number;
    type seconds = number;
    class Time {
        startTime: number;
        endTime: number;
        paused: boolean;
        pausedAt: number;

        constructor(timerLength: minutes) {
            this.startTime = Date.now();
            this.endTime = Date.now() + this.toMillis(timerLength);
            this.paused = false;
            this.pausedAt = null;
        }

        isExpired(): boolean {
            if (this.endTime === null) return false;
            else return Date.now() >= this.endTime;
        }

        toMillis(minutes: minutes) {
            return minutes * 60 * 1000;
        }

        millisToMinutes(millis: number) {
            return millis / 1000 / 60;
        }

        // TODO: This is bugged logic. We are not creating the remaining date correctly and it always has 7 extra hours
        getHumanReadableTime(): string {
            const delta: number = this.endTime - Date.now();
            const remaining: Date = new Date(delta);
            return dateFormat(remaining, "MM:ss");
        }

        resetTimer() {
            this.startTime = null;
            this.endTime = null;
        }
    }

    // Experience Bar calling logic
    let experienceBar;

    // Quick Add logic
    let taskText: string = "";
    let quickTasks: string[] = [];
    function quickAdd() {
        if (taskText.length > 0) {
            tasks.addTask(taskText);
            quickTasks = [...quickTasks, taskText];
        } else {
            alert("You didn't give me a task!");
        }
    }
    // function quickDelete(task: TaskType) {
    //     tasks.removeTask();
    // }

    enum State {
        SelectingTimer,
        TimerCountingDown,
        Reward,
    }

    // Component state (event)
    let state: State = State.SelectingTimer;

    let timeRemaining: Time = null;

    let userSelectableTimes: minutes[] = [1, 5, 10, 15, 20, 25, 30, 45, 60, 90];
    let currentTaskTime: minutes;

    // Sets the timer based on user input
    function userSelectedTime(minutes: minutes): void {
        timeRemaining = new Time(minutes);
        // Record for reward
        currentTaskTime = minutes;
        state = State.TimerCountingDown;
    }

    // onTimePassed
    let displayTime: string = null;
    let interval = null;
    $: if (
        state === State.TimerCountingDown &&
        timeRemaining.paused === false &&
        timeRemaining.isExpired() === false
    ) {
        interval = setInterval(updateDisplayTime, 300);
    }

    let updateDisplayTime = () => {
        if (timeRemaining.isExpired()) {
            completeTask();
        } else {
            displayTime = timeRemaining.getHumanReadableTime();
            document.title = displayTime;
        }
    };

    // Handle pausing by tracking how long we are paused for, and adjusting endTime accordingly once unpaused
    function handlePause() {
        timeRemaining.paused = !timeRemaining.paused;

        if (timeRemaining.paused) {
            // Stop counting down
            clearInterval(interval);
            // Adjust title
            document.title = "Timer paused";
            // Keep track of pause time
            timeRemaining.pausedAt = Date.now();
        }

        if (!timeRemaining.paused) {
            // Interval is set using dynamic svelte
            const pausedLength = Date.now() - timeRemaining.pausedAt;
            timeRemaining.endTime += pausedLength;
        }
    }

    // When a user manually completes a task, offer them the reward
    function completeTask() {
        timeRemaining.resetTimer();
        clearInterval(interval);
        experienceBar.gainExperience(50 * currentTaskTime);
        state = State.Reward;
    }
</script>

<AppShell selected="Play">
    <Experience bind:this={experienceBar} />
    {#if state === State.TimerCountingDown}
        <section class="h-screen">
            {#if $tasks.find(t => t.type === TaskTypes.MainGoal)}
            <h1 class="text-xl font-bold text-center mt-8">
                Main Goal
            </h1>
            <h1 class="text-2xl font-bold text-center mt-4">
                {$tasks.find(t => t.type === TaskTypes.MainGoal).text}
            </h1>
            {/if}
            <div class="mt-64 grid content-center items-center">
                <h1 class="text-center text-2xl font-black">I'm working on:</h1>
                <input
                    placeholder="My project"
                    class="w-1/2 mx-auto text-center text-4xl mb-8 font-black bg-gray-100"
                />
            </div>
            <div class="grid content-center items-center">
                <h1 class="text-center text-6xl font-black font-sans">
                    {displayTime}
                </h1>
                <button
                    type="button"
                    on:click={handlePause}
                    class="my-2 w-1/2 mx-auto inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                    {timeRemaining.paused ? "Resume" : "Pause"}
                </button>
                <button
                    type="button"
                    on:click={completeTask}
                    class="my-2 w-1/2 mx-auto inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                >
                    {"Task Complete!"}
                </button>
            </div>
            <div>
                <h1>Quick add tasks</h1>
                <div class="flex">
                    <input
                        placeholder="Enter task here"
                        bind:value={taskText}
                    />
                    <button on:click={quickAdd}>Add Task</button>
                </div>
            </div>
            <div>
                <!-- TODO: This logic broke due to quickTasks not having the same index as $tasks -->
                <!-- <h1>Tasks</h1>
            <ul>
                {#each quickTasks as quickTask, i}
                <div class="grid grid-cols-3">
                    <li class="col-span-2">{quickTask}</li>
                    <button on:click={e => quickDelete(i)} class="col-span-1">Complete</button>
                </div>
                {/each}
            </ul> -->
            </div>
        </section>
    {:else if state === State.SelectingTimer}
        <!-- Timer selection screen-->
        <section>
            {#if $tasks.find(t => t.type === TaskTypes.MainGoal)}
            <h1 class="text-2xl font-bold text-center my-8">
                Main Goal
            </h1>
            <h1 class="text-xl font-bold text-center my-8">
                {$tasks.find(t => t.type === TaskTypes.MainGoal).text}
            </h1>
            {/if}

            <h1 class="text-2xl font-bold text-center my-8">
                Choose your timer length
            </h1>

            <ul class="grid gap-8 grid-cols-3 justify-items-center">
                {#each userSelectableTimes as time}
                    <li on:click={(_) => userSelectedTime(time)} class="w-2/3">
                        <button
                            type="button"
                            class="w-full inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                        >
                            {time} minutes
                        </button>
                    </li>
                {/each}
            </ul>

            <div class="mt-8">
                {#if !$tasks.find(t => t.type === TaskTypes.MainGoal)}
                    <h1 class="text-xl font-black text-center">Select Main Goal</h1>
                    <div class="mt-4 bg-white shadow overflow-hidden sm:rounded-md">

                        <ul class="divide-y divide-gray-200">
                            {#each $tasks as task}
                                {#if task.type === TaskTypes.Daily}
                                    <li class="px-4 py-4 sm:px-6">
                                        <div class="flex items-center justify-between">
                                            <p>{task.text}</p>
                                            <p on:click={e => task.type = TaskTypes.MainGoal} class="text-green-500 hover:text-green-600">Make Main Goal</p>
                                        </div>
                                    </li>
                                {/if}
                            {/each}
                        </ul>
                    </div>
                {/if}
            </div>
        </section>
    {:else if state === State.Reward}
        <section class="grid content-center">
            <h2 class="text-center text-xl italic">Your Reward:</h2>
            <h3 class="text-center my-16 text-4xl">{getReward()}</h3>
            <div class="mx-auto my-16">
                <button
                    on:click={(e) => (state = State.SelectingTimer)}
                    class="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                    Start a new session
                </button>
            </div>
        </section>
    {/if}
</AppShell>
<!-- Timer -->
