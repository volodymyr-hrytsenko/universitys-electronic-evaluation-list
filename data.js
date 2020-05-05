function getUser() {
  var obj = {};
  var email = getUserEmail();
  if (email === "anonymous") {
    obj = {
      "role": "anonymous"
    };
  } else {
    let allUsers = getDataJsonFromFile(router.idFolderDB, router.userJsonData).users;
    obj.role = allUsers[email].role;
    obj.email = email;
    switch (allUsers[email].role) {
      case "admin_aisevlist":
        obj.role = "teacher";
        break;
        case "teacher":
          obj.role = "teacher";
          break;
      default:
        obj.role = "anonymous";
    }
  }
  return obj;
}

function getDataFromRouterLists() {
  // const elementId = "handBook";
  // const cache = CacheService.getScriptCache();
  // // let handBook = {};
  // // const cached = cache.get(elementId); //отримуємо запис про ресурс з кешу

  // if (cached != null) {
  // if (false) {
  //   handBook = JSON.parse(cached);
  //  console.log('Дані з кешу');
  // } else {
  //   handBook = getDataJsonFromFile(router.idFolderDB, router.nameJsonData);
  //   // log(handBook);
  //   // cache.put(elementId, JSON.stringify(handBook)); //кешуємо об'єкти ресурсів
  //   console.log('Дані з файлу');
  // }
  return getDataJsonFromFile(router.idFolderDB, router.nameJsonData); // handBook
}