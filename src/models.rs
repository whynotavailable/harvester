use serde::{Deserialize, Serialize};
use sqlx::{postgres::types::PgHstore, prelude::FromRow};
use uuid::Uuid;

#[derive(Clone)]
pub struct State {
    pub pool: sqlx::Pool<sqlx::Postgres>,
}

#[derive(Debug, Serialize, Deserialize, FromRow)]
pub struct Agent {
    pub id: Option<Uuid>,
    pub name: String,
    pub config: PgHstore,
}
