import Block, { BlockProps } from '@components/Block/Block';
import Typography from '@components/Typography/Typography';
import { getDateFromTimeZone, getHoursAndMinutes } from '@core/utils/date';
import React from 'react';

interface TimeZoneRowProps extends BlockProps {
  name: string;
  offset: string;
  utc: string;
}

const TimeZoneRow: React.FC<TimeZoneRowProps> = (props) => {
  const { name, offset, utc, ...restProps } = props;

  const currentTime = getHoursAndMinutes(getDateFromTimeZone(utc));

  return (
    <Block pV="xl" flexDirection="row" justify="space-between" align="center" {...restProps}>
      <Block maxWidth="80%">
        <Typography>{name}</Typography>
        <Typography>{offset}</Typography>
      </Block>
      <Typography>
        {currentTime.hours}:{currentTime.minutes} {currentTime.window}
      </Typography>
    </Block>
  );
};

export default TimeZoneRow;
