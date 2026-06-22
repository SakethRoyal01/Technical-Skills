let studentData = {};

let ratings = {

    q1:0,
    q2:0,
    q3:0,
    overall:0

};


window.onload = async function(){

const regNo =
localStorage.getItem(
    "feedbackRegNo"
);

const section =
localStorage.getItem(
    "feedbackSection"
);

if(!regNo || !section){

    document.getElementById(
        "studentCard"
    ).innerHTML =
    "Student details not found";

    return;
}

document
.querySelectorAll(".stars")
.forEach(group => {

    const stars =
    group.querySelectorAll("span");

    const ratingName =
    group.dataset.rating;

    stars.forEach((star,index)=>{

        star.addEventListener(
        "click",()=>{

            ratings[ratingName] =
            index + 1;

            stars.forEach(
            (s,i)=>{

                if(i <= index){

                    s.classList.add(
                        "active"
                    );

                }else{

                    s.classList.remove(
                        "active"
                    );
                }

            });

        });

    });

});

try{

    const response =
    await fetch(
    "/feedback-login",{

        method:"POST",

        headers:{
            "Content-Type":
            "application/json"
        },

        body:JSON.stringify({

            regNo,
            section
        })
    });

    const result =
    await response.json();

    if(!result.success){

        document.getElementById(
            "studentCard"
        ).innerHTML =
        result.message;

        return;
    }

    studentData = {

        regNo:
        result.student.regNo,

        name:
        result.student.name,

        section:
        result.student.section,

        courseBatch:
        "Technical Skill-I"
    };

    document.getElementById(
        "studentCard"
    ).innerHTML = `

        <h3>${studentData.name}</h3>

        <p>
        Register No:
        ${studentData.regNo}
        </p>

        <p>
        Section:
        ${studentData.section}
        </p>

    `;

}

catch(error){

    console.log(error);

    document.getElementById(
        "studentCard"
    ).innerHTML =
    "Unable to load student details";
}

};

async function submitFeedback(){

const data = {

    regNo:
    studentData.regNo,

    name:
    studentData.name,

    section:
    studentData.section,

    courseBatch:
    studentData.courseBatch,

    qualityRating:
ratings.q1,

contentRelevance:
ratings.q2,

knowledgeImprovement:
ratings.q3,

usefulTopic:
document.getElementById(
"usefulTopic"
).value,

suggestions:
document.getElementById(
"suggestions"
).value,

trainerFeedback:
document.getElementById(
"trainerFeedback"
).value,

overallRating:
ratings.overall
};

const response =
await fetch(
"/submit-feedback",{

    method:"POST",

    headers:{
        "Content-Type":
        "application/json"
    },

    body:
    JSON.stringify(data)
});

const result =
await response.json();

alert(
    result.message
);

}
