const username = localStorage.getItem('username');
const password = localStorage.getItem('password');

let diagram = [];
let diagram1 = [];
let pie = [];

fetch(`http://127.0.0.1:5000/students/${username}`, {
  method: 'GET',
  headers: {
    'Authorization': 'Basic ' + btoa(username + ':' + password)
  }
})
.then((data)=>{
    return data.json();
})
.then((grades)=>{
    for (let i = 0; i < grades.length; i++)
    {
    let subject = grades[i].SubjectId;
    let teacher = grades[i].TeacherId;
    let mark = grades[i].Value;
    let date = grades[i].DateId;

    const dateEntry = diagram1.find(entry => entry.dates[0] === date);        
    if (dateEntry) {
      dateEntry.marks.push(mark);
    } else {
      diagram1.push({ dates: [date], marks: [mark]});
    }

    const subjectEntry = diagram.find(entry => entry.subjectId === subject);        
        if (subjectEntry) {
            subjectEntry.marks.push(mark);
        } else {
            diagram.push({ subjectId: subject, marks: [mark] });
        }

        const teacherEntry = pie.find(entry => entry.teacherId === teacher);        
        if (!teacherEntry) {
            pie.push({ teacherId: teacher, count: 1 });
        } else {
            teacherEntry.count++;
        }
    }
    
const pieData = {
    labels: pie.map(entry => entry.teacherId),
    datasets: [{
      label: 'Teachers',
      data: pie.map(entry => entry.count),
      backgroundColor: [
        'rgba(255, 99, 132, 0.5)',
        'rgba(54, 162, 235, 0.5)',
        'rgba(255, 206, 86, 0.5)',
        'rgba(75, 192, 192, 0.5)',
        'rgba(153, 102, 255, 0.5)',
        'rgba(255, 159, 64, 0.5)'
      ],
      borderWidth: 1
    }]
  };
  
const pieOptions = {
    responsive: true,
    plugins: {
        legend: {
            position: 'top',
        },
        title: {
            display: true,
            text: 'Statistics of evaluating teachers'
        }
    }
};
  
const ctx3 = document.getElementById('chart3').getContext('2d');
const myPieChart = new Chart(ctx3, {
    type: 'pie',
    data: pieData,
    options: pieOptions
});


    const subjects = diagram.map(entry => entry.subjectId);

    const marks = diagram.map(item => item.marks);

    const marks1 = diagram1.map(item => item.marks);

    const dates_d1 = diagram1.map(item => item.dates);
    let averege = [];
    for(let i = 0;i<marks.length;i++){

        let tmp = marks[i].map(Number);
        let sum = tmp.reduce((acc, val) => acc + val, 0);
        let avg = sum / marks[i].length;
        averege.push(avg);
    }
 
    let averege1 = [];
    for(let i = 0;i<marks1.length;i++){

        let tmp = marks1[i].map(Number);
        let sum = tmp.reduce((acc, val) => acc + val, 0);
        let avg = sum / marks1[i].length;
        averege1.push(avg);
    }

    
const histogramData = {
    labels: subjects,
    datasets: [{
      label: 'Avarage grades by subjects',
      data: averege,
      backgroundColor: 'rgba(54, 162, 235, 0.2)',
      borderColor: 'rgba(54, 162, 235, 1)',
      borderWidth: 1
    }]
  };
  
  const histogramOptions = {
    scales: {
      y: {
        beginAtZero: true
      }
    }
  };
  
  const ctx = document.getElementById('chart1').getContext('2d');
  const myChart = new Chart(ctx, {
    type: 'bar',
    data: histogramData,
    options: histogramOptions
  });


     
const histogramData1 = {
    labels: dates_d1,
    datasets: [{
      label: 'Avarage grades by dates',
      data: averege1,
      backgroundColor: 'rgba(54, 162, 235, 0.2)',
      borderColor: 'rgba(54, 162, 235, 1)',
      borderWidth: 1
    }]
  };
  
  const histogramOptions1 = {
    scales: {
      y: {
        beginAtZero: true
      }
    }
  };
  
  const ctx1 = document.getElementById('chart2').getContext('2d');
  const myChart1 = new Chart(ctx1, {
    type: 'bar',
    data: histogramData1,
    options: histogramOptions1
  });
  
  })
 .catch(error => console.error(error));


 



