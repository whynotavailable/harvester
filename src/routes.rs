use axum::Router;

pub mod agent;
pub mod source;

pub fn router() -> Router {
    agent::router()
}
