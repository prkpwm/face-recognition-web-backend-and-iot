from gtts import gTTS
import os


def speak(text):
    filename = text+'.mp3'
    audio_path = "./audio/"+filename
    if not os.path.isfile(audio_path):
        tts = gTTS(text=text, lang='th')
        tts.save(audio_path)
    print("Playing wav file...")
#    winsound.PlaySound(audio_path, winsound.SND_FILENAME)
    # sound = AudioSegment.from_file(audio_path)
    
    # play(sound)