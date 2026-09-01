from starlette.middleware.base import BaseHTTPMiddleware
from fastapi.responses import JSONResponse

from redis_client import redis_client


class RateLimitMiddleware(BaseHTTPMiddleware):

    async def dispatch(self, request, call_next):

        # Skip rate limiting for endpoints that should never be blocked
        if (
            request.url.path == "/games"
            or request.url.path.startswith("/admin")
        ):
            return await call_next(request)

        ip = request.client.host
        key = f"rate_limit:{ip}"

        requests = redis_client.incr(key)

        if requests == 1:
            redis_client.expire(key, 60)

        if requests > 10:
            return JSONResponse(
                status_code=429,
                content={"detail": "Too many requests. Try again later."},
            )

        return await call_next(request)