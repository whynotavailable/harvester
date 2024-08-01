use axum::Router;
use chrono::{DateTime, Utc};
use serde::{Deserialize, Serialize};
use sqlx::{postgres::types::PgHstore, prelude::FromRow};
use uuid::Uuid;

#[derive(Debug, Serialize, Deserialize, FromRow)]
pub struct Store {
    pub id: Option<Uuid>,
    pub name: String,
    pub code: Uuid,
    pub kind: String,
    pub config: PgHstore,
    pub last_scan: Option<DateTime<Utc>>,
}

pub fn router() -> Router {
    Router::new()
}
