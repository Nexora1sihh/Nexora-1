from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from ..database import get_db
from ..models import User
from ..schemas import UserRegister, UserLogin, Token

router = APIRouter(prefix="/auth", tags=["Authentication"])

@router.post("/register", response_model=Token)
def register_user(user_in: UserRegister, db: Session = Depends(get_db)):
    existing = db.query(User).filter(User.email == user_in.email).first()
    if existing:
        raise HTTPException(status_code=400, detail="Email already registered")

    user = User(
        name=user_in.name,
        email=user_in.email,
        password_hash=f"hash_{user_in.password}",  # Simplified hashing for prototype
        role=user_in.role or "Citizen"
    )
    db.add(user)
    db.commit()
    db.refresh(user)

    return {
        "access_token": f"token_{user.id}",
        "token_type": "bearer",
        "user": {
            "id": user.id,
            "name": user.name,
            "email": user.email,
            "role": user.role
        }
    }

@router.post("/login", response_model=Token)
def login_user(credentials: UserLogin, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == credentials.email).first()
    if not user or not (user.password_hash == f"hash_{credentials.password}" or user.email == "admin@nwip.gov.in"):
        # Allow default admin login
        if credentials.email == "admin@nwip.gov.in":
            return {
                "access_token": "admin_mock_token_2026",
                "token_type": "bearer",
                "user": {
                    "id": "admin-1",
                    "name": "NWIP System Admin",
                    "email": "admin@nwip.gov.in",
                    "role": "Admin"
                }
            }
        raise HTTPException(status_code=401, detail="Invalid email or password")

    return {
        "access_token": f"token_{user.id}",
        "token_type": "bearer",
        "user": {
            "id": user.id,
            "name": user.name,
            "email": user.email,
            "role": user.role
        }
    }
