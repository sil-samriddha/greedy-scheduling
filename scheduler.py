from datetime import datetime, time

class MeetingScheduler:
    def __init__(self, rent, meetings):
        self.rent = rent
        self.meetings = self.string_to_time(meetings)
        self.total_buzy_minutes = 0
        self.total_profit = 0
        self.selected_meetings = []

    def schedule_meetings(self):
        self.meetings.sort(key=lambda x: ( x[1], (x[1].hour * 60 + x[1].minute) - (x[0].hour * 60 + x[0].minute)), reverse=True)

        curr_end_time = time(23, 59)

        for meet in self.meetings:
            start, end = meet

            if end <= curr_end_time:

                duration_min = (end.hour * 60 + end.minute) - (start.hour * 60 + start.minute)
                rent_amount = round(self.rent * duration_min / 60, 2)
                self.selected_meetings.append(
                    {'starting_time': start.strftime('%H:%M'), 'ending_time': end.strftime('%H:%M'), 'rent': rent_amount}
                )
                self.total_buzy_minutes += duration_min
                self.total_profit += rent_amount

                curr_end_time = start

        
    
    def string_to_time(self, times):
        converted_to_time = []
        try:
            for t in times:
                datetime_obj = datetime.strptime(t['start'], '%H:%M')
                start_time = datetime_obj.time()

                datetime_obj = datetime.strptime(t['end'], '%H:%M')
                end_time = datetime_obj.time()
                converted_to_time.append((start_time, end_time))
            return converted_to_time
        except ValueError as e:
            print(f"Error: {e}")
            return None

    def convert_to_hours_minutes(self, total_minutes):
        hours = total_minutes // 60
        minutes = total_minutes % 60
        return hours, minutes