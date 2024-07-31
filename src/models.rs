#[derive(Clone)]
pub struct State {
    pub pool: sqlx::Pool<sqlx::Postgres>,
}

// Put the route models here
pub use crate::agent::Agent;
