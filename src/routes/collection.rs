use axum::Router;
use serde::{Deserialize, Serialize};
use sqlx::prelude::FromRow;
use uuid::Uuid;

#[derive(Debug, Serialize, Deserialize, FromRow)]
pub struct Collection {
    pub name: String,
    pub store_id: Uuid,
}

pub fn render() -> Router {
    Router::new()
}
