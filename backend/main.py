from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from typing import Dict
from recommendation_engine_v3 import CodeErrorRecommendationEngine
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# Request schema
class DebugRequest(BaseModel):
    code: str
    log: str

# Response schema
class DebugResponse(BaseModel):
    report: str
    corrected_code: str

@app.post("/debug", response_model=DebugResponse)
def debug_code(data: DebugRequest):
    try:
        engine = CodeErrorRecommendationEngine()
        result = engine.debugg(data.code, data.log)
        return DebugResponse(**result)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
