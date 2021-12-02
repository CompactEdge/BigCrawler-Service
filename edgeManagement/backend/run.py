# -*- encoding: utf-8 -*-

from app import create_app
from decouple import config
import logging
from config import config_dict

# .env 파일에서 DEBUG 값을 읽음
DEBUG = config('DEBUG', default=True, cast=bool)

# config.py에 설정된 Debug 클래스의 설정 또는 Production 클래스의 설정을 결정함 
get_config_mode = 'Dev' if DEBUG else 'Prd'

try:
    # Load the configuration 
    app_config = config_dict[get_config_mode.capitalize()]

except KeyError:
    exit('Error: Invalid <config_mode>. Expected values [Debug, Production] ')

# 앱을 생성하면서 config 값을 설정함 
app = create_app(app_config) 

if DEBUG:
    app.logger.info('DEBUG       = ' + str(DEBUG)      )
    app.logger.info('Environment = ' + get_config_mode )

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=9000)