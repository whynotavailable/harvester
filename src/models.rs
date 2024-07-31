#[derive(Clone)]
pub struct State {
    pub pool: sqlx::Pool<sqlx::Postgres>,
}
