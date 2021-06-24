<script lang="typescript">
    import { fade } from 'svelte/transition';
    import { getReward } from '../Rewards.svelte';
    import AppShell from '../AppShell.svelte';
    import dateFormat from "dateformat";
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

            else return (Date.now() >= this.endTime);
        }

        toMillis(minutes: minutes) {
            return minutes * 60 * 1000;
        };

        getHumanReadableTime(): string {
            const delta: number = this.endTime - Date.now();
            const remaining: Date = new Date(delta);
            return dateFormat(remaining, "MM:ss");
        }

        resetTimer() {
            this.startTime = null;
            this.endTime = null;
        }
    };
    
    enum State {
        SelectingTimer,
        TimerCountingDown,
        Reward
    }

    // Component state (event)
    let state : State = State.SelectingTimer;

    let timeRemaining: Time = null;

    let userSelectableTimes : minutes[] = [1, 5, 10, 15, 20, 25, 30, 45, 60, 90];

    // Sets the timer based on user input
    function userSelectedTime(minutes : minutes) : void {
        timeRemaining = new Time(minutes);
        state = State.TimerCountingDown;
    }

    // onTimePassed
    let displayTime : string = null;
    let interval = null;
    $: if (state === State.TimerCountingDown && timeRemaining.paused === false && timeRemaining.isExpired() === false) {
        interval = setInterval(updateDisplayTime, 300);
    }

    let updateDisplayTime = () => {
        if (timeRemaining.isExpired()) {
            timeRemaining.resetTimer();
            state = State.Reward;
        }
        else {
            displayTime = timeRemaining.getHumanReadableTime();
            document.title = displayTime;
        }
    }

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
</script>

<AppShell selected="Play">
    {#if state === State.TimerCountingDown }
    <section class="h-screen">
        <div class="mt-64 grid content-center items-center">
            <h1 class="text-center text-2xl font-black">I'm working on:</h1>
            <input placeholder="My project" class="w-1/2 mx-auto text-center text-4xl mb-8 font-black bg-gray-100"/>
        </div>
        <div class="grid content-center items-center">
            <h1 class="text-center text-6xl font-black font-sans">{displayTime}</h1>
            <button type="button" on:click={handlePause} class="my-2 w-1/2 mx-auto inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                {timeRemaining.paused ? "Resume" : "Pause"}
            </button>
        </div>
    </section>
    {:else if state === State.SelectingTimer}
    <!-- Timer selection screen-->
    <section>
        <h1 class="text-2xl font-bold text-center my-8">Choose your timer length</h1>

        <ul class="grid gap-8 grid-cols-3 justify-items-center">
            {#each userSelectableTimes as time}
                <li on:click={_ => userSelectedTime(time)} class="w-2/3">
                    <button type="button" class="w-full inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                        {time} minutes
                    </button>
                </li>
            {/each}
        </ul>
    </section>
    {:else if state === State.Reward }
    <section class="grid content-center">
        <h2 class="text-center text-xl italic">Your Reward:</h2>
        <h3 class="text-center my-16 text-4xl">{getReward()}</h3>
        <div class="mx-auto my-16">
            <button on:click={e => state = State.SelectingTimer} class="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500" >
                Start a new session
            </button>
        </div>
    </section>
    {/if}
</AppShell>
<!-- Timer -->