source_tables_prefix="stg_js_"
hubs_tables_prefix = "hub_js_"
target_tables_prefix = "sat_js_"
table_type =  "incremental"
schema_name = "citibike_dvm"
sats_tables = models.get_all()

dvform.create_satellites_tables(
    source_tables_prefix, 
    target_tables_prefix, 
    hubs_tables_prefix,
    table_type,
    schema_name, 
    sats_tables

)

