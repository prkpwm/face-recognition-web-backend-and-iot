**Command to run project:**
path: ./IoT/src run on jetson nx xavier
- sudo python3 fr_api.py
- sudo python3 fr_process_beta.py
- sudo python3 receive_model.py
- sudo python3 wait_process.py

**run production on server**
path: ./backend

**build**
- GOOS=linux GOARCH=arm64 go build

**run backend**
./faceapi

**run database**
mongod --dbpath /data/db --port 27018
path: ./server run on server
- sudo python3 train_api.py 

<!-- logpredict -->
**ฐานข้อมูลตัว log predict**

- _id --> ไอดีที่ generate โดย mongodb
- Id_log —> ไอดีที่สร้างขึ้นเองเนื่องจากจะเอาไว้ใช้ update mask
- Id_predicted —> ไอดีที่ชี้ว่าคนนี้คือใคร
- Timestamp —> บันทึกเวลาการเข้าสู่ระบบ
- Image_name —> ชื่อรูปภาพ
- Temp_person —> อุณหภูมิของคน
- pm25 —> pm2.5 ของเวลานั้นๆ
- weather —> สภาพอากาศ
- Mask —> ใส่ mask หรือเปล่า ถ้า ใส่: 1, ไม่ใส่:2, ถ้า mask ไม่ได้เปิดจะเป็น -1
- Device —> ชื่อเครื่อง
