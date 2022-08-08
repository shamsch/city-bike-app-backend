# PROJECT IN PROGRESS

The README.md file will be ready shortly (before 14th August 2022).

## API DOCUMENTATION

The documentation for all endpoints, along with type of request, parameters, request body, request token, and return value descriptions, is available can be found down below.

### API Endpoints:

#### Endpoint: /api/journey/

- `GET /api/journey`: Returns a list of all journeys and total number of pages (which then helps pagination on the client-side). In this format:

  ```json
  {
  	"journeys": [
  		{
  			"departure_time": "2021-05-31T23:57:25.000Z",
  			"return_time": "2021-06-01T00:05:46.000Z",
  			"departure_station": "Laajalahden aukio",
  			"departure_station_id": 94,
  			"return_station": "Teljäntie",
  			"return_station_id": 100,
  			"duration": 34.05,
  			"covered_distance": 0.5,
  			"month": "May",
  			"id": 1
  		},
  		{
  			"departure_time": "2021-05-31T23:56:59.000Z",
  			"return_time": "2021-06-01T00:07:14.000Z",
  			"departure_station": "Töölöntulli",
  			"departure_station_id": 82,
  			"return_station": "Pasilan asema",
  			"return_station_id": 113,
  			"duration": 31.166666666666668,
  			"covered_distance": 0.611,
  			"month": "May",
  			"id": 2
  		} //more journeys
  	],
  	"total_pages": 312398
  }
  ```

  - `?limit=5`: Limits the number of journeys to be returned to the specified value, in this case `5`. Default value is `10`. **Must be a non-negative integer**.

  - `?page=2`: Specifies the page of journeys to be returned. Default value is `1`. In this example, the second page of journeys is returned. **Must be a non-negative integer**.

  - `?orderDir=DESC`: Specifies the order direction of the journeys based on `orderBy` value, which refers to colmns of journey. If `orderBy` is not provided, then it orders based on `id` of journeys. Default value is `ASC`. Must be either `ASC` or `DESC` referring to ascending or descending order. **Case sensitive**

  - `?orderBy=return_time`: Specifies the column to order the journeys by. Default value is `id`. Acceptable values are `id`, `departure_time`, `return_time`, `departure_station`, `departure_station_id`, `return_station`, `return_station_id`, `duration`, `covered_distance`, `month`. If `orderBy` is not provided, then it orders based on `id` of journeys. If wrong value is provided, then it orders based on `id` of journeys. **Case sensitive**.

  - `?search=July`: Searches jourey based on the valued provided against `month`, `departure_station`, and `return_station` columns. Default value is an empty string. Must be a string. **Case insesitive**.

  - `?durationMax=25.3`: Returns journeys with duration in minutes less than or equal to the specified value. By default, it is set to `0` which results in not applying the query. **Must be a non-negative number**.

  - `?durationMin=10`: Returns journeys with duration in minutes greater than or equal to the specified value. By default, it is set to `0` which results in not applying the query. **Must be a non-negative number**.

  - `?distanceMax=0.5`: Returns journeys with covered distance in kilometers less than or equal to the specified value. By default, it is set to `0` which results in not applying the query. **Must be a non-negative number**.

  - `?distanceMin=0.1`: Returns journeys with covered distance in kilometers greater than or equal to the specified value. By default, it is set to `0` which results in not applying the query. **Must be a non-negative number**.

- `POST /api/journey/`: Creates a new journey. The **request body** has to be in this format:

  ```json
  {
  	"departure_time": "2021-05-31T23:57:25.000Z", // Date ISO format
  	"return_time": "2021-06-01T00:05:46.000Z",
  	"departure_station_id": 94, // has to be a valid station ID that exists in stations table
  	"return_station_id": 100,
  	"covered_distance": 0.5, // covered distance in kilometers. Must be a non-negative number.
  	"month": "May" // month in full English name (e.g. "February")
  }
  ```

  A sucessful response:

  ```json
  {
  	"departure_time": "2021-05-31T23:57:25.000Z",
  	"return_time": "2021-06-01T00:05:46.000Z",
  	"departure_station": "Laajalahden aukio",
  	"departure_station_id": 94,
  	"return_station": "Teljäntie",
  	"return_station_id": 100,
  	"duration": 34.05,
  	"covered_distance": 0.5,
  	"month": "May",
  	"id": 1
  }
  ```

- `GET /api/journey/maximum`: Returns the maximum value of `covered_distance` and `duration` columns.
  Example return format:

```json
{
	"maxDuration": 34.05, // in minutes
	"maxDistance": 0.5 // in kilometers
}
```

### Endpoint: /api/station/

- `GET /api/station`: Returns a list of all stations and total number of pages (which then helps pagination on the client-side). In this format:

  ```json
  {
  	"stations": [
  		{
  			"id": 1,
  			"name": "Kaivopuisto",
  			"address": "Meritori 1",
  			"capacity": 30,
  			"lon": 24.9502114714031,
  			"lat": 60.155369615074
  		},
  		{
  			"id": 2,
  			"name": "Laivasillankatu",
  			"address": "Laivasillankatu 14",
  			"capacity": 12,
  			"lon": 24.9565097715858,
  			"lat": 60.1609890692806
  		} //more stations
  	],
  	"total_pages": 46
  }
  ```

  - `?limit=5`: Limits the number of stations to be returned to the specified value, in this case `5`. Default value is `10`. **Must be a non-negative integer**.
  - `?page=2`: Specifies the page of stations to be returned. Default value is `1`. In this example, the second page of stations is returned. **Must be a non-negative integer**.
  - `?search=Laivasillankatu`: Searches station based on the valued provided against `name` columns of the stations. Default value is an empty string. Must be a string. **Case insesitive**.

- `GET /api/station/stationOptions`: Returns a list of all stations with their name and id in the format:

  ```json
  {
  	"stations": [
  		{
  			"id": 1,
  			"name": "Kaivopuisto"
  		},
  		{
  			"id": 2,
  			"name": "Laivasillankatu"
  		} //more stations
  	]
  }
  ```

- `POST /api/station/`: Creates a new station. The **request body** has to be in this format:

  ```json
  {
  	"name": "Laivasillankatu", // must be at least 1 character long
  	"address": "Laivasillankatu 14", // must be at least 1 character long
  	"capacity": 12, // must be a non-negative integer
  	"lon": 24.9565097715858, // can be any floating point number
  	"lat": 60.1609890692806 // can be any floating point number
  }
  ```

  A sucessful response:

  ```json
  {
  	"id": 3,
  	"name": "Laivasillankatu",
  	"address": "Laivasillankatu 14",
  	"capacity": 12,
  	"lon": 24.9565097715858,
  	"lat": 60.1609890692806
  }
  ```

### Endpoint: /api/station/{id}/

- `GET /api/station/{id}`: Returns a station with the specified id. In this format:

  ```json
  {
  	"id": 3,
  	"name": "Kapteeninpuistikko",
  	"address": "Tehtaankatu 13",
  	"lat": 60.1581769029949,
  	"lon": 24.9450181631667,
  	"departure_journey": 12078,
  	"return_journey": 11876,
  	"average_departure_distance": 1.3624927968206657,
  	"average_return_distance": 1.3971852475581004,
  	"top_departure_station": [
  		"Itämerentori",
  		"Hernesaarenranta",
  		"Hietalahdentori",
  		"Kamppi (M)",
  		"Kanavaranta"
  	],
  	"top_return_station": [
  		"Hernesaarenranta",
  		"Kamppi (M)",
  		"Itämerentori",
  		"Kanavaranta",
  		"Hietalahdentori"
  	],
  	"static_map_url": "https://static-maps.yandex.ru/1.x/?lang=en-US&ll=24.9450181631667,60.1581769029949&z=12&l=map&size=600,300&pt=24.9450181631667,60.1581769029949,flag"
  }
  ```

  - `?month=May`: Returns all the calculation results for the specified month. Default value is an empty string, so for all months of all years. Must be either `January`, `February`, `March`, `April`, `May`, `June`, `July`, `August`, `September`, `October`, `November`, or `December`. Month name must start with an uppercase letter and followed by lowercase letters. **Must be full English month name.**
    HUOM! Here month referes to month of any year, so `May` is for May of 2020 and May of 2021 or any May month of any year for that matter.
