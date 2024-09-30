contract;

mod errors;

use errors::{TaskError};
use std::{hash::Hash, storage::storage_string::*, string::String};
use std::storage::storage_vec::*;
use std::vec::Vec;
use std::logging::log;


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

struct Comment {
    id: u16,
    message: String,
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

    #[storage(read)]
    fn get_tasks() -> Vec<Task>;

    #[storage(read,write)]
    fn batch_update(actions: Vec<TaskAction>);

    fn comment(id: u16, message: String);

    #[storage(write)]
    fn set_name(name: String);

    fn set_description(description: String);
}

#[storage(read,write)]
fn _add_task(id: u16, checked: bool, name: String) -> Task {
    let nbr: u16 = storage.tasks_count.read();

    storage.tasks_ids.push(id);
    storage.tasks_checked.insert(id, checked);
    storage.tasks_names.get(id).write_slice(name);
    storage.tasks_count.write(storage.tasks_count.read() + 1);
    let task = Task {
        id: id,
        checked: checked,
        name: name
    };
    return task;
}

#[storage(read)]
fn _get_task(id: u16) -> Option<Task> {
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
        return Option::Some(task);
    }
}

impl GalaxyTemplate for Contract {
    fn comment(id: u16, message: String) {
        let c = Comment {
            id: id,
            message: message
        };
        log(c);
    }

    fn set_description(description: String) {
        log(description);
    }

    #[storage(write)]
    fn set_name(name: String) {
        storage.name.write_slice(name);
    }

    #[storage(read, write)]
    fn add_task(id: u16, checked: bool, name: String) -> Task {
        _add_task(id, checked, name)
    }

    #[storage(read)]
    fn get_task(id: u16) -> Option<Task> {
        _get_task(id)
    }

    #[storage(read,write)]
    fn batch_update(actions: Vec<TaskAction>) {
        for action in actions.iter() {
            match action {
                TaskAction::Add(task) => {
                    require(task.id < 4096, TaskError::IdOutOfBounds);
                    //add_task(task.id, task.checked, task.name); // does not work for some reason
                    let nbr: u16 = storage.tasks_count.read();
                    let t = _add_task(task.id, task.checked, task.name);
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


    #[storage(read)]
    fn get_tasks() -> Vec<Task> {
        let mut result: Vec<Task> = Vec::new();
        let mut i = 0;
        let length = storage.tasks_ids.len();
        while i < length {
            let id = storage.tasks_ids.get(i).unwrap().read();
            let task = _get_task(id).unwrap();
            result.push(task);
            i += 1;
        }
        return result;
    }
}
