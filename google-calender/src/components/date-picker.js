import {
  Box,
  Button,
  Text,
  Flex,
  Dialog,
  DialogContent,
  Calendar,
  TimePicker,
  IconButton,
} from '@sparrowengg/twigs-react';
import { parseDate, parseTime } from '@internationalized/date';
import React, { useState } from 'react';
import dayjs from 'dayjs';
import { CloseIcon } from '@sparrowengg/twigs-react-icons';


export function DatePicker(props) {
  const {
    minValue,
    isOpen,
    resetModal,
    type,
    date,
    time,
    handleSaveData
  } = props;
  const [selectedDate, setSelectedDate] = useState(
    parseDate(
      date ? dayjs(date).format('YYYY-MM-DD') : dayjs().format('YYYY-MM-DD')
    )
  );
  const [selectedTime, setSelectedTime] = useState(
    parseTime(time || dayjs().format('hh:mm a'))
  );

  const handleSave = () => {
    const currentDate = selectedDate?.toString();
      handleSaveData(dayjs(`${currentDate} ${selectedTime}`).format(), type);
  };
  return (
    <Dialog open={isOpen}>
      <DialogContent
        onEscapeKeyDown={resetModal}
        onInteractOutside={resetModal}
        css={{
          width: '450px',
          borderRadius: '20px',
          padding: 0 
        }}
      >
        <Flex
          flexDirection='column'
          justifyContent='space-between'
        >
          <Flex justifyContent='space-between' alignItems='center' css={{padding: "$6 $10", borderBottom: '$borderWidths$xs solid $neutral200'}}>
            <Text size="lg" weight="medium">{`Enter the ${type} date`}</Text>
            <IconButton
              css={{ cursor: "pointer" }}
              onClick={() => resetModal()}
              size="lg"
              color="default"
              icon={<CloseIcon size={24} />}
            />
          </Flex>
          <Box
            css={{
              width: '100%',
              padding: "$10",
              height: 260,
              overflowY: 'auto'
            }}
          >
            <Calendar
              minValue={minValue}
              onChange={setSelectedDate}
              value={selectedDate}
            />
            <Flex justifyContent='center' css={{ marginTop: "$6" }}>
            <TimePicker
                onChange={setSelectedTime}
                hourCycle={12}
                granularity="minute"
                value={selectedTime}
              />
            </Flex>
          </Box>
          <Flex
            justifyContent='flex-end'
            css={{
              borderTop: '$borderWidths$xs solid $neutral200',
              padding: '$6 $12',
            }}
          >
          <Button color="primary" size="lg" onClick={handleSave}>
            Save
          </Button>
          </Flex>
        </Flex>
      </DialogContent>
    </Dialog>
  );
}
