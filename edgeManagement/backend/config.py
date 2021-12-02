# -*- encoding: utf-8 -*-
"""
Copyright (c) 2019 - present AppSeed.us
"""

import os
from decouple import config

class Config(object):
    basedir    = os.path.abspath(os.path.dirname(__file__))


class ProductionConfig(Config):
    DEBUG = False

    REPOS_IP = '129.254.169.147'
    REPOS_PORT = 5000

    # # Security
    # SESSION_COOKIE_HTTPONLY  = True
    # REMEMBER_COOKIE_HTTPONLY = True
    # REMEMBER_COOKIE_DURATION = 3600

    # # PostgreSQL database
    # SQLALCHEMY_DATABASE_URI = '{}://{}:{}@{}:{}/{}'.format(
    #     config( 'DB_ENGINE'   , default='postgresql'    ),
    #     config( 'DB_USERNAME' , default='appseed'       ),
    #     config( 'DB_PASS'     , default='pass'          ),
    #     config( 'DB_HOST'     , default='localhost'     ),
    #     config( 'DB_PORT'     , default=5432            ),
    #     config( 'DB_NAME'     , default='appseed-flask' )
    # )

class DevelopmentConfig(Config):
    DEBUG = True

    REPOS_IP = '192.168.7.166'
    REPOS_PORT = 5000

# Load all possible configurations
config_dict = {
    'Prd' : ProductionConfig,
    'Dev' : DevelopmentConfig
}
