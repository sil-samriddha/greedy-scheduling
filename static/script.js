let meeting_count = 1;

const add_meet = document.getElementById("add-btn");
const calculate_btn = document.getElementById("calculate-btn");
const closeErrorBtn = document.getElementById("closeErrorBtn");
const errorBox = document.getElementById("errorBox");

add_meet.addEventListener("click", function (e) {
  const input_div = document.querySelector(".input-bar");
  const meet_div = document.querySelector(".time-grid");
  const btn_div = document.querySelector(".btn-grp");

  meeting_count++;

  const new_meet = document.createElement("div");
  new_meet.className = "time-grid";
  new_meet.innerHTML = meet_div.innerHTML;

  const startTimeInput = new_meet.querySelector('input[name="start"]');
  const endTimeInput = new_meet.querySelector('input[name="end"]');

  startTimeInput.id = `start${meeting_count}`;
  endTimeInput.id = `end${meeting_count}`;

  input_div.removeChild(btn_div);
  input_div.appendChild(new_meet);
  input_div.appendChild(btn_div);
});

calculate_btn.addEventListener('click', function(e){
    let meetings =[]

    try {
        const rent = parseFloat(document.querySelector('#rent').value.trim());
        if (isNaN(rent) || !isFinite(rent)) 
            throw new Error('Please enter a valid number for rent')

            for (let i = 1; i <= meeting_count; i++){
                let startTime = document.getElementById(`start${i}`).value;
                let endTime = document.getElementById(`end${i}`).value;

                if (!startTime || !endTime) {
                    throw new Error('Please fill in both start and end times')
                }

                if (!isValidTime(startTime) || !isValidTime(endTime)) {
                    throw new Error('Please enter a valid time for both start and end times')
                }
        
                if (compareTimes(startTime, endTime) === 1) {
                    throw new Error('Please ensure that the end time should be later than the start time')
                }
        
                let meet_obj = {
                    "start" : startTime,
                    "end" : endTime
                }
        
                meetings.push(meet_obj);
            }

            fetch('/schedule', {
                method: 'POST',
                body: JSON.stringify({
                    rent : rent,
                    meetings : meetings
                }),
                headers: {
                    "Content-type": "application/json; charset=UTF-8"
                }
            }).then(response => response.json())
            .then(data => {
                console.log(data);

                let result = document.querySelector('.result-bar')

                result.innerHTML = 
                `
                <div class="result-heading">
                <h3>Selected Meetings</h3>
                </div>
                `

                data.selected_meetings.forEach(meeting => {
                    result.innerHTML += 
                    `
                    <div class="result-grid">
                        <div class="result-time-grid">
                            <div class="result-start">${meeting.starting_time}</div>
                            <div>&rarr;</div>
                            <div class="result-end">${meeting.ending_time}</div>
                        </div>
                        <div class="result-rent">Rs. ${meeting.rent}/-</div>
                    </div>
                    `
                });

                result.innerHTML +=
                `
                <div class="final-result">
                    <div class="buzy-time">
                        <div>Buzy time</div>
                        <span>${data.total_buzy_time.hours} hours ${data.total_buzy_time.minutes} minutes</span>
                    </div>
                    <div class="total-profit">
                        <div>Total Profit</div>
                        <span>Rs. ${data.total_profit}/-</span>
                    </div>
            
                </div>
                `
            });
    }catch(e){
        show_error(e.message)
        console.error(e)
    }
})

function show_error(error_msg) {
    document.getElementById('errorMsg').textContent = error_msg;
    errorBox.style.display = "block";
}
function isValidTime(timeString) {
    const timeFormat = /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/;
    return timeFormat.test(timeString);
}

function compareTimes(startTime, endTime) {
    const startDate = new Date(`2000-01-01T${startTime}`);
    const endDate = new Date(`2000-01-01T${endTime}`);
    
    if (startDate < endDate) {
        return -1;
    } else if (startDate > endDate) {
        return 1;
    } else {
        return 0;
    }
}

closeErrorBtn.addEventListener("click", function () {
  errorBox.style.display = "none";
});
