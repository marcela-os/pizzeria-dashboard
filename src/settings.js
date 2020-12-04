export const api = {
  url: '//' + window.location.hostname + (window.location.hostname === 'localhost' ? ':3131' : ''),  //lub ':3131/api' jeśli nie dodam w thunk creators w tablesRedux /api/
  tables: 'tables',
  products: 'products',
  order: 'order',
  booking: 'booking',
  event: 'event',
  dateStartParamKey: 'date_gte',
  dateEndParamKey: 'date_lte',
  notRepeatParam: 'repeat=false',
  repeatParam: 'repeat_ne=false',
};
