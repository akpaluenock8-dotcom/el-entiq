#!/usr/bin/env python3

import requests
import sys
import json
from datetime import datetime

class HostelAPITester:
    def __init__(self, base_url="https://hostel-booking-4.preview.emergentagent.com"):
        self.base_url = base_url
        self.api_url = f"{base_url}/api"
        self.admin_token = None
        self.tests_run = 0
        self.tests_passed = 0
        self.test_results = []

    def log_test(self, name, success, details=""):
        """Log test result"""
        self.tests_run += 1
        if success:
            self.tests_passed += 1
        
        result = {
            "test": name,
            "success": success,
            "details": details,
            "timestamp": datetime.now().isoformat()
        }
        self.test_results.append(result)
        
        status = "✅ PASS" if success else "❌ FAIL"
        print(f"{status} - {name}")
        if details:
            print(f"    Details: {details}")

    def test_api_health(self):
        """Test basic API connectivity"""
        try:
            response = requests.get(f"{self.api_url}/", timeout=10)
            success = response.status_code == 200
            details = f"Status: {response.status_code}, Response: {response.json() if success else response.text}"
            self.log_test("API Health Check", success, details)
            return success
        except Exception as e:
            self.log_test("API Health Check", False, f"Error: {str(e)}")
            return False

    def test_seed_data(self):
        """Test data seeding"""
        try:
            response = requests.post(f"{self.api_url}/seed", timeout=15)
            success = response.status_code == 200
            details = f"Status: {response.status_code}, Response: {response.json() if success else response.text}"
            self.log_test("Seed Data", success, details)
            return success
        except Exception as e:
            self.log_test("Seed Data", False, f"Error: {str(e)}")
            return False

    def test_get_rooms(self):
        """Test getting all rooms"""
        try:
            response = requests.get(f"{self.api_url}/rooms", timeout=10)
            success = response.status_code == 200
            if success:
                rooms = response.json()
                details = f"Found {len(rooms)} rooms"
                # Check if we have the expected 5 rooms
                if len(rooms) == 5:
                    details += " (Expected 5 rooms found)"
                else:
                    details += f" (Expected 5, got {len(rooms)})"
            else:
                details = f"Status: {response.status_code}, Error: {response.text}"
            
            self.log_test("Get All Rooms", success, details)
            return success, rooms if success else []
        except Exception as e:
            self.log_test("Get All Rooms", False, f"Error: {str(e)}")
            return False, []

    def test_room_filters(self):
        """Test room filtering"""
        try:
            # Test filter by room type
            response = requests.get(f"{self.api_url}/rooms?room_type=1-in-1", timeout=10)
            success1 = response.status_code == 200
            single_rooms = response.json() if success1 else []
            
            response = requests.get(f"{self.api_url}/rooms?room_type=2-in-1", timeout=10)
            success2 = response.status_code == 200
            shared_rooms = response.json() if success2 else []
            
            # Test filter by availability
            response = requests.get(f"{self.api_url}/rooms?availability=available", timeout=10)
            success3 = response.status_code == 200
            available_rooms = response.json() if success3 else []
            
            success = success1 and success2 and success3
            details = f"1-in-1: {len(single_rooms)}, 2-in-1: {len(shared_rooms)}, Available: {len(available_rooms)}"
            
            self.log_test("Room Filtering", success, details)
            return success
        except Exception as e:
            self.log_test("Room Filtering", False, f"Error: {str(e)}")
            return False

    def test_get_room_details(self, room_id):
        """Test getting specific room details"""
        try:
            response = requests.get(f"{self.api_url}/rooms/{room_id}", timeout=10)
            success = response.status_code == 200
            if success:
                room = response.json()
                details = f"Room: {room.get('name', 'Unknown')}, Type: {room.get('room_type', 'Unknown')}"
            else:
                details = f"Status: {response.status_code}, Error: {response.text}"
            
            self.log_test("Get Room Details", success, details)
            return success, room if success else None
        except Exception as e:
            self.log_test("Get Room Details", False, f"Error: {str(e)}")
            return False, None

    def test_admin_login(self):
        """Test admin login"""
        try:
            login_data = {
                "email": "admin@elantiq.com",
                "password": "admin123"
            }
            response = requests.post(f"{self.api_url}/admin/login", json=login_data, timeout=10)
            success = response.status_code == 200
            
            if success:
                token_data = response.json()
                self.admin_token = token_data.get('access_token')
                details = f"Login successful, token received: {bool(self.admin_token)}"
            else:
                details = f"Status: {response.status_code}, Error: {response.text}"
            
            self.log_test("Admin Login", success, details)
            return success
        except Exception as e:
            self.log_test("Admin Login", False, f"Error: {str(e)}")
            return False

    def test_admin_profile(self):
        """Test getting admin profile"""
        if not self.admin_token:
            self.log_test("Admin Profile", False, "No admin token available")
            return False
        
        try:
            headers = {"Authorization": f"Bearer {self.admin_token}"}
            response = requests.get(f"{self.api_url}/admin/me", headers=headers, timeout=10)
            success = response.status_code == 200
            
            if success:
                profile = response.json()
                details = f"Admin: {profile.get('email', 'Unknown')}, Name: {profile.get('name', 'Unknown')}"
            else:
                details = f"Status: {response.status_code}, Error: {response.text}"
            
            self.log_test("Admin Profile", success, details)
            return success
        except Exception as e:
            self.log_test("Admin Profile", False, f"Error: {str(e)}")
            return False

    def test_get_stats(self):
        """Test getting dashboard stats"""
        if not self.admin_token:
            self.log_test("Dashboard Stats", False, "No admin token available")
            return False
        
        try:
            headers = {"Authorization": f"Bearer {self.admin_token}"}
            response = requests.get(f"{self.api_url}/stats", headers=headers, timeout=10)
            success = response.status_code == 200
            
            if success:
                stats = response.json()
                details = f"Rooms: {stats.get('total_rooms', 0)}, Bookings: {stats.get('total_bookings', 0)}, Messages: {stats.get('total_messages', 0)}"
            else:
                details = f"Status: {response.status_code}, Error: {response.text}"
            
            self.log_test("Dashboard Stats", success, details)
            return success, stats if success else {}
        except Exception as e:
            self.log_test("Dashboard Stats", False, f"Error: {str(e)}")
            return False, {}

    def test_create_booking(self, room_id, room_name, room_type):
        """Test creating a booking"""
        try:
            booking_data = {
                "room_id": room_id,
                "room_name": room_name,
                "room_type": room_type,
                "full_name": "Test Student",
                "phone_number": "0551234567",
                "email": "test@student.com",
                "school": "University of Ghana",
                "preferred_move_in_date": "2024-02-01"
            }
            
            response = requests.post(f"{self.api_url}/bookings", json=booking_data, timeout=10)
            success = response.status_code == 200
            
            if success:
                booking = response.json()
                details = f"Booking created: {booking.get('id', 'Unknown ID')}"
                return success, booking.get('id')
            else:
                details = f"Status: {response.status_code}, Error: {response.text}"
                self.log_test("Create Booking", success, details)
                return False, None
            
            self.log_test("Create Booking", success, details)
            return success, booking.get('id') if success else None
        except Exception as e:
            self.log_test("Create Booking", False, f"Error: {str(e)}")
            return False, None

    def test_get_bookings(self):
        """Test getting bookings (admin only)"""
        if not self.admin_token:
            self.log_test("Get Bookings", False, "No admin token available")
            return False, []
        
        try:
            headers = {"Authorization": f"Bearer {self.admin_token}"}
            response = requests.get(f"{self.api_url}/bookings", headers=headers, timeout=10)
            success = response.status_code == 200
            
            if success:
                bookings = response.json()
                details = f"Found {len(bookings)} bookings"
            else:
                details = f"Status: {response.status_code}, Error: {response.text}"
                bookings = []
            
            self.log_test("Get Bookings", success, details)
            return success, bookings
        except Exception as e:
            self.log_test("Get Bookings", False, f"Error: {str(e)}")
            return False, []

    def test_update_booking_status(self, booking_id):
        """Test updating booking status"""
        if not self.admin_token or not booking_id:
            self.log_test("Update Booking Status", False, "No admin token or booking ID available")
            return False
        
        try:
            headers = {"Authorization": f"Bearer {self.admin_token}"}
            response = requests.put(
                f"{self.api_url}/bookings/{booking_id}/status?status=confirmed", 
                headers=headers, 
                timeout=10
            )
            success = response.status_code == 200
            
            if success:
                details = "Booking status updated to confirmed"
            else:
                details = f"Status: {response.status_code}, Error: {response.text}"
            
            self.log_test("Update Booking Status", success, details)
            return success
        except Exception as e:
            self.log_test("Update Booking Status", False, f"Error: {str(e)}")
            return False

    def test_contact_message(self):
        """Test sending contact message"""
        try:
            message_data = {
                "name": "Test User",
                "email": "test@example.com",
                "message": "This is a test message from the automated test suite."
            }
            
            response = requests.post(f"{self.api_url}/contact", json=message_data, timeout=10)
            success = response.status_code == 200
            
            if success:
                message = response.json()
                details = f"Message sent: {message.get('id', 'Unknown ID')}"
            else:
                details = f"Status: {response.status_code}, Error: {response.text}"
            
            self.log_test("Send Contact Message", success, details)
            return success
        except Exception as e:
            self.log_test("Send Contact Message", False, f"Error: {str(e)}")
            return False

    def test_get_contact_messages(self):
        """Test getting contact messages (admin only)"""
        if not self.admin_token:
            self.log_test("Get Contact Messages", False, "No admin token available")
            return False
        
        try:
            headers = {"Authorization": f"Bearer {self.admin_token}"}
            response = requests.get(f"{self.api_url}/contact", headers=headers, timeout=10)
            success = response.status_code == 200
            
            if success:
                messages = response.json()
                details = f"Found {len(messages)} messages"
            else:
                details = f"Status: {response.status_code}, Error: {response.text}"
            
            self.log_test("Get Contact Messages", success, details)
            return success
        except Exception as e:
            self.log_test("Get Contact Messages", False, f"Error: {str(e)}")
            return False

    def test_update_room_availability(self, room_id):
        """Test updating room availability"""
        if not self.admin_token or not room_id:
            self.log_test("Update Room Availability", False, "No admin token or room ID available")
            return False
        
        try:
            headers = {"Authorization": f"Bearer {self.admin_token}"}
            update_data = {"availability_status": "almost_full"}
            
            response = requests.put(
                f"{self.api_url}/rooms/{room_id}", 
                json=update_data,
                headers=headers, 
                timeout=10
            )
            success = response.status_code == 200
            
            if success:
                details = "Room availability updated to almost_full"
            else:
                details = f"Status: {response.status_code}, Error: {response.text}"
            
            self.log_test("Update Room Availability", success, details)
            return success
        except Exception as e:
            self.log_test("Update Room Availability", False, f"Error: {str(e)}")
            return False

    def run_all_tests(self):
        """Run comprehensive API tests"""
        print("🚀 Starting EL-ANTIQ Hostel API Tests")
        print("=" * 50)
        
        # Basic connectivity
        if not self.test_api_health():
            print("❌ API is not accessible. Stopping tests.")
            return False
        
        # Seed data
        self.test_seed_data()
        
        # Room tests
        rooms_success, rooms = self.test_get_rooms()
        if rooms_success and rooms:
            # Test room filtering
            self.test_room_filters()
            
            # Test room details with first room
            first_room = rooms[0]
            room_success, room_details = self.test_get_room_details(first_room['id'])
            
            # Admin authentication
            if self.test_admin_login():
                # Admin-only tests
                self.test_admin_profile()
                self.test_get_stats()
                
                # Booking tests
                if room_details:
                    booking_success, booking_id = self.test_create_booking(
                        first_room['id'], 
                        first_room['name'], 
                        first_room['room_type']
                    )
                    
                    if booking_success and booking_id:
                        self.test_get_bookings()
                        self.test_update_booking_status(booking_id)
                
                # Room management tests
                self.test_update_room_availability(first_room['id'])
                
                # Contact message tests
                self.test_contact_message()
                self.test_get_contact_messages()
        
        # Print summary
        print("\n" + "=" * 50)
        print(f"📊 Test Summary: {self.tests_passed}/{self.tests_run} tests passed")
        success_rate = (self.tests_passed / self.tests_run * 100) if self.tests_run > 0 else 0
        print(f"📈 Success Rate: {success_rate:.1f}%")
        
        return self.tests_passed == self.tests_run

def main():
    tester = HostelAPITester()
    success = tester.run_all_tests()
    
    # Save detailed results
    with open('/app/backend_test_results.json', 'w') as f:
        json.dump({
            'summary': {
                'total_tests': tester.tests_run,
                'passed_tests': tester.tests_passed,
                'success_rate': (tester.tests_passed / tester.tests_run * 100) if tester.tests_run > 0 else 0,
                'timestamp': datetime.now().isoformat()
            },
            'test_results': tester.test_results
        }, f, indent=2)
    
    return 0 if success else 1

if __name__ == "__main__":
    sys.exit(main())