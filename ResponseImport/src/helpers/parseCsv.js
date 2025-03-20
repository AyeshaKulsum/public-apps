import Papa from 'papaparse';

const parse = async (file, setSample, setHeaders, threshold) => {
  return new Promise((resolve, reject)=>{
    let headers = [];
  const sample = {};
  let rowsCount = 0;
  Papa.parse(file, {
    skipEmptyLines: true,
    header: true,
    step: (row) => {
      try {
        rowsCount += 1;
        headers = row.meta.fields;
        if (row.data) {
          const data = row.data;
          for (const field of Object.keys(data)) {
            if (data[field] && data[field].trim()) {
              sample[field] = sample[field] || {};
              const count = sample[field].count || 0;
              if (count < 3) { // 3 Samples for each keys
                sample[field].data = [
                  ...(sample[field].data || []),
                  data[field].trim(),
                ];
              }
              sample[field].count = count + 1;
            }
          }
        }
      } catch (err) {
        console.log('Unable to parse the row', row, err);
      }
    },
    complete: () => {
      if (rowsCount > threshold) {
        window.client.interface.alertMessage(`The CSV file Should not have more than ${threshold} rows`, { type: "failure" });
        setHeaders([]);
        setSample({});
        resolve(false);
      }
      else {
        for(let i=0; i< headers.length; i++){
          headers[i] = headers[i].trim();
        }
        Object.keys(sample).forEach((key) => {
          const trimmedKey = key.trim();
          if (key !== trimmedKey) {
            sample[trimmedKey] = sample[key];
            delete sample[key];
          }
        });
        setHeaders(headers);
        setSample(sample);
        resolve(true);
      }
    },
  });
  })
  
}

export default parse;