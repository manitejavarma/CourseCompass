import Paper from '@material-ui/core/Paper';
import { ViewState } from '@devexpress/dx-react-scheduler';
import {
  Scheduler,
  Resources,
  DayView,
  Appointments,
  WeekView,
  MonthView,
  AppointmentTooltip,
  Toolbar,
  ViewSwitcher,
  DateNavigator,
  TodayButton
} from '@devexpress/dx-react-scheduler-material-ui';
import { makeStyles } from '@material-ui/core/styles';
import { fade } from '@material-ui/core/styles/colorManipulator';
import Axios from 'axios';
import { useState, useEffect } from 'react';
import {
  pink, purple, teal, amber, deepOrange,
} from '@material-ui/core/colors';
//import { appointments, resourcesData } from '../demo-data/appointments';

const useStyles = makeStyles(theme => ({
  todayCell: {
    backgroundColor: fade(theme.palette.primary.main, 0.1),
    '&:hover': {
      backgroundColor: fade(theme.palette.primary.main, 0.14),
    },
    '&:focus': {
      backgroundColor: fade(theme.palette.primary.main, 0.16),
    },
  },
  weekendCell: {
    backgroundColor: fade(theme.palette.action.disabledBackground, 0.04),
    '&:hover': {
      backgroundColor: fade(theme.palette.action.disabledBackground, 0.04),
    },
    '&:focus': {
      backgroundColor: fade(theme.palette.action.disabledBackground, 0.04),
    },
  },
  today: {
    backgroundColor: fade(theme.palette.primary.main, 0.16),
  },
  weekend: {
    backgroundColor: fade(theme.palette.action.disabledBackground, 0.06),
  },
}));

const TimeTableCell = (props) => {
  const classes = useStyles();
  const { startDate } = props;
  const date = new Date(startDate);
  if (date.getDate() === new Date().getDate()) {
    return <WeekView.TimeTableCell {...props} className={classes.todayCell} />;
  } if (date.getDay() === 0 || date.getDay() === 6) {
    return <WeekView.TimeTableCell {...props} className={classes.weekendCell} />;
  } return <WeekView.TimeTableCell {...props} />;
};

const DayScaleCell = (props) => {
  const classes = useStyles();
  const { startDate, today } = props;

  if (today) {
    return <WeekView.DayScaleCell {...props} className={classes.today} />;
  } if (startDate.getDay() === 0 || startDate.getDay() === 6) {
    return <WeekView.DayScaleCell {...props} className={classes.weekend} />;
  } return <WeekView.DayScaleCell {...props} />;
};

const TimeTableCellMonth = (props) => {
  const classes = useStyles();
  const { startDate } = props;
  const date = new Date(startDate);

  if (date.getDate() === new Date().getDate()) {
    return <MonthView.TimeTableCell {...props} className={classes.todayCell} />;
  } if (date.getDay() === 0 || date.getDay() === 6) {
    return <MonthView.TimeTableCell {...props} className={classes.weekendCell} />;
  } return <MonthView.TimeTableCell {...props} />;
};

const DayScaleCellMonth = (props) => {
  const classes = useStyles();
  const { startDate, today } = props;

  if (today) {
    return <MonthView.DayScaleCell {...props} className={classes.today} />;
  } if (startDate.getDay() === 0 || startDate.getDay() === 6) {
    return <MonthView.DayScaleCell {...props} className={classes.weekend} />;
  } return <MonthView.DayScaleCell {...props} />;
};

export default function Schedular() {
  const [appointments, setAppointments] = useState([]);
  const [resourcesData, setResourcesData] = useState([]);
  const resources = [{
    fieldName: 'roomId',
    title: 'Room',
    instances: resourcesData,
  }];

  useEffect(() => {
    async function fetchData() {
      await Axios.get("http://localhost:2000/api/schedule/1").then((res) => {
        const data = res.data.courseInfo;
        console.log(res.data.courseInfo);

        const app = [{
          id: 0,
          title: 'Final exams',
          roomId: 0,
          members: [2, 3],
          startDate: new Date(2021, 6, 18, 12, 0),
          endDate: new Date(2021, 6, 18, 13, 35),
          rRule: 'FREQ=WEEKLY;BYDAY=MO,WE;WKST=TU;INTERVAL=3;COUNT=2'
        }];

        const resource = [{
          text: 'Room 103',
          id: 0,
          color: teal,
        }];
        setAppointments(app);
        setResourcesData(resource);
      });
    }
    fetchData();
  }, []);

  const date = new Date();
  const day = date.getDate();
  const month = date.getMonth() + 1;
  const year = date.getFullYear();

  return (
    <Paper elevation={10}>
      <Scheduler data={appointments} height={600}>
        <ViewState defaultCurrentDate={year + " " + month + " " + day} />

        <WeekView timeTableCellComponent={TimeTableCell} dayScaleCellComponent={DayScaleCell} startDayHour={9} endDayHour={17} />

        <DayView startDayHour={9} endDayHour={17} />

        <MonthView timeTableCellComponent={TimeTableCellMonth} dayScaleCellComponent={DayScaleCellMonth} />

        <Appointments />

        <AppointmentTooltip />

        <Resources data={resources} mainResourceName="roomId" />

        <Toolbar />

        <DateNavigator />

        <TodayButton />

        <ViewSwitcher />
      </Scheduler>
    </Paper>
  );
}
