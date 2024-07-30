use axum::Router;

pub mod agent;

pub fn router() -> Router {
    agent::router()
}
