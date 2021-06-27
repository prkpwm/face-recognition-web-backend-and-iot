import time,board,busio
import numpy as np
import adafruit_mlx90640
import time

i2c = busio.I2C(board.SCL, board.SDA, frequency=400000) # setup I2C
mlx = adafruit_mlx90640.MLX90640(i2c) # begin MLX90640 with I2C comm
mlx.refresh_rate = adafruit_mlx90640.RefreshRate.REFRESH_2_HZ # set refresh rate
frame = np.zeros((24*32,)) # setup array for storing all 768 temperatures
start = time.time()
while True:
    try:
        mlx.getFrame(frame) # read MLX temperatures into frame var
        break
    except ValueError:
        continue # if error, just read again

f_array = np.array(frame)
f_array = np.divide(f_array,30)

summary_value = 0   
counter = 0
for i,f in enumerate(f_array):
    if f >= 1:
        counter = np.add(counter,1)
        summary_value = np.add(summary_value,frame[i])

print(np.divide(summary_value,counter))

print('time',np.subtract(time.time(),start))
