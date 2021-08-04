import csv

header = ['version','url']
data = [
    ['1.0.0', "https://www2.census.gov/geo/tiger/GENZ2017/shp/cb_2017_01_bg_500k.zip"],
    ['1.0.1', "https://www2.census.gov/geo/tiger/GENZ2017/shp/cb_2017_02_sldu_500k.zip"],
    ['1.1.0', "https://www2.census.gov/geo/tiger/GENZ2017/shp/cb_2017_06_county_within_ua_500k.zip"],

]

with open('../../version.csv', 'w', encoding='UTF8', newline='') as f:
    writer = csv.writer(f)

    # write the header
    writer.writerow(header)

    # write multiple rows
    writer.writerows(data)