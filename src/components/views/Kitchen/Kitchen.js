import React from 'react';
import styles from './Kitchen.module.scss';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import Button from '@material-ui/core/Button';

const demoContent = [
  {id: '123', task: 'Zio Stefano Doughnut', amount:'3', status: 'ordered', order: 123},
  {id: 'Table1', task: 'Zia Giulia Breakfast', amount:'1', status: 'prepared', order: 234},
  {id: '345', task: 'Nonna Alba Pizza', amount:'2',status: 'delivered', order: 345},
  {id: 'Bar', task: 'Nonno Alberto Salad', amount:'1',status: 'paid', order: 456},
];

const renderActions = status => {
  switch (status) {
    case 'ordered':
      return (
        <Button>ordered</Button>
      );
    case 'prepared':
      return (
        <Button>in progress</Button>
      );
		case 'delivered':
			return (
				<Button>done</Button>
			);
    case 'paid':
      return null;
    default:
      return null;
  }
};

const Kitchen = () => (
  <Paper className={styles.component}>
    <Table>
      <TableHead>
        <TableRow>
          <TableCell>Order nr. / Table nr.</TableCell>
          <TableCell>Status</TableCell>
          <TableCell>Task</TableCell>
          <TableCell>Amount</TableCell>
          <TableCell>Action</TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {demoContent.map(row => (
          <TableRow key={row.id}>
            <TableCell>
              {row.id && (
                <Button href={`${process.env.PUBLIC_URL}/waiter/order/${row.id}`}>
                  {row.id}
                </Button>
              )}
            </TableCell>
            <TableCell>
              {row.status}
            </TableCell>
            <TableCell>
              {row.task}
            </TableCell>
            <TableCell component="th" scope="row">
              {row.amount}
            </TableCell>
            <TableCell>
              {renderActions(row.status)}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  </Paper>
);


export default Kitchen;
