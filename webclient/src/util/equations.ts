export const calcAvg = (arr : any, value : any) => {
  let avg = 0;
  for (let index = 0; index < arr.length; index++) {
    avg += arr[index][value];
  }
  return avg / arr.length
}

export const calcSTD = (arr : any, value : any) => {
  let avg = 0;
  for (let index = 0; index < arr.length; index++) {
    avg += arr[index][value];
  }
  avg = avg / arr.length

  const diffMeans = [];

  for (let index = 0; index < arr.length; index++) {
    diffMeans.push(Math.pow((arr[index][value] - avg),2));
  }

  let newAvg = 0;

  for (let index = 0; index < diffMeans.length; index++) {
    newAvg += diffMeans[index];
  }

  newAvg = newAvg / diffMeans.length;

  return Math.sqrt(newAvg).toFixed(2);

}
