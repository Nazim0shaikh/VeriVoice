from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routes import classify, embeddings, analytics

app = FastAPI(
    title="VeriVoice AI Backend",
    description="Tamper-proof AI-powered civic grievance system backend.",
    version="1.0.0"
)

# Apply CORS middleware
origins = [
    "http://localhost:3000",
    "https://verivoice.vercel.app", # Adjust if deployed
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Root endpoint
@app.get("/")
def read_root():
    return {"status": "ok", "message": "VeriVoice AI Engine Active"}

# Mount routers
app.include_router(classify.router, tags=["Classification"])
app.include_router(embeddings.router, prefix="/api/v1/embeddings", tags=["Embeddings"])
app.include_router(analytics.router, prefix="/api/v1/analytics", tags=["Analytics"])

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
