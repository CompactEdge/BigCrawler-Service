import json
import time
from typing import Any, Dict, List
from datetime import datetime
from pytz import timezone
import requests
from flask import current_app

def list_images():

    repos_url = "http://" + current_app.config['REPOS_IP'] + ":" + str(current_app.config['REPOS_PORT']) + "/v2/_catalog"
    req_headers = {
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_2) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/13.0.4 Safari/605.1.15',
    }
    
    response = requests.get(url = repos_url, headers = req_headers)
    result = eval(response.text)
    return result['repositories']


def list_tags():
    tags_list = list()
    repos_url = "http://" + current_app.config['REPOS_IP'] + ":" + str(current_app.config['REPOS_PORT']) + "/v2/_catalog"
    req_headers = {
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_2) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/13.0.4 Safari/605.1.15',
    }
    response = requests.get(url = repos_url, headers = req_headers)
    result = eval(response.text)
    image = result['repositories']
    
    for img in image:
        repos_url = "http://" + current_app.config['REPOS_IP'] + ":" + str(current_app.config['REPOS_PORT']) + "/v2/" + img + "/tags/list"
        req_headers = {
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_2) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/13.0.4 Safari/605.1.15',
    }
        response = requests.get(url = repos_url, headers = req_headers)
        result = eval(response.text)
        tags_list.append(result)
    return tags_list
 