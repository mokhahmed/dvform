source_tables_prefix="stg_js_"
hubs_tables_prefix = "hub_js_"
target_tables_prefix = "link_js_"
table_type= "incremental"
schema_name= "citibike_dvm"
links_tables= [
  { 
    'source': models.trips, 
    'hub1': models.bikes, 
    'hub2': models.trips
  }
]

dvform.create_links_tables (
  source_tables_prefix, 
  hubs_tables_prefix, 
  target_tables_prefix, 
  table_type, 
  schema_name, 
  links_tables
)