<script type="ts" context="module">
    enum Category {
        BonusXP='BonusXP',
        Leisure='Leisure',
        MajorReward='MajorReward'
    }

    function getCategory() : Category {
        const isBonusXP : (x: number) => boolean
            = (x) => (0 <= x && x < 0.30);

        const isLeisure : (x: number) => boolean
            = (x) => (0.30 <= x && x < 0.90);

        const isMajorReward : (x: number) => boolean
            = (x) => (0.90 <= x && x < 1);


        let x = Math.random();

        console.log({rewardRoll: x});

        if (isBonusXP(x)) {
            return Category.BonusXP;
        }
        else if (isLeisure(x)) {
            return Category.Leisure;
        }
        else if (isMajorReward(x)) {
            return Category.MajorReward;
        }
        else {
            throw new Error("Unable to determine Category for reward")
        }
    }

    function getRandomReward(options : string[]) {
        let randomIndex = Math.floor(Math.random() * options.length);

        console.log({randomIndex});

        return options[randomIndex]
    }

    export function getReward() : string {
        let category : Category = getCategory();
        console.log({category});
        
        let options = {
            'BonusXP': ["Pull-ups App", "Clean House", "Do Laundry", "Figure out fees for filing annually with an S-corp"],
            'Leisure': ["Audiobook/Read", "Enjoy the sun or take a quick walk", "Piano"],
            'MajorReward': ["PSO2:NGS Dailies", "15|10 Chess Game & Analysis", "20 Minutes Chess Study"]
        };
        let selectedOptions : string[] = options[category];

        console.log({selectedOptions});

        let reward = getRandomReward(selectedOptions);
        return reward;
    }
</script>