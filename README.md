# DVForm
Dataform utility library that allow you to build a data vault model using a configuration based technique. 


## What is Data Vault ? 
Data vault is a relatively new design methodology for data warehouses. Data vaults store raw data as-is without applying business rules. Data transformation happens on-demand, and the results are available for viewing in a department-specific data mart. While a traditional data warehouse structure relies on extensive data pre-processing, the data vault model takes a more agile approach. This can help tackle difficult use cases, although it’s not always easy to implement.

###  Advantages of the Data Vault
* Raw Data Retention
* Simpler Transformations
* Decoupling of Rules and Data
* Department-Specific Data Transformations

### Disadvantages of a Data Vault
* Increased Resource Usage
* Expanded Data Storage
* Solution Complexity
* Slower Data Mart Results


## Data Vault Architecture Layers
* **Staging Layer** does not apply any changes to the data, it provides a temporary area to support the process of moving data from various sources into the Data Warehouse.
* **Raw Vault** stores persistently the data in a model built around the identification of the business keys in the data sources.
* **Business Vault** in which we deal with Soft Business Rules, Data Quality. There are many reasons to refactor it over time.
* **Information Mart** is needed because data in the Business Vault is still in the Hub, Link, Satellite shape and has to be shaped as expected by the final business user (e.g., star schema, feature store for Data Mining etc)

All these layers can be stored and maintained in separated BigQuery datasets as shown in below architecture diagram 

![alt architecture](resources/architecture.png) 

## CitiBike Example

Citibike entities are ingested into Stage Layer where we are keeping the data without applying any changes to it. <br/><br/>
![alt citibike_model](resources/citibike-source.png) 


### The Data Vault Model consists of 3 concepts:<br/>

  * **Hub Tables**: collects all the business keys present in a source entity for each Hub table we add 3 columns.
  
    | **Column**    | **Description**                                                                                                                                           | 
    |-----------|:------------------------------------------------------------------------------------------------------------------------------------------------------|
    | **Hash_Id**   | A new String column to uniquely identify a record in the hub table, and it’s calculated based on the business keys. e.g   user_hash_id : md5(user_id) |
    | **Source**    | A new String column to capture the source data location / table.                                                                                      |           
    | **Load_Time** | A new Timestamp column to represent the ingestion time into the table.                                                                                |

  * **Link Tables**: represents as N-to-N relationship and uses the business keys to connect 2 Hubs for each Link table we add 3 columns.
  
    | **Column**        | **Description**                                                                                                                   |                                                                                                                             
    |:--------------|:------------------------------------------------------------------------------------------------------------------------------|
    | **Hash_Id**   | A new String column to uniquely identify a record in the link table. e.g. bike_trip_hash_id : md5(bike_hash_id, trip_hash_id) |
    | **Source**    | A new String column to capture the source data location / table.                                                              |
    | **Load_Time** | A new Timestamp column to represent the ingestion time into the table.                                                        |
     
  * **Satellite Tables** :  store all data that describes a row in a Hub or a Link for each satellite table we add 4 columns.

    | **Column**    | **Description**                                                                                                                            |                                                                                                                             
    |:--------------|:-------------------------------------------------------------------------------------------------------------------------------------------|
    | **Hash_Id**   | A new String column to refer to the hub hash id. e.g   user_hash_id                                                                        |
    | **Hash_diff** | A new String column to uniquely identify non-business key columns. e.g. users hash_diff: md5(user_type, gender, birth_year, customer_plan) |
    | **Source**    | A new String column to capture the source data location / table.                                                                           |
    | **Load_Time** | A new Timestamp column to represent the ingestion time into the table.                                                                     |

So we need to change the citibike data model as below to store it at the **data vault Layer**

![alt citibike_data_vault_model](resources/citibike-datavault-model.png) 

## How to use DVForm to create a data vault model ? 

DVForm is a utility library based on Dataform that allow you to create easily create you data vault model in a generic, automated and configurable way.

### Installation 

Add the package to your package.json file in your Dataform project. You can find the most up-to-date package version on the [releases page](https://github.com/mokhahmed/dvform/releases).
or you can download the index.js file and import it into `includes/index.js` then you can it from js or sqlx scripts for more details refer to [reuse code guide](https://cloud.google.com/dataform/docs/reuse-code-includes) 

```
{
  "name": "demo",
  "dependencies": {
    "@dataform/core": "2.0.1",
    "dvform":"https://github.com/mokhahmed/dvform/archive/0.1.tar.gz"
    }
}
```

### Usage

#### 1. create citibike entities configuration `includes/models.js`  [citibike models example](includes/models.js) <br/>

  * **Define the entity configurations in the following structure <br/>**

    | Record Name          | Description                                               |
    |:---------------------|:----------------------------------------------------------|
    | name                 | String of the name for the entity e.g. (users, bikes, ..) |
    | columns              | Array of columns object structure                         |
    | columns_descriptions | Array of columns description object structure             |

    **example** 
    
    ```
    var entity_example = {
      "name": "entity_name",
      "columns": entity_columns_obj,
      "columns_descriptions": entity_columns_descriptions_obj
    }
    ```

    * **Define the entity columns configurations in the following structure <br/>**

      | Record Name        | Description                                                                                  |
      |----------------------------------------------------------------------------------------------|:---------------------------------------------------------------------------------------------|
      | source_column_name | String for the name for the column in the source table e.g. (users_id,user_type, ..)         |
      | source_data_type   | String for the data type of the column in the source table  (stirng , int, float, timestamp) |
      | target_column_name | String for the name for the column in the source table e.g. (users_id,user_type, ..)         |
      | target_data_type   | String for the data type of the column in the target table  (stirng , int, float, timestamp) |
      | is_key             | "Y/N" yes or no flag represents if this column is a unique business key                      |
      | is_calculated      | "Y/N" yes or no flag if this column is calculated based on external logic                    |
      | calculated_by      | String for the sql logic to be applied for this column                                       |
      | description        | String decription for the column that should appear at BigQuery Documentation                |
  
      **example** 
      ```
        var entity_columns_obj =  [{
            "source_column_name": "col1",
            "source_data_type": "integer",
            "target_column_name": "col2",
            "target_data_type": "integer",
            "is_key": "Y",
            "is_calculated": "N",
            "calculated_by": "",
            "description": "col2 breif decription"
          }, ... ]
      ```
  * **Define the entity columns configurations in the following structure**
    
    | Record Name   | Description                                                                    |
    |:--------------|:-------------------------------------------------------------------------------|
    | <COLUMN_NAME> | String for the column description the should appear in bigquery documentations |
    
    example 
    ```
      var entity_columns_descriptions_obj =  [{
          "col2": "col2 breif decription",
        }, ... ]
    ```


### you have 3 options to use DVForm based on the level of customization required

Using `create_data_vault_from_model` 
 

## CICD for Dataform Pipelines

![alt ci-cd](resources/cicd.png)

* Push a new change to the dataform project git repository.
* Cloud build/ triggered.
* Create an image and push it into GCR.
* Deploy the dag to the cloud composer bucket.
* Composer Dag task will run  and create the dataform code.
* All tables will be created/updated in BigQuery.


## Scheduling

### Cloud Composer as dataform scheduler:
* Dataform can be scheduled using DAG/task in Cloud Composer
* Dataform will run on top of Kubernetes Cluster (compared to local machine / VM)
* The Kubernetes Cluster can be a standalone or Cloud Composer GKE cluster. If using the Cloud Composer GKE cluster, each Dataform run will run in a dedicated Kubernetes pod.
* Cloud Composer can manage the variables and environment variables which can also be further used by Dataform pipelines.

### Logging and monitoring
We can see the dbt logs from Cloud Composer UI for each DAG run.
As an example, this is the dbt run log that you can open from the Airflow UI:

### Backfilling
One of the best features in the Airflow is how it handles backfill. This Airflow feature can be implemented together with dataform.

For example, this is an example of DAG that runs dataform:

As a usual Airflow DAG, you can rerun any of the tasks or DAG run to backfill the data. Using the correct setup, the dbt will be able to handle the backfill mechanism from Airflow.

## Data Quality

### Dataform Assertions 
### Dataform Tests
