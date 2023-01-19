hubs_tables = models.get_all()
target_tables_prefix = "hub_js_"
table_type = "incremental",
schema_name = "citibike_dvm"
source_tables_prefix="stg_js_"

dvform.create_hubs_tables(
  source_tables_prefix,
  target_tables_prefix,
  table_type,
  schema_name,
  hubs_tables
)