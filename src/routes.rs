use axum::Router;

// Maybe un-pub these
pub mod agent;
pub mod classification;
pub mod collection;
pub mod field;
pub mod store;

pub fn router() -> Router {
    agent::router()
        .merge(store::router())
        .merge(classification::router())
        .merge(field::router())
        .merge(collection::router())
}
