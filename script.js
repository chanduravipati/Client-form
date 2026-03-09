const ratings = {};

document.querySelectorAll(".stars").forEach(group => {

  const type = group.dataset.type;
  ratings[type] = 0;

  for (let i = 1; i <= 5; i++) {

    const star = document.createElement("span");
    star.innerHTML = "★";

    star.onclick = () => setRating(type, i, group);

    group.appendChild(star);

  }

});

function setRating(type, value, group) {

  ratings[type] = value;

  [...group.children].forEach((star, index) => {

    if (index < value) {

      if (value === 1) star.style.color = "red";
      else if (value < 5) star.style.color = "orange";
      else star.style.color = "green";

    } else {

      star.style.color = "#8a8787";

    }

  });

}

function submitFeedback() {

  const clientName = document.getElementById("clientName").value.trim();
  const suggestions = document.getElementById("suggestions").value;
  const errorMsg = document.getElementById("errorMsg");

  if (!clientName) {
    errorMsg.innerText = "Please enter your name.";
    errorMsg.style.display = "block";
    return;
  }

  for (let key in ratings) {
    if (ratings[key] === 0) {
      errorMsg.innerText = "Please rate all services.";
      errorMsg.style.display = "block";
      return;
    }
  }

  errorMsg.style.display = "none";

  const data = {
    clientName,
    quality: ratings.quality,
    value: ratings.value,
    requirement: ratings.requirement,
    timeliness: ratings.timeliness,
    suggestions
  };

  fetch("http://localhost:7000/feedback", {

    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(data)

  })
  .then(res => res.json())
  .then(result => {

    if(result.success){

      window.location.href = "thankyou.html";

    } else {

      errorMsg.innerText = result.message || "Submission failed.";
      errorMsg.style.display = "block";

    }

  })
  .catch(err => {

    console.error(err);

    errorMsg.innerText = "Server connection failed.";
    errorMsg.style.display = "block";

  });

}