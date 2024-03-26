import React, { useState } from 'react';
import { Grid, TextField, Button, FormControl, InputLabel, Select, MenuItem, AppBar, Toolbar, Typography } from '@mui/material';

const App = () => {
  const [timeIntervals, setTimeIntervals] = useState([{ inHour: '', inMinute: '', inAmPm: 'AM', outHour: '', outMinute: '', outAmPm: 'AM' }]);
  const [totalHours, setTotalHours] = useState(0);
  const [error, setError] = useState(false);

  const handleInputChange = (index, event) => {
    const { name, value } = event.target;
    const newTimeIntervals = [...timeIntervals];
    newTimeIntervals[index][name] = value;
    setTimeIntervals(newTimeIntervals);
  };

  const addTimeInterval = () => {
    setTimeIntervals([...timeIntervals, { inHour: '', inMinute: '', inAmPm: 'AM', outHour: '', outMinute: '', outAmPm: 'AM' }]);
  };

  const calculateTotalHours = () => {
    let total = 0;
    let hasEmptyField = false;
    timeIntervals.forEach(interval => {
      if (!interval.inHour || !interval.inMinute || !interval.outHour || !interval.outMinute) {
        hasEmptyField = true;
        return;
      }
      const inTime = convertTo24Hour(`${interval.inHour}:${interval.inMinute} ${interval.inAmPm}`);
      const outTime = convertTo24Hour(`${interval.outHour}:${interval.outMinute} ${interval.outAmPm}`);
      total += calculateHourDifference(inTime, outTime);
    });
    if (hasEmptyField) {
      setError(true);
    } else {
      setError(false);
      setTotalHours(total);
    }
  };

  const convertTo24Hour = (time12h) => {
    const [time, modifier] = time12h.split(' ');

    let [hours, minutes] = time.split(':');

    if (hours === '12') {
      hours = '00';
    }

    if (modifier === 'PM') {
      hours = parseInt(hours, 10) + 12;
    }

    return `${hours}:${minutes}`;
  };

  const calculateHourDifference = (inTime, outTime) => {
    const [inHours, inMinutes] = inTime.split(':').map(parseFloat);
    const [outHours, outMinutes] = outTime.split(':').map(parseFloat);

    const hours = outHours - inHours;
    const minutes = outMinutes - inMinutes;

    return hours + minutes / 60;
  };

  const handleAutoCalculate = () => {
    calculateTotalHours();
  };

  const handleReset = () => {
    setTimeIntervals([{ inHour: '', inMinute: '', inAmPm: 'AM', outHour: '', outMinute: '', outAmPm: 'AM' }]);
    setTotalHours(0);
    setError(false);
  };

  return (
    <div>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Hour's Calculator
          </Typography>
        </Toolbar>
      </AppBar>
      <div style={{ padding: '20px' }}>
        <Grid container spacing={2}>
          {timeIntervals.map((interval, index) => (
            <React.Fragment key={index}>
              <Grid item xs={4}>
                <TextField
                  fullWidth
                  type="number"
                  label="In Hour"
                  value={interval.inHour}
                  onChange={(e) => handleInputChange(index, e)}
                  name="inHour"
                />
              </Grid>
              <Grid item xs={4}>
                <TextField
                  fullWidth
                  type="number"
                  label="In Minute"
                  value={interval.inMinute}
                  onChange={(e) => handleInputChange(index, e)}
                  name="inMinute"
                />
              </Grid>
              <Grid item xs={4}>
                <FormControl fullWidth>
                  <Select
                    value={interval.inAmPm}
                    onChange={(e) => handleInputChange(index, e)}
                    name="inAmPm"
                  >
                    <MenuItem value="AM">AM</MenuItem>
                    <MenuItem value="PM">PM</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={4}>
                <TextField
                  fullWidth
                  type="number"
                  label="Out Hour"
                  value={interval.outHour}
                  onChange={(e) => handleInputChange(index, e)}
                  name="outHour"
                />
              </Grid>
              <Grid item xs={4}>
                <TextField
                  fullWidth
                  type="number"
                  label="Out Minute"
                  value={interval.outMinute}
                  onChange={(e) => handleInputChange(index, e)}
                  name="outMinute"
                />
              </Grid>
              <Grid item xs={4}>
                <FormControl fullWidth>
                  <Select
                    value={interval.outAmPm}
                    onChange={(e) => handleInputChange(index, e)}
                    name="outAmPm"
                  >
                    <MenuItem value="AM">AM</MenuItem>
                    <MenuItem value="PM">PM</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
            </React.Fragment>
          ))}
        </Grid>
        <Button variant="contained" color="primary" onClick={addTimeInterval} style={{ marginTop: '20px' }}>
          Add Time Interval
        </Button>
        <Button variant="contained" color="success" onClick={handleAutoCalculate} style={{ marginLeft: '10px', marginTop: '20px' }}>
          Calculate Total Hours
        </Button>
        <Button variant="contained" color="secondary" onClick={handleReset} style={{ marginLeft: '10px', marginTop: '20px' }}>
          Reset
        </Button>
        {error && (
          <div style={{ color: 'red', marginTop: '10px' }}>Please fill all fields to calculate total hours</div>
        )}
        <div style={{ textAlign: 'center', fontSize: '24px', marginTop: '20px', color: totalHours >= 8.5 ? 'green' : 'red' }}>
          Total Hours: {totalHours >= 0 ? `${Math.floor(totalHours)}:${((totalHours - Math.floor(totalHours)) * 60).toFixed(0)}` : '0:00'}
        </div>
        <div style={{ textAlign: 'center', fontSize: '18px', marginTop: '10px' }}>
          {totalHours < 8.5 ? `Remaining Time: ${Math.floor(8.5 - totalHours)}:${((8.5 - totalHours - Math.floor(8.5 - totalHours)) * 60).toFixed(0)} hours` : 'You have achieved your target!'}
        </div>
      </div>
      <footer style={{ textAlign: 'center', marginTop: '20px', backgroundColor: '#f0f0f0', padding: '10px' }}>
        Created by Khilan Patel @ 2024
      </footer>
    </div>
  );
};

export default App;

