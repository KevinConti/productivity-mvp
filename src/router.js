// Components
import Play from './routes/Play.svelte'
import Tasks from './routes/Tasks.svelte';
import Signin from './routes/Signin.svelte';
import Backlog from './routes/Backlog.svelte';
import DailyPlanning from './routes/DailyPlanning.svelte';

export const routes = {
    // Exact path
    '/': Play,
    '/Play': Play,
    '/Tasks': Tasks,
    '/sign-in': Signin,
    '/Backlog': Backlog,
    '/daily-planning': DailyPlanning,
    // Using named parameters, with last being optional
    //'/author/:first/:last?': Author,

    // Wildcard parameter
    //'/book/*': Book,

    // Catch-all
    // This is optional, but if present it must be the last
    //'*': NotFound,
}