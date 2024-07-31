use axum::{
    extract::{self, Path},
    http::StatusCode,
    routing::{delete, get, put},
    Extension, Json, Router,
};
use serde::{Deserialize, Serialize};
use sqlx::{postgres::types::PgHstore, prelude::FromRow};
use uuid::Uuid;

use crate::models;

#[derive(Debug, Serialize, Deserialize, FromRow)]
pub struct Agent {
    pub id: Option<Uuid>,
    pub name: String,
    pub config: PgHstore,
}

pub async fn delete_agent(
    Extension(state): Extension<models::State>,
    Path(id): Path<Uuid>,
) -> StatusCode {
    let result = sqlx::query("DELETE FROM public.agent WHERE id = $1")
        .bind(id)
        .execute(&state.pool)
        .await;

    match result {
        Ok(r) => {
            if r.rows_affected() > 0 {
                StatusCode::OK
            } else {
                StatusCode::NOT_FOUND
            }
        }
        Err(_) => StatusCode::INTERNAL_SERVER_ERROR,
    }
}

pub async fn get_agent(
    Extension(state): Extension<models::State>,
    Path(id): Path<Uuid>,
) -> Result<Json<Agent>, StatusCode> {
    let result = sqlx::query_as::<_, Agent>("SELECT * FROM public.agent WHERE id = $1")
        .bind(id)
        .fetch_one(&state.pool)
        .await;

    match result {
        Ok(r) => Ok(Json(r)),
        Err(_) => Err(StatusCode::NOT_FOUND),
    }
}

pub async fn get_agents(Extension(state): Extension<models::State>) -> Json<Vec<Agent>> {
    let vec = sqlx::query_as::<_, Agent>("SELECT * FROM public.agent")
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
    extract::Json(payload): extract::Json<Agent>,
) -> Json<Agent> {
    let mut payload = payload;

    if payload.id.is_none() {
        payload.id = Some(Uuid::new_v4());
    }

    _ = sqlx::query(PUT_AGENTS_SQL)
        .bind(payload.id)
        .bind(&payload.name)
        .bind(&payload.config)
        .execute(&state.pool)
        .await;

    Json(payload)
}

pub fn router() -> Router {
    Router::new()
        .route("/agents/:id", get(get_agent))
        .route("/agents", get(get_agents))
        .route("/agents", put(put_agents))
        .route("/agents/:id", delete(delete_agent))
}
