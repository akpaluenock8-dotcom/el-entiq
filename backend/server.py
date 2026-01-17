from fastapi import FastAPI, APIRouter, HTTPException, Depends, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
from pathlib import Path
from pydantic import BaseModel, Field, EmailStr, ConfigDict
from typing import List, Optional
import uuid
from datetime import datetime, timezone, timedelta
import jwt
import bcrypt
import asyncio

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

# JWT Config
JWT_SECRET = os.environ.get('JWT_SECRET', 'el-antiq-hostel-secret-key-2024')
JWT_ALGORITHM = "HS256"
JWT_EXPIRATION_HOURS = 24

# Resend Config
RESEND_API_KEY = os.environ.get('RESEND_API_KEY', '')
SENDER_EMAIL = os.environ.get('SENDER_EMAIL', 'onboarding@resend.dev')
ADMIN_EMAIL = os.environ.get('ADMIN_EMAIL', 'elantiqgroup.gh@gmail.com')

# Create the main app
app = FastAPI(title="EL-ANTIQ Hostel API")

# Create router with /api prefix
api_router = APIRouter(prefix="/api")

# Security
security = HTTPBearer()

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

# ===================== MODELS =====================

class Room(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str
    room_type: str  # "1-in-1", "2-in-1", "4-in-1"
    price: float
    security_deposit: float = 300
    description: str
    amenities: List[str]
    images: List[str]
    availability_status: str = "available"  # "available", "almost_full", "fully_booked"
    total_slots: int = 1
    available_slots: int = 1
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class RoomCreate(BaseModel):
    name: str
    room_type: str
    price: float
    security_deposit: float = 300
    description: str
    amenities: List[str]
    images: List[str]
    availability_status: str = "available"
    total_slots: int = 1
    available_slots: int = 1

class RoomUpdate(BaseModel):
    name: Optional[str] = None
    room_type: Optional[str] = None
    price: Optional[float] = None
    security_deposit: Optional[float] = None
    description: Optional[str] = None
    amenities: Optional[List[str]] = None
    images: Optional[List[str]] = None
    availability_status: Optional[str] = None
    total_slots: Optional[int] = None
    available_slots: Optional[int] = None

class Booking(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    room_id: str
    room_name: str
    room_type: str
    full_name: str
    phone_number: str
    email: EmailStr
    school: str
    preferred_move_in_date: str
    status: str = "pending"  # "pending", "confirmed", "cancelled"
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class BookingCreate(BaseModel):
    room_id: str
    room_name: str
    room_type: str
    full_name: str
    phone_number: str
    email: EmailStr
    school: str
    preferred_move_in_date: str

class ContactMessage(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str
    email: EmailStr
    message: str
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class ContactMessageCreate(BaseModel):
    name: str
    email: EmailStr
    message: str

class AdminUser(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    email: EmailStr
    password_hash: str
    name: str
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class AdminLogin(BaseModel):
    email: EmailStr
    password: str

class AdminRegister(BaseModel):
    email: EmailStr
    password: str
    name: str

class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"

# ===================== AUTH HELPERS =====================

def hash_password(password: str) -> str:
    return bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')

def verify_password(password: str, hashed: str) -> bool:
    return bcrypt.checkpw(password.encode('utf-8'), hashed.encode('utf-8'))

def create_access_token(data: dict) -> str:
    to_encode = data.copy()
    expire = datetime.now(timezone.utc) + timedelta(hours=JWT_EXPIRATION_HOURS)
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, JWT_SECRET, algorithm=JWT_ALGORITHM)

async def get_current_admin(credentials: HTTPAuthorizationCredentials = Depends(security)):
    try:
        payload = jwt.decode(credentials.credentials, JWT_SECRET, algorithms=[JWT_ALGORITHM])
        admin_id = payload.get("sub")
        if admin_id is None:
            raise HTTPException(status_code=401, detail="Invalid token")
        admin = await db.admins.find_one({"id": admin_id}, {"_id": 0})
        if admin is None:
            raise HTTPException(status_code=401, detail="Admin not found")
        return admin
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Token expired")
    except jwt.InvalidTokenError:
        raise HTTPException(status_code=401, detail="Invalid token")

# ===================== EMAIL HELPER =====================

async def send_booking_notification(booking: dict, room: dict):
    if not RESEND_API_KEY:
        logger.warning("RESEND_API_KEY not configured, skipping email notification")
        return
    
    try:
        import resend
        resend.api_key = RESEND_API_KEY
        
        html_content = f"""
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
            <h1 style="color: #0F172A; border-bottom: 2px solid #D4AF37; padding-bottom: 10px;">
                New Booking Request - EL-ANTIQ Hostel
            </h1>
            <div style="background: #F8FAFC; padding: 20px; border-radius: 8px; margin: 20px 0;">
                <h2 style="color: #0F172A; margin-top: 0;">Student Information</h2>
                <p><strong>Name:</strong> {booking['full_name']}</p>
                <p><strong>Phone:</strong> {booking['phone_number']}</p>
                <p><strong>Email:</strong> {booking['email']}</p>
                <p><strong>School:</strong> {booking['school']}</p>
            </div>
            <div style="background: #F8FAFC; padding: 20px; border-radius: 8px; margin: 20px 0;">
                <h2 style="color: #0F172A; margin-top: 0;">Room Details</h2>
                <p><strong>Room:</strong> {booking['room_name']}</p>
                <p><strong>Type:</strong> {booking['room_type']}</p>
                <p><strong>Preferred Move-in Date:</strong> {booking['preferred_move_in_date']}</p>
            </div>
            <p style="color: #64748B; font-size: 14px;">
                Please contact the student to confirm their booking.
            </p>
        </div>
        """
        
        params = {
            "from": SENDER_EMAIL,
            "to": [ADMIN_EMAIL],
            "subject": f"New Booking Request from {booking['full_name']}",
            "html": html_content
        }
        
        email = await asyncio.to_thread(resend.Emails.send, params)
        logger.info(f"Booking notification email sent: {email.get('id')}")
    except Exception as e:
        logger.error(f"Failed to send booking notification: {str(e)}")

# ===================== ROUTES =====================

@api_router.get("/")
async def root():
    return {"message": "EL-ANTIQ Hostel API"}

# ----- ROOMS -----

@api_router.get("/rooms", response_model=List[Room])
async def get_rooms(room_type: Optional[str] = None, availability: Optional[str] = None):
    query = {}
    if room_type:
        query["room_type"] = room_type
    if availability:
        query["availability_status"] = availability
    
    rooms = await db.rooms.find(query, {"_id": 0}).to_list(100)
    for room in rooms:
        if isinstance(room.get('created_at'), str):
            room['created_at'] = datetime.fromisoformat(room['created_at'])
    return rooms

@api_router.get("/rooms/{room_id}", response_model=Room)
async def get_room(room_id: str):
    room = await db.rooms.find_one({"id": room_id}, {"_id": 0})
    if not room:
        raise HTTPException(status_code=404, detail="Room not found")
    if isinstance(room.get('created_at'), str):
        room['created_at'] = datetime.fromisoformat(room['created_at'])
    return room

@api_router.post("/rooms", response_model=Room)
async def create_room(room_data: RoomCreate, admin: dict = Depends(get_current_admin)):
    room = Room(**room_data.model_dump())
    doc = room.model_dump()
    doc['created_at'] = doc['created_at'].isoformat()
    await db.rooms.insert_one(doc)
    return room

@api_router.put("/rooms/{room_id}", response_model=Room)
async def update_room(room_id: str, room_data: RoomUpdate, admin: dict = Depends(get_current_admin)):
    existing = await db.rooms.find_one({"id": room_id}, {"_id": 0})
    if not existing:
        raise HTTPException(status_code=404, detail="Room not found")
    
    update_data = {k: v for k, v in room_data.model_dump().items() if v is not None}
    if update_data:
        await db.rooms.update_one({"id": room_id}, {"$set": update_data})
    
    updated = await db.rooms.find_one({"id": room_id}, {"_id": 0})
    if isinstance(updated.get('created_at'), str):
        updated['created_at'] = datetime.fromisoformat(updated['created_at'])
    return updated

@api_router.delete("/rooms/{room_id}")
async def delete_room(room_id: str, admin: dict = Depends(get_current_admin)):
    result = await db.rooms.delete_one({"id": room_id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Room not found")
    return {"message": "Room deleted successfully"}

# ----- BOOKINGS -----

@api_router.post("/bookings", response_model=Booking)
async def create_booking(booking_data: BookingCreate):
    room = await db.rooms.find_one({"id": booking_data.room_id}, {"_id": 0})
    if not room:
        raise HTTPException(status_code=404, detail="Room not found")
    
    if room.get('availability_status') == 'fully_booked':
        raise HTTPException(status_code=400, detail="Room is fully booked")
    
    booking = Booking(**booking_data.model_dump())
    doc = booking.model_dump()
    doc['created_at'] = doc['created_at'].isoformat()
    await db.bookings.insert_one(doc)
    
    # Send email notification
    asyncio.create_task(send_booking_notification(doc, room))
    
    return booking

@api_router.get("/bookings", response_model=List[Booking])
async def get_bookings(status: Optional[str] = None, admin: dict = Depends(get_current_admin)):
    query = {}
    if status:
        query["status"] = status
    
    bookings = await db.bookings.find(query, {"_id": 0}).sort("created_at", -1).to_list(500)
    for booking in bookings:
        if isinstance(booking.get('created_at'), str):
            booking['created_at'] = datetime.fromisoformat(booking['created_at'])
    return bookings

@api_router.put("/bookings/{booking_id}/status")
async def update_booking_status(booking_id: str, status: str, admin: dict = Depends(get_current_admin)):
    if status not in ["pending", "confirmed", "cancelled"]:
        raise HTTPException(status_code=400, detail="Invalid status")
    
    result = await db.bookings.update_one({"id": booking_id}, {"$set": {"status": status}})
    if result.modified_count == 0:
        raise HTTPException(status_code=404, detail="Booking not found")
    return {"message": f"Booking status updated to {status}"}

# ----- CONTACT -----

@api_router.post("/contact", response_model=ContactMessage)
async def create_contact_message(message_data: ContactMessageCreate):
    message = ContactMessage(**message_data.model_dump())
    doc = message.model_dump()
    doc['created_at'] = doc['created_at'].isoformat()
    await db.contact_messages.insert_one(doc)
    return message

@api_router.get("/contact", response_model=List[ContactMessage])
async def get_contact_messages(admin: dict = Depends(get_current_admin)):
    messages = await db.contact_messages.find({}, {"_id": 0}).sort("created_at", -1).to_list(500)
    for msg in messages:
        if isinstance(msg.get('created_at'), str):
            msg['created_at'] = datetime.fromisoformat(msg['created_at'])
    return messages

# ----- ADMIN AUTH -----

@api_router.post("/admin/register", response_model=TokenResponse)
async def admin_register(admin_data: AdminRegister):
    existing = await db.admins.find_one({"email": admin_data.email}, {"_id": 0})
    if existing:
        raise HTTPException(status_code=400, detail="Admin with this email already exists")
    
    admin = AdminUser(
        email=admin_data.email,
        password_hash=hash_password(admin_data.password),
        name=admin_data.name
    )
    doc = admin.model_dump()
    doc['created_at'] = doc['created_at'].isoformat()
    await db.admins.insert_one(doc)
    
    access_token = create_access_token({"sub": admin.id})
    return TokenResponse(access_token=access_token)

@api_router.post("/admin/login", response_model=TokenResponse)
async def admin_login(login_data: AdminLogin):
    admin = await db.admins.find_one({"email": login_data.email}, {"_id": 0})
    if not admin or not verify_password(login_data.password, admin['password_hash']):
        raise HTTPException(status_code=401, detail="Invalid email or password")
    
    access_token = create_access_token({"sub": admin['id']})
    return TokenResponse(access_token=access_token)

@api_router.get("/admin/me")
async def get_admin_profile(admin: dict = Depends(get_current_admin)):
    return {"id": admin['id'], "email": admin['email'], "name": admin['name']}

# ----- STATS -----

@api_router.get("/stats")
async def get_stats(admin: dict = Depends(get_current_admin)):
    total_rooms = await db.rooms.count_documents({})
    available_rooms = await db.rooms.count_documents({"availability_status": "available"})
    total_bookings = await db.bookings.count_documents({})
    pending_bookings = await db.bookings.count_documents({"status": "pending"})
    confirmed_bookings = await db.bookings.count_documents({"status": "confirmed"})
    total_messages = await db.contact_messages.count_documents({})
    
    return {
        "total_rooms": total_rooms,
        "available_rooms": available_rooms,
        "total_bookings": total_bookings,
        "pending_bookings": pending_bookings,
        "confirmed_bookings": confirmed_bookings,
        "total_messages": total_messages
    }

# ----- SEED DATA -----

@api_router.post("/seed")
async def seed_data():
    # Check if data already exists
    existing_rooms = await db.rooms.count_documents({})
    if existing_rooms > 0:
        return {"message": "Data already seeded"}
    
    # Real hostel images from user
    hostel_images = [
        "https://customer-assets.emergentagent.com/job_hostel-booking-4/artifacts/mohc5zyn_WhatsApp%20Image%202026-01-16%20at%208.10.18%20PM.jpeg",
        "https://customer-assets.emergentagent.com/job_hostel-booking-4/artifacts/d91sll3v_WhatsApp%20Image%202026-01-16%20at%208.10.19%20PM%20%281%29.jpeg",
        "https://customer-assets.emergentagent.com/job_hostel-booking-4/artifacts/kdxuhpmm_WhatsApp%20Image%202026-01-16%20at%208.10.19%20PM%20%282%29.jpeg",
        "https://customer-assets.emergentagent.com/job_hostel-booking-4/artifacts/3stoe6m8_WhatsApp%20Image%202026-01-16%20at%208.10.19%20PM%20%283%29.jpeg",
        "https://customer-assets.emergentagent.com/job_hostel-booking-4/artifacts/u8725mp2_WhatsApp%20Image%202026-01-16%20at%208.10.19%20PM.jpeg"
    ]
    
    rooms = [
        {
            "id": str(uuid.uuid4()),
            "name": "Premium Single Room A",
            "room_type": "1-in-1",
            "price": 4700,
            "security_deposit": 300,
            "description": "Spacious single occupancy room perfect for students who value privacy. Features include personal study area, wardrobe, and window with natural lighting. Enjoy the comfort of your own space in our secure, gated compound.",
            "amenities": ["Single Bed", "Personal Wardrobe", "Study Desk", "Window View", "Key Lock", "Shared Kitchen Access", "Shared Bathroom"],
            "images": [hostel_images[0], hostel_images[2], hostel_images[3]],
            "availability_status": "available",
            "total_slots": 1,
            "available_slots": 1,
            "created_at": datetime.now(timezone.utc).isoformat()
        },
        {
            "id": str(uuid.uuid4()),
            "name": "Premium Single Room B",
            "room_type": "1-in-1",
            "price": 4700,
            "security_deposit": 300,
            "description": "Another excellent single occupancy option with ample space for comfortable living. Well-ventilated room with modern finishes in a peaceful environment close to major universities.",
            "amenities": ["Single Bed", "Personal Wardrobe", "Study Desk", "Window View", "Key Lock", "Shared Kitchen Access", "Shared Bathroom"],
            "images": [hostel_images[2], hostel_images[0], hostel_images[4]],
            "availability_status": "almost_full",
            "total_slots": 1,
            "available_slots": 1,
            "created_at": datetime.now(timezone.utc).isoformat()
        },
        {
            "id": str(uuid.uuid4()),
            "name": "Shared Room A",
            "room_type": "2-in-1",
            "price": 4500,
            "security_deposit": 300,
            "description": "Comfortable double occupancy room ideal for students seeking affordable accommodation while still enjoying personal space. Share with a like-minded student in a friendly, academic-focused environment.",
            "amenities": ["Two Single Beds", "Shared Wardrobe", "Study Area", "Window View", "Key Lock", "Shared Kitchen Access", "Shared Bathroom"],
            "images": [hostel_images[2], hostel_images[1], hostel_images[0]],
            "availability_status": "available",
            "total_slots": 2,
            "available_slots": 2,
            "created_at": datetime.now(timezone.utc).isoformat()
        },
        {
            "id": str(uuid.uuid4()),
            "name": "Shared Room B",
            "room_type": "2-in-1",
            "price": 4500,
            "security_deposit": 300,
            "description": "Well-maintained shared room with excellent ventilation and natural lighting. Perfect for budget-conscious students who enjoy socializing while maintaining focus on their studies.",
            "amenities": ["Two Single Beds", "Shared Wardrobe", "Study Area", "Window View", "Key Lock", "Shared Kitchen Access", "Shared Bathroom"],
            "images": [hostel_images[0], hostel_images[3], hostel_images[1]],
            "availability_status": "available",
            "total_slots": 2,
            "available_slots": 1,
            "created_at": datetime.now(timezone.utc).isoformat()
        },
        {
            "id": str(uuid.uuid4()),
            "name": "Shared Room C",
            "room_type": "2-in-1",
            "price": 4500,
            "security_deposit": 300,
            "description": "Our most popular shared room option. Recently renovated with modern amenities. Located in a quiet corner of the hostel, perfect for serious students.",
            "amenities": ["Two Single Beds", "Shared Wardrobe", "Study Area", "Window View", "Key Lock", "Shared Kitchen Access", "Shared Bathroom"],
            "images": [hostel_images[4], hostel_images[2], hostel_images[0]],
            "availability_status": "fully_booked",
            "total_slots": 2,
            "available_slots": 0,
            "created_at": datetime.now(timezone.utc).isoformat()
        }
    ]
    
    await db.rooms.insert_many(rooms)
    
    # Create default admin
    admin_exists = await db.admins.count_documents({})
    if admin_exists == 0:
        admin = AdminUser(
            email="admin@elantiq.com",
            password_hash=hash_password("admin123"),
            name="Admin"
        )
        doc = admin.model_dump()
        doc['created_at'] = doc['created_at'].isoformat()
        await db.admins.insert_one(doc)
    
    return {"message": "Data seeded successfully", "rooms_created": len(rooms)}

# Include router
app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get('CORS_ORIGINS', '*').split(','),
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()
