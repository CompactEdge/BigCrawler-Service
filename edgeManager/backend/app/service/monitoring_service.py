import datetime

import requests
from app.queries import MONITORING_QUERIES, VARIABLE_VALUE_QUERIES
from flask import current_app


class KubernetesMonitoringService():
    
    def __init__(self):
        self.MONITORING_URL = "http://{0}:{1}".format(current_app.config["MONITORING_IP"], str(current_app.config["MONITORING_PORT"]))
        self.monitoring_queries = MONITORING_QUERIES
        self.variable_values_queries = VARIABLE_VALUE_QUERIES
    
    
    def make_request_error(request_err):
        return {
            "status": ["error"],
            "status_code": [],
            "data": { "errorType": "RequestException", "error": str(request_err) }
        }
    
        
    def make_key_error(key_err):
        return {
            "status": ["error"],
            "status_code": [],
            "data": { "errorType": "KeyError", "error": str(key_err) }
        }
        
    
    def make_init_data(self):
        return { "status": [], "status_code": [], "data": {} }
    
    
    def find_by_module_info(self, meta_name, meta_items, variable_values):
        result_data = {}
        
        try:
            now = datetime.datetime.now()
            for meta_item in meta_items:
                expr_name = meta_item
                meta_args = {
                    "start_time": str((now - datetime.timedelta(hours=9, minutes=1)).strftime("%Y-%m-%dT%H:%M:%S.000Z")),
                    "end_time": str((now - datetime.timedelta(hours=9)).strftime("%Y-%m-%dT%H:%M:%S.000Z")),
                    "step_time": "60s",
                    "expr_type": meta_name["meta_name"],
                    "expr_name": expr_name,
                    "variable_key": "instance",
                    "variable_values": variable_values
                }
                response_data = self.find_by_monitoring_query_range(meta_args)
                
                if len(result_data.keys()) == 0:
                    if len(response_data["data"].keys()) > 0 and len(response_data["data"]["result"]) > 0:
                        latest_data = response_data["data"]["result"][0]["values"][-1]
                        result_data[expr_name] = {
                            "date": latest_data[0],
                            "value": latest_data[1]
                        }
                    else:
                        result_data[expr_name] = { "date": None, "value": None }
                elif len(result_data.keys()) > 0:
                    latest_data = response_data["data"]["result"][0]["values"][-1]
                    result_data[expr_name] = {
                        "date": latest_data[0],
                        "value": latest_data[1]
                    }
        except KeyError as key_err:
            result_data = self.make_key_error(key_err)
        
        return result_data


    def find_by_monitoring_query_range(self, args):
        result_data = self.make_init_data()

        try:
            start_time = args["start_time"]
            end_time = args["end_time"]
            step_time = args["step_time"]

            expr_type = args["expr_type"]
            expr_name = args["expr_name"]

            variable_key = args["variable_key"]
            variable_values = args["variable_values"]
            rate_interval = step_time

            expr_items = self.monitoring_queries[expr_type][expr_name]
            
            for expr_item in expr_items:
                expr_units = expr_item["expr_units"]
                expr_tags_keys = expr_item["expr_tags_keys"].split(",")
                expr_tags_values = expr_item["expr_tags_values"]
                expr_query = expr_item["expr_query"]
                
                monitoring_url = "{0}/api/v1/query_range".format(self.MONITORING_URL)
                monitoring_params = {
                    "start": start_time,
                    "end": end_time,
                    "step": step_time,
                    "query": expr_query.format(variable_key=variable_key, variable_value=variable_values, rate_interval=rate_interval)
                }

                response = requests.get(url=monitoring_url, params=monitoring_params)
                response_status_code = response.status_code
                response_data = response.json()
                
                result_data["status"].append(response_data["status"])
                result_data["status_code"].append(response_status_code)
                if len(result_data["data"].keys()) != 0:
                    result_data["data"]["resultType"] = response_data["data"]["resultType"]
                    result_data["data"]["result"] = result_data["data"]["result"] + response_data["data"]["result"]
                else:
                    result_data["data"]["resultType"] = response_data["data"]["resultType"]
                    result_data["data"]["result"] = response_data["data"]["result"]
                    
                
                for x in response_data["data"]["result"]:
                    legend = ""
                    
                    metric = x["metric"]
                    values = x["values"]
                    
                    # Unixtimestamp 변경
                    for index in range(len(values)):
                        values[index][0] = str(datetime.datetime.fromtimestamp(values[index][0]).strftime("%Y-%m-%d %H:%M:%S"))
                    
                    # Unit 생성
                    metric["units"] = expr_units
                        
                    # Legend 생성
                    for index, value in enumerate(expr_tags_keys):
                        if  index != 0 and value != "":
                            legend += "," + metric[value]
                        elif value != "":
                            legend += metric[value]
                    
                    if legend != "" and expr_tags_values != "":
                        metric["legend"] = legend + "," + expr_tags_values
                    else:
                        metric["legend"] = legend + expr_tags_values
                    
                        
                
        except requests.exceptions.RequestException as request_err:
            result_data = self.make_request_error(request_err)
        except KeyError as key_err:
            result_data = self.make_key_error(key_err)
            
            
        return result_data
        # return make_response(jsonify(result_data), HTTPStatus(max(result_data["status_code"])))


    def find_by_monitoring_variable_values(self, variable_values_args):
        result_data = self.make_init_data()
        
        try:
            variable_type = variable_values_args["variable_type"]
            variable_key = variable_values_args["variable_key"]
            
            expr_item = self.variable_values_queries[variable_type][variable_key]
            expr_item_label = expr_item["label"]
            expr_item_query = expr_item["query"]
            
            monitoring_url = "{0}/api/v1/query".format(self.MONITORING_URL)
            monitoring_params = {
                "query": expr_item_query
            }
            
            response = requests.get(url=monitoring_url, params=monitoring_params)
            response_status_code = response.status_code
            response_data = response.json()
            
            result_data["status"].append(response_data["status"])
            result_data["status_code"].append(response_status_code)
            result_data["data"] = { "resutType": "list", "result": sorted(list(set(data['metric'][expr_item_label] for data in response_data["data"]['result']))) }
        except requests.exceptions.RequestException as request_err:
            result_data = self.make_request_error(request_err)
        except KeyError as key_err:
            result_data = self.make_key_error(key_err)
            
        
        return result_data
    
    
    def find_by_monitoring_meta_datas(self, meta_datas_args):
        result_data = self.make_init_data()
        
        try:
            meta_name = meta_datas_args["meta_name"]
            
            panel_names = self.monitoring_queries[meta_name].keys()
            
            result_data["status"].append("success")
            result_data["status_code"].append(200)
            result_data["data"] = { "resutType": "list", "result": list(panel_names) }
        except KeyError as key_err:
            result_data = self.make_key_error(key_err)
        
        
        return result_data
        