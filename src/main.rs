use axum::{extract, routing::post, Json, Router};
use serde::{Deserialize, Serialize};

#[derive(Debug, Serialize, Deserialize)]
struct Payload {
    val: String,
}

async fn handler(extract::Json(payload): extract::Json<Payload>) -> Json<Payload> {
    Json(Payload {
        val: format!("Hi {}", payload.val),
    })
}

#[tokio::main]
async fn main() {
    let app = Router::new().route("/", post(handler));

    let listender = tokio::net::TcpListener::bind("0.0.0.0:3000").await.unwrap();

    axum::serve(listender, app).await.unwrap();
}
