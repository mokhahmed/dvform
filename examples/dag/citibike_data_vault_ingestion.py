"""CITIBIKE Data Vault Ingestion Pipeline DAG"""

import uuid
from airflow import models
from airflow.utils.dates import days_ago
from airflow.operators.python_operator import PythonOperator

## ENV CONFIG
ENV = "dev"
PIPELINE_NAME = "citibike"

## SOURCE CONFIG
PROJECT_ID = models.Variable.get(f"{ENV}_project_id")

## PIPELINE_CONFIG
IMAGE = models.Variable.get(f"{ENV}_{PIPELINE_NAME}_dataform_image")
K8S_NAMESPACE = models.Variable.get(f"{ENV}_k8s_operator_namespace", "default")
LOAD_ID = str(uuid.uuid4().hex)

PIPELINE_NAME = f"{ENV}_{PIPELINE_NAME}_data_vault_ingestion"

default_args = {
    "start_date": days_ago(1)
}


def run_dataform_on_kubernetes(namespace, image, job_id, tags, cmd=None, timeout='30s', **context):
    """This function will execute the KubernetesPodOperator as an Airflow task"""
    from airflow.providers.cncf.kubernetes.operators.kubernetes_pod import KubernetesPodOperator
    KubernetesPodOperator(
        task_id=f'dataform_cli_{cmd}',
        name=f'dataform_cli_{cmd}',
        cmds=["bash", "-c", f"dataform {cmd} --vars=jobId='{job_id}' --tags '{tags}' --timeout {timeout}"],
        namespace=namespace,
        service_account_name='default',
        image_pull_policy='Always',
        image=image,
        get_logs=True,  # Capture logs from the pod
        log_events_on_failure=True,  # Capture and log events in case of pod failure
        is_delete_operator_pod=True,  # To clean up the pod after runs
    ).execute(context)


with models.DAG(
        PIPELINE_NAME,
        default_args=default_args,
        schedule_interval='@once',
        tags=[ENV, PIPELINE_NAME, "raw"]
) as dag:
    src_to_stg = PythonOperator(
        task_id='from_source_to_stage_zone',
        provide_context=True,
        python_callable=run_dataform_on_kubernetes,
        op_kwargs={
            "namespace": K8S_NAMESPACE,
            "image": IMAGE,
            "load_id": LOAD_ID,
            "tags": "stage",
            "cmd": "run"
        }
    )

    stg_to_raw = PythonOperator(
        task_id='from_stage_zone_to_raw_zone',
        provide_context=True,
        python_callable=run_dataform_on_kubernetes,
        op_kwargs={
            "namespace": K8S_NAMESPACE,
            "image": IMAGE,
            "load_id": LOAD_ID,
            "tags": "raw",
            "cmd": "run"
        }
    )

    src_to_stg >> stg_to_raw
