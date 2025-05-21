from fastapi import FastAPI
from slowapi import _rate_limit_exceeded_handler
from app.core.limiter import limiter
from slowapi.middleware import SlowAPIMiddleware
from fastapi.middleware.cors import CORSMiddleware
from .routes.routers import router
from .constants.origins import origins

app = FastAPI()

app.add_middleware(   
    CORSMiddleware,
    allow_origins=origins,            # Or ["*"] to allow all origins
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.add_middleware(SlowAPIMiddleware)
# rate limiting
app.state.limiter = limiter

app.add_exception_handler(429, _rate_limit_exceeded_handler)

app.include_router(router)


