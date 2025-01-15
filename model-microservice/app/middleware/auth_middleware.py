from fastapi import Request
from fastapi.responses import JSONResponse
import httpx
import os
from dotenv import load_dotenv

load_dotenv()
AUTHENTICATION_API_URL = os.getenv("AUTHENTICATION_API_URL")

if not AUTHENTICATION_API_URL:
    raise RuntimeError("AUTHENTICATION_API_URL is not set in .env or environment variables")

async def auth_middleware(request: Request, call_next):
    """
    Middleware to validate the Authorization token.
    """
    token = request.headers.get("Authorization")
    if not token:
        return JSONResponse(
            status_code=401,
            content={"error": "Access denied. No token provided."}
        )

    # Extract the token from the "Bearer <token>" format
    token = token.split(" ")[1] if " " in token else token

    try:
        # Send the token to the Authentication microservice for validation
        async with httpx.AsyncClient() as client:
            response = await client.post(
                f"{AUTHENTICATION_API_URL}/validate-token", json={"token": token}
            )

        if response.status_code != 200:
            return JSONResponse(
                status_code=401,
                content={"error": "Invalid token or unauthorized access."}
            )

        # Attach user info to the request state (if needed)
        request.state.user = response.json().get("user")

    except httpx.RequestError:
        return JSONResponse(
            status_code=503,
            content={"error": "Authentication service unavailable."}
        )

    # Proceed to the next middleware/route handler
    return await call_next(request)
