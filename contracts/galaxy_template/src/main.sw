contract;

mod errors;

use errors::{TaskError};
use std::{hash::Hash, storage::storage_string::*, string::String};
use std::storage::storage_vec::*;


struct Task {
    id: u16, // 12 bit (2 bytes) id
    checked: bool, //1 byte for checked or not
    name: String // string
}

struct UpdateTask {
    id: u16, // 12 bit (2 bytes) id
    checked: Option<bool>, //1 byte for checked or not
    name: Option<String> // string
}

enum TaskAction {
    Add: Task,
    Update: UpdateTask,
    Delete: UpdateTask,
}

storage {
    name: StorageString = StorageString {},
    tasks_count: u16 = 0,
    tasks_ids: StorageVec<u16> = StorageVec {}, // should be an array but not yet implemented
    tasks_checked: StorageMap<u16, bool> = StorageMap {},
    tasks_names: StorageMap<u16, StorageString> = StorageMap {} // this is because sway is a piece of shit that can't even handle structs with storageStrings@@@@@@!!!!!!
}

abi GalaxyTemplate {
    #[storage(read, write)]
    fn add_task(id: u16, checked: bool, name: String) -> Task;

    #[storage(read)]
    fn get_task(id: u16) -> Option<Task>;

    #[storage(read,write)]
    fn batch_update(actions: Vec<TaskAction>);
}

impl GalaxyTemplate for Contract {
    #[storage(read,write)]
    fn batch_update(actions: Vec<TaskAction>) {
        for action in actions.iter() {
            match action {
                TaskAction::Add(task) => {
                    require(task.id < 4096, TaskError::IdOutOfBounds);
                    //add_task(task.id, task.checked, task.name); // does not work for some reason
                    let nbr: u16 = storage.tasks_count.read();

                    storage.tasks_checked.insert(task.id, task.checked);
                    storage.tasks_names.get(task.id).write_slice(task.name);
                    storage.tasks_count.write(storage.tasks_count.read() + 1);
                },
                TaskAction::Update(task) => {
                    if let Some(new_checked) = task.checked {
                        storage.tasks_checked.insert(task.id, new_checked);
                    }
                    if let Some(new_name) = task.name {
                        storage.tasks_names.get(task.id).write_slice(new_name);
                    }
                },
                TaskAction::Delete(task) => {
                    storage.tasks_checked.remove(task.id);
                    storage.tasks_names.remove(task.id);
                }
            }
        }
    }

    #[storage(read, write)]
    fn add_task(id: u16, checked: bool, name: String) -> Task {
        let nbr: u16 = storage.tasks_count.read();

        storage.tasks_checked.insert(id, checked);
        storage.tasks_names.get(id).write_slice(name);
        storage.tasks_count.write(storage.tasks_count.read() + 1);
        let task = Task {
            id: id,
            checked: checked,
            name: name
        };
        return task
    }

    #[storage(read)]
    fn get_task(id: u16) -> Option<Task> {
        let checked = storage.tasks_checked.get(id).try_read();
        if checked.is_none() {
            return Option::None;
        } else {
            let name = storage.tasks_names.get(id).read_slice().unwrap();
            let task = Task {
                id: id,
                checked: checked.unwrap(),
                name: name,
            };
            Option::Some(task)
        }
    }
}
