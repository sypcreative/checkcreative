export default function blogFilters() {
  const container = document.getElementById("blog-posts-container");
  const loadMoreBtn = document.getElementById("load-more-posts");
  const noMoreMsg = document.getElementById("no-more-posts-msg");
  const filterButtons = document.querySelectorAll(".filter-btn");
  const allBtn = document.querySelector('.filter-btn[data-filter="all"]');

  if (!container || !loadMoreBtn || !noMoreMsg || !filterButtons.length) {
    return;
  }

  let currentPage = 1;
  let activeFilters = [];

  function loadPosts(page = 1, categories = []) {
    const data = new URLSearchParams();
    data.append("action", "load_filtered_posts");
    data.append("paged", page);
    data.append("category", categories.join(","));

    fetch(checkcreative_ajax.ajaxUrl, {
      method: "POST",
      body: data,
    })
      .then((res) => res.json())
      .then((response) => {
        const { html, empty } = response;

        if (page === 1) {
          container.innerHTML = html;
          noMoreMsg.classList.add("d-none");
        } else {
          container.insertAdjacentHTML("beforeend", html);
        }

        if (empty) {
          noMoreMsg.classList.remove("d-none");
          loadMoreBtn.style.display = "none";
        } else {
          noMoreMsg.classList.add("d-none");
          loadMoreBtn.style.display = "";
        }
      });
  }

  filterButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      const filter = btn.dataset.filter;

      if (filter === "all") {
        filterButtons.forEach((b) =>
          b.classList.remove("active", "bg-primary", "text-pink")
        );
        btn.classList.add("active", "bg-primary", "text-pink");
        activeFilters = [];
      } else {
        const isActive = btn.classList.contains("active");
        if (isActive) {
          btn.classList.remove("active", "bg-primary", "text-pink");
          activeFilters = activeFilters.filter((f) => f !== filter);
        } else {
          btn.classList.add("active", "bg-primary", "text-pink");
          activeFilters.push(filter);
        }

        if (activeFilters.length === 0) {
          allBtn.classList.add("active", "bg-primary", "text-pink");
        } else {
          allBtn.classList.remove("active", "bg-primary", "text-pink");
        }
      }

      currentPage = 1;
      loadPosts(currentPage, activeFilters);
    });
  });

  loadMoreBtn.addEventListener("click", () => {
    currentPage++;
    loadPosts(currentPage, activeFilters);
  });
}
