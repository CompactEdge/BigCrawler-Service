# -*- coding: utf-8 -*-
import logging
from logging.handlers import TimedRotatingFileHandler

#logging
class Log:
    __log_level_map = {
        'debug' : logging.DEBUG,
        'info' : logging.INFO,
        'warn' : logging.WARN,
        'error' : logging.ERROR,
        'critical' : logging.CRITICAL
        }
    
    __logger = None
    
    @staticmethod
    def init(logger_name='log', log_level='debug', log_filepath=''):
        Log.__logger = logging.getLogger(logger_name);
        Log.__logger.setLevel(Log.__log_level_map.get(log_level, 'warn'))
        
        formatter = logging.Formatter('[%(asctime)s] %(levelname)s :: %(message)s')
            
        console_handler = logging.StreamHandler()
        console_handler.setFormatter(formatter)
        Log.__logger.addHandler(console_handler)
        
        if log_filepath != '':
            file_handler = TimedRotatingFileHandler(log_filepath, when='D', interval=1)
            file_handler.setFormatter(formatter)
            Log.__logger.addHandler(file_handler)

    
    @staticmethod
    def debug(msg):
        Log.__logger.debug(msg)
    
    @staticmethod
    def info(msg):
        Log.__logger.info(msg)
    
    @staticmethod
    def warn(msg):
        Log.__logger.warn(msg)
    
    @staticmethod
    def error(msg):
        Log.__logger.error(msg)
    
    @staticmethod
    def critical(msg):
        Log.__logger.critical(msg)
