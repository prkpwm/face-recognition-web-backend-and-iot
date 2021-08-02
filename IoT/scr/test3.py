import requests 
url = 'https://www2.census.gov/geo/tiger/GENZ2017/shp/cb_2017_02_tract_500k.zip'
target_path = 'alaska.zip'

response = requests.get(url, stream=True)
handle = open(target_path, "wb")
for chunk in response.iter_content(chunk_size=512):
    if chunk:  # filter out keep-alive new chunks
        handle.write(chunk)
handle.close()