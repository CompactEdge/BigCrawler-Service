import datetime

from app.model import (EDGE_SENSOR_INDICIES, EDGE_TIME_FIELD, TIME_INTERVAL,
                       TIME_ZONE, TOTAL_SIZE)
from elasticsearch import Elasticsearch
from flask import current_app
from utils import get_datetime_stamp
from utils.logger import Log

#load elasticsearch
def load_es():
    basic_auth = (current_app.config['ELASTICSEARCH_USERNAME'], current_app.config['ELASTICSEARCH_PASSWORD'])
    uri = "%s:%d" % (current_app.config['ELASTICSEARCH_SERVER'], current_app.config['ELASTICSEARCH_PORT'])
    es = Elasticsearch(uri, http_auth=basic_auth)

    return es


def list_indices():
    es = load_es()
    indices = list()
    for index in es.indices.get('*'):
        if not index.startswith('.'):
            indices.append(index)

    return indices


def list_item_names():
    es = load_es()
    body = {
      "size": 0,
      "aggs": {
        "distict_item_name": {
          "terms": {
            "size": 10000,
            "order": {
              "_count": "desc"
            },
            "field": "item_name.keyword"
          }
        }
      }
    }
    
    try:
        res = es.search(index=EDGE_SENSOR_INDICIES, body=body)

    except Exception as ex:
        Log.error(ex)
        return ex.info['error'], ex.status_code

    result_list = list()
    aggs = res['aggregations']
    for agg in aggs['distict_item_name']['buckets']:
        result_list.append(agg['key'])

    return result_list


def list_device_ids():
    es = load_es()
    body = {
      "size": 0,
      "aggs": {
        "distict_device_id": {
          "terms": {
            "size": 10000,
            "order": {
              "_key": "asc"
            },
            "field": "device_id.keyword"
          }
        }
      }
    }
    
    try:
        res = es.search(index=EDGE_SENSOR_INDICIES, body=body)

    except Exception as ex:
        Log.error(ex)
        return ex.info['error'], ex.status_code

    result_list = list()
    aggs = res['aggregations']
    for agg in aggs['distict_device_id']['buckets']:
        result_list.append(agg['key'])

    return result_list


def get_edge_sensor_doc_count(device_id, start_date, end_date, time_interval):
    es = load_es()
    current = datetime.datetime.now()

    if start_date is None:
        start_date = get_datetime_stamp(current - datetime.timedelta(hours=1))

    if end_date is None:
        end_date = get_datetime_stamp(current)

    if time_interval is None:
        time_interval = TIME_INTERVAL

    body = {
      "size": 0,
      "sort": EDGE_TIME_FIELD,
      "query": {
        "bool": {
          "filter": [
            {
              "range": {
                EDGE_TIME_FIELD: {
                  "gte": start_date,
                  "lt": end_date,
                  "time_zone": TIME_ZONE
                }
              }
            }
          ]
        }
      },
      "aggs": {
        "date_histogram_count": {
          "date_histogram": {
            "field": EDGE_TIME_FIELD,
            "time_zone": TIME_ZONE, 
            "fixed_interval": time_interval,
            "format": "yyyy-MM-dd'T'HH:mm:ss"
          }
        }
      }
    }

    if device_id is not None:
        device_term = {
          "term": {
            "device_id.keyword": {
              "value": device_id
            }
          }
        }
        body['query']['bool']['filter'].append(device_term)
    
    try:
        res = es.search(index=EDGE_SENSOR_INDICIES, body=body)

    except Exception as ex:
        Log.error(ex)
        return ex.info['error'], ex.status_code

    result_dict = dict()
    count = list()
    aggs = res['aggregations']
    
    for agg_count in aggs['date_histogram_count']['buckets']:
        temp_list = list()
        temp_list.append(agg_count['key_as_string'])
        temp_list.append(agg_count['doc_count'])
        count.append(temp_list)
        temp_list = None

    result_dict['count'] = count

    return result_dict


def get_edge_sensor_avg_count(item_name, device_id, start_date, end_date, time_interval):
    es = load_es()
    current = datetime.datetime.now()
    
    if start_date is None:
        start_date = get_datetime_stamp(current - datetime.timedelta(hours=1))

    if end_date is None:
        end_date = get_datetime_stamp(current)

    if time_interval is None:
        time_interval = TIME_INTERVAL

    body = {
      "size": 0,
      "sort": EDGE_TIME_FIELD,
      "query": {
        "bool": {
          "filter": [
            {
              "range": {
                EDGE_TIME_FIELD: {
                  "gte": start_date,
                  "lt": end_date,
                  "time_zone": TIME_ZONE
                }
              }
            },
            {
              "term": {
                "item_name.keyword": {
                  "value": item_name
                }
              }
            }
          ]
        }
      },
      "aggs": {
        "group_by_device_id": {
          "terms": {
            "size": TOTAL_SIZE,
            "order": {
              "_count": "desc"
            },
            "field": "device_id.keyword"
          },
          "aggs": {
            "date_histogram_count": {
              "date_histogram": {
                "field": EDGE_TIME_FIELD,
                "time_zone": TIME_ZONE,
                "fixed_interval": time_interval,
                "format": "yyyy-MM-dd'T'HH:mm:ss"
              },
              "aggs": {
                "avg_item_value": {
                  "avg": {
                    "field": "item_value"
                  }
                }
              }
            }
          }
        }
      }
    }

    if device_id is not None:
        device_term = {
          "term": {
            "device_id.keyword": {
              "value": device_id
            }
          }
        }
        body['query']['bool']['filter'].append(device_term)
        
    try:
        res = es.search(index=EDGE_SENSOR_INDICIES, body=body)

    except Exception as ex:
        Log.error(ex)
        return ex.info['error'], ex.status_code

    result_dict = dict()
    aggs = res['aggregations']
    for agg_device_id in aggs['group_by_device_id']['buckets']:
        key_list = list()
        for agg_avg in agg_device_id['date_histogram_count']['buckets']:
            if agg_avg['avg_item_value']['value'] is not None:
                temp_list = list()
                temp_list.append(agg_avg['key_as_string'])
                temp_list.append(agg_avg['avg_item_value']['value'])
                key_list.append(temp_list)
                temp_list = None

        result_dict[agg_device_id['key']] = key_list

    return result_dict


def get_edge_sensor_all(item_name, device_id, start_date, end_date, time_interval):
    if "," in item_name:
        item_name = item_name.split(",")
    else:
        item_name = [item_name]
    
    total_result = dict()
    query_time_log = ""
    query_time_log = 'get_edge_sensor_all :: ' + start_date + " // " + end_date + " // " + time_interval
    query_time_log = query_time_log + "\n" + "[ " + "총계" + " :: " + get_datetime_stamp(datetime.datetime.now())
    total_result['총계'] = get_edge_sensor_doc_count(device_id, start_date, end_date, time_interval)
    query_time_log = query_time_log + "  -  " + get_datetime_stamp(datetime.datetime.now()) + " ]"
    Log.info(query_time_log)

    query_time_log = ""
    for item in item_name:
        query_time_log = query_time_log + "\n" + "[ " + item + " :: " + get_datetime_stamp(datetime.datetime.now())
        total_result[item] = get_edge_sensor_avg_count(item, device_id, start_date, end_date, time_interval)
        query_time_log = query_time_log + "  -  " + get_datetime_stamp(datetime.datetime.now()) + " ]"
    Log.info(query_time_log)

    return total_result
