var md5 = require('md5');


function to_timestamp(field){
    return `
        PARSE_TIMESTAMP("%Y%m%d%H%M%S%Z", replace(${field}, "IST", "Asia/Kolkata"))
    `;
}

function to_hash(cols) {
  var cols_as_str = cols.map( x=> `IFNULL(UPPER(TRIM(CAST(${x} as string))), "--")`).reduceRight( (x,y) => `${x},${y}`)
  return `TO_BASE64(md5(concat(${cols_as_str})) )`;
}


function format_column_sql(config){

    if(config.is_calculated.toLowerCase() == "y")
        return config.calculated_by +" as "+ config.target_column_name;

    if(config.source_data_type.toLowerCase() == config.target_data_type)
        return config.source_column_name +" as " + config.target_column_name;
    else if(config.target_data_type.toLowerCase()  == "int64")
        return "cast("+ config.source_column_name +" as int64) as " + config.target_column_name ;
    else if(config.target_data_type.toLowerCase()  == "float64")
        return "cast("+ config.source_column_name+ " as float64) as " + config.target_column_name;
    else if(config.target_data_type.toLowerCase()  == "timestamp")
        return  to_timestamp(config.source_column_name) +"  as " + config.target_column_name ;
    else
        throw target_data_type + " cannot be parsed.";
}


function get_transformed_cols(config){
    return `
        ${config.map( x => format_column_sql(x) ).reduce( (x,y) => `${x},${y}`)}
    `;
}

function is_not_empty(col){
    return `
        ${col} is not null and trim(cast(${col} as string)) != ''
    `;
}

function is_empty(col){
    return `
        ${col} is null and trim(cast(${col} as string)) == ''
    `;
}


function are_not_empty(cols){
    return cols.map(x => is_not_empty(x.source_column_name)).reduce((x,y) => `${x} and ${y}`);
}

function get_hub(config, source_table, hub_key){

    var hub_config = config.filter(x => x.is_key.toLowerCase() == "y");
    var hub_cols = hub_config.map(x => x.source_column_name);
    var hub_hash_id = to_hash(hub_cols);
    var cols = hub_config.map( x => format_column_sql(x) ).reduce( (x,y) => `${x},${y}`);
    var where_clause= hub_config.map(x => is_not_empty(x.source_column_name)).reduce((x,y) => `${x} and ${y}`);

    return `
        select distinct
        ${hub_hash_id} as ${hub_key},
        ${cols},
        '${source_table}' as source,
        CURRENT_TIMESTAMP() as load_time
        from ${source_table} stg
        where ${where_clause}
    `;

}

function get_sat(config, source_table, hub_table, hub_key){

    var hub_config = config.filter(x => x.is_key.toLowerCase() == "y");
    var sat_config = config.filter(x => x.is_key.toLowerCase() == "n");
    var sat_cols = sat_config.map(x => x.source_column_name);
    var hash_diff = to_hash(sat_cols);
    var cols = sat_config.map( x => format_column_sql(x) ).reduce( (x,y) => `${x},${y}`);
    var join_clause = hub_config.map(x => "stg."+x.source_column_name +" = hub."+ x.target_column_name).reduce((x,y) => `${x} and ${y}`);

    return `
        select distinct
        hub.${hub_key} as ${hub_key},
        ${hash_diff} as hash_diff,
        ${cols},
        '${source_table}' as source,
        CURRENT_TIMESTAMP() as load_time
        from ${source_table} stg join ${hub_table} hub
        on ${join_clause}
    `;

}

function get_link(config_1, config_2, source_table, hub_table_1, hub_table_2,hub_key_1, hub_key_2,  link_key){

    var link_hash = to_hash([hub_key_1, hub_key_2])

    var hub_config_1 = config_1.filter(x => x.is_key.toLowerCase() == "y");
    var cols_1 = hub_config_1.map( x => format_column_sql(x) )//.reduce( (x,y) => `${x},${y}`);
    var where_clause_1 = hub_config_1.map(x => is_not_empty(x.source_column_name)).reduce((x,y) => `${x} and ${y}`);
    var join_clause_1 = hub_config_1.map(x => "hub1."+x.target_column_name +" = a."+ x.source_column_name).reduce((x,y) => `${x} and ${y}`);

    var hub_config_2 = config_2.filter(x => x.is_key.toLowerCase() == "y");
    var cols_2 = hub_config_2.map( x => format_column_sql(x) )//.reduce( (x,y) => `${x},${y}`);
    var where_clause_2 = hub_config_2.map(x => is_not_empty(x.source_column_name)).reduce((x,y) => `${x} and ${y}`);
    var join_clause_2 = hub_config_2.map(x => "hub2."+x.target_column_name +" = a."+ x.source_column_name).reduce((x,y) => `${x} and ${y}`);

    var cols = cols_1.concat(cols_2)
    var unique_cols = [... new Set(cols)]

    return `
        select
        ${link_hash} as ${link_key},
        ${hub_key_1},
        ${hub_key_2},
        "${source_table}" as source,
        CURRENT_TIMESTAMP() as load_time
        from (
            select distinct
                ${unique_cols}
            from ${source_table}  stg
            where  ${where_clause_1} and ${where_clause_2}
        ) a
        join ${hub_table_1} hub1 on ${join_clause_1}
        join ${hub_table_2} hub2 on ${join_clause_2}
    `;
}

function render_target_cols(config){
    return `
        ${config.map( x => x.target_column_name).reduce( (x,y) => `${x},${y}`)}
    `;
}

function get_landing_files(source_table_name){
    return `
        select
            distinct lower(trim(_file_name)) as file_name
        from
        ${source_table_name}
    `
}

function get_stage_table(load_id, table_name, table_model){
   cols = get_transformed_cols(table_model)
   return `
        select
        '${load_id}' as load_id,
        current_timestamp() as load_time,
        _file_name as file_name,
        ${cols}
        from ${table_name}
    `
}



function create_source_tables(schema_name, tables_prefix, source_tables){
    source_tables.forEach(tbl =>
        declare({
            schema: schema_name,
            name: `${tables_prefix}${tbl.name}`
        })
    )
}

function create_staging_tables(load_id, schema_name, source_tables_prefix, target_tables_prefix, tables_type, staging_tables){
    staging_tables.forEach( tbl =>
        publish(`${target_tables_prefix}${tbl.name}`, {
            type: tables_type,
            schema: schema_name,
            description: `Cleaned up data for ${target_tables_prefix}_${tbl.name} data source`,
            columns: tbl.columns_descriptions,
            tags: ["stage"],
            bigquery: {
            partitionBy: "DATE(load_time)",
            clusterBy: ["load_id"]
        }}).query(ctx => `
            ${
                dvform.get_stage_table(
                    load_id,
                    ctx.ref(`${source_tables_prefix}${tbl.name}`),
                    tbl.columns
                )
            }
        `)
    )
}

function create_hubs_tables(source_tables_prefix, hubs_tables_prefix, tables_type, schema_name, hub_tables){
    hub_tables.forEach( tbl =>
        publish(`${hubs_tables_prefix}${tbl.name}`, {
            type: tables_type,
            schema: schema_name,
            columns: tbl.columns_descriptions,
            description: `hub ${tbl.name} table`,
            uniqueKey: [`${tbl.name}_hash_id`],
            tags: ["data-vault", "hubs"]
        })
        .query(ctx => `
            ${
                dvform.get_hub(
                    tbl.columns,
                    ctx.ref(`${source_tables_prefix}${tbl.name}`),
                    `${tbl.name}_hash_id`
                )
            }
        `)
    )
}

function create_satellites_tables(source_tables_prefix, satellites_tables_prefix, hubs_tables_prefix, tables_type, schema_name, sats_tables){

    sats_tables.forEach( tbl =>
        publish(`${satellites_tables_prefix}${tbl.name}`, {
            type: tables_type,
            schema: schema_name,
            columns: tbl.columns_descriptions,
            description: `Satellite ${tbl.name} table`,
            uniqueKey: [`${tbl.name}_hash_id` , "hash_diff"],
            tags: ["data-vault", "sats"]
        })
        .query(ctx => `
            ${
                dvform.get_sat(
                    tbl.columns,
                    ctx.ref(`${source_tables_prefix}${tbl.name}`),
                    ctx.ref(`${hubs_tables_prefix}${tbl.name}`),
                    `${tbl.name}_hash_id`
                )
            }
        `)
    )

}

function create_links_tables (source_tables_prefix, hubs_tables_prefix, links_tables_prefix, tables_type, schema_name, links_tables){
    links_tables.forEach( lnk =>
        publish(`${links_tables_prefix}${lnk.hub1.name}_${lnk.hub2.name}`, {
            type: tables_type,
            schema: schema_name,
            description: `Link for ${lnk.hub1.name} ${lnk.hub2.name} table`,
            uniqueKey: [`${lnk.hub1.name}${lnk.hub2.name}_hash_id` , "hash_diff"],
            tags: ["data-vault", "links"]
        })
        .query(ctx => `
            ${
            dvform.get_link(
                lnk.hub1.columns,
                lnk.hub2.columns,
                ctx.ref(`${source_tables_prefix}${lnk.source.name}`),
                ctx.ref(`${hubs_tables_prefix}${lnk.hub1.name}`),
                ctx.ref(`${hubs_tables_prefix}${lnk.hub2.name}`),
                `${lnk.hub1.name}_hash_id`,
                `${lnk.hub2.name}_hash_id`,
                `${lnk.hub1.name}_${lnk.hub2.name}_hash_id`
            )
            }
        `)
    )
}

function create_data_vault_from_model(
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
    models,
    links
){

    create_source_tables(source_schema_name, source_tables_prefix, models)
    create_staging_tables(load_id, stage_schema_name, source_tables_prefix, stage_tables_prefix, tables_type, models)
    create_hubs_tables(stage_tables_prefix, hubs_tables_prefix, tables_type, datavualt_schema_name, models)
    create_satellites_tables(stage_tables_prefix, satellites_tables_prefix ,hubs_tables_prefix, tables_type, datavualt_schema_name, models)
    create_links_tables(stage_tables_prefix, hubs_tables_prefix, links_tables_prefix, tables_type, datavualt_schema_name, links)
}

module.exports = {
  get_landing_files,
  get_stage_table,
  to_timestamp,
  get_transformed_cols,
  to_hash,
  render_target_cols,
  get_hub,
  get_sat,
  get_link,
  create_source_tables,
  create_staging_tables,
  create_hubs_tables,
  create_satellites_tables,
  create_links_tables,
  create_data_vault_from_model
};