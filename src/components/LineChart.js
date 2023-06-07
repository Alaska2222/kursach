import React,{useState} from 'react';
import Chart from 'react-apexcharts';

function Linechart({records})
{   
    
    const dates = [...new Set(records.map(record => record.DateId))];
    const subjectIds = [...new Set(records.map(record => record.SubjectId))];

    const averagesByDate = {};

    dates.forEach(dateId => {
    const averages = {};

    subjectIds.forEach(subjectId => {
        let recordsForDateAndSubject = records.filter(record => record.DateId === dateId && record.SubjectId === subjectId);
        let averageValue = recordsForDateAndSubject.reduce((acc, record) => acc + (parseFloat(record.Value) || 0), 0) / parseFloat(recordsForDateAndSubject.length);
        if (isNaN(averageValue)){
            averageValue = 0
        }
        averages[subjectId] = averageValue;
    });

    averagesByDate[dateId] = averages;
    });
    const averagesByDateArray = Object.entries(averagesByDate).map(([dateId, averages]) => ({
        dateId,
        averages
      }));
    const result = subjectIds.map(subjectId => ({
        name: subjectId,
        data: averagesByDateArray.map(({ dateId, averages }) => averages[subjectId] ?? 0)
      }));


      const option = {
        title: { text: "Average grades by date" },
        xaxis: {
          title: { text: "Subjects" },
          categories: dates,
        },
        yaxis: {
          title: { text: "Grades" },
        },
        colors: ["#11beec", "#150B99", "#19D555"],
      };
       

    return(<React.Fragment>
        <div className='container-fluid mt-3 mb-3'>         
          <Chart type='line'
          width={500}
          height={450}
          series={result}
          options={option }
          >
          </Chart>

        </div>
    </React.Fragment>);
}

export default Linechart;