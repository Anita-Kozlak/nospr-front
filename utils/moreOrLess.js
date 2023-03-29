  export const moreOrLess = (event) => {
      if (
        event.target.previousElementSibling.lastChild.previousElementSibling
          .style.display === "none"
      ) {
        event.target.previousElementSibling.lastChild.previousElementSibling.style.display =
          "inline";
        event.target.innerHTML = "więcej";
        event.target.previousElementSibling.lastChild.style.display = "none";
      } else {
        event.target.previousElementSibling.lastChild.previousElementSibling.style.display =
          "none";
        event.target.innerHTML = "mniej";
        event.target.previousElementSibling.lastChild.style.display = "inline";
      }
    }
  