import os
import requests
import pandas as pd

dir = r"csv"

if not os.path.exists(dir):
    os.mkdir(dir)

# csv link

stations_url = "https://opendata.arcgis.com/datasets/726277c507ef4914b0aec3cbcfcbfafc_0.csv"
journey_may_url = "https://dev.hsl.fi/citybikes/od-trips-2021/2021-05.csv"
journey_june_url = "https://dev.hsl.fi/citybikes/od-trips-2021/2021-06.csv"
journey_july_url = "https://dev.hsl.fi/citybikes/od-trips-2021/2021-07.csv"


# download csv files

station_csv = requests.get(stations_url)
journey_may_csv = requests.get(journey_may_url)
journey_june_csv = requests.get(journey_june_url)
journey_july_csv = requests.get(journey_july_url)

# make sure the raw directory exists

if not os.path.exists(dir+"/raw"):
    os.mkdir(dir+"/raw")

# save csv files

with open(dir + "/raw/stations.csv", "wb") as file:
    file.write(station_csv.content)

with open(dir + "/raw/journey_may.csv", "wb") as file:
    file.write(journey_may_csv.content)

with open(dir + "/raw/journey_june.csv", "wb") as file:
    file.write(journey_june_csv.content)

with open(dir + "/raw/journey_july.csv", "wb") as file:
    file.write(journey_july_csv.content)


# import the journey csv file
journey_may = pd.read_csv(r"./csv/raw/journey_may.csv")
journey_june = pd.read_csv(r"./csv/raw/journey_june.csv")
journey_july = pd.read_csv(r"./csv/raw/journey_july.csv")

# add month column to the dataframe
journey_may['month'] = 'May'
journey_june['month'] = 'June'
journey_july['month'] = 'July'

# merge all journey into one df
journey_all = pd.concat([journey_may, journey_june, journey_july])

# import the stations csv file
stations = pd.read_csv(
    r".\csv\raw\stations.csv")

# getting rid of any journey that has a station that is not in the stations csv file

# get the ID column from all stations and journey
all_stations_id = stations.iloc[:, 1]
all_departure_stations_id = journey_all.iloc[:, 2]
all_return_stations_id = journey_all.iloc[:, 4]

# make a list of all
all_stations_id_list = all_stations_id.tolist()
all_departure_stations_id_list = all_departure_stations_id.tolist()
all_return_stations_id_list = all_return_stations_id.tolist()

departure_station_not_found = [
    i for i in all_departure_stations_id_list if i not in all_stations_id_list]
return_station_not_found = [
    i for i in all_return_stations_id_list if i not in all_stations_id_list]

merged_not_found = list(
    set(departure_station_not_found + return_station_not_found))

print("Before removing size", journey_all.shape[0]-1)
# remove the not found stations from the df location 2 and 4
journey_all = journey_all[~journey_all.iloc[:, 2].isin(merged_not_found)]
journey_all = journey_all[~journey_all.iloc[:, 4].isin(merged_not_found)]

print("After removing size", journey_all.shape[0]-1)

# remove rows from journey_all where the duration is less than 10 and covered_distance is less than 10
journey_all = journey_all[journey_all.iloc[:, 6] > 10]
journey_all = journey_all[journey_all.iloc[:, 7] > 10]

# stations df
# remove unnecessary columns
stations = stations.drop(
    columns=["FID", "Nimi", "Namn", "Adress", "Stad", "Kaupunki", "Operaattor"])
# rename the columns
stations.columns = ["id", "name", "address", "capacity", "lon", "lat"]
stations.head()

# journey df
# rename the columns
journey_all.columns = ["departure_time", "return_time", "departure_station_id", "departure_station",
                       "return_station_id", "return_station", "duration", "covered_distance", "month"]


# make sure the validated directory exists
if not os.path.exists(dir + "/validated"):
    os.mkdir(dir + "/validated")

# stations df
# save as csv file
stations.to_csv(r"./csv/validated/stations.csv", index=False)

# journey_all df
# save as csv file
journey_all.to_csv(r"./csv/validated/journey_all.csv", index=False)
