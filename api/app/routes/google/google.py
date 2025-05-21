from fastapi import APIRouter, Request, Query
from fastapi.responses import JSONResponse
from pydantic import BaseModel, EmailStr,ValidationError
from app.core.limiter import limiter
from ...utils.load_jsons import load_json

router=APIRouter()
class CampaignQuery(BaseModel):
    user_email: EmailStr

@router.get("/mock/google")
@limiter.limit("5/minute")
async def get_instantly_data(request: Request, user_email: EmailStr = Query(...)):
    try:
        _ = CampaignQuery(user_email=user_email)
        return JSONResponse(content=load_json("google_ads.json"))
    except ValidationError as e:
        # Extract all error messages
        errors = []
        for err in e.errors():
            loc = " -> ".join(str(l) for l in err['loc'])
            msg = err['msg']
            errors.append(f"{loc}: {msg}")

        # Return all validation errors in a single response
        return JSONResponse(
            status_code=422,
            content={
                "status": "error",
                "message": "Validation failed",
                "errors": errors
            }
        )