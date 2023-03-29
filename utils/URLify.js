export const URLify = (string)  => {
      const urlsHttp = string.match(
        /((((ftp|https?):\/\/)|(w{3}\.))[\-\w@:%_\+.~#?,&\/\/=]+)/g,
      );
      const urlsEmail = string.match(
        /([a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z0-9._-]+)/gi,
      );
      if (urlsHttp) {
        urlsHttp.forEach(function (url) {
          string = string.replace(
            url,
            '<a class="chat link-dark text-black" target="_blank" href="' +
              url +
              '">' +
              url +
              "</a>",
          );
        });
      }
      if (urlsEmail) {
        urlsEmail.forEach(function (url) {
          string = string.replace(
            url,
            `<a class="text-decoration text-black" cursor-pointer  href="mailto: ${url}"` +
              url +
              '">' +
              url +
              "</a>",
          );
        });
      }
      return string.replace("(", "<br/>(");
    }
    