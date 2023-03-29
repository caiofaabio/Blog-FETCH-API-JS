const url = "https://jsonplaceholder.typicode.com/posts";

const loadingEl = document.querySelector("#loading");
const postsContainer = document.querySelector("#posts-container");

const postPage = document.querySelector("#post");
const postContainer = document.querySelector("#post-container");
const commentsContainer = document.querySelector("#comments-container");

const commentForm = document.querySelector("#comment-form");
const emailInput = document.querySelector("#email");
const bodyInput = document.querySelector("#body");

// get id from url
// sempre que retorna uma URL ela tem que ser maiuscula se não o código não funciona
const urlSearchParams = new URLSearchParams(window.location.search);
const postId = urlSearchParams.get("id");

// get all posts = pegar todos os posts
async function getAllPosts() {
  const response = await fetch(url);
  // aqui estamos esperando oq a url tras no end-point
  console.log(response);

  // geralmente o nome é data ou o nome doq esta mexendo tipo posts
  const data = await response.json();
  console.log(data);

  loadingEl.classList.add("hide");

  // o nome é sempre no singular
  data.map((post) => {
    const div = document.createElement("div");
    const title = document.createElement("h2");
    const body = document.createElement("p");
    const link = document.createElement("a");

    title.innerText = post.title;
    body.innerText = post.body;
    link.innerText = "Ler";
    link.setAttribute("href", `/post.html?id=${post.id}`);

    div.appendChild(title);
    div.appendChild(body);
    div.appendChild(link);

    postsContainer.appendChild(div);
  });
}

// get individual post
async function getPost(id) {
  const [responsePost, responseComments] = await Promise.all([
    fetch(`${url}/${id}`),
    fetch(`${url}/${id}/comments`),
  ]);

  const dataPost = await responsePost.json();
  const dataComments = await responseComments.json();

  loadingEl.classList.add("hide");
  postPage.classList.remove("hide");

  const title = document.createElement("h1");
  const body = document.createElement("p");

  title.innerText = dataPost.title;
  body.innerText = dataComments.body;

  postContainer.appendChild(title);
  postContainer.appendChild(body);

  console.log(dataComments);

  dataComments.map((comment) => {
    createComments(comment);
  });
}

function createComments(comment) {
  const div = document.createElement("div");
  const email = document.createElement("h3");
  const commentBody = document.createElement("p");

  email.innerText = comment.email;
  commentBody.innerText = comment.body;

  div.appendChild(email);
  div.appendChild(commentBody);

  commentsContainer.appendChild(div);
}

// post a comment
async function postComment(comment) {
  const response = await fetch(`${url}/${postId}/comments`, {
    method: "POST",
    body: comment,
    headers: {
      "Content-type": "application/json",
    },
  });

  const data = await response.json();

  createComments(data);
}

if (!postId) {
  getAllPosts();
} else {
  getPost(postId);

  // add event to comment form
  commentForm.addEventListener("submit", (ev) => {
    ev.preventDefault();

    let comment = {
      email: emailInput.value,
      body: bodyInput.value,
    };

    // converte ele em json e passa ele como argumento
    comment = JSON.stringify(comment);

    postComment(comment);
  });
}
