var users_columns =  [
  {
    "source_column_name": "user_id",
    "source_data_type": "integer",
    "target_column_name": "user_id",
    "target_data_type": "integer",
    "is_key": "Y",
    "is_calculated": "N",
    "calculated_by": "",
    "description": "user id"
  },
  {
    "source_column_name": "user_type",
    "source_data_type": "string",
    "target_column_name": "user_type",
    "target_data_type": "string",
    "is_key": "N",
    "is_calculated": "N",
    "calculated_by": "",
    "description": "User Type (Customer = 24-hour pass or 7-day pass user, Subscriber = Annual Member)"
  },
  {
    "source_column_name": "gender",
    "source_data_type": "string",
    "target_column_name": "gender",
    "target_data_type": "string",
    "is_key": "N",
    "is_calculated": "N",
    "calculated_by": "",
    "description": "Gender (unknown, male, female)"
  },
  {
    "source_column_name": "birth_year",
    "source_data_type": "integer",
    "target_column_name": "birth_year",
    "target_data_type": "integer",
    "is_key": "N",
    "is_calculated": "N",
    "calculated_by": "",
    "description": "Year of Birth"
  },
  {
    "source_column_name": "customer_plan",
    "source_data_type": "string",
    "target_column_name": "customer_plan",
    "target_data_type": "string",
    "is_key": "N",
    "is_calculated": "N",
    "calculated_by": "",
    "description": "The name of the plan that determines the rate charged for the trip"
  },
]

var users_columns_descriptions  = {}
users_columns.forEach(el => { users_columns_descriptions[el.target_column_name+""] = el.description});

var bikes_columns = [
  {
    "source_column_name": "bike_id",
    "source_data_type": "integer",
    "target_column_name": "bike_id",
    "target_data_type": "integer",
    "is_key": "Y",
    "is_calculated": "N",
    "calculated_by": "",
    "description": "Bike ID"
  },
  {
    "source_column_name": "bike_type",
    "source_data_type": "string",
    "target_column_name": "bike_type",
    "target_data_type": "string",
    "is_key": "N",
    "is_calculated": "N",
    "calculated_by": "",
    "description": "Bike Type"
  }
]

var bikes_columns_descriptions  = {}
bikes_columns.forEach(el => { bikes_columns_descriptions[el.target_column_name+""] = el.description});

var trips_columns= [
  {
    "source_column_name": "bike_id",
    "source_data_type": "integer",
    "target_column_name": "bike_id",
    "target_data_type": "integer",
    "is_key": "Y",
    "is_calculated": "N",
    "calculated_by": "",
    "description": "Bike ID"
  },
  {
    "source_column_name": "user_id",
    "source_data_type": "integer",
    "target_column_name": "user_id",
    "target_data_type": "integer",
    "is_key": "Y",
    "is_calculated": "N",
    "calculated_by": "",
    "description": "User ID"
  },
   {
    "source_column_name": "start_station_id",
    "source_data_type": "integer",
    "target_column_name": "start_station_id",
    "target_data_type": "integer",
    "is_key": "Y",
    "is_calculated": "N",
    "calculated_by": "",
    "description": "Start Station ID"
  },
  {
    "source_column_name": "end_station_id",
    "source_data_type": "integer",
    "target_column_name": "end_station_id",
    "target_data_type": "integer",
    "is_key": "Y",
    "is_calculated": "N",
    "calculated_by": "",
    "description": "End Station ID"
  },
   {
    "source_column_name": "start_time",
    "source_data_type": "datetime",
    "target_column_name": "start_time",
    "target_data_type": "datetime",
    "is_key": "N",
    "is_calculated": "N",
    "calculated_by": "",
    "description": "Start Time, in NYC local time."
  },
  {
    "source_column_name": "stop_time",
    "source_data_type": "datetime",
    "target_column_name": "stop_time",
    "target_data_type": "datetime",
    "is_key": "N",
    "is_calculated": "N",
    "calculated_by": "",
    "description": "Stop Time, in NYC local time."
  },
   {
    "source_column_name": "trip_duration",
    "source_data_type": "integer",
    "target_column_name": "trip_duration",
    "target_data_type": "integer",
    "is_key": "N",
    "is_calculated": "N",
    "calculated_by": "",
    "description": "Trip Duration (in seconds)"
  }
]

var trips_columns_descriptions  = {}
trips_columns.forEach(el => { trips_columns_descriptions[el.target_column_name+""] = el.description});

var stations_columns =  [
 {
    "source_column_name": "station_id",
    "source_data_type": "integer",
    "target_column_name": "station_id",
    "target_data_type": "integer",
    "is_key": "Y",
    "is_calculated": "N",
    "calculated_by": "",
    "description": "Unique identifier of a station."
  },
  {
    "source_column_name": "name",
    "source_data_type": "string",
    "target_column_name": "name",
    "target_data_type": "string",
    "is_key": "N",
    "is_calculated": "N",
    "calculated_by": "",
    "description": "Public name of the station."
  },
  {
    "source_column_name": "short_name",
    "source_data_type": "string",
    "target_column_name": "short_name",
    "target_data_type": "string",
    "is_key": "N",
    "is_calculated": "N",
    "calculated_by": "",
    "description": "Short name or other type of identifier, as used by the data publisher."
  },
  {
    "source_column_name": "latitude",
    "source_data_type": "float",
    "target_column_name": "latitude",
    "target_data_type": "float",
    "is_key": "N",
    "is_calculated": "N",
    "calculated_by": "",
    "description": "The latitude of station. The field value must be a valid WGS 84 latitude in decimal degrees format."
  },
  {
    "source_column_name": "longitude",
    "source_data_type": "float",
    "target_column_name": "longitude",
    "target_data_type": "float",
    "is_key": "N",
    "is_calculated": "N",
    "calculated_by": "",
    "description": "The longitude of station. The field value must be a valid WGS 84 longitude in decimal degrees format."
  },
   {
    "source_column_name": "region_id",
    "source_data_type": "integer",
    "target_column_name": "region_id",
    "target_data_type": "integer",
    "is_key": "N",
    "is_calculated": "N",
    "calculated_by": "",
    "description": "ID of the region where station is located."
  },
  {
    "source_column_name": "rental_methods",
    "source_data_type": "string",
    "target_column_name": "rental_methods",
    "target_data_type": "string",
    "is_key": "N",
    "is_calculated": "N",
    "calculated_by": "",
    "description": "Array of enumerables containing the payment methods accepted at this station."
  },
  {
    "source_column_name": "capacity",
    "source_data_type": "integer",
    "target_column_name": "capacity",
    "target_data_type": "integer",
    "is_key": "N",
    "is_calculated": "N",
    "calculated_by": "",
    "description": "A Number of total docking points installed at this station, both available and unavailable."
  },
  {
    "source_column_name": "last_reported",
    "source_data_type": "datetime",
    "target_column_name": "last_reported",
    "target_data_type": "datetime",
    "is_key": "N",
    "is_calculated": "N",
    "calculated_by": "",
    "description": "Timestamp indicating the last time this station reported its status to the backend, in NYC local time."
  },
]

var stations_columns_descriptions  = {}
stations_columns.forEach(el => { stations_columns_descriptions[el.target_column_name+""] = el.description});

var users = {
  "name": "users",
  "columns": users_columns,
  "columns_descriptions": users_columns_descriptions
}

var bikes = {
  "name": "bikes",
  "columns": bikes_columns,
  "columns_descriptions": bikes_columns_descriptions
}

var trips = {
  "name": "trips",
  "columns": trips_columns,
  "columns_descriptions": trips_columns_descriptions
}

var stations = {
  "name": "stations",
  "columns": stations_columns,
  "columns_descriptions": stations_columns_descriptions
}

function get_all(){
  return [stations, bikes, trips, users]
}

module.exports = {
  stations,
  bikes,
  trips,
  users,
  get_all
}