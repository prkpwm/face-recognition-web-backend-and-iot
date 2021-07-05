import cv2
import numpy as np
from PIL import Image, ImageFont, ImageDraw

if __name__ == "__main__":
	cap = cv2.VideoCapture("http://192.168.0.252:3050/video_feed")
	while(True):
		ret, frame = cap.read()
		cv2.imshow('frame',frame)
		# pil_im = Image.fromarray(frame)
		# draw = ImageDraw.Draw(frame)
		# font = ImageFont.truetype(os.path.join(os.getcwd(),'font','Anuphan-Bold.ttf'),80)
		# draw.text((10,700),text_to_show,font=font)
		# cv_im_process = cv2.cvtColor(np.array(pil_im),cv2.COLOR_RGB2BGR)

		# cv2.imshow('frame',cv2_im_precess)
		if cv2.waitKey(1) & 0xFF == ord('q'):
			break

	cap.release()
	cv2.destroyAllWindows()
