import React, {FC, useState, useEffect} from 'react';
import {StyleSheet, Text, View, ScrollView} from 'react-native';
import moment, {Moment} from 'moment';
import DateComponent from './Date';

interface IProps {
  onSelectDate: (date: string) => void;
  selected: boolean;
}

const Calendar: FC<IProps> = ({onSelectDate, selected}) => {
  const [dates, setDates] = useState<Moment[]>([]);
  const [scrollPosition, setScrollPosition] = useState(0);
  const [currentMonth, setCurrentMonth] = useState<any>();
  const getCurrentMonth = () => {
    const month = moment(dates[0])
      .add(scrollPosition / 60, 'days')
      .format('MMMM');
    setCurrentMonth(month);
  };

  useEffect(() => {
    getCurrentMonth();
  }, [scrollPosition]);

  const [currentYear, setCurrentYear] = useState<number | undefined>();

  const getCurrentMonthAndYear = () => {
    const firstDate = moment(dates[0]);
    const scrolledDate = firstDate.add(scrollPosition / 60, 'days');

    const month = scrolledDate.format('MMMM');
    const year = scrolledDate.format('YYYY');

    setCurrentMonth(month);
    setCurrentYear(Number(year));
  };

  useEffect(() => {
    getCurrentMonthAndYear();
  }, [scrollPosition]);

  // ...

  // get the dates from one week before today to 2 weeks from now, format them as strings and store them in state
  const getDates = () => {
    const _dates: Moment[] = [];
    const today = moment();
    const startDate = moment(today).subtract(6, 'days'); // Adjust to display 6 days before today
    const endDate = moment(today).add(7, 'days'); // Adjust to display 7 days from today
    
    let currentDate = moment(startDate);
    while (currentDate.isSameOrBefore(endDate, 'day')) {
      _dates.push(moment(currentDate));
      currentDate = currentDate.add(1, 'day');
    }
    
    setDates(_dates);
  };
  

useEffect(() => {
  getDates();
}, []);


  return (
    <>
      <View style={styles.centered}>
        <Text style={styles.title}>
          {currentMonth}, {currentYear}
        </Text>
      </View>
      <View style={styles.dateSection}>
        <View style={styles.scroll}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={true}
            scrollEventThrottle={16}
            onScroll={e => setScrollPosition(e.nativeEvent.contentOffset.x)}>
            {dates.map((date, index) => (
              <DateComponent
                key={index}
                date={date.format('YYYY-MM-DD')}
                onSelectDate={onSelectDate}
                selected={selected}
              />
            ))}
          </ScrollView>
        </View>
      </View>
    </>
  );
};

export default Calendar;

const styles = StyleSheet.create({
  centered: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'black',
    marginTop: 10,
  },
  dateSection: {
    width: '100%',
    padding: 20,
  },
  scroll: {
    height: 150,
  },
});
