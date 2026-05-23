async function login() {

    const regNo =
        document.getElementById("regNo").value;

    const section =
        document.getElementById("section").value;

    const message =
        document.getElementById("message");

    if (!regNo || !section) {

        message.innerText =
            "Fill all fields";

        return;
    }

    const response = await fetch("/login", {

        method: "POST",

        headers: {
            "Content-Type": "application/json"
        },

        body: JSON.stringify({
            regNo,
            section
        })
    });

    const data = await response.json();

    if (data.success) {

        localStorage.setItem(
            "student",
            JSON.stringify(data.student)
        );

        window.location.href =
            "selection.html";

    } else {

        message.innerText =
            data.message;
    }
}



const student =
    JSON.parse(localStorage.getItem("student"));

if (
    student &&
    document.getElementById("studentDetails")
) {

    document.getElementById(
        "studentDetails"
    ).innerHTML = `

        <p><b>Name:</b> ${student.name}</p>

        <p><b>Register Number:</b>
        ${student.regNo}</p>

        <p><b>Section:</b>
        ${student.section}</p>
    `;

    // Already Submitted Check
    if (student.submitted === 1) {

        document.getElementById(
            "priority1"
        ).disabled = true;

        document.getElementById(
            "priority2"
        ).disabled = true;

        document.querySelector(
            "button"
        ).disabled = true;

        document.getElementById(
            "message"
        ).innerText =
            "You have already submitted";
    }
}

async function submitSelection() {

    const priority1 =
        document.getElementById(
            "priority1"
        ).value;

    const priority2 =
        document.getElementById(
            "priority2"
        ).value;

    const message =
        document.getElementById(
            "message"
        );

    if (!priority1 || !priority2) {

        message.innerText =
            "Select both priorities";

        return;
    }

    if (priority1 === priority2) {

        message.innerText =
            "Priorities cannot be same";

        return;
    }

    const response =
        await fetch("/submit", {

        method: "POST",

        headers: {
            "Content-Type":
                "application/json"
        },

        body: JSON.stringify({

            regNo: student.regNo,

            priority1,

            priority2
        })
    });

    const data =
        await response.json();

    if (data.success) {

        message.style.color =
            "green";

        message.innerText =
            "Submitted Successfully";

        document.getElementById(
            "priority1"
        ).disabled = true;

        document.getElementById(
            "priority2"
        ).disabled = true;

        document.querySelector(
            "button"
        ).disabled = true;

    } else {

        message.innerText =
            data.message;
    }
}