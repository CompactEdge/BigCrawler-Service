# -*- encoding: utf-8 -*-
import os


class Config(object):
    basedir = os.path.abspath(os.path.dirname(__file__))


class LocalConfig(Config):
    DEBUG = True
    CONFIG_FILE = Config.basedir + "/kube_config.yaml"

    REPOS_IP = '10.7.17.15'
    REPOS_PORT = 5000
    
    MONITORING_IP = "10.7.17.12"
    MONITORING_PORT = 9090

    # elasticsearch
    ELASTICSEARCH_SERVER = '10.7.17.13'
    ELASTICSEARCH_PORT = 9200
    ELASTICSEARCH_USERNAME = 'test'
    ELASTICSEARCH_PASSWORD = 'qwe123'
    
    LOGGER_NAME = "log"
    LOG_LEVEL = "debug"
    LOG_FILE = ""


class DevelopmentConfig(Config):
    DEBUG = True
    CONFIG_FILE = os.path.expanduser('~')+"/.kube/config"

    REPOS_IP = '10.7.17.15'
    REPOS_PORT = 5000
    
    MONITORING_IP = "10.7.17.12"
    MONITORING_PORT = 9090

    # elasticsearch
    ELASTICSEARCH_SERVER = '10.7.17.13'
    ELASTICSEARCH_PORT = 9200
    ELASTICSEARCH_USERNAME = 'test'
    ELASTICSEARCH_PASSWORD = 'qwe123'

    LOGGER_NAME = "log"
    LOG_LEVEL = "debug"
    LOG_FILE = "/applog/edgeManager/edgeManager.log"


class ProductionConfig(Config):
    DEBUG = False
    CONFIG_FILE = os.path.expanduser('~')+"/.kube/config"

    REPOS_IP = '192.168.54.42'
    REPOS_PORT = 5000
    
    MONITORING_IP = "192.168.54.41"
    MONITORING_PORT = 9090

    # elasticsearch
    ELASTICSEARCH_SERVER = '192.168.54.43'
    ELASTICSEARCH_PORT = 9200
    ELASTICSEARCH_USERNAME = 'edgeuser'
    ELASTICSEARCH_PASSWORD = 'qwe123'

    LOGGER_NAME = "log"
    LOG_LEVEL = "info"
    LOG_FILE = "/applog/edgeManager/edgeManager.log"


# Load all possible configurations
config_dict = {
    'Local' : LocalConfig,
    'Dev' : DevelopmentConfig,
    'Prod' : ProductionConfig,
}
