from flask import Flask, request, jsonify, render_template
from scheduler import MeetingScheduler

app = Flask(__name__)

@app.route('/', methods=['GET'])
def display():
    return render_template ('index.html')

@app.route('/schedule', methods=['POST'])
def schedule():
    data = request.get_json()
    rent = data.get('rent')
    meetings = data.get('meetings')

    scheduler = MeetingScheduler(rent, meetings)
    scheduler.schedule_meetings()

    total_hours, total_minutes = scheduler.convert_to_hours_minutes(scheduler.total_buzy_minutes)

    response = {
        'selected_meetings': scheduler.selected_meetings,
        'total_buzy_time': {
            'hours': total_hours,
            'minutes': total_minutes
        },
        'total_profit': scheduler.total_profit
    }

    return jsonify(response)

if __name__ == '__main__':
    app.run(debug=True)
