import { connect } from 'react-redux';
import Waiter from './Waiter';
import { getAll, fetchFromAPI, getLoadingState, statusFromAPI} from '../../../redux/tablesRedux';

const mapStateToProps = (state) => ({
  tables: getAll(state),
  loading: getLoadingState(state),
});

const mapDispatchToProps = (dispatch) => ({
  fetchTables: () => dispatch(fetchFromAPI()),
	updateTables: (id, status) => dispatch(statusFromAPI(id, status)),
});

export default connect(mapStateToProps, mapDispatchToProps)(Waiter);
