/* =========================================
   GOOGLE SHEET CONFIG
========================================= */

const SPREADSHEET_ID =
"1Jy2AtIPFJmz6nLao5wzvsLt0f7TTYFNi8XWDqhEXME4";

/* =========================================
   SHEET NAMES
========================================= */

const courses = [

    {
        name:"AWS",
        gid:"1607824551"
    },

    {
        name:"Cyber Security",
        gid:"578817017"
    },

    {
        name:"SQL for data analytics",
        gid:"1330432124"
    },

    {
        name:"Power Bi",
        gid:"1604268348"
    }
];


/* =========================================
   GLOBAL VARIABLES
========================================= */

let allStudents = [];

let currentCourse = "AWS";

let currentBatch = "All";

/* =========================================
   FETCH GOOGLE SHEETS DATA
========================================= */


async function fetchCourseData(course){

    try{

        const url =
        `https://docs.google.com/spreadsheets/d/${SPREADSHEET_ID}/gviz/tq?tqx=out:json&gid=${course.gid}`;

        const response = await fetch(url);

        const text = await response.text();

        const json =
        JSON.parse(text.substring(47).slice(0,-2));

        const rows =
        json.table.rows.filter(
            row => row.c && row.c[1]
        );

        const students = rows.map((row)=>{

            const cells = row.c;

            return{

                sno:
                cells[0]?.v || "",

                regno:
                String(cells[1]?.v || "").trim(),

                name:
                String(cells[2]?.v || "").trim(),

                section:
                String(cells[3]?.v || "").trim(),

                course:
                course.name,

                batch:
                String(cells[5]?.v || "").trim()
            };

        });

        return students;

    }catch(error){

        console.error(
            `Error loading ${course.name}:`,
            error
        );

        return [];
    }
}


const batchDetails = {

    "AWS-Batch 1": {
        date: "18th to 20th June 2026",
        venue: "Lan Room"
    },

    "AWS-Batch 2": {
        date: "22nd to 24th June 2026",
        venue: "Lan Room"
    },

    "Cyber Security-Batch 1": {
        date: "8th to 10th June 2026",
        venue: "Auditorium"
    },

    "Cyber Security-Batch 2": {
        date: "11th to 13th June 2026",
        venue: "Auditorium"
    },

    "SQL for data analytics-Batch 1": {
        date: "15th to 17th June 2026",
        venue: "Lan Room"
    },

    "SQL for data analytics-Batch 2": {
        date: "22nd to 24th June 2026",
        venue: "Auditorium"
    },

    "Power Bi-Batch 1": {
        date: "8th to 10th June 2026",
        venue: "Lan Room"
    },

    "Power Bi-Batch 2": {
        date: "11th to 13th June 2026",
        venue: "Lan Room"
    }

};


/* =========================================
   LOAD ALL COURSES
========================================= */

async function loadAllCourses(){

    const promises =
    courses.map(course =>
        fetchCourseData(course)
    );

    const results =
    await Promise.all(promises);

    allStudents =
    results.flat();

    document 
    .getElementById("loading") 
    .style.display = "none";

    renderTable();
}

/* =========================================
   RENDER TABLE
========================================= */

function renderTable(){


    const tableBody =
    document.getElementById("tableBody");

    tableBody.innerHTML = "";

    let filteredStudents =
    allStudents.filter(student =>
        student.course === currentCourse
    );

    if(currentBatch !== "All"){

        filteredStudents =
        filteredStudents.filter(student =>
            student.batch === currentBatch
        );
    }

    const infoDiv =
document.getElementById("batchInfo");

if(currentBatch !== "All"){

    const key =
    `${currentCourse}-${currentBatch}`;




    const details =
    batchDetails[key];

    if(details){


infoDiv.innerHTML = `

    <div class="info-item">
        📚 <strong>Course:</strong> ${currentCourse}
    </div>

    <div class="info-item">
        👥 <strong>Batch:</strong> ${currentBatch}
    </div>

    <div class="info-item">
        📅 <strong>Date:</strong> ${details.date}
    </div>

    <div class="info-item">
        📍 <strong>Venue:</strong> ${details.venue}
    </div>

`;


    }

}else{

    infoDiv.innerHTML = "";
}

    if(filteredStudents.length === 0){

        tableBody.innerHTML = `
            <tr>
                <td colspan="5"
                    style="
                        text-align:center;
                        padding:25px;
                        font-weight:600;
                    ">
                    No Students Found
                </td>
            </tr>
        `;

        return;
    }

    filteredStudents.forEach(student => {

        const row =
        document.createElement("tr");

        row.setAttribute(
            "data-regno",
            student.regno
        );

        row.innerHTML = `

            <td>${student.sno}</td>

            <td>${student.regno}</td>

            <td>${student.name}</td>

            <td>${student.section}</td>

            <td>${student.batch}</td>

        `;

        tableBody.appendChild(row);
    });





}



/* =========================================
   COURSE BUTTONS
========================================= */

const courseButtons =
document.querySelectorAll(".course-btn");

courseButtons.forEach(button => {

    button.addEventListener("click",()=>{

        courseButtons.forEach(btn =>
            btn.classList.remove("active")
        );

        button.classList.add("active");

        currentCourse =
        button.dataset.course;

        renderTable();
    });

});

/* =========================================
   BATCH BUTTONS
========================================= */

const batchButtons =
document.querySelectorAll(".batch-btn");

batchButtons.forEach(button => {

    button.addEventListener("click",()=>{

        batchButtons.forEach(btn =>
            btn.classList.remove("active")
        );

        button.classList.add("active");

        currentBatch =
        button.dataset.batch;

        renderTable();
    });

});

/* =========================================
   SEARCH SYSTEM
========================================= */

const searchBtn =
document.getElementById("searchBtn");

searchBtn.addEventListener("click", searchStudent);

document
.getElementById("searchInput")
.addEventListener("keypress",(e)=>{

    if(e.key === "Enter"){

        searchStudent();
    }
});

/* =========================================
   SEARCH FUNCTION
========================================= */

function searchStudent(){

    const regno =
    document
    .getElementById("searchInput")

.value.replace(/\s+/g,'').trim();



    if(regno === ""){

        alert(
            "Please enter register number"
        );

        return;
    }

    const student =
    allStudents.find(student =>
        student.regno.includes(regno)
    );

    if(!student){

        alert(
            "Student not found"
        );

        return;
    }

    /* AUTO SELECT COURSE */

    currentCourse =
    student.course;

    courseButtons.forEach(btn => {

        btn.classList.remove("active");

        if(
            btn.dataset.course ===
            student.course
        ){

            btn.classList.add("active");
        }
    });

    /* AUTO SELECT BATCH */

    currentBatch =
    student.batch;

    batchButtons.forEach(btn => {

        btn.classList.remove("active");

        if(
            btn.dataset.batch ===
            student.batch
        ){

            btn.classList.add("active");
        }
    });

    renderTable();

    /* WAIT FOR TABLE RENDER */

    setTimeout(()=>{

        const row =
        document.querySelector(
            `[data-regno="${regno}"]`
        );

        if(row){

            row.classList.add(
                "highlight-row"
            );

            row.scrollIntoView({

                behavior:"smooth",

                block:"center"
            });

            setTimeout(()=>{

                row.classList.remove(
                    "highlight-row"
                );

            },6000);
        }

    },200);
}

/* =========================================
   INITIAL LOAD
========================================= */

loadAllCourses();
