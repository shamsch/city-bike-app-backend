# PROJECT IN PROGRESS

The README.md file will be ready shortly (before 14th August 2022).

## API DOCUMENTATION

The documentation for all endpoints, along with type of request, parameters, request body, request token, and return value descriptions, is available can be found down below.

### API Endpoints

- `GET /api/journey`: Returns a list of all journeys and total number of pages (which then helps paginationg on the client-side). In this format:

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
