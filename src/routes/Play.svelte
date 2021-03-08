<script lang="typescript">
    import { fade } from 'svelte/transition';
    import { getReward } from '../Rewards.svelte';
    import AppShell from '../AppShell.svelte';
    // DEV-VARIABLES
    const speedUpPomodoro = false;


    type minutes = number;
    type seconds = number;
    type Time = {
        minutes : minutes,
        seconds: seconds,
        paused: boolean,
        isExpired: () => boolean
    };
    enum State {
        SelectingTimer,
        TimerCountingDown,
        Reward
    }

    // Component state (event)
    let state : State = State.SelectingTimer;

    let timeRemaining : Time = {
        minutes : 0,
        seconds : 0,
        isExpired : function() : boolean {
            return (this.minutes === 0 && this.seconds === 0);
        },
        paused: false
    };

    let userSelectableTimes : minutes[] = [5, 10, 15, 20, 25, 30, 45, 60, 90];

    function userSelectedTime(minutes : minutes) : void {
        timeRemaining.minutes = minutes;
        state = State.TimerCountingDown;
    }

    // onTimePassed
    $: if (state === State.TimerCountingDown) {
        // Start first second
        setTimeout(onSecondPassed, (speedUpPomodoro ? 1 : 1000));
    }
    
    $: document.title = formatTime(timeRemaining);

    function handlePause() {
        timeRemaining.paused = !timeRemaining.paused;

        if (timeRemaining.paused) {
            document.title = "Timer paused";
        }

        else onSecondPassed();
    }

    // Subtracts seconds from timeRemaining, AND changes state when timer is completed
    function onSecondPassed(){

        // Only run if the timer isn't paused
        if (timeRemaining.paused) {
            return;
        }

        // Time is up
        if (timeRemaining.isExpired()) {
            document.title = "Claim your reward!"
            state = State.Reward;
            return;
        }

        // Seconds are at zero
        if (timeRemaining.seconds === 0){
            timeRemaining.minutes--;
            timeRemaining.seconds = 59;
        }
        else {
            timeRemaining.seconds--;
        }
        setTimeout(onSecondPassed, (speedUpPomodoro ? 1 : 1000))
    }

    function formatTime(time: Time){
        let minutes : string = addZeroIfNecessary(time.minutes);
        let seconds : string = addZeroIfNecessary(time.seconds);
        return`${minutes}:${seconds}`;
    }

    function addZeroIfNecessary(minuteOrSecond : minutes | seconds) : string{
        
        if (minuteOrSecond.toString().length === 1) {
            return `0${minuteOrSecond}`;
        }

        return minuteOrSecond.toString();
    }
</script>

<AppShell selected="Play">
    {#if state === State.TimerCountingDown }
    <section class="h-screen">
        <div class="grid content-center items-center h-screen">
            <h1 class="text-center text-6xl font-black font-sans">{formatTime(timeRemaining)}</h1>
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