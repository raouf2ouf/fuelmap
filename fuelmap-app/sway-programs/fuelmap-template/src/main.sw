contract;

use standards::{src20::SRC20, src3::SRC3, src5::{SRC5, State}, src7::{Metadata, SRC7},};
use sway_libs::{
    ownership::{
        _owner,
        initialize_ownership,
        only_owner,
    },
};
use std::{
    hash::Hash,
    storage::{storage_string::*, storage_vec::*},
    string::String,
    asset::{mint_to, transfer},
    context::msg_amount,
    auth::msg_sender,
    call_frames::msg_asset_id,
    address::Address,
    vec::Vec,
    constants::DEFAULT_SUB_ID,
};


use ownable_nft::{OwnableNFT, OwnableNFTError, _transfer_with_ownership};
use galaxy_nft::{Galaxy, Task, AddTask, UpdateTask, TaskAction, CommentEvent, DescriptionEvent, TaskDescriptionEvent, TaskError};

storage {
    name: str[32] = __to_str_array("                                "),
    symbol: str[4] = __to_str_array("FMap"),
    commenting_fee: u64 = 1,
    instanciating_fee: u64 = 1,
    default_asset_id: Option<AssetId> =  Option::None,
    tasks: StorageMap<u16, Task> = StorageMap {},
    tasks_ids: StorageVec<u16> = StorageVec {},
    assets_owners: StorageVec<Identity> = StorageVec {},
    assets_metadata: StorageMap<(AssetId, u16), bool> = StorageMap {},
}


impl SRC5 for Contract {
    #[storage(read)]
    fn owner() -> State {
        _owner()
    }
}

impl SRC20 for Contract {
    #[storage(read)]
    fn total_assets() -> u64 {
        return storage.assets_owners.len() + 1; // the contract itself is an asset + instances
    }

    #[storage(read)]
    fn total_supply(asset: AssetId) -> Option<u64> {
        return Option::Some(1);
    }

    #[storage(read)]
    fn name(asset: AssetId) -> Option<String> {
        let name: String = String::from_ascii_str(from_str_array(storage.name.read()));
       return Option::Some(name);
    }

    #[storage(read)]
    fn symbol(asset: AssetId) -> Option<String> {
        let symbol: String = String::from_ascii_str(from_str_array(storage.symbol.read()));
        return Option::Some(symbol);
    }

    #[storage(read)]
    fn decimals(asset: AssetId) -> Option<u8> {
        return Some(0u8);
    }
}

impl OwnableNFT for Contract {
    #[payable]
    #[storage(read,write)]
    fn transfer_with_ownership(new_owner: Identity) {
        let sent_asset = msg_asset_id();
        let sent_amount = msg_amount();
        _transfer_with_ownership(new_owner, sent_asset, sent_amount, 1);
    }

    #[payable]
    #[storage(read)]
    fn comment(subId: u64, id: u16, message: String) {
        let amount = msg_amount();
        let min_value = storage.commenting_fee.read();

        let asset_id = msg_asset_id();
        require(asset_id == AssetId::base() && amount >= min_value, OwnableNFTError::SendMoreToComment);
        log(CommentEvent {subId: subId, id: id, message: message});
    }

    #[storage(read)]
    fn get_comment_fee() -> u64 {
        return storage.commenting_fee.read();
    }

    #[storage(write)]
    fn set_comment_fee(fee: u64) {
        storage.commenting_fee.write(fee);
    }

    #[payable]
    #[storage(read,write)]
    fn update_ownership_of_asset(id: u64) {
        let new_owner = msg_sender().unwrap();
        let sent_asset = msg_asset_id();
        let sent_amount = msg_amount();
        let assetId = AssetId::new(ContractId::this(), SubId::from(id.as_u256()));
        // let sent_asset = msg_asset_id();
        // let sent_amount = msg_amount();
        require(sent_asset == assetId, OwnableNFTError::IncorrectAssetSent);

        require(sent_amount == 1, OwnableNFTError::IncorrectAmountSent);

        storage.assets_owners.insert(id, new_owner);
        transfer(new_owner, assetId, 1);
    }

    #[storage(read)]
    fn get_owner(id: u64) -> Identity {
        return storage.assets_owners.get(id).unwrap().read();
    }

    #[storage(read)]
    fn get_owners() -> Vec<Identity> {
        let mut owners = Vec::new();
        let mut i = 0;
        let count = storage.assets_owners.len();
        while i < count {
            owners.push(storage.assets_owners.get(i).unwrap().read());
            i += 1;
        }
        return owners;
    }
}

abi Constructor {
    #[storage(read, write)]
    fn constructor(owner: Identity, actions: Option<Vec<TaskAction>>);
}
impl Constructor for Contract {
    #[storage(read, write)]
    fn constructor(owner: Identity, actions: Option<Vec<TaskAction>>) {
        initialize_ownership(owner);

        mint_to(owner, DEFAULT_SUB_ID, 1);
        let assetId = AssetId::new(ContractId::this(), DEFAULT_SUB_ID);
        storage.default_asset_id.write(Option::Some(assetId));

        if actions.is_some() {
            _batch_update(actions.unwrap());
        }
    }
}

#[storage(read,write)]
fn _add_task(id: u16, checked: bool, name: str[29], description: Option<String>) -> Task {
    let existing_task: Option<Task> = storage.tasks.get(id).try_read();
    if existing_task.is_none() {
        storage.tasks_ids.push(id);
    }

    let task: Task = Task {id: id, checked: checked, name: name};
    storage.tasks.insert(id, task);

    if description.is_some() {
        log(TaskDescriptionEvent {id: id, description: description.unwrap()});
    }
    return task;
}

#[storage(read)]
fn _get_task(id: u16) -> Option<Task> {
    return storage.tasks.get(id).try_read();
}

#[storage(read, write)]
fn _batch_update(actions: Vec<TaskAction>) {
    for action in actions.iter() {
        match action {
            TaskAction::Add(task) => {
                require(task.id < 4096, TaskError::IdOutOfBounds);
                _add_task(task.id, task.checked, task.name, task.description);
            },
            TaskAction::Update(task) => {
                let mut existing_task = _get_task(task.id).unwrap();
                if task.checked.is_some() {
                    existing_task.checked = task.checked.unwrap();
                }
                if task.name.is_some() {
                    existing_task.name = task.name.unwrap();
                }
                if task.description.is_some() {
                    log(TaskDescriptionEvent {id: task.id, description: task.description.unwrap()});
                }
                storage.tasks.insert(task.id, existing_task);
            },
            TaskAction::Delete(index) => {
                let id = storage.tasks_ids.get(index.as_u64()).unwrap().read();
                storage.tasks_ids.remove(index.as_u64());
                storage.tasks.remove(id);
            }
        }
    }
}


impl Galaxy for Contract {
    #[storage(read,write)]
    fn set_name(name: str[32]) {
        only_owner();
        storage.name.write(name);
    }
    #[storage(read)]
    fn get_name() -> str[32] {
        return storage.name.read();
    }

    #[storage(read)]
    fn set_description(description: String) {
        only_owner();
        log(DescriptionEvent {description: description});
    }


    #[storage(read)]
    fn get_task(id: u16) -> Option<Task> {
        return _get_task(id);
    }

    #[storage(read)]
    fn get_tasks() -> Vec<Task> {
       let mut v: Vec<Task> = Vec::new();
       let count = storage.tasks_ids.len();
       let mut i = 0;
       while i < count {
           let id: u16 = storage.tasks_ids.get(i).unwrap().read();
           let task: Task = _get_task(id).unwrap();
           v.push(task);
           i += 1;
       }
       return v;
    }

    #[storage(read, write)]
    fn batch_update(actions: Vec<TaskAction>) {
        only_owner();
        _batch_update(actions);
    }

}
