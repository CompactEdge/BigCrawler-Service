# -*- encoding: utf-8 -*-

from decouple import config

from app import create_app
from config import config_dict
from utils.logger import Log

# .env 파일에서 PROJECT_NAME, FLASK_ENV 값을 읽음
# config.py에 설정된 Debug 클래스의 설정 또는 Production 클래스의 설정을 결정함 
get_config_mode = config('ENV_NAME', default='Edge', cast=str)

try:
    # Load the configuration 
    app_config = config_dict[get_config_mode]

except KeyError:
    exit('Error: Invalid <config_mode>. Expected values [Debug, Production] ')

# 앱을 생성하면서 config 값을 설정함 
app = create_app(app_config)
app.app_context().push() # config를 강제로 push 

Log.info('Environment = ' + get_config_mode )
if __name__ == "__main__":
    app.run(host="0.0.0.0", port=9000, use_reloader=True)
