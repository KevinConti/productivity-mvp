<script lang="ts">

    const experienceToLevel = 
        [2000, 2110, 2379, 2674, 2999, 3343, 3719, 4129, 4567, 5044,
        5553, 6111, 6705, 7354, 8042, 8790, 9270, 9770, 10300, 10900,
        11400, 12100, 12700, 13400, 14100, 14900];
        // 11400, 12100, 12700, 13400, 14100, 14900, 15700, 16500, 17400, 18300,
        // 19300, 20400, 21500, 22600, 23900, 25100, 26500, 27900, 29400, 31000,
        // 32700, 34500, 36300, 38300, 40300, 42500, 44800, 47200, 49800, 52500,
        // 55300, 58300, 61400, 64700, 68200, 71900, 75800, 79800, 84100, 88700, 
        // 93500, 98500, 104000, 109000, 115000, 122000, 128000, 135000, 142000, 150000,
        // 158000, 167000, 176000, 185000, 195000, 205000, 217000, 228000, 241000, 254000];

    //Get the experience for the user
    let experience = 0;
    let level = 0;
    if (window.localStorage.getItem("experience")) {
        experience = parseInt(window.localStorage.getItem("experience"));
    }
    if (window.localStorage.getItem("level")) {
        level = parseInt(window.localStorage.getItem("level"));
    }
    // Convert current experience to a fraction out of 12
    $: experienceToNextLevel = (level > experienceToLevel.length) ? 15000 : experienceToLevel[level];
    $: percentage = (experience / experienceToNextLevel) * 100;
    // To convert from a fraction out of 100 (aka a percentage) to out of 12, multiply by 12 and divide the result by 100
    $: result = Math.round((percentage * 12)/100) ?? 0;
    console.log({result});
    let width;
    $: {
        if (result === 0) {
            width = "w-0";
        }
        else {
            width = `w-${result}/12`
        }
    }

    export function gainExperience(amount: number) {
        if (experience + amount >= experienceToNextLevel) {
            // Level up!
            level = level + 1;
            window.localStorage.setItem("level", level.toString());
            let remainingExperience = experienceToNextLevel - experience;
            amount = amount - remainingExperience;
            experience = amount;
        }
        else {
            experience = experience + amount;
        }
        // Save to local storage
        window.localStorage.setItem("experience", experience.toString());
    }

    function resetExperience() {
        experience = 0;
        level = 0;
        // Save to local storage
        window.localStorage.setItem("experience", experience.toString());
        window.localStorage.setItem("level", level.toString());
    }
</script>

<!-- Experience Bar -->
<!-- This example requires Tailwind CSS v2.0+ -->
<div>
    <h1 class="text-lg font-bold text-center">Level {level + 1}</h1>
    <div class="relative bg-gray-600 w-full h-12 rounded-xl">
        <div class="absolute inset-0 grid content-center">
            <p class="text-center text-white text-lg font-semibold">{experience} / {experienceToNextLevel}</p>
        </div>
        <div class="bg-blue-600 h-12 rounded-xl {width}">
        </div>
    </div>
    <button on:click={resetExperience} class="font-light text-sm">Reset (Dev Only)</button>
</div>