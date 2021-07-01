import { get, writable } from "svelte/store";

const user = writable({
    tokens: null
});

// TASKS
export type TaskType = {
    isDaily: boolean,
    text: string
};
function createTasksStore() {
    let data: TaskType[] = [];
    // Attempt to initialize tasks from localstorage
    if (window.localStorage.getItem("tasks")) {
        data = JSON.parse(window.localStorage.getItem("tasks"));
    };

    const tasksStore = writable(data);

    // Replace `set` and `update` with methods that handle localStorage logic
    function addTask(taskText: string, isDaily: boolean = false) {
        let task: TaskType = {isDaily, text: taskText}
        tasksStore.update(allTasks => [...allTasks, task]);
        persist();
    }

    function removeTaskAtIndex(i: number) {
        function updater(allTasks: TaskType[]) {
            allTasks.splice(i, 1);
            return allTasks;
        }

        tasksStore.update(updater);
        persist();
    }

    function persist() {
        let value: TaskType[] = get(tasksStore);
        window.localStorage.setItem("tasks", JSON.stringify(value));
    }

    function setter(newData: TaskType[]) {
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
