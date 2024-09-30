use fuels::{prelude::*, types::ContractId, tx::StorageSlot};

// Load ABI from JSON
abigen!(Contract(
    name = "GalaxyTemplate",
    abi = "out/debug/galaxy_template-abi.json"
));

async fn get_contract_instance() -> (GalaxyTemplate<WalletUnlocked>, ContractId) {
    // Launch a local network and deploy the contract
    let mut wallets = launch_custom_provider_and_get_wallets(
        WalletsConfig::new(
            Some(1),             // Single wallet
            Some(1),             // Single coin (UTXO)
            Some(1_000_000_000), // Amount per coin
        ),
        None,
        None,
    )
    .await
    .unwrap();
    let wallet = wallets.pop().unwrap();

    // Load storage slots from JSON file
    let storage_slots: Vec<StorageSlot> = serde_json::from_reader(
        std::fs::File::open("./out/debug/galaxy_template-storage_slots.json").unwrap()
    ).unwrap();

    let storage_configuration = StorageConfiguration::default().add_slot_overrides(storage_slots);

    let id = Contract::load_from(
        "./out/debug/galaxy_template.bin",
        LoadConfiguration::default().with_storage_configuration(storage_configuration),
    )
    .unwrap()
    .deploy(&wallet, TxPolicies::default())
    .await
    .unwrap();

    let instance = GalaxyTemplate::new(id.clone(), wallet);

    (instance, id.into())
}

#[tokio::test]
async fn test_add_task() {
    let (contract_instance, _id) = get_contract_instance().await;

    // Create a new task
    let task = Task {
        id: 0,
        checked: false,
        name: String::from("Test Task"),
    };

    // Add the task to the contract's storage
    let result = contract_instance
        .methods()
        .add_task(task.id, task.checked, task.name)
        .call()
        .await
        .unwrap();

    assert_eq!(result.value.id, 0);
    assert_eq!(result.value.checked, false);
    assert_eq!(result.value.name, String::from("Test Task"));

    // Verify the task was added correctly
    let get_result = contract_instance
        .methods()
        .get_task(0)
        .call()
        .await
        .unwrap();

    let value2 = get_result.value.unwrap();
    assert_eq!(value2.id, 0);
    assert_eq!(value2.checked, false);
    assert_eq!(value2.name, String::from("Test Task"));
}

#[tokio::test]
async fn test_get_task() {
    let (contract_instance, _id) = get_contract_instance().await;

    // Create a new task
    let task = Task {
        id: 1,
        checked: false,
        name: String::from("Test Task"),
    };

    // Add the task to the contract's storage
    contract_instance
        .methods()
        .add_task(task.id, task.checked, task.name)
        .call()
        .await
        .unwrap();

    // Test the get_task function
    let result = contract_instance
        .methods()
        .get_task(1)
        .call()
        .await
        .unwrap();

    let value = result.value.unwrap();
    assert_eq!(value.id, 1);
    assert_eq!(value.checked, false);
    assert_eq!(value.name, String::from("Test Task"));
}
