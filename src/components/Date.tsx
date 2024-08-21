import React, { FC } from 'react'

interface IProps {
    date: string; // Assuming 'date' is a string, you can adjust the type accordingly
    onSelectDate: (date: string) => void; // Assuming onSelectDate is a function that takes a string parameter
    selected: boolean;
  
}

/**
* @author
* @function @Date

**/
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native'
import moment from 'moment'

const Date: FC<IProps> = ({ date, onSelectDate, selected }) => {
  const isToday = moment(date).isSame(moment(), 'day');
  const day = isToday ? 'Today' : moment(date).format('ddd');
  const dayNumber = moment(date).format('D');
  const fullDate = moment(date).format('YYYY-MM-DD');

  return (
    <TouchableOpacity
      onPress={() => onSelectDate(fullDate)}
      style={[
        styles.card,
        isToday && { backgroundColor: 'salmon' }, // Fix typo here
        selected.toString() === fullDate && { backgroundColor: "#6146c6" }
      ]}
      
    >
      <Text
        style={[styles.big, selected === true && { color: "#fff" }]}
      >
        {day}
      </Text>
      <View style={{ height: 10 }} />
      <Text
        style={[
          styles.medium,
          selected.toString() === fullDate && { color: "black", fontWeight: 'bold', fontSize: 24 },
        ]}
      >
        {dayNumber}
      </Text>
    </TouchableOpacity>
  )
}



const styles = StyleSheet.create({
  card: {
    backgroundColor: 'slategray',
    borderRadius: 10,
    borderColor: 'black',
    padding: 10,

    alignItems: 'center',
    height: 90,
    width: 80,
    marginHorizontal: 5,
  },
  big: {
    fontWeight: 'bold',
    fontSize: 22,
  },
  medium: {
    fontSize: 18,
  },
})


 

export default Date;