$(document).ready(function() {
  /* global moment */
  //questionContainer holds all of our questions
  var questionContainer = $(".question-container");
  $(document).on("click", "button.delete", handleQuestionDelete);
  $(document).on("click", ".answer-button", handleAnswerPost);
  $(document).on("click", ".view-answers", getAnswers);
  $(document).on("click", ".hide-answers", hideAnswers);
  $(document).on("click", "button.edit", handleQuestionEdit);
  function hideAnswers() {
    $(".answer-div").hide();
  }
  function getAnswers() {
    $(".answer-div").empty();
    $(".answer-div").show();
    $.get("/api/answers").then(function(data) {
      data.forEach(element => {
        console.log(element);
        $(".answer-div").append(element.id + ": " + element.answer + "<br>");
      });
    });
    //show answer div
  }
  var askQuestion = $("#btn-question");
  $(askQuestion).on("click", getQuestions);
  // Variable to hold our questions
  var questions;
  var url = window.location.search;
  var questionId;
  if (url.indexOf("?question_id=") !== -1) {
    questionId = url.split("=")[1];
    getQuestions(questionId);
  }
  // If there's no questionId we just get all questions as usual
  else {
    getQuestions();
  }
  // This function grabs questions from the database and updates the view
  function getQuestions(question) {
    console.log("get questions");
    questionId = question || "";
    if (questionId) {
      questionId = "/?question_id=" + questionId;
    }
    $.get("/api/getquestions" + questionId).then(function(data) {
      console.log("Questions", data);
      questions = data;
      if (!questions || !questions.length) {
        displayEmpty(question);
      } else {
        initializeRows();
      }
    });
  }
  //This function does an API call to delete question
  function deleteQuestion(id) {
    $.ajax({
      method: "DELETE",
      url: "/getquestions/" + id
    }).then(function() {
      getQuestions();
    });
  }
  // InitializeRows handles appending all of our constructed post HTML inside questionContainer
  function initializeRows() {
    questionContainer.empty();
    var questionsToAdd = [];
    for (var i = 0; i < questions.length; i++) {
      questionsToAdd.push(createNewRow(questions[i]));
    }
    questionContainer.append(questionsToAdd);
  }
  function handleAnswerPost() {
    //create the answer form in the question body (surround in card)
    let newAnswer = {
      answer: $(".newAnswer")
        .val()
        .trim()
    };
    $.post("/api/answers", newAnswer);
    //make answer form visible when this is clicked
  }
  // This function constructs a question's HTML
  function createNewRow(question) {
    var formattedDate = new Date(question.createdAt);
    formattedDate = moment(formattedDate).format("MMMM Do YYYY, h:mm:ss a");
    var newQCard = $("<div>");
    newQCard.addClass("card");
    var newQCardHeading = $("<div>");
    newQCardHeading.addClass("card-header");
    var deleteBtn = $("<button style=float:right>");
    deleteBtn.text("x");
    deleteBtn.addClass("delete btn btn-danger");
    var editBtn = $("<button style=float:right>");
    editBtn.text("EDIT");
    editBtn.addClass("edit btn btn-info");
    var newQTitle = $("<h2>");
    var newQDate = $("<br/><h6 style=float:right>");
    var newQ = $("<h5>");
    //   newPostAuthor.text("Written by: " + question.Title);
    //   newPostAuthor.css({
    //     float: "right",
    //     color: "blue",
    //     "margin-top":
    //     "-10px"
    //   });
    var newQCardBody = $("<div>");
    newQCardBody.addClass("card-body");
    var newQBody = $("<p>");
    newQTitle.text(question.title + " ");
    newQBody.text(question.body);
    newQDate.text(formattedDate);
    newQTitle.append(newQDate);
    newQCardHeading.append(deleteBtn);
    newQCardHeading.append(editBtn);
    newQCardHeading.append(newQTitle);
    newQCardBody.append(newQBody);
    newQCard.append(newQCardHeading);
    newQCard.append(newQCardBody);
    newQCard.data("question", question);
    //creates answer form
    var ansBtn = $("<button>");
    ansBtn.text("View Answers");
    ansBtn.addClass("view-answers btn-success");
    newQCardHeading.append(ansBtn);
    var hideBtn = $("<button>");
    hideBtn.text("Hide Answers");
    hideBtn.addClass("hide-answers btn-warning");
    newQCardHeading.append(hideBtn);
    //create answer form
    //append answer here
    var ansDiv = $("<div>");
    ansDiv.addClass("answer-div card");
    var newAnsForm = $("<form>");
    // newAnsForm.attr("action", "/api/answers");
    // newAnsForm.attr("method", "post");
    //create input for answer and append it to form
    var inputAns = $("<input>");
    inputAns.addClass("newAnswer");
    newAnsForm.append(inputAns);
    //create post button and append it to form
    var postAns = $("<button>");
    postAns.text("post");
    postAns.addClass("answer-button btn-info");
    newAnsForm.append(postAns);
    //test append
    newQCard.append(newAnsForm);
    newQCard.append(ansDiv);
    //store answer on card with username and append it to the body
    //use api/answers route to acoomplish this
    return newQCard;
  }
  //This function figures out which post we want to delete and then calls deleteQuestion
  function handleQuestionDelete() {
    var currentQuestion = $(this)
      .parent()
      .parent()
      .data("question");
    deleteQuestion(currentQuestion.id);
  }
  // This function figures out which post we want to edit and takes it to the appropriate url
  function handleQuestionEdit() {
    var currentQuestion = $(this)
      .parent()
      .parent()
      .data("question");
    window.location.href = "/buildquestion?question_id=" + currentQuestion.id;
  }
  // This function displays a message when there are no posts
  function displayEmpty(id) {
    var query = window.location.search;
    var partial = "";
    if (id) {
      partial = " for Question #" + id;
    }
    questionContainer.empty();
    var messageH2 = $("<h2>");
    messageH2.css({ "text-align": "center", "margin-top": "50px" });
    messageH2.html(
      "No Question yet" +
        partial +
        ", navigate <a href='/buildquestion" +
        query +
        "'>here</a> in order to get started."
    );
    questionContainer.append(messageH2);
  }
});