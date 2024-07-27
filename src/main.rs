use axum::{response::Json, routing::get, Router};
use serde_json::{json, Value};

#[Debug]
struct Payload {}

async fn hello() -> Json<Value> {
    Json(json!({
        "Hello": "World!"
    }))
}

#[tokio::main]
async fn main() {
    let app = Router::new().route("/", get(hello));

    let listender = tokio::net::TcpListener::bind("0.0.0.0:3000").await.unwrap();

    axum::serve(listender, app).await.unwrap();
}
