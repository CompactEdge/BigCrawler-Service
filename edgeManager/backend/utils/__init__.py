from pytz import timezone

KST = timezone('Asia/Seoul')


def format_datetime(date_time):
    
    return date_time.astimezone(KST).strftime("%Y-%m-%d %H:%M:%S")


def get_datetime_stamp(date_time):

    return date_time.astimezone(KST).strftime("%Y-%m-%dT%H:%M:%S")
