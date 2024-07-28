use axum::routing::{get, put};
use axum::{extract, Extension, Json, Router};
use serde::{Deserialize, Serialize};
use sqlx::postgres::types::PgHstore;
use sqlx::postgres::PgPoolOptions;
use sqlx::prelude::FromRow;
use sqlx::types::Uuid;
use tower::ServiceBuilder;

#[derive(Debug, Serialize, Deserialize, FromRow)]
struct Agent {
    key: Option<Uuid>,
    name: String,
    config: PgHstore,
}

// async fn handler(extract::Json(payload): extract::Json<Payload>) -> Json<Payload> {
//     let mut store = PgHstore::default();
//     store.insert("key".to_string(), Some("value".to_string()));

//     Json(Payload {
//         val: format!("Hi {}", payload.val),
//         data: Some(store),
//         id: Some(sqlx::types::Uuid::new_v4()),
//     })
// }

async fn get_agents(Extension(state): Extension<State>) -> Json<Vec<Agent>> {
    let vec = sqlx::query_as::<_, Agent>("SELECT * FROM public.agent")
        .fetch_all(&state.pool)
        .await;

    Json(vec.unwrap_or(Vec::new()))
}

const PUT_AGENTS_SQL: &str = "INSERT INTO Agent
(key, name, config) VALUES
($1, $2, $3)
ON CONFLICT (key) DO UPDATE SET name = excluded.name, config = excluded.config;";

async fn put_agents(
    Extension(state): Extension<State>,
    extract::Json(payload): extract::Json<Agent>,
) -> Json<Agent> {
    let mut payload = payload;

    if payload.key.is_none() {
        payload.key = Some(Uuid::new_v4());
    }

    _ = sqlx::query(PUT_AGENTS_SQL)
        .bind(&payload.key)
        .bind(&payload.name)
        .bind(&payload.config)
        .execute(&state.pool)
        .await;

    return Json(payload);
}

#[derive(Clone)]
struct State {
    pool: sqlx::Pool<sqlx::Postgres>,
}

#[tokio::main]
async fn main() -> Result<(), sqlx::Error> {
    let pool = PgPoolOptions::new()
        .max_connections(50)
        .connect("postgres://postgres:example@localhost/test")
        .await?;

    let app = Router::new()
        .route("/agents", get(get_agents))
        .route("/agents", put(put_agents));

    let app = app.layer(ServiceBuilder::new().layer(Extension(State { pool })));

    let listender = tokio::net::TcpListener::bind("0.0.0.0:3000").await.unwrap();

    axum::serve(listender, app).await.unwrap();

    Ok(())
}
