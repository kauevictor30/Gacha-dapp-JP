#![no_std]

mod errors;
mod storage;

#[cfg(test)]
mod test;

use errors::Error;
use storage::{DataKey, Prize};

use soroban_sdk::{
    contract, contractimpl, symbol_short, token, Address, Bytes, Env,
};

pub const COST_ONE_XLM: i128 = 10_000_000; // 1 XLM = 10^7 stroops

#[contract]
pub struct GachaMachineContract;

#[contractimpl]
impl GachaMachineContract {
    /// Initializes the Gacha Machine with the admin, XLM token address and initial salt.
    pub fn init(env: Env, admin: Address, token_address: Address, salt: u64) -> Result<(), Error> {
        if env.storage().instance().has(&DataKey::Admin) {
            return Err(Error::AlreadyInitialized);
        }

        admin.require_auth();

        env.storage().instance().set(&DataKey::Admin, &admin);
        env.storage().instance().set(&DataKey::TokenAddress, &token_address);
        env.storage().instance().set(&DataKey::Salt, &salt);

        Ok(())
    }

    /// Opens the chest: transfers 1 XLM from user to contract, generates pseudo-random prize, and records result.
    pub fn open_chest(env: Env, user: Address) -> Result<Prize, Error> {
        user.require_auth();

        let token_address: Address = env
            .storage()
            .instance()
            .get(&DataKey::TokenAddress)
            .ok_or(Error::NotInitialized)?;

        let mut salt: u64 = env
            .storage()
            .instance()
            .get(&DataKey::Salt)
            .unwrap_or(123456789);

        // Cross-contract call to Stellar Asset Contract (XLM)
        let token_client = token::Client::new(&env, &token_address);
        token_client.transfer(&user, &env.current_contract_address(), &COST_ONE_XLM);

        // Retrieve user's play count to incorporate into the pseudo-randomness entropy
        let play_count: u32 = env
            .storage()
            .persistent()
            .get(&DataKey::PlayCount(user.clone()))
            .unwrap_or(0);

        // Derive pseudo-random factor using ledger timestamp + internal salt + user play count
        let timestamp = env.ledger().timestamp();
        let mut entropy_bytes = Bytes::new(&env);
        entropy_bytes.append(&Bytes::from_array(&env, &timestamp.to_be_bytes()));
        entropy_bytes.append(&Bytes::from_array(&env, &salt.to_be_bytes()));
        entropy_bytes.append(&Bytes::from_array(&env, &play_count.to_be_bytes()));

        // SHA-256 hash of combined entropy
        let hash = env.crypto().sha256(&entropy_bytes);
        let hash_array = hash.to_array();

        // Convert first bytes to roll in range [0, 99]
        let byte_sample = hash_array[0] as u32;
        let roll = byte_sample % 100;

        // Determine prize according to probability distribution:
        // 0 (1%): Bucket
        // 1..=2 (2%): Botton
        // 3..=9 (7%): Chaveiro
        // 10..=99 (90%): Nada
        let prize = if roll == 0 {
            Prize::Bucket
        } else if roll < 3 {
            Prize::Botton
        } else if roll < 10 {
            Prize::Chaveiro
        } else {
            Prize::Nada
        };

        // Update salt for next run
        salt = salt.wrapping_add((hash_array[1] as u64) + 1);
        env.storage().instance().set(&DataKey::Salt, &salt);

        // Store result and update play count
        env.storage().persistent().set(&DataKey::LastResult(user.clone()), &prize);
        env.storage().persistent().set(&DataKey::PlayCount(user.clone()), &(play_count + 1));

        // Emit an event for frontend listeners
        env.events().publish(
            (symbol_short!("open"), user),
            (prize.clone(), roll),
        );

        Ok(prize)
    }

    /// Reads the last outcome recorded for a user.
    pub fn get_last_result(env: Env, user: Address) -> Option<Prize> {
        env.storage().persistent().get(&DataKey::LastResult(user))
    }

    /// Reads total plays executed by a user.
    pub fn get_play_count(env: Env, user: Address) -> u32 {
        env.storage().persistent().get(&DataKey::PlayCount(user)).unwrap_or(0)
    }
}
