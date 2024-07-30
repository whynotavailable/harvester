use axum::Extension;

use harvester::{models, routes};
use sqlx::postgres::PgPoolOptions;

use tower::ServiceBuilder;

#[tokio::main]
async fn main() -> Result<(), sqlx::Error> {
    let pool = PgPoolOptions::new()
        .max_connections(50) // Local testing, this will need to be in a dotfile
        .connect("postgres://postgres:example@localhost/test")
        .await?;

    let app = routes::router();

    let app = app.layer(ServiceBuilder::new().layer(Extension(models::State { pool })));

    let listender = tokio::net::TcpListener::bind("0.0.0.0:3000").await.unwrap();

    axum::serve(listender, app).await.unwrap();

    Ok(())
}
