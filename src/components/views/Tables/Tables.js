import React from 'react';
import styles from './Tables.module.scss';
import TextField from '@material-ui/core/TextField';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import Button from '@material-ui/core/Button';

const demoContent = [
  {id: '12:00', table1:'booked', table2:'free', table3:'free', bar:'booked', reserve: 587},
  {id: '12:30', table1:'free', table2:'booked', table3:'free', bar:'free'},
  {id: '13:00', table1:'event', table2:'free', table3:'free', bar:'free'},
  {id: '13:30', table1:'free', table2:'free', table3:'booked', bar:'booked'},
  {id: '14:00', table1:'booked', table2:'booked', table3:'free', bar:'free'},
  {id: '14:30', table1:'free', table2:'free', table3:'free', bar:'free'},
	{id: '15:00', table1:'free', table2:'free', table3:'free', bar:'free'},
  {id: '15:30', table1:'free', table2:'free', table3:'free', bar:'free'},
  {id: '16:00', table1:'event', table2:'free', table3:'free', bar:'free'},
  {id: '16:30', table1:'free', table2:'free', table3:'free', bar:'free'},
  {id: '17:00', table1:'free', table2:'free', table3:'free', bar:'free'},
  {id: '17:30', table1:'free', table2:'free', table3:'free', bar:'free'},
	{id: '18:00', table1:'free', table2:'free', table3:'free', bar:'free'},
  {id: '18:30', table1:'free', table2:'free', table3:'free', bar:'free'},
  {id: '19:00', table1:'free', table2:'free', table3:'free', bar:'free'},
  {id: '19:30', table1:'free', table2:'free', table3:'free', bar:'free'},
  {id: '20:00', table1:'free', table2:'free', table3:'free', bar:'free'},
  {id: '20:30', table1:'free', table2:'free', table3:'free', bar:'free'},
	{id: '21:00', table1:'free', table2:'free', table3:'free', bar:'free'},
  {id: '21:30', table1:'free', table2:'free', table3:'free', bar:'free'},
  {id: '22:00', table1:'free', table2:'free', table3:'free', bar:'free'},
  {id: '22:30', table1:'free', table2:'free', table3:'free', bar:'free'},
  {id: '23:00', table1:'free', table2:'free', table3:'free', bar:'free'},
  {id: '23:30', table1:'free', table2:'free', table3:'free', bar:'free'},
];

const renderActions = status => {
  switch (status) {
    case 'free':
      return (
        null
      );
    case 'booked':
      return (
        <Button className={styles.button} variant="contained" href={`${process.env.PUBLIC_URL}/tables/booking/${status}`}>{status}</Button>
      );
		case 'event':
			return (
				<Button className={styles.button} variant="contained" href={`${process.env.PUBLIC_URL}/tables/events/${status}`}>{status}</Button>
			);
    default:
      return null;
  }
};

const Tables = () => (
	<Paper className={styles.component}>
		<TextField
			id="date"
			label="Choose date"
			type="date"
			defaultValue="2017-05-24"
			InputLabelProps={{
				shrink: true,
			}}
		/>
    <Table>
      <TableHead>
        <TableRow>
					<TableCell>Hours</TableCell>
          <TableCell>Table 1</TableCell>
          <TableCell>Table 2</TableCell>
          <TableCell>Table 3</TableCell>
          <TableCell>Bar</TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {demoContent.map(row => (
          <TableRow key={row.id}>
            <TableCell component="th" scope="row">
              {row.id}
            </TableCell>
            <TableCell>
							{renderActions(row.table1)}
            </TableCell>
            <TableCell>
							{renderActions(row.table2)}
            </TableCell>
            <TableCell>
						{renderActions(row.table3)}
            </TableCell>
						<TableCell>
						{renderActions(row.bar)}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  </Paper>
);

export default Tables;
