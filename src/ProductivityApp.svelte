<script lang="typescript">
    type minutes = number;
    type seconds = number;
    type Time = {
        minutes : minutes,
        seconds: seconds
    };

    let timeRemaining : Time = {
        minutes : 0,
        seconds : 0
    };
    let userSelectableTimes : minutes[] = [5, 10, 15, 25, 30, 45, 60, 90];

    // onTimePassed
    $: if (timeRemaining.minutes !== 0 || timeRemaining.seconds !== 0) {
        setTimeout(onSecondPassed, 1000);
    }
    

    function onSecondPassed(){
        console.log("onSecondPassed")
        // Seconds are at zero
        if (timeRemaining.seconds === 0){
            timeRemaining.minutes--;
            timeRemaining.seconds = 59;
        }
        else {
            timeRemaining.seconds--;
        }
    }
</script>

<!-- Timer -->
{#if timeRemaining.minutes !== 0 || timeRemaining.seconds !== 0}
<section>
    <h1>Timer</h1>
    <h2>{timeRemaining.minutes}:{timeRemaining.seconds}</h2>
</section>
{:else}
<!-- Timer selection screen-->
<section>
    <h1>Choose your timer length</h1>
    <li>
        {#each userSelectableTimes as time}
            <ul on:click={_ => timeRemaining.minutes = time}>{time}</ul>
        {/each}
    </li>
    <h1>{timeRemaining && timeRemaining.minutes}</h1>
</section>
{/if}