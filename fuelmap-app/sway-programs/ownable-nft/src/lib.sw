library;

mod errors;

use errors::OwnableNFTError;

use std::{
    constants::DEFAULT_SUB_ID,
    asset::transfer,
};

use standards::src5::State;

use sway_libs::ownership::events::OwnershipTransferred;

// Pre-computed hash digest of sha256("owner")
const OWNER = 0x4c1029697ee358715d3a14a2add817c4b01651440de808371f78165ac90dc581;

#[storage(read, write)]
pub fn _transfer_with_ownership(new_owner: Identity, sent_asset: AssetId, sent_amount: u64, amount_should_be: u64) {
    let assetId = AssetId::new(ContractId::this(), DEFAULT_SUB_ID);
    // let sent_asset = msg_asset_id();
    // let sent_amount = msg_amount();
    require(sent_asset == assetId, OwnableNFTError::IncorrectAssetSent);

    require(sent_amount == amount_should_be, OwnableNFTError::IncorrectAmountSent);

    transfer(new_owner, assetId, amount_should_be);

    let owner_key = StorageKey::new(OWNER, 0, OWNER);
    owner_key.write(State::Initialized(new_owner));

    log(OwnershipTransferred {
        new_owner,
        previous_owner: msg_sender().unwrap(),
    });
}

abi OwnableNFT {
    #[payable]
    #[storage(read,write)]
    fn transfer_with_ownership(new_owner: Identity);
}
