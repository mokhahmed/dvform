dvform = require("dvform");

load_id = dataform.projectConfig.vars.load_id
source_schema_name = "citibike_source"
stage_schema_name = "citibike_stage"
datavualt_schema_name = "citibike_dvm"
source_tables_prefix = "src_citibike_"
stage_tables_prefix = "stg_citibike_"
hubs_tables_prefix = "hub_citibike_"
satellites_tables_prefix = "sat_citibike_"
links_tables_prefix = "link_citibike_"
tables_type = "incremental"
all_models = models.get_all()
links_tables= [
  {
    source: models.trips,
    hub1: models.bikes,
    hub2: models.trips
  }
]

dvform.create_data_vault_from_model(
    load_id,
    source_schema_name,
    stage_schema_name,
    datavualt_schema_name,
    source_tables_prefix,
    stage_tables_prefix,
    hubs_tables_prefix,
    satellites_tables_prefix,
    links_tables_prefix,
    tables_type,
    all_models,
    links_tables
)