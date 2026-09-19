use soroban_sdk::{contracttype, Address};

#[contracttype]
#[derive(Clone, Debug, Eq, PartialEq)]
pub enum Prize {
    Bucket = 0,
    Botton = 1,
    Chaveiro = 2,
    Nada = 3,
}

#[contracttype]
#[derive(Clone)]
pub enum DataKey {
    Admin,
    TokenAddress,
    Salt,
    LastResult(Address),
    PlayCount(Address),
}
