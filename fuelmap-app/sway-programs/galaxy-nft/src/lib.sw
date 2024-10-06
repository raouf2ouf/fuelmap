library;

use std::logging::log;
use std::string::String;

pub enum TaskError {
    IdOutOfBounds: ()
}

pub struct Task {
    pub id: u16, // 12 bits (2 bytes) id
    pub checked: bool, // 1 byte for checked
    pub name: str[29]
}

pub struct AddTask {
    pub id: u16,
    pub checked: bool,
    pub name: str[29],
    pub description: Option<String>
}

pub struct UpdateTask {
    pub id: u16,
    pub checked: Option<bool>,
    pub name: Option<str[29]>,
    pub description: Option<String>
}

pub struct CommentEvent {
    pub subId: u64,
    pub id: u16,
    pub message: String
}

pub struct DescriptionEvent {
    pub description: String
}

pub struct TaskDescriptionEvent {
    pub id: u16,
    pub description: String
}

pub enum TaskAction {
    Add: AddTask,
    Update: UpdateTask,
    Delete: u16,
}

abi Galaxy {
    #[storage(read)]
    fn get_task(id: u16) -> Option<Task>;

    #[storage(read)]
    fn get_tasks() -> Vec<Task>;

    #[storage(read,write)]
    fn batch_update(actions: Vec<TaskAction>);

    #[storage(read, write)]
    fn set_name(name: str[32]);
    #[storage(read)]
    fn get_name() -> str[32];

    #[storage(read)]
    fn set_description(description: String);
}
