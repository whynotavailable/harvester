use axum::{
    extract,
    routing::{get, put},
    Extension, Json, Router,
};
use uuid::Uuid;

use crate::models;

pub async fn get_agents(Extension(state): Extension<models::State>) -> Json<Vec<models::Agent>> {
    let vec = sqlx::query_as::<_, models::Agent>("SELECT * FROM public.agent")
        .fetch_all(&state.pool)
        .await;

    Json(vec.unwrap_or(Vec::new()))
}

const PUT_AGENTS_SQL: &str = "INSERT INTO Agent
(id, name, config) VALUES
($1, $2, $3)
ON CONFLICT (id) DO UPDATE SET name = excluded.name, config = excluded.config;";

pub async fn put_agents(
    Extension(state): Extension<models::State>,
    extract::Json(payload): extract::Json<models::Agent>,
) -> Json<models::Agent> {
    let mut payload = payload;

    if payload.key.is_none() {
        payload.key = Some(Uuid::new_v4());
    }

    _ = sqlx::query(PUT_AGENTS_SQL)
        .bind(payload.key)
        .bind(&payload.name)
        .bind(&payload.config)
        .execute(&state.pool)
        .await;

    Json(payload)
}

pub fn router() -> Router {
    Router::new()
        .route("/agents", get(get_agents))
        .route("/agents", put(put_agents))
}
