#![cfg(test)]

use super::*;
use soroban_sdk::{
    testutils::{Address as _, Ledger},
    token::Client as TokenClient,
    token::StellarAssetClient,
    Address, Env,
};

#[test]
fn test_successful_gacha_open() {
    let env = Env::default();
    env.mock_all_auths();

    // Set mock ledger timestamp
    env.ledger().set_timestamp(1700000000);

    let admin = Address::generate(&env);
    let user = Address::generate(&env);

    // Create a mock Stellar Asset token contract (representing native XLM)
    let token_admin = Address::generate(&env);
    let token_contract = env.register_stellar_asset_contract_v2(token_admin.clone());
    let token_client = TokenClient::new(&env, &token_contract.address());
    let stellar_asset_client = StellarAssetClient::new(&env, &token_contract.address());

    // Mint 10 XLM to the user
    stellar_asset_client.mint(&user, &100_000_000);
    assert_eq!(token_client.balance(&user), 100_000_000);

    // Register Gacha contract
    let gacha_id = env.register(GachaMachineContract, ());
    let gacha_client = GachaMachineContractClient::new(&env, &gacha_id);

    // Initialize Gacha contract
    gacha_client.init(&admin, &token_contract.address(), &42);

    // Execute open_chest
    let result = gacha_client.open_chest(&user);

    // User balance should have decreased by 1 XLM (10_000_000)
    assert_eq!(token_client.balance(&user), 90_000_000);
    // Contract should have received 1 XLM
    assert_eq!(token_client.balance(&gacha_id), 10_000_000);

    // Result should be retrievable
    let last_result = gacha_client.get_last_result(&user);
    assert_eq!(last_result, Some(result));

    // Play count should be 1
    assert_eq!(gacha_client.get_play_count(&user), 1);
}

#[test]
#[should_panic]
fn test_uninitialized_chest_fails() {
    let env = Env::default();
    env.mock_all_auths();

    let user = Address::generate(&env);
    let gacha_id = env.register(GachaMachineContract, ());
    let gacha_client = GachaMachineContractClient::new(&env, &gacha_id);

    gacha_client.open_chest(&user);
}
