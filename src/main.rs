use axum::{
    async_trait,
    extract::{FromRequest, Request},
    response::{IntoResponse, Response},
    routing::post,
    Json, RequestExt, Router,
};
use serde::{Deserialize, Serialize};

#[derive(Debug, Serialize, Deserialize)]
struct Payload {
    val: String,
}

async fn handler(JsonBody(payload): JsonBody<Payload>) -> Json<Payload> {
    return Json(Payload {
        val: format!("Hi {}", payload.val),
    });
}

struct JsonBody<T>(T);

// impl IntoResponse<S> for JsonBody<T> {}

#[async_trait]
impl<S, T> FromRequest<S> for JsonBody<T>
where
    S: Send + Sync,
    Json<T>: FromRequest<()>,
    T: 'static,
{
    type Rejection = Response;

    async fn from_request(req: Request, _state: &S) -> Result<Self, Self::Rejection> {
        let Json(payload) = req.extract().await.map_err(IntoResponse::into_response)?;
        return Ok(Self(payload));
    }
}

#[tokio::main]
async fn main() {
    let app = Router::new().route("/", post(handler));

    let listender = tokio::net::TcpListener::bind("0.0.0.0:3000").await.unwrap();

    axum::serve(listender, app).await.unwrap();
}
