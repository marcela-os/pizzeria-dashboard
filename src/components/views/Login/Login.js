import React from 'react';
import styles from './Login.module.scss';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';


const Login = () => (
	<form className={styles.component} noValidate autoComplete="on">
		<Grid
		container
		direction="column"
		justify="center"
		alignItems="center"
		>
			<div>
				<TextField id="outlined-basic" label="USER" variant="outlined" />
			</div>
			<div>
				<TextField id="outlined-basic" label="PASSWORD" variant="outlined" />
			</div>
			<div>
				<Button variant="contained">SUBMIT</Button>
			</div>
		</Grid>
	</form>
);

export default Login;
