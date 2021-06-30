import { get, writable } from "svelte/store";

const dark = writable(false); // dark mode
const user = writable({
    tokens: null
});

function createTasksStore() {
    const taskDelimiter = ',';
    let data = [];
    // Attempt to initialize tasks from localstorage
    if (window.localStorage.getItem("tasks")) {
        data = window.localStorage.getItem("tasks")?.split(taskDelimiter);
    };

    const tasksStore = writable(data);

    // Replace `set` and `update` with methods that handle localStorage logic
    function addTask(task) {
        tasksStore.update(allTasks => [...allTasks, task]);
        persist();
    }

    function removeTaskAtIndex(i) {
        function updater(allTasks) {
            allTasks.splice(i, 1);
            return allTasks;
        }

        tasksStore.update(updater);
        persist();
    }

    function persist() {
        let value = get(tasksStore);
        window.localStorage.setItem("tasks", value.join(taskDelimiter));
    }

    function setter(newData) {
        tasksStore.set(newData);
        persist();
    }

    return {
        subscribe: tasksStore.subscribe,
        addTask,
        removeTaskAtIndex,
        set:setter
    }
}
export const tasks = createTasksStore();
export { user };
