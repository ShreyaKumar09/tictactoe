import logging
import time

from starlette.middleware.base import BaseHTTPMiddleware


logging.basicConfig(
    filename="app.log",
    level=logging.INFO,
    format="%(asctime)s | %(levelname)s | %(message)s",
)

logger = logging.getLogger("app")


class LoggingMiddleware(BaseHTTPMiddleware):

    async def dispatch(self, request, call_next):

        start_time = time.time()

        client_ip = request.client.host
        method = request.method
        path = request.url.path

        try:
            response = await call_next(request)

            process_time = (time.time() - start_time) * 1000

            logger.info(
                f"{client_ip} | {method} {path} | "
                f"{response.status_code} | "
                f"{process_time:.2f} ms"
            )

            return response

        except Exception:

            process_time = (time.time() - start_time) * 1000

            logger.exception(
                f"{client_ip} | {method} {path} | "
                f"500 | {process_time:.2f} ms"
            )

            raise