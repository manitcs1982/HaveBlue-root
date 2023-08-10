export const formatDate = ( dateString : any) => {
  var tempDate = new Date(dateString);
  var date = tempDate.getFullYear() + '-';

  if ((tempDate.getMonth()+1) < 10 ) {
    date = date + '0' + (tempDate.getMonth()+1) + '-';
  } else {
    date = date + (tempDate.getMonth()+1) + '-';
  }

  if (tempDate.getDate() < 10) {
    date = date + '0' + tempDate.getDate() +' ';
  } else {
    date = date + tempDate.getDate() +' ';
  }

  if (tempDate.getHours() < 10) {
    date = date + '0' + tempDate.getHours() +':';
  } else {
    date = date + tempDate.getHours() +':';
  }

  if (tempDate.getMinutes() < 10) {
    date = date + '0' + tempDate.getMinutes();
  } else {
    date = date + tempDate.getMinutes();
  }

  return date;
}
