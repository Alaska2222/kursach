import React from 'react';
import Chart from 'react-apexcharts'

function Piechart({labels, series})
{
    return(
         <div className="container-fluid mb-3">
                <Chart 
                type="pie"
                width={450}
                height={450}

                series={ series }                

                options={{
                        title:{ text:"Avarage grade from teacher"
                        } , 
                       noData:{text:"Empty Data"},                        
                       labels: labels,
                       legend: {
                           position: 'bottom'
                       }                     

                 }}
                >
                </Chart>
            </div>
    );
}
export default Piechart;
