import { get, writable } from "svelte/store";
import { v4 as uuidv4 } from 'uuid';

const user = writable({
    tokens: null
});

// TASKS
type UuidType = string;
export type TaskType = {
    isDaily: boolean,
    text: string,
    id: UuidType
};
function createTasksStore() {
    let data: TaskType[] = [];
    // Attempt to initialize tasks from localstorage
    if (window.localStorage.getItem("tasks")) {
        data = JSON.parse(window.localStorage.getItem("tasks"));
        
        // TODO: Commenting because migration logic is no longer needed
        // Migration logic: If a task has no UUID, give it one
        // FIXME: Does not actually update localstorage with the changes until an update occurs 
        // for (let i = 0; i < data.length; i++) {
        //     if (!data[i].id) {
        //         data[i].id = uuidv4();
        //     }
        // }
    };

    const tasksStore = writable(data);

    // Replace `set` and `update` with methods that handle localStorage logic
    function addTask(taskText: string, isDaily: boolean = false) {
        let id: UuidType = uuidv4();
        let task: TaskType = {isDaily, text: taskText, id}
        tasksStore.update(allTasks => [...allTasks, task]);
        persist();
    }

    function removeTask(id: UuidType) {
        function updater(allTasks: TaskType[]) {
            allTasks = allTasks.filter(task => task.id != id);
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
        removeTask,
        set:setter
    }
}
export const tasks = createTasksStore();
export { user };
