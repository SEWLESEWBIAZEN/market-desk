from fastapi import APIRouter
from app.routes.meta import meta
from app.routes.google import google
from app.routes.instantly import instantly  # adjust the import path if needed

router = APIRouter()

router.include_router(instantly.router)
router.include_router(google.router)
router.include_router(meta.router)
