schema_name = "citibike_source"
tables_prefix = "src_"
sources_tables = models.get_all()

dvform.create_source_tables(
    schema_name, 
    tables_prefix, 
    sources_tables
)