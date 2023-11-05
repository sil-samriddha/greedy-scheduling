class MeetingScheduler:
    def __init__(self, rent, meetings):
        self.rent = rent
        self.meetings = meetings
        self.total_buzy_minutes = 0
        self.total_profit = 0
        self.selected_meetings = []

    def schedule_meetings(self):
        self.meetings = sorted(self.meetings, key=lambda x: x['start'])

        current_time = '00:00'
        for meeting in self.meetings:
            start_time = meeting['start']
            end_time = meeting['end']

            if start_time >= current_time:
                meeting_duration = self.get_time_difference(start_time, end_time)
                self.total_buzy_minutes += meeting_duration
                meeting_rent = meeting_duration * self.rent / 60
                self.total_profit += meeting_rent
                self.selected_meetings.append({
                    'starting_time': start_time,
                    'ending_time': end_time,
                    'rent': meeting_rent,
                })
                current_time = end_time

    def get_time_difference(self, start, end):
        start_hours, start_minutes = map(int, start.split(':'))
        end_hours, end_minutes = map(int, end.split(':'))

        start_total_minutes = start_hours * 60 + start_minutes
        end_total_minutes = end_hours * 60 + end_minutes

        return end_total_minutes - start_total_minutes

    def convert_to_hours_minutes(self, total_minutes):
        hours = total_minutes // 60
        minutes = total_minutes % 60
        return hours, minutes