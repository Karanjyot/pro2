$(document).ready(function() {
  // Getting jQuery references to the question  body, title, form 
  var bodyInput = $("#body");
  var titleInput = $("#title");
  var qForm = $("#qForm");
  

  $(qForm).on("submit", handleFormSubmit);
  var url = window.location.search;
    var questionId;
    // Sets a flag for whether or not we're updating a post to be false initially
    var updating = false;
  
    // If we have this section in our url, we pull out the post id from the url
    // In '?post_id=1', postId is 1
    if (url.indexOf("?question_id=") !== -1) {
      questionId = url.split("=")[1];
      getQuestionData(questionId, "question");
    }
  
  
  // A function for handling what happens when the form to create a new question is submitted
  function handleFormSubmit(event) {
      event.preventDefault();
    // Wont submit the question if we are missing a body, title, or author
    if (!titleInput.val().trim() || !bodyInput.val().trim()) {
      return;
    }
    // Constructing a newQuestion object to hand to the database
    var newQuestion = {
      title: titleInput
        .val()
        .trim(),
      body: bodyInput
        .val()
        .trim(),
   
    };
    if (updating) {
      newQuestion.id = questionId;
      updateQuestion(newQuestion);
    }
    else {
      submitQuestion(newQuestion);
    }
  }

  // Submits a new Question and brings user to build question page upon completion
  function submitQuestion(newQuestion) {
    $.post("/buildquestion", newQuestion, function() {
      window.location.href = "/getquestions";
    });
  };

  function getQuestionData(questionId) {
     
    $.get('/api/getquestions', function(result) {
      if (result) {
        var i = questionId ;
        --i;
        console.log(i);
        // If this post exists, prefill our cms forms with its result
        titleInput.val(result[i].title);
        bodyInput.val(result[i].body);
        updating = true;
      }
    
    });
  }

  function updateQuestion(question) {
    $.ajax({
      method: "PUT",
      url: "/api/getquestions",
      data: question
    })
      .then(function() {
        window.location.href = "/getquestions";
      });
  }

});