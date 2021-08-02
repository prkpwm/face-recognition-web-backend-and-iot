import socket
 
HOST = 'localhost'  # IP ของ server
PORT = 5432         # port ที่จะใช้ในการติดต่อ
 
# จากข้อ 1 : สร้าง socket object
s = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
 
# จากข้อ 2 : กำหนดข้อมูลพื้นฐานให้กับ socket object
s.bind((HOST, PORT))
 
# จากข้อ 3 : สั่งให้รอการเชื่อมต่อจาก client
s.listen()
 
while True:
    # รอการเชื่อมต่อจาก client
    print("waiting for connection")
 
    # จากข้อ 5 : รับการเชื่อมต่อจาก client
    connection, client_address = s.accept()
    try:

        # จากข้อ 6 : รับข้อมูลจาก client
        while True:
            # กำหนดขนาดข้อมูลที่จะรับใน recv()
            data = connection.recv(1024)
            if data:
                connection.sendall(data)
            # ถ้าไม่มีข้อมูลให้จบการรอรับข้อมูล
            else:
                break
    
    # รับข้อมูลเสร็จแล้วทำการปิดการเชื่อมต่อ
    finally:
        connection.close()
        print("closed connection")